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
import { AbAssembly } from './AbilityAssembly';

import { BItem, PropValue, SetPropEventParams } from '@BItem/BItem';
import { BItems } from '@BItem/BItems';

import { Graphics } from '@Graphics/Graphics';
import { Object3D } from '@Graphics/Object3d';

import { Vector3 as BJSVector3, Color3 as BJSColor3, Quaternion as BJSQuaternion} from '@babylonjs/core/Maths';

import { EventProcessor, SubscriptionEntry } from '@Eventing/SubscriptionEntry';

import { ParseThreeTuple, ParseFourTuple, JSONstringify } from '@Tools/Utilities';
import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Tools/Logging';
import { Eventing } from '@Eventing/Eventing';

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
    };

    // Someday, multiple cameras
    public cameraIndex: number = 0;

    _cameraMode: CameraModes = CameraModes.ThirdPerson;
    _cameraModeChanged: boolean = false;
    public get cameraMode(): CameraModes { return this._cameraMode; }
    public set cameraMode(pVal: CameraModes) {
        this._cameraMode = pVal;
        this._cameraModeChanged = true;
        Logger.debug(`AbCamera.cameraMode set: id=${this.containingBItem.id}, new mode=${pVal}`);
    };

    _cameraTarget: number[];
    _cameraTargetMod = false;
    public get cameraTarget(): number[] { return this._cameraTarget; }
    public set cameraTarget(pVal: string | number[]) {
        this._cameraTarget = ParseThreeTuple(pVal);
        this._cameraTargetMod = true;
    }

    _cameraTargetAvatarId: string;    // used for FirstPerson and ThirdPerson
    _cameraTargetAvatarObject: Object3D;
    _cameraTargetAvatarWatcher: SubscriptionEntry;
    public get cameraTargetAvatarId(): string { return this._cameraTargetAvatarId; }
    public set cameraTargetAvatarId(pVal: string) {
        this._cameraTargetAvatarId = pVal;
        const avaBItem = BItems.get(pVal);
        if (avaBItem) {
            this._avatarRepresentationWatcher({
                BItem: avaBItem,
                Ability: undefined,
                PropName: AbAssembly.AssetRepresentationProp,
                NewValue: avaBItem.getProp(AbAssembly.AssetRepresentationProp) as Object3D
            })
        }
        // Need to watch for avatar representation changing
        if (this._cameraTargetAvatarWatcher) {
            // This AvatarId might be for another avatar so we need to redo the watcher
            Eventing.Unsubscribe(this._cameraTargetAvatarWatcher);
        }
        this._cameraTargetAvatarWatcher =
            avaBItem.watchProperty(AbAssembly.AssetRepresentationProp, this._avatarRepresentationWatcher.bind(this) as EventProcessor);
    };

    _avatarRepresentationWatcher(pParams: SetPropEventParams): void {
        this._cameraTargetAvatarObject = pParams.NewValue as Object3D;
        // If the camera is following, update the camera
        if (this._cameraMode === CameraModes.FirstPerson || this._cameraMode === CameraModes.ThirdPerson) {
        }
    };

    _cameraDisplacement: number[] = [0,-0.5,0.5];
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
    public get pos(): number[] { return this._pos; }
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
    public get posTo(): number[] { return this._pos; }
    public set posTo(pVal: string | number[]) {
        if (pVal) {
            this._posTo = ParseThreeTuple(pVal);
            this._posToMod = true; // see processBeforeFrame
        }
    };

    _rot: number[] = [0,0,0,1];
    _rotMod = false;
    public get rot(): number[] { return this._rot; }
    public set rot(pVal: string | number[]) {
        if (pVal) {
            this._rot = ParseFourTuple(pVal);
            this._rotTo = this._rot;
            this._rotMod = true; // see processBeforeFrame
        }
    };

    _rotTo: number[] = [0,0,0,1];
    _rotToMod = false;
    public get rotTo(): number[] { return this._rot; }
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


        Graphics.WatchBeforeFrame(this._processBeforeFrame.bind(this) as EventProcessor);

        pBItem.setReady();
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        if (pPropertyName === AbCamera.CameraIndexProp) {
            this._cameraMode = CameraModes.Unknown;
        };
        if (pPropertyName === AbCamera.CameraTargetAvatarIdProp) {
            if (this._cameraTargetAvatarWatcher) {
                Eventing.Unsubscribe(this._cameraTargetAvatarWatcher);
                this._cameraTargetAvatarWatcher = undefined;
            }
        };
        return;
    };

    _lastCameraType: CameraModes = CameraModes.Unknown;
    _cameraCtrlr: cameraCtrl;
    _processBeforeFrame(pParms: SetPropEventParams): void {
        // Move the camera
        if (Graphics._camera) {
            if (this._cameraModeChanged) {
                if (this._lastCameraType != this._cameraMode) {
                    // Camera type is changing. If changing camera implementation, state must be saved
                    // TODO: smarter mode changing. Like FirstPerson to ThirdPerson can just reuse camera.
                    if (this._lastCameraType != CameraModes.Unknown) {
                        Logger.error(`AbilityCamera.processBeforeFrame: releasing camera `);
                        Graphics.releaseCamera();
                    }
                    // See if the underlying camera implementation has to change

                    // Setup the new camera
                    switch (this._cameraMode) {
                        case CameraModes.FreeLook: {
                            Graphics.activateCamera({
                                name: 'camera0',
                                camtype: 'universal',
                                position: this._pos,
                                rotationQuaternian: this._rot,
                            });
                            this._cameraCtrlr = new otherControl(this);
                            break;
                        }
                        case CameraModes.ThirdPerson: {
                            Graphics.activateCamera({
                                name: 'camera1',
                                camtype: 'follow',
                                heightOffset: this._cameraDisplacement[1],
                                radius: this._cameraDisplacement[2],
                                rotationalOffset: 0,
                                cameraAcceleration: 0.01,
                                maxCameraSpeed: 10,
                                target: this._cameraTargetAvatarObject.mesh
                            });
                            this._cameraDisplacementMod = false;
                            this._cameraCtrlr = new otherControl(this);
                            break;
                        }
                        case CameraModes.Orbit: {
                            this._cameraCtrlr = new otherControl(this);
                            break;
                        }
                        default: {
                            Logger.error(`AbilityCamera.processBeforeFrame: unknown camera type ${this._cameraMode}`);
                            this._cameraCtrlr = undefined;
                            break;
                        }
                    }
                    this._lastCameraType = this._cameraMode;
                }
                this._cameraModeChanged = false;
            }
            if (this._cameraCtrlr) {
                if (this._posMod) {
                    this._cameraCtrlr.position = this._pos;
                    this._posMod = false;
                }
                if (this._rotMod) {
                    this._cameraCtrlr.rotationQuaternion = this._rot;
                    this._rotMod = false;
                }
                this._cameraCtrlr.moveTo();
                this._cameraCtrlr.lookAt();
            }

        }
        return;
    };
};

