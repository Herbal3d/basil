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

import { Eventing } from '@Eventing/Eventing';
import { BItem, PropValue, SetPropEventParams } from '@BItem/BItem';
import { BItems } from '@BItem/BItems';

import { Ability, RegisterAbility } from '@Abilities/Ability';
import { AbAssembly } from './AbilityAssembly';
import { AbPlacement } from './AbilityPlacement';

import { Graphics, GraphicsBeforeFrameProps } from '@Graphics/Graphics';
import { Object3D } from '@Graphics/Object3d';

import { Vector3 as BJSVector3, Color3 as BJSColor3, Quaternion as BJSQuaternion} from '@babylonjs/core/Maths';

import { EventProcessor, SubscriptionEntry } from '@Eventing/SubscriptionEntry';

import { ParseThreeTuple, ParseFourTuple, JSONstringify } from '@Tools/Utilities';
import { Clamp } from '@Tools/Misc';
import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Tools/Logging';

export const AbCameraName = 'Camera'

// Function that returns an instance of this Ability given a collection of properties (usually from BMessage.IProps)
export function AbCameraFromProps(pProps: BKeyedCollection): AbCamera {
    if (pProps.hasOwnProperty(AbCamera.CameraIndexProp)) {
        let camIndex = 0;
        if (typeof pProps[AbCamera.CameraIndexProp] === 'string') {
            camIndex = parseInt(pProps[AbCamera.CameraIndexProp] as string);
        }
        else {
            if (typeof pProps[AbCamera.CameraIndexProp] === 'number') {
                camIndex = pProps[AbCamera.CameraIndexProp] as number;
            }
        }
        return new AbCamera(camIndex);
    }
    Logger.error(`AbCameraFromProps: Missing required properties for ${AbCameraName}. pProps: ${JSON.stringify(pProps)}`);
};

export enum CameraModes {
    Unknown = 0,
    FirstPerson = 1,
    ThirdPerson = 2,
    FreeLook = 3,
    Orbit = 4,
    Follow = 5
}

// Register the ability with the AbilityFactory. Note this is run when this file is imported.
RegisterAbility( AbCameraName, AbCameraFromProps );

/// <summary>
/// Base camera operation. This holds the state (type of view) and other central
///    camera operations.
/// The Camera BItem has it's own Pos/PosTo properties so it should not have
///    a AbPlacement added to the BItem. This is so the camera can handle
///    the camera movement which is different than things that move.
/// <p>
/// The camera has modes that can be changed:
/// <ul>
///     <li>FirstPerson: where the camera moves and is in front of the 'cameraTargetAvatar'</li>
///     <li>ThirdPerson: where the camera moves and is in back of the 'cameraTargetAvatar'</li>
///     <li>FreeLook: where the camera moves freely controlled by the keyboard/mouse</li>
///     <li>Orbit: where the camera orbits the 'cameraTarget' and is controlled by the mouse/keyboar</li>
///     <li>Follow: where the camera moves with the 'cameraTarget'</li>
/// </p>
/// </summary>
export class AbCamera extends Ability {

    public static PosProp = 'pos';
    public static RotProp = 'rot';
    public static ForProp = 'for';
    public static PosToProp = 'posTo';
    public static RotToProp = 'rotTo';
    public static CameraIndexProp = 'cameraIndex';
    public static CameraModeProp = 'cameraMode';
    public static CameraLookAtProp = 'cameraTarget';
    public static CameraTargetAvatarIdProp = 'cameraTargetAvatarId';
    public static CameraDisplacementProp = 'cameraDisplacement';

    constructor(pIndex: number) {
        super(AbCameraName);
        this._pos = [0,0,0];
        this._posTo = [0,0,0];
        this._rot = [0,0,0,1];
        this._for = 0;
        this.cameraIndex = pIndex;
        this._posMod = this._posToMod = this._rotMod = this._rotToMod = false;
        this._cameraTargetMod = false;
        this._cameraDisplacementMod = false;
    };

    // Someday, multiple cameras
    public cameraIndex: number = 0;

    _cameraMode: CameraModes = CameraModes.ThirdPerson;
    public get cameraMode(): CameraModes { return this._cameraMode; }
    public set cameraMode(pVal: CameraModes) {
        this._cameraMode = pVal;
        Logger.debug(`AbCamera.cameraMode set: id=${this.containingBItem.id}, new mode=${CameraModes[pVal]}`);
    };

    _cameraTarget: number[];
    _cameraTargetMod = false;
    public get cameraTarget(): number[] { return this._cameraTarget; }
    public set cameraTarget(pVal: string | number[]) {
        this._cameraTarget = ParseThreeTuple(pVal);
        this._cameraTargetMod = true;
    };

