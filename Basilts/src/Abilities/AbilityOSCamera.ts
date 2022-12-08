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

import { BItems } from '@BItem/BItems';
import { BItem, PropValue, SetPropEventParams } from '@BItem/BItem';
import { WellKnownCameraName, WellKnownMouseName, WellKnownKeyboardName } from '@BItem/WellKnownBItems';

import { Ability, RegisterAbility } from '@Abilities/Ability';
import { AbCamera, CameraModes } from '@Abilities/AbilityCamera';
// import { AbKeyboard } from '@Abilities/AbilityKeyboard';
// import { AbMouse } from '@Abilities/AbilityMouse';

import { Eventing } from '@Base/Eventing/Eventing';
import { EventProcessor, SubscriptionEntry } from '@Eventing/SubscriptionEntry';

import { Graphics, GraphicsBeforeFrameProps } from '@Graphics/Graphics';
import { EventState, KeyboardInfo, PointerInfo, Scene } from "@babylonjs/core";

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
        const disp = pProps.hasOwnProperty(AbOSCamera.OSCameraDisplacementProp)
                    ? pProps[AbOSCamera.OSCameraDisplacementProp] as number[]
                    : Config.world.thirdPersonDisplacement;
        return new AbOSCamera(cameraMode, disp);
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

    _cameraBItem: BItem;
    _mouseBItem: BItem;       // ID of mouse BItem
    _keyboardBItem: BItem;    // ID of keyboard BItem

    _pickedScreenPoint: number[] = [ 10, 10 ];
    _pickedPoint: number[] = [ 10, 10, 10 ];
    _pickedDistance: number = 10;

    constructor(pCameraMode: number, pCameraDisp: number[]) {
        super(AbOSCameraName);

        // Find name of camera before we initialize its properties
        this._cameraBItem = BItems.getWellKnownBItem(WellKnownCameraName);

        this.OSCameraMode = pCameraMode;
        this.OSCameraDisplacement = pCameraDisp;

        // Logger.debug(`AbOSCamera.const: mode=${pCameraMode}, disp=${pCameraDisp}, camId=${this._cameraId}`);
    };

    // Make the properties available
    _cameraMode: OSCameraModes = OSCameraModes.Third;
    _cameraModeMod = true;
    public get OSCameraMode(): OSCameraModes {
        return this._cameraMode;
    }
    // Setting CameraMode param can be either mode number or the mode name string (First, Orbit, Third)
    public set OSCameraMode(pVal: PropValue) {
        let newCameraMode = this._cameraMode;
        if (typeof(pVal) === 'number') {
            if (pVal in OSCameraModes) {
                newCameraMode = <OSCameraModes>pVal;
            }
        }
        else if (typeof(pVal) === 'string') {
            const entry = Object.entries(OSCameraModes).find(([key,val]) => key === pVal);
            newCameraMode = entry ? <OSCameraModes>entry[1] : newCameraMode;
        }
        if (newCameraMode != this._cameraMode) {
            this._cameraMode = newCameraMode;
            this._cameraModeMod = true;
        }
    }

    _cameraDisplacement: number[] = Config.world.thirdPersonDisplacement;
    public get OSCameraDisplacement(): number[] {
        return this._cameraDisplacement;
    }
    public set OSCameraDisplacement(pVal: PropValue) {
        const val = ParseThreeTuple(pVal as string | number[]);
        this._cameraDisplacement = val;
    }

    // Add all the properties from this assembly to the holding BItem
    _beforeFrameWatcher: SubscriptionEntry;
    addProperties(pBItem: BItem): void {
        // Always do this!!
        super.addProperties(pBItem);

        pBItem.addProperty(AbOSCamera.OSCameraModeProp, this);
        pBItem.addProperty(AbOSCamera.OSCameraDisplacementProp, this);

        // This uses the BeforeFrame event to actually set the camera mode
        Graphics.WatchBeforeFrame(this._processBeforeFrame.bind(this) as EventProcessor);

        /* Code left over from processing mouse and keyboard with AbMouse and AbKeyboard
        this._mouseBItem = BItems.getWellKnownBItem(WellKnownMouseName);
        this._keyboardBItem = BItems.getWellKnownBItem(WellKnownKeyboardName);

        this._keyboardBItem.watchProperty(AbKeyboard.KeyDownProp, this._processKeyboard.bind(this) as EventProcessor);
        this._mouseBItem.watchProperty(AbMouse.DownProp, this._processMouse.bind(this) as EventProcessor);
        */

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        Graphics._scene.onPointerObservable.add(this._processScenePointerObservable.bind(this));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        Graphics._scene.onKeyboardObservable.add(this._processSceneKeyboardObservable.bind(this));
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        if (this._beforeFrameWatcher) {
            Eventing.Unsubscribe(this._beforeFrameWatcher);
            this._beforeFrameWatcher = undefined;
        }
        return;
    };

    _processScenePointerObservable(pPtrInfo: PointerInfo): void {
        const altkey = pPtrInfo.event.altKey;
        const button = pPtrInfo.event.button;
        // Logger.debug(`AbOSAvaUpdate.processPointer: mouse: alt=${altkey}, button=${button}`);
        if (altkey && button == 0) {
            // Save the pick location and set the mode to Orbit
            // Note that this only causes processing if the CameraMode changes
            //     and the actual processing is done at BeforeFrame time
            this._pickedScreenPoint = [ pPtrInfo.event.clientX, pPtrInfo.event.clientY ];
            const point = pPtrInfo.pickInfo.pickedPoint;
            this._pickedPoint = [ point.x, point.y, point.z ];
            this._pickedDistance = pPtrInfo.pickInfo.distance;
            this.OSCameraMode = OSCameraModes.Orbit;
            // Logger.debug(`AbOSAvaUpdate.processPointer:      pickloc=${JSONstringify(this._pickedPoint)}, dist=${this._pickedDistance}`);
        }
    };

    _processSceneKeyboardObservable(pEvt: KeyboardInfo, pEventState: EventState): void {
        // this
        const keyName = pEvt.event.key;
        const down = true;
        // Logger.debug(`AbOSAvaUpdate.processKeyboard: keyboard event: ${keyName}`);
        switch (keyName) {
            case 'Escape':      this.doESC(down); break;
            default:
                break;
        }
    };

    // Just before the frame is rendered, update the camera state
    _processBeforeFrame(pParms: GraphicsBeforeFrameProps): void {
        if (this._cameraModeMod) {
            this._cameraModeMod = false;
            this.setCameraMode(pParms.scene);
        }
    };

    /* Code left over from processing mouse and keyboard using AbMouse and AbKeyboard
    _processMouse(pEvent: SetPropEventParams): void {
        const abil = pEvent.Ability as AbMouse;

        const altkey = abil.ptrAlt;
        const down = abil.ptrDown;  // reports the button that is down. -1 if buttons up
        const button = abil.ptrButton;  // reports button that is down: 0, 1, 2. -1 if none
        Logger.debug(`AbOSAvaUpdate.processMouse: mouse: alt=${abil.ptrAlt}, down=${abil.ptrDown}, button=${abil.ptrButton}`);
        if (altkey && down && button == 0) {
            // Save the pick location and set the mode to Orbit
            // Note that this only causes processing if the CameraMode changes
            //     and the processing is done at BeforeFrame time
            this._pickedScreenPoint = abil.ptrClientXY;
            this.OSCameraMode = OSCameraModes.Orbit;
        }
    };

    _processKeyboard(pEvent: SetPropEventParams): void {
        const abil = pEvent.Ability as AbKeyboard;
        Logger.debug(`AbOSAvaUpdate.processKeyboard: keyboard event: ${abil.keyName}`);
        switch (abil.keyName) {
            case 'Escape':      this.doESC(abil.keyDown); break;
            case 'Alt':         this.doALT(abil.keyDown); break;
            default:
                break;
        }
    };
    */

    // ESC key cancels any orbiting and sets Third person
    doESC(pKeyUpDown: boolean) {
        this.OSCameraMode = OSCameraModes.Third;
    };

    doALT(pKeyUpDown: boolean) {
        // ALT should change the cursor so the user knows they are picking
    };

    // Set the graphics camera based on the property settings.
    setCameraMode(pScene: Scene): void {
        switch (this._cameraMode) {
            case OSCameraModes.First: {
                break;
            }
            case OSCameraModes.Third: {
                BItems.setProperties(this._cameraBItem, {
                    cameraMode: CameraModes.ThirdPerson,
                    cameraTargetAvatarId: this.containingBItem.id,
                    cameraDisplacement: this._cameraDisplacement
                });
                Logger.debug(`AbOSCamera.setCameraMode: ThirdPerson: disp=${JSONstringify(this.OSCameraDisplacement)}`);
                break;
            }
            case OSCameraModes.Orbit: {
                // const pickInfo = pScene.pick(this._pickLocation[0], this._pickLocation[1], null, true, null);
                // const pickedPoint = [ pickInfo.pickedPoint.x, pickInfo.pickedPoint.y, pickInfo.pickedPoint.z ];
                Logger.debug(`AbOSCamera.setCameraMode: Orbit: pick=${JSONstringify(this._pickedScreenPoint)}, point=${JSONstringify(this._pickedPoint)}`);
                BItems.setProperties(this._cameraBItem, {
                    cameraMode: CameraModes.Orbit,
                    cameraTarget: this._pickedPoint,
                    cameraDisplacement: [ 0, this._pickedDistance, 0 ]
                });
                Logger.debug(`AbOSCamera.setCameraMode: Orbit: disp=${JSONstringify(this.OSCameraDisplacement)}`);
                break;
            }
            default: {
                break;
            }
        }
    };

};

