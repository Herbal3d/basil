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

// Client connection used in WebWorker and testing instances
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
    SendAndPromiseResponse(msg, reqName) {
        let smsg = {};
        smsg[ reqName + 'ReqMsg'] = msg;
        smsg['ResponseReq'] = {
          'responseSession': this.RPCsession++
        };
        let smsgs = { 'BasilServerMessages': [ smsg ] };
        if (Config.Debug && Config.Debug.VerifyProtocol) {
          if (BasilServerMsgs.BasilServerMessage.verify(smsgs)) {
            GP.DebugLog('BasilClient.SendAndPromiseResponse: verification fail: '
                    + JSON.stringify(smsgs));
          }
        }
        // let cmsg = BasilServerMsgs.BasilServerMessage.create(smsgs);
        let emsg = BasilServerMsgs.BasilServerMessageBody.encode(smsgs).finish();
        // Return a promise and pass the 'resolve' function to the response message processor
        return new Promise( function(resolve,reject) {
            this.RPCSessionCallback[smsg.RPCRequestSession] = {
              'timeRPCCreated': Date.now(),
              'resolve': resolve,
              'reject': reject,
              'requestName': reqName,
              'rawMessage': smsgs
            };
            this.transport.Send(emsg);
        }.bind(this));
    };

    // Called when message received. At the moment, all messages are
    //    be responses to RPC requests.
    procMessage(resp) {
      let smsgs = BasilServerMsgs.BasilServerMessageBody.decode(resp);
      if (smsgs.BasilServerMessages) {
        smsgs.BasilServerMessages.forEach( msg => {
          if (msg.ResponseReq && msg.ResponseReq.responseSession != 0) {
            let sessionIndex = msg.ResponseReq.responseSession;
            let session = this.RPCSessionCallback[sessionIndex];
            if (session) {
              this.RPCSessionCallback.delete(sessionIndex);
              try {
                let respName = msg.BasilServerMesssage.get();
                if (respName.endsWith('RespMsg')) {
                  // if this is a properly formed response, return the body of the response
                  (session.resolve)(msg.BasilServerMessage[respName], msg, respName);
                }
                else {
                  // If not a response, just resolve with the whole message
                  (session.resolve)(msg, respName);
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

    IdentifyDisplayableObject(auth, asset, id, aabb) {
        let msg = { 'assetInfo': asset };
        if (auth) msg['auth'] = auth;
        if (id) msg['objectId'] = { 'id': id };
        if (aabb) msg['aabb'] = aabb;
        return this.SendAndPromiseResponse(msg, 'IdentifyDisplayableObject');
    };
    ForgetDisplayableObject(auth, id) {
        let msg = { 'objectId': { 'id': id } };
        if (auth) msg['auth'] = auth;
        return this.SendAndPromiseResponse(msg, 'ForgetDisplayableObject');
    };
    CreateObjectInstance(auth, objectId, instancePositionInfo, propertyList, instanceId) {
        let msg = { 'objectId': { 'id': objectId } };
        if (auth) msg['auth'] = auth;
        if (instancePositionInfo) msg['pos'] = instancePositionInfo;
        if (propertyList) msg['props'] = propertyList;
        if (instanceId) msg]'instanceId'] = { 'id': instanceId };
        return this.SendAndPromiseResponse(msg, 'CreateObjectInstance');
    };
    DeleteObjectInstance(auth, instanceId) {
        let msg = { 'instanceId': { 'id': instanceId } };
        if (auth) msg['auth'] = auth;
        return this.SendAndPromiseResponse(msg, 'DeleteObjectInstance');
    };
    UpdateObjectProperty(auth, objectId, propertyList) {
        let msg = { 'objectId': { 'id': objectId } };
        if (auth) msg['auth'] = auth;
        if (propertyList) msg['props'] = propertyList;
        return this.SendAndPromiseResponse(msg, 'UpdateObjectProperty');
    };
    UpdateInstanceProperty(auth, instanceId, propertyList) {
        let msg = { 'instanceId': { 'id': instanceId } };
        if (auth) msg['auth'] = auth;
        if (propertyList) msg['props'] = propertyList;
        return this.SendAndPromiseResponse(msg, 'UpdateInstanceProperty');
    };
    UpdateInstancePosition(auth, instanceId,  pos) {
        let msg = { 'instanceId': { 'id': instanceId } };
        if (auth) msg['auth'] = auth;
        if (pos) msg['pos'] = pos;
        return this.SendAndPromiseResponse(msg, 'UpdateInstancePosition');
    };
    RequestObjectProperties(auth, objectId, filter) {
        let msg = { 'objectId': { 'id': objectId } };
        if (auth) msg['auth'] = auth;
        if (filter) msg['filter'] = filter;
        return this.SendAndPromiseResponse(msg, 'RequestObjectProperties');
    };
    RequestInstanceProperties(auth, instanceId, filter) {
        let msg = { 'instanceId': { 'id': instanceId } };
        if (auth) msg['auth'] = auth;
        if (filter) msg['filter'] = filter;
        return this.SendAndPromiseResponse(msg, 'RequestInstanceProperties');
    };
    OpenSession(auth, propertyList) {
        let msg = {};
        if (auth) msg['auth'] = auth;
        if (propertyList) msg['features'] = propertyList;
        return this.SendAndPromiseResponse(msg, 'OpenSession');
    };
    CloseSession(auth, reason) {
        let msg = {};
        if (auth) msg['auth'] = auth;
        if (reason) msg['reason'] = reason;
        return this.SendAndPromiseResponse(msg, 'CloseSession');
    };
    AliveCheck(auth) {
        let msg = {};
        if (auth) msg['auth'] = auth;
        msg['time'] = Date.now(),
        msg['sequenceNum']  = this.aliveSequenceNum++
        // throw 'BasilClient.AliveCheck: sending: ' + JSON.stringify(msg);
        return this.SendAndPromiseResponse(msg, 'AliveCheck');
    };
};
