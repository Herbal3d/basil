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
import Config from '../config.js';

import { BTransport } from './BTransport.js';
import { CombineParameters } from '../Utilities.js';
import { BException } from '../BException.js';

// There are two halfs: the 'service' and the 'worker'.
export class BTransportWS extends BTransport {
    constructor(pParams) {
        let params = CombineParameters(Config.comm.TransportWW, pParams, {
            'transportURL': undefined   // name of Worker to connect to
        });
        super(params);
        this.params = params;
        this.SetLoading();
        this.itemTYpe = 'BTransport.TransportWS';
        try {
            let tempSocket = new WebSocket(this.params.transportURL);
            if (tempSocket) {
                // Socket is opened so put it in a place where everyone can use it
                this.socket = tempSocket;
                this.socket.binaryType = 'arraybuffer';
                this.socket.addEventListener('message', function(event) {
                    this.messages.push(new Uint8Array(event.data));
                    this.stats.messagesReceived++;
                    this.PushReception();
                }.bind(this));
                this.socket.addEventListener('open', function(event) {
                    this.SetReady();
                }.bind(this));
            }
            else {
                let errMsg = 'BTransportWS: could not open websocket: ' + parms.transportURL;
                this.SetFailed();
                console.log(errMsg);
                GP.ErrorLog(errMsg);
                throw new BException(errMsg);
            }
        }
        catch (e) {
            let errMsg = 'BTransportWS: exception opening websocket: ' + e.message;
            this.SetFailed();
            console.log(errMsg);
            GP.ErrorLog(errMsg);
            throw new BException(errMsg);
        }
    }
    Close() {
        if (this.socket) {
            this.SetShutdown();
            this.socket.close();
            this.socket = undefined;
        }
    }
    // Send the data. Places message in output queue
    Send(data) {
        if (this.socket) {
            this.socket.send(data);
            this.stats.messagesSent++;
        }
  
    }
    // Set a calback to be called whenever a message is received
    SetReceiveCallback(callback) {
        this.receiveCallback = callback;
        // GP.DebugLog('BTransportWS: set receiveCallback');
    }
    // Return 'true' is there is data in the input queue
    get isDataAvailable() {
        return this.messsages.length > 0;
    }
    get isConnected() {
        return (typeof this.socket !== 'undefined');
    }
}
