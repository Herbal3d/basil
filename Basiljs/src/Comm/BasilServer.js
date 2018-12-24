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
import { BasilSpaceStream } from "../jslibs/BasilServerMessages.js"

import { CreateUniqueId, CreateUniqueInstanceId, CombineParameters } from '../Utilities.js';
import { DisplayableFactory, InstanceFactory } from '../Items/Factories.js';

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
        this.RegisterMsgProcess(this.transport, /*    sends */ BasilSpaceStream.SpaceStreamMessage,
                                                /* receives */ BasilSpaceStream.BasilStreamMessage, {
            'IdentifyDisplayableObjectReqMsg': [ this._ProcIdentifyDisplayableObject.bind(this), 'IdentifyDisplayableObjectRespMsg' ],
            'ForgetDisplayableObjectReqMsg': [ this._ProcForgetDisplayableObject.bind(this), 'ForgetDisplayableObjectRespMsg' ],
            'CreateObjectInstanceReqMsg': [ this._ProcCreateObjectInstance.bind(this), 'CreateObjectInstanceRespMsg' ],
            'DeleteObjectInstanceReqMsg': [ this._ProcDeleteObjectInstance.bind(this), 'DeleteObjectInstanceRespMsg' ],
            'UpdateObjectPropertyReqMsg': [ this._ProcUpdateObjectProperty.bind(this), 'UpdateObjectPropertyRespMsg' ],
            'UpdateInstancePropertyReqMsg': [ this._ProcUpdateInstanceProperty.bind(this), 'UpdateInstancePropertyRespMsg' ],
            'UpdateInstancePositionReqMsg': [ this._ProcUpdateInstancePosition.bind(this), 'UpdateInstancePositionRespMsg' ],
            'RequestObjectPropertiesReqMsg': [ this._ProcRequestObjectProperties.bind(this), 'RequestObjectPropertiesRespMsg' ],
            'RequestInstancePropertiesReqMsg': [ this._ProcRequestInstanceProperties.bind(this), 'RequestInstancePropertiesRespMsg' ],
            'CloseSessionReqMsg': [ this._ProcCloseSession.bind(this), 'CloseSessionRespMsg' ],
            'MakeConnectionReqMsg': [ this._ProcMakeConnection.bind(this), 'MakeConnectionRespMsg' ],
        });
    }
    Start() {
    }
    Close() {
        if (this.transport) {
            this.transport.Close(); // also clears receiveCallback
            this.transport = undefined;
        }
    }

    _ProcIdentifyDisplayableObject(req) {
        let ret = undefined;
        if (req.assetInfo) {
          let id = req.assetInfo.id ? req.assetInfo.id : CreateUniqueId('remote');
          let newItem = DisplayableFactory(id, req.auth, req.assetInfo.displayInfo);
          if (newItem) {
            newItem.ownerId = this.id;    // So we know who created what
            ret = {
                'objectId': {
                  'id': newItem.GetProperty('Id')
                }
            };
          }
          else {
            ret = BasilServiceConnection.MakeException('Could not create object');
          }
        }
        else {
          ret = BasilServiceConnection.MakeException('No assetInfo specified');
        }
        return ret;
    }
    _ProcForgetDisplayableObject(req) {
        let ret = {};
        if (req.objectId && req.objectId.id) {
          BItem.ForgetItem(req.objectId.id);
        }
        return ret;
    }
    // Given an object with recieved parameters, do operation and return response object
    _ProcCreateObjectInstance(req) {
        let ret = undefined;
        if (req.objectId) {
          let baseDisplayable = BItem.GetItem(req.objectId.id);
          if (baseDisplayable) {
            let instanceId = req.instanceId ? req.instanceId.id : CreateUniqueInstanceId();
            let newInstance = InstanceFactory(instanceId, req.auth, baseDisplayable);
            newInstance.ownerId = this.id;    // So we know who created what
            if (req.pos) {
                BasilServiceConnection.UpdatePositionInfo(newInstance, req.pos);
            }
            if (req.propertiesToSet) {
              newInstance.SetProperties(req.propertiesToSet);
            }
            baseDisplayable.graphics.PlaceInWorld(newInstance);
            ret = {
              'instanceId': {
                'id': newInstance.id
              }
            };
          }
          else {
            ret = BasilServiceConnection.MakeException('Displayable was not found: ' + req.objectId.id);
          }
        }
        else {
          ret = BasilSErver.MakeException('Displayable or position not specified');
        }
        return ret;
    }
    _ProcDeleteObjectInstance(req) {
        if (req.objectId) {
          BItem.ForgetItem(req.objectId.id);
        }
        return {
        };
    }
    _ProcUpdateObjectProperty(req) {
        let ret = {};
        if (req.objectId && req.props) {
          let obj = BItem.GetItem(req.objectId.id);
          if (obj) {
            obj.SetProperties(req.props);
          }
          else {
            ret = BasilServiceConnection.MakeException('Object not found');
          }
        }
        return ret;
    }
    _ProcUpdateInstanceProperty(req) {
        let ret = {};
        if (req.instanceId && req.props) {
          let obj = BItem.GetItem(req.instanceId.id);
          if (obj) {
            obj.SetProperties(req.props);
          }
          else {
            ret = BasilServiceConnection.MakeException('Object not found');
          }
        }
        return ret;
    }
    _ProcUpdateInstancePosition(req) {
      if (req.instanceId && req.pos) {
        let instance = BItem.GetItem(req.instanceId.id);
        if (instance) {
          BasilServiceConnection.UpdatePositionInfo(instance, req.pos);
        }
      }
      return {};
    }
    _ProcRequestObjectProperties(req) {
      let ret = {};
      if (req.objectId) {
        let filter = req.propertyMatch ? String(req.propertyMatch) : undefined;
        let obj = BItem.GetItem(req.objectId.id);
        if (obj) {
          ret = { 'properties': BasilServiceConnection.CreatePropertyList(obj.FetchProperties(filter)) };
        }
        else {
          ret = BasilServiceConnection.MakeException('Object not found: ' + req.objectId.id);
        }
        return ret;
      };
    }
    _ProcRequestInstanceProperties(req) {
      let ret = {};
      if (req.instanceId) {
        let filter = req.propertyMatch ? String(req.propertyMatch) : undefined;
        let instance = BItem.GetItem(req.instanceId.id);
        if (instance) {
          ret = { 'properties': BasilServiceConnection.CreatePropertyList(instance.FetchProperties(filter)) };
        }
        else {
          ret = BasilServiceConnection.MakeException('Instance not found: ' + req.instanceId.id);
        }
        return ret;
      };
    }
    _ProcCloseSession(req) {
        return {
        };
    }
    _ProcMakeConnection(req) {
        return {
        };
    }

    // Create an exception object
    static MakeException(reason, hints) {
      let except = { 'exception': {} };
      if (reason) { except.exception.reason = reason; }
      if (hints) { except.exception.hints = hints; }
      return except;
    };

    // Update an instance's position info based on a passed BasilType.InstancePostionInfo
    static UpdatePositionInfo(instance, posInfo) {
      let coordPosition = posInfo.pos;  // get BasilType.CoordPosition
      if (coordPosition.pos) { instance.SetProperty('Position', coordPosition.pos) }
      if (coordPosition.rot) { instance.SetProperty('Rotation', coordPosition.rot) }
      if (coordPosition.posRef) { instance.SetProperty('PosCoordSystem', coordPosition.posRef) }
      if (coordPosition.rotRef) { instance.SetProperty('RotCoordSystem', coordPosition.rotRef) }
    };

    // Create a well formed property list from an object. Values must be strings in the output.
    // Note the check for 'undefined'. Property lists cannot have undefined values.
    static CreatePropertyList(obj) {
      let list = {};
      Object.keys(obj).forEach(prop => {
        let val = obj[prop];
        if (typeof(val) != 'undefined') {
          if (typeof(val) != 'string') {
            val = JSON.stringify(val);
          }
          list[prop] = val;
        }
      });
      return list;
    };
}
