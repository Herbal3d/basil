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

var TR = TR || {};
GP.TR = TR;

import BException from 'xBException';
import { BTransport as BTransportMsgs } from 'xBasilServerMessages';

// Template for transport implmentations.
export class BTransport {
    constructor(parms) {
        this.messages = [];
        this.messagesSent = 0;
        this.RPCmessagesSent = 0;
        this.messagesReceived = 0;
        this.sequenceNum = 111;
        this.RCPsession = 900222;
        this.RCPSessionCallback = new Map();
        this.aliveSequenceNum = 333;
    }
    Open(connectionString) {
    }
    Close() {
    }
    // Send the data. Places message in output queue
    // 'tcontext' is optional and used for RPC responses.
    Send(data, tcontext) {
        GP.DebugLog('BTransport: call of undefined Send()');
        throw new BException('BTransport: call of undefined Send()');
    }
    // Send a messsage and expect a replay of some type.
    // Returns a promise
    SendRPC(data) {
        GP.DebugLog('BTransport: call of undefined SendRPC()');
        throw new BException('BTransport: call of undefined SendRPC()');
    }
    // Get data in the input queue. Returns a Promise as might wait for data.
    Receive() {
        GP.DebugLog('BTransport: call of undefined Receive()');
        throw new BException('BTransport: call of undefined Receive()');
    }
    // Set a callback object for recevieving messages.
    // The passed object must have a 'procMessage' method
    SetReceiveCallbackObject(callback) {
        GP.DebugLog('BTransport: call of undefined SetReceiveCallback()');
        throw new BException('BTransport: call of undefined SetReceiveCallback()');
    }
    // Return 'true' is there is data in the input queue
    get isDataAvailable() {
        return false;
    }
    get isConnected() {
        return false;
    }
    // Return a map with statistics
    get stats() {
        return {};
    }
    // Returns type of the transport. Like 'WW' or 'WS'.
    get type() {
        return 'unspecified';
    }
    // Returns a longer identifying name of transport (usually includes endpoint name)
    get info() {
        return this.type + ' none';
    }
    GetProperties(filter) {
    }
    SetProperty(prop, value) {
    }
}

// UTILITY FUNCTIONS USED BY children
export function EncodeMessage(data, tcontext, tthis) {
    let tester = tthis === undefined ? this : tthis;
    let tmsg = {
        'sequenceNum': tester.sequenceNum++,
        'message': data,
    };
    if (tcontext) {
        if (tcontext.requestSession !== undefined && tcontext.requestSession != 0) {
            tmsg.requestSession = tcontext.requestSession;
            // GP.DebugLog('BTransport: Send(). Seq=' + tmsg.sequenceNum + ', reqSn=' + tmsg.requestSession);
        }
    }
    else {
        // GP.DebugLog('BTransport: Send(). Seq=' + tmsg.sequenceNum);
    }
    let cmsg = BTransportMsgs.BTransport.create(tmsg);
    return BTransportMsgs.BTransport.encode(cmsg).finish();
}
export function EncodeRPCMessage(data, resolve, reject, tthis) {
    let tester = tthis === undefined ? this : tthis;
    let tmsg = {
        'sequenceNum': tester.sequenceNum++,
        'message': data,
        'requestSession': tester.RCPsession++
    };
    this.RPCsessionCallback[tmsg.requestSession] = [ Date.now(), resolve, reject, tmsg ];

    let cmsg = BTransportMsgs.BTransport.create(tmsg);
    return emsg = BTransportMsgs.BTransport.encode(cmsg).finish();
}
