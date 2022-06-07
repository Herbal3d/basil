// Copyright 2022 Robert Adams
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
import { BItem, PropValue } from '@BItem/BItem';

import { Graphics, GraphicsStateEventName, GraphicStateEventProps, GraphicStates } from '@Base/Graphics/Graphics';
import { SkyMaterial } from '@babylonjs/materials';

import { Eventing } from '@Base/Eventing/Eventing';
import { EventProcessor } from '@Base/Eventing/SubscriptionEntry';

import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Base/Tools/Logging';
import { Config } from '@Base/Config';

export const AbEnvironName = 'Environ'
// REMEMBER TO ADD the ability registration in AbilityManagement.ts

// Function that returns an instance of this Ability given a collection of properties (usually from BMessage.IProps)
export function AbEnvironFromProps(pProps: BKeyedCollection): AbEnviron {
    return new AbEnviron(pProps[AbEnviron.SolarAzimuthProp] as PropValue,
                pProps[AbEnviron.SkyTurbidityProp] as PropValue,
                pProps[AbEnviron.SkyRayleighProp] as PropValue);
    Logger.error(`AbAssemblyFromProps: Missing required properties for ${AbEnvironName}. pProps: ${JSON.stringify(pProps)}`);
};

// Register the ability with the AbilityFactory. Note this is run when this file is imported.
RegisterAbility(AbEnvironName, AbEnvironFromProps);

export class AbEnviron extends Ability {

    // When an ability is referenced in BMessage.IProps, these are the types of values passed in the request
    // These string names are the parameter names passed in the BMessage.IProps structure and they
    //     coorespond to the class property names.
    public static SolarAzimuthProp = 'solarAzimuth';
    public static SkyTurbidityProp = 'skyTurbidity';
    public static SkyRayleighProp = 'skyRayleigh';

    constructor(pAzimuth?: PropValue, pTurbidity?: PropValue, pRayleigh?: PropValue) {
        super(AbEnvironName);
        this.solarAzimuth = pAzimuth ?? Config.webgl.renderer.BabylonJS.environment.skyMaterial.azimuth;
        this.skyTurbidity = pTurbidity ?? Config.webgl.renderer.BabylonJS.environment.skyMaterial.turbidity;
        this.skyRayleigh = pRayleigh ?? Config.webgl.renderer.BabylonJS.environment.skyMaterial.rayleigh;
    };

    // Use getters and setters for properties that cause things to happen
    _solarAzimuth: number;
    public get solarAzimuth(): number { 
        return this._solarAzimuth;
    }
    public set solarAzimuth(pVal: PropValue) { 
        this._solarAzimuth = this.propValueToFloat(pVal);
    }
    _skyTurbidity: number;
    public get skyTurbidity(): number { 
        return this._skyTurbidity;
    }
    public set skyTurbidity(pVal: PropValue) { 
        this._skyTurbidity = this.propValueToFloat(pVal);
    }
    _skyRayleigh: number;
    public get skyRayleigh(): number { 
        return this._skyRayleigh;
    }
    public set skyRayleigh(pVal: PropValue) { 
        this._skyRayleigh = this.propValueToFloat(pVal);
    }

    // Add all the properties from this assembly to the holding BItem
    addProperties(pBItem: BItem): void {
        // Always do this!!
        super.addProperties(pBItem);

        pBItem.addProperty(AbEnviron.SolarAzimuthProp, this);
        pBItem.addProperty(AbEnviron.SkyTurbidityProp, this);
        pBItem.addProperty(AbEnviron.SkyRayleighProp, this);

        // Have to wait until the graphics system is initialized before there is a scene to set
        Eventing.Subscribe(GraphicsStateEventName, this._onGraphicsReady.bind(this) as EventProcessor);

        pBItem.setReady();
    };
    _onGraphicsReady(pEvent: GraphicStateEventProps): void {
        if (pEvent.state === GraphicStates.Initialized || pEvent.state === GraphicStates.Rendering) {   
            this._initializeEnvironment();
        };
    };
    _initializeEnvironment(): void {
        if (Config.webgl.renderer.BabylonJS.environment.skyMaterial) {
            Config.webgl.renderer.BabylonJS.environment.skyMaterial.azimuth = this.solarAzimuth;
            Config.webgl.renderer.BabylonJS.environment.skyMaterial.turbidity = this.skyTurbidity;
            Config.webgl.renderer.BabylonJS.environment.skyMaterial.rayleigh = this.skyRayleigh; }
    };
    _updateEnvironment(): void {
        if (Graphics.IsActive()) {
            const skybox = Graphics.GetSkybox();
            if (skybox) {
                const skyMaterial = skybox.material;
                if (skyMaterial instanceof SkyMaterial) {
                    skyMaterial.azimuth = this.solarAzimuth;
                    skyMaterial.turbidity = this.skyTurbidity;
                    skyMaterial.rayleigh = this.skyRayleigh;
                };
            };
        };
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };
};

