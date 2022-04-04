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
import { BItem, PropValue } from '@BItem/BItem';

import { AuthToken } from '@Tools/Auth';

import { BKeyedCollection } from '@Tools/bTypes';
import { LoadSimpleAsset, LoadAssetParams } from '@Graphics/GraphicOps';
import { Object3D } from '@Graphics/Object3d';
import { Logger } from '@Base/Tools/Logging';

export const AssemblyAbilityName = 'Assembly';

interface AssemblyAfterRequestProps {
    Ability: AbilityAssembly;
    BItem: BItem;
};

export function AbilityAssemblyFromProps(pProps: BKeyedCollection): AbilityAssembly {
    return new AbilityAssembly(pProps[AbilityAssembly.AssetUrlProp], pProps[AbilityAssembly.AssetLoaderProp]);
};

// An "Assembly" is a thing that can be represented or displayed in the world.
// It can be a mesh, a shader, texture, or anything else that is loaded and used in the world.
export class AbilityAssembly extends Ability {
    static AssetUrlProp = 'assetUrl';
    static AssetLoaderProp = 'assetLoader';
    static AssetAuthProp = 'assetAuth';
    static AssetRepresentationProp = 'assetRepresentation';

    _assetUrl: PropValue;
    public get assetUrl(): PropValue { return this._assetUrl; }
    public set assetUrl(pVal: PropValue) {
        this._assetUrl = pVal;
        Logger.debug(`AbilityAssembly.AssetUrl.set: setting BItem to LOADING and scheduling load`);
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
        super(AssemblyAbilityName);
        this._assetUrl = pAssetUrl;
        this.assetLoader = pAssetLoader;
    };

    addProperties(pBItem: BItem): void {
        super.addProperties(pBItem);

        // Has the side effect of causing the URL to be loaded (Graphics LoadAssembly)
        pBItem.addProperty(AbilityAssembly.AssetUrlProp, this);
        pBItem.setProp(AbilityAssembly.AssetUrlProp, this._assetUrl);

        // Get and Set the AssetLoader needed for the asset
        pBItem.addProperty(AbilityAssembly.AssetLoaderProp, this);
        // Get and Set the Asset's access token
        // Set value can be either an AuthToken or a string (which is wrapped in an AuthToken)
        pBItem.addProperty(AbilityAssembly.AssetAuthProp, this);
        // Get the Assembly's graphical representation.
        // Very dependent on the underlying implementation. This is a ThreeJS Object3D
        // All abilities that create in-world representations present this property
        pBItem.addProperty(AbilityAssembly.AssetRepresentationProp, this, { private: true });
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };
};

// Returns a Promise that loads an assembly given the URL and asset type properties.
// Will load the asset and set the BItem's state to READY.
// Promise fails of the asset can't be loaded and the BItem's state is set to FAILED
export async function LoadAssembly(pAbil: AbilityAssembly, pBItem: BItem): Promise<void> {
    Logger.debug(`AbilityAssembly: LoadAssembly(${pAbil._assetUrl})`);

    const loaderProps: LoadAssetParams = {
        AssetURL: <string>pAbil._assetUrl,
        AssetLoader: <string>pAbil.assetLoader,
        Auth: pAbil._assetAuth?.token
    };

    LoadSimpleAsset(loaderProps)
    .then ( loaded => {
        Logger.debug(`AbilityAssembly: LoadAssembly: successful load`);
        if (typeof(loaded) === 'undefined') {
            Logger.error(`AbilityAssembly: LoadAssembly: loaded object is null`);
            pBItem.setFailed();
        }
        else {
            pAbil.containingBItem.setProp(AbilityAssembly.AssetRepresentationProp, loaded);
            pBItem.setReady();
        }
    })
    .catch ( err => {
        Logger.debug(`AbilityAssembly: LoadAssembly: failed load`);
        pBItem.setFailed();
        throw err;
    });
};
