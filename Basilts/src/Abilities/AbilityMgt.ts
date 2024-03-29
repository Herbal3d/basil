// Copyright 2022 Robert Adams
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

import { DialogMgt } from "@Base/DialogMgt/DialogMgt";

import { AbAssembly } from "@Abilities/AbilityAssembly";
import { AbDialog } from "@Abilities/AbilityDialog";
import { AbOSAvaUpdate } from "@Abilities/AbilityOSAvaUpdate";
import { AbOSCamera } from "@Abilities/AbilityOSCamera";

// This function exists to reference Ability classes so they will
//     not get tree shaken and not included in the binaries.
// Since Abilities are built by calling a factory function, they are
//     not explicitly called by any of the Basil code.
// This is referenced and called by the main Basil.ts file.
export const initAbilities = (pShouldInit: boolean): void => {
    if (pShouldInit) {
        // NOTE: the parameter is only 'false' so this code is never executed
        const abilityAssembly = new AbAssembly(undefined, undefined);
        const abilityDialog = new AbDialog(undefined);
        const abilityOSAvaMove = new AbOSAvaUpdate();
        const abilityOSCamera = new AbOSCamera(undefined, undefined);

        const knownDialogs = DialogMgt.dialogs.keys();
    };
};
