// Copyright 2018 Robert Adams
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

import GP from 'GP';
import Config from 'xConfig';

// Create a globally unique Id based on the service and type passed
export function CreateUniqueId(service, type) {
  if (GP.UniqueIdCount === undefined) {
    GP.UniqueIdCount = 1;
    GP.UniqueIdBasename = 'org.basil.b.';
    // Note that basename ends with a dot
    if (Config.predefinedInstances && Config.predefinedInstances.generatedInstanceBasename) {
      GP.UniqueIdBasename = Config.predefinedInstances.generatedInstanceBasename;
    }
  }
  return GP.UniqueIdBasename
                + service
                + '.'
                + (type ? type : 'default')
                + '.'
                + String(GP.UniqueIdCount++);
};

// Create a locally unique instance identifier.
export function CreateUniqueInstanceId() {
  return CreateUniqueId('instance');
};
