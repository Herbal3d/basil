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

// The management of the itme collection is done with static functions
var IM = IM || {};
GP.IM = IM;

IM.Items = new Map();

// All things referenced by the Basil interface are "items' and thus they
//   have these access methods
export class BItem {
    constructor(id, auth, itemType) {
        this.props = new Map();
        this.id = id;             // index this item is stored under
        this.ownerId = undefined; // this item is not yet associated with  some service/connection
        this.itemType = itemType ? itemType : undefined;  // the type of the item
        this.DefineProperties( {
            'Type': { 'get': () => { return this.itemType; } },
            'Id': { 'get': () => { return this.id; } },
            'OwnerId': { 'get': () => { return this.ownerId; } }
        });
        BItem.AddItem(id, this);
    }

    ReleaseItem() {
        BItem.ForgetItem(this.id);
    };

    // Returns the value of the property or 'undefined' if either
    //    no such property or there isn't a value for it.
    GetProperty(prop) {
      let ret = undefined;
      let propDesc = this.props.get(prop);
      if (propDesc) {
        if (propDesc.get) {
          ret = propDesc.get();
          // GP.DebugLog('BItem.GetProperty: ' + prop + ' -> ' + ret);
        }
      }
      return ret;
    }

    // Returns an Object of properties and values
    // The optional second parameter is a function to operation on the value
    //     before putting it in the returned structure. Usually used to stringify.
    FetchProperties(filter) {
      let ret = {};
      if (filter) {
          this.props.forEach((propDesc, prop) => {
              // Some wildcard testing
              let propVal = propDesc.get ? propDesc.get() : undefined;
              ret[prop] = value;
          });
      }
      else {
          this.props.forEach((propDesc, prop) => {
              let propVal = propDesc.get ? propDesc.get() : undefined;
              ret[prop] = propVal;
          });
      }
      return ret;
    };
    SetProperty(propertyName, value) {
      if (this.props.has(propertyName)) {
        if (this.props.get(propertyName).set) {
          this.props.get(propertyName).set(value);
        }
      }
    }
    SetProperties(propValues) {
      if (propValues instanceof Map) {
          propValues.forEach((val, prop) => {
              this.SetProperty(prop, val);
          }, this);
      }
      else {
          Object.getOwnPropertyNames(propValues).forEach(prop => {
              this.SetProperty(prop, propValues[prop]);
          }, this);
      }
    }

    // Define a property that can be accessed locally and remotely.
    // Remote access is alwas thrugh the MAp so remote people don't get access to local variables
    // The value for a property is an object with some functions defined:
    // val = {
    //     'set': setFunction,
    //     'get': getFunction,
    //     'local': if defined and 'true', only local access is allowed
    // }
    DefineProperty(propertyName, propertyDefinition) {
      if (propertyName && propertyDefinition) {
        this.props.set(propertyName, propertyDefinition);

        /*  This adds the property to this Object as a property.
        // Add this property definition to this instance for easy access
        // Need to remove old property as this might be a re-definition
        let defn = {};
        if (propertyDefinition && propertyDefinition['set']) {
          defn.set = propertyDefinition['set'];
        }
        if (propertyDefinition && propertyDefinition['get']) {
          defn.get = propertyDefinition['get'];
        }
        defn.enumerable = true;
        Object.defineProperty(this, propertyName, defn);
        */
      }
    }

    // Pass a Map or Objectof propertyNames with definitions
    DefineProperties(propValues) {
      if (propValues instanceof Map) {
          propValues.forEach((val, prop) => {
              this.DefineProperty(prop, val);
          }, this);
      }
      else {
          Object.keys(propValues).forEach( prop => {
              this.DefineProperty(prop, propValues[prop]);
          }, this);
      }
    };

    // Add an item to the database of items.
    // One caller should not be able to see other caller's items so, someday,
    //     add some security based on the creator of the BItem
    static AddItem(id, item, auth) {
        return IM.Items.set(id, item);
    };

    // Look up an item baed on it's Id
    static GetItem(id) {
        return IM.Items.get(id);
    };

    // Remove an BItem from the database of BItems
    static ForgetItem(id) {
        IM.Items.delete(id);
    };
}
