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

import { GP, GetNextUniqueNum } from 'GLOBALS';
import Config from '../config.js';
import { JSONstringify } from '../Utilities.js';

// The management of the itme collection is done with static functions
var IM = IM || {};
GP.IM = IM;

IM.Items = IM.Items || new Map();
IM.ItemsN = IM.ItemsN || new Map();
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
    CONTAINER: 'Container',
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
        this.abilities = new Map();
        this.id = pId;             // index this item is stored under
        this.idN = GetNextUniqueNum();    // a small number to identify this BItem
        this.auth = pAuth;         // authorization information
        this.ownerId = undefined; // this item is not yet associated with  some service/connection
        this.layer = Config.layers ? Config.layers.default : 'layer.default';
        this.itemType = pItemType ? pItemType : BItemType.CONTAINER;  // the type of the item

        // State is the combination of the state of all the Abilities
        Object.defineProperty(this, 'state', {
            get: function() { return this.GetState(); }.bind(this)
        });

        this.deleteInProcess = false; // set to true when item is being destroyed

        // Define the properties for this item instance
        this.DefinePropertiesWithProps(BItem.PropsToVars);

        BItem.AddItem(this.id, this);

        // The base BItem is just ready. This is usually overridden by Abilities.
        this.BItemState = BItemState.UNINITIALIZED;
        // Enable when people start using this
        // this.EventName_OnStateChange = 'StateChange-' + this.id;

        // When BItems are deleted, they are placed in the 'ItemsDeleted'
        //    list. This list is scanned and items are removed when they
        //    are old and/or their underlying assets have settled.
        if (typeof(IM.ItemsDeletedProcessor) === 'undefined') {
            IM.ItemsDeletedProcessor = setInterval( () => {
                IM.ItemsDeleted.forEach( bItem => {
                    // If BItem is still 'READY', it cannot be released yet
                    if (bItem.state != BItemState.READY) {
                        // Wait for a while before releasing
                        let waitInterval = Config.basil.BItemDeleteInterval
                                   ? Config.basil.BItemDeleteInterval : 50000;
                        if ((Date.now() - bItem.whenDeleted) > waitInterval) {
                            bItem.ReleaseResources();
                            IM.ItemsDeleted.delete(bItem.id);
                        };
                    };
                });
            }, 1000);
        };
    };

    // Set the state of this BItem.
    // The local BItem state is combined with the state of the abilities.
    SetState(newState) {
        let oldState = this.BItemState;
        this.BItemState = newState;
        this.FireStateChangeEvent(newState, oldState);
    };
    // Helper functions so caller doesn't need to have BItem imports.
    SetReady() { this.SetState(BItemState.READY); };
    SetFailed() { this.SetState(BItemState.FAILED); };
    SetLoading() { this.SetState(BItemState.LOADING); };
    SetShutdown() { this.SetState(BItemState.SHUTDOWN); };

    // If state has changed and state change events are enabled, fire the event
    FireStateChangeEvent(pNewState, pOldState) {
        if (pOldState != pNewState && this.EventName_OnStateChange) {
            this.eventing.Fire(this.EventName_OnStateChange, {
                'id': this.id,
                'state': pNewState,
                'oldState': pOldState,
            });
        };
    };

    // Scan through all the abilities and compute the overall state
    GetState() {
        let ret = this.BItemState;
        this.abilities.forEach( (val, key) => {
            ret = this.CombineState(ret, val.GetState());
        });
        return ret;
    };

    // Accepts an AsAbility child or an array of same and adds them to this BItem
    AddAbility(pAbility) {
        if (Array.isArray(pAbility)) {
            pAbility.forEach( abil => { this.AddAbility(abil); });
        }
        else {
            GP.DebugLog('BItem.AddAbility: adding ability ' + pAbility.Name + ' to ' + this.id);
            if (this.abilities.has(pAbility.Name)) {
                // This already has the ability
                GP.ErrorLog('BItem.AddAbility: re-adding an ability: ' + pAbility.Name);
            }
            else {
                this.abilities.set(pAbility.Name, pAbility);
                // Add the ability to this BItem
                pAbility.Link(this)
                .then( function(abil) {
                    this.SetReady();
                }.bind(this) );

                // The state of the BItem is READY but the ability will take precidence
            };
        };
    };
    // Accepts an Ability code or an array of same and removes them from this BItem
    RemoveAbility(pAbilityCode) {
        if (Array.isArray(pAbilityCode)) {
            pAbilityCode.forEach( abil => { this.RemoveAbility(abil); });
        }
        else {
            if (this.abilities.has(pAbilityCode)) {
                let removedAbility = this.abilities[pAbilityCode];
                removedAbility.Unlink(this);
                this.abilities.delete(pAbilityCode);
            }
            else {
            };
        };
    };
    // Get the named ability or 'undefined' if no such ability on this BItem
    GetAbility(pAbilityName) {
        return this.abilities.get(pAbilityName);
    }
    // Return string of comma separated names of abilities
    AbilityNameList() {
        let names = [];
        this.abilities.forEach( abil => {
            names.push(abil.Name);
        });
        return names.join(',');
    };

    // Returns the value of the property or 'undefined' if either
    //    no such property or there isn't a value for it.
    GetProperty(pProp) {
        let ret = undefined;
        let propDesc = this.GetPropertyDesc(pProp);
        if (propDesc && propDesc.get) {
            // If the property is from one of the abilities, reference that instance
            let tthis = propDesc.ability ? this.GetAbility(propDesc.ability) : this;
            ret = propDesc.get(tthis);
        }
        return ret;
    };
    // Return the description block for the property.
    // Returns 'undefined' if there is no such property.
    GetPropertyDesc(pProp) {
        let ret = this.props.get(pProp);
        if (typeof(ret) === 'undefined') {
            // Didn't find the property but case sensitivity is a pain
            // See if we can find the property in a case-independent way
            let propLower = pProp.toLowerCase();
            for (let key of this.props.keys()) {
                if (key.toLowerCase() == propLower) {
                    ret = this.props.get(key);
                    break;
                };
            };
        };
        return ret;
    };

    // Returns an Object of properties and values
    FetchProperties(filter) {
        let ret = {};
        if (filter) {
            this.props.forEach((propDesc, prop) => {
                // TODO: Some wildcard testing
                // If this description has an ability name, get value directly from there
                let tthis = propDesc.ability ? this.abilities.get(propDesc.ability) : this;
                if (propDesc.get) {
                    let val = propDesc.get(tthis);
                    if (typeof(val) !== 'undefined' && val !== null
                                        && val !== 'null' && val !== 'undefined') {
                        ret[prop] = val;
                    }
                }
            });
        }
        else {
            this.props.forEach((propDesc, prop) => {
                // If this description has an ability name, get value directly from there
                let tthis = propDesc.ability ? this.abilities.get(propDesc.ability) : this;
                if (propDesc.get) {
                    let val = propDesc.get(tthis);
                    if (typeof(val) !== 'undefined' && val !== null
                                        && val !== 'null' && val !== 'undefined') {
                        ret[prop] = val;
                    }
                }
                // GP.DebugLog('BItem.FetchProperties: setting ' + prop + ' = ' + ret[prop]);
            });
        }
        return ret;
    };

    SetProperty(propertyName, value) {
        let propDesc = this.GetPropertyDesc(propertyName);
        if (propDesc) {
            if (propDesc.set) {
                // GP.DebugLog('BItem.SetProperty: ' + propertyName + ' => ' + JSON.stringify(value));
                propDesc.set(this, value);
                /* Someday generate events for property value changing
                Eventing.Instance.Fire(this.EventName_OnPropertySet, {
                    'property': propertyName,
                    'value': value
                });
                */
            }
            else {
                GP.ErrorLog('BItem.SetProperty: could not set ' + propertyName + ' because no "set" function');
            };
        }
        else {
            GP.ErrorLog('BItem.SetProperty: could not get definition of ' + propertyName);
        }
    };
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
      };
    };

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
        };
    };
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
        };
    };
    // Given a PropsToVars structure, define an external property if the
    //     variable description includes a value for 'propertyName'.
    DefinePropertiesWithProps(pPropMap) {
        Object.keys(pPropMap).forEach( propName => {
            let propInfo = pPropMap[propName];
            // GP.DebugLog('BItem.DefinePropertiesWithProps: checking ' + propName + ', pName=' + propInfo.propertyName);
            if (propInfo.propertyName) {
                this.DefineProperty(propInfo.propertyName, propInfo)
            };
        });
    };

    // Remove a property definition
    UndefineProperty(propertyName) {
        this.props.delete(propertyName);
    };
    // Remove a set of property definitions. Pass an array of property names.
    UndefineProperties(propertyNames) {
        if (Array.isArray(propertyNames)) {
            propertyNames.forEach( propName => {
                this.UndefineProperty(propName);
            });
        }
        else {
            Object.keys(propertyNames).forEach( propName => {
                this.UndefineProperty(propName);
            });

        };
    };
    // Remove property definition based on PropsToVars
    UndefinePropertiesWithProps(pPropMap) {
        Object.keys(pPropMap).forEach( propInfo => {
            if (propInfo.propertyName) {
                this.UndefineProperty(propInfo.propertyName);
            };
        });
    };

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
            };
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
            };
        }.bind(this));
    };
    // Return 'true' if something is wrong with this BItem and it will never go READY.
    NeverGonnaBeReady() {
        return this.deleteInProcess
                || this.state == BItemState.FAILED
                || this.state == BItemState.SHUTDOWN;
    };

    // Release any resources this item might be holding.
    // Overloaded by routines to release graphic/communication/etc resources.
    ReleaseResources() {
    };

    // Add an item to the database of items.
    // One caller should not be able to see other caller's items so, someday,
    //     add some security based on the creator of the BItem
    static AddItem(id, item, auth) {
        IM.Items.set(id, item);
        IM.ItemsN.set(item.idN, item);
        return item;
    };

    // Look up an item baed on it's Id
    static GetItem(id) {
        return IM.Items.get(id);
    };
    // A request can reference an item by its Id or its session number
    static GetItemN(pId, pIdN) {
        let ret = undefined;
        if (pId) {
            ret = IM.Items.get(pId);
        }
        else {
            if (pIdN) {
                ret = IM.ItemsN.get(pIdN);
            }
        }
        return ret;
    }

    // Remove an BItem from the database of BItems.
    // Can be passed an 'id' (string) or a whole item.
    static ForgetItem(item) {
        if (typeof(item) == 'string') {
            var theItem = this.GetItem(item);
            if (theItem) {
                theItem.deleteInProcess = true;
                theItem.SetShutdown();
                IM.Items.delete(item);
                IM.ItemsN.delete(item);
                IM.ItemsDeleted.set(item, theItem);
                theItem.whenDeleted = Date.now();
            }
        }
        else {
            item.deleteInProcess = true;
            IM.Items.delete(item.id);
            IM.ItemsN.delete(item);
            IM.ItemsDeleted.set(item.id, item);
            item.whenDeleted = Date.now();
        }
    };

    // Iterate over all the known items.
    static ForEachItem(op) {
        IM.Items.forEach( (v, k) => { op(v); });
    }

    // Combine the new state to the previous state and return a new state.
    // Normally everything is READY. Otherwise, return the worse state.
    //     UNINITIALIZED LOADING FAILED READY SHUTDOWN
    CombineState(prevState, newState) {
        let ret = BItemState.UNINITIALIZED;
        if (newState == BItemState.READY && prevState == BItemState.READY) {
            ret = BItemState.READY;
        }
        else {
            // Not the simple case of READY. If someone is already in SHUTDOWN, everyone is shutdown
            if (prevState == BItemState.SHUTDOWN) {
                ret = BItemState.SHUTDOWN;
            }
            else {
                // If the new state is failed or shutdown, that's what it will be
                if (newState == BItemState.FAILED || newState == BItemState.SHUTDOWN) {
                    ret = newState;
                }
                else {
                    // Anyone being unitialized makes everyone that way
                    if (newState == BItemState.UNINITIALIZED) {
                        ret = newState;
                    }
                    else {
                        // The newState is either LOADING or READY
                        // If READY, we know prevState is not READY so don't change the state.
                        if (newState == BItemState.READY) {
                            ret = prevState;
                        }
                        else {
                            // newState is LOADING and prevState is not any of the bad ones
                            ret = newState;
                        }
                    }
                }
            }
        }
        // GP.DebugLog('BItem.CombineState: prev=' + prevState + ', new=' + newState + ', ret=' + ret);
        return ret;
    };
};

// Mapping of property list names to properties on this instance.
// See Ability.InitializeProps() and Ability.GenerateProps() for usage.
// Property name definitions must be lower case.
// The 'obj' is a BItem.
// The entries for each property are:
//          'get', 'set': value get and set operations
//          'name': named used for the property when exported for the protocol
//          'propertyName': the name of the BItem property to register for this property
//          'ability': if this var is part of an ability (used by BItem fetch)
BItem.PropsToVars = {
    'type': {
        get: (obj) => { return obj.itemType; },
        propertyName: '_Type'
    },
    'id' : {
        get: (obj) => { return obj.id; },
        propertyName: '_Id'
    },
    'ownerid' : {
        get: (obj) => { return obj.ownerId; },
        propertyName: '_OwnerId'
    },
    'state' : {
        get: (obj) => { return obj.state; },
        propertyName: '_State'
    },
    'layer' : {
        get: (obj) => { return obj.layer; },
        propertyName: '_Layer'
    },
    'abilities' : {
        get: (obj) => { return obj.AbilityNameList(); },
        propertyName: '_Abilities'
    }
};
