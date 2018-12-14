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

import { DisplayableCamera } from '../Graphics/DisplayableCamera.js';
import { DisplayableMeshSet } from '../Graphics/DisplayableMeshSet.js';
import { InstanceMeshSet } from '../Graphics/InstanceMeshSet.js'

// Factory function to create Displayable since we may want
//    to use Proxy's someday.
export function DisplayableFactory(id, auth, displayInfo) {
  let ret = undefined;
  if (displayInfo.displayableType) {
    let displayType = displayInfo.displayableType;
    switch (displayType) {
      case DisplayableCamera.DisplayableType:
          ret = new DisplayableCamera(id, auth, displayInfo);
        break;
      case DisplayableMeshSet.DisplayableType:
          ret = new DisplayableMeshSet(id, auth, displayInfo);
        break;
      default:
          GP.ReportError('DisplayableFactory: Unknown asset type: ' + displayType);
        break;
    }
  }
  else {
    GP.ReportError('DisplayableFactory: displayableType not specified: '
                + JSON.stringify(displayInfo));
    ret = undefined;
  }
  return ret;
}

// Factory function to create DisplayableInstances since we may want
//    to use Proxy's someday.
export function InstanceFactory(id, auth, baseDisplayable) {
  return new InstanceMeshSet(id, auth, baseDisplayable);
}
