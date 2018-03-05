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

// Test transport.

import { BTransport, EncodeMessage, EncodeRPCMessage } from './BTransport.js';
import { BasilServer as BasilServerMsgs, BTransport as BTransportMsgs } from 'xBasilServerMessages';
import BException from 'xBException';

// TransportTest uses some global variables to keep track of running tests
GP.TR.TransportTestsRunning = [];
GP.TR.TransportTestsAliveIntervalID = undefined;
GP.TR.TransportTestsPollIntervalID = undefined;

export default class BTransportTest extends BTransport {

    constructor(parms) {
        super(parms);
        GP.DebugLog('BTransportTest: constructor');
        if (GP.TR.TransportTestsRunning === undefined) {
            // Attach test variables to the transport globel variable for debugging
            GP.TR.TransportTestsRunning = [];
        }
        GP.TR.TransportTestsRunning.push(this);

        // Timer that generates Alive messages for testing
        if (GP.TR.TransportTestsAliveIntervalID === undefined) {
            GP.TR.TransportTestsAliveIntervalID = setInterval(function() {
                BTransportTest.ProcessAliveInterval();
            }, parms.testInterval ? parms.testInterval : 1000)
        }
        // Timer to poll message queue and process received messsages
        if (GP.TR.TransportTestsPollIntervalID === undefined) {
            GP.TR.TransportTestsPollIntervalID = setInterval(function() {
                BTransportTest.ProcessPollInterval();
            }, parms.testPollInterval ? parms.testPollInterval : 500)
        }
    }
    // Static function called from timer
    // Check each of thet tests and have them generate an alive message
    static ProcessAliveInterval() {
        for (let test of GP.TR.TransportTestsRunning) {
            let bmsg = {
                'AliveCheckReqMsg': {
                    'time': Date.now(),
                    'sequenceNum': test.aliveSequenceNum++
                }
            }
            // GP.DebugLog('TransportTest: creating msg: ' + JSON.stringify(bmsg));
            let bdata = BasilServerMsgs.BasilServerMessage.encode(bmsg).finish();
            test.Send(bdata, undefined, test);
        }
    }
    // Static function called from timeReceived
    // Check of the tests and see if they have messsages. Is so receive and callback.
    static ProcessPollInterval() {
        for (let test of GP.TR.TransportTestsRunning) {
            let msg = test.messages.shift();
            if (msg) {
                test.messagesReceived++;
                let dmsg = BTransportMsgs.BTransport.decode(msg)
                if (dmsg.requestSession) {
                    let session = test.RCPSessionCallback[dmsg.requestSession];
                    if (session) {
                        // the session entry is a tuple: [ time, resolve, reject, msgAsObject ]
                        test.RPCsessionCallback.delete(dmsg.requestSession);
                        // GP.DebugLog('BTransportTest: returning RPC: session=' + dmsg.requestSession);
                        (session[1])(dmsg.message);
                    }
                }
                if (test.receiveCallbackObject && test.receiveCallbackObject.procMessage) {
                    // GP.DebugLog('BTransportTest: dequeue msg: seq=' + dmsg.sequenceNum);
                    test.receiveCallbackObject.procMessage(dmsg.message, dmsg);
                }
            }
        }
    }
    // BTransport.Open(connectionString)
    Open(connectionString) {
    }
    // BTransport.Close()
    Close() {
        GP.DebugLog('BTransportTest: close');
        if (GP.TR.TransportTestsAliveIntervalID) {
            clearInterval(GP.TR.TransportTestsAliveIntervalID);
            GP.TR.TransportTestsAliveIntervalID = undefined;
        }
        if (GP.TR.TransportTestsPollIntervalID) {
            clearInterval(GP.TR.TransportTestsPollIntervalID);
            GP.TR.TransportTestsPollIntervalID = undefined;
        }
    }
    // Send the data. Places message in output queue.
    // 'data' is the encoded binary types of the message.
    // 'tcontext' is optional and used for RPC responses.
    // One can pass a 'this' context for calling on timer threads, etc
    Send(data, tcontext, tthis) {
        let tester = tthis === undefined ? this : tthis;
        let emsg = EncodeMessage(data, tcontext, tester);
        tester.messages.push(emsg);
        tester.messagesSent++;
    }
    // Send a messsage and expect a replay of some type.
    // Returns a promise
    // One can pass a 'this' context for calling on timer threads, etc
    SendRPC(data, tthis) {
        let tester = tthis === undefined ? this : tthis;
        return new Promise((resolve, reject) => {
            console.log('BTransportTest: SendRPC:' + data);
            let emsg = EncodeRPCMessage(data, resolve, reject, tester);
            tester.messages.push(emsg);
            tester.RPCmessagesSent++;
            tester.messagesSent++;
         });
    }
    // Get data in the input queue. Returns a Promise as might wait for data.
    Receive() {
        GP.DebugLog('BTransportTest: call of undefined Receive()');
        throw new BException('BTransportTest: call of undefined Receive()');
    }
    // Set a callback object for recevieving messages.
    // The passed object must have a 'procMessage' method
    SetReceiveCallbackObject(callback) {
        this.receiveCallbackObject = callback;
        // GP.DebugLog('BTransportTest: set receiveCallback');
    }
    // Return 'true' is there is data in the input queue
    get isDataAvailable() {
        return this.messsages.length > 0;
    }
    get isConnected() {
        return (this.TransportTestsPollIntervalID !== undefined);
    }
    // Return a map with statistics
    get stats() {
        return {};
    }
    // Returns type of the transport. Like 'WW' or 'WS'.
    get type() {
        return 'BTransportTest';
    }
    // Returns a longer identifying name of transport (usually includes endpoint name)
    get info() {
        return this.type + ' none';
    }

}
