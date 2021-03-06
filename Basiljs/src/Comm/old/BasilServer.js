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
import { BItem, BItemType } from '../Items/BItem.js';

import { MsgProcessor } from './MsgProcessor.js';
import { BasilMessageOps } from './BasilMessageOps.js';

import { CreateUniqueId, CreateUniqueInstanceId, CombineParameters, JSONstringify } from '../Utilities.js';
import { DisplayableFactory, InstanceFactory } from '../Items/Factories.js';

import { CreateToken } from '../Auth/Auth.js';

// Interface of a Basil Server talking over a Basil/SpaceServer streaming connection.
export class BasilServerConnection  extends MsgProcessor {
    // @param serverId a unique Id for accessing this server instance
    // @param transp BTransport instance to talk over
    // @param parms a map of extra parameters for this service
    constructor(pTransport, pParams) {
        let params = CombineParameters(Config.comm.BasilServerConnection, pParams, {
          'id': undefined,     // unique generated if not specified
          'serviceAuth': undefined
        });
        params.id = params.id ? params.id : CreateUniqueId('BasilServerConnection');
        super(params.id, params.serviceAuth, BItemType.SERVICE);
        this.params = params;
        this.transport = pTransport;

        // templates = [message_processor, reply_name]
        //      If the _reply_name is 'undefined', then the message doesn't expect a response.
        let processors = new Map();
        processors.set(BasilMessageOps.get('IdentifyDisplayableObjectReq'), this._ProcIdentifyDisplayableObject.bind(this));
        processors.set(BasilMessageOps.get('ForgetDisplayableObjectReq'), this._ProcForgetDisplayableObject.bind(this));
        processors.set(BasilMessageOps.get('CreateObjectInstanceReq'), this._ProcCreateObjectInstance.bind(this));
        processors.set(BasilMessageOps.get('DeleteObjectInstanceReq'), this._ProcDeleteObjectInstance.bind(this));
        processors.set(BasilMessageOps.get('UpdateObjectPropertyReq'), this._ProcUpdateObjectProperty.bind(this));
        processors.set(BasilMessageOps.get('UpdateInstancePropertyReq'), this._ProcUpdateInstanceProperty.bind(this));
        processors.set(BasilMessageOps.get('UpdateInstancePositionReq'), this._ProcUpdateInstancePosition.bind(this));
        processors.set(BasilMessageOps.get('RequestObjectPropertiesReq'), this._ProcRequestObjectProperties.bind(this));
        processors.set(BasilMessageOps.get('RequestInstancePropertiesReq'), this._ProcRequestInstanceProperties.bind(this));
        processors.set(BasilMessageOps.get('CloseSessionReq'), this._ProcCloseSession.bind(this));
        processors.set(BasilMessageOps.get('MakeConnectionReq'), this._ProcMakeConnection.bind(this));
        this.RegisterMsgProcess(this.transport, processors);
    }
    Start() {
        this.SetReady();
    }
    Close() {
        if (this.transport) {
            this.transport.Close(); // also clears receiveCallback
            this.transport = undefined;
        }
    }

