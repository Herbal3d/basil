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

import { Logger } from "@Base/Tools/Logging";
import { BItem } from "@BItem/BItem";

export abstract class Ability {

    name: string;

    // Creating an ability automatically adds it to it's BItem
    constructor(pName: string) {
        this.name = pName;
        // Logger.debug(`Ability: ${this.name} created`);
    }
    // Add this ability's properties to the BItem
    // This happens when the ability is added to the BItem
    abstract addProperties(pBItem: BItem): void;
}
