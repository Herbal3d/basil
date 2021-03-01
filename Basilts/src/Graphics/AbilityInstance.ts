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
import { BItem, PropEntry, PropValue } from '@BItem/BItem';

import { BKeyedCollection } from '@Base/Tools/bTypes';

export const InstanceAbilityName = 'Instance';

export const InstanceRefItem = 'RefItem'; // either 'SELF' or id of BItem with the geometry
export const InstancePosProp = 'Pos';
export const InstanceRotProp = 'Rot';

export function AbilityInstanceFromProps(pProps: BKeyedCollection): AbilityInstance {
    return new AbilityInstance( );
};

export class AbilityInstance extends Ability {
    constructor() {
        super(InstanceAbilityName);
    };

    addProperties(pBItem: BItem): void {
        pBItem.addProperty({
            name: InstancePosProp,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                return 5;
            },
            setter: (pPE: PropEntry, pBItem: BItem, pVal: PropValue): void => {
                const xx = 5;   // make eslint happy in the short term
            }
        });
        pBItem.addProperty({
            name: InstanceRotProp,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                return 5;
            },
            setter: (pPE: PropEntry, pBItem: BItem, pVal: PropValue): void => {
                const xx = 5;   // make eslint happy in the short term
            }
        });
    };
};

