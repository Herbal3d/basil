// Copyright 2020 Robert Adams
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

import { GP } from 'GLOBALS';

import Config from '../config.js';
import { BItem, BItemType } from '../Items/BItem.js';
import { CreateToken } from '../Auth/Auth.js';

import { MsgProcessor, MakeExceptionResp, CreatePropertyList, BuildAbilityProps } from './MsgProcessor.js';
import { BasilMessageOps } from './BasilMessageOps.js';

import { CombineParameters, CreateUniqueId, JSONstringify } from '../Utilities.js';

import { AbilityFactory } from '../Items/AbilityRegistration.js';
import { BException } from '../BException.js';

// Message API for the Basil <=> SpaceServer connection.

// This acts as both ends of a Basil <=> SpaceServer connection for Javascript.
//    The parameter 'AsServer' is true if this instance is acting as the SpaceServer end.
//    Organized this way so the JS code can be used both for the regular Basil viewer
//    as well as for JS testing code.
export class BasilComm extends MsgProcessor {
    constructor(pTransport, pParams) {
        // Merge the passed parameters with required parameter defaults
        let params = CombineParameters(Config.comm.BasilClient, pParams, {
            'id': undefined,    // unique generated if not specified
            'AsServer': false   // default to being a Basil client
        });
        params.id = params.id ? params.id : CreateUniqueId('BasilClientConnection');
        super(params.id, undefined);
        this.params = params;
        this.transport = pTransport;
        this.IsServer = params.AsServer;

        let processors = new Map();
        processors.set(BasilMessageOps.CreateItemReq, this._procCreateItem.bind(this));
        processors.set(BasilMessageOps.CreateItemResp, this.HandleResponse.bind(this));
        processors.set(BasilMessageOps.DeleteItemReq, this._procDeleteItem.bind(this));
        processors.set(BasilMessageOps.DeleteItemResp, this.HandleResponse.bind(this));
        processors.set(BasilMessageOps.AddAbilityReq, this._procAddAbility.bind(this));
        processors.set(BasilMessageOps.AddAbilityResp, this.HandleResponse.bind(this));
        processors.set(BasilMessageOps.RemoveAbilityReq, this._procRemoveAbility.bind(this));
        processors.set(BasilMessageOps.RemoveAbilityResp, this.HandleResponse.bind(this));
        processors.set(BasilMessageOps.RequestPropertiesReq, this._procRequestProperties.bind(this));
        processors.set(BasilMessageOps.RequestPropertiesResp, this.HandleResponse.bind(this));
        processors.set(BasilMessageOps.UpdatePropertiesReq, this._procUpdateProperties.bind(this));
        processors.set(BasilMessageOps.UpdatePropertiesResp, this.HandleResponse.bind(this));

        processors.set(BasilMessageOps.OpenSessionReq, this._procOpenSessionSession.bind(this));
        processors.set(BasilMessageOps.OpenSessionResp, this.HandleResponse.bind(this));
        processors.set(BasilMessageOps.CloseSessionReq, this._procCloseSession.bind(this));
        processors.set(BasilMessageOps.CloseSessionResp, this.HandleResponse.bind(this));
        processors.set(BasilMessageOps.MakeConnectionReq, this._procMakeConnection.bind(this));
        processors.set(BasilMessageOps.MakeConnectionResp, this.HandleResponse.bind(this));

        processors.set(BasilMessageOps.AliveCheckReq, this._procAliveCheck.bind(this));
        processors.set(BasilMessageOps.AliveCheckResp, this.HandleResponse.bind(this));

        this.RegisterMsgProcess(this.transport, processors);
    };

    Start() {
        if (this.IsServer) {
            // If a server, don't become ready until an OpenSession has been received
        }
        else {
          this.SetReady();
        };
    };

    Close() {
    };

    CreateItem(pProps, pAbilities) {
        let msg = { 'Op': BasilMessageOps.CreateItemReq};
        if (this.OutgoingAuth) msg['SessionAuth'] = this.OutgoingAuth;
        if (pProps) msg['IProps'] = CreatePropertyList(pProps);
        if (pAbilities) msg['AProps'] = BuildAbilityProps(pAbilities);
        return this.SendAndPromiseResponse(msg);
    };

