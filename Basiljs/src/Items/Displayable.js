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
import { BItem, BItemType, BItemState } from 'xBItem';
import { BasilType } from 'xBasilServerMessages';
import { ParseThreeTuple, ParseFourTuple } from 'xUtilities';
import { DisplayableCamera } from 'xDisplayableCamera';
import { DisplayableMeshSet } from 'xDisplayableMeshSet';

import * as Graphics from 'xGraphics';

export const DisplayableType = {
  UNKNOWN: 'UNKNOWN',
  CAMERA: 'Camera',
  MESHSET: 'MeshSet'
}

// Factory function to create Displayable since we may want
//    to use Proxy's someday.
export function DisplayableFactory(id, auth, assetInfo) {
  let ret = undefined;
  if (assetInfo && assetInfo.asset
            && assetInfo.asset.displayInfo
            && assetInfo.asset.displayInfo.displayableType) {
    let displayType = assetinfo.asset.displayInfo.displayType;
    switch (assetInfo,asset.displayInfo.displayType) {
      case DisplayableType.CAMERA:
          ret = new DisplayableCamera(id, auth, assetInfo);
        break;
      case DisplayableType.MESHSET:
          ret = new DisplayableMeshSet(id, auth, assetInfo);
        break;
      default:
          GP.DebugLog('DisplayableFactory: Unknown asset type: ' + displayType);
        break;
    }
  }
  else {
    ret = new Displayable(id, auth, assetInfo);
  }
  return ret;
}

export class Displayable extends BItem {
    constructor(id, auth, assetInfo) {
      super(id, auth, BItemType.DISPLAYABLE);
      if (assetInfo && assetInfo.asset) {
        this.state = BItemState.LOADING;
        GP.DebugLog('Displayable.constructor: begining load of asset.State to LOADING');
        Graphics.LoadSimpleAsset(auth, assetInfo.asset)
        .then(theAsset => {
          GP.DebugLog('Displayable.constructor: asset load successful. State to READY');
          GP.DebugLog('Displayable.constructor:' + ' numAsset=' + theAsset.length);
          this.representation = theAsset;
          this.state = BItemState.READY;
        })
        .catch(err => {
          this.state = BItemState.FAILED;
          GP.DebugLog('Displayable: unable to load asset' + JSON.stringify(assetInfo)
      }
      else {
        this.state = BItemState.READY;
      }
    }
}

// Factory function to create DisplayableInstances since we may want
//    to use Proxy's someday.
export function InstanceFactory(id, auth, baseDisplayable) {
  return new Instance(id, auth, baseDisplayable);
}

export class Instance extends BItem {
    constructor(id, auth, baseDisplayable) {
        super(id, auth, BItemType.INSTANCE);
        this.displayable = baseDisplayable;
        this.worldNode = undefined;

        this.gPos = [ 0, 0, 0 ];
        this.gRot = [ 0, 0, 0, 1];
        this.gPosCoordSystem = 0;
        this.gRotCoordSystem = 0;
        this.gRotgPosModified = false;  // flag saying gRot or gPos modified

        this.gRotPosModified = undefined;
        this.gRotPosModified = undefined;

        // Note: some of these are over-ridden by other modules.
        //    If these are changed, check PredefinedCameraInstance.j
        super.DefineProperties( {
            // over-write the 'State' property and return the underlying asset's state
            'State': {
                'get': () => { return this.displayable.state; }
            },
            'Position': {
                'get': () => {
                  if (typeof this.procgPosPreGet == 'function') {
                    procgPosPreGet(this);
                  }
                  return this.gPos; },
                'set': (val) => {
                  this.gPos = ParseThreeTuple(val);
                  this.gRotgPosModified = true;
                  if (typeof this.procgPosModified == 'function') {
                      procgPosModified(this);
                  }
                }
            },
            'Rotation': {
                'get': () => {
                  if (typeof this.procgRotPreGet == 'function') {
                    procgRotPreGet(this);
                  }
                  return this.gRot; },
                'set': (val) => {
                    this.gRot = ParseFourTuple(val);
                    this.gRotgPosModified = true;
                    if (typeof this.procgRotModified == 'function') {
                        procgRotModified(this);
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
}
