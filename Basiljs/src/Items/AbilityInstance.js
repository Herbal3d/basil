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

import { ParseThreeTuple, ParseFourTuple } from '../Utilities.js';

import { AnAbility, SetViaProps, GenerateProps, InitializeProps } from './Abilities.js';
import { BItemState } from './BItem.js';

// A instance capability specifies an Item with AbilityDisplayable
//    and a place to put it.
export class AbilityInstance extends AnAbility {

    static get NAME() { return 'INST' };

    constructor() {
        super(AbilityInstance.NAME); // Code used in protocol to specify this ability
    };

    // Link ability to parent BItem and do initialization
    Link(pParent) {
        this.parent = pParent;

        this.parent.EventName_OnChangePos = 'Pos-' + AbilityInstance.NAME + '-' + this.parent.id;
        this.parent.EventName_OnChangeRot = 'Rot-' + AbilityInstance.NAME + '-' + this.parent.id;

        this.parent.DefinePropertiesWithProps(AbilityInstance.PropsToVars);
    };

    // Unlink this ability from the enclosing BItem. This is overloaded by actual Ability.
    Unlink(pParent) {
        this.parent.UndefinePropertiesWithProps(AbilityInstance.PropsToVars);
    };

    // Initialize this ability from individual values
    SetFromValues(pDisplayableId, pPosInfo, pProps) {
        SetViaProps(this, 'displayableid', pDisplayableId, AbilityInstance.PropsToVars);
        if (pPosInfo) {
            SetViaProps(this, 'pos', pPosInfo.pos, AbilityInstance.PropsToVars);
            SetViaProps(this, 'rot', pPosInfo.rot, AbilityInstance.PropsToVars);
            SetViaProps(this, 'possystem', pPosInfo.posRef, AbilityInstance.PropsToVars);
            SetViaProps(this, 'rotsystem', pPosInfo.rotRef, AbilityInstance.PropsToVars);
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

};

// Mapping of property list names to properties on this instance.
// See Ability.InitializeProps() and Ability.GenerateProps() for usage.
// Property name definitions must be loader case.
AbilityInstance.PropsToVars = {
    'pos': {
        get: (obj) => { return JSON.stringify(obj.gPos) },
        set: (obj, val) => { obj.gPos = ParseThreeTuple(val) ;},
        propertyName: 'Instance.Position'
    },
    'rot' : {
        get: (obj) => { return JSON.stringify(obj.pRot) },
        set: (obj, val) => { obj.pRot = ParseFourTuple(val) ;},
        propertyName: 'Instance.Rotation'
    },
    'possystem' : {
        get: (obj) => { return String(obj.gPosCoordSystem) },
        set: (obj, val) => { obj.gPosCoordSystem = Integer(val) ;},
        name: 'posSystem',
        propertyName: 'Instance.PosCoordSystem'
    },
    'rotsystem' : {
        get: (obj) => { return String(obj.gRotCoordSystem) },
        set: (obj, val) => { obj.gRotCoordSystem = Integer(val) ;},
        name: 'rotSystem',
        propertyName: 'Instance.RotCoordSystem'
    },
    'displayableid' : {
        get: (obj) => { return obj.displayableId },
        set: (obj, val) => { obj.displayableId = val ;},
        name: 'displayableId',
    },
    'displayablestate' : {
        get: (obj) => { return obj.displayable ? obj.displayable.state : BItemState.UNINITIALIZED; },
        name: 'displayableState',
        propertyName: 'Instance.DisplayableState'
    },
};
