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
import { stringify } from 'uuid';

export let IdProp: string = 'id';
export let LayerProp: string = 'layer';
export let StateProp: string = 'state';

export enum BItemState {
    UNINITIALIZED = 0,
    LOADING,
    FAILED,
    READY,
    SHUTDOWN
};

export class AbilityBItem extends Ability {
    constructor(pBItem: BItem, pId: string, pAuth: AuthToken, pLayer: string) {
        super('AbilityBItem', pBItem);

        pBItem.addProperty({
            name: 'id',
            value: CreateUniqueId('remote'),
            ability: this,
            getter: async (pDfd: PropEntry, pD: BItem) => { return pDfd.value; },
            setter: undefined
        });
        pBItem.addProperty({
            name: 'layer',
            value: 'org.herbal3d.b.unknown',
            ability: this,
        });
        pBItem.addProperty({
            name: 'state',
            value: BItemState.UNINITIALIZED,
            ability: this,
        });
    };
};