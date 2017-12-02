// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).
'use strict';

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

// context for BTransportWW
// If inside a WebWorker, isWorker = true
var BTW = BTW || {};

define(['Config', 'BTransport'],
            function( Config, BTransport ) {

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
    }
});
