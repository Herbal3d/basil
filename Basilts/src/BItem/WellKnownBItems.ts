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


import { Config } from '@Base/Config';

import { BItem } from '@BItem/BItem';
import { BItems } from './BItems';

import { AbCamera } from '@Abilities/AbilityCamera';
import { AbMouse } from '@Abilities/AbilityMouse';
import { AbKeyboard } from '@Abilities/AbilityKeyboard';
import { AbPlacement } from '@Abilities/AbilityPlacement';
import { AbRegistration } from '@Abilities/AbilityReg';
import { AbEnviron } from '@Abilities/AbilityEnvironment';

export const WellKnownCameraName = 'Camera';
export const WellKnownMouseName = 'Mouse';
export const WellKnownKeyboardName = 'Keyboard';
export const WellKnownEnvironName = 'Environment';

export function CreateInfrastructureBItems(): void {
    const regBItem = new BItem(Config.infrastructureBItemNames.registration, null);
    regBItem.addAbility(new AbRegistration());

    // Primary camera has an instance so it has pos and rot
    const cam = new BItem(Config.infrastructureBItemNames.camera, null);
    cam.addAbility(new AbCamera(0));
    cam.addAbility(new AbPlacement([1,2,3], [0,0,0,1]));
    BItems.registerWellKnownBItem(WellKnownCameraName, cam, regBItem);

    const mouse = new BItem(Config.infrastructureBItemNames.mouse, null);
    mouse.addAbility(new AbMouse());
    BItems.registerWellKnownBItem(WellKnownMouseName, mouse, regBItem);

    const keyboard = new BItem(Config.infrastructureBItemNames.keyboard, null);
    keyboard.addAbility(new AbKeyboard());
    BItems.registerWellKnownBItem(WellKnownKeyboardName, keyboard, regBItem);

    const environ = new BItem(Config.infrastructureBItemNames.environment, null);
    environ.addAbility(new AbEnviron());
    BItems.registerWellKnownBItem(WellKnownEnvironName, environ, regBItem);

};

