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
import { AbBItem, BItemState } from '@Abilities/AbilityBItem';

import { BItems } from '@BItem/BItems';
import { Object3D } from '@Base/Graphics/Object3d';
import { BasilConnection } from '@Comm/BasilConnection';
import { Eventing } from '@Eventing/Eventing';
import { EventProcessor, SubscriptionEntry } from '@Eventing/SubscriptionEntry';

import { AuthToken } from '@Tools/Auth';

import { CreateUniqueId, JSONstringify } from '@Tools/Utilities';
import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Tools/Logging';

// BItem class is the base of all the items in the system.
// A BItem get ALL it's functionality fron the Abilities that are added to it.
// This base class is mostly concerned with presenting a common interface
//     to anyone accessing the BItem: common access to Abilities and their named
//     properties.

// A property entry has either getter/setters to access the property value or
//    it has just a 'value' entry. Calling getProp() or setProp() uses what
//    is defined for that property.
export type PropValue = number | number[] | string | string[] | boolean | AuthToken | Object3D;
export enum PropValueTypes {
    Number = 'number',
    NumberArray = 'number[]',
    NumberTriple = 'numberTriple',
    NumberQuad = 'numberQuad',
    String = 'string',
    StringArray = 'string[]',
    Boolean = 'boolean',
    AuthToken = 'AuthToken',
    Object = 'Object',              // generic object used for internal values
    Object3D = 'Object3D'
};
// Properties have optional parameters that are defined by this interface.
export interface PropOptions {
    toString?: (pAbility: Ability, pPropName: string) => string,  // return property value as string
    private?: boolean        // whether property should be returned
};

// When a property value is set (setProp()), an event with this parameter
//   block is generated.
// The topicname can be fetched with bitem.setPropEventTopic(pPropName).
export interface SetPropEventParams {
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
    private _deleteInProgress: boolean;

    // A utility variable since lots of people do this
    public get id(): string {
        return this.getProp(AbBItem.IdProp) as string;
    };
    // This BItem keeps a reference to the Ability that give it the
    //     BItem properties. This makes for easier reference to same.
    private _bItemAbility: AbBItem;
    public get bItemAbility(): AbBItem {
        return this._bItemAbility;
    }
    // Return the connection that was use to create this BItem
    // Useful for sending update messages the the SpaceServer
    public get conn(): BasilConnection {
        if (this._bItemAbility) {
            return this._bItemAbility.getProp(AbBItem.CreatingConnection) as unknown as BasilConnection;
        }
        return undefined;
    }

    constructor(pId: string, pAuth: AuthToken, pLayer?: string, pCreatingConnection?: BasilConnection) {
        const id = pId ?? CreateUniqueId('BItem');

        this._props = new Map<string,Ability>();
        this._propOptions = new Map<string,PropOptions>();

        // Add the base properties to this BItem
        this._bItemAbility = new AbBItem(id, pAuth, pLayer, pCreatingConnection);
        this.addAbility(this._bItemAbility);

        this._deleteInProgress = false;

        // As a side effect, add this BItem to the collection of BItems
        BItems.add(id, this);
    };

    // When a BItem is being deleted/removed, it is removed from the collection
    //    of BItems and then this function is called to remove it's properties
    //    and otherwise disconnect it from the rest of the system.
    releaseBItem(): void {
        this._deleteInProgress = true;
        // Remove all the properties. This alerts any abilities that they are being removed.
        const props = this._props.keys();
        Logger.debug(`BItem.releaseBItem: releasing properties for ${this.id}`);
        for (const prop of props) {
            this.removeProperty(prop);
        };
    };

