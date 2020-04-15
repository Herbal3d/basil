// Copyright 2020 Robert Adams
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

import { GP } from 'GLOBALS';
import { BException } from '../BException.js';

import { ParseThreeTuple, ParseFourTuple, JSONstringify } from '../Utilities.js';

import { AnAbility, SetViaProps, GenerateProps, InitializeProps } from './Abilities.js';
import { BItemState, BItem } from './BItem.js';
import { AbilityDisplayable } from './AbilityDisplayable.js';

// A instance capability specifies an Item with AbilityDisplayable
//    and a place to put it.
export class AbilityInstance extends AnAbility {

    static get NAME() { return 'INST' };

    constructor() {
        super(AbilityInstance.NAME, AbilityInstance.PropsToVars); // Code used in protocol to specify this ability
    };

    // Link ability to parent BItem and do initialization
    // returns a Promise that resolves with the enclosing BItem when the Displayable is Instanced
    Link(pParent) {
        this.parent = pParent;

        this.parent.EventName_OnChangePos = 'Pos-' + AbilityInstance.NAME + '-' + this.parent.id;
        this.parent.EventName_OnChangeRot = 'Rot-' + AbilityInstance.NAME + '-' + this.parent.id;

        this.parent.DefinePropertiesWithProps(AbilityInstance.PropsToVars);

        this.SetLoading();

        return this.InstantiateInstance();
    };

    // Unlink this ability from the enclosing BItem. This is overloaded by actual Ability.
    Unlink(pParent) {
        // GP.DebugLog('AbilityInstance.Unlink: doing RemoveFromWorld');
        this.RemoveFromWorld();
        this.parent.UndefinePropertiesWithProps(AbilityInstance.PropsToVars);
    };

    // Initialize this ability from individual values
    SetFromValues(pDisplayableItemId, pPosInfo, pProps) {
        SetViaProps(this, 'displayableitemid', pDisplayableItemId, AbilityInstance.PropsToVars);
        // GP.DebugLog('AbilityInstance.SetFromValues: pPosInfo =' + JSONstringify(pPosInfo));
        if (pPosInfo) {
            SetViaProps(this, 'pos', pPosInfo.Pos, AbilityInstance.PropsToVars);
            SetViaProps(this, 'rot', pPosInfo.Rot, AbilityInstance.PropsToVars);
            SetViaProps(this, 'posref', pPosInfo.PosRef, AbilityInstance.PropsToVars);
            SetViaProps(this, 'rotref', pPosInfo.RotRef, AbilityInstance.PropsToVars);
        };
        if (pProps) {
            InitializeProps(this, pProps, AbilityInstance.PropsToVars);
        };
        return this;
    };
    // deserialized parameters from Map<string,string>()
    InitializeWithProperties(pParamBlock) {
        InitializeProps(this, pParamBlock, AbilityInstance.PropsToVars);
        return this;
    };
    // Return properties that define this ability instance as Map<string,string>()
    GetProperties() {
        return GenerateProps(this, AbilityInstance.PropsToVars);
    };

    // Place an instance in the graphics scene.
    // Returns a Promise that is resolved with the Instance BItem when the instance has been placed.
    // Rejection is a new BException.
    InstantiateInstance() {
        return new Promise( function(resolve, reject) {
            if (this.displayableItemId) {
                let displayable = BItem.GetItem(this.displayableItemId);
                if (displayable) {
                    this.PlaceInWorld(displayable)
                    .then( function(abilInstance) {
                        this.SetReady();
                        resolve(this.parent);
                    }.bind(this) )
                    .catch(e => {
                        let err = 'AbilityInstance.InstantiateInstance: '
                                + 'Exception placing in world: ' + JSONstringify(e);
                        GP.ErrorLog(err);
                        reject(new BException(err));
                    });
                }
                else {
                    let err = 'AbilityInstance.InstantiateInstance: cannot find displayable '
                                    + this.displayableItemId;
                    GP.ErrorLog(err);
                    reject(new BException(err));
                };
            }
            else {
                let err = 'AbilityInstance.InstantiateInstance: No displayableItemId specified.';
                GP.ErrorLog(err);
                reject(new BException(err));
            };
        }.bind(this) );
    };

    // Remove the instance from the graphics scene.
    // Safe to call multiple times.
    DeinstantiateInstance() {
        if (this.displayableItemId) {
            let displayableBItem = BItem.GetItem(this.displayableItemId);
            if (displayableBItem) {
                this.RemoveFromWorld(displayableBItem)
            };
        };
    };

