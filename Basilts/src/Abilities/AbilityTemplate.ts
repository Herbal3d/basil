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

import { Ability, RegisterAbility, ParseValueToType } from '@Abilities/Ability';
import { PropDefaultGetter, PropDefaultSetter } from '@Abilities/Ability';
import { BItem, PropValue, PropValueTypes } from '@BItem/BItem';

import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Base/Tools/Logging';

export const AbTEMPLATEName = 'TEMPLATE'

// Function that returns an instance of this Ability given a collection of properties (usually from BMessage.IProps)
export function AbTEMPLATEFromProps(pProps: BKeyedCollection): AbTEMPLATE {
    return new AbTEMPLATE(
        <string>ParseValueToType(PropValueTypes.String, pProps[AbTEMPLATE.OneProp]),
        <string>ParseValueToType(PropValueTypes.String, pProps[AbTEMPLATE.TwoProp]),
    )
};

// Register the ability with the AbilityFactory. Note this is run when this file is imported.
RegisterAbility(AbTEMPLATEName, AbTEMPLATEFromProps);

export class AbTEMPLATE extends Ability {

    // When an ability is referenced in BMessage.IProps, these are the types of values passed in the request
    // These string names are the parameter names passed in the BMessage.IProps structure and they
    //     coorespond to the class property names.
    public static OneProp = 'one';
    public static TwoProp = 'two';

    constructor(pPropertyOne: string, pPropertyTwo: string) {
        super(AbTEMPLATEName, {
            [AbTEMPLATE.OneProp]: {
                propName: AbTEMPLATE.OneProp,
                propType: PropValueTypes.String,
                propDefault: '1',
                propDesc: 'The first property',
                propGetter: PropDefaultGetter,
                propSetter: PropDefaultSetter
            },
            [AbTEMPLATE.TwoProp]: {
                propName: AbTEMPLATE.TwoProp,
                propType: PropValueTypes.String,
                propDefault: '2',
                propDesc: 'The second property',
                propGetter: PropDefaultGetter,
                propSetter: PropDefaultSetter
            },
        });
    };

    // Add all the properties from this assembly to the holding BItem
    addProperties(pBItem: BItem): void {
        // Always do this!!
        super.addProperties(pBItem);

        // For 'simple' abilities, it is ready when it is loaded
        // pBItem.setReady();
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };
};
