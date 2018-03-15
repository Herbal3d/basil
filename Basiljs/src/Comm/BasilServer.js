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

var BS = BS || {};
GP.BS = BS;

// All of the servers that have been connected
BS.servers = {};

// The browser is the Basil server so requests are sent to us
export class BasilServiceConnection  extends BItem {
    // @param serverID a unique ID for accessing this server instance
    // @param transp BTransport instance to talk over
    // @param parms a map of extra parameters for this service
    constructor(serverID, transp, parms) {
        super(parms);
        this.ID = serverID;
        this.transport = transp;
        this.aliveReplySequenceNum = 2000;
        this.serverID = undefined;
        // templates = [BasilServerMessage_entry_name, message_processor, BasilServerMessage_reply_name]
        this.receptionMessages2 = {
            'IdentifyDisplayableObjectReqMsg': [ '', this.procIdentifyDisplayableObject, 'IdentifyDisplayableObjectRespMsg' ],
            'ForgetDisplayableObjectReqMsg': [ '', this.procForgetDisplayableObject, 'ForgetDisplayableObjectRespMsg' ],
            'CreateObjectInstanceReqMsg': [ '', this.procCreateObjectInstance, 'CreateObjectInstanceRespMsg' ],
            'DeleteObjectInstanceReqMsg': [ '', this.procDeleteObjectInstance, 'DeleteObjectInstanceRespMsg' ],
            'UpdateObjectPropertyReqMsg': [ '', this.procUpdateObjectProperty, 'UpdateObjectPropertyRespMsg' ],
            'UpdateInstancePropertyReqMsg': [ '', this.procUpdateInstanceProperty, 'UpdateInstancePropertyRespMsg' ],
            'UpdateInstancePositionReqMsg': [ '', this.procUpdateInstancePosition, 'UpdateInstancePositionRespMsg' ],
            'RequestObjectPropertiesReqMsg': [ '', this.procRequestObjectProperties, 'RequestObjectPropertiesRespMsg' ],
            'RequestInstancePropertiesReqMsg': [ '', this.procRequestInstanceProperties, 'RequestInstancePropertiesRespMsg' ],
            'OpenSessionReqMsg': [ '', this.procOpenSession, 'OpenSessionRespMsg' ],
            'CloseSessionReqMsg': [ '', this.procCloseSession, 'CloseSessionRespMsg' ],
            'AliveCheckReqMsg': [ '', this.procAliveCheck, 'AliveCheckRespMsg' ],
            'AliveCheckRespMsg': [ '', this.procAliveCheckResp, undefined ]
        };
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
        let newWay = 1;
        if (this.transport) {
            // the Buffer should be a BasilServerMessage
            try {
                let msg = BasilServerMsgs.BasilServerMessage.decode(buff);
                GP.DebugLog('BasilServer: procMessage: ' + JSON.stringify(msg));
                let replyContents = undefined;
                // Look up the message type with a lookup rather than a loop
                let msgProps = Object.getOwnPropertyNames(msg);
                if (msgProps.length == 1) {
                    let msgProp = msgProps[0];
                    let template = this.receptionMessages2[msgProp];
                    replyContents = template[1](msg[msgProp], this);
                    // GP.DebugLog('BasilServer.procMessage:'
                    //         + ' prop=' + msgProp
                    //         + ', rec=' + JSON.stringify(msg[msgProp])
                    //         + ', reply=' + JSON.stringify(replyContents)
                    //     );
                    if (replyContents !== undefined && template[2] !== undefined) {
                        // The message requires a response
                        let rmsg = {};
                        rmsg[template[2]] = replyContents;
                        let reply = BasilServerMsgs.BasilServerMessage.create(rmsg);
                        this.transport.Send(BasilServerMsgs.BasilServerMessage.encode(reply).finish(), tcontext);
                    }
                }
                else {
                    GP.DebugLog('BasilServer.procMessage: odd msg props: len=' + msgProps.length);
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
    procIdentifyDisplayableObject(req, tthis) {
        let xxport = tthis === undefined ? this : tthis;
        return {
            'success': 1,
        };
    }
    procForgetDisplayableObject(req, tthis) {
        let xxport = tthis === undefined ? this : tthis;
        return {
            'success': 1,
        };
    }
    // Given an object with recieved parameters, do operation and return response object
    procCreateObjectInstance(req, tthis) {
        let xxport = tthis === undefined ? this : tthis;
        return {
            'success': 1,
            'createdInstanceId': 122334
        };
    }
    procDeleteObjectInstance(req, tthis) {
        let xxport = tthis === undefined ? this : tthis;
        return {
            'success': 1,
        };
    }
    procUpdateObjectProperty(req, tthis) {
        let xxport = tthis === undefined ? this : tthis;
        return {
            'success': 1
        };
    }
    procUpdateInstanceProperty(req, tthis) {
        let xxport = tthis === undefined ? this : tthis;
        return {
            'success': 1
        };
    }
    procUpdateInstancePosition(req, tthis) {
        let xxport = tthis === undefined ? this : tthis;
        return {
            'success': 1
        };
    }
    procRequestObjectProperties(req, tthis) {
        let xxport = tthis === undefined ? this : tthis;
        return {
            'success': 1,
            'properties': {
                'ObjectHere': 'frog',
                'ObjectThere': 'frog2'
            }
        };
    }
    procRequestInstanceProperties(req, tthis) {
        let xxport = tthis === undefined ? this : tthis;
        return {
            'success': 1,
            'properties': {
                'InstanceHere': 'frog',
                'InstanceThere': 'frog2'
            }
        };
    }
    procOpenSession(req, tthis) {
        let xxport = tthis === undefined ? this : tthis;
        return {
            'success': 1,
            'features': {
                'creepy': 'no',
                'wow': '44'
            }
        };
    }
    procCloseSession(req, tthis) {
        let xxport = tthis === undefined ? this : tthis;
        return {
            'success': 1
        };
    }
    procAliveCheck(reqq, tthis) {
        let xxport = tthis === undefined ? this : tthis;
        return {
            'time': Date.now(),
            'sequenceNum': tthis.aliveReplySequenceNum++,
            'timeReceived': reqq['time'],
            'sequenceNumReceived': reqq['sequenceNum']
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
