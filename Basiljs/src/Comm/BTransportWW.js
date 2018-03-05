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

import { BTransport } from './BTransport.js';

// There are two halfs: the 'service' and the 'worker'.
export default class BTransportWW extends BTransport {
    constructor(parms) {
        super();
    }
    Open(connectionString) {
    }
    Close() {
    }
    // Send the data. Places message in output queue
    // 'tcontext' is optional and used for RPC responses.
    Send(data, tcontext) {
        let emsg = super.EncodeMessage(data, tcontext);
    }
    // Send a messsage and expect a replay of some type.
    // Returns a promise
    SendRPC(data) {
        return new Promise((resolve, reject) => {
            let emsg = super.EncodeRPCMessage(data, resolve, reject);
            // SEND MESSAGE
         });
        GP.DebugLog('BTransportWW: SendRPC()');
    }
    // Get data in the input queue. Returns a Promise as might wait for data.
    Receive() {
        GP.DebugLog('BTransportWW: call of undefined Receive()');
        throw new BException('BTransportWW: call of undefined Receive()');
    }
    // Set a calback to be called whenever a message is received
    SetReceiveCallback(callback) {
        GP.DebugLog('BTransportWW: call of undefined SetReceiveCallback()');
        throw new BException('BTransportWW: call of undefined SetReceiveCallback()');
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
        return 'BTransportWW';
    }
    // Returns a longer identifying name of transport (usually includes endpoint name)
    get info() {
        return this.type + ' none';
    }


    /* OLD CODE
    BTW.isWorker = false;

    // WebWorker transport.
    // @param {boolean} true if called by the WebWorker
    return function(isWorker) {
        var that = BTransport();

        that.msgCode = {
            Raw: 12,
            BasilServerMsg: 23
        };

        if (isWorker != undefined && isWorker) {
            BTW.isWorker = true;
            // Operation if we're the web worker
            that.open = function() {
                GP.DebugLog('transport.worker.open');
                this.worker = undefined;
                var me = this;
                onmessage = function(msg) {
                    me.processMessage(msg, me);
                };
                this.connected = true;
            };
            that.close = function() {
                GP.DebugLog('transport.worker.close');
                this.connected = false;
                this.flushInQueue();
                this.availableCallback = undefined;
                this.receiveCallback = undefined;
            };
            that.send = function(data) {
                GP.DebugLog('transport.worker.send');
                postMessage(
                    { 'op': this.msgCode.BasilServerMsg, 'data': data },
                    [ data.buffer ]
                );
            };
            that.receive = function(completionCallback) {
                GP.DebugLog('transport.worker.receive');
                this.receiveCallback = completionCallback;
                // Apply the callback to anything already in the queue
                this.flushInQueue();
            };
            that.dataAvailable = function(callback) {
                GP.DebugLog('transport.worker.dataAvailable');
                this.availableCallback = callback;
                // Apply the callback to anything already in the queue
                this.flushInQueue();
            };
            // Return 'true' if this transport is open and running
            that.isOpen = function() {
                return this.connected;
            };
        }
        else {
            // Operations if we're the main browser
            BTW.isWorker = false;

            that.open = function(worker, connectionString) {
                this.worker = worker;
                this.connectionString = connectionString;
                var me = this;
                worker.onmessage = function(msg) {
                    me.processMessage(msg, me);
                };
                this.connected = true;
            };
            that.close = function() {
                this.connected = false;
                if (this.worker != undefined) {
                    this.worker.onmessage = undefined;
                }
                this.flushInQueue();
                this.availableCallback = undefined;
                this.receiveCallback = undefined;
            };
            that.send = function(data) {
                GP.DebugLog('transport.main.send');
                this.worker.postMessage(
                    { 'op': this.msgCode.BasilServerMsg, 'data': data},
                    [ data.buffer ]
                );
            };
            that.receive = function(completionCallback) {
                GP.DebugLog('transport.main.receive');
                this.receiveCallback = completionCallback;
                // Apply the callback to anything already in the queue
                this.flushInQueue();
            };
            that.dataAvailable = function(callback) {
                GP.DebugLog('transport.main.dataAvailable');
                this.availableCallback = callback;
                // Apply the callback to anything already in the queue
                this.flushInQueue();
            };
            // Return 'true' if this transport is open and running
            that.isOpen = function() {
                return this.connected;
            };
        }

        // Push as many queued messages as we can
        that.flushInQueue = function() {
            while (this.inQueue.length > 0
                    && (this.availableCallback != null || this.receiveCallback != null)) {
                if (this.receiveCallback != undefined) {
                    var msgData = this.inQueue.shift();
                    this.receiveCallback( msgData[0] );
                    this.receiveCallback = undefined;
                }
                if (this.inQueue.length > 0 && this.availableCallback != undefined) {
                    var msgData = this.inQueue.shift();
                    this.availableCallback( msgData[0] );
                }
            }
        };
        // Receive massage from the other end of the WebWorker connection.
        that.processMessage = function(msg, context) {
            var op = msg.data.op;
            var data = msg.data.data;
            if (context.inQueue.length == 0
                    && (context.availableCallback != null || context.receiveCallback != null)) {
                // Nothing in the queue and there is a listener. Just send the message
                if (context.receiveCallback != undefined) {
                    GP.DebugLog('transport.onMessage: Empty queue. Sending for receiveCallback. op=' + op);
                    var cb = context.receiveCallback;
                    context.receiveCallback = undefined;
                    cb(data);
                }
                else {
                    if (context.availableCallback != undefined) {
                        GP.DebugLog('transport.onMessage: Empty queue. Sending for availableCallback. op=' + msg.op);
                        context.availableCallback(data);
                    }
                    else {
                        GP.DebugLog('transport.onMessage: queuing data. op=' + msg.op);
                        context.inQueue.push( [ data ] );
                    }
                }
            }
            else {
                GP.DebugLog('transport.onMessage: Stuff in queue. Queuing. len=' + this.inQueue.length);
                context.inQueue.push( [ data ] );
            }
        };

        that.worker = undefined;    // no worker yet
        that.inQueue = [];
        that.availableCallback = undefined;
        that.receiveCallback = undefined;
        that.connected = false;
        that.me = that;             // for referencing myself

        return that;
*/

}
