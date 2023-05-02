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

import { BItem, PropValue, PropValueTypes } from '@BItem/BItem';
import { Ability, ParseValueToType, RegisterAbility } from '@Abilities/Ability';
import { PropDefaultGetter, PropDefaultSetter } from '@Abilities/Ability';

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
        position = ParseValueToType(PropValueTypes.NumberArray, pProps[AbPlacement.PosToProp]);
    }
    if (pProps.hasOwnProperty(AbPlacement.PosProp)) {
        position = ParseValueToType(PropValueTypes.NumberArray, pProps[AbPlacement.PosProp]);
    }

    let rotation: PropValue = undefined;
    if (pProps.hasOwnProperty(AbPlacement.RotToProp)) {
        rotation = ParseValueToType(PropValueTypes.NumberArray, pProps[AbPlacement.RotToProp]);
    }
    if (pProps.hasOwnProperty(AbPlacement.RotProp)) {
        rotation = ParseValueToType(PropValueTypes.NumberArray, pProps[AbPlacement.RotProp]);
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
    static PosSpeedProp = 'posSpeed';

    constructor(pPos: PropValue, pRot: PropValue, pFor?: number) {
        super(AbPlacementName, {
                [AbPlacement.PosProp]: {
                    propName: AbPlacement.PosProp,
                    propType: PropValueTypes.NumberTriple,
                    propDefault: pPos ? ParseValueToType(PropValueTypes.NumberTriple, pPos) as number[] : [0,0,0],
                    propDesc: 'Position',
                    propGetter: PropDefaultGetter,
                    propSetter: (pAbil: Ability, pPropName: string, pVal: PropValue) => {   // Set camera position
                        const abil = pAbil as AbPlacement;
                        if (pVal && abil) {
                            PropDefaultSetter(pAbil, pPropName, pVal);
                            abil._posMod = true; // see processBeforeFrame
                        }
                    }
                },
                [AbPlacement.RotProp]: {
                    propName: AbPlacement.RotProp,
                    propType: PropValueTypes.NumberQuad,
                    propDefault: pRot ? ParseValueToType(PropValueTypes.NumberQuad, pRot) as number[] : [0,0,0,1],
                    propDesc: 'Rotation',
                    propGetter: PropDefaultGetter,
                    propSetter: (pAbil: Ability, pPropName: string, pVal: PropValue) => {   // Set camera position
                        const abil = pAbil as AbPlacement;
                        if (pVal && abil) {
                            PropDefaultSetter(pAbil, pPropName, pVal);
                            abil._rotMod = true; // see processBeforeFrame
                        }
                    }
                },
                [AbPlacement.ForProp]: {
                    propName: AbPlacement.ForProp,
                    propType: PropValueTypes.Number,
                    propDefault: pFor ?? 0,
                    propDesc: 'Frame of Reference for position and rotation',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbPlacement.PosToProp]: {
                    propName: AbPlacement.PosToProp,
                    propType: PropValueTypes.NumberTriple,
                    propDefault: pPos ? ParseValueToType(PropValueTypes.NumberTriple, pPos) as number[] : [0,0,0],
                    propDesc: 'Position target',
                    propGetter: PropDefaultGetter,
                    propSetter: (pAbil: Ability, pPropName: string, pVal: PropValue) => {   // Set camera position
                        const abil = pAbil as AbPlacement;
                        if (pVal && abil) {
                            PropDefaultSetter(pAbil, pPropName, pVal);
                            abil._posToMod = true; // see processBeforeFrame
                            this._posToStart = Date.now();
                        }
                    }
                },
                [AbPlacement.RotToProp]: {
                    propName: AbPlacement.RotToProp,
                    propType: PropValueTypes.NumberQuad,
                    propDefault: pRot ? ParseValueToType(PropValueTypes.NumberQuad, pRot) as number[] : [0,0,0,1],
                    propDesc: 'Rotation target',
                    propGetter: PropDefaultGetter,
                    propSetter: (pAbil: Ability, pPropName: string, pVal: PropValue) => {   // Set camera position
                        const abil = pAbil as AbPlacement;
                        if (pVal && abil) {
                            PropDefaultSetter(pAbil, pPropName, pVal);
                            abil._rotToMod = true; // see processBeforeFrame
                            this._rotToStart = Date.now();
                        }
                    }
                },
                [AbPlacement.PosSpeedProp]: {
                    propName: AbPlacement.PosSpeedProp,
                    propType: PropValueTypes.Number,
                    propDefault: 0,
                    propDesc: 'Rotation target',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
        });
        this._posMod = this._rotMod = false;
        this._posToMod = this._rotToMod = false;
    };


    _posMod = false;
    _posToMod = false;
    _posToStart: number = Date.now();

    _rotMod = false;
    _rotToMod = false;
    _rotToStart: number = Date.now();

    addProperties(pBItem: BItem): void {
        super.addProperties(pBItem);

        // Update things just before rendering
        this._beforeFrameWatcher = Graphics.WatchBeforeFrame(this.processBeforeFrame.bind(this) as EventProcessor);
    };

    _beforeFrameWatcher: SubscriptionEntry = undefined;
    processBeforeFrame(pParms: GraphicsBeforeFrameProps): void {
        const cPos = this.getProp(AbPlacement.PosProp) as number[];
        const cRot = this.getProp(AbPlacement.RotProp) as number[];
        const cPosTo = this.getProp(AbPlacement.PosToProp) as number[];
        const cRotTo = this.getProp(AbPlacement.RotToProp) as number[];
        if (cPos[0] != cPosTo[0] || cPos[2] != cPosTo[2] || cPos[1] != cPosTo[1]) {
            const moveDuration = Date.now() - this._posToStart;
            const moveScale = Clamp(moveDuration / Config.world.lerpIntervalMS, 0, 1);

            if (moveScale > 0.9) {
                // Logger.debug(`AbPlacement.beforeFrame: moveScale done d=${moveDuration}, ms=${moveScale}`);
                // Moved enough. Assume we're done
                // Set the values directly to avoid the setter side effects
                this.propValues[AbPlacement.PosProp] = cPosTo;
                this.propValues[AbPlacement.RotProp] = cRotTo;
            }
            else {
                const pos = new BJSVector3(cPos[0], cPos[1], cPos[2]);
                const posTo = new BJSVector3(cPosTo[0], cPosTo[1], cPosTo[2]);
                const rot = new BJSQuaternion(cRot[0], cRot[1], cRot[2], cRot[3]);
                const rotTo = new BJSQuaternion(cRotTo[0], cRotTo[1], cRotTo[2], cRotTo[3]);
                const np = BJSVector3.Lerp(pos, posTo, moveScale);
                const nr = BJSQuaternion.Slerp(rot, rotTo, moveScale);

                this.propValues[AbPlacement.PosProp] = [ np.x, np.y, np.z ];
                this.propValues[AbPlacement.RotProp] = [ nr.x, nr.y, nr.z, nr.w ];
                Logger.debug(`AbPlacement.beforeFrame: pos=${pos}, pTo=${posTo}, d=${moveDuration}, ms=${moveScale}`);
            }
            // Anyone watching the position should know about the position update
            // NOTE: does not store the new value of the pos property but just generates a change event.
            //     Since the pos value was updated above this does not want the side effects of mod flag.
            this.containingBItem.setProp(AbPlacement.PosProp, this.propValues[AbPlacement.PosProp], false);
            this.containingBItem.setProp(AbPlacement.RotProp, this.propValues[AbPlacement.RotProp], false);
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