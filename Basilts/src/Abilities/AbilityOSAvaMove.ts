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
import { BItem, setPropEventParams } from '@BItem/BItem';

import { AbKeyboard } from './AbilityKeyboard';

import { Eventing } from '@Eventing/Eventing';
import { EventProcessor } from '@Base/Eventing/SubscriptionEntry';
import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Base/Tools/Logging';

export const AbOSAvaMoveName = 'OSAvatarMovement'
// REMEMBER TO ADD the ability registration in AbilityManagement.ts

// Function that returns an instance of this Ability given a collection of properties (usually from BMessage.IProps)
export function AbOSAvaMoveFromProps(pProps: BKeyedCollection): AbOSAvaMove {
    return new AbOSAvaMove();
};

export enum OSAvaMoveActions {
    Stand = 0,
    WalkForward,
    WalkBackward,
    TurnRight,
    TurnLeft,
    Fly,
    Up,
    Down
}

// Register the ability with the AbilityFactory. Note this is run when this file is imported.
RegisterAbility(AbOSAvaMoveName, AbOSAvaMoveFromProps);

export class AbOSAvaMove extends Ability {

    public static MoveActionProp = 'moveAction';

    constructor() {
        super(AbOSAvaMoveName);
    };

    // Make the properties available
    public moveAction: OSAvaMoveActions;

    // Add all the properties from this assembly to the holding BItem
    addProperties(pBItem: BItem): void {
        // Always do this!k!
        super.addProperties(pBItem);

        pBItem.addProperty(AbOSAvaMove.MoveActionProp, this);

        // OpenSim avatar movement takes keyboard controls
        const keyboardBItem = BItems.get(Config.infrastructureBItemNames.keyboard);
        // Logger.debug(`AbOSAvaMove.addProperties: subscribing to ${keyboardBItem.getPropEventTopicName(AbKeyboard.KeyDownProp)}`);
        Eventing.Subscribe(keyboardBItem.getPropEventTopicName(AbKeyboard.KeyDownProp),
                            this.processKeyboard.bind(this) as EventProcessor);
    };

    processKeyboard(pEvent: setPropEventParams): void {
        const abil = pEvent.Ability as AbKeyboard;
        // Logger.debug(`AbOSAvaMove.processKeyboard: keyboard event: ${abil.keyName}`);
        switch (abil.keyName) {
            case 'ArrowRight':  this.sendMovementUpdate(OSAvaMoveActions.TurnRight, abil.keyDown); break;
            case 'l':           this.sendMovementUpdate(OSAvaMoveActions.TurnRight, abil.keyDown); break;
            case 'ArrowLeft':   this.sendMovementUpdate(OSAvaMoveActions.TurnLeft, abil.keyDown); break;
            case 'k':           this.sendMovementUpdate(OSAvaMoveActions.TurnLeft, abil.keyDown); break;
            case 'ArrowUp':     this.sendMovementUpdate(OSAvaMoveActions.WalkForward, abil.keyDown); break;
            case 'h':           this.sendMovementUpdate(OSAvaMoveActions.WalkForward, abil.keyDown); break;
            case 'ArrowDown':   this.sendMovementUpdate(OSAvaMoveActions.WalkBackward, abil.keyDown); break;
            case 'j':           this.sendMovementUpdate(OSAvaMoveActions.WalkBackward, abil.keyDown); break;
            case 'Home':        this.sendMovementUpdate(OSAvaMoveActions.Fly, abil.keyDown); break;
            case 'PageUp':      this.sendMovementUpdate(OSAvaMoveActions.Up, abil.keyDown); break;
            case 'PageDown':    this.sendMovementUpdate(OSAvaMoveActions.Down, abil.keyDown); break;
        }
    };

    // Avatar is being asked to move. Send it to the SpaceServer to figure out what to do in world
    sendMovementUpdate(pMovement: OSAvaMoveActions, pStartStop: boolean): void {
        this.moveAction = pMovement;
        const updateProps = {
            [AbOSAvaMove.MoveActionProp]: pMovement
        };
        // Logger.debug(`AbOSAvaMove.sendMovementUpdate: sending ${JSON.stringify(updateProps)}`);
        void this.containingBItem.bItemAbility.creatingConnection.UpdateProperties(this.containingBItem.id, updateProps);
        return;
    }

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };
};