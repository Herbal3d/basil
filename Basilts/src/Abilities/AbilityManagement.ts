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

import { Ability } from '@Abilities/Ability';

import { AbAssemblyName, AbAssemblyFromProps } from '@Abilities/AbilityAssembly';
import { AbPlacementName, AbPlacementFromProps } from '@Abilities/AbilityPlacement';
import { AbCameraName, AbCameraFromProps } from '@Abilities/AbilityCamera';
import { AbMouseName, AbMouseFromProps } from '@Abilities/AbilityMouse';
import { AbKeyboardName, AbKeyboardFromProps } from '@Abilities/AbilityKeyboard';

import { BKeyedCollection } from '@Tools/bTypes';

import { Logger } from '@Tools/Logging';

// Management functions for Abilities.

// Function defined by each ability to create the Ability from a property set
export type AbilityFromProps = (pProps: BKeyedCollection) => Ability;

const _registeredAbilities: Map<string, AbilityFromProps> = new Map<string, AbilityFromProps>()

// All abilities must be registed with the factory before they can be used.
// This points the ability name to the *FromProps function.
export function RegisterAllAbilities(): void {
    // RegisterAbility(TEMPLATEAbilityName, AbilityTEMPLATEFromProps);
    RegisterAbility(AbAssemblyName, AbAssemblyFromProps);
    RegisterAbility(AbPlacementName, AbPlacementFromProps);
    RegisterAbility(AbCameraName, AbCameraFromProps);
    RegisterAbility(AbMouseName, AbMouseFromProps);
    RegisterAbility(AbKeyboardName, AbKeyboardFromProps);
};

// The abilities are registered so they can be created dynamically by name
export function RegisterAbility(pAbilityName: string, pFromProps: AbilityFromProps): void {
    if (_registeredAbilities.has(pAbilityName)) {
        Logger.error(`AbilityManagement: attempt to re-register ability ${pAbilityName}`);
    }
    else {
        Logger.debug(`AbilityManagement: registering ability ${pAbilityName}`);
        _registeredAbilities.set(pAbilityName, pFromProps);
    };
};

// Given an Ability name and a set of properties, create an Ability instance initialized with the properties
export function AbilityFactory(pName: string, pProps: BKeyedCollection): Ability {
    // Logger.debug(`AbilityFactory: looking for ability ${pName}`);
    if (_registeredAbilities.has(pName)) {
        // Logger.debug(`AbilityFactory: found ${pName}`);
        const getFrom = _registeredAbilities.get(pName);
        return getFrom(pProps);
    };
    Logger.error(`AbilityFactory: could not find ability ${pName}`);
    return null;
};