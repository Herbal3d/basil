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
import Config from '../config.js';

import { BTransport } from './BTransport.js';
import { CombineParameters } from '../Utilities.js';
import { BException } from '../BException.js';

// There are two halfs: the 'service' and the 'worker'.
export class BTransportWW extends BTransport {
    constructor(parms) {
        let params = CombineParameters(Config.comm.TransportWW, parms, {
            'transportURL': undefined   // name of Worker to connect to
        });
        super(params);
        this.params = params;
        this.SetLoading();
        // @ts-ignore
        if (typeof WorkerGlobalScope === 'undefined') {
            // We're the master
            // this.params.transportURL is WebWorker URL to connect to
            GP.DebugLog('BTransportWW: setting up server');
            this.itemType = 'BTransport.TransportWW.Server';
            try {
                this.worker = new Worker(this.params.transportURL);
                this.isWorker = false;
                this.worker.onmessage = function(d) {
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
            this.SetShutdown();
            this.worker.terminate();
            this.worker = undefined;
        }
    }

    // Send the data. Places message in output queue
    Send(data) {
        if (this.worker) {
            this.worker.postMessage(data);
        }
        else {
            // @ts-ignore
            postMessage(data);
        }
        this.stats.messagesSent++;
    }

    // Set a calback to be called whenever a message is received
    SetReceiveCallback(callback) {
        this.receiveCallback = callback;
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