    _cameraTargetAvatarId: string;    // used for FirstPerson and ThirdPerson
    _cameraTargetAvatarObject: Object3D;
    public get cameraTargetAvatarId(): string { return this._cameraTargetAvatarId; }
    public set cameraTargetAvatarId(pVal: string) {
        this._cameraTargetAvatarId = pVal;
        const avaBItem = BItems.get(pVal);
        if (avaBItem) {
            // This AvatarId might be for another avatar so we need to redo the watchers
            this._clearWatchers();
            this._addAvatarWatchers(avaBItem);
            // call the watcher to do whatever is needed to remember the representation
            this._avatarRepresentationWatcher({
                BItem: avaBItem,
                Ability: undefined,
                PropName: AbAssembly.AssetRepresentationProp,
                NewValue: avaBItem.getProp(AbAssembly.AssetRepresentationProp) as Object3D
            });
        }
        else {
            Logger.error(`AbCamera.cameraTargetAvatarId set: unknown avatar ${pVal}`);
        }
    };

    // Watched avatar representation has changed
    _avatarRepresentationWatcher(pParams: SetPropEventParams): void {
        this._cameraTargetAvatarObject = pParams.NewValue as Object3D;
    };
    _avatarPositionChangeTime: number = Date.now();
    _avatarPosWatcher(pParams: SetPropEventParams): void {
        const newPos = ParseThreeTuple(pParams.NewValue as number[]);
        this._posTo = newPos;
        this._posToMod = true;
        this._avatarPositionChangeTime = Date.now();
    };
    _avatarRotWatcher(pParams: SetPropEventParams): void {
        this._rotTo = ParseFourTuple(pParams.NewValue as number[]);
        this._rotToMod = true;
    };
    // While tracking an avatar, we need to know when its properties change
    _cameraTargetAvatarWatchers: SubscriptionEntry[] = [];
    _addAvatarWatchers(pAvaBItem: BItem): void {
        this._cameraTargetAvatarWatchers.push(
            pAvaBItem.watchProperty(AbAssembly.AssetRepresentationProp,
                this._avatarRepresentationWatcher.bind(this) as EventProcessor));
        this._cameraTargetAvatarWatchers.push(
            pAvaBItem.watchProperty(AbPlacement.PosProp,
                this._avatarPosWatcher.bind(this) as EventProcessor));
        this._cameraTargetAvatarWatchers.push(
            pAvaBItem.watchProperty(AbPlacement.RotProp,
                this._avatarRotWatcher.bind(this) as EventProcessor));
    };
    _clearWatchers(): void {
        const watchers = this._cameraTargetAvatarWatchers;
        this._cameraTargetAvatarWatchers = [];
        watchers.forEach( watcher => {
            Eventing.Unsubscribe(watcher);
        });
    };

    _cameraDisplacement: number[] = Config.world.thirdPersonDisplacement;
    _cameraDisplacementMod: boolean = false;
    public get cameraDisplacement(): number[] { return this._cameraDisplacement; }
    public set cameraDisplacement(pVal: string | number[]) {
        if (pVal) {
            this._cameraDisplacement = ParseThreeTuple(pVal);
        }
        this._cameraDisplacementMod = true;
    };

    _pos: number[] = [0,0,0];
    _posMod = false;
    public get pos(): number[] {
        this._pos = [0,0,0];
        Graphics._camera.position.toArray(this._pos, 0);
        return this._pos;
    };
    public set pos(pVal: string | number[]) {
        if (pVal) {
            this._pos = ParseThreeTuple(pVal);
            this._posTo = this._pos;
            this._posMod = true; // see processBeforeFrame
        }
    };
    // The *To properties will be used to known when to set absolute or to LERP
    _posTo: number[] = [0,0,0];
    _posToMod = false;
    public get posTo(): number[] { return this._posTo; }
    public set posTo(pVal: string | number[]) {
        if (pVal) {
            this._posTo = ParseThreeTuple(pVal);
            this._posToMod = true; // see processBeforeFrame
        }
    };

    _rot: number[] = [0,0,0,1];
    _rotMod = false;
    public get rot(): number[] {
        const rr = [0,0,0,1];
        const rott = Graphics._camera.rotationQuaternion;
        rr[0] = rott.x;
        rr[1] = rott.y;
        rr[2] = rott.z;
        rr[3] = rott.w;
        this._rot = rr;
        return this._rot;
    }
    public set rot(pVal: string | number[]) {
        if (pVal) {
            this._rot = ParseFourTuple(pVal);
            this._rotTo = this._rot;
            this._rotMod = true; // see processBeforeFrame
        }
    };

    _rotTo: number[] = [0,0,0,1];
    _rotToMod = false;
    public get rotTo(): number[] { return this._rotTo; }
    public set rotTo(pVal: string | number[]) {
        if (pVal) {
            this._rotTo = ParseFourTuple(pVal);
            this._rotToMod = true; // see processBeforeFrame
        }
    };

    _for: number = 0;
    public get for(): number { return this._for; }
    public set for(pVal: number) {
        this._for = pVal;
    };