    _procCreateItem(req) {
        return new Promise( function(resolve, reject) {
            let ret = { 'Op': BasilMessageOps.CreateItemResp};
            if (this._CheckAuth(req.SessionAuth)) {
                // We create a unique Id if one not supplied.
                // TODO: check if ID already exists!!
                let id = req.ItemId ? req.ItemId : CreateUniqueId('remote');
                let itemAuth = req.ItemAuth ? req.itemAuth : req.SessionAuth;

                // Figure out the layer for this BItem. It is either specified or
                //     defaults to the connection talking.
                let layer = this.layer;
                if (req.IProps && req.IProps['layer']) {
                    layer = req.IProps['layer'];
                };
                // TODO: figure out how to get a layer name from the SpaceServer.

                let newItem = new BItem(id, itemAuth, BItemType.CONTAINER, layer);
                newItem.ownerId = this.id;    // So we know who created what
                // TODO: copy IProps
                // If Ability definitions have been sent, add those abilities
                if (req.AProps && req.AProps.length > 0) {
                    req.AProps.forEach( abil => {
                        let newAbility = AbilityFactory(abil);
                        if (newAbility) {
                            newItem.AddAbility(newAbility);
                        }
                        else {
                            GP.ErrorLog('BasilComm._procCreateItem: failed creation of ability: ' + JSONstringify(abil));
                        };
                    });
                };
                ret['IProps'] = CreatePropertyList( {
                    'ItemId': newItem.id,
                    'ItemIdN': newItem.idN
                });
                resolve(ret);
            }
            else {
                reject(MakeExceptionResp(ret, 'Not authorized'));
            };
        }.bind(this) );
    };

    DeleteItem(pId, pItemAuth) {
        let ret = { 'Op': BasilMessageOps.DeleteItemReq};
        if (this.OutgoingAuth) msg['SessionAuth'] = this.OutgoingAuth;
        if (pId) msg['ItemId'] = pId;
        if (pItemAuth) msg['ItemAuth'] = pItemAuth;
        return this.SendAndPromiseResponse(msg);
    };

    _procDeleteItem(req) {
        return new Promise( function(resolve, reject) {
            let ret = { 'Op': BasilMessageOps.DeleteItemResp};
            if (this._CheckAuth(req.SessionAuth)) {
                // Find the item to delete
                let item = BItem.GetItemN(req.ItemId, req.ItemIdN);
                if (item) {
                    BItem.ForgetItem(item);
                    resolve(ret);
                }
                else {
                    reject(MakeExceptionResp(ret, 'Item does not exist'));
                }
            }
            else {
                reject(MakeExceptionResp(ret, 'Not authorized'));
            };
        }.bind(this) );
    };

    AddAbility(pId, pAbilities) {
        let ret = { 'Op': BasilMessageOps.AddAbilityReq};
        if (this.OutgoingAuth) msg['SessionAuth'] = this.OutgoingAuth;
        // TODO:
        return this.SendAndPromiseResponse(msg);
    };
    _procAddAbility(req) {
        return new Promise( function(resolve, reject) {
            let ret = { 'Op': BasilMessageOps.AddAbilityResp};
            if (this._CheckAuth(req.SessionAuth)) {
                let item = BItem.GetItemN(req.ItemId, req.ItemIdN);
                if (item) {
                    // If Ability definitions have been sent, add those abilities
                    if (req.AProps && req.AProps.length > 0) {
                        req.AProps.forEach( abil => {
                            try {
                                let newAbility = AbilityFactory(abil);
                                if (newAbility) {
                                    item.AddAbility(newAbility);
                                };
                            }
                            catch (e) {
                                // Creation of this ability failed
                                reject(MakeExceptionResp(ret, JSONstringify(e)));
                            };
                        });
                        resolve(ret);
                    }
                    else {
                        reject(MakeExceptionResp(ret, 'No abilities to create'));
                    };
                }
                else {
                    reject(MakeExceptionResp(ret, 'Item does not exist'));
                }
            }
            else {
                reject(MakeExceptionResp(ret, 'Not authorized'));
            };
        }.bind(this) );
    };
    
