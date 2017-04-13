// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

// Template for transport implmentations.
// Using 'functional pattern' from http://davidshariff.com/blog/javascript-inheritance-patterns/
//     mostly because it isolates all the children and fixes closure overlaps.
// To create a new instance: var newInstance = BTransportWebWorker();

// open(transportSpecificParameters)
// close()
// write(data)
// data = read()
// dataAvailable(callBack)
// isOpen()

define(['Config', 'BTransport'],
            function( Config, BTransport ) {

    // WebWorker transport.
    // @param {boolean} true if called by the WebWorker
    return function(isWorker) {
        var that = BTransport();

        that.msgCode = {
            Raw: 12,
            BasilServerMsg: 23
        };

        if (isWorker != undefined && isWorker) {
            // Operation if we're the web worker
            that.open = function() {
                DebugLog('transport.worker.open');
                this.worker = undefined;
                onmessage = this.onMessage;
                this.connected = true;
            };
            that.close = function() {
                DebugLog('transport.worker.close');
                this.connected = false;
                this.flushInQueue();
                this.availableCallback = undefined;
                this.receiveCallback = undefined;
            };
            that.send = function(data, type) {
                DebugLog('transport.worker.send');
                if (type == undefined) {
                    postMessage({ op: this.msgCode.Raw }, [ data.buffer ]);
                }
                else {
                    postMessage({ op: this.msgCode.BasilServerMsg }, [ data.buffer ]);
                }
            };
            that.receive = function(completionCallback) {
                DebugLog('transport.worker.receive');
                this.receiveCallback = completionCallback;
                // Apply the callback to anything already in the queue
                this.flushInQueue();
            };
            that.dataAvailable = function(callback) {
                DebugLog('transport.worker.dataAvailable');
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
            that.open = function(worker, connectionString) {
                this.worker = worker;
                this.connectionString = connectionString;
                worker.onmessage = this.onMessage;
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
            that.send = function(data, meta) {
                DebugLog('transport.main.send');
                if (meta == undefined) {
                    this.worker.postMessage({ 'op': this.msgCode.Raw }, [ data.buffer ]);
                }
                else {
                    this.worker.postMessage({ 'op': this.msgCode.BasilServerMsg, 'meta': meta }, [ data.buffer ]);
                }
            };
            that.receive = function(completionCallback) {
                DebugLog('transport.main.receive');
                this.receiveCallback = completionCallback;
                // Apply the callback to anything already in the queue
                this.flushInQueue();
            };
            that.dataAvailable = function(callback) {
                DebugLog('transport.main.dataAvailable');
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
                    this.receiveCallback( msgData[1], msgData[0] );
                    this.receiveCallback = undefined;
                }
                if (this.inQueue.length > 0 && this.availableCallback != undefined) {
                    var msgData = this.inQueue.shift();
                    this.availableCallback( msgData[1], msgData[0] );
                }
            }
        };
        // Receive massage from the other end of the WebWorker connection.
        // Since this is a WebWorker, we expect a 'msg' which is an Object which has 'op'
        //     and 'meta' optionally defined. The 'data' paramter should be the binary
        //     data.
        that.onMessage = function(msg, data) {
            var props = Object.getOwnPropertyNames(this);
            DebugLog('BTransportWW.onMesssage. this props=' + props);
            if (this.inQueue.length == 0
                    && (this.availableCallback != null || this.receiveCallback != null)) {
                // Nothing in the queue and there is a listener. Just send the message
                if (this.receiveCallback != undefined) {
                    DebugLog('transport.onMessage: Empty queue. Sending for receiveCallback. op=' + msg.op);
                    var cb = this.receiveCallback;
                    this.receiveCallback = undefined;
                    cb(data, msg);
                }
                else {
                    if (this.availableCallback != undefined) {
                        DebugLog('transport.onMessage: Empty queue. Sending for availableCallback. op=' + msg.op);
                        this.availableCallback(data, msg);
                    }
                    else {
                        DebugLog('transport.onMessage: queuing data. op=' + msg.op);
                        this.inQueue.push( [ msg, data ] );
                    }
                }
            }
            else {
                DebugLog('transport.onMessage: Stuff in queue. Queuing. len=' + this.inQueue.length);
                this.inQueue.push( [ msg, data ] );
            }
        };

        that.worker = undefined;    // no worker yet
        that.inQueue = [];
        that.availableCallback = undefined;
        that.receiveCallback = undefined;
        that.connected = false;
        that.me = that;             // for referencing myself

        return that;
    }
});
