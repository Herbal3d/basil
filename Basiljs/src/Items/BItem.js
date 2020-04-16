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
    constructor(pId, pAuth, pItemType, pLayer) {
        this.props = new Map();
        this.abilities = new Map();
        this.id = pId;             // index this item is stored under
        this.idN = GetNextUniqueNum();    // a small number to identify this BItem
        this.auth = pAuth;         // authorization information
        this.ownerId = undefined; // this item is not yet associated with  some service/connection
        this.layer = Config.layers ? Config.layers.default : 'layer.default';
        if (pLayer) this.layer = pLayer;
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
        this.bItemState = BItemState.READY;
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
                            // GP.DebugLog('BItem.deleter: finally deleting ' + bItem.id);
                        };
                    };
                });
            }, 1000);
        };
    };

    // Set the state of this BItem.
    // The local BItem state is combined with the state of the abilities.
    SetState(newState) {
        let oldState = this.bItemState;
        this.bItemState = newState;
        this.FireStateChangeEvent(newState, oldState);
    };
    // Helper functions so caller doesn't need to have BItem imports.
    SetReady() { this.SetState(BItemState.READY); };
    SetFailed() { this.SetState(BItemState.FAILED); };
    SetLoading() { this.SetState(BItemState.LOADING); };
    SetShutdown() { this.SetState(BItemState.SHUTDOWN); };
    IsReady() { return this.GetState() === BItemState.READY; };

    // If state has changed and state change events are enabled, fire the event
    FireStateChangeEvent(pNewState, pOldState) {
        if (pOldState != pNewState && this.EventName_OnStateChange) {
            this.eventing.Fire(this.EventName_OnStateChange, {
                'itemid': this.id,
                'state': pNewState,
                'oldState': pOldState,
            });
        };
    };

    // Scan through all the abilities and compute the overall state.
    // Note that the BItem keeps a local state in 'bItemState' while the
    //     Abilities (derived from 'AnAbility') keep state in 'state' and
    //     have own 'SetState' functions.
    //     So, remember that 'SetState' and 'GetState' is different for
    //     BItems and Abilities.
    GetState() {
        let ret = this.bItemState;
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
            // GP.DebugLog('BItem.AddAbility: adding ability ' + pAbility.Name + ' to ' + this.id);
            if (this.abilities.has(pAbility.Name)) {
                // This already has the ability
                GP.ErrorLog('BItem.AddAbility: re-adding an ability: ' + pAbility.Name);
            }
            else {
                this.abilities.set(pAbility.Name, pAbility);
                // Add the ability to this BItem
                pAbility.Link(this)
                .then( function(abilBItem) {
                    // If ability linked, things should be set READY
                })
                .catch( function(e) {
                    // If link failed, the BItem operation has failed
                    this.SetFailed();
                    GP.DebugLog('BItem.AddAbility: failed linking ability: ' + JSONstringify(e));
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
                // GP.DebugLog('BItem.RemoveAbility: removing ability ' + pAbilityCode);
                let removedAbility = this.abilities.get(pAbilityCode);
                this.abilities.delete(pAbilityCode);
                removedAbility.Unlink(this);
            }
            else {
                GP.ErrorLog('BItem.RemoveAbility: ability not found.'
                    + ' id=' + this.id + ', abil=' + pAbilityCode);
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
        let propLower = pProp.toLowerCase();
        return this.props.get(propLower);
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
                    let propName = propDesc.name ? propDesc.name : prop;
                    let val = propDesc.get(tthis);
                    if (typeof(val) !== 'undefined' && val !== null
                                        && val !== 'null' && val !== 'undefined') {
                        ret[propName] = val;
                    }
                }
            });
        }
        else {
            this.props.forEach((propDesc, prop) => {
                // If this description has an ability name, get value directly from there
                let tthis = propDesc.ability ? this.abilities.get(propDesc.ability) : this;
                if (propDesc.get) {
                    let propName = propDesc.name ? propDesc.name : prop;
                    let val = propDesc.get(tthis);
                    if (typeof(val) !== 'undefined' && val !== null
                                        && val !== 'null' && val !== 'undefined') {
                        ret[propName] = val;
                    }
                    // else {
                    //     GP.DebugLog('BItem.FetchProperties: not fetching ' + prop + ' because value null');
                    // }
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
    //     'name': properties are always indexed by lowercased name. This is real name.
    //     'ability': if an ability property, the type of the ability
    // }
    DefineProperty(propertyName, propertyDefinition) {
        if (propertyName && propertyDefinition) {
            this.props.set(propertyName.toLowerCase(), propertyDefinition);
            // GP.DebugLog('BItem.DefineProperty: adding ' + propertyName);

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
            // GP.DebugLog('BItem.DefinePropertiesWithProps: checking ' + propName + ', pName=' + propInfo.name);
            if (propInfo.name) {
                this.DefineProperty(propInfo.name, propInfo)
            };
        });
    };

    // Remove a property definition
    UndefineProperty(propertyName) {
        this.props.delete(propertyName.toLowerCase());
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
            if (propInfo.name) {
                this.UndefineProperty(propInfo.name);
            };
        });
    };
    // Diagnostic routine that turns props into just a string
    PropsToString() {
        let currentProps = this.FetchProperties();
        return JSONstringify(currentProps);
    }

    // Return a Promise that is resolved when item status is READY.
    // Promise will be rejected if timeout interval.
    // If the item is deleted while waiting, this Promise is rejected.
    // Note that this promise returns this item for both the resolve and reject
    // TODO: this is a kludge routine using polling. Use state change
    //    events when they existw
    // TODO: a debug option that keeps a list of what is being waited for.
    //    Would make a useful display when things are slow/hung.
    WhenReady(timeoutMS) {
        return new Promise( function(resolve, reject) {
            if (this.GetState() == BItemState.READY) {
                // GP.DebugLog('BItem.WhenReady: READY.id=' + this.id);
                resolve(this);
            }
            else {
                if (this.NeverGonnaBeReady()) {
                    reject(this);
                }
                else {
                    let checkInterval = 200;
                    if (Config.assets && Config.assets.assetFetchCheckIntervalMS) {
                        checkInterval = Number(Config.assets.assetFetchCheckIntervalMS);
                    };
                    let maxCheckInterval = 1000;
                    if (Config.assets && Config.assets.assetFetchCheckIntervalMaxMS) {
                        maxCheckInterval = Number(Config.assets.assetFetchCheckIntervalMaxMS);
                    };
                    let timeout = 5000;
                    if (Config.assets && Config.assets.assetFetchTimeoutMS) {
                        timeout = Number(Config.assets.assetFetchTimeoutMS);
                    };
                    if (timeoutMS) {  // use the passed timeout if specified
                        timeout = timeoutMS;
                    };
                    if (timeout <= 0) {
                        // GP.DebugLog('BItem.WhenReady: reject timeout. id=' + this.id);
                        reject(this);
                    }
                    else {
                        // Wait for 'checkInterval' and test again for 'READY'.
                        // GP.DebugLog('BItem.WhenReady: not ready. Waiting ' + checkInterval
                        //             + ' with timeout ' + timeout
                        //             + ', id=' + this.id);
                        BItem.WaitABit(checkInterval, this)
                        .then( xitem => {
                            checkInterval += checkInterval;
                            if (checkInterval > maxCheckInterval) checkInterval = maxCheckInterval;
                            timeout = timeout - checkInterval;
                            xitem.WhenReady(timeout)
                            .then( yitem => {
                                // GP.DebugLog('BItem.WhenReady: READY. id=' + yitem.id);
                                resolve(yitem);
                            })
                            .catch( zitem => {
                                // GP.DebugLog('BItem.WhenReady: NOT READY. id=' + zitem.id);
                                reject(zitem);
                            });
                        });
                    };
                };
            };
        }.bind(this) );
    };
    // A small routine that returns a Promise that is resolved in 'ms' milliseconds.
    static WaitABit(ms, pParam) {
        return new Promise( resolver => { setTimeout(resolver, ms, pParam); } );
    };
    // Return 'true' if something is wrong with this BItem and it will never go READY.
    NeverGonnaBeReady() {
        let currentState = this.state;
        return this.deleteInProcess
                || currentState == BItemState.FAILED
                || currentState == BItemState.SHUTDOWN;
    };

    // Release any resources this item might be holding.
    // Overloaded by routines to release graphic/communication/etc resources.
    ReleaseResources() {
        // Unhook, delete, and release any abilities
        this.abilities.forEach( (abil, abilName) => {
            try {
                // This calls Ability.Unlink which releases ability resources.
                // GP.DebugLog('BItem.ReleaseResources: removing ability ' + abilName);
                this.RemoveAbility(abilName);
            }
            catch (e) {
                GP.ErrorLog('BItem.ReleaseResources: exception: ' + JSONstringify(e))
            };
        }, this );
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
                BItem.RemoveAndReleaseItem(theItem);
            }
            else {
                GP.ErrorLog('BItem.ForgetItem: asked to remove item that does not exist. id=' + item);
            };
        }
        else {
            // GP.DebugLog('BItem.ForgetItem: id=' + item.id);
            try {
                BItem.RemoveAndReleaseItem(item);
            }
            catch (e) {
                GP.ErrorLog('BItem.ForgetItem: exception forgetting: ' + JSONstringify(e));
            };
        };
    };
    static RemoveAndReleaseItem(item) {
        item.SetShutdown();
        item.deleteInProcess = true;
        IM.Items.delete(item.id);
        IM.ItemsN.delete(item.idN);
        item.ReleaseResources();
        IM.ItemsDeleted.set(item.id, item);
        item.whenDeleted = Date.now();
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
//          'name': the name of the BItem property to register for this property
//          'ability': if this var is part of an ability (used by BItem fetch)
BItem.PropsToVars = {
    'itemtype': {
        get: (obj) => { return obj.itemType; },
        name: 'ItemType'
    },
    'itemid' : {
        get: (obj) => { return obj.id; },
        name: 'ItemId'
    },
    'ownerid' : {
        get: (obj) => { return obj.ownerId; },
        name: 'OwnerId'
    },
    'state' : {
        get: (obj) => { return obj.state; },
        name: 'State'
    },
    'layer' : {
        get: (obj) => { return obj.layer; },
        name: 'Layer'
    },
    'abilities' : {
        get: (obj) => { return obj.AbilityNameList(); },
        name: 'Abilities'
    }
};
