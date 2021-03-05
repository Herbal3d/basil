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
import { AuthToken } from '@Tools/Auth';

import { CreateUniqueId } from '@Tools/Utilities';
import { BKeyedCollection } from '@Tools/bTypes';

export const IdProp: string = 'Id';
export const LayerProp: string = 'Layer';
export const StateProp: string = 'State';
export const AuthTokenProp: string = 'bitem.authToken';

export enum BItemState {
    UNINITIALIZED = 0,
    LOADING,
    FAILED,
    READY,
    SHUTDOWN
};

export const BItemAbilityName = 'BItem';

export function AbilityBItemFromProps(pProps: BKeyedCollection): AbilityBItem {
    return new AbilityBItem( pProps[IdProp], pProps[AuthTokenProp], pProps[LayerProp]);
};

export class AbilityBItem extends Ability {
    _id: string;
    _auth: AuthToken;
    _layer: string;
    _state: BItemState;

    constructor(pId: string, pAuth: AuthToken, pLayer: string) {
        super(BItemAbilityName);
        this._id = pId ?? CreateUniqueId('BItemConstruct');
        this._auth = pAuth ?? undefined;
        this._layer = pLayer ?? 'unknown.b.herbal3d.org';
    };

    addProperties(pBItem: BItem): void {
        pBItem.addProperty({
            name: IdProp,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                return (pPE.ability as AbilityBItem)._id;
            },
            setter: undefined
        });
        pBItem.addProperty({
            name: LayerProp,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                return (pPE.ability as AbilityBItem)._layer;
            },
            setter: (pPE: PropEntry, pBItem: BItem, pVal: PropValue): void => {
                (pPE.ability as AbilityBItem)._layer = <string>pVal;
            }
        });
        pBItem.addProperty({
            name: AuthTokenProp,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                return (pPE.ability as AbilityBItem)._auth;
            },
            setter: (pPE: PropEntry, pBItem: BItem, pVal: PropValue): void => {
                if (pVal instanceof AuthToken) {
                    (pPE.ability as AbilityBItem)._auth = pVal;
                }
                else {
                    (pPE.ability as AbilityBItem)._auth = new AuthToken(<string>pVal);
                };
            },
            public: false
        });
        pBItem.addProperty({
            name: StateProp,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                return BItemState[(pPE.ability as AbilityBItem)._state];
            },
            setter: (pPE: PropEntry, pBItem: BItem, pVal: PropValue): void => {
                if (typeof(pVal) === 'string') {
                    (pPE.ability as AbilityBItem)._state = BItemState[pVal.toUpperCase() as keyof typeof BItemState];
                }
                else {
                    (pPE.ability as AbilityBItem)._state = Number(pVal);
                };
            }
        });
    };
};
