//@ts-check
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

// @ts-ignore
import GP from 'GP';

import { BTransport, EncodeMessage, PushReception } from './BTransport.js';
import { BasilServer as BasilServerMsgs } from 'xBasilServerMessages';
import { BException } from 'xBException';

// There are two halfs: the 'service' and the 'worker'.
export class BTransportWW extends BTransport {
    constructor(parms) {
        super(parms);
        // @ts-ignore
        if (typeof WorkerGlobalScope === 'undefined') {
            // We're the master
            // parms.transportURL is WebWorker URL to connect to
            GP.DebugLog('BTransportWW: setting up server');
            this.itemType = 'BTransport.TransportWW.Server';
            try {
                this.worker = new Worker(parms.transportURL);
                this.isWorker = false;
                this.worker.onmessage = function(d) {
                    // GP.DebugLog('BTransportWW.onmessage: rcvd');
                    this.messages.push(d.data);
                    this.stats.messagesReceived++;
                    this.PushReception();
                }.bind(this);
                this.worker.onerror = function(e) {
                    // GP.DebugLog('BTransportWW: worker error:'
                    console.log('BTransportWW: worker error:'
                                + ' ln: ' + e.lineno
                                + ', reason: ' + e.message);
                    this.Close();
                }.bind(this);
                this.SetReady();
            }
            catch(e) {
                console.log('BTransportWW: exception initializing worker: ' + e);
                // GP.DebugLog('BTransportWW: exception initializing worker: ' + e);
                throw new BException('Exception initializing worker: ' + e);
            }
        }
        else {
            // We're the worker
            GP.DebugLog('BTransportWW: setting up worker');
            this.itemType = 'BTransport.TransportWW.Client';
            this.isWorker = true;
            onmessage = function(d) {
                this.messages.push(d.data);
                this.PushReception();
            }.bind(this);
            this.SetReady();
        }
    }
    Close() {
        if (this.worker) {
            this.SetState(BItemState.SHUTDOWN);
            this.worker.terminate();
            this.worker = undefined;
        }
    }

    // Send the data. Places message in output queue
    Send(data) {
        let emsg = EncodeMessage(data, this);
        // GP.DebugLog('BTransportWW.Send: sending: ' + JSON.stringify(emsg));
        if (this.worker) {
            this.worker.postMessage(emsg);
        }
        else {
            // @ts-ignore
            postMessage(emsg);
        }
        this.stats.messagesSent++;
    }

    // Set a calback to be called whenever a message is received
    SetReceiveCallbackObject(callback) {
        this.receiveCallbackObject = callback;
        // GP.DebugLog('BTransportWW: set receiveCallback');
    }

    // Return 'true' is there is data in the input queue
    get isDataAvailable() {
        // @ts-ignore
        return this.messsages.length > 0;
    }
    get isConnected() {
        return this.worker !== undefined;
    }
}
