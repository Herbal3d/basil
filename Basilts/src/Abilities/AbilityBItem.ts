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
import { BItem, PropValue } from '@BItem/BItem';
import { AuthToken } from '@Tools/Auth';

import { CreateUniqueId } from '@Tools/Utilities';
import { BKeyedCollection } from '@Tools/bTypes';

export enum BItemState {
    UNINITIALIZED = 0,
    LOADING,
    FAILED,
    READY,
    SHUTDOWN
};

export const BItemAbilityName = 'BItem';

export function AbilityBItemFromProps(pProps: BKeyedCollection): AbilityBItem {
    return new AbilityBItem( pProps[AbilityBItem.IdProp], pProps[AbilityBItem.AuthTokenProp], pProps[AbilityBItem.LayerProp]);
};

export class AbilityBItem extends Ability {
    public static IdProp: string = 'id';
    public static LayerProp: string = 'layer';
    public static StateProp: string = 'state';
    public static AuthTokenProp: string = 'bitemAuthToken';
    public static AbilityProp: string = 'abilities';

    public id: string;
    public layer: string;
    _auth: AuthToken;
    public get bitemAuthToken(): AuthToken {
        return this._auth;
    };
    public set bitemAuthToken(pVal: PropValue) {
        if (pVal instanceof AuthToken) {
            this._auth = pVal;
        }
        else {
            this._auth = new AuthToken(<string>pVal);
        };
    };
    _state: BItemState;
    public get state(): BItemState {
        return this._state;
    }
    public set state(pVal: PropValue) {
        if (typeof(pVal) === 'string') {
            this._state = BItemState[pVal.toUpperCase() as keyof typeof BItemState];
        }
        else {
            this._state = Number(pVal);
        };
    };

    constructor(pId: string, pAuth: AuthToken, pLayer: string) {
        super(BItemAbilityName);
        this.id = pId ?? CreateUniqueId('BItemConstruct');
        this._auth = pAuth ?? undefined;
        this.layer = pLayer ?? 'unknown.b.herbal3d.org';
        this._state = BItemState.UNINITIALIZED;
    };

    addProperties(pBItem: BItem): void {
        pBItem.addProperty(AbilityBItem.IdProp, this);
        pBItem.addProperty(AbilityBItem.LayerProp, this);
        pBItem.addProperty(AbilityBItem.AuthTokenProp, this, { private: true });
        pBItem.addProperty(AbilityBItem.StateProp, this);
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };
};
