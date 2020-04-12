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

import { AbilityInstance } from './AbilityInstance.js';
import { AbilityDisplayable } from './AbilityDisplayable.js';
import { AbilityCamera } from './AbilityCamera.js';

import { JSONstringify } from '../Utilities.js';

export function RegisterAbilities() {
    RegisterAbility(AbilityInstance.NAME, () => { return new AbilityInstance(); });
    RegisterAbility(AbilityDisplayable.NAME, () => { return new AbilityDisplayable(); });
    RegisterAbility(AbilityCamera.NAME, () => { return new AbilityCamera(); });
};

// As the Ability classes are loaded, they register themselves in this array.
// The constructors can then be found based on the AbilityCode.
export function RegisterAbility(pAbilityCode, pAbilityConstructor) {
    // console.log('AbilityRegistration.RegisterAbility: registering ability ' + pAbilityCode);
    // console.log('AbilityRegistration.RegisterAbility: setting = ' + pAbilityCode + ': ' + pAbilityConstructor);
    AbilityCreators().set(pAbilityCode, pAbilityConstructor);
    // AbilityCreators().forEach( (val, key) => {
    //     console.log('AbilityRegistration.RegisterAbility: Entry = ' + key + ': ' + val);
    // });
};

// Given a ParamBlock, return an instance of that Ability class initialized
//    from that ParamBlock.
// THis is used as messages are received to create instances of the Ability's
//    referenced in the protocol.
// The Abilities register themselves (RegisterAbility()) so this function
//    can create find and create an instance.
export function AbilityFactory(pParamBlock) {
    let ret = undefined;
    if (pParamBlock) {
        // GP.DebugLog('AbilityFactory: pParamBlock = ' + JSONstringify(pParamBlock));
        // AbilityCreators().forEach( (val, key) => {
        //     console.log('Abilities.AbilityFactory: Entry = ' + key + ': ' + val);
        // });
        if (AbilityCreators().has(pParamBlock.Ability)) {
            try {
                let newAbilityCreator = AbilityCreators().get(pParamBlock.Ability);
                let newAbility = newAbilityCreator();
                newAbility.InitializeWithProperties(pParamBlock.Props);
                ret = newAbility;
            }
            catch (e) {
                let errmsg = 'AnAbility.AbilityFactory: exception creating ability '
                            + pParamBlock.Ability
                            + ', e=' + e;
                GP.ErrorLog(errmsg);
                // throw new BException(errmsg);
            };
        }
        else {
            let errmsg = 'AnAbility.AbilityFactory: attempting to create unknown ability '
                        + pParamBlock.Ability;
            GP.ErrorLog(errmsg);
            // throw new BException(errmsg);
        };
    };
    return ret
};

