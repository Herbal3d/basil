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

import { BItem } from '@BItem/BItem';
import { AbilityFactory } from '@Abilities/AbilityManagement';
import { AbBItem } from '@Abilities/AbilityBItem';
import { AbRegistrationName } from '@Abilities/AbilityReg';
import { AuthToken } from '@Base/Tools/Auth';

import { BKeyedCollection } from '@Base/Tools/bTypes';
import { ExtractStringError, JSONstringify } from '@Tools/Utilities';

import { Logger } from '@Base/Tools/Logging';

// Management routines for BItems.
//    Functions for the creation, storage, and manipulation of BItems

// All the BItems that have been created
export const BItemCollection: Map<string, BItem> = new Map<string,BItem>();

export const BItems = {
    // Create a BItem from a property object.
    // This looks for properties 'BItem*Prop' but any abilities created will look for their own.
    // Throws a string error if there are any problems.
    createFromProps: (pProps: BKeyedCollection): BItem => {
        Logger.debug(`BItems.createFromProps: ${JSONstringify(pProps)}`);
        const authTokenString = pProps[AbBItem.AuthTokenProp] as string;
        const authToken = authTokenString ? new AuthToken(authTokenString) : null;
        const layer = pProps[AbBItem.LayerProp] ?? Config.layers.default;
        const newBItem = new BItem(undefined, authToken, layer);

        // Add any Abilities that are asked for
        let err: string;
        try {
            Logger.debug(`BItems.createFromProps: checking for abilities`);
            if (pProps.hasOwnProperty(AbBItem.AbilityProp)) {
                const abils = pProps[AbBItem.AbilityProp];
                for (const abil of abils) {
                    try {
                        const newAbility = AbilityFactory(abil, pProps);
                        if (newAbility) {
                            newBItem.addAbility(newAbility);
                        }
                        else {
                            err = `BItems.createFromProps: could not create ability ${abil}`;
                        };
                    }
                    catch (e) {
                        err = `BItems.createFromProps: exception adding ability to BItem: ${ExtractStringError(e)}`;
                        break;
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
    // Remove a BItem from the collecion of BItems and release all resources it may have
    remove: (pBItem: BItem, pId?: string): void => {
        const id = pId ?? pBItem.id;
        BItemCollection.delete(id);
        pBItem.releaseBItem();
    },
    // Remove BItem based on it's id
    removeById: (pId: string): void => {
        BItems.remove(BItems.get(pId), pId);
    },
    // Get a BItem by it's ID
    get: (pId: string): BItem => {
        return BItemCollection.get(pId);
    },
    // Register the name and BItem.id a well known BItem in the base/registration BItem
    // After registration, the registration BItem will return a property of pName with
    //     the value of pBItem.id.
    registerWellKnownBItem: (pName: string, pBItem: BItem, pRegBItem?: BItem): void => {
        // Get the registration BItem
        const regBItem = pRegBItem ?? BItems.get(Config.infrastructureBItemNames.registration);
        if (regBItem) {
            // Get the registration ability in that BItem
            const abilReg = regBItem.getAbility(AbRegistrationName);
            if (abilReg) {
                (abilReg as BKeyedCollection)[pName] = pBItem.id;
                regBItem.addProperty(pName, abilReg);
            };
        };
    }
};