    // Add all the properties from this assembly to the holding BItem
    _beforeFrameWatcher: SubscriptionEntry;
    addProperties(pBItem: BItem): void {
        // Always do this!!
        super.addProperties(pBItem);

        pBItem.addProperty(AbCamera.CameraIndexProp, this);
        pBItem.addProperty(AbCamera.CameraModeProp, this);
        pBItem.addProperty(AbCamera.CameraLookAtProp, this);
        pBItem.addProperty(AbCamera.CameraTargetAvatarIdProp, this);
        pBItem.addProperty(AbCamera.CameraDisplacementProp, this);
        // position
        pBItem.addProperty(AbCamera.PosProp, this);
        pBItem.addProperty(AbCamera.RotProp, this);
        // MoveTo targets
        pBItem.addProperty(AbCamera.PosToProp, this);
        pBItem.addProperty(AbCamera.RotToProp, this);
        // Get and Set the placement frame of reference.
        pBItem.addProperty(AbCamera.ForProp, this);

        this._beforeFrameWatcher = Graphics.WatchBeforeFrame(this._processBeforeFrame.bind(this) as EventProcessor);

        pBItem.setReady();
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        if (pPropertyName === AbCamera.CameraIndexProp) {
            this._cameraMode = CameraModes.Unknown;
        };
        if (pPropertyName === AbCamera.CameraTargetAvatarIdProp) {
            this._clearWatchers();
            if (this._beforeFrameWatcher) {
                Eventing.Unsubscribe(this._beforeFrameWatcher);
                this._beforeFrameWatcher = undefined;
            }
        };
        return;
    };

    _lastCameraType: CameraModes = CameraModes.Unknown;
    _processBeforeFrame(pParms: GraphicsBeforeFrameProps): void {
        // Move the camera
        if (Graphics._camera) {
            // Setup camera depending on mode
            if (this._lastCameraType != this._cameraMode) {
                // Camera type is changing. If changing camera implementation, state must be saved
                // TODO: smarter mode changing. Like FirstPerson to ThirdPerson can just reuse camera.
                if (this._lastCameraType != CameraModes.Unknown) {
                    Logger.debug(`AbilityCamera.processBeforeFrame: releasing camera `);
                    Graphics.releaseCamera();
                }
                // See if the underlying camera implementation has to change
                Logger.debug(`AbilityCamera.processBeforeFrame: setup camera ${CameraModes[this._cameraMode]}`);
                switch (this._cameraMode) {
                    case CameraModes.FreeLook: {
                        Graphics.activateUniversalCamera({
                            name: 'camera0',
                            position: this._pos,
                            rotationQuaternian: this._rot,
                            cameraTarget: this._cameraTarget
                        });
                        break;
                    }
                    case CameraModes.ThirdPerson: {
                        Graphics.activateUniversalCamera({
                            name: 'camera1',
                            position: this._pos,
                            rotationQuaternian: this._rot,
                            attachControl: false
                        });
                        break;
                    }
                    case CameraModes.Orbit: {
                        break;
                    }
                    default: {
                        Logger.error(`AbilityCamera.processBeforeFrame: unknown camera type ${this._cameraMode}`);
                        break;
                    }
                }
                this._lastCameraType = this._cameraMode;
            }

            // Camera is set up, so handle movement
            switch (this._cameraMode) {
                case CameraModes.FreeLook: {
                    // Free look is run by the keyboard so this doesn't update anything
                    if (this._cameraTargetMod) {
                        Graphics._camera.target = BJSVector3.FromArray(this._cameraTarget);
                        this._cameraTargetMod = false;
                    }
                    break;
                }
                case CameraModes.ThirdPerson: {
                    // The camera tracks the specified avatar
                    if (this._cameraTargetAvatarObject) {
                        const avaPos = this._cameraTargetAvatarObject.mesh.position.clone();
                        const newCamPos = this._cameraTargetAvatarObject.mesh.position.clone();
                        newCamPos.x += this._cameraDisplacement[0];
                        newCamPos.y += this._cameraDisplacement[1];
                        newCamPos.z += this._cameraDisplacement[2];
                        // 'avaPos' is where we wish the camera to be

                        // LERP the camera to the target position
                        const moveDuration = Date.now() - this._avatarPositionChangeTime;
                        const moveScale = Clamp(moveDuration / Config.world.cameraMoveIntervalMS, 0, 1);
                        if (moveScale <= 0.98) {
                            const camPos = Graphics._camera.position;
                            const np = BJSVector3.Lerp(camPos, newCamPos, moveScale);
                            Graphics._camera.position = np;

                            const newTarget = BJSVector3.Lerp(Graphics._camera.target, avaPos, moveScale);
                            Graphics._camera.target = newTarget;
                        }
                        else {
                            Graphics._camera.position = newCamPos;
                            Graphics._camera.target = avaPos;
                        };
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        }
        return;
    };
};