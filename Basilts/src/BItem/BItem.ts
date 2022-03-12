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
import { AbilityBItem, BItemState } from '@Abilities/AbilityBItem';
import { BItems } from '@BItem/BItems';
import { Eventing } from '@Eventing/Eventing';

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
export type PropValue = number | number[] | string | string[] | AuthToken | Object3D;
// Properties have optional parameters that are defined by this interface.
export interface PropOptions {
    toString?: (pAbility: Ability, pPropName: string) => string,  // return property value as string
    private?: boolean        // whether property should be returned
};

// When a property value is set (setProp()), an event with this parameter
//   block is generated.
// The topicname can be fetched with bitem.setPropEventTopic(pPropName).
export interface setPropEventParams {
    BItem: BItem,
    Ability: Ability,
    PropName: string,
    NewValue: PropValue
};

export class BItem {

    // The properties that are added by the Abilities
    _props: Map<string, Ability>;
    _propOptions: Map<string, PropOptions>;
    // Flag 'true' when the BItem is being deleted
    _deleteInProgress: boolean;

    // A utility variable since lots of people do this
    get id(): string {
        return this.getProp(AbilityBItem.IdProp) as string;
    };

    constructor(pAuth: AuthToken, pLayer?: string) {
        const id = CreateUniqueId('BItem');

        this._props = new Map<string,Ability>();
        this._propOptions = new Map<string,PropOptions>();

        // Add the base properties to this BItem
        this.addAbility(new AbilityBItem(id, pAuth, pLayer));

        this._deleteInProgress = false;

        this.setProp(AbilityBItem.IdProp, id);
        this.setProp(AbilityBItem.StateProp, BItemState.UNINITIALIZED);

        // As a side effect, add this BItem to the collection of BItems
        BItems.add(id, this);
    };
    // Common interface for getting the value of any property an Ability has added to the BItem
    getProp(pPropName: string): PropValue {
        // Logger.debug(`Getting property ${pPropName}`);
        if (this._props.has(pPropName)) {
            const abil = this._props.get(pPropName);
            // @ts-ignore
            return abil[pPropName] as PropValue;
        }
        else {
            Logger.error(`BItem.getProp: attempt to fetch unregistered property ${pPropName}`);
        };
        return undefined;
    };
    // Common interface for setting the value of any property an Ability has added to the BItem
    setProp(pPropName: string, pVal: PropValue): void {
        // Logger.debug(`Setting property ${pPropName} = ${pVal}`);
        if (this._props.has(pPropName)) {
            const abil = this._props.get(pPropName);
            // @ts-ignore
            abil[pPropName] = pVal;
            // Tell anyone listening that this property has changed.
            void Eventing.Fire(this.setPropEventTopicName(pPropName), {
                BItem: this,
                Ability: abil,
                PropName: pPropName,
                NewValue: pVal
            });
        };
    };
    // return the topic name of the event generated when a particular property is set
    setPropEventTopicName(pPropName: string): string {
        return pPropName + '.' + this.id;
    };
    // Increment the value of a named property
    incrementProp(pPropName: string) : PropValue {
        // Logger.debug(`incrementProp ${pPropName}`);
        if (this._props.has(pPropName)) {
            const abil = this._props.get(pPropName);
            // @ts-ignore
            let val = (abil[pPropName] as number) + 1;
            // @ts-ignore
            abil[pPropName] = val;
            void Eventing.Fire(this.setPropEventTopicName(pPropName), {
                BItem: this,
                Ability: abil,
                PropName: pPropName,
                NewValue: val
            });
            return val as PropValue;
        };
        return 0;
    };
    // Add a named property to the BItem.
    // Used by Abilities added to the BItem to make their properties visible
    addProperty(pPropName: string, pAbility: Ability, pPropOptions?: PropOptions): void {
        this._props.set(pPropName, pAbility);
        if (pPropOptions) {
            this._propOptions.set(pPropName, pPropOptions);
        };
    };
    // Remove a property that was added to the BItem
    removeProperty(pPropName: string): void {
        if (this._props.has(pPropName)) {
            this._props.get(pPropName).propertyBeingRemoved(this, pPropName);
            this._props.delete(pPropName);
            this._propOptions.delete(pPropName);
        };
    };
    // Return a collection of the public properties of the BItem
    // Returned is of the form: { name: value, ... }
    getProperties(pFilter: string): BKeyedCollection {
        const ret: BKeyedCollection = {};
        this._props.forEach( (abil: Ability, propName: string) => {
            let priv = false;
            if (this._propOptions.has(propName)) {
                const propOptions = this._propOptions.get(propName);
                priv = propOptions.private;
            };
            if (!priv) {
                ret[propName] = this.getProp(propName);
            }
        });
        return ret;
    };

    // Add an Ability to this BItem
    // This adds the Ability to the Ability collection and calls the Abilitie's
    //      "addProperties" function to add it's properties to this BItem
    addAbility(pAbility: Ability): void {
        pAbility.addProperties(this);
    };
    // Remove the named ability
    removeAbility(pAbilityName: string): void {
        this._props.forEach( (abil: Ability, propName: string) => {
            if (pAbilityName === abil.abilityName) {
                this.removeProperty(propName);
            };
        });
    };
    // Return the current state of the BItem
    getState(): BItemState {
        return this.getProp(AbilityBItem.StateProp) as BItemState;
    }
    // Return TRUE if the BItem state is READY
    isReady(): boolean {
        return this.getState() === BItemState.READY;
    }
    // Set the BItem state to READY
    setReady(): void {
        this.setProp(AbilityBItem.StateProp, BItemState.READY);
    };
    // Set the BItem state to FAILED
    setFailed(): void {
        this.setProp(AbilityBItem.StateProp, BItemState.FAILED);
    };
    // Set the BItem state to LOADING
    setLoading(): void {
        this.setProp(AbilityBItem.StateProp, BItemState.LOADING);
    };
    // Set the BItem state to SHUTDOWN
    setShutdown(): void {
        this.setProp(AbilityBItem.StateProp, BItemState.SHUTDOWN);
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
        this._props.forEach( (abil, key) => {
            Logger.debug(`     ${key}: ${this.getProp(key)}`);
        });
    };
};
