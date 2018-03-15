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

// All things referenced by the Basil interface are "items' and thus they
//   have these access methods
export class BItem {
    constructor() {
        this.props = new Map();
        this.key = undefined;   // index this item is stored under
        this.itemType = undefined;  // the type of the item
        // If defined, provides a map of property names to get and set functions
        // The propertyMap is indexed by the property name which gives an array
        //     which the first value is a getter function and the second is a setter.
        this.propertyMap = undefined;
    }
    GetProperties(filter) {
        let ret = undefined;
        if (this.propertyMap) {
            ret = {};
            this.propertyMap.GetOwnPropertyNames().forEach(prop => {
                ret[prop] = this.propertyMap[prop][0]();
            })
        }
        else {
            ret = this.props;
        }
        return ret;
    }
    SetProperty(prop, value) {
        if (this.propertyMap) {
            if (this.propertyMap[prop]) {
                if (this.propertyMap[prop][1]) {
                    this.propertyMap[prop][1](value);
                }
            }
        }
        else {
            this.props.set(prop, value);
        }
    }
    SetProperties(propValues) {
        Object.GetOwnPropertyNames.forEach(prop => {
            this.SetProperty(prop, propValues[prop]);
        });
    }
}