    // Do whatever is needed to place this instance into the graphics scene.
    // Returns a Promise that is resolved with this ability when the Instance is in the scene.
    // Rejection is a new BException.
    PlaceInWorld(displayableBItem) {
        return new Promise( function(resolve, reject) {
            // TODO: if displayable is not ready, should display the bounding box
            displayableBItem.WhenReady(20000)
            .then( function(dispBItem) {
                let abilityDisp = dispBItem.GetAbility(AbilityDisplayable.NAME);
                if (abilityDisp) {
                    // GP.DebugLog('AbilityInstance.PlaceInWorld: calling graphics.PlaceInWorld');
                    abilityDisp.graphics.PlaceInWorld(this, abilityDisp);
                    // This is a kludge that gives this instance a handle to displayable graphic context
                    this.graphics = abilityDisp.graphics;
                }
                else {
                    let err = 'AbilityInstance.PlaceInWorld: cannot get displayable ability';
                    GP.ErrorLog(err);
                    reject(new BException(err));
                }
                resolve(this);
            }.bind(this))
            .catch( function(e) {
                // Something wrong with the displayable
                let err = 'AbilityInstance.PlaceInWorld:'
                            + ' error waiting for displayable to load. e='
                            + JSONstringify(e);
                GP.ErrorLog(err);
                this.SetFailed();
                reject(new BException(err));
            }.bind(this));
        }.bind(this) );
    };

    // The position and rotation have been updated
    UpdatePosRot() {
        if (this.worldNode) {
            this.worldNode.position.set(this.gPos);
            this.worldNode.quaternion.set(this.gRot);

        };
    };

    // Do whatever is needed to remove this instance from the graphics scene.
    // Pass the BItem instance that includes the AbilityDisplayable
    RemoveFromWorld(displayableBItem) {
        if (this.graphics) {
            this.graphics.RemoveFromWorld(this);
        }
        else {
            GP.ErrorLog('AbilityInstance.RemoveFromWorld: no graphics context available');
        };
    }

    ReleaseResources() {
        // GP.DebugLog('AbilityInstance.ReleaseResources');
        if (this.parent) {
            this.RemoveFromWorld(this.parent);
        };
    }

};

// Mapping of property list names to properties on this instance.
// See Ability.InitializeProps() and Ability.GenerateProps() for usage.
// Property name definitions must be loader case.
// The 'obj' is the parent BItem.
// The entries for each property are:
//          'get', 'set': value get and set operations
//          'name': named used for the property when exported for the protocol
//          'propertyName': the name of the BItem property to register for this property
//          'ability': if this var is part of an ability (used by BItem fetch)
AbilityInstance.PropsToVars = {
    'pos': {
        get: (obj) => { return obj.gPos ? JSON.stringify(obj.gPos) : undefined },
        set: (obj, val) => { obj.gPos = ParseThreeTuple(val);
                            // obj.GetAbility(AbilityInstance.NAME).UpdatePosRot();
                            },
        name: 'Pos',
        default: "[0,2,4]",
        ability: AbilityInstance.NAME
    },
    'rot' : {
        get: (obj) => { return obj.gRot ? JSON.stringify(obj.gRot) : undefined },
        set: (obj, val) => { obj.gRot = ParseFourTuple(val);
                            // obj.GetAbility(AbilityInstance.NAME).UpdatePosRot();
                            },
        name: 'Rot',
        default: "[0,0,0,1]",
        ability: AbilityInstance.NAME
    },
    'posref' : {
        get: (obj) => { return String(obj.gPosCoordSystem); },
        set: (obj, val) => { obj.gPosCoordSystem = Number.parseInt(val, 10) ;},
        name: 'PosRef',
        default: "0",
        ability: AbilityInstance.NAME
    },
    'rotref' : {
        get: (obj) => { return String(obj.gRotCoordSystem); },
        set: (obj, val) => { obj.gRotCoordSystem = Number.parseInt(val, 10) ;},
        name: 'RotRef',
        default: "0",
        ability: AbilityInstance.NAME
    },
    'displayableitemid' : {
        get: (obj) => { return obj.displayableItemId },
        set: (obj, val) => { obj.displayableItemId = val ;},
        name: 'DisplayableItemId',
        ability: AbilityInstance.NAME
    },
    'displayablestate' : {
        get: (obj) => { return obj.displayable ? obj.displayable.state : undefined; },
        name: 'DisplayableState',
        ability: AbilityInstance.NAME
    },
};
