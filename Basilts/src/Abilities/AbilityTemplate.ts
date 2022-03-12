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

import { Ability } from '@Abilities/Ability';
import { BItem, PropValue } from '@BItem/BItem';

import { BKeyedCollection } from '@Tools/bTypes';
// import { Logger } from '@Base/Tools/Logging';

export const TemplateAbilityName = 'TemplateAbilityName'


// Function that returns an instance of this Ability given a collection of properties (usually from BMessage.IProps)
export function AbilityTemplateFromProps(pProps: BKeyedCollection): AbilityTemplate {
    return new AbilityTemplate(pProps[AbilityTemplate.TwoProp], pProps[AbilityTemplate.OneProp]);
};

export class AbilityTemplate extends Ability {

    // When an ability is referenced in BMessage.IProps, these are the types of values passed in the request
    // These string names are the parameter names passed in the BMessage.IProps structure and they
    //     coorespond to the class property names.
    public static OneProp = 'one';
    public static TwoProp = 'two';

    constructor(pPropertyOne: string, pPropertyTwo: string) {
        super(TemplateAbilityName);
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
        pBItem.addProperty(AbilityTemplate.OneProp, this);
        pBItem.addProperty(AbilityTemplate.TwoProp, this);
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };
};
