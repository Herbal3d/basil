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
import { CreateUniqueId, CreateUniqueInstanceId,
      parseThreeTuble, parseFourTuble} from 'xUtilities';
import { Displayable, DisplayableInstance } from 'xDisplayable';

import * as Graphics from 'xGraphics';

// Everything about the viewer is visible to the outside connections through
//    the properties of BItems. This defines several environmental
//    BItems that can be seen and controlled externally. This includes things from
//    renderer performance information (PredefinedRendererInstance) to the
//    scene camera (PredefinedCameraInstance).

// Create the instances that exist for debugging and environment
export function PredefinedBItemInit() {
  let parms = Config.predefinedInstances ? Config.predefinedInstances : {};
  let predefinedDisplayable = new PredefinedDisplayable();
  if (parms.debugObjectId) {
    GP.debugInstance = new PredefinedDebugInstance(predefinedDisplayable);
  }
  GP.rendererInstance = new PredefinedRendererInstance(predefinedDisplayable);
  GP.cameraInstance = new PredefinedCameraInstance(predefinedDisplayable);
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
  constructor(useDisplayable) {
    let parms = Config.predefinedInstances ? Config.predefinedInstances : {};
    let id = parms.debugObjectId ? parms.debugObjectId : 'org.basil.b.defaultDebugInstance';
    let auth = undefined;
    super(id, auth, useDisplayable);
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

// A special instance that returns parameters about the renderer
export class PredefinedRendererInstance extends DisplayableInstance {
  constructor(useDisplayable) {
    let parms = Config.predefinedInstances ? Config.predefinedInstances : {};
    let id = parms.rendererInstanceId ? parms.rendererInstanceId : 'org.basil.b.renderer';
    let auth = undefined;
    super(id, auth, useDisplayable);
    this.itemType = 'RendererInstance';

    super.DefineProperties( {
      'Capabilities': {
        'get': () => { return JSON.stringify(Graphics.THREErenderer().capabilities); },
      },
      'Extensions': {
        'get': () => { return JSON.stringify(Graphics.THREErenderer().extensions); },
      },
      'Info': {
        'get': () => { return JSON.stringify(Graphics.THREErenderer().info); },
      }
    } );
  }
}

// A special instance that displays it's 'Msg' property in the debug window
export class PredefinedCameraInstance extends DisplayableInstance {
  constructor(useDisplayable) {
    let parms = {};
    if (Config.predefinedInstances) {
      parms = Config.predefinedInstances;
    }
    let id = 'org.basil.b.camera';
    if (parms.cameraInstanceId) {
      id = parms.cameraInstanceId;
    }
    let auth = undefined;
    super(id, auth, useDisplayable);
    this.itemType = 'CameraInstance';

    super.DefineProperties( {
        'Position': {
            'get': () => { return this.gPos; },
            'set': (val) => {
                parseThreeTuple(val, this.gPos);
                this.gRotgPosModified = true;
                if (typeof(this.procgPositionSet) !== 'undefined') {
                    this.procgPositionSet(this);
                }
            }
        },
        'Rotation': {
            'get': () => { return this.gRot; },
            'set': (val) => {
                parseFourTuple(val, this.gRot);
                this.gRotgPosModified = true;
                if (typeof(this.procgRotationSet) !== 'undefined') {
                    this.procgRotationSet(this);
                }
            }
        }
    } );
  }
}
