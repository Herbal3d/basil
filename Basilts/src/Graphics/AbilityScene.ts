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

export const SceneAbilityName = 'Scene';

export const AssetURLProp = 'AssetURL';
export const AssetLoaderProp = 'AssetLoader';

export function AbilitySceneFromProps(pProps: BKeyedCollection): AbilityScene {
    return new AbilityScene();
};
export class AbilityScene extends Ability {
    constructor() {
        super(SceneAbilityName);
    };

    addProperties(pBItem: BItem): void {
        pBItem.addProperty({
            name: AssetURLProp,
            value: 'xx',
            ability: this,
            setter: (pPE: PropEntry, pBItem: BItem, pVal: PropValue): void => {
                const xx = 5;   // make eslint happy in the short term
            }
        });
        pBItem.addProperty({
            name: AssetLoaderProp,
            value: 'xx',
            ability: this,
        });
    };
};

