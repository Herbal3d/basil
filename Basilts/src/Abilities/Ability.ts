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

import { BItem, PropValue } from "@BItem/BItem";
import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Base/Tools/Logging';

export interface AbilityPropertyValues { [ key: string]: PropValue };

// Function defined by each ability to create the Ability from a property set
export type AbilityFromProps = (pProps: BKeyedCollection) => Ability;

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

// Parent class for Abilities.
// Mostly helper and common functions.
export abstract class Ability  {

    abilityName: string;
    containingBItem: BItem;

    // Creating an ability automatically adds it to it's BItem
    constructor(pName: string) {
        this.abilityName = pName;
        // Logger.debug(`Ability: ${this.name} created`);
    }

    // Add this ability's properties to the BItem
    // This happens when the ability is added to the BItem
    addProperties(pBItem: BItem): void {
        this.containingBItem = pBItem;
    }

    // called when a property is about to be removed from its containing BItem
    abstract propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void;

    // UTILITY FUNCTIONS
    propValueToFloat(pVal: PropValue): number {
        let ret = 0;
        if (pVal instanceof Number) {
            ret = pVal as number;
        }
        else {
            try {
                ret = parseFloat(pVal as string);
            }
            catch (e) {
                Logger.error(`AbEnviron.solarAzimuth: Error parsing ${pVal} as a number`);
            }
        }
        return ret;
    }
}
