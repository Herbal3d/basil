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

import Config from 'xConfig';
import { BasilServer as BasilServerMsgs } from "xBasilServerMessages"
import { BItem } from 'xBItem';

import { CreateUniqueId, CreateUniqueInstanceId } from 'xUtilities';
import { Displayable, DisplayableInstance } from 'xDisplayable';

var BS = BS || {};
GP.BS = BS;

// All of the servers that have been connected
BS.servers = {};

// The browser is the Basil server so requests are sent to us
export class BasilServiceConnection  extends BItem {
    // @param serverId a unique Id for accessing this server instance
    // @param transp BTransport instance to talk over
    // @param parms a map of extra parameters for this service
    constructor(serverId, transp, parms) {
        super(serverId, parms.serviceAuth);
        this.transport = transp;
        this.aliveReplySequenceNum = 2000;
        // templates = [BasilServerMessage_entry_name, message_processor, BasilServerMessage_reply_name]
        //      If the _reply_name is 'undefined', then the message doesn't expect a response.
        this.receptionMessages2 = {
            'IdentifyDisplayableObjectReqMsg': [ this.procIdentifyDisplayableObject, 'IdentifyDisplayableObjectRespMsg' ],
            'ForgetDisplayableObjectReqMsg': [ this.procForgetDisplayableObject, 'ForgetDisplayableObjectRespMsg' ],
            'CreateObjectInstanceReqMsg': [ this.procCreateObjectInstance, 'CreateObjectInstanceRespMsg' ],
            'DeleteObjectInstanceReqMsg': [ this.procDeleteObjectInstance, 'DeleteObjectInstanceRespMsg' ],
            'UpdateObjectPropertyReqMsg': [ this.procUpdateObjectProperty, 'UpdateObjectPropertyRespMsg' ],
            'UpdateInstancePropertyReqMsg': [ this.procUpdateInstanceProperty, 'UpdateInstancePropertyRespMsg' ],
            'UpdateInstancePositionReqMsg': [ this.procUpdateInstancePosition, 'UpdateInstancePositionRespMsg' ],
            'RequestObjectPropertiesReqMsg': [ this.procRequestObjectProperties, 'RequestObjectPropertiesRespMsg' ],
            'RequestInstancePropertiesReqMsg': [ this.procRequestInstanceProperties, 'RequestInstancePropertiesRespMsg' ],
            'OpenSessionReqMsg': [ this.procOpenSession, 'OpenSessionRespMsg' ],
            'CloseSessionReqMsg': [ this.procCloseSession, 'CloseSessionRespMsg' ],
            'AliveCheckReqMsg': [ this.procAliveCheck, 'AliveCheckRespMsg' ],
            'AliveCheckRespMsg': [ this.procAliveCheckResp, undefined ]
        };
    }
    Start() {
        if (this.transport) {
            // the recieve callback will call 'procMessage'.
            this.transport.SetReceiveCallbackObject(this);
        }
    }
    Close() {
        if (this.transport) {
            this.transport.Close(); // also clears receiveCallback
            this.transport = undefined;
        }
    }

    // Process message received by BTransport
    // @param buff raw bytes of the message that was transported
    // @param tcontext transport context. Could be undefined but, if present, used for RPC
    procMessage(buff, tcontext) {
        let newWay = 1;
        if (this.transport) {
            // the Buffer should be a BasilServerMessage
            try {
                let msg = BasilServerMsgs.BasilServerMessage.decode(buff);
                GP.DebugLog('BasilServer: procMessage: ' + JSON.stringify(msg));
                let replyContents = undefined;
                // The message will have one or more message names with that message type
                let msgProps = Object.getOwnPropertyNames(msg);
                if (msgProps !== undefined && msgProps.length > 0) {
                  msgProps.forEach( msgProp => {
                    let template = this.receptionMessages2[msgProp];
                    try {
                      replyContents = template[0].bind(this, msg[msgProp]);
                    }
                    catch (e) {
                      replyContents = BasilServer.MakeException('Exception processing: ' + e);
                    }
                    // GP.DebugLog('BasilServer.procMessage:'
                    //         + ' prop=' + msgProp
                    //         + ', rec=' + JSON.stringify(msg[msgProp])
                    //         + ', reply=' + JSON.stringify(replyContents)
                    //     );
                    if (replyContents !== undefined && template[1] !== undefined) {
                        // The message requires a response
                        let rmsg = {};
                        rmsg[template[1]] = replyContents;
                        let reply = BasilServerMsgs.BasilServerMessage.create(rmsg);
                        // Passing 'tcontext' gives the required info for creating the response header
                        this.transport.Send(BasilServerMsgs.BasilServerMessage.encode(reply).finish(), tcontext);
                    }
                  });
                }
                else {
                    GP.DebugLog('BasilServer.procMessage: odd msg props: len=' + msgProps.length);
                }
            }
            catch(e) {
                GP.DebugLog('BasilServer: exception processing msg: ' + e);
            }
        }
    }

