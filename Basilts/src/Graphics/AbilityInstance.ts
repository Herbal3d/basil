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
    const newAbil = new AbilityInstance(pProps[InstanceRefItem], pProps[InstancePosProp], pProps[InstanceRotProp] );
    return newAbil;
};

export class AbilityInstance extends Ability {
    _refItem: PropValue = 'SELF';
    _pos: PropValue = '[0,0,0]';
    _posCoord: PropValue = 0;
    _rot: PropValue = '[0,0,0,1]';
    _rotCoord: PropValue = 0;
    
    constructor(pRefItem: string, pPos: string | number[], pRot: string | number[] ) {
        super(InstanceAbilityName);
    };

    addProperties(pBItem: BItem): void {
        pBItem.addProperty({
            name: InstanceRefItem,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                return (pPE.ability as AbilityInstance)._refItem;
            },
            setter: (pPE: PropEntry, pBItem: BItem, pVal: PropValue): void => {
                if (pVal === 'SELF') {
                    pVal = pBItem.id;
                }
                (pPE.ability as AbilityInstance)._refItem = pVal;
                // TODO: get pointer to graphics item for quick access
            }
        });
        pBItem.addProperty({
            name: InstancePosProp,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                // TODO: fetch value from graphics engine
                return (pPE.ability as AbilityInstance)._pos;
            },
            setter: (pPE: PropEntry, pBItem: BItem, pVal: PropValue): void => {
                (pPE.ability as AbilityInstance)._pos = pVal;
                // TODO: push value into graphics engine
            }
        });
        pBItem.addProperty({
            name: InstanceRotProp,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                // TODO: fetch value from graphics engine
                return (pPE.ability as AbilityInstance)._rot;
            },
            setter: (pPE: PropEntry, pBItem: BItem, pVal: PropValue): void => {
                (pPE.ability as AbilityInstance)._rot = pVal;
                // TODO: push value into graphics engine
            }
        });
    };
};

