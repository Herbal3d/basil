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

import { Ability, RegisterAbility, ParseValueToType } from '@Abilities/Ability';
import { PropDefaultGetter, PropDefaultSetter } from '@Abilities/Ability';
import { BItem, PropValue, PropValueTypes } from '@BItem/BItem';

import { Graphics, GraphicsStateChangeProps, GraphicStates } from '@Base/Graphics/Graphics';
import { SkyMaterial } from '@babylonjs/materials';

import { Eventing } from '@Base/Eventing/Eventing';
import { EventProcessor } from '@Base/Eventing/SubscriptionEntry';

import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Base/Tools/Logging';
import { Config } from '@Base/Config';

export const AbEnvironName = 'Environ'

// Function that returns an instance of this Ability given a collection of properties (usually from BMessage.IProps)
export function AbEnvironFromProps(pProps: BKeyedCollection): AbEnviron {
    return new AbEnviron(pProps[AbEnviron.SolarAzimuthProp] as PropValue,
                pProps[AbEnviron.SkyTurbidityProp] as PropValue,
                pProps[AbEnviron.SkyRayleighProp] as PropValue);
};

// Register the ability with the AbilityFactory. Note this is run when this file is imported.
RegisterAbility(AbEnvironName, AbEnvironFromProps);

// NOTE: this is not complete and has no function. See Graphics.ts for temporary Skybox setup
export class AbEnviron extends Ability {

    // When an ability is referenced in BMessage.IProps, these are the types of values passed in the request
    // These string names are the parameter names passed in the BMessage.IProps structure and they
    //     coorespond to the class property names.
    public static SolarAzimuthProp = 'solarAzimuth';
    public static SkyTurbidityProp = 'skyTurbidity';
    public static SkyRayleighProp = 'skyRayleigh';

    constructor(pAzimuth?: PropValue, pTurbidity?: PropValue, pRayleigh?: PropValue) {
        super(AbEnvironName, {
                [AbEnviron.SolarAzimuthProp]: {
                    propName: AbEnviron.SolarAzimuthProp,
                    propType: PropValueTypes.Number,
                    propDefault: pAzimuth ?? Config.webgl.renderer.BabylonJS.environment.skyMaterial.azimuth,
                    propDesc: 'sun azimuth',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbEnviron.SkyRayleighProp]: {
                    propName: AbEnviron.SkyRayleighProp,
                    propType: PropValueTypes.Number,
                    propDefault: pRayleigh ?? Config.webgl.renderer.BabylonJS.environment.skyMaterial.rayleigh,
                    propDesc: 'sun rayleith parameter',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbEnviron.SkyTurbidityProp]: {
                    propName: AbEnviron.SkyTurbidityProp,
                    propType: PropValueTypes.Number,
                    propDefault: pTurbidity ?? Config.webgl.renderer.BabylonJS.environment.skyMaterial.turbidity,
                    propDesc: 'sun turbitdy parameter',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },

        });
    };

    // Add all the properties from this assembly to the holding BItem
    addProperties(pBItem: BItem): void {
        // Always do this!!
        super.addProperties(pBItem);

        pBItem.setReady();

        // Have to wait until the graphics system is initialized before there is a scene to set
        Graphics.WatchGraphicsStateChange(this._onGraphicsReady.bind(this) as EventProcessor);
    };
    _onGraphicsReady(pEvent: GraphicsStateChangeProps): void {
        if (pEvent.state === GraphicStates.Initialized || pEvent.state === GraphicStates.Rendering) {   
            this._initializeEnvironment();
        };
    };
    _initializeEnvironment(): void {
        return;
    };
    _updateEnvironment(): void {
        if (Graphics.IsActive()) {
            const skybox = Graphics.GetSkybox();
            if (skybox) {
                const skyMaterial = skybox.material;
                if (skyMaterial instanceof SkyMaterial) {
                    skyMaterial.azimuth = <number>this.getProp(AbEnviron.SolarAzimuthProp);
                    skyMaterial.turbidity = <number>this.getProp(AbEnviron.SkyTurbidityProp);
                    skyMaterial.rayleigh = <number>this.getProp(AbEnviron.SkyRayleighProp);
                };
            };
        };
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };
};

