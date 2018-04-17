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

import { BItem } from 'xBItem';
import { CreateUniqueId, CreateUniqueInstanceId } from 'xUtilities';
import { Displayable, DisplayableInstance } from 'xDisplayable';

// A dummy Displayable used by the rest of these predefined instances
export class PredefinedDisplayable extends Displayable {
  constructor() {
    let id = 'org.basil.b.defaultPredefinedDisplayable';
    if (Config.predefinedInstances && Config.predefinedInstances.predefinedDisplayableName) {
      id = Config.predefinedInstances.predefinedDisplayableName;
    }
    let auth = undefined;
    let assetInfo = {
      // TODO: put the right stuff here
    };
    super(id, auth, assetInfo);
    this.itemType = 'PredefinedDisplayable';
    GP.predefinedDisplayable = this;
  }
}

// A special instance that displays it's 'Msg' property in the debug window
export class DebugInstance extends DisplayableInstance {
  constructor() {
    let id = 'org.basil.b.defaultDebugInstance';
    if (Config.predefinedInstances && Config.predefinedInstances.debugObjectId) {
      id = Config.predefinedInstances.debugObjectId;
    }
    let auth = undefined;
    super(id, auth, GP.predefinedDisplayable);
    this.itemType = 'DebugInstance';
    this.lastMessage = 'none';

    super.DefineProperties( {
      'Msg': {
        'get': () => { return this.lastMessage; },
        'set': (val) => {
          this.lastMessage = val;
          GP.DebugLog('WORKER: ' + val);
        }
      }
    } );
  }
}
