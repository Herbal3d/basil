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
import Config from '../config.js';
import { BException } from '../BException.js';

import { AnAbility, InitializeProps, GenerateProps, SetViaProps } from './Abilities.js';

// A instance capability specifies an Item with AbilityDisplayable
//    and a place to put it.
export class AbilityCamera extends AnAbility {

    static get NAME() { return 'CAM' };

    constructor() {
        super(AbilityCamera.NAME, AbilityCamera.PropsToVals);
    };

    // Link ability to parent BItem and do initialization
    Link(pParent) {
        this.parent = pParent;
        // A kludge that gives the camerae to the Graphics instance.
        // In the future, there might be multiple graphics engines.
        this.graphics = GP.GR;
        // Kludge: someday figure out how to pass the evening root around
        this.parent.EventName_OnChangePos = 'Pos-' + AbilityCamera.NAME + '-' + this.parent.id;
        this.parent.EventName_OnChangeRot = 'Rot-' + AbilityCamera.NAME + '-' + this.parent.id;

        this.parent.DefinePropertiesWithProps(AbilityCamera.PropsToVals);
    };

    // Unlink this ability from the enclosing BItem. This is overloaded by actual Ability.
    Unlink(pParent) {
        this.parent.UndefinePropertiesWithProps(AbilityCamera.PropsToVals);
    };

    // Initialize this ability from individual values
    SetFromValues(pPosInfo, pProps) {
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
        InitializeProps(this, pParamBlock, AbilityDisplayable.PropsToVars);
        return this;
    };
    // Return properties that define this ability instance as Map<string,string>()
    GetProperties() {
        return GenerateProps(this, AbilityDisplayable.PropsToVars);
    };

};

    // Mapping of property list names to properties on this instance.
    // See Ability.InitializeProps() and Ability.GenerateProps() for usage.
    // Property name definitions must be loader case.
AbilityCamera.PropsToVals = {
    'pos': {
        get: (obj) => { return JSON.stringify(obj.graphics.camera.position.toArray()); },
        set: (obj, val) => {
            let newPos = ParseThreeTuple(val);
            if (newPos) {
                obj.graphics.camera.position = (new THREE.Vector3()).fromArray(newPos);
            }
        },
        default: "0,1,2",
        propertyName: 'Camera.Position'
    },
    'rot' : {
        get: (obj) => { return JSON.stringify(obj.graphics.camera.rotation.toArray()); },
        set: (obj, val) => {
            let newRot = ParseFourTuple(val);
            obj.graphics.camera.rotation = (new THREE.Quaterion()).fromArray(newRot);
        },
        default: "0,0,0,1",
        propertyName: 'Camera.Rotation'
    },
    'possystem' : {
        get: (obj) => { return String(obj.gPosCoordSystem) },
        set: (obj, val) => { obj.gPosCoordSystem = Integer(val) ;},
        name: 'posSystem',
        default: "0",
        propertyName: 'Camera.PosCoordSystem'
    },
    'rotsystem' : {
        get: (obj) => { return String(obj.gRotCoordSystem) },
        set: (obj, val) => { obj.gRotCoordSystem = Integer(val) ;},
        name: 'rotSystem',
        default: "0",
        propertyName: 'Camera.RotCoordSystem'
    }
};