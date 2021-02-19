// Copyright 2021 Robert Adams
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

import { Config } from '@Base/Config';

import { Ability } from '@Abilities/Ability';
import { AbilityBItem, BItemState, StateProp } from '@Abilities/AbilityBItem';

import { AuthToken } from '@Tools/Auth';

// A property entry has either getter/setters to access the property value or
//    it has just a 'value' entry. Calling getProp() or setProp() uses what
//    is defined for that property.
export type getterFunction = (pDfd: PropEntry, pD: BItem) => Promise<any>;
export type setterFunction = (pDfd: PropEntry, pD: BItem, pV: any) => Promise<void>;
export interface PropEntry {
    name: string,
    value?: any,
    getter?: getterFunction,
    setter?: setterFunction,
    ability: Ability
};

// All the BItems that have been created
export let BItemCollection: Map<string, BItem> = new Map<string,BItem>();

export let BItems = {
    // Add BItem to the collection of BItems
    add: (pId: string, pBItem: BItem): BItem => {
        BItemCollection.set(pId, pBItem);
        return pBItem;
    },
    remove: async (pBItem: BItem): Promise<void> => {
        let id = await pBItem.getProp('id');
        BItemCollection.delete(id);
    },
    removeById: (pId: string): void => {
        BItemCollection.delete(pId);
    },
    get: (pId: string): BItem => {
        return BItemCollection.get(pId);
    }
};

export abstract class BItem {

    _props: Map<string, PropEntry>;
    _abilities: Map<string, Ability>;
    _deleteInProgress: boolean;

    constructor(pId: string, pAuth: AuthToken, pLayer: string) {
        this._props = new Map<string,PropEntry>();

        // Add the base properties to this BItem
        this.addAbility(new AbilityBItem(pId, pAuth, pLayer));

        this._deleteInProgress = false;

        this.setProp(StateProp, BItemState.UNINITIALIZED)

        // As a side effect, add this BItem to the collection of BItems
        BItems.add(pId, this);
    };
    async getProp(pPropName: string): Promise<any> {
        const prop = this._props.get(pPropName);
        if (prop) {
            if (prop.getter) {
                return prop.getter(prop, this);
            }
            else {
                return prop.value;
            };
        };
        return undefined;
    };
    // If the caller knows the property is only a value, it
    //    can be fetched without doing the await.
    getPropValue(pPropName: string): any {
        const prop = this._props.get(pPropName);
        if (prop) {
            if (prop.getter) {
                return undefined;
            }
            else {
                return prop.value;
            };
        };
        return undefined;
    };
    async setProp(pPropName: string, pVal: any): Promise<void> {
        const prop = this._props.get(pPropName);
        if (prop) {
            if (prop.setter) {
                return prop.setter(prop, this, pVal);
            }
            else {
                prop.value = pVal;
            };
        };
        return;
    };
    async incrementProp(pPropName: string) : Promise<number> {
        const prop = this._props.get(pPropName);
        if (prop && prop.getter && prop.setter) {
            const val = await prop.getter(prop, this) + 1;
            await prop.setter(prop, this, val);
            return val;
        };
        prop.value += 1;
        return prop.value;
    };
    addProperty(pPropEntry: PropEntry) {
        this._props.set(pPropEntry.name, pPropEntry);
    };
    removeProperty(pPropEntry: PropEntry) {
        this._props.delete(pPropEntry.name);
    };
    addAbility(pAbility: Ability) {
        this._abilities.set(pAbility.name, pAbility);
        pAbility.addProperties(this);
    };
    removeAbility(pAbility: Ability) {
        this._abilities.delete(pAbility.name);
    };
    getState(): BItemState {
        return this.getPropValue(StateProp);
    }
    isReady(): boolean {
        return this.getPropValue(StateProp) === BItemState.READY;
    }
    setReady(): void {
        this.setProp('state', BItemState.READY)
    };
    setFailed(): void {
        this.setProp('state', BItemState.FAILED)
    };
    setLoading(): void {
        this.setProp('state', BItemState.LOADING)
    };
    setShutdown(): void {
        this.setProp('state', BItemState.SHUTDOWN)
    };
    // Return a Promise that is resolved when item status is READY.
    // Promise will be rejected if timeout interval.
    // If the item is deleted while waiting, this Promise is rejected.
    // Note that this promise returns this item for both the resolve and reject
    // TODO: this is a kludge routine using polling. Use state change
    //    events when they existw
    // TODO: a debug option that keeps a list of what is being waited for.
    //    Would make a useful display when things are slow/hung.
    async WhenReady(timeoutMS: number): Promise<BItem> {
        return new Promise( (resolve, reject) => {
            if ((this.getState() === BItemState.READY) {
                // GP.DebugLog('BItem.WhenReady: READY.id=' + this.id);
                resolve(this);
            }
            else {
                if (this.NeverGonnaBeReady()) {
                    reject(this);
                }
                else {
                    let checkInterval = 200;
                    if (Config.assets && Config.assets.assetFetchCheckIntervalMS) {
                        checkInterval = Number(Config.assets.assetFetchCheckIntervalMS);
                    };
                    let maxCheckInterval = 1000;
                    if (Config.assets && Config.assets.assetFetchCheckIntervalMaxMS) {
                        maxCheckInterval = Number(Config.assets.assetFetchCheckIntervalMaxMS);
                    };
                    let timeout = 5000;
                    if (Config.assets && Config.assets.assetFetchTimeoutMS) {
                        timeout = Number(Config.assets.assetFetchTimeoutMS);
                    };
                    if (timeoutMS) {  // use the passed timeout if specified
                        timeout = timeoutMS;
                    };
                    if (timeout <= 0) {
                        // GP.DebugLog('BItem.WhenReady: reject timeout. id=' + this.id);
                        reject(this);
                    }
                    else {
                        // Wait for 'checkInterval' and test again for 'READY'.
                        // GP.DebugLog('BItem.WhenReady: not ready. Waiting ' + checkInterval
                        //             + ' with timeout ' + timeout
                        //             + ', id=' + this.id);
                        BItem.WaitABit(checkInterval, this)
                        .then( xitem => {
                            checkInterval += checkInterval;
                            if (checkInterval > maxCheckInterval) checkInterval = maxCheckInterval;
                            timeout = timeout - checkInterval;
                            xitem.WhenReady(timeout)
                            .then( yitem => {
                                // GP.DebugLog('BItem.WhenReady: READY. id=' + yitem.id);
                                resolve(yitem);
                            })
                            .catch( zitem => {
                                // GP.DebugLog('BItem.WhenReady: NOT READY. id=' + zitem.id);
                                reject(zitem);
                            });
                        });
                    };
                };
            };
        } );
    };
    // A small routine that returns a Promise that is resolved in 'ms' milliseconds.
    static async WaitABit(ms: number, pParam: BItem): Promise<BItem> {
        return new Promise( resolver => { setTimeout(resolver, ms, pParam); } );
    };
    // Return 'true' if something is wrong with this BItem and it will never go READY.
    NeverGonnaBeReady(): boolean {
        let currentState = this.getState();
        return this._deleteInProgress
                || currentState == BItemState.FAILED
                || currentState == BItemState.SHUTDOWN;
    };

};
