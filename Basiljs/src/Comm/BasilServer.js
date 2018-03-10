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

var BS = BS || {};
GP.BS = BS;

// All of the servers that have been connected
BS.servers = {};

// The browser is the Basil server so requests are sent to us
export class BasilServiceConnection  {
    // @param serverID a unique ID for accessing this server instance
    // @param transp BTransport instance to talk over
    // @param parms a map of extra parameters for this service
    constructor(serverID, transp, parms) {
        this.ID = serverID;
        this.transport = transp;
        this.aliveReplySerquenceNum = 2000;
        this.serverID = undefined;
        // templates = [BasilServerMessage_entry_name, message_processor, BasilServerMessage_reply_name]
        this.receptionMessages = [
            [ 'IdentifyDisplayableObjectReqMsg', this.procIdentifyDisplayableObject, 'IdentifyDisplayableObjectRespMsg'],
            [ 'ForgetDisplayableObjectReqMsg', this.procForgetDisplayableObject, 'ForgetDisplayableObjectRespMsg'],
            [ 'CreateObjectInstanceReqMsg', this.procCreateObjectInstance, 'CreateObjectInstanceRespMsg'],
            [ 'DeleteObjectInstanceReqMsg', this.procDeleteObjectInstance, 'DeleteObjectInstanceRespMsg'],
            [ 'UpdateObjectPropertyReqMsg', this.procUpdateObjectProperty, 'UpdateObjectPropertyRespMsg'],
            [ 'UpdateInstancePropertyReqMsg', this.procUpdateInstanceProperty, 'UpdateInstancePropertyRespMsg'],
            [ 'UpdateInstancePositionReqMsg', this.procUpdateInstancePosition, 'UpdateInstancePositionRespMsg'],
            [ 'RequestObjectPropertiesReqMsg', this.procRequestObjectProperties, 'RequestObjectPropertiesRespMsg'],
            [ 'RequestInstancePropertiesReqMsg', this.procRequestInstanceProperties, 'RequestInstancePropertiesRespMsg'],
            [ 'OpenSessionReqMsg', this.procOpenSession, 'OpenSessionRespMsg'],
            [ 'CloseSessionReqMsg', this.procCloseSession, 'CloseSessionRespMsg'],
            [ 'AliveCheckReqMsg', this.procAliveCheck, 'AliveCheckRespMsg'],
            [ 'AliveCheckRespMsg', this.procAliveCheckResp, undefined]
        ];
    }
    Start() {
        if (this.transport) {
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
        if (this.transport) {
            // the Buffer should be a BasilServerMessage
            try {
                let msg = BasilServerMsgs.BasilServerMessage.decode(buff);
                GP.DebugLog('BasilServer: procMessage: ' + JSON.stringify(msg));
                let replyContents = undefined;
                for (const template of this.receptionMessages) {
                    if (msg.hasOwnProperty(template[0])) {
                        replyContents = template[1](msg[template[0]]);
                        if (replyContents != undefined && template[2] !== undefined) {
                            let rmsg = {};
                            rmsg[template[0]] = replyContents;
                            let reply = BasilServerMsgs.BasilServerMessage.create(rmsg);
                            this.transport.Send(BasilServerMsgs.BasilServerMessage.encode(reply).finish(), tcontext);
                        }
                        break;
                    }
                }
                if (replyContents === undefined) {
                    GP.DebugLog('BasilServer: did not process message in :' + JSON.stringify(msg));
                }
            }
            catch(e) {
                GP.DebugLog('BasilServer: exception processing msg: ' + e);
            }
        }
    }
    procIdentifyDisplayableObject(req) {
        return {
            'success': 1,
        };
    }
    procForgetDisplayableObject(req) {
        return {
            'success': 1,
        };
    }
    // Given an object with recieved parameters, do operation and return response object
    procCreateObjectInstance(req) {
        return {
            'success': 1,
            'createdInstanceId': 122334
        };
    }
    procDeleteObjectInstance(req) {
        return {
            'success': 1,
        };
    }
    procUpdateObjectProperty(req) {
        return {
            'success': 1
        };
    }
    procUpdateInstanceProperty(req) {
        return {
            'success': 1
        };
    }
    procUpdateInstancePosition(req) {
        return {
            'success': 1
        };
    }
    procRequestObjectProperties(req) {
        return {
            'success': 1,
            'properties': {
                'ObjectHere': 'frog',
                'ObjectThere': 'frog2'
            }
        };
    }
    procRequestInstanceProperties(req) {
        return {
            'success': 1,
            'properties': {
                'InstanceHere': 'frog',
                'InstanceThere': 'frog2'
            }
        };
    }
    procOpenSession(req) {
        return {
            'success': 1,
            'features': {
                'creepy': 'no',
                'wow': '44'
            }
        };
    }
    procCloseSession(req) {
        return {
            'success': 1
        };
    }
    procAliveCheck(req) {
        return {
            'time': Date.now(),
            'sequenceNum': this.aliveReplySerquenceNum++,
            'timeReceived': req.time,
            'sequenceNumReceived': req.sequenceNum
        };
    }
    procAliveCheckResp(req) {
        // Match response with sent alive check
        return {
        };
    }

    get stats() {
        return {

        }
    }

}

// Create a new server connection and return same
// Returns a BasilServiceConnection or undefined if an error.
export function NewBasilServerConnection(serverID, transport, parms) {
    if (BS.servers[serverID] != undefined) {
        GP.DebugLog('BasilServer: Not creating service. Existing ID:' + serverID);
        return undefined;
    }
    let newConnection = new BasilServiceConnection(serverID, transport, parms);
    BS.servers[serverID] = newConnection;
    newConnection.serverID = serverID;
    newConnection.Start();
    GP.DebugLog('BasilServer: created new service connection for ID ' + serverID);
    return newConnection;
}

export function GetProperties(filter) {

}
