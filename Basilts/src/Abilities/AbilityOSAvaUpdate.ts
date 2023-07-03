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
import { BItem, SetPropEventParams, PropValueTypes } from '@BItem/BItem';
import { PropDefaultGetter, PropDefaultSetter } from '@Abilities/Ability';

import { Ability, RegisterAbility } from '@Abilities/Ability';
import { AbCamera } from '@Abilities/AbilityCamera';
import { AbKeyboard } from '@Abilities/AbilityKeyboard';
import { AbMouse } from '@Abilities/AbilityMouse';
import { AbPlacement } from '@Abilities/AbilityPlacement';
import { WellKnownCameraName, WellKnownMouseName, WellKnownKeyboardName } from '@BItem/WellKnownBItems';

import { EventProcessor } from '@Base/Eventing/SubscriptionEntry';
import { BKeyedCollection } from '@Tools/bTypes';

import { Logger } from '@Base/Tools/Logging';
import { Quaternion } from '@babylonjs/core';
import { log } from 'console';

export const AbOSAvaMoveName = 'OSAvaUpdate'

// Function that returns an instance of this Ability given a collection of properties (usually from BMessage.IProps)
export function AbOSAvaUpdateFromProps(pProps: BKeyedCollection): AbOSAvaUpdate {
    return new AbOSAvaUpdate();
};

export enum OSAvaUpdateMoveAction {
    None            = 0x000,
    walkForward     = 0x001,    // transient flag saying walk forward
    walkBackward    = 0x002,    // transient flag saying walk backward
    turnLeft        = 0x004,    // transient flag saying turn
    turnRight       = 0x008,    // transient flag saying turn
    moveUp          = 0x010,    // transient flag
    moveDown        = 0x020,    // transient flag
    flying          = 0x040,    // state flag saying we should be flying
    stand           = 0x080,    // transient flag to stand
}

// Register the ability with the AbilityFactory. Note this is run when this file is imported.
RegisterAbility(AbOSAvaMoveName, AbOSAvaUpdateFromProps);

// OpenSim has the client send an "AgentUpdate" for general main agent view and
//    settings. These range from where the head is looking to whether to display
//    the avatar name tag.
// Includes Away, mouse actions, 
export class AbOSAvaUpdate extends Ability {

    public static ControlFlagsProp = 'osau_controlflag';
    public static BodyRotProp = 'osau_bodyrot';
    public static HeadRotProp = 'osau_headrot';
    public static FarProp = 'osau_far';

    public static MoveToProp = 'osau_moveTo';

    constructor() {
        super(AbOSAvaMoveName, {
            [AbOSAvaUpdate.ControlFlagsProp]: {
                propName: AbOSAvaUpdate.ControlFlagsProp,
                propType: PropValueTypes.Number,
                propDefault: 0,
                propDesc: 'Flags controlling type of avatar movement',
                propGetter: PropDefaultGetter,
                propSetter: PropDefaultSetter
            },
            [AbOSAvaUpdate.BodyRotProp]: {
                propName: AbOSAvaUpdate.BodyRotProp,
                propType: PropValueTypes.NumberArray,
                propDefault: [ 0, 0, 0, 1],
                propDesc: 'Rotation of the avatar body',
                propGetter: PropDefaultGetter,
                propSetter: PropDefaultSetter
            },
            [AbOSAvaUpdate.HeadRotProp]: {
                propName: AbOSAvaUpdate.HeadRotProp,
                propType: PropValueTypes.NumberArray,
                propDefault: [ 0, 0, 0, 1],
                propDesc: 'Rotation of the avatar head',
                propGetter: PropDefaultGetter,
                propSetter: PropDefaultSetter
            },
            [AbOSAvaUpdate.MoveToProp]: {
                propName: AbOSAvaUpdate.MoveToProp,
                propType: PropValueTypes.NumberArray,
                propDefault: [100, 100, 100],
                propDesc: 'Target for avatar to move to',
                propGetter: PropDefaultGetter,
                propSetter: PropDefaultSetter
            },
            [AbOSAvaUpdate.FarProp]: {
                propName: AbOSAvaUpdate.FarProp,
                propType: PropValueTypes.Number,
                propDefault: 20,
                propDesc: '',
                propGetter: PropDefaultGetter,
                propSetter: PropDefaultSetter
            },
        });
    };

    _cameraId: string;      // ID of camera BItem
    _mouseId: string;       // ID of mouse BItem
    _keyboardId: string;    // ID of keyboard BItem

    // Add all the properties from this assembly to the holding BItem
    addProperties(pBItem: BItem): void {
        // Always do this!k!
        super.addProperties(pBItem);

        // Collect some global identifiers for use later
        this._cameraId = BItems.getWellKnownBItemId(WellKnownCameraName);
        this._mouseId = BItems.getWellKnownBItemId(WellKnownMouseName);
        this._keyboardId = BItems.getWellKnownBItemId(WellKnownKeyboardName);

        // OpenSim avatar movement takes keyboard controls
        const keyboardBItem = BItems.get(this._keyboardId);
        // Logger.debug(`AbOSAvaUpdate.addProperties: subscribing to ${keyboardBItem.getPropEventTopicName(AbKeyboard.KeyDownProp)}`);
        keyboardBItem.watchProperty(AbKeyboard.KeyDownProp, this.processKeyboard.bind(this) as EventProcessor);

        pBItem.setReady();
    };

