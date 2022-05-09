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


import { BItem } from '@BItem/BItem';
import { AbCamera } from '@Abilities/AbilityCamera';
import { AbMouse } from '@Abilities/AbilityMouse';
import { AbKeyboard } from '@Abilities/AbilityKeyboard';
import { AbPlacement } from '@Abilities/AbilityPlacement';

import { Config } from '@Base/Config';
import { AbRegistration } from '@Abilities/AbilityReg';
import { BItems } from './BItems';

export function CreateInfrastructureBItems(): void {
    const baseBItem = new BItem(Config.infrastructureBItemNames.registration, null);
    baseBItem.addAbility(new AbRegistration());

    // Primary camera has an instance so it has pos and rot
    const cam = new BItem(Config.infrastructureBItemNames.camera, null);
    cam.addAbility(new AbCamera(0));
    cam.addAbility(new AbPlacement([1,2,3], [0,0,0,1]));
    BItems.registerWellKnownBItem('Camera', cam, baseBItem);

    const mouse = new BItem(Config.infrastructureBItemNames.mouse, null);
    mouse.addAbility(new AbMouse());
    BItems.registerWellKnownBItem('Mouse', mouse, baseBItem);

    const keyboard = new BItem(Config.infrastructureBItemNames.keyboard, null);
    keyboard.addAbility(new AbKeyboard());
    BItems.registerWellKnownBItem('Keyboard', keyboard, baseBItem);
};

