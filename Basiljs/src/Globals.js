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

// Global debugging parameters and variables. "GP.variable"
let GP = {};

// Counters and names used uniquely by this session
let UniqueIdCount = 1;
function GetNextUniqueNum() {
    return UniqueIdCount++;
}
let UniqueIdBasename = '.b.basil.org';
// Note that basename begins with a dot

// Ability names and creating functions are kept here.
let AbilityCreatorsMap = new Map();
// Returns the map since exporting functions works better than exporting properties
let AbilityCreators = function() {
    return AbilityCreatorsMap;
};

export { GP };
export { GetNextUniqueNum, UniqueIdBasename };
export { AbilityCreators };
