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

export const AssemblyAbilityName = 'Assembly';

export const AssetURLProp = 'AssetURL';
export const AssetLoaderProp = 'AssetLoader';

export function AbilityAssemblyFromProps(pProps: BKeyedCollection): AbilityAssembly {
    return new AbilityAssembly(pProps[AssetURLProp], pProps[AssetLoaderProp]);
};
export class AbilityAssembly extends Ability {
    _assetURL: PropValue;
    _assetLoader: PropValue;

    constructor(pAssetURL: string, pAssetLoader: string) {
        super(AssemblyAbilityName);
        this._assetURL = pAssetURL;
        this._assetLoader = pAssetLoader;
    };

    addProperties(pBItem: BItem): void {
        pBItem.addProperty({
            name: AssetURLProp,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                return (pPE.ability as AbilityAssembly)._assetURL;
            },
            setter: (pPE: PropEntry, pBItem: BItem, pVal: PropValue): void => {
                (pPE.ability as AbilityAssembly)._assetURL = pVal;
            }
        });
        pBItem.addProperty({
            name: AssetLoaderProp,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                return (pPE.ability as AbilityAssembly)._assetLoader;
            },
            setter: (pPE: PropEntry, pBItem: BItem, pVal: PropValue): void => {
                (pPE.ability as AbilityAssembly)._assetLoader = pVal;
            }
        });
    };
};

