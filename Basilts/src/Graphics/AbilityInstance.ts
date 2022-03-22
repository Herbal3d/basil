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

import { Object3D } from 'three';

import { Ability } from '@Abilities/Ability';
import { AbilityAssembly } from '@Graphics/AbilityAssembly';
import { BItem,  PropValue, setPropEventParams } from '@BItem/BItem';
import { BItems } from '@BItem/BItems';
import { CoordSystem } from '@Comm/BMessage';
import { RegisterAbility } from '@Abilities/AbilityManagement';

import { ParseThreeTuple, ParseFourTuple, ExtractStringError } from '@Base/Tools/Utilities';
import { BKeyedCollection } from '@Tools/bTypes';
import { PlaceInWorld, PlaceInWorldProps, RemoveFromWorld, ScheduleDelayedGraphicsOperation } from './GraphicOps';
import { Logger } from '@Base/Tools/Logging';
import { SubscriptionEntry } from '@Base/Eventing/SubscriptionEntry';
import { Eventing } from '@Base/Eventing/Eventing';

// Some BItems are Assemblys (3d represntations) and other BItems are instances of the
//     3d representations. This Ability is the Intance.
// There are fixes so a single BItem can include both the Assembly and Instance Abilities.

export const InstanceAbilityName = 'Instance';

export function AbilityInstanceFromProps(pProps: BKeyedCollection): AbilityInstance {
    const newAbil = new AbilityInstance(pProps[AbilityInstance.InstanceRefItemProp],
                                        pProps[AbilityInstance.InstancePosProp],
                                        pProps[AbilityInstance.InstanceRotProp] );
    return newAbil;
};

export interface InstanceAfterRequestProps {
    Ability: AbilityInstance;
    RefItem: string;
    Name: string;
};

export class AbilityInstance extends Ability {
    static InstanceRefItemProp = 'refItem'; // either 'SELF' or id of BItem with the geometry
    static InstanceRefItemSelf = 'SELF';
    static InstancePosProp = 'pos';
    static InstanceRotProp = 'rot';
    static InstancePosRefProp = 'posRef';
    static InstanceRotRefProp = 'rotRef';

    // This watches the 'assetUrl' on the refItem so we know when to place the instance in the world
    _assetRepresentationWatchTopic: SubscriptionEntry;
    _previousRefItem: PropValue;

    // 'refItem' is the ID of the BItem that contains the geometry
    _refItem: PropValue = AbilityInstance.InstanceRefItemSelf;
    public get refItem(): PropValue { return this._refItem; }
    public set refItem(pVal: PropValue) {
        if (pVal === AbilityInstance.InstanceRefItemSelf) {
            if (this._containingBItem) {
                pVal = this._containingBItem.id;
            }
        }
        this._refItem = pVal;
        if (this._refItem !== this._previousRefItem) {
            if (this._assetRepresentationWatchTopic) {
                Eventing.Unsubscribe(this._assetRepresentationWatchTopic);
                this._assetRepresentationWatchTopic = null;
            }
            this._previousRefItem = this._refItem;
            const referedItem = BItems.get(this._refItem as string);
            if (referedItem) {
                this._assetRepresentationWatchTopic = Eventing.Subscribe(
                        referedItem.setPropEventTopicName(AbilityAssembly.AssetRepresentationProp),
                        ProcessChangedAssetRepresentation,
                        this);
            }
            else {
                Logger.error(`AbilityInstance: refItem ${this._refItem} not found`);
            }
        }
    };

    _pos: number[] = [0,0,0];
    public get pos(): number[] { return this._pos; }
    public set pos(pVal: string | number[]) {
        this._pos = ParseThreeTuple(pVal);
        if (this._worldObject) {
            // handle frame-of-reference computation
            this._worldObject.position.fromArray(this._pos);
        };
    }
    _posRef: number = 0;
    public get posRef(): number { return this._posRef; }
    public set posRef(pVal: string | number) {
        if (typeof(pVal) === 'string') {
            this._posRef = CoordSystem[pVal.toUpperCase() as keyof typeof CoordSystem];
        }
        else {
            this._posRef = Number(pVal);
        };
    }

