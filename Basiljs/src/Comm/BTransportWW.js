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

import { BTransport, EncodeMessage, EncodeRPCMessage, PushReception } from './BTransport.js';
import { BasilServer as BasilServerMsgs } from 'xBasilServerMessages';
import { BException } from 'xBException';

// There are two halfs: the 'service' and the 'worker'.
export default class BTransportWW extends BTransport {
    constructor(parms) {
        super(parms);
        if (typeof WorkerGlobalScope === undefined) {
            // We're the master
            // parms.transportURL is WebWorker URL to connect to
            try {
                this.worker = new Worker(parms.transportURL);
                this.isWorker = false;
                let xport = this;   // for closeure of message function
                this.worker.onmessage = function(d) {
                    xport.messages.push(d.data);
                    GP.DebugLog('BTransportWW: data type = ' + typeof d.data);
                    PushReception(xport);
                }
                this.worker.onerror = function(e) {
                    GP.DebugLog('BTransportWW: worker error:'
                                + ' ln: ' + e.lineno
                                + ', reason: ' + e.message);
                    xport.Close();
                }
            }
            catch(e) {
                GP.DebugLog('BTransportWW: exception initializing worker: ' + e);
                throw new BException('Exception initializing worker: ' + e);
            }
        }
        else {
            // We're the worker
            this.isWorker = true;
            let xport = this;   // for closeure of message function
            onmessage = function(d) {
                xport.messages.push(d.data);
                PushReception(xport);
            }
        }
    }
    Close() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = undefined;
        }
    }
    // Send the data. Places message in output queue
    // 'tcontext' is optional and used for RPC responses.
    Send(data, tcontext, tthis) {
        let tester = tthis === undefined ? this : tthis;
        let emsg = EncodeMessage(data, tcontext, tester);
        if (tester.worker) {
            tester.worker.postMessage(emsg, [emsg]);
        }
        else {
            postMessage(emsg, [emsg]);
        }
        tester.messagesSent++;
        PushReception(tester);
    }
    // Send a messsage and expect a replay of some type.
    // Returns a promise
    SendRPC(data, tthis) {
        let tester = tthis === undefined ? this : tthis;
        return new Promise((resolve, reject) => {
            console.log('BTransportWW: SendRPC:' + JSON.stringify(data));
            let emsg = EncodeRPCMessage(data, resolve, reject, tester);
            if (tester.worker) {
                tester.worker.postMessage(emsg, [emsg]);
            }
            else {
                postMessage(emsg, [emsg]);
            }
            tester.RPCmessagesSent++;
            tester.messagesSent++;
         });
        PushReception(tester);
    }
    // Set a calback to be called whenever a message is received
    SetReceiveCallbackObject(callback) {
        this.receiveCallbackObject = callback;
        // GP.DebugLog('BTransportWW: set receiveCallback');
    }

    // Return 'true' is there is data in the input queue
    get isDataAvailable() {
        return this.messsages.length > 0;
    }
    get isConnected() {
        return this.worker !== undefined;
    }
    // Return a map with statistics
    get stats() {
        return {};
    }
    // Returns type of the transport. Like 'WW' or 'WS'.
    get type() {
        return 'BTransportWW';
    }
    // Returns a longer identifying name of transport (usually includes endpoint name)
    get info() {
        return this.type + ' none';
    }
}
