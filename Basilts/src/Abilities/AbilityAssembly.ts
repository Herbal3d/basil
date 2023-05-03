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

import { Ability, RegisterAbility, ParseValueToType  } from '@Abilities/Ability';
import { PropDefaultGetter, PropDefaultSetter } from '@Abilities/Ability';
import { AbPlacement } from '@Abilities/AbilityPlacement';
import { AuthToken } from '@Base/Tools/Auth';

import { BItem, PropValue, PropValueTypes, SetPropEventParams } from '@BItem/BItem';
import { BItemState } from '@Abilities/AbilityBItem';

import { EventProcessor, SubscriptionEntry } from '@Eventing/SubscriptionEntry';

import { LoadSimpleAsset, LoadAssetParams, DeleteAsset } from '@Graphics/GraphicOps';
import { Object3D } from '@Graphics/Object3d';

import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Tools/Logging';

export const AbAssemblyName = 'Assembly';

interface AssemblyAfterRequestProps {
    Ability: AbAssembly;
    BItem: BItem;
};

export function AbAssemblyFromProps(pProps: BKeyedCollection): AbAssembly {
    return new AbAssembly(
        <string>ParseValueToType(PropValueTypes.String, pProps[AbAssembly.AssetUrlProp]),
        <string>ParseValueToType(PropValueTypes.String, pProps[AbAssembly.AssetLoaderProp]),
    );
};

// Register the ability with the AbilityFactory. Note this is run when this file is imported.
RegisterAbility( AbAssemblyName, AbAssemblyFromProps );

// An "Assembly" is a thing that can be represented or displayed in the world.
// It can be a mesh, a shader, texture, or anything else that is loaded and used in the world.
export class AbAssembly extends Ability {

    public static AssetUrlProp = 'assetUrl';
    public static AssetLoaderProp = 'assetLoader';
    public static AssetAuthProp = 'assetAuth';
    public static AssetRepresentationProp = 'assetRepresentation';

