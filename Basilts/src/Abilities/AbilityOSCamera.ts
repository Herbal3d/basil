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

import { Config } from '@Base/Config';

import { Ability, RegisterAbility } from '@Abilities/Ability';
import { AbCamera, CameraModes } from '@Abilities/AbilityCamera';

import { BItems } from '@BItem/BItems';
import { BItem, PropValue } from '@BItem/BItem';
import { WellKnownCameraName } from '@BItem/WellKnownBItems';
import { Eventing } from '@Base/Eventing/Eventing';
import { EventProcessor, SubscriptionEntry } from '@Eventing/SubscriptionEntry';
import { Graphics, GraphicsBeforeFrameProps } from '@Graphics/Graphics';

import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Tools/Logging';
import { JSONstringify, ParseThreeTuple } from '@Base/Tools/Utilities';

export const AbOSCameraName = 'OSCamera'

export enum OSCameraModes {
    First = 1,
    Third = 2,
    Orbit = 3
}

// Function that returns an instance of this Ability given a collection of properties (usually from BMessage.IProps)
export function AbOSCameraFromProps(pProps: BKeyedCollection): AbOSCamera {
    if (pProps.hasOwnProperty(AbOSCamera.OSCameraModeProp)) {
        const cameraMode = pProps[AbOSCamera.OSCameraModeProp] as number;
        return new AbOSCamera(cameraMode);
    };
    Logger.error(`AbAssemblyFromProps: Missing required properties for ${AbOSCameraName}. pProps: ${JSON.stringify(pProps)}`);
};

// Register the ability with the AbilityFactory. Note this is run when this file is imported.
RegisterAbility(AbOSCameraName, AbOSCameraFromProps);

// AbOSCamera presents an OpenSimulator viewer camera-like interface.
// The camera has three modes:
//  1) Avatar third person follow (initial and entered by ESC)
//  2) Avatar first person follow (mouse wheel moves camera in an out from first to third)
//  3) Orbit item (alt-click on scene item then orbit around picked point)
// Adding this Ability to a BItem will essentually take over the UI camera control.

export class AbOSCamera extends Ability {

    // When an ability is referenced in BMessage.IProps, these are the types of values passed in the request
    // These string names are the parameter names passed in the BMessage.IProps structure and they
    //     coorespond to the class property names.
    public static OSCameraModeProp = 'OSCameraMode';
    public static OSCameraDisplacementProp = 'OSCameraDisplacement';

    _cameraId: string;

    constructor(pCameraMode: number) {
        super(AbOSCameraName);
        this._cameraMode = pCameraMode;
        this._cameraModeMod = true;
    };

    // Make the properties available
    _cameraMode: OSCameraModes = OSCameraModes.Third;
    _cameraModeMod = true;
    public get OSCameraMode(): OSCameraModes {
        return this._cameraMode;
    }
    public set OSCameraMode(pVal: PropValue) {
        if (typeof(pVal) === 'number') {
            if (pVal in OSCameraModes) {
                this._cameraMode = <OSCameraModes>pVal;
            }
        }
        else if (typeof(pVal) === 'string') {
            const entry = Object.entries(OSCameraModes).find(([key,val]) => key === pVal);
            this._cameraMode = entry ? <OSCameraModes>entry[1] : OSCameraModes.Third;
        }
        this._cameraModeMod = true;
    }

    _cameraDisplacement: number[] = Config.world.thirdPersonDisplacement;
    public get OSCameraDisplacement(): number[] {
        return this._cameraDisplacement;
    }
    public set OSCameraDisplacement(pVal: PropValue) {
        const val = ParseThreeTuple(pVal as string | number[]);
        this._cameraDisplacement = val;
        BItems.setProp(this._cameraId, AbCamera.CameraDisplacementProp, val);
    }

    // Add all the properties from this assembly to the holding BItem
    _beforeFrameWatcher: SubscriptionEntry;
    addProperties(pBItem: BItem): void {
        // Always do this!!
        super.addProperties(pBItem);

        pBItem.addProperty(AbOSCamera.OSCameraModeProp, this);
        pBItem.addProperty(AbOSCamera.OSCameraDisplacementProp, this);

        // Find name of camera
        this._cameraId = BItems.getWellKnownBItemId(WellKnownCameraName);

        Graphics.WatchBeforeFrame(this._processBeforeFrame.bind(this) as EventProcessor);
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        if (this._beforeFrameWatcher) {
            Eventing.Unsubscribe(this._beforeFrameWatcher);
            this._beforeFrameWatcher = undefined;
        }
        return;
    };

    _processBeforeFrame(pParms: GraphicsBeforeFrameProps): void {
        if (this._cameraModeMod) {
            this._cameraModeMod = false;
            this.setCameraMode();
        }
    }

    setCameraMode(): void {
        switch (this._cameraMode) {
            case OSCameraModes.First: {
                break;
            }
            case OSCameraModes.Third: {
                BItems.setPropertiesById(this._cameraId, {
                    cameraMode: CameraModes.ThirdPerson,
                    cameraTargetAvatarId: this.containingBItem.id,
                    cameraDisplacement: Config.world.thirdPersonDisplacement
                });
                Logger.debug(`AbOSCamera.setCameraMode: ThirdPerson: disp=${JSONstringify(Config.world.thirdPersonDisplacement)}`);
                break;
            }
            case OSCameraModes.Orbit: {
                break;
            }
            default: {
                break;
            }
        }
    }

};

