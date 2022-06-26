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

import { Ability, RegisterAbility } from '@Abilities/Ability';
import { AbAssembly } from '@Abilities/AbilityAssembly';
import { BItem, PropValue, SetPropEventParams } from '@BItem/BItem';

import { Graphics } from '@Base/Graphics/Graphics';
import { Object3D } from '@Graphics/Object3d';

import { ParseThreeTuple, ParseFourTuple, JSONstringify } from '@Base/Tools/Utilities';
import { BKeyedCollection } from '@Tools/bTypes';
import { EventProcessor, SubscriptionEntry } from '@Base/Eventing/SubscriptionEntry';
import { Logger } from '@Base/Tools/Logging';

// Some BItems are Assemblys (3d represntations) and other BItems are instances of the
//     3d representations. This Ability is the Intance.
// There are fixes so a single BItem can include both the Assembly and Placement Abilities.

export const AbPlacementName = 'Placement';

export function AbPlacementFromProps(pProps: BKeyedCollection): AbPlacement {
    const position = pProps[AbPlacement.PosProp] as string | number[] | undefined;
    const rotation = pProps[AbPlacement.RotProp] as string | number[] | undefined;
    let frameOfReference: number = undefined;
    if (pProps.hasOwnProperty(AbPlacement.ForProp)) {
        if (pProps[AbPlacement.ForProp] instanceof Number) {
            frameOfReference = pProps[AbPlacement.ForProp] as number;
        }
        else {
            frameOfReference = parseInt(pProps[AbPlacement.ForProp] as string);
        }
    }   
    return new AbPlacement(position, rotation, frameOfReference);
};

// Register the ability with the AbilityFactory. Note this is run when this file is imported.
RegisterAbility(AbPlacementName, AbPlacementFromProps);

// Placement controls position/rotation of the BItem.
// Base properties are 'pos' and 'rot' which are the current position/rotation of the BItem
// There are 'posTo' and 'rotTo' which act as "move to" locations and this does LERP
//     type actions to move pos/rot to those targets.
export class AbPlacement extends Ability {
    static PosProp = 'pos';
    static RotProp = 'rot';
    static ForProp = 'for';
    static PosToProp = 'posTo';
    static RotToProp = 'rotTo';

    _pos: number[] = [0,0,0];
    _posMod = false;
    public get pos(): number[] { return this._pos; }
    public set pos(pVal: string | number[]) {
        if (pVal) {
            this._pos = ParseThreeTuple(pVal);
            this._posMod = true; // see processBeforeFrame
        }
    };
    // The *To properties will be used to known when to set absolute or to LERP
    public get posTo(): number[] { return this._pos; }
    public set posTo(pVal: string | number[]) {
        if (pVal) {
            this._pos = ParseThreeTuple(pVal);
            this._posMod = true; // see processBeforeFrame
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

    public get rotTo(): number[] { return this._rot; }
    public set rotTo(pVal: string | number[]) {
        if (pVal) {
            this._rot = ParseFourTuple(pVal);
            this._rotMod = true; // see processBeforeFrame
        }
    };

    _for: number = 0;
    public get for(): number { return this._for; }
    public set for(pVal: number) {
        this._for = pVal;
    };

    constructor(pPos: string | number[] | undefined, pRot: string | number[] | undefined, pFor?: number) {
        super(AbPlacementName);
        this._pos = pPos ? ParseThreeTuple(pPos) : [0,0,0];
        this._rot = pRot ? ParseFourTuple(pRot) :  [0,0,0,1];
        this._for = pFor ?? 0;

        // Update things just before rendering
        Graphics.WatchBeforeFrame(this.processBeforeFrame.bind(this) as EventProcessor);
    };

    addProperties(pBItem: BItem): void {
        super.addProperties(pBItem);
        // Get and Set the instance's position in the 3d world.
        // Passed position is normalized into a number array.
        pBItem.addProperty(AbPlacement.PosProp, this);
        // Get and Set the instances' rotation in the 3d world.
        // Passed rotation is normalized into a number array.
        pBItem.addProperty(AbPlacement.RotProp, this);
        // Get and Set the placement frame of reference.
        pBItem.addProperty(AbPlacement.ForProp, this);
    };

    // This watches the 'assetUrl' on the refItem so we know when to place the instance in the world
    _assetRepresentationWatchTopic: SubscriptionEntry;
    // This value is garbage so the first setting will see that the refItem changed
    _previousRefItem: PropValue = 'JustStuffThatIsNothing';

    processBeforeFrame(pParms: BKeyedCollection): void {
        if (this._posMod || this._rotMod) {
            // Start the LERPing
        }
        else {
            // do the LERPing of the position movement
        }
    };

    // If any of my properties are removed, that means I'm being removed.
    // Disconnect this instance from the world.
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };
};