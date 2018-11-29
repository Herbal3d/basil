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
import { ParseThreeTuple, ParseFourTuple } from 'xUtilities';

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

        this.gRotPosPreGet = undefined;
        this.gRotPosModified = undefined;
        this.gRotRotPreGet = undefined;
        this.gRotRotModified = undefined;

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
                  GP.DebugLog('Instance.setPosition: id=' + this.id + ', pos=' + JSON.stringify(this.gPos));
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
        this.displayable.WhenReady()
        .then(function(disp) {
          this.SetReady();
        }.bind(this));
    }
}
