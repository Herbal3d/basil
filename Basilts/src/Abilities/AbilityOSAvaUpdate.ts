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
import { BItems } from '@BItem/BItems';
import { BItem, SetPropEventParams } from '@BItem/BItem';

import { AbKeyboard } from './AbilityKeyboard';
import { AbCamera } from './AbilityCamera';
import { AbMouse } from './AbilityMouse';
import { WellKnownCameraName, WellKnownMouseName, WellKnownKeyboardName } from '@BItem/WellKnownBItems';

import { Eventing } from '@Eventing/Eventing';
import { EventProcessor } from '@Base/Eventing/SubscriptionEntry';
import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Base/Tools/Logging';
import { AbPlacement } from './AbilityPlacement';
import { ThinSprite } from '@babylonjs/core/Sprites/thinSprite';

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
        super(AbOSAvaMoveName);
    };

    // Make the properties available
    public osau_control: number;
    public osau_bodyrot: number[];
    public osau_headrot: number[];
    public osau_far: number;

    public osau_moveTo: number[];

    _cameraId: string;      // ID of camera BItem
    _mouseId: string;       // ID of mouse BItem
    _keyboardId: string;    // ID of keyboard BItem

    // Add all the properties from this assembly to the holding BItem
    addProperties(pBItem: BItem): void {
        // Always do this!k!
        super.addProperties(pBItem);

        pBItem.addProperty(AbOSAvaUpdate.ControlFlagsProp, this);
        pBItem.addProperty(AbOSAvaUpdate.BodyRotProp, this);
        pBItem.addProperty(AbOSAvaUpdate.HeadRotProp, this);

        pBItem.addProperty(AbOSAvaUpdate.MoveToProp, this);

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
        switch (abil.keyName) {
            case 'ArrowRight':  this.turnRight(abil.keyDown); break;
            case 'd':           this.turnRight(abil.keyDown); break;
            case 'ArrowLeft':   this.turnLeft(abil.keyDown); break;
            case 'a':           this.turnLeft(abil.keyDown); break;
            case 'ArrowUp':     this.walkForward(abil.keyDown); break;
            case 'w':           this.walkForward(abil.keyDown); break;
            case 'ArrowDown':   this.walkBackward(abil.keyDown); break;
            case 's':           this.walkBackward(abil.keyDown); break;

            case 'Home':        this.doFly(abil.keyDown); break;
            case 'PageUp':      this.moveUp(abil.keyDown); break;
            case 'PageDown':    this.moveDown(abil.keyDown); break;
            default:
                break;
        }
    };

    turnRight(pKeyUpDown: boolean) {
        this.movementAction(OSAvaUpdateMoveAction.turnRight, pKeyUpDown);
    }

    turnLeft(pKeyUpDown: boolean) {
        this.movementAction(OSAvaUpdateMoveAction.turnLeft, pKeyUpDown);
    }

    walkForward(pKeyUpDown: boolean) {
        this.movementAction(OSAvaUpdateMoveAction.walkForward, pKeyUpDown);
    }

    walkBackward(pKeyUpDown: boolean) {
        this.movementAction(OSAvaUpdateMoveAction.walkBackward, pKeyUpDown);
    }

    doFly(pKeyUpDown: boolean) {
        const isFlying = this.osau_control & OSAvaUpdateMoveAction.flying;
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
            this.osau_control |= pFlag;
        }
        else {
            this.osau_control &= ~pFlag;
        }
    };

    // Avatar is being asked to move.
    // Send it to the SpaceServer to figure out what to do in world
    sendAvatarUpdate(): void {
        const far = BItems.getProp(this._cameraId, AbCamera.CameraFarProp) as number;
        const rot = this.containingBItem.getProp(AbPlacement.RotProp) as number[];
        const updateProps = {
            [AbOSAvaUpdate.ControlFlagsProp]: this.osau_control,
            [AbOSAvaUpdate.FarProp]: far,
            [AbOSAvaUpdate.BodyRotProp]: rot,
            [AbOSAvaUpdate.HeadRotProp]: rot
        };
        this.osau_bodyrot = rot;
        this.osau_headrot = rot;

        // Logger.debug(`AbOSAvaMove.sendMovementUpdate: sending ${JSON.stringify(updateProps)}`);
        void this.containingBItem.conn?.UpdateProperties(this.containingBItem.id, updateProps);
        return;
    }

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };
};