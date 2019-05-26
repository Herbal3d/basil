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
import { BItem, BItemType, BItemState } from '../Items/BItem.js';
import { ParseThreeTuple, ParseFourTuple } from '../Utilities.js';

import { Instance } from '../Items/Instance.js';

export class InstanceMeshSet extends Instance {
    constructor(id, auth, baseDisplayable) {
        super(id, auth, baseDisplayable);

        // Note: some of these are over-ridden by other modules.
        //    If these are changed, check PredefinedCameraInstance.j
        this.DefineProperties( {
            '_Position': {
                'get': () => {
                    if (typeof this.procgPosPreGet == 'function') {
                        procgPosPreGet(this);
                    }
                    if (typeof this.worldNode != 'undefined') {
                        this.gPos = this.worldNode.position.toArray();
                    }
                    return this.gPos; },
                'set': (val) => {
                    this.gPos = ParseThreeTuple(val);
                    if (typeof this.worldNode != 'undefined') {
                        this.worldNode.position.fromArray(this.gPos);
                    }
                    this.gRotgPosModified = true;
                    if (typeof this.procgPosModified == 'function') {
                        procgPosModified(this);
                    }
                }
            },
            '_Rotation': {
                'get': () => {
                    if (typeof this.procgRotPreGet == 'function') {
                        procgRotPreGet(this);
                    }
                    if (typeof this.worldNode != 'undefined') {
                        this.gRot = this.worldNode.quaternion.toArray();
                    }
                    return this.gRot; },
                'set': (val) => {
                    this.gRot = ParseFourTuple(val);
                    if (typeof this.worldNode != 'undefined') {
                        this.worldNode.quaternion.fromArray( this.gRot );
                    }
                    this.gRotgPosModified = true;
                    if (typeof this.procgRotModified == 'function') {
                          procgRotModified(this);
                    }
                }
            },
            '_PosCoordSystem': {
                'get': () => { return this.gPosCoordSystem; },
                'set': (val) => {
                    this.gPosCoordSystem = Integer(val);
                }
            },
            '_RotCoordSystem': {
                'get': () => { return this.gRotCoordSystem; },
                'set': (val) => {
                    this.gRotCoordSystem = Integer(val);
                }
            }
        });
        // Instance is ready even if the underlying displayable is not there yet.
        this.SetReady();
    }

    // Release any resources I might be holding.
    ReleaseResources() {
        this.RemoveFromWorld();
        super.ReleaseResources();
    }
}
InstanceMeshSet.InstanceType = "meshset";
