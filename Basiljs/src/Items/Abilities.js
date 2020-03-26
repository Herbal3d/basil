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

import { GP, AbilityCreators } from 'GLOBALS';
import Config from '../config.js';

import { Eventing } from '../Eventing/Eventing.js'

import { BException } from '../BException.js';
import { BItemState } from './BItem.js';
import { JSONstringify } from '../Utilities.js';

// Classes to hold some of the logic for creating and serializeing Abilities.
// Rather than scatter the logic and format for Abilities, this tries to
//     capture things like required parameters, formatting, ...

// Parent class for an Ability defintion.
export class AnAbility {
    constructor(pAbilityCode, pPropMap) {
        this.Name = pAbilityCode;
        this.state = BItemState.UNINITIALIZED;
        this.eventing = Eventing.Instance();

        this.SetObjPropDefaults(this, pPropMap);
    };

    // Link this ability to the enclosing BItem. This is overloaded by actual Ability.
    Link(pParent) {
        GP.ErrorLog('AnAbility: call of undefined Link()');
        throw new BException('AnAbility: call of undefined Link()');
    };
    // Unlink this ability from the enclosing BItem. This is overloaded by actual Ability.
    Unlink(pParent) {
        GP.ErrorLog('AnAbility: call of undefined Unlink()');
        throw new BException('AnAbility: call of undefined Unlink()');
    };
    // Initialize this ability from passed values.
    // This is per ability type an has parameters for the specific things to initialize
    SetFromValues() {
        GP.ErrorLog('AnAbility: call of undefined SetFromValues()');
        throw new BException('AnAbility: call of undefined SetFromValues()');
    };
    // deserialized parameters from Map<string,string>()
    InitializeWithProperties(pParamBlock) {
        GP.ErrorLog('AnAbility: call of undefined InitializeWithProperties()');
        throw new BException('AnAbility: call of undefined InitializeWithProperties()');
    };
    // Return properties that define this ability instance as Map<string,string>()
    GetProperties() {
        GP.ErrorLog('AnAbility: call of undefined InitializeWithProperties()');
        throw new BException('AnAbility: call of undefined InitializeWithProperties()');
    }

    GetState() {
        return this.state;
    }
    // Set the state of this Ability.
    // Someday may need to add actions around state changes
    SetState(newState) {
        let oldState = this.state;
        this.state = newState;
        this.FireStateChangeEvent(newState, oldState);
    };
    // Helper functions so caller doesn't need to have BItem imports.
    SetReady() { this.SetState(BItemState.READY); };
    SetFailed() { this.SetState(BItemState.FAILED); };
    SetLoading() { this.SetState(BItemState.LOADING); };
    SetShutdown() { this.SetState(BItemState.SHUTDOWN); };

    // If state has changed and state change events are enabled, fire the event
    FireStateChangeEvent(pNewState, pOldState) {
        if (pOldState != pNewState && this.parent && this.parent.EventName_OnStateChange) {
            this.eventing.Fire(this.parent.EventName_OnStateChange, {
                'id': this.parent.id,
                'state': pNewState,
                'ability': this.Name,
                'oldState': pOldState,
            });
        };
    };
};

// Given a set of properties (pProps), set the values on pObj using pPropMap.
// This just sets the passed value. Type conversion happens in the PropMap.
export function InitializeProps(pObj, pProps, pPropMap) {
    // GP.DebugLog('Abilities.InitializeProps: pProps=' + JSONstringify(pProps));
    if (pProps) {
        if (pProps instanceof Map) {
            pProps.forEach( (prop, val) => {
                SetViaProps(pObj, prop, val, pPropMap);
            });
        }
        else {
            Object.keys(pProps).forEach( prop => {
                SetViaProps(pObj, prop, pProps[prop], pPropMap);
            });
        };
    };
};
// Set the default values for properties on this object
export function SetObjPropDefaults(pObj, pPropMap) {
    pPropMap.forEach( propInfo => {
        if (propInfo.set) {
            if (propInfo.default) {
                propInfo.set(pObj, propInfo.default);
            }
            else {
                propInfo.set(pObj, null);
            }
        }
    });
}
// Set the value. We undo the caseness of the property name.
// This just sets the passed value. Type conversion happens in the PropMap.
export function SetViaProps(pObj, pPropName, pVal, pPropMap) {
    // GP.DebugLog('Abilities.SetViaProps: setting ' + pPropName);
    if (typeof(pVal) !== 'undefined') {
        let propLower = pPropName.toLowerCase();
        if (pPropMap.hasOwnProperty(propLower)) {
            pPropMap[propLower].set(pObj, pVal);
            /* DEBUG DEBUG DEBUG */
            // let setVal = pPropMap[propLower].get(pObj);
            // GP.DebugLog('Abilities.SetViaProps: setting ' + propLower + ' to ' + setVal);
            /* DEBUG DEBUG DEBUG */
        }
        else {
            // Someone passed a property that doesn't have a get/set definition.
            // If that property is not already set on the object, just add it.
            if (typeof(pObj[pPropName]) === 'undefined') {
                pObj[pPropName] = pVal;
                // GP.DebugLog('Abilities.SetViaProps: setting random property ' + pPropName + ' to ' + pVal);
            }
            else {
                GP.ErrorLog('Abilities.SetViaProps: trying to reset value for ' + pPropName);
            };
        };
    };
};

// Return a JS Object with the ability properties set as KVPs string -> string.
// Note that, if value is undefined, that property is not set in the returned object.
export function GenerateProps(pObj, pPropMap) {
    let ret = {};
    if (pObj && pPropMap) {
        Object.keys(pPropMap).forEach( key => {
            let propInfo = pPropMap[key];
            if (propInfo.get) {
                let propName = propInfo.name ? propInfo.name : key;
                let val = propInfo.get(pObj);
                if (typeof(val) !== 'undefined') {
                    ret[propName] = val;
                };
            };
        });
    };
    // GP.DebugLog('Abilities.GenerateProps: props = ' + JSONstringify(ret));
    return ret;
};