    processKeyboard(pEvent: SetPropEventParams): void {
        const abil = pEvent.Ability as AbKeyboard;
        // Logger.debug(`AbOSAvaUpdate.processKeyboard: keyboard event: ${abil.keyName}`);
        const keyDown = <boolean>abil.getProp(AbKeyboard.KeyDownProp);
        switch (abil.getProp(AbKeyboard.KeyNameProp)) {
            case 'ArrowRight':  this.turnRight(keyDown); break;
            case 'd':           this.turnRight(keyDown); break;
            case 'ArrowLeft':   this.turnLeft(keyDown); break;
            case 'a':           this.turnLeft(keyDown); break;
            case 'ArrowUp':     this.walkForward(keyDown); break;
            case 'w':           this.walkForward(keyDown); break;
            case 'ArrowDown':   this.walkBackward(keyDown); break;
            case 's':           this.walkBackward(keyDown); break;

            case 'Home':        this.doFly(keyDown); break;
            case 'PageUp':      this.moveUp(keyDown); break;
            case 'PageDown':    this.moveDown(keyDown); break;
            default:
                break;
        }
    };

    turnRight(pKeyUpDown: boolean) {
        const rott = <number[]>this.containingBItem.getProp(AbPlacement.RotProp);
        const qRott = Quaternion.FromArray(rott);
        qRott.multiplyInPlace(Quaternion.FromEulerAngles(0, -10, 0));
        this.setProp(AbPlacement.RotProp, [qRott.x, qRott.y, qRott.z, qRott.w]);

        this.movementAction(OSAvaUpdateMoveAction.turnRight, pKeyUpDown);
    }

    turnLeft(pKeyUpDown: boolean) {
        const rott = <number[]>this.containingBItem.getProp(AbPlacement.RotProp);
        Logger.debug(`AbilityOSAvaUpdate.turnLeft: rott=${rott}`);
        const qRott = Quaternion.FromArray(rott);
        qRott.multiplyInPlace(Quaternion.FromEulerAngles(0, 10, 0));
        this.setProp(AbPlacement.RotProp, [qRott.x, qRott.y, qRott.z, qRott.w]);

        this.movementAction(OSAvaUpdateMoveAction.turnLeft, pKeyUpDown);
    }

    walkForward(pKeyUpDown: boolean) {
        this.movementAction(OSAvaUpdateMoveAction.walkForward, pKeyUpDown);
    }

    walkBackward(pKeyUpDown: boolean) {
        this.movementAction(OSAvaUpdateMoveAction.walkBackward, pKeyUpDown);
    }

    doFly(pKeyUpDown: boolean) {
        const isFlying = <number>this.getProp(AbOSAvaUpdate.ControlFlagsProp) & OSAvaUpdateMoveAction.flying;
        if (!isFlying && pKeyUpDown) {
            this.setControlFlag(OSAvaUpdateMoveAction.flying, true);
        }
        if (isFlying && pKeyUpDown) {
            this.setControlFlag(OSAvaUpdateMoveAction.flying, false);
        }
    }

    moveUp(pKeyUpDown: boolean) {
        this.movementAction(OSAvaUpdateMoveAction.moveUp, pKeyUpDown);
    }

    moveDown(pKeyUpDown: boolean) {
        this.movementAction(OSAvaUpdateMoveAction.moveDown, pKeyUpDown);
    }

    movementAction(pMovement: OSAvaUpdateMoveAction, pKeyUpDown: boolean): void {
        // Set or clear the control flag depending on whether key is up or down
        this.setControlFlag(pMovement, pKeyUpDown);
        // Send an agent update to the server
        this.sendAvatarUpdate();
    };

    // Set control flag. If passed boolean of 'false', will clear the flag.
    setControlFlag(pFlag: OSAvaUpdateMoveAction, pSet: boolean = true): void {
        if (pSet) {
            (this.propValues[AbOSAvaUpdate.ControlFlagsProp] as number) |= pFlag;
        }
        else {
            (this.propValues[AbOSAvaUpdate.ControlFlagsProp] as number) &= ~pFlag;
        }
    };

    // Avatar is being asked to move.
    // Send it to the SpaceServer to figure out what to do in world
    sendAvatarUpdate(): void {
        const far = <number>BItems.getProp(this._cameraId, AbCamera.CameraFarProp);
        const rot = <number[]>this.containingBItem.getProp(AbPlacement.RotProp);
        const updateProps = {
            [AbOSAvaUpdate.ControlFlagsProp]: this.getProp(AbOSAvaUpdate.ControlFlagsProp),
            [AbOSAvaUpdate.FarProp]: far,
            [AbOSAvaUpdate.BodyRotProp]: rot,
            [AbOSAvaUpdate.HeadRotProp]: rot
        };
        this.setProp(AbOSAvaUpdate.BodyRotProp, rot);
        this.setProp(AbOSAvaUpdate.HeadRotProp, rot);

        // Logger.debug(`AbOSAvaMove.sendMovementUpdate: sending ${JSON.stringify(updateProps)}`);
        void this.containingBItem.conn?.UpdateProperties(this.containingBItem.id, updateProps);
        return;
    }

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };
};