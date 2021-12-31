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

const IdProp: string = 'Id';
const LayerProp: string = 'Layer';
const StateProp: string = 'State';
const AuthTokenProp: string = 'bitem.authToken';

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

// A class with references to the ability properties so we have type checked gets and fetches
export class AbilityBItemProps {
    public static getId(pBI: BItem): string { return <string>pBI.getProp(IdProp); }
    public static setId(pBI: BItem, pVal: string): void { pBI.setProp(IdProp, pVal); }

    public static getLayer(pBI: BItem): string { return <string>pBI.getProp(LayerProp); }
    public static setLayer(pBI: BItem, pVal: string): void { pBI.setProp(LayerProp, pVal); }

    public static getState(pBI: BItem): BItemState { return <BItemState>pBI.getProp(StateProp); }
    public static setState(pBI: BItem, pVal: BItemState): void { pBI.setProp(StateProp, pVal); }

    public static getAuthToken(pBI: BItem): string { return <string>pBI.getProp(AuthTokenProp); }
    public static setAuthToken(pBI: BItem, pVal: string): void { pBI.setProp(AuthTokenProp, pVal); }
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

    // Return a handle for typed access to my properties
    get props(): AbilityBItemProps { return AbilityBItemProps; }

    addProperties(pBItem: BItem): void {
        // Return BItem's ID
        pBItem.addProperty({
            name: IdProp,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                return (pPE.ability as AbilityBItem)._id;
            },
            setter: undefined
        });
        // Get or Set BItem's 'Layer" value
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
        // Get or Set BItmem's AuthToken
        //   Set value an be either an AuthToken or a string which is wrapped in an AuthToken
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
        // Get or Set BItem's state
        //     Set value can be either a string (which is converted to a BItemState) or a numeric BItemState value
        pBItem.addProperty({
            name: StateProp,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                return (pPE.ability as AbilityBItem)._state;
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
