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

import { Object3D } from 'three';

import { Ability } from '@Abilities/Ability';
import { BItem, PropEntry, PropValue } from '@BItem/BItem';

import { AuthToken } from '@Tools/Auth';

import { BKeyedCollection } from '@Tools/bTypes';
import { LoadSimpleAsset, LoadAssetParams } from '@Graphics/GraphicOps';

export const AssemblyAbilityName = 'Assembly';

export const AssetURLProp = 'AssetURL';
export const AssetLoaderProp = 'AssetLoader';
export const AssetAuthProp = 'AssetAuth';

interface AssemblyAfterRequestProps {
    Ability: AbilityAssembly;
    BItem: BItem;
};

export function AbilityAssemblyFromProps(pProps: BKeyedCollection): AbilityAssembly {
    return new AbilityAssembly(pProps[AssetURLProp], pProps[AssetLoaderProp]);
};
export class AbilityAssembly extends Ability {
    _assetURL: PropValue;
    _assetLoader: PropValue;
    _assetAuth: AuthToken;
    _graphicNode: Object3D;

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
                pBItem.setLoading();
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
        pBItem.addProperty({
            name: AssetAuthProp,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                return (pPE.ability as AbilityAssembly)._assetAuth?.token;
            },
            setter: (pPE: PropEntry, pBItem: BItem, pVal: PropValue): void => {
                if (typeof(pVal) === 'string') {
                    (pPE.ability as AbilityAssembly)._assetAuth = new AuthToken(pVal);
                }
                else {
                    if (pVal instanceof AuthToken) {
                        (pPE.ability as AbilityAssembly)._assetAuth = pVal;
                    };
                };
            }
        });
    };
};

export async function LoadAssembly(pProps: AssemblyAfterRequestProps): Promise<void> {
    const ability = pProps.Ability;

    const loaderProps: LoadAssetParams = {
        AssetURL: <string>ability._assetURL,
        AssetLoader: <string>ability._assetLoader,
        Auth: ability._assetAuth?.token
    };

    LoadSimpleAsset(loaderProps)
    .then ( loaded => {
        ability._graphicNode = loaded;
        pProps.BItem.setReady();
    })
    .catch ( err => {
        pProps.BItem.setFailed();
        throw err;
    });
};