    RemoveAbility(pId, pAbilities) {
        let ret = { 'Op': BasilMessageOps.RemoveAbilityReq};
        if (this.OutgoingAuth) msg['SessionAuth'] = this.OutgoingAuth;
        // TODO:
        return this.SendAndPromiseResponse(msg);
    };
    _procRemoveAbility(req) {
        return new Promise( function(resolve, reject) {
            let ret = { 'Op': BasilMessageOps.RemoveAbilityResp};
            if (this._CheckAuth(req.SessionAuth)) {
                let item = BItem.GetItemN(req.ItemId, req.ItemIdN);
                if (item) {
                    if (req.AProps && req.AProps.length > 0) {
                        req.AProps.forEach( abil => {
                            item.RemoveAbility(abil.AbilityCode);
                        });
                    };
                    resolve(ret);
                }
                else {
                    reject(MakeExceptionResp(ret, 'Item does not exist'));
                }
            }
            else {
                reject(MakeExceptionResp(ret, 'Not authorized'));
            };
        }.bind(this) );
    };
    
    RequestProperties(pId, filter) {
        let msg = { 'Op': BasilMessageOps.RequestPropertiesReq};
        if (this.OutgoingAuth) msg['SessionAuth'] = this.OutgoingAuth;
        if (pId) msg['ItemId'] = pId;
        if (filter) msg['IProps'] = CreatePropertyList({ 'filter': filter });
        return this.SendAndPromiseResponse(msg);
    };
    _procRequestProperties(req) {
        return new Promise( function(resolve, reject) {
            let ret = { 'Op': BasilMessageOps.RequestPropertiesResp};
            if (this._CheckAuth(req.auth)) {
                let filter = (req.IProps && req.IProps['filter']) ? req.IProps['filter'] : undefined;
                let item = BItem.GetItemN(req.ItemId, req.ItemIdN);
                if (item) {
                    ret['IProps'] = CreatePropertyList(item.FetchProperties(filter));
                    resolve(ret);
                }
                else {
                    reject(MakeExceptionResp(ret, 'Item does not exist'));
                }
            }
            else {
                reject(MakeExceptionResp(ret, 'Not authorized'));
            };
        }.bind(this) );
    };

    UpdateProperties(pId, pProps) {
        let msg = { 'Op': BasilMessageOps.UpdatePropertiesReq};
        if (this.OutgoingAuth) msg['SessionAuth'] = this.OutgoingAuth;
        if (pId) msg['ItemId'] = pId;
        if (pProps) msg['IProps'] = CreatePropertyList(pProps);
        return this.SendAndPromiseResponse(msg);
    };
    _procUpdateProperties(req) {
        return new Promise( function(resolve, reject) {
            let ret = { 'Op': BasilMessageOps.UpdatePropertiesResp};
            if (this._CheckAuth(req.auth)) {
                let item = BItem.GetItemN(req.ItemId, req.ItemIdN);
                if (item) {
                    try {
                        if (req.IProps) {
                            Object.keys(req.IProps).forEach( propToChange => {
                                item.SetProperty(propToChange, req.IProps[propToChange]);
                            });
                        };
                        resolve(ret);
                    }
                    catch (e) {
                        GP.ErrorLog('_procUpdateProperties: exception setting.'
                                + ' IProps=' + JSONstringify(req.IProps)
                                + ', e=' + e);
                        reject(MakeExceptionResp(ret, 'Failed setting properties: ' + JSONstringify(e)));
                    };
                }
                else {
                    reject(MakeExceptionResp(ret, 'Item does not exist'));
                }
            }
            else {
                reject(MakeExceptionResp(ret, 'Not authorized'));
            };
        }.bind(this) );
    };

    // OpenSession has an 'extended' authorization as it contains the new sessionkey
    //    as well as the auth for access the service.
    OpenSession(pUserAuth, propertyList) {
        let msg = { 'Op': BasilMessageOps.OpenSessionReq};
        if (pUserAuth) msg['SessionAuth'] = pUserAuth;
        if (propertyList) msg['IProps'] = CreatePropertyList(propertyList);
        GP.DebugLog('BasilComm.OpenSession: sending message: ' + JSONstringify(msg));
        return this.SendAndPromiseResponse(msg);
    };
    _procOpenSessionSession(req) {
        return new Promise( function(resolve, reject) {
            // A server end is ready after processing an OpenSession request
            let ret = { 'Op': BasilMessageOps.OpenSessionResp};
            this.openSessionProperties = req.IProps;
            this.SetReady();
            resolve(ret);
        }.bind(this) );
    };

