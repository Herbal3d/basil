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

import { Ability, RegisterAbility } from '@Abilities/Ability';
import { AbPlacement } from '@Abilities/AbilityPlacement';
import { BItem, PropValue, SetPropEventParams } from '@BItem/BItem';

import { AuthToken } from '@Tools/Auth';

import { BKeyedCollection } from '@Tools/bTypes';
import { LoadSimpleAsset, LoadAssetParams, DeleteAsset } from '@Graphics/GraphicOps';
import { Object3D } from '@Graphics/Object3d';
import { Logger } from '@Base/Tools/Logging';
import { EventProcessor, SubscriptionEntry } from '@Base/Eventing/SubscriptionEntry';
import { JSONstringify } from '@Base/Tools/Utilities';

export const AbAssemblyName = 'Assembly';

interface AssemblyAfterRequestProps {
    Ability: AbAssembly;
    BItem: BItem;
};

export function AbAssemblyFromProps(pProps: BKeyedCollection): AbAssembly {
    if (pProps.hasOwnProperty(AbAssembly.AssetUrlProp) && pProps.hasOwnProperty(AbAssembly.AssetLoaderProp)) {
        const assetUrl = pProps[AbAssembly.AssetUrlProp] as string;
        const assetLoader = pProps[AbAssembly.AssetLoaderProp] as string;
        if (assetUrl && assetLoader) {
            return new AbAssembly(assetUrl, assetLoader);
        };
    };
    Logger.error(`AbAssemblyFromProps: Missing required properties for ${AbAssemblyName}. pProps: ${JSON.stringify(pProps)}`);
};

// Register the ability with the AbilityFactory. Note this is run when this file is imported.
RegisterAbility( AbAssemblyName, AbAssemblyFromProps );

// An "Assembly" is a thing that can be represented or displayed in the world.
// It can be a mesh, a shader, texture, or anything else that is loaded and used in the world.
export class AbAssembly extends Ability {
    static AssetUrlProp = 'assetUrl';
    static AssetLoaderProp = 'assetLoader';
    static AssetAuthProp = 'assetAuth';
    static AssetRepresentationProp = 'assetRepresentation';

    _assetUrl: PropValue;
    public get assetUrl(): PropValue { return this._assetUrl; }
    public set assetUrl(pVal: PropValue) {
        this._assetUrl = pVal;
        Logger.debug(`AbAssembly.AssetUrl.set: setting BItem to LOADING and scheduling load`);
        this.containingBItem.setLoading();
        void LoadAssembly(this, this.containingBItem);
    } 

    public assetLoader: PropValue;

    _assetAuth: AuthToken;
    public get assetAuth(): PropValue { return this._assetAuth; }
    public set assetAuth(pVal: PropValue) {
        if (typeof(pVal) === 'string') {
            this._assetAuth = new AuthToken(pVal);
        }
        else {
            if (pVal instanceof AuthToken) {
                this._assetAuth = pVal;
            };
        };
    }

    public assetRepresenation: Object3D;

    constructor(pAssetUrl: string, pAssetLoader: string) {
        super(AbAssemblyName);
        this._assetUrl = pAssetUrl;
        this.assetLoader = pAssetLoader;
    };

    addProperties(pBItem: BItem): void {
        super.addProperties(pBItem);

        pBItem.addProperty(AbAssembly.AssetUrlProp, this);

        // Get and Set the AssetLoader needed for the asset
        pBItem.addProperty(AbAssembly.AssetLoaderProp, this);
        // Get and Set the Asset's access token
        // Set value can be either an AuthToken or a string (which is wrapped in an AuthToken)
        pBItem.addProperty(AbAssembly.AssetAuthProp, this);
        // Get the Assembly's graphical representation.
        // Very dependent on the underlying implementation. This is a ThreeJS Object3D
        // All abilities that create in-world representations present this property
        pBItem.addProperty(AbAssembly.AssetRepresentationProp, this, { private: true });

        // Has the side effect of causing the URL to be loaded (Graphics LoadAssembly)
        pBItem.setProp(AbAssembly.AssetUrlProp, this._assetUrl);

        // We watch for position changes and set them in the representation
        this._posChangeWatcher = pBItem.watchProperty(AbPlacement.PosProp,
                this._processPosChange.bind(this) as EventProcessor);
        this._rotChangeWatcher = pBItem.watchProperty(AbPlacement.RotProp,
                this._processRotChange.bind(this) as EventProcessor);
    };

    // When my properties are being removed, the asset is no longer in world.
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        if (pPropertyName === AbAssembly.AssetRepresentationProp) {
            if (this.assetRepresenation) {
                DeleteAsset(this.assetRepresenation);
                this.assetRepresenation = undefined;
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
        if (this.assetRepresenation) {
            this.assetRepresenation.pos = pParms.NewValue as number[];
        }
    };
    // We're told the rotation changed
    _rotChangeWatcher: SubscriptionEntry;
    _processRotChange(pParms: BKeyedCollection): void {
        if (this.assetRepresenation) {
            this.assetRepresenation.rot = pParms.NewValue as number[];
        }
    };
};

// Returns a Promise that loads an assembly given the URL and asset type properties.
// Will load the asset and set the BItem's state to READY.
// Promise fails of the asset can't be loaded and the BItem's state is set to FAILED
export async function LoadAssembly(pAbil: AbAssembly, pBItem: BItem): Promise<void> {
    Logger.debug(`AbAssembly: LoadAssembly(${pAbil._assetUrl})`);

    const loaderProps: LoadAssetParams = {
        AssetURL: <string>pAbil._assetUrl,
        AssetLoader: <string>pAbil.assetLoader,
        Auth: pAbil._assetAuth?.token
    };

    LoadSimpleAsset(loaderProps)
    .then ( loaded => {
        Logger.debug(`AbAssembly: LoadAssembly: successful load`);
        if (typeof(loaded) === 'undefined') {
            Logger.error(`AbAssembly: LoadAssembly: loaded object is null`);
            pBItem.setFailed();
        }
        else {
            pAbil.assetRepresenation = loaded;
            loaded.pos = pBItem.getProp(AbPlacement.PosProp) as number[] ?? [ 0,0,0 ];
            loaded.rot = pBItem.getProp(AbPlacement.RotProp) as number[] ?? [ 0,0,0,1 ];
            pBItem.setReady();
            // Formally set the property so a content changed event will happen
            pBItem.setProp(AbAssembly.AssetRepresentationProp, loaded);
        }
    })
    .catch ( err => {
        Logger.debug(`AbAssembly: LoadAssembly: failed load`);
        pBItem.setFailed();
        throw err;
    });
};
