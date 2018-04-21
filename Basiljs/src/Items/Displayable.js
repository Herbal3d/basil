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

import { BItem } from 'xBItem';

export class Displayable extends BItem {
    constructor(id, auth, assetInfo) {
      super(id, auth, 'Displayable');
    }
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
            'Position': {
                'get': () => { return this.gPos; },
                'set': (val) => {
                    if (typeof val == 'String') {
                      val = JSON.Parse(val);
                    }
                    if (typeof val == 'Array' && val.length == 3) {
                        this.gPos[0] = Float(val[0]);
                        this.gPos[1] = Float(val[1]);
                        this.gPos[2] = Float(val[2]);
                    }
                    this.gRotgPosModified = true;
                    if (this.procgPositionSet !== undefined) {
                        procgPositionSet(this);
                    }
                }
            },
            'Rotation': {
                'get': () => { return this.gRot; },
                'set': (val) => {
                    if (typeof val == 'Array' && val.length == 4) {
                        this.gRot[0] = Float(val[0]);
                        this.gRot[1] = Float(val[1]);
                        this.gRot[2] = Float(val[2]);
                        this.gRot[4] = Float(val[4]);
                    }
                    this.gRotgPosModified = true;
                    if (this.procgRotationSet !== undefined) {
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
}
