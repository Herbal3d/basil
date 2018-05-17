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
import { BItem, BItemState } from 'xBItem';
import { LoadSimpleAsset } from 'xGraphics';

// Factory function to create Displayable since we may want
//    to use Proxy's someday.
export function DisplayableFactory(id, auth, assetInfo) {
  return new Displayable(id, auth, assetInfo);
}

export class Displayable extends BItem {
    constructor(id, auth, assetInfo) {
      super(id, auth, 'Displayable');
      if (assetInfo && assetInfo.asset) {
        this.state = BItemState.LOADING;
        GP.DebugLog('Displayable.constructor: begining load of asset.State to LOADING');
        LoadSimpleAsset(auth, assetInfo.asset)
        .then(theAsset => {
          GP.DebugLog('Displayable.constructor: asset load successful. State to READY');
          this.representation = theAsset;
          this.state = BItemState.READY;
        })
        .catch(err => {
          this.state = BItemState.FAILED;
          GP.DebugLog('Displayable: unable to load asset' + JSON.stringify(assetInfo)
                      + ': ' + err);
        });
      }
      else {
        this.state = BItemState.READY;
      }
    }
}

// Factory function to create DisplayableInstances since we may want
//    to use Proxy's someday.
export function DisplayableInstanceFactory(id, auth, baseDisplayable) {
  return new DisplayableInstance(id, auth, baseDisplayable);
}

export class DisplayableInstance extends BItem {
    constructor(id, auth, baseDisplayable) {
        super(id, auth, 'DisplayableInstance');
        this.displayable = baseDisplayable;

        this.gPos = [ 0, 0, 0 ];
        this.gRot = [ 0, 0, 0, 1];
        this.gPosCoordSystem = 0;
        this.gRotCoordSystem = 0;
        this.gRotgPosModified = false;  // flag saying gRot or gPos modified

        // Note: some of these are over-ridden by other modules.
        //    If these are changed, check PredefinedCameraInstance.j
        super.DefineProperties( {
            // over-write the 'State' property and return the underlying asset's state
            'State': {
                'get': () => { return this.displayable.state; }
            },
            'Position': {
                'get': () => { return this.gPos; },
                'set': (val) => {
                    if (typeof(val) == 'string') {
                      val = JSON.Parse(val);
                    }
                    if (Array.isArray(val) && val.length >= 3) {
                      this.gPos[0] = Float(val[0]);
                      this.gPos[1] = Float(val[1]);
                      this.gPos[2] = Float(val[2]);
                    }
                    else if (val.x && val.y && val.z) {
                      this.gPos[0] = val.x;
                      this.gPos[1] = val.y;
                      this.gPos[2] = val.z;
                    }
                    this.gRotgPosModified = true;
                    if (typeof(this.procgPositionSet) !== 'undefined') {
                        procgPositionSet(this);
                    }
                }
            },
            'Rotation': {
                'get': () => { return this.gRot; },
                'set': (val) => {
                    if (typeof(val) == 'string') {
                      val = JSON.Parse(val);
                    }
                    if (Array.isArray(val) && val.length >= 4) {
                        this.gRot[0] = Float(val[0]);
                        this.gRot[1] = Float(val[1]);
                        this.gRot[2] = Float(val[2]);
                        this.gRot[4] = Float(val[4]);
                    }
                    else if (val.x && val.y && val.z && val.w) {
                      this.gPos[0] = val.x;
                      this.gPos[1] = val.y;
                      this.gPos[2] = val.z;
                      this.gPos[4] = val.w;
                    }
                    this.gRotgPosModified = true;
                    if (typeof(this.procgRotationSet) !== 'undefined') {
                        procgRotationSet(this);
                    }
                }
            },
            'PosCoordSystem': {
                'get': () => { return this.gPosCoordSystem; },
                'set': (val) => {
                    this.gPosCoordSystem = Integer(val);
                }
            },
            'RotCoordSystem': {
                'get': () => { return this.gRotCoordSystem; },
                'set': (val) => {
                    this.gRotCoordSystem = Integer(val);
                }
            }
        } );
    }

    // Place this instance in the displayed world data structure
    PlaceInWorld() {
    }
    // Remove this instance from the displayed world data structure
    RemoveFromWorld() {
    }
}
