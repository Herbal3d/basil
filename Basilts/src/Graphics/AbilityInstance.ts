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
import { BItem, PropEntry, PropValue } from '@BItem/BItem';
import { BItems } from '@BItem/BItems';
import { CoordSystem } from '@Comm/BMessage';

import { ParseThreeTuple, ParseFourTuple, ExtractStringError } from '@Base/Tools/Utilities';
import { BKeyedCollection } from '@Tools/bTypes';
import { PlaceInWorld, PlaceInWorldProps, ScheduleDelayedGraphicsOperation } from './GraphicOps';
import { AssetRepresentationProp } from './AbilityAssembly';
import { Logger } from '@Base/Tools/Logging';

// Some BItems are Assemblys (3d represntations) and other BItems are instances of the
//     3d representations. This Ability is the Intance.
// There are fixes so a single BItem can include both the Assembly and Instance Abilities.

export const InstanceAbilityName = 'Instance';

export const InstanceRefItem = 'RefItem'; // either 'SELF' or id of BItem with the geometry
export const InstancePosProp = 'Pos';
export const InstanceRotProp = 'Rot';
export const InstancePosRefProp = 'PosRef';
export const InstanceRotRefProp = 'RotRef';

export function AbilityInstanceFromProps(pProps: BKeyedCollection): AbilityInstance {
    const newAbil = new AbilityInstance(pProps[InstanceRefItem], pProps[InstancePosProp], pProps[InstanceRotProp] );
    return newAbil;
};

export interface InstanceAfterRequestProps {
    Ability: AbilityInstance;
    RefItem: string;
    Name: string;
};


export class AbilityInstance extends Ability {
    _refItem: PropValue = 'SELF';
    _pos: PropValue = '[0,0,0]';
    _posArray: number[] = [0,0,0];      // value of POS that is a number array
    _posRef: PropValue = 0;
    _rot: PropValue = '[0,0,0,1]';
    _rotArray: number[] = [0,0,0,1];    // value of ROT that is a number array
    _rotRef: PropValue = 0;
    _worldObject: Object3D;
    
    constructor(pRefItem: string, pPos: string | number[], pRot: string | number[] ) {
        super(InstanceAbilityName);
        this._refItem = pRefItem;
        this._pos = <PropValue>(pPos ?? '[0,0,0]');
        this._rot = <PropValue>(pRot ?? '[0,0,0,1]');
    };

    addProperties(pBItem: BItem): void {
        // Get and Set the BItem that holds the 3d representation of this instance.
        // The reference can be to "SELF" to point to same BItem.
        // As a side effect, the placement if the Assembly in the 3d world is initiated.
        const propEntry = pBItem.addProperty({
            name: InstanceRefItem,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                return (pPE.ability as AbilityInstance)._refItem;
            },
            setter: (pPE: PropEntry, pBItem: BItem, pVal: PropValue): void => {
                if (pVal === 'SELF') {
                    pVal = pBItem.id;
                }
                (pPE.ability as AbilityInstance)._refItem = pVal;
                // TODO: get pointer to graphics item for quick access
                ScheduleDelayedGraphicsOperation(InstanceIntoWorld, {
                    Ability: this,
                    Name: pBItem.id
                })
            }
        });
        // Since the above property has a computed value, set the balue so it get updated
        propEntry.setter(propEntry, pBItem, this._refItem);

