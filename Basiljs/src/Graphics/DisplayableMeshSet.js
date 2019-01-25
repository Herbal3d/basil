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

import GP from 'GP';
import Config from '../config.js';

import { Displayable } from '../Items/Displayable.js';

export class DisplayableMeshSet extends Displayable {
    constructor(id, auth, displayInfo) {
        GP.DebugLog('DisplayableCamers: constructor');
        super(id, auth, displayInfo);
        if (displayInfo && displayInfo.asset) {
            this.SetLoading();
            GP.DebugLog('DisplayableMeshSet.constructor: begining load of asset.State to LOADING');
            this.graphics.LoadSimpleAsset(auth, displayInfo.asset)
            .then(theAsset => {
                GP.DebugLog('DisplayableMeshSet.constructor: asset load successful. State to READY');
                GP.DebugLog('DisplayableMeshSet.constructor:' + ' numAsset=' + theAsset.length);
                // 'theAsset' is a list of ThreeJS nodes
                this.representation = theAsset;
                this.SetReady();
            })
            .catch(err => {
                this.SetFailed();
                GP.DebugLog('DisplayableMeshSet: unable to load asset' + JSON.stringify(displayInfo));
            })
        }
        else {
            this.SetReady();
        }
    }

    ReleaseResources() {
        super.ReleaseResources();
    }
}
DisplayableMeshSet.DisplayableType = "meshset";
