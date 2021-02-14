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

export enum BItemState {
    UNINITIALIZED = 0,
    LOADING,
    FAILED,
    READY,
    SHUTDOWN
};

export class AbilityBItem extends Ability {
  _id: string;
  _layer: string;
  _state: BItemState;

  constructor(pBItem: BItem, pId: string, pAuth: AuthToken, pLayer: string) {
    super('AbilityBItem');

    this._id = CreateUniqueId('remote');
    this._layer = 'org.herbal3d.b.unknown';

    pBItem._addAbility(this);

    pBItem.addProperty({
      name: 'id',
      ability: this,
      getter: async (pDfd: PropEntry, pD: BItem) => { return (pDfd.ability as AbilityBItem)._id; },
      setter: undefined
    });
    pBItem.addProperty({
      name: 'layer',
      ability: this,
      getter: async (pDfd: PropEntry, pD: BItem) => { return (pDfd.ability as AbilityBItem)._layer; },
      setter: async (pDfd: PropEntry, pD: BItem, pV: any) => { (pDfd.ability as AbilityBItem)._layer = (pV as string)}
    });
    pBItem.addProperty({
      name: 'state',
      ability: this,
      getter: async (pDfd: PropEntry, pD: BItem) => { return (pDfd.ability as AbilityBItem)._state; },
      setter: async (pDfd: PropEntry, pD: BItem, pV: any) => { (pDfd.ability as AbilityBItem)._state = pV }
    });
  };
}