        // Get and Set the instance's position in the 3d world.
        // Passed position is normalized into a number array.
        pBItem.addProperty({            // POS
            name: InstancePosProp,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                // TODO: fetch value from graphics engine
                return (pPE.ability as AbilityInstance)._pos;
            },
            setter: (pPE: PropEntry, pBItem: BItem, pVal: PropValue): void => {
                const ability = pPE.ability as AbilityInstance;
                ability._pos = pVal;
                ability._posArray = ParseThreeTuple(pVal as string | number[])
                if (ability._worldObject) {
                    ability._worldObject.position.fromArray(ability._posArray);
                };
                // TODO: push value into graphics engine
            }
        });
        // Get and Set the instances' rotation in the 3d world.
        // Passed rotation is normalized into a number array.
        pBItem.addProperty({            // ROT
            name: InstanceRotProp,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                // TODO: fetch value from graphics engine
                return (pPE.ability as AbilityInstance)._rot;
            },
            setter: (pPE: PropEntry, pBItem: BItem, pVal: PropValue): void => {
                const ability = pPE.ability as AbilityInstance;
                ability._rot = pVal;
                ability._rotArray = ParseFourTuple(pVal as string | number[]);
                if (ability._worldObject) {
                    ability._worldObject.rotation.fromArray(ability._rotArray);
                };
                // TODO: push value into graphics engine
            }
        });
        // Get and Set the Instance's position reference
        pBItem.addProperty({            // POSREF
            name: InstancePosRefProp,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                // TODO: fetch value from graphics engine
                return (pPE.ability as AbilityInstance)._posRef;
            },
            setter: (pPE: PropEntry, pBItem: BItem, pVal: PropValue): void => {
                if (typeof(pVal) === 'string') {
                    (pPE.ability as AbilityInstance)._posRef = CoordSystem[pVal.toUpperCase() as keyof typeof CoordSystem];
                }
                else {
                    (pPE.ability as AbilityInstance)._posRef = Number(pVal);
                };
                // TODO: push value into graphics engine
            }
        });
        // Get and Set the instance's rotation reference
        pBItem.addProperty({            // ROTREF
            name: InstanceRotRefProp,
            ability: this,
            getter: (pPE: PropEntry, pBItem: BItem): PropValue => {
                // TODO: fetch value from graphics engine
                return (pPE.ability as AbilityInstance)._rotRef;
            },
            setter: (pPE: PropEntry, pBItem: BItem, pVal: PropValue): void => {
                if (typeof(pVal) === 'string') {
                    (pPE.ability as AbilityInstance)._rotRef = CoordSystem[pVal.toUpperCase() as keyof typeof CoordSystem];
                }
                else {
                    (pPE.ability as AbilityInstance)._rotRef = Number(pVal);
                };
                // TODO: push value into graphics engine
            }
        });
    };
};

// Place the Instance into the 3d world.
// Returns a Promise that is resolved when loaded or rejected if the are problems.
async function InstanceIntoWorld(pProps: InstanceAfterRequestProps): Promise<void> {
    Logger.debug(`AbilityInstance.InstanceIntoWorld: entry`);
    const ability = pProps.Ability;
    if (typeof(ability._worldObject) === 'undefined') {
        if (typeof(ability._refItem) === 'string') {
            const bitem = BItems.get(ability._refItem);
            if (bitem) {
                bitem.WhenReady()
                .then ( bb => {
                    Logger.debug(`AbilityInstance.InstanceIntoWorld: READY BItem. Doing PlaceInWorld`);
                    const representation = bitem.getProp(AssetRepresentationProp);
                    if (representation) {
                        const inWorldParams: PlaceInWorldProps = {
                            Name: pProps.Name,
                            Pos: ability._posArray,
                            PosCoord: (ability._posRef as CoordSystem),
                            Rot: ability._rotArray,
                            RosCoord: (ability._rotRef as CoordSystem),
                            Object: representation as Object3D
                        };
                        ability._worldObject = PlaceInWorld(inWorldParams);
                        Logger.debug(`AbilityInstance.InstanceIntoWorld: successful PlaceInWorld`);
                    }
                    else {
                        Logger.error(`AbilityInstance.InstanceIntoWorld: READY bitem does not have represenation`);
                    };
                })
                .catch ( err => {
                    Logger.error(`AbilityInstance.InstanceIntoWorld: exception ${ExtractStringError(err)}`);
                });
            }
            else {
                Logger.error(`AbilityInstance.InstanceIntoWorld: ItemRef not found: ${ability._refItem}`);

            };
        }
        else {
            Logger.error(`AbilityInstance.InstanceIntoWorld: ItemRef if an odd type: ${typeof(ability._refItem)}`);
        };
    };
};

