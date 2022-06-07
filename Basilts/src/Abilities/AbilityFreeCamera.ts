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
import { Logger } from '@Base/Tools/Logging';

export const AbFreeCameraName = 'FreeCamera'
// REMEMBER TO ADD the ability registration in AbilityManagement.ts

// Function that returns an instance of this Ability given a collection of properties (usually from BMessage.IProps)
export function AbFreeCameraFromProps(pProps: BKeyedCollection): AbFreeCamera {
    if (pProps.hasOwnProperty(AbFreeCamera.OneProp) && pProps.hasOwnProperty(AbFreeCamera.TwoProp)) {
        const oneProp = pProps[AbFreeCamera.OneProp] as string;
        const twoProp = pProps[AbFreeCamera.TwoProp] as string;
        return new AbFreeCamera(oneProp, twoProp);
    };
    Logger.error(`AbAssemblyFromProps: Missing required properties for ${AbFreeCameraName}. pProps: ${JSON.stringify(pProps)}`);
};

// Register the ability with the AbilityFactory. Note this is run when this file is imported.
RegisterAbility(AbFreeCameraName, AbFreeCameraFromProps);

export class AbFreeCamera extends Ability {

    // When an ability is referenced in BMessage.IProps, these are the types of values passed in the request
    // These string names are the parameter names passed in the BMessage.IProps structure and they
    //     coorespond to the class property names.
    public static OneProp = 'one';
    public static TwoProp = 'two';

    constructor(pPropertyOne: string, pPropertyTwo: string) {
        super(AbFreeCameraName);
        this.one = pPropertyOne;
        this._two = pPropertyTwo;
    };

    // Make the properties available
    public one: PropValue;
    // Use getters and setters for properties that cause things to happen
    _two: PropValue;
    public get propertyTwo(): PropValue { 
        return this._two;
    }
    public set propertyTwo(pVal: PropValue) { 
        this._two = pVal;
    }

    // Add all the properties from this assembly to the holding BItem
    addProperties(pBItem: BItem): void {
        // Always do this!!
        super.addProperties(pBItem);

        pBItem.addProperty(AbFreeCamera.OneProp, this);
        pBItem.addProperty(AbFreeCamera.TwoProp, this);

        pBItem.setReady();
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };
};
