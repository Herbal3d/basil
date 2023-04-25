// Copyright 2022 Robert Adams
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

import { BItem, PropValue, PropValueTypes } from "@BItem/BItem";
import { AuthToken } from "@Tools/Auth";

import { BKeyedCollection } from '@Tools/bTypes';
import { ParseNumArray, ParseStringArray, ParseThreeTuple, ParseFourTuple } from "@Tools/Utilities";
import { Logger } from '@Tools/Logging';

export type AbilityPropValidator = (pAbil: Ability, pPropName: string, pVal: PropValue) => boolean;
export type AbilityPropGetter = (pAbil: Ability, pPropName: string) => PropValue;
export type AbilityPropSetter = (pAbil: Ability, pPropName: string, pVal: PropValue) => void
export interface AbilityPropDefn {
    propName: string;
    propType: PropValueTypes;
    propDefault: PropValue;
    propDesc: string;
    propValidator?: AbilityPropValidator;
    propGetter: AbilityPropGetter;
    propSetter: AbilityPropSetter;
    private?: boolean;
};
// Map of property names to the property definition
// This is defined by each ability and is used to decorate the class instance
export type AbilityPropDefns = { [key: string]: AbilityPropDefn };

export function PropDefaultValidator(pAbil: Ability, pPropName: string, pVal: PropValue): boolean { return true; }

// Get the value.
// Presume that the value has been cooerced to the correct type.
// Return null if the property is not defined.
export function PropDefaultGetter(pAbil: Ability, pPropName: string): PropValue {
    const propDefn = pAbil.propDefns[pPropName];
    if (propDefn) {
        const rawVal = pAbil.propValues[pPropName];
        if (rawVal !== undefined) {
            return rawVal;
        }
    }
    return null;
}
// Set the value.
// Convert the passed PropValue into the correct type.
export function PropDefaultSetter(pAbil: Ability, pPropName: string, pVal: PropValue): void {
    const propDefn = pAbil.propDefns[pPropName];
    if (propDefn) {
        pAbil.propValues[pPropName] = ParseValueToType(propDefn.propType, pVal);
    }
    return;
}

// Setter for values that cannot be set.
export function PropCannotSet(pAbil: Ability, pPropName: string, pVal: PropValue): void {
    Logger.error(`Ability: attempt to set read-only property ${pPropName} in ${pAbil.abilityName}`);
}

// Convert the passed PropValue into the correct type.
// Return 'undefined' if the conversion fails.
export function ParseValueToType(pTargetValType: PropValueTypes, pVal: unknown): PropValue {
    if (pVal === undefined || pVal === null) return undefined;
    try {
        switch (pTargetValType) {
            case PropValueTypes.String:
                return pVal.toString();
            case PropValueTypes.Number:
                return Number(pVal);
            case PropValueTypes.Boolean:
                if (typeof pVal === 'string') {
                    return (pVal.toLowerCase() === 'true');
                }
                else {
                    return Boolean(pVal);
                }
            case PropValueTypes.NumberArray:
                return ParseNumArray(pVal as string | number[]);
            case PropValueTypes.NumberTriple:
                return ParseThreeTuple(pVal as string | number[]);
            case PropValueTypes.NumberQuad:
                return ParseFourTuple(pVal as string | number[]);
            case PropValueTypes.StringArray:
                return ParseStringArray(pVal as string | string[]);
            case PropValueTypes.AuthToken:
                if (pVal instanceof AuthToken) {
                    return pVal;
                }
                return new AuthToken(pVal as string);
            default:
                Logger.error(`ParseValueToType: unknown type ${pTargetValType} for value ${pVal}`);
                return undefined;
        }
    }
    catch (e) {
        Logger.error(`ParseValueToType: could not parse ${pVal} to type ${pTargetValType}`);
        return undefined;
    }
}


// =========== Global functions for registering and creating abilities ===========
// Function defined by each ability to create the Ability from a property set
export type AbilityFromProps = (pProps: BKeyedCollection) => Ability;

// Map of ability names to the function to create the ability from property values
export const RegisteredAbilities: Map<string, AbilityFromProps> = new Map<string, AbilityFromProps>()

// The abilities are registered so they can be created dynamically by name
export function RegisterAbility(pAbilityName: string, pFromProps: AbilityFromProps): void {
    if (RegisteredAbilities.has(pAbilityName)) {
        Logger.error(`AbilityManagement: attempt to re-register ability ${pAbilityName}`);
    }
    else {
        Logger.debug(`AbilityManagement: registering ability ${pAbilityName}`);
        RegisteredAbilities.set(pAbilityName, pFromProps);
    };
};