// Wrapper for camera state and control functions
// The idea is to have AbCamera call these operations and have this hide the camera implementation
abstract class cameraCtrl {
    _abCam: AbCamera;
    public abstract position: number[];
    public abstract rotationQuaternion: number[];
    public abstract moveTo(): void;
    public lookAt(): void {
        if (this._abCam._cameraTargetMod) {
            Graphics._camera.target = BJSVector3.FromArray(this._abCam._cameraTarget, 0);
            this._abCam._cameraTargetMod = false;
        }
    }
    constructor(pAb: AbCamera) {
        this._abCam = pAb;
    }
}
// The camera is controlled by some keyboard/gamepad controller so we don't set anything
// Getting returns the current camera location
class otherControl extends cameraCtrl {
    public get position(): number[] {
        const pos: number[] = [0,0,0];
        Graphics._camera.position.toArray(pos, 0);
        return pos;
    }
    public set position(pVal: number[]) {
        // Graphics._camera.position.fromArray(pVal);
    }
    public get rotationQuaternion(): number[] {
        const rotq = Graphics._camera.rotationQuaternion;
        return [rotq.x, rotq.y, rotq.z, rotq.w];
    }
    public set rotationQuaternion(pVal: number[]) {
        // Graphics._camera.rotationQuaternion.copyFromFloats( pVal[0], pVal[1], pVal[2], pVal[3]);
    }
    // Control is by camera so just set target to position
    public moveTo(): void {
        this._abCam._posTo = this._abCam._pos;
        this._abCam._rotTo = this._abCam._rot;
        return;
    }
}
// The camera position,etc is controlled by this code
class selfControl extends cameraCtrl {
    public get position(): number[] {
        const pos: number[] = [0,0,0];
        Graphics._camera.position.toArray(pos, 0);
        return pos;
    }
    public set position(pVal: number[]) {
        Graphics._camera.position.fromArray(pVal);
    }
    public get rotationQuaternion(): number[] {
        const rotq = Graphics._camera.rotationQuaternion;
        return [rotq.x, rotq.y, rotq.z, rotq.w];
    }
    public set rotationQuaternion(pVal: number[]) {
        Graphics._camera.rotationQuaternion.copyFromFloats( pVal[0], pVal[1], pVal[2], pVal[3]);
    }
    public moveTo(): void {
        // Do any LERPing and SLERPing
        if (this._abCam._posTo != this._abCam._pos) {

        }
        if (this._abCam._rotTo != this._abCam.rot) {

        }
        return;
    }
}
