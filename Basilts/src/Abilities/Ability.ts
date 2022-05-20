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

import { BItem, PropValue } from "@BItem/BItem";
import { Logger } from '@Base/Tools/Logging';

export interface AbilityPropertyValues {
  [ key: string]: PropValue
};

// export abstract class Ability implements AbilityPropertyValues {
export abstract class Ability  {

    abilityName: string;
    containingBItem: BItem;

    // Creating an ability automatically adds it to it's BItem
    constructor(pName: string) {
        this.abilityName = pName;
        // Logger.debug(`Ability: ${this.name} created`);
    }

    // Add this ability's properties to the BItem
    // This happens when the ability is added to the BItem
    addProperties(pBItem: BItem): void {
        this.containingBItem = pBItem;
    }

    // called when a property is about to be removed from its containing BItem
    abstract propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void;

    // UTILITY FUNCTIONS
    propValueToFloat(pVal: PropValue): number {
        let ret = 0;
        if (pVal instanceof Number) {
            ret = pVal as number;
        }
        else {
            try {
                ret = parseFloat(pVal as string);
            }
            catch (e) {
                Logger.error(`AbEnviron.solarAzimuth: Error parsing ${pVal} as a number`);
            }
        }
        return ret;
    }
}
