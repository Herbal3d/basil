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

import { BKeyedCollection } from '@Tools/bTypes';
import { BItem } from '@BItem/BItem';

// Global debugging parameters and variables. "GP.variable"
export const GP: {
    Ready: boolean;
    Config: BKeyedCollection;
} = {
    Ready: false,
    Config: {}
};

// Counters and names used uniquely by this session
export let UniqueIdCount: number = 1;
export function GetNextUniqueNum():number {
    return UniqueIdCount++;
}
export const UniqueIdBasename = '.b.basil.org';
// Note that basename begins with a dot

/*
// Ability names and creating functions are kept here.
export let AbilityCreatorsMap: Map = new Map();
// Returns the map since exporting functions works better than exporting properties
export function AbilityCreators(): Map {
    return AbilityCreatorsMap;
};
*/
