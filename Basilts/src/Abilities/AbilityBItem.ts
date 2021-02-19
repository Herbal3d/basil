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

import { Config } from '@Base/Config';

import { Ability } from '@Abilities/Ability';
import { CreateUniqueId } from '@Base/Tools/Utilities';
import { BItem, PropEntry } from '@BItem/BItem';

import { AuthToken } from '@Tools/Auth';

export let IdProp: string = 'bitem.id';
export let LayerProp: string = 'bitem.layer';
export let StateProp: string = 'bitem.state';
export let AuthTokenProp: string = 'bitem.authToken';

export enum BItemState {
    UNINITIALIZED = 0,
    LOADING,
    FAILED,
    READY,
    SHUTDOWN
};

export class AbilityBItem extends Ability {
    _id: string;
    _auth: AuthToken;
    _layer: string;
    constructor(pId: string, pAuth: AuthToken, pLayer: string) {
        super('AbilityBItem');
        this._id = pId;
        this._auth = pAuth;
        this._layer = pLayer;
    };

    addProperties(pBItem: BItem) {
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