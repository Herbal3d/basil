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
import { BItem, BItemType } from 'xBItem';

import { flatbuffers } from 'xFlatbuffers';
import { FBConv } from 'xFBConverters';
import { org.herbal3d.protocol.basil as BTypes } from 'xBasilTypes';
import { org.herbal3d.protocol.basil.server as BServer } from 'xBasilServer';

import { CreateUniqueId, CreateUniqueInstanceId } from 'xUtilities';
import { DisplayableFactory, InstanceFactory } from 'xFactories';

// The browser is the Basil server so requests are sent to us
export class BasilServer  extends BItem {
    // @param serverId a unique Id for accessing this server instance
    // @param transp BTransport instance to talk over
    // @param parms a map of extra parameters for this service
  constructor(serverId, transp, parms) {
    super(serverId, parms.serviceAuth, BItemType.SERVICE);
    this.transport = transp;
    this.aliveReplySequenceNum = 2000;
    this.sessionId = undefined;

    // templates = [BasilServerMessage_entry_name, message_processor, BasilServerMessage_reply_name]
    //      If the _reply_name is 'undefined', then the message doesn't expect a response.
    this.messageProcessors = {
        'IdentifyDisplayableObjectReq': this.procIdentifyDisplayableObject.bind(this),
        'ForgetDisplayableObjectReq': this.procForgetDisplayableObject.bind(this),
        'CreateObjectInstanceReq': this.procCreateObjectInstance.bind(this),
        'DeleteObjectInstanceReq': this.procDeleteObjectInstance.bind(this),
        'UpdateObjectPropertyReq': this.procUpdateObjectProperty.bind(this),
        'UpdateInstancePropertyReq': this.procUpdateInstanceProperty.bind(this),
        'UpdateInstancePositionReq': this.procUpdateInstancePosition.bind(this),
        'RequestObjectPropertiesReq': this.procRequestObjectProperties.bind(this),
        'RequestInstancePropertiesReq': this.procRequestInstanceProperties.bind(this),
        'OpenSessionReq': this.procOpenSession.bind(this),
        'CloseSessionReq': this.procCloseSession.bind(this),
        'MakeConnectionReq': this.procMakeConnection.bind(this),
        'AliveCheckReq': this.procAliveCheck.bind(this),
        'AliveCheckResp': this.procAliveCheckResp.bind(this)
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
  // @param transportMsg a flatbuffer handle to a bTransportMsg
  procMessage(transportMsg) {
    if (this.transport) {
      // the Buffer should be a BasilServerMessage
      try {
        // The msgType number indexes the message name which give up the processor
        let messageTypeName = BMessage.ServerMessage[transportMsg.msgType()];
        let processor = this.messageProcessors[messageTypeName];
        // Start a message buffer builder for any response to send back
        let fbb = new flatbuffers.Builder();
        // Add a tag on the builder that will hold the type of message built.
        fbb.replyMsgType = BMessage.ServerMessage.NONE;

        let replyMsgOffset = processor(transportMsg, fbb);
        if (Config.Debug && Config.Debug.BasilServerProcMessageDetail) {
          GP.DebugLog('BasilServer.procMessage:'
               + ' prop=' + messageTypeName
               + ', rec=' + JSON.stringify(transportMsg.msg())
               + ', reply=' + JSON.stringify(replyMsg)
          );
        }
        if (fbb.replyMsgType != BMessage.ServerMessage.NONE) {
          // Generate a reply.
          // The information from the received BResponseRequest is returned
          //     so the receiver can match the call with the response.
          let receivedSession = transportMsg.responseSession();
          if (receivedRequest) {
            this.transport.Send(fbb, replyMsgOffset, fbb.replyMsgType, respOffset);
          }
          else {
            // If the incoming request didn't have a session number, just return message.
            this.transport.Send(fbb, replyMsgOffset, fbb.replyMsgType);
          }
        }
      }
      catch(e) {
         GP.DebugLog('BasilServer: exception processing msg: ' + e);
      }
    }
  }

    procIdentifyDisplayableObject(buff) {
      let msg = buff.msg(new BServer.IdentifyDisplayableObject());


        let ret = undefined;
        if (req.assetInfo) {
          let id = req.assetInfo.id ? req.assetInfo.id : CreateUniqueId('remote');
          let newItem = DisplayableFactory(id, req.auth, req.assetInfo.displayInfo);
          if (newItem) {
            newItem.ownerId = this.id;    // So we know who created what
            ret = {
                'identifier': {
                  'id': newItem.GetProperty('Id')
                }
            };
          }
          else {
            ret = BasilServer.MakeException('Could not create object');
          }
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
        if (req.identifier) {
          let baseDisplayable = BItem.GetItem(req.identifier.id);
          if (baseDisplayable) {
            let instanceId = CreateUniqueInstanceId();
            let newInstance = InstanceFactory(instanceId, req.auth, baseDisplayable);
            newInstance.ownerId = this.id;    // So we know who created what
            if (req.pos) {
                BasilServer.UpdatePositionInfo(newInstance, req.pos);
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
          BItem.ForgetItem(req.identifier.id);
        }
        return {
        };
    }
    procUpdateObjectProperty(req) {
        let ret = {};
        if (req.identifier && req.props) {
          let obj = BItem.GetItem(req.identifier.id);
          if (obj) {
            obj.SetProperties(req.props);
          }
          else {
            ret = BasilServer.MakeException('Object not found');
          }
        }
        return ret;
    }
    procUpdateInstanceProperty(req) {
        let ret = {};
        if (req.instanceId && req.props) {
          let obj = BItem.GetItem(req.instanceId.id);
          if (obj) {
            obj.SetProperties(req.props);
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
      let ret = {};
      if (req.identifier) {
        let filter = req.propertyMatch ? String(req.propertyMatch) : undefined;
        let obj = BItem.GetItem(req.identifier.id);
        if (obj) {
          ret = { 'properties': BasilServer.CreatePropertyList(obj.FetchProperties(filter)) };
        }
        else {
          ret = BasilServer.MakeException('Object not found: ' + req.identifier.id);
        }
        return ret;
      };
    }
    procRequestInstanceProperties(req) {
      let ret = {};
      if (req.instanceId) {
        let filter = req.propertyMatch ? String(req.propertyMatch) : undefined;
        let instance = BItem.GetItem(req.instanceId.id);
        if (instance) {
          ret = { 'properties': BasilServer.CreatePropertyList(instance.FetchProperties(filter)) };
        }
        else {
          ret = BasilServer.MakeException('Instance not found: ' + req.instanceId.id);
        }
        return ret;
      };
    }
    procOpenSession(req) {
        return {
            'properties': {
                'creepy': 'no',
                'wow': '44'
            }
        };
    }
    procCloseSession(req) {
        return {
        };
    }
    procMakeConnection(req) {
        return {
        };
    }
    procAliveCheck(req) {
        return {
            'time': Date.now(),
            'sequenceNum': this.aliveReplySequenceNum++,
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
      let coordPosition = posInfo.pos;  // get BasilType.CoordPosition
      if (coordPosition.pos) { instance.SetProperty('Position', coordPosition.pos) }
      if (coordPosition.rot) { instance.SetProperty('Rotation', coordPosition.rot) }
      if (coordPosition.posRef) { instance.SetProperty('PosCoordSystem', coordPosition.posRef) }
      if (coordPosition.rotRef) { instance.SetProperty('RotCoordSystem', coordPosition.rotRef) }
    };

    // Create a property list from an object. Values must be strings in the output.
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
