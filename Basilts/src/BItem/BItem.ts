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

import { Object3D } from 'three';

import { Ability } from '@Abilities/Ability';
import { AbilityBItem, BItemState, AbilityBItemProps } from '@Abilities/AbilityBItem';
import { BItems } from '@BItem/BItems';

import { AuthToken } from '@Tools/Auth';

import { CreateUniqueId, ExtractStringError } from '@Base/Tools/Utilities';
import { BKeyedCollection } from '@Base/Tools/bTypes';
import { Logger } from '@Base/Tools/Logging';

// BItem class is the base of all the items in the system.
// A BItem get ALL it's functionality fron the Abilities that are added to it.
// This base class is mostly concerned with presenting a common interface
//     to anyone accessing the BItem: common access to Abilities and their named
//     properties.

// A property entry has either getter/setters to access the property value or
//    it has just a 'value' entry. Calling getProp() or setProp() uses what
//    is defined for that property.
export type PropValue = number | number[] | string | AuthToken | Object3D;
export type getterFunction = (pDfd: PropEntry, pD: BItem) => PropValue;
export type setterFunction = (pDfd: PropEntry, pD: BItem, pV: PropValue) => void;
export interface PropEntry {
    name: string,               // the property name used to lookup and reference
    getter?: getterFunction,    // option function to call to get value
    setter?: setterFunction,    // option function to call to set value
    ability: Ability,           // the ability associated with this property
    public?: boolean             // whether property should be returned
};

export class BItem {

    // The properties that are added by the Abilities
    _props: Map<string, PropEntry>;
    // The abilities that are active on this BItem
    _abilities: Map<string, Ability>;
    // Flag 'true' when the BItem is being deleted
    _deleteInProgress: boolean;

    // A utility variable since lots of people do this
    get id(): string {
        return AbilityBItemProps.getId(this);
    };

    constructor(pAuth: AuthToken, pLayer?: string) {
        const id = CreateUniqueId('BItem');

        this._props = new Map<string,PropEntry>();
        this._abilities = new Map<string,Ability>();

        // Add the base properties to this BItem
        this.addAbility(new AbilityBItem(id, pAuth, pLayer));

        this._deleteInProgress = false;

        AbilityBItemProps.setId(this, id);
        AbilityBItemProps.setState(this, BItemState.UNINITIALIZED);

        // As a side effect, add this BItem to the collection of BItems
        BItems.add(id, this);
    };
    // Common interface for getting the value of any property an Ability has added to the BItem
    getProp(pPropName: string): PropValue {
        // Logger.debug(`Getting property ${pPropName}`);
        const prop = this._props.get(pPropName);
        let propValue: PropValue;
        if (typeof(prop) != 'undefined') {
            if (prop.getter) {
                propValue = prop.getter(prop, this);
                // Logger.debug(`getProp: returning ${pPropName}=${propValue}`);
            }
            else {
                propValue = undefined;
                // Logger.debug(`getProp: returning ${pPropName}=undefined`);
            };
        };
        // If the property is returning a BItem, actually return the ID of the BItem
        // This is used ?? TODO
        if (typeof(propValue) === 'object') {
            if (propValue instanceof BItem) {
                propValue = propValue.id;
                // Logger.debug(`getProp: returning BItem so returning id=${propValue}`);
            };
        };
        return propValue;
    };
    // Common interface for setting the value of any property an Ability has added to the BItem
    setProp(pPropName: string, pVal: PropValue): boolean {  // 'true' if the set worked
        // Logger.debug(`Setting property ${pPropName} = ${pVal}`);
        let ret = false;
        const prop = this._props.get(pPropName);
        if (typeof(prop) != 'undefined') {
            if (prop.setter) {
                try {
                    prop.setter(prop, this, pVal);
                    ret = true;
                }
                catch ( e ) {
                    Logger.error(`BItem.setProp: exception setting ${prop.name}=${pVal}: ${ExtractStringError(e)}`);
                };
            };
        };
        return ret;
    };
    // Increment the value of a named property
    incrementProp(pPropName: string) : PropValue {
        // Logger.debug(`incrementProp ${pPropName}`);
        let val = this.getProp(pPropName);
        if (typeof(val) != 'undefined') {
            if (typeof(val) === 'string') {
                val = parseInt(val) + 1;
                // Logger.debug(`incrementProp: increment string ${pPropName}=${val}`);
            }
            else {
                (val as number)++;
                // Logger.debug(`incrementProp: increment number ${pPropName}=${val}`);
            }
            this.setProp(pPropName, val);
        };
        return val;
    };
    // Add a named property to the BItem.
    // Used by Abilities added to the BItem to make their properties visible
    addProperty(pPropEntry: PropEntry): PropEntry {
        // Logger.debug(`Adding property ${pPropEntry.name} = ${pPropEntry.getter(pPropEntry, this)}`);
        this._props.set(pPropEntry.name, pPropEntry);
        return pPropEntry;
    };
    // Remove a property that was added to the BItem
    removeProperty(pPropEntry: PropEntry): void {
        this._props.delete(pPropEntry.name);
    };
    // Return a collection of the public properties of the BItem
    // Returned is of the form: { name: value, ... }
    getProperties(pFilter: string): BKeyedCollection {
        const ret: BKeyedCollection = {};
        this._props.forEach( (pPropEntry: PropEntry) => {
            if (pPropEntry.public) {
                ret[pPropEntry.name] = pPropEntry.getter ? pPropEntry.getter(pPropEntry, this) : undefined;
            }
        });
        return ret;
    };

