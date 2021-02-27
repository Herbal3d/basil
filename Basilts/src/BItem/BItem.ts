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
import { AbilityBItem, BItemState, IdProp, StateProp } from '@Abilities/AbilityBItem';

import { AuthToken } from '@Tools/Auth';
import { BKeyedCollection } from '@Base/Tools/bTypes';
import { AbilityFactory } from '@Abilities/AbilityManagement';

import { ExtractStringError } from '@Tools/Utilities';

import { Logger } from '@Base/Tools/Logging';

// A property entry has either getter/setters to access the property value or
//    it has just a 'value' entry. Calling getProp() or setProp() uses what
//    is defined for that property.
export type PropValue = number | string | AuthToken;
export type getterFunction = (pDfd: PropEntry, pD: BItem) => PropValue;
export type setterFunction = (pDfd: PropEntry, pD: BItem, pV: PropValue) => void;
export interface PropEntry {
    name: string,
    value?: PropValue,
    getter?: getterFunction,
    setter?: setterFunction,
    ability: Ability
};

export const BItemIdProp = 'bitem.id';
export const BItemAuthProp = 'ItemAuthToken';
export const BItemLayerProp = 'Layer';
export const BItemInitialAbilityProp = 'InitialAbilties';

// All the BItems that have been created
export const BItemCollection: Map<string, BItem> = new Map<string,BItem>();

export const BItems = {
    // Create a BItem from a property object.
    // This looks for properties 'BItem*Prop' but any abilities created will look for their own.
    // Throws a string error if there are any problems.
    createFromProps: (pProps: BKeyedCollection): BItem => {
        const newBItem = new BItem( pProps[BItemIdProp], pProps[BItemAuthProp], pProps[BItemLayerProp]);

        // Add any Abilities that are asked for
        let err: string;
        try {
            if (pProps.hasOwnProperty(BItemInitialAbilityProp)) {
                const initialAbils = pProps[BItemInitialAbilityProp];
                if (typeof(initialAbils) === 'string') {
                    const abils = initialAbils.split(',');
                    for (const abil of abils) {
                        const newAbility = AbilityFactory(abil, pProps);
                        if (newAbility) {
                            newBItem.addAbility(newAbility);
                        }
                        else {
                            err = `BItems.createFromProps: could not create ability ${abil}`;
                        };
                    };
                };
            };
        }
        catch (e) {
            err = `BItems.createFromProps: exception creating BItem: ${ExtractStringError(e)}`;
        };
        if (err) {
            throw err;
        };
        return newBItem;
    },
    // Add BItem to the collection of BItems
    add: (pId: string, pBItem: BItem): BItem => {
        BItemCollection.set(pId, pBItem);
        return pBItem;
    },
    remove: async (pBItem: BItem): Promise<void> => {
        const id = (pBItem.getProp('id') as string);
        BItemCollection.delete(id);
    },
    removeById: (pId: string): void => {
        BItemCollection.delete(pId);
    },
    get: (pId: string): BItem => {
        return BItemCollection.get(pId);
    }
};

export class BItem {

    _props: Map<string, PropEntry>;
    _abilities: Map<string, Ability>;
    _deleteInProgress: boolean;

    constructor(pId: string, pAuth: AuthToken, pLayer: string) {
        this._props = new Map<string,PropEntry>();
        this._abilities = new Map<string,Ability>();

        // Add the base properties to this BItem
        this.addAbility(new AbilityBItem(pId, pAuth, pLayer));

        this._deleteInProgress = false;

        this.setProp(StateProp, BItemState.UNINITIALIZED)

        // As a side effect, add this BItem to the collection of BItems
        BItems.add(pId, this);
    };
    getProp(pPropName: string): PropValue {
        const prop = this._props.get(pPropName);
        let propValue: PropValue;
        if (prop) {
            if (prop.getter) {
                propValue = prop.getter(prop, this);
            }
            else {
                propValue = prop.value;
            };
        };
        // Clean up the return value if it is not a simple value
        if (typeof(propValue) === 'object') {
            if (propValue instanceof BItem) {
                propValue = propValue.getProp(IdProp);
            };
        };
        return propValue;
    };
    setProp(pPropName: string, pVal: PropValue): void {
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
    incrementProp(pPropName: string) : PropValue {
        let val = this.getProp(pPropName);
        if (val) {
            if (typeof(val) === 'string') {
                val = parseInt(val) + 1;
            }
            else {
                (val as number)++;
            }
            this.setProp(pPropName, val);
        };
        return val;
    };
    addProperty(pPropEntry: PropEntry): void {
        this._props.set(pPropEntry.name, pPropEntry);
    };
    removeProperty(pPropEntry: PropEntry): void {
        this._props.delete(pPropEntry.name);
    };
    addAbility(pAbility: Ability): void {
        this._abilities.set(pAbility.name, pAbility);
        pAbility.addProperties(this);
    };
    removeAbility(pAbility: Ability): void {
        this._abilities.delete(pAbility.name);
    };
    getState(): BItemState {
        return (this.getProp(StateProp) as BItemState);
    }
    isReady(): boolean {
        return this.getProp(StateProp) === BItemState.READY;
    }
    setReady(): void {
        void this.setProp('state', BItemState.READY)
    };
    setFailed(): void {
        void this.setProp('state', BItemState.FAILED)
    };
    setLoading(): void {
        void this.setProp('state', BItemState.LOADING)
    };
    setShutdown(): void {
        void this.setProp('state', BItemState.SHUTDOWN)
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
        if (this.getState() === BItemState.READY) {
            // GP.DebugLog('BItem.WhenReady: READY.id=' + this.id);
            return this;
        }
        else {
            if (this.NeverGonnaBeReady()) {
                throw this;
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
                    throw this;
                }
                else {
                    // Wait for 'checkInterval' and test again for 'READY'.
                    // GP.DebugLog('BItem.WhenReady: not ready. Waiting ' + checkInterval
                    //             + ' with timeout ' + timeout
                    //             + ', id=' + this.id);
                    const xitem = await this.WaitABit(checkInterval, this);
                    checkInterval += checkInterval;
                    if (checkInterval > maxCheckInterval) checkInterval = maxCheckInterval;
                    timeout = timeout - checkInterval;
                    const yitem = await xitem.WhenReady(timeout)
                        .catch( err => {
                            throw err;
                        });
                    return yitem;
                };
            };
        };
    };
    // A small routine that returns a Promise that is resolved in 'ms' milliseconds.
    async WaitABit(ms: number, pParam: BItem): Promise<BItem> {
        return new Promise( (resolve) => { setTimeout(resolve, ms, pParam); } );
    };
    // Return 'true' if something is wrong with this BItem and it will never go READY.
    NeverGonnaBeReady(): boolean {
        const currentState = this.getState();
        return this._deleteInProgress
                || currentState == BItemState.FAILED
                || currentState == BItemState.SHUTDOWN;
    };

};
