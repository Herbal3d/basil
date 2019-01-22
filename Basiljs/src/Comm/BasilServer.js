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
        let processors = {};
        processors[BasilMessageOps['IdentifyDisplayableObjectReq']] = this._ProcIdentifyDisplayableObject.bind(this);
        processors[BasilMessageOps['ForgetDisplayableObjectReq']] = this._ProcForgetDisplayableObject.bind(this);
        processors[BasilMessageOps['CreateObjectInstanceReq']] = this._ProcCreateObjectInstance.bind(this);
        processors[BasilMessageOps['DeleteObjectInstanceReq']] = this._ProcDeleteObjectInstance.bind(this);
        processors[BasilMessageOps['UpdateObjectPropertyReq']] = this._ProcUpdateObjectProperty.bind(this);
        processors[BasilMessageOps['UpdateInstancePropertyReq']] = this._ProcUpdateInstanceProperty.bind(this);
        processors[BasilMessageOps['UpdateInstancePositionReq']] = this._ProcUpdateInstancePosition.bind(this);
        processors[BasilMessageOps['RequestObjectPropertiesReq']] = this._ProcRequestObjectProperties.bind(this);
        processors[BasilMessageOps['RequestInstancePropertiesReq']] = this._ProcRequestInstanceProperties.bind(this);
        processors[BasilMessageOps['CloseSessionReq']] = this._ProcCloseSession.bind(this);
        processors[BasilMessageOps['MakeConnectionReq']] = this._ProcMakeConnection.bind(this);
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
        let ret = { 'op': BasilMessageOps['IdentifyDisplayableObjectResp'] };
        if (req.assetInfo) {
          let id = req.assetInfo.id ? req.assetInfo.id : CreateUniqueId('remote');
          let newItem = DisplayableFactory(id, req.auth, req.assetInfo.displayInfo);
          if (newItem) {
            newItem.ownerId = this.id;    // So we know who created what
            ret['objectId'] = { 'id': newItem.GetProperty('Id') };
          }
          else {
            ret['exception'] = this.MakeException('Could not create object');
          }
        }
        else {
          ret['exception'] = this.MakeException('No assetInfo specified');
        }
        return ret;
    }
    _ProcForgetDisplayableObject(req) {
        let ret = { 'op': BasilMessageOps['ForgetDisplayableObjectResp'] };
        if (req.objectId && req.objectId.id) {
          BItem.ForgetItem(req.objectId.id);
        }
        return ret;
    }
    // Given an object with recieved parameters, do operation and return response object
    _ProcCreateObjectInstance(req) {
        let ret = { 'op': BasilMessageOps['CreateObjectInstanceResp'] };
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
            baseDisplayable.graphics.PlaceInWorld(newInstance);
            ret['instanceId'] = { 'id': newInstance.id };
          }
          else {
            ret['exception'] = this.MakeException('Displayable was not found: ' + req.objectId.id);
          }
        }
        else {
          ret['exception'] = BasilSErver.MakeException('Displayable or position not specified');
        }
        return ret;
    }
    _ProcDeleteObjectInstance(req) {
        let ret = { 'op': BasilMessageOps['DeleteObjectInstanceResp'] };
        if (req.objectId) {
          BItem.ForgetItem(req.objectId.id);
        }
        return ret;
    }
    _ProcUpdateObjectProperty(req) {
        let ret = { 'op': BasilMessageOps['UpdateObjectPropertyResp'] };
        if (req.objectId && req.properties) {
          let obj = BItem.GetItem(req.objectId.id);
          if (obj) {
            obj.SetProperties(req.properties);
          }
          else {
            ret['exception'] = this.MakeException('Object not found');
          }
        }
        return ret;
    }
    _ProcUpdateInstanceProperty(req) {
        let ret = { 'op': BasilMessageOps['UpdateInstancePropertyResp'] };
        if (req.instanceId && req.properties) {
          let obj = BItem.GetItem(req.instanceId.id);
          if (obj) {
            obj.SetProperties(req.properties);
          }
          else {
            ret['exception'] = this.MakeException('Object not found');
          }
        }
        return ret;
    }
    _ProcUpdateInstancePosition(req) {
      let ret = { 'op': BasilMessageOps['UpdateInstancePositionResp'] };
      if (req.instanceId && req.pos) {
        let instance = BItem.GetItem(req.instanceId.id);
        if (instance) {
          this.UpdatePositionInfo(instance, req.pos);
        }
      }
      return ret;
    }
    _ProcRequestObjectProperties(req) {
      let ret = { 'op': BasilMessageOps['RequestObjectPropertiesResp'] };
      if (req.objectId) {
        let filter = req.propertyMatch ? String(req.propertyMatch) : undefined;
        let obj = BItem.GetItem(req.objectId.id);
        if (obj) {
          ret['properties'] =  this.CreatePropertyList(obj.FetchProperties(filter));
        }
        else {
          ret['exception'] = this.MakeException('Object not found: ' + req.objectId.id);
        }
        return ret;
      };
    }
    _ProcRequestInstanceProperties(req) {
      let ret = { 'op': BasilMessageOps['RequestInstancePropertiesResp'] };
      if (req.instanceId) {
        let filter = req.propertyMatch ? String(req.propertyMatch) : undefined;
        let instance = BItem.GetItem(req.instanceId.id);
        if (instance) {
          ret['properties'] = this.CreatePropertyList(instance.FetchProperties(filter));
        }
        else {
          ret = this.MakeException('Instance not found: ' + req.instanceId.id);
        }
        return ret;
      };
    }
    _ProcCloseSession(req) {
        let ret = { 'op': BasilMessageOps['CloseSessionResp'] };
        return ret;
    }
    _ProcMakeConnection(req) {
        let ret = { 'op': BasilMessageOps['MakeConnectionResp'] };
        return ret;
    }

    // Update an instance's position info based on a passed BasilType.InstancePostionInfo
    UpdatePositionInfo(instance, posInfo) {
      let coordPosition = posInfo.pos;  // get BasilType.CoordPosition
      if (coordPosition.pos) { instance.SetProperty('Position', coordPosition.pos) }
      if (coordPosition.rot) { instance.SetProperty('Rotation', coordPosition.rot) }
      if (coordPosition.posRef) { instance.SetProperty('PosCoordSystem', coordPosition.posRef) }
      if (coordPosition.rotRef) { instance.SetProperty('RotCoordSystem', coordPosition.rotRef) }
    };
}
