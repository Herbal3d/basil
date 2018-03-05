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

import Config from 'xConfig';
import { BasilServer as BasilServerMsgs } from "xBasilServerMessages"

var BS = BS || {};

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
    }
    Start() {
        if (this.transport) {
            this.transport.SetReceiveCallback(this.procMessage);
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
                let msg = BasilServerMsgs.BasilBasilServerMessage.decode(buff);
                if (msg.hasOwnPropery('IdentifyDisplayableObjectReqMsg')) {
                    let cmdMsg = BasilServerMsgs.BasilIdentifyDisplayableObjectReq.decode(msg.IdentifyDisplayableObjectReqMsg);
                    let resp = procIdentifyDispalyableObject(cmdMsg);
                    let reply = BasilServerMsgs.BasilBasilServerMessage.create(
                        { 'IdentifyDisplayableObjectRespMsg': resp }
                    );
                    this.transport.Send(reply.encode().finish(), tcontext);
                    return;
                }
                else if (msg.hasOwnPropery('CreateObjectInstanceReqMsg')) {
                    let cmdMsg = BasilServerMsgs.BasilCreateObjectInstanceReq.decode(msg.CreateObjectInstanceReqMsg);
                    let resp = procCreateObjectInstance(cmdMsg);
                    let reply = BasilServerMsgs.BasilBasilServerMessage.create(
                        { 'CreateObjectInstanceRespMsg': resp }
                    );
                    this.transport.Send(reply.encode().finish(), tcontext);
                    return;
                }
                else if (msg.hasOwnPropery('UpdateObjectPropertyReqMsg')) {
                    let cmdMsg = BasilServerMsgs.BasilUpdateObjectPropertyReq.decode(msg.UpdateObjectPropertyReqMsg);
                    let resp = procUpdateObjectProperty(cmdMsg);
                    let reply = BasilServerMsgs.BasilBasilServerMessage.create(
                        { 'UpdateObjectPropertyRespMsg': resp }
                    );
                    this.transport.Send(reply.encode().finish(), tcontext);
                    return;
                }
                else if (msg.hasOwnPropery('UpdateInstancePropertyReqMsg')) {
                    let cmdMsg = BasilServerMsgs.BasilReqUpdateInstanceProperty.decode(msg.UpdateInstancePropertyReqMsg);
                    let resp = procUpdateInstanceProperty(cmdMsg);
                    let reply = BasilServerMsgs.BasilBasilServerMessage.create(
                        { 'UpdateInstancePropertyRespMsg': resp }
                    );
                    this.transport.Send(reply.encode().finish(), tcontext);
                    return;
                }
                else if (msg.hasOwnPropery('UpdateInstancePositionReqMsg')) {
                    let cmdMsg = BasilServerMsgs.BasilUpdateInstancePositionReq.decode(msg.UpdateInstancePositionReqMsg);
                    let resp = procUpdateInstancePosition(cmdMsg);
                    let reply = BasilServerMsgs.BasilBasilServerMessage.create(
                        { 'UpdateInstancePositionRespMsg': resp }
                    );
                    this.transport.Send(reply.encode().finish(), tcontext);
                    return;
                }
                else if (msg.hasOwnPropery('RequestObjectPropertiesReqMsg')) {
                    let cmdMsg = BasilServerMsgs.BasilRequestObjectPropertiesReq.decode(msg.RequestObjectPropertiesReqMsg);
                    let resp = procRequestObjectProperties(cmdMsg);
                    let reply = BasilServerMsgs.BasilBasilServerMessage.create(
                        { 'RequestObjectPropertiesRespMsg': resp }
                    );
                    this.transport.Send(reply.encode().finish(), tcontext);
                    return;
                }
                else if (msg.hasOwnPropery('RequestInstancePropertiesReqMsg')) {
                    let cmdMsg = BasilServerMsgs.BasilRequestInstancePropertiesReq.decode(msg.RequestInstancePropertiesReqMsg);
                    let resp = procRequestInstanceProperties(cmdMsg);
                    let reply = BasilServerMsgs.BasilBasilServerMessage.create(
                        { 'RequestInstancePropertiesRespMsg': resp }
                    );
                    this.transport.Send(reply.encode().finish(), tcontext);
                    return;
                }
                else if (msg.hasOwnPropery('OpenSessionReqMsg')) {
                    let cmdMsg = BasilServerMsgs.BasilOpenSessionReq.decode(msg.OpenSessionReqMsg);
                    let resp = procOpenSession(cmdMsg);
                    let reply = BasilServerMsgs.BasilBasilServerMessage.create(
                        { 'OpenSessionRespMsg': resp }
                    );
                    this.transport.Send(reply.encode().finish(), tcontext);
                    return;
                }
                else if (msg.hasOwnPropery('CloseSessionReqMsg')) {
                    let cmdMsg = BasilServerMsgs.BasilCloseSessionReq.decode(msg.CloseSessionReqMsg);
                    let resp = procCloseSession(cmdMsg);
                    let reply = BasilServerMsgs.BasilBasilServerMessage.create(
                        { 'CloseSessionRespMsg': resp }
                    );
                    this.transport.Send(reply.encode().finish(), tcontext);
                    return;
                }
                else if (msg.hasOwnPropery('AliveCheckReqMsg')) {
                    GP.DebugLog('BasilServer: received AliveCheckReq');
                    let cmdMsg = BasilServerMsgs.BasilAliveCheckReq.decode(msg.AliveCheckReqMsg);
                    let resp = procAliveCheck(cmdMsg);
                    let reply = BasilServerMsgs.BasilBasilServerMessage.create(
                        { 'AliveCheckRespMsg': resp }
                    );
                    this.transport.Send(reply.encode().finish(), tcontext);
                    return;
                }
                else {
                    GP.DebugLog('BasilServer: did not decode message in :' + msg);
                }
            }
            catch(e) {
                GP.DebugLog('BasilServer: exception processing msg: ' + e);
            }
        }
    }
    // Given an object with recieved parameters, do operation and return response object
    procIdentifyDisplayableObject(req) {
        return {
            'success': 1
        };
    }
    procCreateObjectInstance(req) {
        return {
            'success': 1,
            'createdInstanceId': 122334
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
        GP.DebugLog('BasilServer: Received AliveCheckMsg. Generating response.'
            + ' replySeq=' + this.aliveReplySerquenceNum
            + ', recSeq=' + req.sequenceNum
            + ', reqTime=' + new Date(req.time) );
        return {
            'time': Date.now(),
            'sequenceNum': this.aliveReplySerquenceNum++,
            'timeReceived': req.time,
            'sequenceNumReceived': req.sequenceNum
        };
    }

    get stats() {
        return {

        }
    }

}

GP.BS = BS;
// All of the servers that have been connected
BS.servers = {};

// Create a new server connection and return same
export function NewBasilServerConnection(serverID, transport, parms) {
    if (BS.servers[serverID] != undefined) {
        GP.DebugLog('BasilServer: not creating service is existing ID:' + serverID);
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
