// Copyright 2021 Robert Adams
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
import { Eventing } from '@Base/Eventing/Eventing';

import { Ability, ParseValueToType, RegisterAbility } from '@Abilities/Ability';
import { BItem, PropValue, PropValueTypes, SetPropEventParams } from '@BItem/BItem';

import { Graphics, GraphicsBeforeFrameProps } from '@Graphics/Graphics';
import { Vector3 as BJSVector3, Quaternion as BJSQuaternion, Color3 as BJSColor3 } from '@babylonjs/core/Maths';

import { EventProcessor, SubscriptionEntry } from '@Eventing/SubscriptionEntry';

import { ParseThreeTuple, ParseFourTuple, JSONstringify } from '@Tools/Utilities';
import { BKeyedCollection } from '@Tools/bTypes';
import { Clamp } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';

// Some BItems are Assemblies (3d representations) and other BItems are instances of the
//     3d representations. This Ability is the Intance.
// There are fixes so a single BItem can include both the Assembly and Placement Abilities.

export const AbPlacementName = 'Placement';

export function AbPlacementFromProps(pProps: BKeyedCollection): AbPlacement {

    // Use 'pos' if passed or, if 'posTo' is given, use that.
    let position: PropValue = undefined;
    if (pProps.hasOwnProperty(AbPlacement.PosToProp)) {
        position = pProps[AbPlacement.PosToProp] as PropValue;
    }
    if (pProps.hasOwnProperty(AbPlacement.PosProp)) {
        position = pProps[AbPlacement.PosProp] as PropValue;
    }

    let rotation: PropValue = undefined;
    if (pProps.hasOwnProperty(AbPlacement.RotToProp)) {
        rotation = pProps[AbPlacement.RotToProp] as PropValue;
    }
    if (pProps.hasOwnProperty(AbPlacement.RotProp)) {
        rotation = pProps[AbPlacement.RotProp] as PropValue;
    }

    let frameOfReference: number = undefined;
    if (pProps.hasOwnProperty(AbPlacement.ForProp)) {
        frameOfReference = ParseValueToType(PropValueTypes.Number, pProps[AbPlacement.ForProp]) as number;
    }
    return new AbPlacement(position, rotation, frameOfReference);
};

// Register the ability with the AbilityFactory. Note this is run when this file is imported.
RegisterAbility(AbPlacementName, AbPlacementFromProps);

// Placement controls position/rotation of the BItem.
// Base properties are 'pos' and 'rot' which are the current position/rotation of the BItem
// There are 'posTo' and 'rotTo' which act as "move to" locations and this does LERP
//     type actions to move pos/rot to those targets.
// NOTE: the values in the ability are always in Planet coordinates. They have to be
//     localized before giving to Graphics.
export class AbPlacement extends Ability {
    static PosProp = 'pos';
    static RotProp = 'rot';
    static ForProp = 'for';
    static PosToProp = 'posTo';
    static RotToProp = 'rotTo';
    static PosSpeed = 'posSpeed';

    _pos: number[] = [0,0,0];
    _posMod = false;
    public get pos(): number[] { return this._pos; }
    public set pos(pVal: string | number[]) {
        if (pVal) {
            this._pos = ParseThreeTuple(pVal);
            // Explicitly setting position means we're not moving to a target
            this._posTo = this._pos;
            this._posMod = true; // see processBeforeFrame
        }
    };
    // The *To properties will be used to known when to set absolute or to LERP
    _posTo: number[] = [0,0,0];
    _posToMod = false;
    _posToStart: number = Date.now();
    public get posTo(): number[] { return this._pos; }
    public set posTo(pVal: string | number[]) {
        if (pVal) {
            this._posTo = ParseThreeTuple(pVal);
            this._posToMod = true; // see processBeforeFrame
            this._posToStart = Date.now();
        }
    };

    _rot: number[] = [0,0,0,1];
    _rotMod = false;
    public get rot(): number[] { return this._rot; }
    public set rot(pVal: string | number[]) {
        if (pVal) {
            this._rot = ParseFourTuple(pVal);
            this._rotMod = true; // see processBeforeFrame
        }
    };

