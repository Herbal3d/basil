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

import { Ability, RegisterAbility } from '@Abilities/Ability';
import { BItem, PropValue } from '@BItem/BItem';

import { BKeyedCollection } from '@Tools/bTypes';
// import { Logger } from '@Base/Tools/Logging';

export const AbRegistrationName = 'Registration'

// Function that returns an instance of this Ability given a collection of properties (usually from BMessage.IProps)
export function AbRegistrationFromProps(pProps: BKeyedCollection): AbRegistration {
    return new AbRegistration();
};

// Register the ability with the AbilityFactory. Note this is run when this file is imported.
RegisterAbility(AbRegistrationName, AbRegistrationFromProps);

// Ability Registration is added to base BItem and the names of BItems are
//   later added so they can be looked up. For instance, BItem that is the main
//   camera registers itself as "MainCamera".
// This allows looking up the current BItem IDs of well known BItems.
export class AbRegistration extends Ability {

    public static FocusAvatarProp = 'FocusAvatar';
    public static AvatarsProp = 'Avatars';

    // BItem name of the main/logged in avatar
    public get FocusAvatar(): string {
        // TODO: add code to return BItem name
        return "unknown";
    }
    // BItem names of the avatars in the scene
    public get Avatars(): string[] {
        // TODO: add code to return BItem names
        return ["unknown"];
    }

    constructor() {
        super(AbRegistrationName);
    };

    // Add all the properties from this assembly to the holding BItem
    addProperties(pBItem: BItem): void {
        // Always do this!!
        super.addProperties(pBItem);

        pBItem.addProperty(AbRegistration.FocusAvatarProp, this);
        pBItem.addProperty(AbRegistration.AvatarsProp, this);

        pBItem.setReady();
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };
};
