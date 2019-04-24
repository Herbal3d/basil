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
import GP from 'GP';

import { BTransport } from './BTransport.js';
import { BasilServer as BasilServerMsgs } from '../jslibs/BasilServerMessages.js';

// TransportTest uses some global variables to keep track of running tests
GP.TransportTestsRunning = [];
GP.TransportTestsAliveIntervalID = undefined;
GP.TransportTestsPollIntervalID = undefined;

export class BTransportTest extends BTransport {
    constructor(pParams) {
        let params = CombineParameters(Config.comm.TransportTest, pParams, {
            'transportURL': undefined   // name of Worker to connect to
        });
        super(params);
        GP.DebugLog('BTransportTest: constructor');
        this.itemTYpe = 'BTransport.TransportTest';
        if (GP.TransportTestsRunning === undefined) {
            // Attach test variables to the transport globel variable for debugging
            GP.TransportTestsRunning = [];
        }
        GP.TransportTestsRunning.push(this);

        // Timer that generates Alive messages for testing
        if (GP.TransportTestsAliveIntervalID === undefined) {
            GP.TransportTestsAliveIntervalID = setInterval(function() {
                BTransportTest.ProcessAliveInterval();
            }, params.testinterval ? params.testinterval : 1000)
        }
        // Timer to poll message queue and process received messsages
        if (GP.TransportTestsPollIntervalID === undefined) {
            GP.TransportTestsPollIntervalID = setInterval(function() {
                BTransportTest.ProcessPollInterval();
            }, params.testpollinterval ? params.testpollinterval : 500)
        }
        this.SetState(BItemState.READY);
    }
    // Static function called from timer
    // Check each of thet tests and have them generate an alive message
    static ProcessAliveInterval() {
        for (let test of GP.TransportTestsRunning) {
            let bmsg = {
                'AliveCheckReqMsg': {
                    'time': Date.now(),
                    'sequenceNum': test.aliveSequenceNum++
                }
            }
            // GP.DebugLog('TransportTest: creating msg: ' + JSON.stringify(bmsg));
            let bdata = BasilServerMsgs.BasilServerMessage.encode(bmsg).finish();
            test.Send(bdata, test);
        }
    }
    // Static function called from timeReceived
    // Check of the tests and see if they have messsages. Is so receive and callback.
    static ProcessPollInterval() {
        for (let test of GP.TransportTestsRunning) {
            test.PushReception();
        }
    }
    // BTransport.Close()
    Close() {
        GP.DebugLog('BTransportTest: close');
        if (GP.TransportTestsAliveIntervalID) {
            clearInterval(GP.TransportTestsAliveIntervalID);
            GP.TransportTestsAliveIntervalID = undefined;
        }
        if (GP.TransportTestsPollIntervalID) {
            clearInterval(GP.TransportTestsPollIntervalID);
            GP.TransportTestsPollIntervalID = undefined;
        }
    }
    // BTransport.Send()
    // Send the data. Places message in output queue.
    // 'data' is the encoded binary types of the message.
    Send(data) {
        this.messages.push(data);
        this.messagesSent++;
    }
    // Set a callback object for recevieving messages.
    // The passed object must have a 'procMessage' method
    SetReceiveCallbackObject(callback) {
        this.receiveCallbackObject = callback;
        // GP.DebugLog('BTransportTest: set receiveCallback');
    }
    // Return 'true' is there is data in the input queue
    get isDataAvailable() {
        return this.messages.length > 0;
    }
    get isConnected() {
        return (GP.TransportTestsPollIntervalID !== undefined);
    }
    // Return a map with statistics
    get stats() {
        return {};
    }
    // Returns a longer identifying name of transport (usually includes endpoint name)
    get info() {
        return this.itemType + ' none';
    }

}
