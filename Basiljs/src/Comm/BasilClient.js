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

export class BasilClientConnection {
    constructor(clientID, xport, parms) {
        this.clientID = clientID;
        this.transport = xport;
        this.aliveSequenceNum = 888;
        this.RPCsession = 900222;
        this.RPCSessionCallback = new Map();
        this.transport.SetReceiveCallbackObject(this);
    };
    Start() {
    };
    Close() {
    };
    // function that sends the request and returns a Promise for the response.
    SendAndPromiseResponse(msg, xport, reqName) {
        let smsg = {};
        smsg[ reqName + 'ReqMsg'] = msg;
        smsg['RPCRequestSession'] = this.RPCsession++;
        let smsgs = { 'BasilServerMessages': [ smsg ] };
        let cmsg = BasilServerMsgs.BasilServerMessage.create(smsgs);
        let emsg = BasilServerMsgs.BasilServerMessage.encode(cmsg).finish();
        let xxport = xport;
        // Return a promise and pass the 'resolve' function to the response message processor
        return new Promise( (resolve,reject) => {
            this.RPCSessionCallback[smsg.RPCRequestSession] = {
              'timeRPCCreated': Date.now(),
              'resolve': resolve,
              'reject': reject,
              'requestName': reqName,
              'rawMessage': smsgs
            };
            xxport.Send(emsg);
        });
    };

    // Called when message received. At the moment, all messages are
    //    be responses to RPC requests.
    procMessage(resp) {
      let smsgs = BasilServerMsgs.BasilServerMessage.decode(resp);
      if (smsgs.BasilServerMessages) {
        smsgs.BasilServerMessages.forEach( msg => {
          if (msg.RPCRequestSession && msg.RPCRequestSession != 0) {
            let session = this.RPCSessionCallback[msg.RPCRequestSession];
            if (session) {
              this.RPCSessionCallback.delete(msg.RPCRequestSession);
              try {
                if (msg.hasOwnProperty( session.requestName + 'RespMsg')) {
                  // if this is a properly formed response, return the body of the response
                  (session.resolve)(msg[ session.requestName + 'RespMsg']);
                }
                else {
                  (session.resolve)(msg);
                }
              }
              catch (e) {
                let errMsg = 'BasilClient.procMessage: exception processing msg: ' + e;
                console.log(errMsg);
                GP.DebugLog(errMsg);
                (session.reject)(e);
              }
            }
            else {
              let errMsg = 'BasilClient.procMessage: received msg which is not RPC response: '
                        + JSON.stringify(msg);
              console.log(errMsg);
              GP.DebugLog(errMsg);
            }
          }
          else {
            let errMsg = 'BasilClient.procMessage: received misformed msg: '
                      + JSON.stringify(msg);
            console.log(errMsg);
            GP.DebugLog(errMsg);
          }
        });
      }
    }

    IdentifyDisplayableObject(auth, asset, aabb) {
        let msg = {
            'assetInfo': asset
        };
        if (auth) msg['auth'] = auth;
        if (aabb) msg['aabb'] = aabb;
        return this.SendAndPromiseResponse(msg, this.transport, 'IdentifyDisplayableObject');
    };
    ForgetDisplayableObject(auth, id) {
        let msg = { 'identifier': { 'id': id } };
        if (auth) msg['auth'] = auth;
        return this.SendAndPromiseResponse(msg, this.transport, 'ForgetDisplayableObject');
    };
    CreateObjectInstance(auth, id, instancePositionInfo, propertyList) {
        let msg = { 'identifier': { 'id': id } };
        if (auth) msg['auth'] = auth;
        if (instancePositionInfo) msg['pos'] = instancePositionInfo;
        if (propertyList) msg['props'] = propertyList;
        return this.SendAndPromiseResponse(msg, this.transport, 'CreateObjectInstance');
    };
    DeleteObjectInstance(auth, id) {
        let msg = { 'identifier': { 'id': id } };
        if (auth) msg['auth'] = auth;
        return this.SendAndPromiseResponse(msg, this.transport, 'DeleteObjectInstance');
    };
    UpdateObjectProperty(auth, id, propertyList) {
        let msg = { 'identifier': { 'id': id } };
        if (auth) msg['auth'] = auth;
        if (propertyList) msg['props'] = propertyList;
        return this.SendAndPromiseResponse(msg, this.transport, 'UpdateObjectProperty');
    };
    UpdateInstanceProperty(auth, id, propertyList) {
        let msg = { 'instanceId': { 'id': id } };
        if (auth) msg['auth'] = auth;
        if (propertyList) msg['props'] = propertyList;
        return this.SendAndPromiseResponse(msg, this.transport, 'UpdateInstanceProperty');
    };
    UpdateInstancePosition(auth, id,  pos) {
        let msg = { 'instanceId': { 'id': id } };
        if (auth) msg['auth'] = auth;
        if (pos) msg['pos'] = pos;
        return this.SendAndPromiseResponse(msg, this.transport, 'UpdateInstancePosition');
    };
    RequestObjectProperties(auth, id, filter) {
        let msg = { 'identifier': { 'id': id } };
        if (auth) msg['auth'] = auth;
        if (filter) msg['filter'] = filter;
        return this.SendAndPromiseResponse(msg, this.transport, 'RequestObjectProperties');
    };
    RequestInstanceProperties(auth, id, filter) {
        let msg = { 'instanceId': { 'id': id } };
        if (auth) msg['auth'] = auth;
        if (filter) msg['filter'] = filter;
        return this.SendAndPromiseResponse(msg, this.transport, 'RequestInstanceProperties');
    };
    OpenSession(auth, propertyList) {
        let msg = {};
        if (auth) msg['auth'] = auth;
        if (propertyList) msg['features'] = propertyList;
        return this.SendAndPromiseResponse(msg, this.transport, 'OpenSession');
    };
    CloseSession(auth, reason) {
        let msg = {};
        if (auth) msg['auth'] = auth;
        if (reason) msg['reason'] = reason;
        return this.SendAndPromiseResponse(msg, this.transport, 'CloseSession');
    };
    AliveCheck(auth) {
        let msg = {};
        if (auth) msg['auth'] = auth;
        msg['time'] = Date.now(),
        msg['sequenceNum']  = this.aliveSequenceNum++
        // throw 'BasilClient.AliveCheck: sending: ' + JSON.stringify(msg);
        return this.SendAndPromiseResponse(msg, this.transport, 'AliveCheck');
    };
};

export function NewBasilClient(clientID, xport, parms) {
    return new BasilClientConnection(clientID, xport, parms);
};
