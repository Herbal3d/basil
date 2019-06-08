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

IM.Items = IM.Items || new Map();
// BItems are deleted by moving into this list which is
//    scanned periodically and cleared out.
IM.ItemsDeleted = IM.ItemsDeleted || new Map();

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
        this.layer = Config.layers ? Config.layers.default : 'layer.default';
        this.itemType = pItemType ? pItemType : BItemType.UNKNOWN;  // the type of the item
        this.state = BItemState.UNINITIALIZED;
        this.deleteInProcess = false; // set to true when item is being destroyed
        this.DefineProperties( {
            '_Type': { 'get': () => { return this.itemType; } },
            '_Id': { 'get': () => { return this.id; } },
            '_OwnerId': { 'get': () => { return this.ownerId; } },
            '_State': { 'get': () => { return this.state; } },
            '_Layer': { 'get': () => { return this.layer; } }
        });
        BItem.AddItem(this.id, this);

        // When BItems are deleted, they are placed in the 'ItemsDeleted'
        //    list. This list is scanned and items are removed when they
        //    are old and/or their underlying assets have settled.
        if (typeof(IM.ItemsDeletedProcessor) == 'undefined') {
            IM.ItemsDeletedProcessor = setInterval( () => {
                IM.ItemsDeleted.forEach( bItem => {
                    // If BItem is still 'READY', it cannot be released yet
                    if (bItem.state != BItemState.READY) {
                        // Wait for a while before releasing
                        let waitInterval = Config.basil.BItemDeleteInterval
                                   ? Config.basil.BItemDeleteInterval : 50000;
                        if ((Date.now() - bItem.whenDeleted) > waitInterval)
                            bItem.ReleaseResources();
                            IM.ItemsDeleted.delete(bItem.id);
                        }
                    }
                });
            }, 1000);
        };

    }

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
            GP.ErrorLog('BItem.SetProperty: could not set ' + propertyName + ' because no "set" function');
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
    // If the item is deleted while waiting, this Promise is rejected.
    // TODO: this is a kludge routine using polling. Use state change
    //    events when they existw
    // TODO: a debug option that keeps a list of what is being waited for.
    //    Would make a useful display when things are slow/hung.
    WhenReady(timeoutMS) {
        return new Promise( function(resolve, reject) {
            if (this.NeverGonnaBeReady()) {
                reject(this);
            }
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
                    if (this.NeverGonnaBeReady()) {
                        rejecter(this);
                    }
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
                        if (this.NeverGonnaBeReady()) {
                            rejector(this);
                        }
                        resolver(xitem);
                    })
                    .catch(xitem => {
                        rejecter(xitem);
                    });
                }.bind(this), checkInterval, timeout, checkInterval, resolve, reject);
            }
        }.bind(this));
    }
    // Return 'true' if something is wrong with this BItem and it will never go READY.
    NeverGonnaBeReady() {
        return this.deleteInProcess
                || this.state == BItemState.FAILED
                || this.state == BItemState.SHUTDOWN;
    }

    // Release any resources this item might be holding.
    // Overloaded by routines to release graphic/communication/etc resources.
    ReleaseResources() {
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

    // Remove an BItem from the database of BItems.
    // Can be passed an 'id' (string) or a whole item.
    static ForgetItem(item) {
        if (typeof(item) == 'string') {
            var theItem = this.GetItem(item);
            if (theItem) {
                theItem.deleteInProcess = true;
                theItem.SetShutdown();
                IM.Items.delete(item);
                IM.ItemsDeleted.set(item, theItem);
                theItem.whenDeleted = Date.now();
            }
        }
        else {
            item.deleteInProcess = true;
            IM.Items.delete(item.id);
            IM.ItemsDeleted.set(item.id, item);
            item.whenDeleted = Date.now();
        }
    };

    // Iterate over all the known items.
    static ForEachItem(op) {
        IM.Items.forEach( (v, k) => { op(v); });
    }
}
