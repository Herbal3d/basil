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
    Link(pParent) {
        this.parent = pParent;

        this.parent.EventName_OnChangePos = 'Pos-' + AbilityInstance.NAME + '-' + this.parent.id;
        this.parent.EventName_OnChangeRot = 'Rot-' + AbilityInstance.NAME + '-' + this.parent.id;

        this.parent.DefinePropertiesWithProps(AbilityInstance.PropsToVars);

        this.SetLoading();

        this.InstantiateInstance();
    };

    // Unlink this ability from the enclosing BItem. This is overloaded by actual Ability.
    Unlink(pParent) {
        this.parent.UndefinePropertiesWithProps(AbilityInstance.PropsToVars);
    };

    // Initialize this ability from individual values
    SetFromValues(pDisplayableId, pPosInfo, pProps) {
        SetViaProps(this, 'did', pDisplayableId, AbilityInstance.PropsToVars);
        // GP.DebugLog('AbilityInstance.SetFromValues: pPosInfo =' + JSONstringify(pPosInfo));
        if (pPosInfo) {
            SetViaProps(this, 'pos', pPosInfo.Pos, AbilityInstance.PropsToVars);
            SetViaProps(this, 'rot', pPosInfo.Rot, AbilityInstance.PropsToVars);
            SetViaProps(this, 'possystem', pPosInfo.PosRef, AbilityInstance.PropsToVars);
            SetViaProps(this, 'rotsystem', pPosInfo.RotRef, AbilityInstance.PropsToVars);
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

    InstantiateInstance() {
        if (this.displayableId) {
            let displayable = BItem.GetItem(this.displayableId);
            if (displayable) {
                this.displayable = displayable;
                this.PlaceInWorld();
                this.SetReady();
            }
            else {
                GP.ErrorLog('AbilityInstance.InstantiateInstance: cannot find displayable ' + this.displayableId);
            };
        };
    };

    // Do whatever is needed to place this instance into the graphics scene.
    PlaceInWorld() {
        if (this.displayable) {
            // TODO: if displayable is not ready, should display the bounding box
            this.displayable.WhenReady()
            .then( function(disp) {
                let abilityDisp = disp.GetAbility(AbilityDisplayable.NAME);
                if (abilityDisp) {
                    abilityDisp.graphics.PlaceInWorld(this, abilityDisp);
                }
                else {
                    GP.ErrorLog('AbilityInstance.PlaceInWorld: cannot get displayable ability');
                }
            }.bind(this))
            .catch( function(e) {
                // Something wrong with the displayable
                GP.ErrorLog('AbilityInstance.PlaceInWorld: could not place in world. e=' + e);
                this.SetFailed();
            }.bind(this));
        }
        else {
            GP.ErrorLog('AbilityInstance.PlaceInWorld: no displayable set. InstId=' + this.parent.id);

        };
    };

    // Do whatever is needed to remove this instance from the graphics scene.
    RemoveFromWorld() {
        if (this.displayable) {
            this.displayable.graphics.RemoveFromWorld(this);
        }
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
        set: (obj, val) => { obj.gPos = ParseThreeTuple(val) ;},
        propertyName: 'Instance.Position',
        default: "0,2,4",
        ability: AbilityInstance.NAME
    },
    'rot' : {
        get: (obj) => { return obj.gRot ? JSON.stringify(obj.gRot) : undefined },
        set: (obj, val) => { obj.gRot = ParseFourTuple(val); },
        propertyName: 'Instance.Rotation',
        default: "0,0,0,1",
        ability: AbilityInstance.NAME
    },
    'possystem' : {
        get: (obj) => { return obj.gPosCoordSystem; },
        set: (obj, val) => { obj.gPosCoordSystem = Number(val) ;},
        name: 'posSystem',
        propertyName: 'Instance.PosCoordSystem',
        default: "0",
        ability: AbilityInstance.NAME
    },
    'rotsystem' : {
        get: (obj) => { return obj.gRotCoordSystem; },
        set: (obj, val) => { obj.gRotCoordSystem = Number(val) ;},
        name: 'rotSystem',
        propertyName: 'Instance.RotCoordSystem',
        default: "0",
        ability: AbilityInstance.NAME
    },
    'did' : {
        get: (obj) => { return obj.displayableId },
        set: (obj, val) => { obj.displayableId = val ;},
        name: 'displayableId',
        ability: AbilityInstance.NAME
    },
    'dstate' : {
        get: (obj) => { return obj.displayable ? obj.displayable.state : undefined; },
        name: 'displayableState',
        propertyName: 'Instance.DisplayableState',
        default: BItemState.UNINITIALIZED,
        ability: AbilityInstance.NAME
    },
};
