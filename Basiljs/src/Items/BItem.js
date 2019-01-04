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
import Config from '../config.js';

// The management of the itme collection is done with static functions
var IM = IM || {};
GP.IM = IM;

IM.Items = new Map();

export const BItemState = {
  UNINITIALIZED: 'UNINITIALIZED',
  LOADING: 'LOADING',
  FAILED: 'FAILED',
  READY: 'READY',
  SHUTDOWN: 'SHUTDOWN'
};

export const BItemType = {
  UNKNOWN: 'UNKNOWN',
  DISPLAYABLE: 'Displayable',
  INSTANCE: 'Instance',
  RENDERER: 'Renderer',
  CONTROLS: 'Controls',
  COMM: 'Comm',
  SERVICE: 'Service',
  TRANSPORT: 'Transport'
}

// All things referenced by the Basil interface are "items' and thus they
//   have these access methods.
// The main features of a BItem are:
//  An array of properties that are defined and can be get and set.
//      Used for remote access and control of this thing.
//  An 'id' which uniquely names this item.
//  An 'auth' which is auth info for access to and from this item.
//  An 'itemType' which identifies the type of the item.
export class BItem {
    constructor(pId, pAuth, pItemType) {
      this.props = new Map();
      this.id = pId;             // index this item is stored under
      this.auth = pAuth;         // authorization information
      this.ownerId = undefined; // this item is not yet associated with  some service/connection
      this.itemType = pItemType ? pItemType : BItemType.UNKNOWN;  // the type of the item
      this.state = BItemState.UNINITIALIZED;
      this.DefineProperties( {
          'Type': { 'get': () => { return this.itemType; } },
          'Id': { 'get': () => { return this.id; } },
          'OwnerId': { 'get': () => { return this.ownerId; } },
          'State': { 'get': () => { return this.state; } }
      });
      BItem.AddItem(this.id, this);
    }

    ReleaseItem() {
        BItem.ForgetItem(this.id);
    };

    // Returns the value of the property or 'undefined' if either
    //    no such property or there isn't a value for it.
    GetProperty(pProp) {
      let ret = undefined;
      let propDesc = this.props.get(pProp);
      if (propDesc && propDesc.get) {
        ret = propDesc.get();
        // GP.DebugLog('BItem.GetProperty: ' + prop + ' -> ' + ret);
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
      let propDesc = this.props.get(propertyName);
      if (propDesc && propDesc.set) {
        // GP.DebugLog('BItem.SetProperty: ' + propertyName + ' => ' + JSON.stringify(value));
        propDesc.set(value);
      }
      else {
        GP.DebugLog('BItem.SetProperty: could not set ' + propertyName + ' because no "set" function');
      }
    }

    // Set several properties. Values can be an object or a Map().
    SetProperties(propValues) {
      if (propValues instanceof Map) {
          propValues.forEach((val, prop) => {
              this.SetProperty(prop, val);
          }, this);
      }
      else {
          Object.keys(propValues).forEach(prop => {
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
            Had some problems with this so use GetProperty and SetProperty.
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

    // Set the state of this BItem.
    // Someday may need to add actions around state changes
    SetState(newState) {
      this.state = newState;
    }
    // Helper functions so caller doesn't need to have BItem imports.
    SetReady() { this.SetState(BItemState.READY); }
    SetFailed() { this.SetState(BItemState.FAILED); }
    SetLoading() { this.SetState(BItemState.LOADING); }
    SetShutdown() { this.SetState(BItemState.SHUTDOWN); }

    // Return a Promise that is resolved when item status is READY.
    // Promise will be rejected if timeout interval.
    // TODO: this is a kludge routine using polling. Use state change
    //    events when they existw
    // TODO: a debug option that keeps a list of what is being waited for.
    //    Would make a useful display when things are slow/hung.
    WhenReady(timeoutMS) {
      return new Promise( function(resolve, reject) {
        if (this.state == BItemState.READY) {
          resolve(this);
        }
        else {
          let checkInterval = 200;
          if (Config.assets && Config.assets.assetFetchCheckIntervalMS) {
            checkInterval = Number(Config.assets.assetFetchCheckIntervalMS);
          }
          let timeout = 5000;
          if (Config.assets && Config.assets.assetFetchTimeoutMS) {
            timeout = Number(Config.assets.assetFetchTimeoutMS);
          }
          if (timeoutMS) {  // use the passed timeout if specified
            timeout = timeoutMS;
          }
          // Wait for 'checkInterval' and test again for 'READY'.
          setTimeout( function(calledTimeout, checkInterval, resolver, rejecter) {
            let levelTimeout = calledTimeout - checkInterval;
            if (this.state == BItemState.READY) {
              resolver(this);
            }
            if (levelTimeout <= 0) {
              rejecter(this);
            }
            // If still not ready, tail recursion to more waiting
            this.WhenReady(levelTimeout)
              .then(xitem => {
                resolver(xitem);
              })
              .catch(xitem => {
                rejecter(xitem);
              });
          }.bind(this), checkInterval, timeout, checkInterval, resolve, reject);
        }
      }.bind(this));
    }

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
