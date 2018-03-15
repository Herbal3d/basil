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

import { BItem } from 'xBItem.js';

export class DisplayableInstance extends BItem {
    constructor() {
        super();
        this.displayable = undefined;

        this.globalPos = [ 0, 0, 0 ];
        this.globalRot = [ 0, 0, 0, 1];
        this.globalPosCoordSystem = 0;
        this.globalRotCoordSystem = 0;

        this.referenceFrame = 0;
        this.localPos = [ 0,0,0 ];
        this.localRot = [ 0, 0, 0, 1];

        this.propertyMap = {
            'Position': [ () => { return this.gPos; }, (val) => { this.gPos = val; } ]
            'Rotation': [ () => { return this.gRot; }, (val) => { this.gRot = val; } ]
            'PosCoordSystem': [ () => { return this.gPosCoordSystem; }, (val) => { this.gPosCoordSystem = val; } ]
            'RotCoordSystem': [ () => { return this.gRotCoordSystem; }, (val) => { this.gRotCoordSystem = val; } ]
        };
    }
    get gPos() {
        return this.globalPos;
    }
    set gPos(val) {
    }
    get gRot() {
        return this.globalRot;
    }
    set gRot(val) {
    }
    get gPosCoordSystem() {
        return this.globalPosCoordSystem;
    }
    set gPosCoordSystem(val) {
    }
    get gRotCoordSystem() {
        return this.globalRotCoordSystem;
    }
    set gRotCoordSystem(val) {
    }
    get lPos() {
        return this.localPos;
    }
    set lPos(val) {
    }
    get lRot() {
        return this.localRot;
    }
    set lRot(val) {
    }
}
