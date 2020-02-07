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

// holds the controls context for this threejs instance

import { GP } from 'GLOBALS';
import Config from '../config.js';

import { Displayable } from '../Items/Displayable.js';
import { BItemState } from '../Items/BItem.js';
import { JSONstringify } from '../Utilities.js';

export class DisplayableMeshSet extends Displayable {
    constructor(id, auth, displayInfo) {
        // GP.DebugLog('DisplayableMeshSet: constructor');
        super(id, auth, displayInfo);
        if (displayInfo && displayInfo.asset) {
            this.SetLoading();
            // GP.DebugLog('DisplayableMeshSet.constructor: begining load of asset.State to LOADING');
            this.graphics.LoadSimpleAsset(displayInfo.asset)
            .then(theAsset => {
                if (this.state == BItemState.LOADING) {
                    // GP.DebugLog('DisplayableMeshSet.constructor: asset load successful. State to READY');
                    // GP.DebugLog('DisplayableMeshSet.constructor:' + ' numAsset=' + theAsset.length);
                    // 'theAsset' is a list of ThreeJS nodes
                    this.representation = theAsset;
                    this.SetReady();
                }
                else {
                    // The object went out of 'LOADING' while off in graphics.
                    // Leave the new state.
                    this.representation = theAsset; // so it can be freed.
                }
            })
            .catch(err => {
                this.SetFailed();
                GP.ErrorLog('DisplayableMeshSet: unable to load asset ' + JSONstringify(displayInfo)
                    + ', ERROR=' + JSONstringify(err));
            })
        }
        else {
            this.SetReady();
        }
    }

    ReleaseResources() {
        if (this.representation) {
            // release the resources from the graphics engine
            if (this.graphics) {
                this.graphics.ReleaseSimpleAsset(this.representation);
            }
            this.representation = undefined;
        }
        super.ReleaseResources();
    }
}
DisplayableMeshSet.DisplayableType = "meshset";
