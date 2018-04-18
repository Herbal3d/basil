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

import * as Graphics from 'xGraphics';

// Create the instances that exist for debugging and environment
export function PredefinedBItemInit() {
  let parms = {};
  if (Config.predefinedInstances) {
    parms = Config.predefinedInstances;
  }
  let predefinedDisplayable = new PredefinedDisplayable();
  if (parms.debugObjectId) {
    GP.debugInstance = new PredefinedDebugInstance();
  }
  GP.rendererInstance = new PredefinedRendererInstance();
  GP.cameraInstance = new PredefinedCameraInstance();
};

// A dummy Displayable used by the rest of these predefined instances
export class PredefinedDisplayable extends Displayable {
  constructor() {
    let parms = {};
    if (Config.predefinedInstances) {
      parms = Config.predefinedInstances;
    }
    let id = 'org.basil.b.defaultPredefinedDisplayable';
    if (parms.predefinedDisplayableName) {
      id = parms.predefinedDisplayableName;
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
export class PredefinedDebugInstance extends DisplayableInstance {
  constructor() {
    let parms = {};
    if (Config.predefinedInstances) {
      parms = Config.predefinedInstances;
    }
    let id = 'org.basil.b.defaultDebugInstance';
    if (parms.debugObjectId) {
      id = parms.debugObjectId;
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

// A special instance that displays it's 'Msg' property in the debug window
export class PredefinedRendererInstance extends DisplayableInstance {
  constructor() {
    let parms = {};
    if (Config.predefinedInstances) {
      parms = Config.predefinedInstances;
    }
    let id = 'org.basil.b.renderer';
    if (parms.rendererInstanceId) {
      id = parms.rendererInstanceId;
    }
    let auth = undefined;
    super(id, auth, GP.predefinedDisplayable);
    this.itemType = 'RendererInstance';

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

// A special instance that displays it's 'Msg' property in the debug window
export class PredefinedCameraInstance extends DisplayableInstance {
  constructor() {
    let parms = {};
    if (Config.predefinedInstances) {
      parms = Config.predefinedInstances;
    }
    let id = 'org.basil.b.camera';
    if (parms.cameraInstanceId) {
      id = parms.cameraInstanceId;
    }
    let auth = undefined;
    super(id, auth, GP.predefinedDisplayable);
    this.itemType = 'CameraInstance';

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
