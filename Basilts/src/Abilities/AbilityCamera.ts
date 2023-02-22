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
import { BItem, PropValue, PropValueTypes, SetPropEventParams } from '@BItem/BItem';
import { BItems } from '@BItem/BItems';

import { Ability, RegisterAbility } from '@Abilities/Ability';
import { PropDefaultValidator, PropDefaultGetter, PropDefaultSetter } from '@Abilities/Ability';
import { AbAssembly } from './AbilityAssembly';
import { AbPlacement } from './AbilityPlacement';

import { Graphics, GraphicsBeforeFrameProps } from '@Graphics/Graphics';
import { Object3D } from '@Graphics/Object3d';

import { Vector3 as BJSVector3, Color3 as BJSColor3, Quaternion as BJSQuaternion, Matrix} from '@babylonjs/core/Maths';

import { EventProcessor, SubscriptionEntry } from '@Eventing/SubscriptionEntry';

import { degreesToRads } from '@Tools/Coords';
import { Clamp } from '@Tools/Misc';
import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Tools/Logging';

export const AbCameraName = 'Camera'

// Function that returns an instance of this Ability given a collection of properties (usually from BMessage.IProps)
export function AbCameraFromProps(pProps: BKeyedCollection): AbCamera {
    let camIndex = 0;
    if (pProps.hasOwnProperty(AbCamera.CameraIndexProp)) {
        camIndex = Number(pProps[AbCamera.CameraIndexProp]);
    }
    return new AbCamera(camIndex);
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
    public static CameraTargetProp = 'cameraTarget';
    public static CameraFarProp = 'cameraFar';
    public static CameraTargetAvatarIdProp = 'cameraTargetAvatarId';
    public static CameraDisplacementProp = 'cameraDisplacement';

    constructor(pIndex: number) {
        super(AbCameraName, {
                [AbCamera.PosProp]: {
                    propName: AbCamera.PosProp,
                    propType: PropValueTypes.NumberTriple,
                    propDefault: [0,0,0],
                    propDesc: 'Camera position',
                    propValidator: PropDefaultValidator,
                    propGetter: (pAbil: Ability, pPropName: string) => {    // Get current camera position
                        const cpos = [0,0,0];
                        Graphics._camera.position.toArray(cpos, 0);
                        pAbil.propValues[AbCamera.PosProp] = cpos;
                        return cpos;
                    },
                    propSetter: (pAbil: Ability, pPropName: string, pVal: PropValue) => {   // Set camera position
                        const abil = pAbil as AbCamera;
                        if (pVal && abil) {
                            PropDefaultSetter(pAbil, pPropName, pVal);
                            abil._posMod = true; // see processBeforeFrame
                        }
                    },
                    private: false
                },
                [AbCamera.RotProp]: {
                    propName: AbCamera.RotProp,
                    propType: PropValueTypes.NumberTriple,
                    propDefault: [0,0,0],
                    propDesc: 'Camera position',
                    propValidator: PropDefaultValidator,
                    propGetter: (pAbil: Ability, pPropName: string) => {    // Get current camera position
                        const crot = [0,0,0,1];
                        let rott = Graphics._camera.rotationQuaternion;
                        if (! rott) {
                            // BabylonJS doesn't keep the rotation quaternion until it is set
                            const erot = Graphics._camera.rotation;
                            rott = BJSQuaternion.FromEulerAngles(erot.x, erot.y, erot.z);
                        }
                        crot[0] = rott.x;
                        crot[1] = rott.y;
                        crot[2] = rott.z;
                        crot[3] = rott.w;
                        pAbil.propValues[AbCamera.RotProp] = crot;
                        return crot;
                    },
                    propSetter: (pAbil: Ability, pPropName: string, pVal: PropValue) => {   // Set camera position
                        const abil = pAbil as AbCamera;
                        if (pVal && abil) {
                            PropDefaultSetter(pAbil, pPropName, pVal);
                            abil._rotMod = true; // see processBeforeFrame
                        }
                    },
                    private: false
                },
                [AbCamera.ForProp]: {
                    propName: AbCamera.ForProp,
                    propType: PropValueTypes.Number,
                    propDefault: 0,
                    propDesc: 'Frame of reference for camera',
                    propValidator: PropDefaultValidator,
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter,
                    private: false
                },
                [AbCamera.PosToProp]: {
                    propName: AbCamera.PosToProp,
                    propType: PropValueTypes.NumberTriple,
                    propDefault: [0,0,0],
                    propDesc: 'target position to move camera to',
                    propValidator: PropDefaultValidator,
                    propGetter: PropDefaultGetter,
                    propSetter: (pAbil: Ability, pPropName: string, pVal: PropValue) => {   // Set camera target position
                        const abil = pAbil as AbCamera;
                        if (pVal && abil) {
                            PropDefaultSetter(abil, pPropName, pVal);
                            abil._posToMod = true; // see processBeforeFrame
                            abil._avatarPositionChangeTime = Date.now();
                        }
                    },
                    private: false
                },
                [AbCamera.RotToProp]: {
                    propName: AbCamera.RotToProp,
                    propType: PropValueTypes.NumberQuad,
                    propDefault: [0,0,0],
                    propDesc: 'target rotation to move camera to',
                    propValidator: PropDefaultValidator,
                    propGetter: PropDefaultGetter,
                    propSetter: (pAbil: Ability, pPropName: string, pVal: PropValue) => {   // Set camera target position
                        const abil = pAbil as AbCamera;
                        if (pVal && abil) {
                            PropDefaultSetter(abil, pPropName, pVal);
                            abil._rotToMod = true; // see processBeforeFrame
                        }
                    },
                    private: false
                },
                [AbCamera.CameraFarProp]: {
                    propName: AbCamera.CameraFarProp,
                    propType: PropValueTypes.Number,
                    propDefault: Config.webgl.camera.initialViewDistance,
                    propDesc: 'Distance camera is from target',
                    propValidator: PropDefaultValidator,
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter,
                    private: false
                },
                [AbCamera.CameraIndexProp]: {
                    propName: AbCamera.CameraIndexProp,
                    propType: PropValueTypes.Number,
                    propDefault: pIndex,    // NOTE: this passed as parameter
                    propDesc: 'which camera this is',
                    propValidator: PropDefaultValidator,
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter,
                    private: false
                },
                [AbCamera.CameraModeProp]: {
                    propName: AbCamera.CameraModeProp,
                    propType: PropValueTypes.Number,
                    propDefault: CameraModes.ThirdPerson,
                    propDesc: 'mode camera is in',
                    propValidator: PropDefaultValidator,
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter,
                    private: false
                },
                [AbCamera.CameraTargetProp]: {
                    propName: AbCamera.CameraTargetProp,
                    propType: PropValueTypes.NumberTriple,
                    propDefault: [0,0,0],
                    propDesc: 'Point camera is looking at',
                    propValidator: PropDefaultValidator,
                    propGetter: PropDefaultGetter,
                    propSetter: (pAbil: Ability, pPropName: string, pVal: PropValue) => {   // Set camera position
                        PropDefaultSetter(pAbil, pPropName, pVal);
                        const abil = pAbil as AbCamera;
                        if (abil) {
                            abil._cameraTargetMod = true; // see processBeforeFrame
                        }
                    },
                    private: false
                },
                [AbCamera.CameraTargetAvatarIdProp]: {
                    propName: AbCamera.CameraTargetAvatarIdProp,
                    propType: PropValueTypes.String,
                    propDefault: null,
                    propDesc: 'ID of object camera is pointing toward',
                    propValidator: PropDefaultValidator,
                    propGetter: PropDefaultGetter,
                    propSetter: (pAbil: Ability, pPropName: string, pVal: PropValue) => {   // Set camera position
                        PropDefaultSetter(pAbil, pPropName, pVal);
                        const avaId = pAbil.getProp(AbCamera.CameraTargetAvatarIdProp) as string;
                        const abil = pAbil as AbCamera;
                        const avaBItem = BItems.get(avaId);
                        if (avaBItem && abil) {
                            // This AvatarId might be for another avatar so we need to redo the watchers
                            abil._clearWatchers();
                            // Watch the avatar's representation so we have the object to point camera at
                            abil._addAvatarWatchers(avaBItem);
                            // Do an initial to call the watcher to do whatever is needed to remember the representation
                            // That is, fake a representation change event to set initial value
                            abil._avatarRepresentationWatcher({
                                BItem: avaBItem,
                                Ability: abil,
                                PropName: AbAssembly.AssetRepresentationProp,
                                NewValue: avaBItem.getProp(AbAssembly.AssetRepresentationProp) as Object3D
                            });
                            abil._cameraTargetMod = true; // see processBeforeFrame
                        }
                        else {
                            Logger.error(`AbCamera.cameraTargetAvatarId set: unknown avatar ${pVal}`);
                        }
                    },
                    private: false
                },
                [AbCamera.CameraDisplacementProp]: {
                    propName: AbCamera.CameraDisplacementProp,
                    propType: PropValueTypes.NumberTriple,
                    propDefault: [0,0,0],
                    propDesc: 'Displace the camera from the target for thrid person view',
                    propValidator: PropDefaultValidator,
                    propGetter: PropDefaultGetter,
                    propSetter: (pAbil: Ability, pPropName: string, pVal: PropValue) => {   // Set camera position
                        PropDefaultSetter(pAbil, pPropName, pVal);
                        const camDisp = pAbil.getProp(AbCamera.CameraDisplacementProp) as number[];
                        const abil = pAbil as AbCamera;
                        if (camDisp && abil) {
                            abil._cameraDisplacementMod = true;
                            // Convert into parameters used by the third person camera
                            abil.cameraRadius = camDisp[1];
                            abil.cameraHeightOffset = -camDisp[2];
                        }
                    },
                    private: false
                }
        });
        this._posMod = this._posToMod = this._rotMod = this._rotToMod = false;
        this._cameraTargetMod = false;
        this._cameraDisplacementMod = false;
    };

    // Variables set to 'true' when the corresponding property is changed
    _posMod: boolean = false;
    _rotMod: boolean = false;
    _posToMod: boolean = false;
    _rotToMod: boolean = false;
    _cameraTargetMod = false;
    _cameraDisplacementMod: boolean = false;

    _cameraTargetAvatarObject: Object3D;

    // Called by watcher when avatar representation changes
    _avatarRepresentationWatcher(pParams: SetPropEventParams): void {
        this._cameraTargetAvatarObject = pParams.NewValue as Object3D;
    };
    // Called by watcher when avatar position changes
    _avatarPositionChangeTime: number = Date.now();
    _avatarPosWatcher(pParams: SetPropEventParams): void {
        this.setProp(AbCamera.PosToProp, pParams.NewValue);
    };
    // Called by watcher when avatar rotation changes
    _avatarRotWatcher(pParams: SetPropEventParams): void {
        pParams.Ability.setProp(AbCamera.RotToProp, pParams.NewValue);
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


    // Parameters used for the camera movement. Should be camera parameters
    cameraRotationOffset: number = -90;
    cameraHeightOffset: number = 2;
    cameraRadius: number = 8;
    cameraAcceleration: number = 0.05;
    cameraMaxSpeed: number = 20;

    // Add all the properties from this assembly to the holding BItem
    _beforeFrameWatcher: SubscriptionEntry;
    addProperties(pBItem: BItem): void {
        // Always do this!!
        super.addProperties(pBItem);

        this._beforeFrameWatcher = Graphics.WatchBeforeFrame(this._processBeforeFrame.bind(this) as EventProcessor);

        pBItem.setReady();
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        if (pPropertyName === AbCamera.CameraIndexProp) {
            this.setProp(AbCamera.CameraModeProp, CameraModes.Unknown);
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
    _lastCamPos: BJSVector3 = new BJSVector3();
    _lastRads: number = 0;
    _lastD: BJSVector3 = new BJSVector3();
    _lastV: BJSVector3 = new BJSVector3();
    _lastTarget: BJSVector3 = new BJSVector3();
    _processBeforeFrame(pParms: GraphicsBeforeFrameProps): void {
        // Move the camera
        if (Graphics._camera) {
            const cameraPos = this.getProp(AbCamera.PosProp) as number[]; // gets current position from camera
            const cameraRot = this.getProp(AbCamera.RotProp) as number[]; // gets current rotation from camera
            const cameraMode = this.getProp(AbCamera.CameraModeProp) as CameraModes;
            // Setup camera depending on mode
            if (this._lastCameraType != this.propValues[AbCamera.CameraModeProp]) {
                // Camera type is changing. If changing camera implementation, state must be saved
                // TODO: smarter mode changing. Like FirstPerson to ThirdPerson can just reuse camera.
                if (this._lastCameraType != CameraModes.Unknown) {
                    Logger.debug(`AbilityCamera.processBeforeFrame: releasing camera `);
                    Graphics.releaseCamera();
                }
                // See if the underlying camera implementation has to change
                Logger.debug(`AbilityCamera.processBeforeFrame: setup camera ${CameraModes[this.propValues[AbCamera.CameraModeProp] as number]}`);
                switch (cameraMode) {
                    case CameraModes.FreeLook: {
                        Graphics.activateUniversalCamera({
                            name: 'camera0',
                            position: cameraPos,
                            rotationQ: cameraRot,
                            cameraTarget: this.getProp(AbCamera.CameraTargetProp)
                        });
                        break;
                    }
                    case CameraModes.ThirdPerson: {
                        Graphics.activateUniversalCamera({
                            name: 'camera1',
                            position: cameraPos,
                            rotationQ: cameraRot,
                            attachControl: false
                        });
                        break;
                    }
                    case CameraModes.Orbit: {
                        Graphics.activateArcRotateCamera( {
                            name: 'camera2',
                            position: cameraPos,
                            rotationQ: cameraRot,
                            target: this.getProp(AbCamera.CameraTargetProp),
                            viewDistance: (this.getProp(AbCamera.CameraDisplacementProp) as number[])[1],
                            attachControl: true
                        })
                        break;
                    }
                    default: {
                        Logger.error(`AbilityCamera.processBeforeFrame: unknown camera type ${cameraMode}`);
                        break;
                    }
                }
                this._lastCameraType = cameraMode;
            }

            // Camera is set up, so handle movement
            switch (cameraMode) {
                case CameraModes.FreeLook: {
                    // Free look is run by the keyboard so this doesn't update anything
                    if (this._cameraTargetMod) {
                        Graphics._camera.target = BJSVector3.FromArray(this.getProp(AbCamera.CameraTargetProp) as number[]);
                        this._cameraTargetMod = false;
                    }
                    break;
                }
                case CameraModes.ThirdPerson: {
                    // The camera tracks the specified avatar
                    if (this._cameraTargetAvatarObject) {

                        // Code borrowed from BabylonJS FollowCamera
                        const rotMatrix = new Matrix();
                        this._cameraTargetAvatarObject.mesh.absoluteRotationQuaternion.toRotationMatrix(rotMatrix);
                        const yRotation = Math.atan2(rotMatrix.m[8], rotMatrix.m[10]);

                        const radians = this.cameraRotationOffset * degreesToRads + yRotation;
                        const targetPosition = this._cameraTargetAvatarObject.mesh.getAbsolutePosition();
                        const targetX: number = targetPosition.x + Math.sin(radians) * this.cameraRadius;
                        const targetZ: number = targetPosition.z + Math.cos(radians) * this.cameraRadius;

                        const dx: number = targetX - cameraPos[0];
                        const dy: number = targetPosition.y + this.cameraHeightOffset - cameraPos[1];
                        const dz: number = targetZ - cameraPos[2];
                        const vx: number = Clamp(dx * this.cameraAcceleration * 2, -this.cameraMaxSpeed, this.cameraMaxSpeed);
                        const vy: number = Clamp(dy * this.cameraAcceleration, -this.cameraMaxSpeed, this.cameraMaxSpeed);
                        const vz: number = Clamp(dz * this.cameraAcceleration * 2, -this.cameraMaxSpeed, this.cameraMaxSpeed);

                        const newPos = [cameraPos[0] + vx, cameraPos[1] + vy, cameraPos[2] + vz ];
                        this.propValues[AbCamera.PosProp] = newPos;
                        const newCamPos = new BJSVector3(newPos[0], newPos[1], newPos[2]);
                        Graphics._camera.position = newCamPos;
                        Graphics._camera.setTarget(targetPosition);

                        /*
                        // DEBUG DEBUG
                        const newD = new BJSVector3(dx, dy, dz);
                        const newV = new BJSVector3(vx, vy, vz);
                        if (BJSVector3.Distance(this._lastCamPos, newCamPos) > 0.01
                                || Math.abs(this._lastRads - radians) > 0.01
                                || BJSVector3.Distance(this._lastTarget, targetPosition) > 0.01
                                || BJSVector3.Distance(this._lastD, newD) > 0.01
                                || BJSVector3.Distance(this._lastV, newV) > 0.01
                            ) {

                            Logger.debug(
                                `AbilityCamera.processBeforeFrame: cp=${newCamPos}, t=${targetPosition}, r=${radians}, d=${newD}, v=${newV}`);
                        }
                        this._lastD = newD;
                        this._lastV = newV;
                        this._lastRads = radians;
                        this._lastCamPos = newCamPos;
                        this._lastTarget = targetPosition;
                        // END DEBUG DEBUG
                        */

                        /*
                        const avaPos = this._cameraTargetAvatarObject.mesh.position.clone();
                        const avaRot = this._cameraTargetAvatarObject.mesh.rotationQuaternion;

                        const disp = new BJSVector3(this._cameraDisplacement[0], this._cameraDisplacement[1], this._cameraDisplacement[2]);
                        const rotDisp = new BJSVector3();
                        const newCamPos = this._cameraTargetAvatarObject.mesh.position.clone();
                        newCamPos.x += this._cameraDisplacement[0];
                        newCamPos.y += this._cameraDisplacement[1];
                        newCamPos.z += this._cameraDisplacement[2];
                        // 'netCamPos' is where we wish the camera to be

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
                        */
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