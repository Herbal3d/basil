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

import { BasilServer } from 'xBasilServer';

import {flatbuffers} from 'xFlatbuffers';
import {org.herbal3d.protocol.basil as BTypes} from 'xBasilTypes';
import {org.herbal3d.protocol.basil.server as BServer} from 'xBasilServer';

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
    SendAndPromiseResponse(fbb, msg, msgType) {
      let thisSession = this.RPCsession++;
      return new Promise( function(resolve,reject) {
          this.RPCSessionCallback[thisSession] = {
            'timeRPCCreated': Date.now(),
            'resolve': resolve,
            'reject': reject,
          };
          this.transport.Send(fbb, msg, msgType, thisSession);
        }.bind(this));
    };

    // Called when message received. At the moment, all messages are
    //    be responses to RPC requests.
    procMessage(resp) {
      let fbBuff = new flatbuffer.ByteBuffer(resp);
      let rcv = BMessage.BTransportMsg.getRootAsBTransportMsg(fbBuff);
      // We expect any message received to be a response to a request
      let session = rcv.responseSession();
      if (session) {
        if (this.RPCSessionCallback.has(session)) {
          let sessionInfo = this.RPCSessionCallback[session];
          try {
            this.RPCSessionCallback.delete(session);
            let serverMsgName = BServer.ServerMessage[rcv.msgType];
            // NOTE: the receiver gets a flatbuffer structure
            (sessionInfo.resolve)(rcv.msg(new BServer[serverMsgName]()));
          }
          catch (e) {
            let errMsg = 'BasilClient.procMessage: exception processing msg: ' + e;
            console.log(errMsg);
            GP.DebugLog(errMsg);
            (sessionInfo.reject)(e);
          }
        }
        else {
          let errMsg = 'BasilClient.procMessage: received RPC msg for unknown session:'
                      + session;
          console.log(errMsg);
          GP.DebugLog(errMsg);
        }
      }
      else {
        let errMsg = 'BasilClient.procMessage: received msg which is not RPC response');
        console.log(errMsg);
        GP.DebugLog(errMsg);
      }
    }

    IdentifyDisplayableObject(auth, asset, aabb) {
      let fbb = flatbuffers.Builder();
      let packedAsset = BasilServer.PackAssetInfo(fbb, asset);
      let packedAuth = auth ? BasilServer.PackAuth(fbb, auth) : undefined;
      let packedAabb = aabb ? BasilServer.PackAabb(fbb, aabb) : undefined;
      BServer.IdentifyDisplayableObjectReq.startIdentifyDisplayableObjectReq(fbb);
      BServer.IdentifyDisplayableObjectReq.addAssetInfo(fbb, packedAsset);
      if (packedAuth) BServer.IdentifyDisplayableObjectReq.addAuth(fbb, packedAuth);
      if (packedAabb) BServer.IdentifyDisplayableObjectReq.addAabb(fbb, packedAabb);
      let msg = BServer.IdentifyDisplayableObjectReq.endIdentifyDisplayableObjectReq(fbb);
      return this.SendAndPromiseResponse(fbb, msg, BServer.ServerMessage.IdentifyDisplayableObjectReq);
    };
    ForgetDisplayableObject(auth, id) {
      let fbb = flatbuffers.Builder();
      let packedAuth = auth ? BasilServer.PackAuth(fbb, auth) : undefined;
      BServer.ForgetDisplayableObjectReq.startIdentifyDisplayableObjectReq(fbb);
      BServer.ForgetDisplayableObjectReq.addIdentifier(fbb, fbb.createString(id));
      if (packedAuth) BServer.IdentifyDisplayableObjectReq.addAuth(fbb, packedAuth);
      return this.SendAndPromiseResponse(fbb, msg, BServer.ServerMessage.ForgetDisplayableObjectReq);
    };
    CreateObjectInstance(auth, id, instancePositionInfo, propertyList) {
      let fbb = flatbuffers.Builder();
        let msg = { 'identifier': { 'id': id } };
        if (auth) msg['auth'] = auth;
        if (instancePositionInfo) msg['pos'] = instancePositionInfo;
        if (propertyList) msg['props'] = propertyList;
        return this.SendAndPromiseResponse(msg, 'CreateObjectInstance');
    };
    DeleteObjectInstance(auth, id) {
      let fbb = flatbuffers.Builder();
        let msg = { 'identifier': { 'id': id } };
        if (auth) msg['auth'] = auth;
        return this.SendAndPromiseResponse(msg, 'DeleteObjectInstance');
    };
    UpdateObjectProperty(auth, id, propertyList) {
      let fbb = flatbuffers.Builder();
        let msg = { 'identifier': { 'id': id } };
        if (auth) msg['auth'] = auth;
        if (propertyList) msg['props'] = propertyList;
        return this.SendAndPromiseResponse(msg, 'UpdateObjectProperty');
    };
    UpdateInstanceProperty(auth, id, propertyList) {
      let fbb = flatbuffers.Builder();
        let msg = { 'instanceId': { 'id': id } };
        if (auth) msg['auth'] = auth;
        if (propertyList) msg['props'] = propertyList;
        return this.SendAndPromiseResponse(msg, 'UpdateInstanceProperty');
    };
    UpdateInstancePosition(auth, id,  pos) {
      let fbb = flatbuffers.Builder();
        let msg = { 'instanceId': { 'id': id } };
        if (auth) msg['auth'] = auth;
        if (pos) msg['pos'] = pos;
        return this.SendAndPromiseResponse(msg, 'UpdateInstancePosition');
    };
    RequestObjectProperties(auth, id, filter) {
      let fbb = flatbuffers.Builder();
        let msg = { 'identifier': { 'id': id } };
        if (auth) msg['auth'] = auth;
        if (filter) msg['filter'] = filter;
        return this.SendAndPromiseResponse(msg, 'RequestObjectProperties');
    };
    RequestInstanceProperties(auth, id, filter) {
      let fbb = flatbuffers.Builder();
        let msg = { 'instanceId': { 'id': id } };
        if (auth) msg['auth'] = auth;
        if (filter) msg['filter'] = filter;
        return this.SendAndPromiseResponse(msg, 'RequestInstanceProperties');
    };
    OpenSession(auth, propertyList) {
      let fbb = flatbuffers.Builder();
        let msg = {};
        if (auth) msg['auth'] = auth;
        if (propertyList) msg['features'] = propertyList;
        return this.SendAndPromiseResponse(msg, 'OpenSession');
    };
    CloseSession(auth, reason) {
      let fbb = flatbuffers.Builder();
        let msg = {};
        if (auth) msg['auth'] = auth;
        if (reason) msg['reason'] = reason;
        return this.SendAndPromiseResponse(msg, 'CloseSession');
    };
    AliveCheck(auth) {
      let fbb = flatbuffers.Builder();
        let msg = {};
        if (auth) msg['auth'] = auth;
        msg['time'] = Date.now(),
        msg['sequenceNum']  = this.aliveSequenceNum++
        // throw 'BasilClient.AliveCheck: sending: ' + JSON.stringify(msg);
        return this.SendAndPromiseResponse(msg, 'AliveCheck');
    };
};