    _ProcIdentifyDisplayableObject(req) {
        // console.log('IdentifyDisplayableObject');
        let ret = { 'op': BasilMessageOps.get('IdentifyDisplayableObjectResp') };
        if (this._CheckAuth(req.auth)) {
            if (req.assetInfo) {
                let id = req.assetInfo.id ? req.assetInfo.id : CreateUniqueId('remote');
                let newItem = DisplayableFactory(id, req.auth, req.assetInfo.displayInfo);
                if (newItem) {
                    newItem.ownerId = this.id;    // So we know who created what
                    ret['objectId'] = { 'id': newItem.id };
                }
                else {
                    ret['exception'] = this.MakeException('Could not create object');
                }
            }
            else {
                ret['exception'] = this.MakeException('No assetInfo specified');
            }
        }
        else {
            ret['exception'] = this.MakeException('Not authorized');
        }
        return ret;
    }
    _ProcForgetDisplayableObject(req) {
        let ret = { 'op': BasilMessageOps.get('ForgetDisplayableObjectResp') };
        if (this._CheckAuth(req.auth)) {
            if (req.objectId) {
                let obj = BItem.GetItem(req.objectId.id);
                if (obj) {
                    BItem.ForgetItem(req.objectId.id);
                    // Remove all instances that point to this object.
                    try {
                        BItem.ForEachItem( bItem => {
                            if (bItem.itemType == BItemType.INSTANCE) {
                                if (bItem.displayable) {
                                    if (bItem.displayable.id == obj.id) {
                                        this._DeleteInstance(bItem);
                                    }
                                }
                            }
                        })
                    }
                    catch (e) {
                        GP.ErrorLog('BasilServer._ProcForgetDisplayableObject:'
                                + ' exception deleting instance of displayable: ' + e);
                    }
                    // Cleanup and remove this object.
                    obj.ReleaseResources();
                }
            }
        }
        else {
            ret['exception'] = this.MakeException('Not authorized');
        }
        return ret;
    }
    // Given an object with recieved parameters, do operation and return response object
    _ProcCreateObjectInstance(req) {
        // console.log('ProcCreateObjectInstance');
        let ret = { 'op': BasilMessageOps.get('CreateObjectInstanceResp') };
        if (this._CheckAuth(req.auth)) {
            if (req.objectId) {
                let baseDisplayable = BItem.GetItem(req.objectId.id);
                if (baseDisplayable) {
                    let instanceId = req.instanceId ? req.instanceId.id : CreateUniqueInstanceId();
                    let newInstance = InstanceFactory(instanceId, req.auth, baseDisplayable);
                    newInstance.ownerId = this.id;    // So we know who created what
                    if (req.pos) {
                        this.UpdatePositionInfo(newInstance, req.pos);
                    }
                    if (req.propertiesToSet) {
                        newInstance.SetProperties(req.propertiesToSet);
                    }
                    newInstance.PlaceInWorld();
                    ret['instanceId'] = { 'id': newInstance.id };
                }
                else {
                    ret['exception'] = this.MakeException('Displayable was not found: ' + req.objectId.id);
                }
            }
            else {
                ret['exception'] = this.MakeException('Displayable or position not specified');
            }
        }
        else {
            ret['exception'] = this.MakeException('Not authorized');
        }
        return ret;
    }
    _ProcDeleteObjectInstance(req) {
        let ret = { 'op': BasilMessageOps.get('DeleteObjectInstanceResp') };
        if (this._CheckAuth(req.auth)) {
            if (req.instanceId) {
                let inst = BItem.GetItem(req.instanceId.id);
                if (inst) {
                    // Forget the reference to the item.
                    this._DeleteInstance(inst);
                }
                else {
                    ret['exception'] = this.MakeException('Instance not found');
                }
            }
        }
        else {
            ret['exception'] = this.MakeException('Not authorized');
        }
        return ret;
    }
    _DeleteInstance(inst) {
        inst.SetShutdown();
        inst.RemoveFromWorld();
        inst.ReleaseResources();
        BItem.ForgetItem(inst);
    }
    _ProcUpdateObjectProperty(req) {
        // console.log('ProcUpdateObjectProperty');
        let ret = { 'op': BasilMessageOps.get('UpdateObjectPropertyResp') };
        if (this._CheckAuth(req.auth)) {
            if (req.objectId && req.properties) {
                let obj = BItem.GetItem(req.objectId.id);
                if (obj) {
                    obj.SetProperties(req.properties);
                }
                else {
                    ret['exception'] = this.MakeException('Object not found');
                }
            }
        }
        else {
            ret['exception'] = this.MakeException('Not authorized');
        }
        return ret;
    }
    _ProcUpdateInstanceProperty(req) {
        // console.log('ProcUpdateInstanceProperty');
        let ret = { 'op': BasilMessageOps.get('UpdateInstancePropertyResp') };
        if (this._CheckAuth(req.auth)) {
            if (req.instanceId && req.properties) {
                let obj = BItem.GetItem(req.instanceId.id);
                if (obj) {
                    obj.SetProperties(req.properties);
                }
                else {
                    ret['exception'] = this.MakeException('Object not found');
                }
            }
        }
        else {
            ret['exception'] = this.MakeException('Not authorized');
        }
        return ret;
    }
    _ProcUpdateInstancePosition(req) {
        // console.log('ProcUpdateInstancePosition');
        let ret = { 'op': BasilMessageOps.get('UpdateInstancePositionResp') };
        if (this._CheckAuth(req.auth)) {
            if (req.instanceId && req.pos) {
                let instance = BItem.GetItem(req.instanceId.id);
                if (instance) {
                    this.UpdatePositionInfo(instance, req.pos);
                }
            }
        }
        else {
            ret['exception'] = this.MakeException('Not authorized');
        }
        return ret;
    }
    _ProcRequestObjectProperties(req) {
        let ret = { 'op': BasilMessageOps.get('RequestObjectPropertiesResp') };
        if (this._CheckAuth(req.auth)) {
            if (req.objectId) {
                let filter = req.filter ? String(req.filter) : undefined;
                let obj = BItem.GetItem(req.objectId.id);
                if (obj) {
                    ret['properties'] =  this.CreatePropertyList(obj.FetchProperties(filter));
                }
                else {
                    ret['exception'] = this.MakeException('Object not found: ' + req.objectId.id);
                }
            }
        }
        else {
            ret['exception'] = this.MakeException('Not authorized');
        }
        return ret;
    }
    _ProcRequestInstanceProperties(req) {
        let ret = { 'op': BasilMessageOps.get('RequestInstancePropertiesResp') };
        if (this._CheckAuth(req.auth)) {
            if (req.instanceId) {
                let filter = req.filter ? String(req.filter) : undefined;
                let instance = BItem.GetItem(req.instanceId.id);
                if (instance) {
                    ret['properties'] = this.CreatePropertyList(instance.FetchProperties(filter));
                }
                else {
                    ret['exception'] = this.MakeException('Instance not found');
                }
            }
        }
        else {
            ret['exception'] = this.MakeException('Not authorized');
        }
        return ret;
    }
    _ProcCloseSession(req) {
        let ret = { 'op': BasilMessageOps.get('CloseSessionResp') };
        if (this._CheckAuth(req.auth)) {
            // TODO: close session
        }
        else {
            ret['exception'] = this.MakeException('Not authorized');
        }
        return ret;
    }
    // Someone is asking me to make a connection to another service
    _ProcMakeConnection(req) {
        let ret = { 'op': BasilMessageOps.get('MakeConnectionResp') };
        if (this._CheckAuth(req.auth)) {
            let params = CombineParameters(undefined, req.properties, {
                'transportURL': undefined,
                'transport': 'WS',
                'service': undefined,
                'serviceauth': undefined
            });
            GP.DebugLog('BasilServer.MakeConnection: props=' + JSONstringify(params));
            // if connecting to a SpaceServer, we are the client
            if (params['service'] == 'SpaceServer') {
                params['service'] = 'SpaceServerClient';
                params['Service'] = 'SpaceServerClient';
            }

            GP.CM.ConnectTransportAndService(params)
            .then( srv => {
                let auth = undefined;
                // A new service so new tokens to talk to me with
                srv.SetIncomingAuth(CreateToken('makeconn'));
                // This is the authorization info for making the initial call to the service
                if (params.serviceauth) {
                    auth = {
                        'accessProperties' : {
                            'SessionKey': CreateToken('session'),
                            'Auth': params.ServiceAuth,
                            'ClientAuth': srv.IncomingAuth
                        }
                    }
                }
                let props = {};
                srv.OpenSession(auth, props)
                .then( resp => {
                    GP.DebugLog('BasilServer.ProcMakeConnection: Session opened to SpaceServer. Params='
                                + JSONstringify(resp.properties));
                    // Copy the authorizations onto the service for later checking
                    srv.SetOutgoingAuth(resp.SessionAuth, resp.SessionAuthExpiration);
                    srv.SessionKey = resp.SessionKey;
                    srv.ConnectionKey = resp.ConnectionKey;
                    // TODO: response includes 'Services' which give access info for asset server
                })
                .catch( e => {
                    GP.ErrorLog('BasilServer.ProcMakeConnection: failed to open session: ' + e.message);
                    // NOTE: an exception cannot be returned as the response has been sent
                });
            })
            .catch (e => {
                GP.ErrorLog('BasilServer.ProcMakeConnection: failed connecting to transport/service' + e.message);
                // NOTE: an exception cannot be returned as the response has been sent
            });
        }
        else {
            ret['exception'] = this.MakeException('Not authorized');
        }
        return ret;
    }

    _CheckAuth(pAuth) {
        return true;
    }

    // Update an instance's position info based on a passed BasilType.InstancePostionInfo
    UpdatePositionInfo(instance, posInfo) {
        let coordPosition = posInfo.pos;  // get BasilType.CoordPosition
        if (coordPosition.pos) { instance.SetProperty('_Position', coordPosition.pos) }
        if (coordPosition.rot) { instance.SetProperty('_Rotation', coordPosition.rot) }
        if (coordPosition.posRef) { instance.SetProperty('_PosCoordSystem', coordPosition.posRef) }
        if (coordPosition.rotRef) { instance.SetProperty('_RotCoordSystem', coordPosition.rotRef) }
    };
}
