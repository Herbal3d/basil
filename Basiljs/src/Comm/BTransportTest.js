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
import { BasilServer as BasilServerMsgs } from 'xBasilServerMessages';
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
        if (GP.TR.TransportTestsAliveIntervalID == undefined) {
            GP.DebugLog('BTransportTest: setting timer for alive messages');
            GP.TR.TransportTestsAliveIntervalID = setInterval(function() {
                BTransportTest.ProcessAliveInterval();
            }, parms.testInterval ? parms.testInterval : 1000)
        }
        // Timer to poll message queue and process received messsages
        if (GP.TR.TransportTestsPollIntervalID == undefined) {
            GP.DebugLog('BTransportTest: setting timer for message queue oplling');
            GP.TR.TransportTestsPollIntervalID = setInterval(function() {
                BTransportTest.ProcessPollInterval();
            }, parms.testPollInterval ? parms.testPollInterval : 500)
        }
    }
    // Static function called from timer
    // Check each of thet tests and have them generate an alive message
    static ProcessAliveInterval() {
        for (let test of GP.TR.TransportTestsRunning) {
            console.log('BTransportTest: ProcessAliveInterval');
            // test.Close();   // DEBUG DEBUG
            let amsg = BasilServerMsgs.AliveCheckReq.create( {
                'time': Date.now(),
                'sequenceNum': test.aliveSequenceNum++
            } );
            let adata = BasilServerMsgs.AliveCheckReq.encode(amsg).finish();
            test.Send(adata, undefined, test);
        }
    }
    // Static function called from timeReceived
    // Check of the tests and see if they have messsages. Is so receive and callback.
    static ProcessPollInterval() {
        for (let test of GP.TR.TransportTestsRunning) {
            console.log('BTransportTest: ProcessAliveInterval');
            let msg = test.messages.shift();
            if (msg) {
                test.messagesReceived++;
                let dmsg = BasilServerMsgs.BasilServerMessage.decode(msg)
                if (dmsg.requestSession) {
                    let session = test.RCPSessionCallback[dmsg.requestSession];
                    if (session) {
                        // the session entry is a tuple: [ time, resolve, reject, msgAsObject ]
                        test.RPCsessionCallback.delete(dmsg.requestSession);
                        GP.DebugLog('BTransportTest: returning RPC: session=' + dmsg.requestSession);
                        (session[1])(dmsg.message);
                    }
                }
                if (test.receiveCallback) {
                    GP.DebugLog('BTransportTest: dequeue msg: seq=' + dmsg.sequenceNum);
                    test.receiveCallback(dmsg.message, dmsg);
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
            clearInterval(BTransportTest.TransportTestsPollIntervalID);
            BTransportTest.TransportTestsPollIntervalID = undefined;
        }
    }
    // Send the data. Places message in output queue
    // 'tcontext' is optional and used for RPC responses.
    // One can pass a 'this' context for calling on timer threads, etc
    Send(data, tcontext, tthis) {
        let tester = tthis === undefined ? this : tthis;
        console.log('BTransportTest: Send:' + data);
        let emsg = EncodeMessage(data, tcontext);
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
            let emsg = EncodeRPCMessage(data, resolve, reject);
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
    // Set a calback to be called whenever a message is received
    SetReceiveCallback(callback) {
        this.receiveCallback = callback;
        GP.DebugLog('BTransportTest: set receiveCallback');
    }
    // Return 'true' is there is data in the input queue
    get isDataAvailable() {
        return this.messsages.length > 0;
    }
    get isConnected() {
        return (this.TransportTestsPollIntervalID != undefined);
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
