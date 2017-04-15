/// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

// Template for transport implmentations.
// Using 'functional pattern' from http://davidshariff.com/blog/javascript-inheritance-patterns/
//     mostly because it isolates all the children and fixes closure overlaps.

// See MessagingDesign.md for what the flow layer is supposed to do

define(['Config', 'FlatBuffers', 'BasilTypes', 'BasilServerGenerated', 'BTransportHdrGenerated'],
            function( Config, flatbuffers, BTypes, BServerG, BTransportHdrG) {

    // Return a function that returns a new instance of the flow system
    return function(transport) {
        var that = {};

        that.BServerG = BServerG;

        // Send raw message
        that.send = function(msg) {
            this.transport.send(msg);
        };
        // Send a message with a BTransportHdr
        that.sendFlowMsg = function(fbb, msgType, msg) {
            // passing callback as undefined causes the call version to not add that to the message
            this.callFlowMsg(fbb, msgType, msg, undefined);
        };
        // Send a message expecting a response. The callback will be called with
        //     the message as the first parameter.
        // THis builds a new FlatBuffers message using 'msgBuilder' and expects
        //    to add to that message a BTransportHdr as well as the passed, build
        //    'msg' of the passed 'msgType'.
        // @param {int} type code of 'msg' that will go into BasilServerMsg.MsgType
        // @param {offset} built message to be included in BasilServerMsg.Msg
        // @param {function} if defined, exepct a response from this message so
        //     setup 'ResponseRequested' in the BTransportHdr and call this function
        //     when  the response is received.
        that.callFlowMsg = function(fbb, msgType, msg, responseCallback) {
            var bltSeq = this.buildSequence(fbb);
            var bltResponseRequested = this.buildResponseRequested(fbb, responseCallback);
            var bltAuth = this.buildAuth(fbb);
            var bltTrace = this.buildTrace(fbb);;

            var bltBTransportHdr = this.buildTransportHdr(fbb, bltSeq, bltResponseRequested, bltAuth, bltTrace);

            BServerG.BasilServerMsg.startBasilServerMsg(fbb);
            BServerG.BasilServerMsg.addBTransportHdr(fbb, bltBTransportHdr)
            BServerG.BasilServerMsg.addMsgType(fbb, msgType);
            BServerG.BasilServerMsg.addMsg(fbb, msg);
            var bltServerMsg = BServerG.BasilServerMsg.endBasilServerMsg(fbb);

            fbb.finish(bltServerMsg);

            this.transport.send(fbb.asUint8Array());
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

        that.buildSequence = function(fbb) {
            var seqBuilder = BTransportHdrG.BTransportSeqStruct;
            seqBuilder.startBTransportSeqStruct(fbb);
            seqBuilder.addSequenceNum(fbb, this.sequenceNum++);
            seqBuilder.addStream(fbb, 0);
            seqBuilder.addQueueTime(fbb, fbb.createLong(Date.now()));
            return seqBuilder.endBTransportSeqStruct(fbb);
        };
        // Build ResponseRequested and setup data structures for the eventual reply.
        that.buildResponseRequested = function(fbb, callback) {
            var bltResponseRequested;
            // if no response callback, there cannot be a response
            if (callback != undefined) {
                var reqBuilder = BTransportHdrG.BTransportRequestStruct;
                var thisSession = this.sessionNum++;
                var sessionKey = Math.random().toString();  // a uniqifier to stop fake responses
                reqBuilder.startBTransportRequestStruct(fbb);
                reqBuilder.addSession(fbb, thisSession);
                reqBuilder.addSessionKey(fbb, BTypes.makeString(sessionKey));
                var bltResponseRequested = reqBuilder.endBTransportRequestStruct(fbb);
                this.responses[thisSession] = { 'session': thisSession,
                                                'sessionKey': sessionKey,
                                                'callback': callback,
                                                'queued': Date.now().toString()
                };
            }
            return bltResponseRequested;
        };
        // TODO: add session authorization
        that.buildAuth = function(fbb) {
            return undefined;
        };
        // TODO: add message tracing
        that.buildTrace = function(fbb) {
            return undefined;
        };
        that.buildTransportHdr = function(fbb, bltSeq, bltReqResp, bltAuth, bltTrace) {
            var btBuilder = BTransportHdrG.BTransportHdrStruct;
            btBuilder.startBTransportHdrStruct(fbb);
            if (bltSeq != undefined) btBuilder.addSeq(fbb, bltSeq);
            if (bltReqResp != undefined) btBuilder.addResponseRequested(fbb, bltReqResp);
            if (bltAuth != undefined) btBuilder.addAuth(fbb, bltAuth);
            if (bltTrace != undefined) btBuilder.addTrace(fbb, bltTrace);
            return btBuilder.endBTransportHdrStruct(fbb);
        };

        // Received message. Read it as a BasilServerMsg and process the message type
        that.processMessage = function(data, context) {
            var pkgData = new flatbuffers.ByteBuffer(data);
            var serverMsg = BServerG.BasilServerMsg.getRootAsBasilServerMsg(pkgData);

            // Replys are odd in that the callback is through the sessions.
            switch (serverMsg.MsgType()) {
                case BServerG.BasilServerMsgMsg.GetUniqueInstanceIdResponse:
                    break;
                case BServerG.BasilServerMsgMsg.EntityPropertyResponse:
                    break;
                case BServerG.BasilServerMsgMsg.InstancePropertyResponse:
                    break;
                case BServerG.BasilServerMsgMsg.OpenSessionResponse:
                    break;
                case BServerG.BasilServerMsgMsg.AliveResponse:
                    break;
                default:
                    break;
            }

            if (context.completionCallback != undefined) {
                var cb = context.completionCallback;
                context.completionCallback = undefined;
                cb(serverMsg);
            }
            else {
                if (context.availableCallback != undefined) {
                    DebugLog('flow.received data. Calling availableCallback');
                    context.availableCallback(serverMsg);
                }
                else {
                    DebugLog('flow.received. Throwing message away because no receiver callback');
                }
            }
        };

        that.transport = transport;
        // Link to transport to processing incoming messages
        var me = that;
        transport.dataAvailable(function(data) {
            me.processMessage(data, me);
        });

        // The collection of responses we're waiting for
        that.sequenceNum = 100; // each message gets a number
        that.sessionNum = 1;    // used to pair requests with responses
        that.responses = {};
        that.availableCallback = undefined;
        that.completionCallback = undefined;

        return that;
    }

});