    // =========================================================================
    // Common interface for getting the value of any property an Ability has added to the BItem
    getProp(pPropName: string): PropValue {
        // Logger.debug(`Getting property ${pPropName}`);
        const abil = this._props.get(pPropName);
        if (abil) {
            return abil.getProp(pPropName);
        }
        else {
            Logger.error(`BItem.getProp: attempt to fetch unregistered property ${pPropName}`);
        };
        return undefined;
    };
    // Common interface for setting the value of any property on an Ability added to the BItem
    // Note optional parameter 'pActuallySetProp' which can be used to generate event without
    //      actually setting the property value which might have side effects.
    setProp(pPropName: string, pVal: PropValue, pActuallySetProp = true): void {
        Logger.cdebug('SetProp', `id=${this.id}, Setting property ${pPropName} = ${pVal}`);
        const abil = this._props.get(pPropName);
        if (abil) {
            if (pActuallySetProp) {
                abil.setProp(pPropName, pVal);
            }
            // Tell anyone listening that this property has changed.
            // Logger.debug(`BItem.setProp: firing event ${this.getPropEventTopicName(pPropName)}`);
            // Event name is "<propname>.<BItem.id>"
            void Eventing.Fire(this.getPropEventTopicName(pPropName), {
                BItem: this,
                Ability: abil,
                PropName: pPropName,
                NewValue: pVal
            });
        };
    };
    // return the topic name of the event generated when a particular property is set
    getPropEventTopicName(pPropName: string): string {
        return pPropName + '.' + this.id;
    };
    // helper function that subscribes to a specific property on this BItem
    // Note that this fires an initial "changed" event so the caller gets current value
    watchProperty(pPropName: string, pWatcher: EventProcessor): SubscriptionEntry {
        const sub = Eventing.Subscribe(this.getPropEventTopicName(pPropName), pWatcher);
        // If the property is already defined, fire an initial watch event
        if (this._props.has(pPropName)) {
            // don't actually set the property, just fire the event
            this.setProp(pPropName, this.getProp(pPropName), false);
        };
        return sub;
    };
    // helper function for above to hide that it's an Eventing subscription
    unWatchProperty(pSub: SubscriptionEntry): void {
        if (pSub) Eventing.Unsubscribe(pSub);
    };
    // Increment the value of a named property
    incrementProp(pPropName: string) : number {
        // Logger.debug(`incrementProp ${pPropName}`);
        const abil = this._props.get(pPropName);
        if (abil) {
            let val = abil.getProp(pPropName);
            if (typeof val === 'number') {
                val = val + 1;
                this.setProp(pPropName, val);
                return val;
            };
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
        }
        else {
            Logger.error(`BItem.removeProperty: unknown property: ${pPropName} in ${this.id}`);
        };
    };
    // Return a collection of the public properties of the BItem
    // Returned is of the form: { name: value, ... }
    getProperties(pFilter: string): BKeyedCollection {
        const ret: BKeyedCollection = {};
        let notFiltering = true;
        let filter: RegExp;
        if (pFilter) {
            try {   // user can pass anything so do some safety
                filter = new RegExp(pFilter);
                notFiltering = false;
            }
            catch {
                filter = undefined;
                notFiltering = true;
            }
        }
        this._props.forEach( (abil: Ability, propName: string) => {
            let priv = false;
            if (notFiltering || filter.test(propName)) {
                if (this._propOptions.has(propName)) {
                    const propOptions = this._propOptions.get(propName);
                    priv = propOptions.private ?? false;
                };
                if (!priv) {
                    ret[propName] = this.getProp(propName);
                }
            }
        });
        return ret;
    };

    // When the BItem is created or multiple properties are updated, this is called
    //    so any delayed operation can be done
    updateComplete(): void {
        this.getAbilities().forEach( abil => {
            abil.updateComplete(this);
        });
    }

    // =========================================================================
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
    // Return the ability instance on this BITem with the passed name
    getAbility(pAbilityName: string): Ability {
        let ret: Ability = null;
        this._props.forEach( (abil: Ability, propName: string) => {
            if (pAbilityName === abil.abilityName) {
                ret = abil;
            }
        });
        return ret;
    };
    // Return all the abilities on this BItem
    // TODO: figure out if keeping a list rather than recomputing the list is better
    getAbilities(): Ability[] {
        const abils: Ability[] = [];
        this._props.forEach( (abil: Ability, propName: string) => {
            if (! abils.includes(abil)) {
                abils.push(abil);
            }
        });

        return abils;
    }

    // =========================================================================
    // Return the current state of the BItem
    getState(): BItemState {
        return this.getProp(AbBItem.StateProp) as BItemState;
    };
    // Return TRUE if the BItem state is READY
    isReady(): boolean {
        return this.getState() === BItemState.READY;
    };
    // Set the BItem state to READY
    setReady(): void {
        this.setProp(AbBItem.StateProp, BItemState.READY);
    };
    // Set the BItem state to FAILED
    setFailed(): void {
        this.setProp(AbBItem.StateProp, BItemState.FAILED);
    };
    // Set the BItem state to LOADING
    setLoading(): void {
        this.setProp(AbBItem.StateProp, BItemState.LOADING);
    };
    // Set the BItem state to SHUTDOWN
    setShutdown(): void {
        this.setProp(AbBItem.StateProp, BItemState.SHUTDOWN);
    };

    // =========================================================================
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
        const checkInterval = Config.assets?.assetFetchCheckIntervalMS ?? 200;
        let timeout = pTimeoutMS ?? Config.assets?.assetFetchTimeoutMS ?? 5000;
        while (this.getState() !== BItemState.READY) {
            if (this.NeverGonnaBeReady()) {
                throw this;
            }
            if (timeout <= 0) {
                Logger.error(`BItem.WhenReady: Reject timeout. id=${this.id}`);
                throw this;
            }
            await this.WaitABit(checkInterval);
            timeout -= checkInterval;
        }
        return this;
    };
    // A small routine that returns a Promise that is resolved in 'ms' milliseconds.
    // Only used locally for WhenReady()
    async WaitABit(ms: number): Promise<BItem> {
        return new Promise( (resolve) => { setTimeout(resolve, ms); } );
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