    _rotTo: number[] = [0,0,0,1];
    _rotToMod = false;
    _rotToStart: number = Date.now();
    public get rotTo(): number[] { return this._rot; }
    public set rotTo(pVal: string | number[]) {
        if (pVal) {
            this._rotTo = ParseFourTuple(pVal);
            this._rotToMod = true; // see processBeforeFrame
            this._rotToStart = Date.now();
        }
    };

    _for: number = 0;
    public get for(): number { return this._for; }
    public set for(pVal: number) {
        this._for = pVal;
    };

    _posSpeed: number = 1;
    public get posSpeed(): number { return this._posSpeed; }
    public set posSpeed(pVal: number) {
        this._posSpeed = Number(pVal);
    };

    constructor(pPos: PropValue, pRot: PropValue, pFor?: number) {
        super(AbPlacementName);
        this._pos = pPos ? ParseValueToType(PropValueTypes.NumberTriple, pPos) as number[] : [0,0,0];
        this._posTo = this._pos;
        this._rot = pRot ? ParseValueToType(PropValueTypes.NumberQuad, pRot) as number[] :  [0,0,0,1];
        this._rotTo = this._rot;
        this._for = pFor ?? 0;
    };

    addProperties(pBItem: BItem): void {
        super.addProperties(pBItem);
        // Get and Set the instance's position in the 3d world.
        // Passed position is normalized into a number array.
        pBItem.addProperty(AbPlacement.PosProp, this);
        // Get and Set the instances' rotation in the 3d world.
        // Passed rotation is normalized into a number array.
        pBItem.addProperty(AbPlacement.RotProp, this);
        // MoveTo targets
        pBItem.addProperty(AbPlacement.PosToProp, this);
        pBItem.addProperty(AbPlacement.RotToProp, this);
        // Get and Set the placement frame of reference.
        pBItem.addProperty(AbPlacement.ForProp, this);

        // Update things just before rendering
        this._beforeFrameWatcher = Graphics.WatchBeforeFrame(this.processBeforeFrame.bind(this) as EventProcessor);
    };

    _beforeFrameWatcher: SubscriptionEntry = undefined;
    processBeforeFrame(pParms: GraphicsBeforeFrameProps): void {
        if (this._pos[0] != this._posTo[0] || this._pos[2] != this._posTo[2] || this._pos[1] != this._posTo[1]) {
            const moveDuration = Date.now() - this._posToStart;
            const moveScale = Clamp(moveDuration / Config.world.lerpIntervalMS, 0, 1);

            if (moveScale > 0.9) {
                // Moved enough. Assume we're done
                // Logger.debug(`AbPlacement.beforeFrame: moveScale done d=${moveDuration}, ms=${moveScale}`);
                this._pos = this._posTo;
                this._rot = this._rotTo;
            }
            else {
                const pos = new BJSVector3(this._pos[0], this._pos[1], this._pos[2]);
                const posTo = new BJSVector3(this._posTo[0], this._posTo[1], this._posTo[2]);
                const rot = new BJSQuaternion(this._rot[0], this._rot[1], this._rot[2], this._rot[3]);
                const rotTo = new BJSQuaternion(this._rotTo[0], this._rotTo[1], this._rotTo[2], this._rotTo[3]);
                const np = BJSVector3.Lerp(pos, posTo, moveScale);
                const nr = BJSQuaternion.Slerp(rot, rotTo, moveScale);

                this._pos = [ np.x, np.y, np.z ];
                this._rot = [ nr.x, nr.y, nr.z, nr.w ];
                // Logger.debug(`AbPlacement.beforeFrame: pos=${pos}, pTo=${posTo}, d=${moveDuration}, ms=${moveScale}`);
            }
            // Anyone watching the position should know about the position update
            // NOTE: does not store the new value of the pos property but just generates a change event.
            //     Since the pos value was updated above this does not want the side effects of setting it.
            this.containingBItem.setProp(AbPlacement.PosProp, this._pos, false);
            this.containingBItem.setProp(AbPlacement.RotProp, this._rot, false);
        }
    };

    // If any of my properties are removed, that means I'm being removed.
    // Disconnect this instance from the world.
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        if (this._beforeFrameWatcher) {
            Eventing.Unsubscribe(this._beforeFrameWatcher);
            this._beforeFrameWatcher = undefined;
        }
        return;
    };
};