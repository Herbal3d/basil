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

var TR = TR || {};
GP.TR = TR;

import { BException } from 'xBException';
import { BTransport as BTransportMsgs } from 'xBasilServerMessages';
import { BItem } from 'xBItem';

// Template for transport implmentations.
export class BTransport extends BItem {
    constructor(parms) {
        super(parms.transportId, parms.transportAuth);
        this.itemType = 'unknown';
        this.messages = [];
        this.messagesSent = 0;
        this.RPCmessagesSent = 0;
        this.messagesReceived = 0;
        this.sequenceNum = 111;
        this.RPCsession = 900222;
        this.RPCSessionCallback = new Map();
        this.aliveSequenceNum = 333;

        // The properties that can be read as a BItem
        super.DefineProperties( {
            'ItemType': { 'get': () => { return this.itemType; }, 'set': val => { this.itemType = val; } },
            'MessagesSent': { 'get': () => { return this.messagesSent; } },
            'RPCMessagesSent': { 'get': () => { return this.RPCmessagesSent; } },
            'MessagesReceived': { 'get': () => { return this.messagesReceived; } },
            'QueueSize': { 'get': () => { return this.messages.length; } }
        } );
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
}

// UTILITY FUNCTIONS USED BY children
// Wrap the passed 'data' into a transport message.
// If 'tcontext' is passed and there are RPC settings, add RPC to the transport.
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
    // else {
        // GP.DebugLog('BTransport: Send(). Seq=' + tmsg.sequenceNum);
    // }
    // GP.DebugLog('BTransport.EncodeMessage: msg=' + JSON.stringify(tmsg));
    let cmsg = BTransportMsgs.BTransport.create(tmsg);
    return BTransportMsgs.BTransport.encode(cmsg).finish();
}

// Wrap the passed 'data' into a RPC transport message.
// 'resolve' and 'reject' are functions for processing the reception of the response.
export function EncodeRPCMessage(data, resolve, reject, tthis) {
    let tester = tthis === undefined ? this : tthis;
    let tmsg = {
        'sequenceNum': tester.sequenceNum++,
        'message': data,
        'requestSession': tester.RPCsession++
    };
    // Remember callback information for the response to the message being sent
    tester.RPCSessionCallback[tmsg.requestSession] = [ Date.now(), resolve, reject, tmsg ];

    let cmsg = BTransportMsgs.BTransport.create(tmsg);
    return BTransportMsgs.BTransport.encode(cmsg).finish();
}

// Check the input queue for messages and, if present, process one.
// If 'tthis' is passed, it is used as the BTransport to push reception for.
export function PushReception(tthis) {
    let tester = tthis === undefined ? this : tthis;
    let msg = tester.messages.shift();
    if (msg) {
        tester.messagesReceived++;
        let dmsg = BTransportMsgs.BTransport.decode(msg)
        // GP.DebugLog('BTransport.PushReception: rcvd" ' + JSON.stringify(dmsg));

        // If the message has the info for a response to a RPC, call the saved response handler
        let RPCResponseCalled = false;
        if (dmsg.requestSession) {
            let session = tester.RPCSessionCallback[dmsg.requestSession];
            if (session) {
                // the session entry is a 4-tuple: [ time, resolve, reject, msgAsObject ]
                tester.RPCSessionCallback.delete(dmsg.requestSession);
                (session[1])(dmsg.message);
                RPCResponseCalled = true;
            }
        }
        if (!RPCResponseCalled) {
            // If the message is not an RPC reqpsonse, call the message processor
            if (tester.receiveCallbackObject && tester.receiveCallbackObject.procMessage) {
                // GP.DebugLog('BTransportTest: dequeue msg: seq=' + dmsg.sequenceNum);
                tester.receiveCallbackObject.procMessage(dmsg.message, dmsg);
            }
        }
    }
}
