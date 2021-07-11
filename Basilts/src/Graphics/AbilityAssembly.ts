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
import { LoadSimpleAsset, LoadAssetParams, ScheduleDelayedGraphicsOperation } from '@Graphics/GraphicOps';
import { Logger } from '@Base/Tools/Logging';

export const AssemblyAbilityName = 'Assembly';

export const AssetURLProp = 'AssetURL';
export const AssetLoaderProp = 'AssetLoader';
export const AssetAuthProp = 'AssetAuth';
export const AssetRepresentationProp = 'AssetRepresentation';

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
        // Get and Set the Assembly's URL
        // Has the side effect of causing the URL to be loaded (Graphics LoadAssembly)
        const AssetURLPropEntry = pBItem.addProperty({
            name: AssetURLProp,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                return (pPE.ability as AbilityAssembly)._assetURL;
            },
            setter: (pPE: PropEntry, pBItem: BItem, pVal: PropValue): void => {
                (pPE.ability as AbilityAssembly)._assetURL = pVal;
                Logger.debug(`AbilityAssembly.AssetURL.set: setting BItem to LOADING and scheduling load`);
                pBItem.setLoading();
                ScheduleDelayedGraphicsOperation(LoadAssembly, {
                    Ability: this,
                    BItem: pBItem
                });
            }
        });
        // Since the previous property's setter has side effects, we need to invoke it now
        AssetURLPropEntry.setter(AssetURLPropEntry, pBItem, this._assetURL);

        // Get and Set the AssetLoader needed for the asset
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
        // Get and Set the Asset's access token
        // Set value can be either an AuthToken or a string (which is wrapped in an AuthToken)
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
        // Get the Assembly's graphical representation.
        // Very dependent on the underlying implementation. This is a ThreeJS Object3D
        // All abilities that create in-world representations present this property
        pBItem.addProperty({
            name: AssetRepresentationProp,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                return (pPE.ability as AbilityAssembly)._graphicNode;
            },
            setter: (pPE: PropEntry, pBItem: BItem, pVal: PropValue): void => {
                Logger.error(`AbilityAssembly.set.AssetRepresentation: attempt to set value`);
            },
            public: false       // the outside world can't see this one
        });
    };
};

// Returns a Promise that loads an assembly given the URL and asset type properties.
// Will load the asset and set the BItem's state to READY.
// Promise fails of the asset can't be loaded and the BItem's state is set to FAILED
export async function LoadAssembly(pProps: AssemblyAfterRequestProps): Promise<void> {
    const ability = pProps.Ability;
    Logger.debug(`AbilityAssembly: LoadAssembly(${ability._assetURL})`);

    const loaderProps: LoadAssetParams = {
        AssetURL: <string>ability._assetURL,
        AssetLoader: <string>ability._assetLoader,
        Auth: ability._assetAuth?.token
    };

    LoadSimpleAsset(loaderProps)
    .then ( loaded => {
        Logger.debug(`AbilityAssembly: LoadAssembly: successful load`);
        if (typeof(loaded) === 'undefined') { Logger.error(`AbilityAssembly: LoadAssembly: loaded object is null`); };
        ability._graphicNode = loaded;
        pProps.BItem.setReady();
    })
    .catch ( err => {
        Logger.debug(`AbilityAssembly: LoadAssembly: failed load`);
        pProps.BItem.setFailed();
        throw err;
    });
};