// Given an Ability name and a set of properties, create an Ability instance initialized with the properties
export function AbilityFactory(pName: string, pProps: BKeyedCollection): Ability {
    // Logger.debug(`AbilityFactory: looking for ability ${pName}`);
    if (RegisteredAbilities.has(pName)) {
        // Logger.debug(`AbilityFactory: found ${pName}`);
        const getFrom = RegisteredAbilities.get(pName);
        return getFrom(pProps);
    };
    Logger.error(`AbilityFactory: could not find ability ${pName}`);
    Logger.error(`   Known abilities: ${Array.from(RegisteredAbilities.keys()).join(', ')}`);
    return null;
};
// =========== END OF Global functions for registering and creating abilities ===========

// When updating properties, some things can't be immediate but need to happen when
//    all the properties have been set.
// An ability can register instances if this function to be called when the update
//    is complete.
type DoOnUpdateComplete = (pBItem: BItem, pAbil: Ability) => void;

// Parent class for Abilities.
// Mostly helper and common functions.
export abstract class Ability  {

    // The name of the ability
    abilityName: string;
    // The BItem that this ability is attached to
    containingBItem: BItem;
    // The properties that this ability defines
    propDefns: AbilityPropDefns = {};
    // The values of the properties
    propValues: { [ key: string]: PropValue } = {};
    // When an ability is created, some functions can be delayed until the update is complete
    whenCompleted: DoOnUpdateComplete[];

    // Creating an ability automatically adds it to it's BItem
    constructor(pName: string, pPropDefns?: AbilityPropDefns) {
        this.abilityName = pName;
        this.propDefns = pPropDefns ?? {};
        // Set all the default values for the properties
        Object.keys(this.propDefns).forEach((pName: string) => {
            const propDefn = this.propDefns[pName];
            this.propValues[propDefn.propName] = propDefn.propDefault;
        });
        // Logger.debug(`Ability: ${this.abilityName} created`);
    }

    // Add this ability's properties to the BItem
    // This happens when the ability is added to the BItem
    addProperties(pBItem: BItem): void {
        this.containingBItem = pBItem;
        // If a definition block exists, add the properties to the BItem
        if (this.propDefns) {
            Object.keys(this.propDefns).forEach((pName: string) => {
                const pDefn = this.propDefns[pName];
                this.containingBItem.addProperty(pDefn.propName, this);
                if (pDefn.hasOwnProperty('private') && pDefn.private) {
                    this.containingBItem.addProperty(pDefn.propName, this, { private: true });
                }
                else {
                    this.containingBItem.addProperty(pDefn.propName, this);
                }

                // Add a getter and setter for each property to the ability instance
                /* NOTE: This doesn't work well because TypeScript doesn't know about the added properties
                const me = this;
                Object.defineProperty(me, pDefn.propName, {
                    get() { return pDefn.propGetter(me, pDefn.propName); },
                    set(pVal: PropValue) { pDefn.propSetter(me, pDefn.propName, pVal); }
                });
                */
            });
        }
    }

    // called when a property is about to be removed from its containing BItem
    abstract propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void;

    // Return the value of the property.
    // NOTE: compatible with Abilities that doe not use the PropDefn system
    getProp(pName: string): PropValue {
        if (this.propDefns.hasOwnProperty(pName)) {
            return this.propDefns[pName].propGetter(this, pName);
        }
        else {
            // Ability is not using new propDefns form so expect the variable to be defined on the Ability
            // @ts-ignore
            return this[pName] as PropValue;
        }
    }

    // Set the value of the property.
    // NOTE: compatible with Abilities that doe not use the PropDefn system
    setProp(pName: string, pVal: PropValue): void {
        if (this.propDefns.hasOwnProperty(pName)) {
            this.propDefns[pName].propSetter(this, pName, pVal);
        }
        else {
            // @ts-ignore
            this[pName] = pVal;
        }
    }

    // Even though multiple properties can be set, sometimes the setting needs to be
    //   "atomic" in that there are operation that need all the set parameters.
    // This function is called after all the properties have been set.
    updateComplete(pBItem: BItem): void {
        const completes = this.whenCompleted;
        this.whenCompleted = [];
        completes.forEach( (comp) => {
            comp(pBItem, this);
        });
        return;
    }
    
    addWhenUpdateComplete(pCompleted: DoOnUpdateComplete): void {
        this.whenCompleted.push(pCompleted);

    }
}
