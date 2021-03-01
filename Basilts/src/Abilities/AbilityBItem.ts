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
import { BItem } from '@BItem/BItem';
import { AuthToken } from '@Tools/Auth';

import { CreateUniqueId } from '@Base/Tools/Utilities';
import { BKeyedCollection } from '@Base/Tools/bTypes';

export const IdProp: string = 'bitem.id';
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
    constructor(pId: string, pAuth: AuthToken, pLayer: string) {
        super(BItemAbilityName);
        this._id = pId;
        this._auth = pAuth;
        this._layer = pLayer;
    };

    addProperties(pBItem: BItem): void {
        pBItem.addProperty({
            name: IdProp,
            value: this._id ?? CreateUniqueId('remote'),
            ability: this,
            setter: undefined
        });
        pBItem.addProperty({
            name: LayerProp,
            value: this._layer ?? 'org.herbal3d.b.unknown',
            ability: this,
        });
        pBItem.addProperty({
            name: AuthTokenProp,
            value: this._auth,
            ability: this,
        });
        pBItem.addProperty({
            name: StateProp,
            value: BItemState.UNINITIALIZED,
            ability: this,
        });
    };
};
