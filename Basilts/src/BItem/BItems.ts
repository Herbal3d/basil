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

import { BItem } from '@BItem/BItem';
import { AbilityFactory } from '@Abilities/AbilityManagement';

import { BKeyedCollection } from '@Base/Tools/bTypes';
import { ExtractStringError, JSONstringify } from '@Tools/Utilities';

import { Logger } from '@Base/Tools/Logging';

export const BItemIdProp = 'Id';
export const BItemAuthProp = 'ItemAuthToken';
export const BItemLayerProp = 'Layer';
export const BItemInitialAbilityProp = 'InitialAbilities';

// Management routines for BItems.
//    Functions for the creation, storage, and manipulation of BItems

// All the BItems that have been created
export const BItemCollection: Map<string, BItem> = new Map<string,BItem>();

export const BItems = {
    // Create a BItem from a property object.
    // This looks for properties 'BItem*Prop' but any abilities created will look for their own.
    // Throws a string error if there are any problems.
    createFromProps: (pProps: BKeyedCollection): BItem => {
        const newBItem = new BItem(pProps[BItemAuthProp], pProps[BItemLayerProp]);

        // Add any Abilities that are asked for
        let err: string;
        try {
            if (pProps.hasOwnProperty(BItemInitialAbilityProp)) {
                const initialAbils = pProps[BItemInitialAbilityProp];
                if (typeof(initialAbils) === 'string') {
                    const abils = initialAbils.split(',');
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
    // Remove a BItem from the collecion of BItems
    remove: async (pBItem: BItem): Promise<void> => {
        const id = (pBItem.getProp('id') as string);
        BItemCollection.delete(id);
    },
    // Remove BItem based on it's id
    removeById: (pId: string): void => {
        BItemCollection.delete(pId);
    },
    // Get a BItem by it's ID
    get: (pId: string): BItem => {
        return BItemCollection.get(pId);
    }
};