    procIdentifyDisplayableObject(req) {
        let ret = undefined;
        if (req.assetInfo) {
          let newItem = new Displayable(req.auth, req.assetInfo);
          ret = {
              'identifier': {
                'id': newItem.Id;
              }
          };
        }
        else {
          ret = BasilServer.MakeException('No assetInfo specified');
        }
        return ret;
    }
    procForgetDisplayableObject(req) {
        let ret = {};
        if (req.identifier && req.identifier.id) {
          BItem.ForgetItem(req.identifier.id);
        }
        return ret;
    }
    // Given an object with recieved parameters, do operation and return response object
    procCreateObjectInstance(req) {
        let ret = undefined;
        if (req.identifier && req.pos) {
          let baseDisplayable = BItem.GetItem(req.identifier.id);
          if (baseDisplayable) {
            let instanceId = CreateUniqueInstanceId();
            let newInstance = new DisplayableInstance(instanceId, req.auth, baseDisplayable);
            BasilServer.UpdatePosInfo(newInstance, req.pos);
            if (req.propertiesToSet) {
              newInstance.SetProperties(req.propertiesToSet.list);
            }
            ret = {
              'createdInstanceId': {
                'id': newInstance.id;
              }
            };
          }
          else {
            ret = BasilServer.MakeException('Displayable was not found: ' + req.identifier.id);
          }
        }
        else {
          ret = BasilSErver.MakeException('Displayable or position not specified');
        }
        return ret;
    }
    procDeleteObjectInstance(req) {
        if (req.identifier) {
          BItem.ForgetItem(req.identifier.id);)
        }
        return {
        };
    }
    procUpdateObjectProperty(req) {
        let ret = {};
        if (req.identifier && req.props) {
          let obj = BItem.GetItem(req.identifier.id);
          if (obj) {
            obj.SetProperties(req.props.list);
          }
          else {
            ret = BasilServer.MakeException('Object not found');
          }
        }
        return ret;
    }
    procUpdateInstanceProperty(req) {
        let ret = {};
        if (req.identifier && req.props) {
          let obj = BItem.GetItem(req.identifier.id);
          if (obj) {
            obj.SetProperties(req.props.list);
          }
          else {
            ret = BasilServer.MakeException('Object not found');
          }
        }
        return ret;
    }
    procUpdateInstancePosition(req) {
      if (req.instanceId && req.pos) {
        let instance = BItem.GetItem(req.instanceId.id);
        if (instance) {
          BasilServer.UpdatePositionInfo(instance, req.pos);
        }
      }
      return {};
    }
    procRequestObjectProperties(req) {
      ret = {};
      if (req.identifier) {
        let filter = req.propertyMatch ? String(req.propertyMatch) : undefined;
        let obj = BItem.GetItem(req.identifier.id);
        if (obj) {
          let props = obj.GetProperties(filter);
          ret = { 'properties': {} };
          ret.properties.list = props;
        }
        else {
          ret = BasilServer.MakeException('Object not found: ' + req.identifier.id);
        }
        return ret;
      };
    }
    procRequestInstanceProperties(req) {
      ret = {};
      if (req.instanceId) {
        let filter = req.propertyMatch ? String(req.propertyMatch) : undefined;
        let instance = BItem.GetItem(req.instanceId.id);
        if (instance) {
          let props = instance.GetProperties(filter);
          ret = { 'properties': {} };
          ret.properties.list = props;
        }
        else {
          ret = BasilServer.MakeException('Instance not found: ' + req.identifier.id);
        }
        return ret;
      };
    }
    procOpenSession(req) {
        return {
            'features': {
              'list': {
                'creepy': 'no',
                'wow': '44'
              }
            }
        };
    }
    procCloseSession(req) {
        return {
        };
    }
    procAliveCheck(req) {
        return {
            'time': Date.now(),
            'sequenceNum': tthis.aliveReplySequenceNum++,
            'timeReceived': req['time'],
            'sequenceNumReceived': req['sequenceNum']
        };
    };
    procAliveCheckResp(req) {
        // Match response with sent alive check
        return {
        };
    };

    // Create an exception object
    static MakeException(reason, hints) {
      let except = { 'exception': {} };
      if (reason) {
        except.exception.reason = reason;
      }
      if (hints) {
        except.exception.hints = hints;
      }
      return except;
    };

    // Update an instance's position info based on a passed BasilType.InstancePostionInfo
    static UpdatePositionInfo(instance, posInfo) {
      if (posInfo.pos) { instance.SetProperty('Position', req.pos.pos) }
      if (posInfo.rot) { instance.SetProperty('Rotation', req.pos.rot) }
      if (posInfo.posRef) { instance.SetProperty('PosCoordSystem', req.pos.posRef) }
      if (posInfo.rotRef) { instance.SetProperty('RotCoordSystem', req.pos.rotRef) }
    };
}

// Create a new server connection and return same
// Returns a BasilServiceConnection or undefined if an error.
export function NewBasilServerConnection(serverId, transport, parms) {
    if (BS.servers[serverId] != undefined) {
        GP.DebugLog('BasilServer: Not creating service. Existing Id:' + serverId);
        return undefined;
    }
    let newConnection = new BasilServiceConnection(serverId, transport, parms);
    BS.servers[serverId] = newConnection;
    newConnection.serverId = serverId;
    newConnection.Start();
    GP.DebugLog('BasilServer: created new service connection for Id ' + serverId);
    return newConnection;
}

export function GetProperties(filter) {

}