    _rot: number[] = [0,0,0,1];
    public get rot(): number[] { return this._rot; }
    public set rot(pVal: string | number[]) {
        this._rot = ParseFourTuple(pVal);
        if (this._worldObject) {
            // handle frame-of-reference computation
            this._worldObject.quaternion.fromArray(this._rot);
        };
    }
    _rotRef: number = 0;
    public get rotRef(): number { return this._rotRef; }
    public set rotRef(pVal: string | number) {
        if (typeof(pVal) === 'string') {
            this._rotRef = CoordSystem[pVal.toUpperCase() as keyof typeof CoordSystem];
        }
        else {
            this._rotRef = Number(pVal);
        };
    }

    _worldObject: Object3D;

    _containingBItem: BItem;
    
    constructor(pRefItem: string, pPos: string | number[], pRot: string | number[] ) {
        super(InstanceAbilityName);
        this._refItem = pRefItem;
        this._pos = pPos ? ParseThreeTuple(pPos) : [0,0,0];
        this._rot = pRot ? ParseFourTuple(pRot) :  [0,0,0,1];
    };

    addProperties(pBItem: BItem): void {
        this._containingBItem = pBItem;

        // Get and Set the BItem that holds the 3d representation of this instance.
        // The reference can be to "SELF" to point to same BItem.
        // As a side effect, the placement if the Assembly in the 3d world is initiated.
        const propEntry = pBItem.addProperty(AbilityInstance.InstanceRefItemProp, this);
        // Since the above property has a computed value, set the value so it get updated
        this.refItem = this._refItem;

        // Get and Set the instance's position in the 3d world.
        // Passed position is normalized into a number array.
        pBItem.addProperty(AbilityInstance.InstancePosProp, this);
        // Get and Set the instances' rotation in the 3d world.
        // Passed rotation is normalized into a number array.
        pBItem.addProperty(AbilityInstance.InstanceRotProp, this);
        // Get and Set the Instance's position reference
        pBItem.addProperty(AbilityInstance.InstancePosRefProp, this);
        // Get and Set the instance's rotation reference
        pBItem.addProperty(AbilityInstance.InstanceRotRefProp, this);
    };

    // If any of my properties are removed, that means I'm being removed.
    // Disconnect this instance from the world.
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        if (pPropertyName === AbilityInstance.InstanceRefItemProp) {
            if (this._worldObject) {
                RemoveFromWorld(this._worldObject);
                this._worldObject = null;
            };
        };
        return;
    };
};

// When the refItem's representation changes, we get this event
// Any existing in-world instance needs to be removed and the new representation placed in the world
function ProcessChangedAssetRepresentation(pParams: setPropEventParams, pTopic: string, pOtherParam: any): void {
    const tthis = pOtherParam as AbilityInstance;
    if (tthis._worldObject) {
        // Remove the instance from the world
        RemoveFromWorld(tthis._worldObject);
        tthis._worldObject = null;
    };
    InstanceIntoWorld(tthis, pParams.NewValue as Object3D);
}

// Place the Instance into the 3d world.
// Returns a Promise that is resolved when loaded or rejected if the are problems.
function InstanceIntoWorld(pAbil: AbilityInstance, pRepresent: Object3D): void {
    Logger.debug(`AbilityInstance.InstanceIntoWorld: entry`);
    try {
        if (pRepresent) {
            const inWorldParams: PlaceInWorldProps = {
                Name: pAbil._containingBItem.id,
                Pos: pAbil._pos,
                PosCoord: (pAbil._posRef as CoordSystem),
                Rot: pAbil._rot,
                RosCoord: (pAbil._rotRef as CoordSystem),
                Object: pRepresent
            };
            pAbil._worldObject =  PlaceInWorld(inWorldParams);
            pAbil._containingBItem.setReady();
            Logger.debug(`AbilityInstance.InstanceIntoWorld: successful PlaceInWorld`);
        }
        else {
            Logger.error(`AbilityInstance.InstanceIntoWorld: READY bitem does not have represenation`);
        };
    }
    catch (err) {
        Logger.error(`AbilityInstance.InstanceIntoWorld: exception ${ExtractStringError(err)}`);
    };
};