    CloseSession(reason) {
        let msg = { 'Op': BasilMessageOps.CloseSessionReq};
        if (this.OutgoingAuth) msg['SessionAuth'] = this.OutgoingAuth;
        if (reason) msg['IProps'] = CreatePropertyList({ 'reason': reason } );
        return this.SendAndPromiseResponse(msg);
    };
    _procCloseSession(req) {
        return new Promise( function(resolve, reject) {
            let ret = { 'Op': BasilMessageOps.CloseSessionResp};
            resolve(ret);
        }.bind(this) );
    };

    MakeConnection(propertyList) {
        let msg = { 'Op': BasilMessageOps.MakeConnectionReq};
        if (this.OutgoingAuth) msg['SessionAuth'] = this.OutgoingAuth;
        return this.SendAndPromiseResponse(msg);
    };
    _procMakeConnection(req) {
        return new Promise( function(resolve, reject) {
            let ret = { 'Op': BasilMessageOps.MakeConnectionResp};
            if (this._CheckAuth(req.SessionAuth)) {
                let params = CombineParameters(undefined, req.IProps, {
                    'transportURL': undefined,
                    'transport': 'WS',
                    'service': undefined,
                    'serviceauth': undefined
                });
                GP.DebugLog('BasilComm.MakeConnection: props=' + JSONstringify(params));
    
                GP.CM.ConnectTransportAndService(GP.CM, params)
                .then( srv => {
                    // A new service so new tokens to talk to me with
                    srv.SetIncomingAuth(CreateToken('makeconn'));
                    let props = {
                        'SessionKey': CreateToken('session'),
                        'ClientAuth': srv.IncomingAuth
                    };
                    srv.OpenSession(params.serviceauth, props)
                    .then( resp => {
                        if (resp.Exception) {
                            GP.DebugLog('BasilComm.ProcMakeConnection: OpenSession failed:'
                                        + JSONstringify(resp));
                            reject(MakeExceptionResp(ret, resp.Exception, resp.ExceptionHints));
                        }
                        else {
                            GP.DebugLog('BasilComm.ProcMakeConnection: Session opened to SpaceServer. Params='
                                        + JSONstringify(resp.IProps));
                            // Copy the authorizations onto the service for later checking
                            srv.SetOutgoingAuth(resp.SessionAuth, resp.SessionAuthExpiration);
                            srv.SessionKey = resp.SessionKey;
                            srv.ConnectionKey = resp.ConnectionKey;
                            // TODO: response includes 'Services' which give access info for asset server
                            resolve(ret);
                        }
                    })
                    .catch( e => {
                        GP.ErrorLog('BasilComm.ProcMakeConnection: failed to open session: ' + e.message);
                        reject(MakeExceptionResp(ret, JSONstringify(e)));
                    });
                })
                .catch (e => {
                    GP.ErrorLog('BasilComm.ProcMakeConnection: failed connecting to transport/service: ' + e.message);
                    reject(MakeExceptionResp(ret, JSONstringify(e)));
                });
            }
            else {
                reject(MakeExceptionResp(ret, 'Not authorized'));
            };
        }.bind(this) );
    };

    AliveCheck() {
        let msg = { 'Op': BasilMessageOps.AliveCheckReq};
        if (this.OutgoingAuth) msg['SessionAuth'] = this.OutgoingAuth;
        msg['IProps'] = CreatePropertyList( {
            'time': Date.now(),
            'sequenceNum': this.aliveSequenceNum++
        });
        // GP.DebugLog('AliveCheckBasil.AliveCheck: sending: ' + JSON.stringify(msg));
        return this.SendAndPromiseResponse(msg);
    };

    _procAliveCheck(req) {
        return new Promise( function(resolve, reject) {
            let ret = { 'Op': BasilMessageOps.AliveCheckResp};
            ret['IProps'] = CreatePropertyList( {
                'time': Date.now(),
                'sequenceNum': this.aliveSequenceNum++,
                'timeReceived': req.IProps.Values['time'],
                'sequenceNumberReceived': req.IProps.Values['sequenceNum']
            });
            resolve(ret);
        }.bind(this) );
    };

    _CheckAuth(pAuth) {
        return true;
    }


}
