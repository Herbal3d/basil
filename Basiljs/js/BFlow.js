/// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

// Template for transport implmentations.
// Using 'functional pattern' from http://davidshariff.com/blog/javascript-inheritance-patterns/
//     mostly because it isolates all the children and fixes closure overlaps.

// See MessagingDesign.md for what the flow layer is supposed to do

define(['Config', 'FlatBuffers', 'BasilTypes', 'BTransportHdrGenerated'],
            function( Config, flatbuffers, BTypes, BTransportHdrG) {

    // Return a function that returns a new instance of the flow system
    return function(transport) {
        var that = {};
        // Send raw message
        that.send = function(msg) {
            this.transport.send(msg);
        };
        // Send a message with a BTransportHdr
        that.sendFlowMsg = function(msgType, msg, msgBuilder) {
            // passing callback as undefined causes the call version to not add that to the message
            this.callFlowMsg(msgType, msg, msgBuilder, undefined);
        };
        // Send a message expecting a response. The callback will be called with
        //     the message as the first parameter.
        // THis builds a new FlatBuffers message using 'msgBuilder' and expects
        //    to add to that message a BTransportHdr as well as the passed, build
        //    'msg' of the passed 'msgType'.
        // @param {int} type code of 'msg' that will go into 'msgBuilder'
        // @param {offset} built message to be included in 'msgBUilder'
        // @param {flatbuffer.Builder} builder to be used to create the wrpaaer message to send
        // @param {function} if defined, exepct a response from this message so
        //     setup 'ResponseRequested' in the BTransportHdr and call this function
        //     when  the response is received.
        that.callFlowMsg = function(msgType, msg, msgBuilder, responseCallback) {
            // This routine is supposed to be generic in that, in theory, any message
            //    that needs a BTransportHdr could be passed as 'msgBuilder'.
            //    But, because of how the FlatBuffers builders are generated,
            //    the start and end functions are not
            //    generic. THerefore, there is a test herein to find the 'starter'
            //    and 'ender' for the msssage to be built.
            // When there are more flow message types, add them here.
            var starter, ender;
            if (msgBuilder.startBasilServerMsg) {
                starter = msgBuilder.startBasilServerMsg;
                ender = msgBuilder.endBasilServerMsg;
                DebugLog('flow.callFlowMsg. Has startBasilServerMsg');
            }
            starter(this.fbb);
            if (msgBuilder.addBTransportHdr) {
                var bltSeq = this.buildSequence();
                var bltResponseRequested = this.buildResponseRequested(responseCallback);
                var bltAuth = this.buildAuth();
                var bltTrace = this.buildTrace();;

                var bltBTransportHdr = this.buildTransportHdr(bltSeq, bltResponseRequested, bltAuth, bltTrace);
                msgBuilder.addBTransportHdr(this.fbb, bltBTransportHdr)
            }
            msgBuilder.addMsgType(this.fbb, msgType);
            msgBuilder.addMsg(this.fbb, msg);
            var bltServerMsg = ender(this.fbb);

            this.fbb.finish(bltServerMsg);

            this.transport.send(this.fbb.asUint8Array(), { 'msgType': msgType });
        };
        // Respond to a flow message. Pass the incoming message so the reply can be matched.
        that.respondFlowMsg = function(incoming, msgType, msg, msgBuilder) {
        };
        // Read a message and call the callback when received. Will hang if no input yet.
        that.receive = function(completionCallback) {
            DebugLog('flow.receive. Setting callback');
            this.completionCallback = completionCallback;
        };
        // Call callback when there is data in put input queue.
        //    A way of getting called when data is available.
        //    Pass 'undefined' to turn off the callbacks.
        that.dataAvailable = function(callback) {
            DebugLog('flow.dataAvailable. Setting callback');
            this.availableCallback = callback;
        };

        that.buildSequence = function() {
            var seqBuilder = BTransportHdrG.BTransportSeqStruct;
            seqBuilder.startBTransportSeqStruct(this.fbb2);
            seqBuilder.addSequenceNum(this.fbb2, this.sequenceNum++);
            seqBuilder.addStream(this.fbb2, 0);
            seqBuilder.addQueueTime(this.fbb2, this.fbb2.createLong(Date.now()));
            return seqBuilder.endBTransportSeqStruct(this.fbb2);
        };
        // Build ResponseRequested and setup data structures for the eventual reply.
        that.buildResponseRequested = function(callback) {
            var bltResponseRequested;
            // if no response callback, there cannot be a response
            if (callback != undefined) {
                var reqBuilder = BTransportHdrG.BTransportRequestStruct;
                var thisSession = this.sessionNum++;
                var sessionKey = Math.random().toString();  // a uniqifier to stop fake responses
                reqBuilder.startBTransportRequestStruct(this.fbb2);
                reqBuilder.addSession(this.fbb2, thisSession);
                reqBuilder.addSessionKey(this.fbb2, BTypes.makeString(sessionKey));
                var bltResponseRequested = reqBuilder.endBTransportRequestStruct(this.fbb2);
                this.responses[thisSession] = { 'session': thisSession,
                                                'sessionKey': sessionKey,
                                                'callback': callback,
                                                'queued': Date.now().toString()
                };
            }
            return bltResponseRequested;
        };
        // TODO: add session authorization
        that.buildAuth = function() {
            return undefined;
        };
        // TODO: add message tracing
        that.buildTrace = function() {
            return undefined;
        };
        that.buildTransportHdr = function(bltSeq, bltReqResp, bltAuth, bltTrace) {
            var btBuilder = BTransportHdrG.BTransportHdrStruct;
            btBuilder.startBTransportHdrStruct(this.fbb2);
            if (bltSeq != undefined) btBuilder.addSeq(this.fbb2, bltSeq);
            if (bltReqResp != undefined) btBuilder.addResponseRequested(this.fbb2, bltReqResp);
            if (bltAuth != undefined) btBuilder.addAuth(this.fbb2, bltAuth);
            if (bltTrace != undefined) btBuilder.addTrace(this.fbb2, bltTrace);
            return btBuilder.endBTransportHdrStruct(this.fbb2);
        };
        that.processMessage = function(data, op, context) {
            if (context.completionCallback != undefined) {
                var cb = context.completionCallback;
                context.completionCallback = undefined;
                cb(data, op);
            }
            else {
                if (context.availableCallback != undefined) {
                    DebugLog('flow.received data. Calling availableCallback');
                    context.availableCallback(data, op);
                }
                else {
                    DebugLog('flow.received. Throwing message away because no receiver callback');
                }
            }
        };

        that.transport = transport;
        // Link to transport to processing incoming messages
        var me = that;
        transport.dataAvailable(function(data, op) {
            me.processMessage(data, op, me);
        });

        // The collection of responses we're waiting for
        that.sequenceNum = 100; // each message gets a number
        that.sessionNum = 1;    // used to pair requests with responses
        that.responses = {};
        that.availableCallback = undefined;
        that.completionCallback = undefined;
        that.fbb = new flatbuffers.Builder();
        that.fbb2 = new flatbuffers.Builder();
        if (that.fbb == undefined) {
            DebugLog('BFlow.init: fbb is undefined');
        }
        else {
            DebugLog('BFlow.init: fbb is defined');
        }
        that.me = that;

        return that;
    }

});
