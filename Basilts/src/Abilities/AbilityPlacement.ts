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

import { Ability } from '@Abilities/Ability';
import { AbAssembly } from '@Abilities/AbilityAssembly';
import { BItem,  PropValue } from '@BItem/BItem';

import { ParseThreeTuple, ParseFourTuple } from '@Base/Tools/Utilities';
import { BKeyedCollection } from '@Tools/bTypes';
import { Object3D } from '@Graphics/Object3d';
import { SubscriptionEntry } from '@Base/Eventing/SubscriptionEntry';
import { Eventing } from '@Base/Eventing/Eventing';
import { Logger } from '@Base/Tools/Logging';

// Some BItems are Assemblys (3d represntations) and other BItems are instances of the
//     3d representations. This Ability is the Intance.
// There are fixes so a single BItem can include both the Assembly and Placement Abilities.

export const AbPlacementName = 'Placement';

export function AbPlacementFromProps(pProps: BKeyedCollection): AbPlacement {
    const newAbil = new AbPlacement(pProps[AbPlacement.PosProp],
                                        pProps[AbPlacement.RotProp],
                                        pProps[AbPlacement.ForProp] );
    return newAbil;
};

export class AbPlacement extends Ability {
    static PosProp = 'pos';
    static RotProp = 'rot';
    static ForProp = 'for';

    // This watches the 'assetUrl' on the refItem so we know when to place the instance in the world
    _assetRepresentationWatchTopic: SubscriptionEntry;
    // This value is garbage so the first setting will see that the refItem changed
    _previousRefItem: PropValue = 'JustStuffThatIsNothing';

    _pos: number[] = [0,0,0];
    public get pos(): number[] { return this._pos; }
    public set pos(pVal: string | number[]) {
        this._pos = ParseThreeTuple(pVal);
        if (this.containingBItem) {
            const object3d = this.containingBItem.getProp(AbAssembly.AssetRepresentationProp) as Object3D;
            if (object3d) {
                object3d.pos.fromArray(this._pos);
            };
        };
    };

    _rot: number[] = [0,0,0,1];
    public get rot(): number[] { return this._rot; }
    public set rot(pVal: string | number[]) {
        this._rot = ParseFourTuple(pVal);
        if (this.containingBItem) {
            const object3d = this.containingBItem.getProp(AbAssembly.AssetRepresentationProp) as Object3D;
            if (object3d) {
                object3d.rot.set(this._rot[0], this._rot[1], this._rot[2], this._rot[3]);
            };
        };
    };

    _for: number = 0;
    public get for(): number { return this._for; }
    public set for(pVal: number) {
        this._for = pVal;
        if (this.containingBItem) {
            const object3d = this.containingBItem.getProp(AbAssembly.AssetRepresentationProp) as Object3D;
            if (object3d) {
                object3d.for = this._for;
            };
        };
    };

    constructor(pPos: string | number[], pRot: string | number[], pFor?: number) {
        super(AbPlacementName);
        this._pos = pPos ? ParseThreeTuple(pPos) : [0,0,0];
        this._rot = pRot ? ParseFourTuple(pRot) :  [0,0,0,1];
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
        // Get and Set the placement frame of reference.
        pBItem.addProperty(AbPlacement.ForProp, this);
    };

    // If any of my properties are removed, that means I'm being removed.
    // Disconnect this instance from the world.
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };
};