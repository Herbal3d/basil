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
import { AbilityCamera } from '@Abilities/AbilityCamera';
import { AbilityMouse } from '@Abilities/AbilityMouse';
import { AbilityKeyboard } from '@Abilities/AbilityKeyboard';

import { Config } from '@Base/Config';

import { IsNullOrEmpty, IsNotNullOrEmpty, ConfigGetQueryVariable } from '@Tools/Misc';
import { ExtractStringError, JSONstringify } from '@Tools/Utilities';
import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Tools/Logging';

export function CreateInfrastructureBItems(): void {
    const cam = new BItem(Config.infrastructureBItemNames.camera, null);
    cam.addAbility(new AbilityCamera(0));

    const mouse = new BItem(Config.infrastructureBItemNames.mouse, null);
    mouse.addAbility(new AbilityMouse());

    const keyboard = new BItem(Config.infrastructureBItemNames.keyboard, null);
    keyboard.addAbility(new AbilityKeyboard());
};