    // Add an Ability to this BItem
    // This adds the Ability to the Ability collection and calls the Abilitie's
    //      "addProperties" function to add it's properties to this BItem
    addAbility(pAbility: Ability): void {
        if (!this._abilities.has(pAbility.name)) {
            this._abilities.set(pAbility.name, pAbility);
            pAbility.addProperties(this);
            // Logger.debug(`Adding Ability ${pAbility.name} to ${this.id}`);
        }
        else {
            Logger.error(`BItem.addAbility: adding two of same type: ${pAbility.name}, BItem=${this.id}`);
        };
    };
    // Remove the named ability
    removeAbility(pAbilityName: string): void {
        this._abilities.delete(pAbilityName);
    };
    // Return the current state of the BItem
    getState(): BItemState {
        return AbilityBItemProps.getState(this);
    }
    // Return TRUE if the BItem state is READY
    isReady(): boolean {
        return AbilityBItemProps.getState(this) === BItemState.READY;
    }
    // Set the BItem state to READY
    setReady(): void {
        AbilityBItemProps.setState(this, BItemState.READY);
    };
    // Set the BItem state to FAILED
    setFailed(): void {
        AbilityBItemProps.setState(this, BItemState.FAILED);
    };
    // Set the BItem state to LOADING
    setLoading(): void {
        AbilityBItemProps.setState(this, BItemState.LOADING);
    };
    // Set the BItem state to SHUTDOWN
    setShutdown(): void {
        AbilityBItemProps.setState(this, BItemState.SHUTDOWN);
    };
    // Return a Promise that is resolved when item status is READY.
    // Promise will be rejected if timeout interval.
    // If the item is deleted while waiting, this Promise is rejected.
    // Note that this promise returns this item for both the resolve and reject
    // TODO: this is a kludge routine using polling. Use state change
    //    events when they exist.
    // TODO: a debug option that keeps a list of what is being waited for.
    //    Would make a useful display when things are slow/hung.
    async WhenReady(pTimeoutMS?: number): Promise<BItem> {
        // Logger.debug(`BItem.WhenReady: Entry. Current state=${this.getState()}. id=${this.id}`);
        if (this.getState() === BItemState.READY) {
            // Logger.debug(`BItem.WhenReady: READY.id=${this.id}`);
            return this;
        }
        else {
            if (this.NeverGonnaBeReady()) {
                throw this;
            }
            else {
                const checkInterval = Config.assets?.assetFetchCheckIntervalMS ?? 200;
                const timeout = pTimeoutMS ?? Config.assets?.assetFetchTimeoutMS ?? 5000;
                if (timeout <= 0) {
                    Logger.error(`BItem.WhenReady: Reject timeout. id=${this.id}`);
                    throw this;
                }
                else {
                    // Wait for 'checkInterval' and test again for 'READY'.
                    // Logger.debug(`BItem.WhenReady: not ready. Waiting ${checkInterval} with timeout ${timeout}. id=${this.id}`);
                    const xitem = await this.WaitABit(checkInterval, this);
                    // After waiting, recursively call WhenReady to either keep waiting or return success
                    const yitem = await xitem.WhenReady(timeout - checkInterval)
                        .catch( err => {
                            throw err;
                        });
                    return yitem;
                };
            };
        };
    };
    // A small routine that returns a Promise that is resolved in 'ms' milliseconds.
    // Only used locally for WhenReady()
    async WaitABit(ms: number, pParam: BItem): Promise<BItem> {
        return new Promise( (resolve) => { setTimeout(resolve, ms, pParam); } );
    };
    // Return 'true' if something is wrong with this BItem and it will never go READY.
    // Only used locally for WhenReady()
    NeverGonnaBeReady(): boolean {
        const currentState = this.getState();
        return this._deleteInProgress
                || currentState == BItemState.FAILED
                || currentState == BItemState.SHUTDOWN;
    };
    // Debug function to list all of the BItem's properties in the log output
    DumpProps(): void {
        Logger.debug('=== Dumping Props');
        this._props.forEach( (val, key) => {
            Logger.debug(`     ${key}: ${val.getter(val, this)}`);
        });
    };
};
