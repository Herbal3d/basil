// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

// Template for transport implmentations.
// Using 'functional pattern' from http://davidshariff.com/blog/javascript-inheritance-patterns/
//     mostly because it isolates all the children and fixes closure overlaps.

// See MessagingDesign.md for what the flow layer is supposed to do

define(['Config', 'FlatBuffers', 'BasilTypes', 'BasilServerGenerated', 'BTransportHdrGenerated'],
            function( Config, Flat, BTypes, BServerG, BTransportHdrG) {

    // Return a function that returns a new instance of the flow system
    return function(transport) {
        var that = {};
        that.send = function(msg) {
            me.transport.send(msg);
        };
        that.sendFlowMsg = function(msgType, msg, msgBuilder) {
            // passing callback as undefined causes the call version to not add that to the message
            me.callFlowMsg(msgType, msg, msgBuilder, underfined);
        };
        // Send a message expecting a response. The callback will be called with
        //     the message as the first parameter.
        that.callFlowMsg = function(msgType, msg, msgBuilder, responseCallback) {
            if (msgBuilder.startBasilServerMsg) {
                var bltSeq = me.buildSequence();
                var bltResponseRequested = me.buildResponseRequested(responseCallback);
                var bltAuth = me.buildAuth();
                var bltTrace = me.buildTrace();;

                var bltBTransportHdr = me.buildTransportHdr(bltSeq, bltResponseRequested, bltAuth, bltTrace);

                msgBuilder.startBasilServerMsg(me.fbb);
                msgBuilder.addBTransportHdr(me.fbb, bltBTransportHdr)
                msgBuilder.addMsgType(me.fbb, msgType);
                msgBuilder.addMsg(me.fbb, msg);
                var bltServerMsg = msgBuilder.endBasilServerMsg(me.fbb);

                me.fbb.finish(bltServerMsg);

                me.transport.send(me.fbb.asUint8Array());
            }
        };
        // Respond to a flow message. Pass the incoming message so the reply can be matched.
        that.respondFlowMsg = function(incoming, msgType, msg, msgBuilder) {
        };
        // Read a message and call the callback when received. Will hang if no input yet.
        that.receive = function(completionCallback) {
        };
        // Call callback when there is data in put input queue.
        //    A way of getting called when data is available.
        //    Pass 'undefined' to turn off the callbacks.
        that.dataAvailable = function(callBack) {
        };

        that.buildSeq = function() {
            var seqBuilder = BTransportHdrG.org.herbal3d.protocol.basil.BTransportSeqStruct;
            seqBuilder.startBTransportSeqStruct(me.fbb);
            seqBuilder.addSequenceNumber(me.fbb, me.sequenceNum++);
            seqBuilder.addStream(me.fbb, 0);
            seqBuilder.addQueueTime(me.fbb, Date.now());
            return seqBuilder.endBTransportSeqStruct(me.fbb);
        };
        // Build ResponseRequested and setup data structures for the eventual reply.
        that.buildResponseRequested = function(callback) {
            var bltResponseRequested;
            // if no response callback, there cannot be a response
            if (callback != undefined) {
                var reqBuilder = BTransportHdrG.org.herbal3d.protocol.basil.BTransportRequestStruct;
                var thisSession = me.sessionNum++;
                var sessionKey = Math.random().toString();  // a uniqifier to stop fake responses
                reqBuilder.startBTransportRequestStruct(me.fbb);
                reqBuilder.addSession(me.fbb, thisSession);
                reqBuilder.addSessionKey(me.fbb, BTypes.makeString(sessionKey));
                var bltResponseRequested = reqBuilder.endBTransportRequestStruct(me.fbb);
                me.responses[thisSession] = { 'session': thisSession,
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
            var btBuilder = BTransportHdrG.org.herbal3d.protocol.basil.BTransportHdrStruct;
            btBuilder.startBTransportHdrStruct(me.fbb);
            if (bltSeq != undefined) btBuilder.addSeq(me.fbb, bltSeq);
            if (bltReqResp != undefined) btBuilder.addResponseRequested(me.fbb, bltReqResp);
            if (bltAuth != undefined) btBuilder.addAuth(me.fbb, bltAuth);
            if (bltTrace != undefined) btBuilder.addTrace(me.fbb, bltTrace);
            return btBuilder.endBTransportHdrStruct(me.fbb);
        };

        that.transport = transport
        // Process incoming messages
        transport.dataAvailable(function(msg) {

        });
        // The collection of responses we're waiting for
        that.sequenceNum = 100; // each message gets a number
        that.sessionNum = 1;    // used to pair requests with responses
        that.responses = {};
        that.fbb = Flat.Builder(200);
        that.me = that;

        return that;
    }

});