    constructor(pAssetUrl: string, pAssetLoader: string) {
        super(AbAssemblyName, {
                [AbAssembly.AssetUrlProp]: {
                    propName: AbAssembly.AssetUrlProp,
                    propType: PropValueTypes.String,
                    propDefault: pAssetUrl,
                    propDesc: 'URL to fetch assembly',
                    propGetter: PropDefaultGetter,
                    propSetter: (pAbil: Ability, pPropName: string, pVal: PropValue) => {   // Set camera position
                        const abil = pAbil as AbAssembly;
                        if (pVal && abil) {
                            PropDefaultSetter(pAbil, pPropName, pVal);
                            if (this.containingBItem.getState() != BItemState.LOADING) {
                                // Logger.debug(`AbAssembly.AssetUrl.set: setting BItem to LOADING and scheduling load`);
                                this.containingBItem.setLoading();
                                // When all parameters are set, start the loading
                                this.addWhenUpdateComplete( (pBItem: BItem, pAbil: AbAssembly) => {
                                    void LoadAssembly(pAbil, pBItem);
                                });
                            };
                        };
                    }
                },
                [AbAssembly.AssetLoaderProp]: {
                    propName: AbAssembly.AssetLoaderProp,
                    propType: PropValueTypes.String,
                    propDefault: pAssetLoader,
                    propDesc: 'loader to use for asset',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                // Get and Set the Asset's access token
                // Set value can be either an AuthToken or a string (which is wrapped in an AuthToken)
                [AbAssembly.AssetAuthProp]: {
                    propName: AbAssembly.AssetAuthProp,
                    propType: PropValueTypes.String,
                    propDefault: "",
                    private: true,
                    propDesc: 'loader to use for asset',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                // Get the Assembly's graphical representation.
                // Very dependent on the underlying implementation. This is a Babylon Object3D
                // All abilities that create in-world representations present this property
                [AbAssembly.AssetRepresentationProp]: {
                    propName: AbAssembly.AssetRepresentationProp,
                    propType: PropValueTypes.Object3D,
                    propDefault: undefined,
                    private: true,
                    propDesc: 'internal representation of the assembly',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                }
        });
    };

    addProperties(pBItem: BItem): void {
        super.addProperties(pBItem);

        // Has the side effect of causing the URL to be loaded (Graphics LoadAssembly)
        pBItem.setProp(AbAssembly.AssetUrlProp, this.propValues[AbAssembly.AssetUrlProp]);

        // We watch for position changes and set them in the representation
        this._posChangeWatcher = pBItem.watchProperty(AbPlacement.PosProp,
                this._processPosChange.bind(this) as EventProcessor);
        this._rotChangeWatcher = pBItem.watchProperty(AbPlacement.RotProp,
                this._processRotChange.bind(this) as EventProcessor);
    };

    // When my properties are being removed, the asset is no longer in world.
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        if (pPropertyName === AbAssembly.AssetRepresentationProp) {
            const represent = this.getProp(AbAssembly.AssetRepresentationProp) as Object3D;
            if (represent) {
                DeleteAsset(represent);
                this.setProp(AbAssembly.AssetRepresentationProp, undefined);
                pBItem.unWatchProperty(this._posChangeWatcher);
                pBItem.unWatchProperty(this._rotChangeWatcher);
            }
            else {
                Logger.error(`AbAssembly.propertyBeingRemoved: removing ${pPropertyName} but no representation`);
            }
        }
        return;
    };

    // We're told the position changed
    _posChangeWatcher: SubscriptionEntry;
    _processPosChange(pParms: SetPropEventParams): void {
        const represent = this.getProp(AbAssembly.AssetRepresentationProp) as Object3D;
        if (represent) {
            represent.pos = pParms.NewValue as number[];
        }
    };
    // We're told the rotation changed
    _rotChangeWatcher: SubscriptionEntry;
    _processRotChange(pParms: BKeyedCollection): void {
        const represent = this.getProp(AbAssembly.AssetRepresentationProp) as Object3D;
        if (represent) {
            represent.rot = pParms.NewValue as number[];
        }
    };
};

// Returns a Promise that loads an assembly given the URL and asset type properties.
// Will load the asset and set the BItem's state to READY.
// Promise fails of the asset can't be loaded and the BItem's state is set to FAILED
export async function LoadAssembly(pAbil: AbAssembly, pBItem: BItem): Promise<void> {
    // Logger.debug(`AbAssembly: LoadAssembly(${pAbil.getProp(AbAssembly.AssetUrlProp)})`);

    const loaderProps: LoadAssetParams = {
        AssetURL: <string>pAbil.getProp(AbAssembly.AssetUrlProp),
        AssetLoader: <string>pAbil.getProp(AbAssembly.AssetLoaderProp),
        Auth: (pAbil.getProp(AbAssembly.AssetAuthProp) as AuthToken)?.token
    };

    LoadSimpleAsset(loaderProps)
    .then ( loaded => {
        // Logger.debug(`AbAssembly: LoadAssembly: successful load`);
        if (typeof(loaded) === 'undefined') {
            Logger.error(`AbAssembly: LoadAssembly: loaded object is null`);
            pBItem.setFailed();
        }
        else {
            pAbil.setProp(AbAssembly.AssetRepresentationProp, loaded);
            loaded.pos = pBItem.getProp(AbPlacement.PosProp) as number[] ?? [ 0,0,0 ];
            loaded.rot = pBItem.getProp(AbPlacement.RotProp) as number[] ?? [ 0,0,0,1 ];
            pBItem.setReady();
            // Formally set the property so a content changed event will happen
            pBItem.setProp(AbAssembly.AssetRepresentationProp, loaded);
        }
    })
    .catch ( err => {
        Logger.error(`AbAssembly: LoadAssembly: failed load`);
        pBItem.setFailed();
        throw err;
    });
};
