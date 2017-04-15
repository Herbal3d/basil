// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

// This module retuns a factory funciton for creating a BasilServer instance.
// The invocation is:
//      define(['BasilServer']) function(BServer) {
//          ...
//          var aServerConnection = BServer(BFlowInstance);
//          ...
//          aServerConnection.AddEntity(auth, entityId, aabb);
//          ...
//          aServerConnection.Close();
//          ...
//      }

// Global holding Basil server
var BS = BS || {};

define(['Config', 'FlatBuffers', 'BasilTypes', 'BasilServerGenerated'],
            function( Config, flatbuffers, BTypes, BServerG) {

    GP.BS = BS; // For debugging. Don't use for cross package access.

    BS.Instances = [];

    // Return a factory that creates a BasilServer communication object
    return function(aFlow) {
        var that = {};
        that.AddEntity = function(auth, objectId, assetInfo, aabb) {
                var fbb = new flatbuffers.Builder();
                var msgBuilder = BServerG.AddEntity;
                msgBuilder.startAddEntity(fbb);
                msgBuilder.addAuth(fbb, BTypes.makeAuth(auth));
                msgBuilder.addObjectId(fbb, BTypes.makeObjectId(objectId));
                msgBuilder.addAssetInfo(fbb, BTypes.makeAssetInfo(assetInfo));
                msgBuilder.addAabb(fbb, this.makeAabb(aabb));
                var bltMsg = msgBuilder.endAddEntity(fbb);
                this.flow.sendFlowMsg(fbb, BServerG.BasilServerMsgMsg.AddEntity, bltMsg);
        };
        that.RemoveEntity = function(auth, objectId) {
                var fbb = new flatbuffers.Builder();
                var msgBuilder = BServerG.RemoveEntity;
                msgBuilder.startRemoveEntity(fbb);
                msgBuilder.addAuth(fbb, BTypes.makeAuth(auth));
                msgBuilder.addObjectId(fbb, BTypes.makeObjectId(objectId));
                var bltMsg = msgBuilder.endRemoveEntity(fbb);
                this.flow.sendFlowMsg(fbb, BServerG.BasilServerMsgMsg.RemoveEntity, bltMsg);
        };
        that.AddInstance = function(auth, instanceId, pos, propertiesToSet) {
                var fbb = new flatbuffers.Builder();
                var msgBuilder = BServerG.AddInstance;
                var props = (propertiesToSet == undefined) ? undefined : BTypes.makePropertyList(propertiesToSet);
                msgBuilder.startAddInstance(fbb);
                msgBuilder.addAuth(fbb, BTypes.makeAuth(auth));
                msgBuilder.addInstanceId(fbb, BTypes.makeInstanceId(objectId));
                msgBuilder.addPos(fbb, BTypes.makeCoordPosition(pos));
                if (props != undefined) msgBuilder.addPropertiesToSet(fbb, props);
                var bltMsg = msgBuilder.endAddInstance(fbb);
                this.flow.sendFlowMsg(fbb, BServerG.BasilServerMsgMsg.AddInstance, bltMsg);
        };
        that.RemoveInstance = function(auth, instanceId) {
                var fbb = new flatbuffers.Builder();
                var msgBuilder = BServerG.RemoveInstance;
                msgBuilder.startRemoveInstance(fbb);
                msgBuilder.addAuth(fbb, BTypes.makeAuth(auth));
                msgBuilder.addInstanceId(fbb, BTypes.makeInstanceId(objectId));
                var bltMsg = msgBuilder.endRemoveInstance(fbb);
                this.flow.sendFlowMsg(fbb, BServerG.BasilServerMsgMsg.RemoveInstance, bltMsg);
        };
        that.GetUniqueInstanceId = function(newIdCallback) {
                var fbb = new flatbuffers.Builder();
                var msgBuilder = BServerG.GetUniqueInstanceId;
                msgBuilder.startGetUniqueInstanceId(fbb);
                var bltMsg = msgBuilder.endGetUniqueInstanceId(fbb);
                this.flow.callFlowMsg(fbb, BServerG.BasilServerMsgMsg.GetUniqueInstanceId,
                            bltMsg, BServerG.BasilServerMsg,
                    function(response) {
                        // Response should come back as an instance of BasilServerMsg.
                        if (response.MsgType != BServerG.BasilServerMsgMsg.GetUniqueInstanceIdResponse) {
                            throw 'BasilServer.GetUniqueInstanceId: response message type not correct';
                        }
                        var msgBuilder = BServerG.GetUniqueInstanceIdResponse;
                        var resp = msgBuilder.getRootAsGetUniqueInstanceResponse(ms.fbb, response.Msg);
                        var newID = resp.instanceId;
                        newIdCallback(newId);
                    }
                );
        };
        that.GetUniqueInstanceIdResponse = function(incoming, instanceId) {
                var fbb = new flatbuffers.Builder();
                var msgBuilder = BServerG.GetUniqueInstanceIdResponse;
                msgBuilder.startGetUniqueInstanceIdResponse(fbb);
                msgBuilder.addInstanceId(fbb, BTypes.makeInstanceId(instanceId));
                var bltMsg = msgBuilder.endGetUniqueInstanceIdResponse(fbb);
                this.flow.respondFlowMsg(fbb, incoming,
                    BServerG.BasilServerMsgMsg.GetUniqueInstanceIdResponse,
                    bltMsg, BServerG.BasilServerMsg);
        };
        that.UpdateEntityProperty = function(auth, objectId, propsToUpdate) {
                var fbb = new flatbuffers.Builder();
                var msgBuilder = BServerG.UpdateEntityProperty;
                msgBuilder.startUpdateEntityProperty(fbb);
                msgBuilder.addAuth(fbb, BTypes.makeAuth(auth));
                msgBuilder.addObjectId(fbb, BTypes.makeObjectId(objectId));
                msgBuilder.addProps(fbb, BTypes.makePropertyList(propsToUpdate));
                var bltMsg = msgBuilder.endUpdateEntityProperty(fbb);
                this.flow.sendFlowMsg(fbb, BServerG.BasilServerMsgMsg.UpdateEntityProperty, bltMsg);
        };
        that.UpdateInstanceProperty = function(auth, instanceId, propsToUpdate) {
                var fbb = new flatbuffers.Builder();
                var msgBuilder = BServerG.UpdateInstanceProperty;
                msgBuilder.startUpdateInstanceProperty(fbb);
                msgBuilder.addAuth(fbb, BTypes.makeAuth(auth));
                msgBuilder.addInstanceId(fbb, BTypes.makeInstanceId(objectId));
                msgBuilder.addProps(fbb, BTypes.makePropertyList(propsToUpdate));
                var bltMsg = msgBuilder.endUpdateInstanceProperty(fbb);
                this.flow.sendFlowMsg(fbb, BServerG.BasilServerMsgMsg.UpdateInstanceProperty, bltMsg);
        };
        that.UpdateInstancePosition = function(auth, instanceId, pos) {
                var fbb = new flatbuffers.Builder();
                var msgBuilder = BServerG.UpdateInstancePosition;
                msgBuilder.startUpdateInstancePosition(fbb);
                msgBuilder.addAuth(fbb, BTypes.makeAuth(auth));
                msgBuilder.addInstanceId(fbb, BTypes.makeInstanceId(objectId));
                msgBuilder.addPos(fbb, BTypes.makePositionInfo(pos));
                var bltMsg = msgBuilder.endUpdateInstancePosition(fbb);
                this.flow.sendFlowMsg(fbb, BServerG.BasilServerMsgMsg.UpdateInstancePosition, bltMsg);
        };
        that.EntityPropertyRequest = function(auth, objectId, filter, propCallback) {
                var fbb = new flatbuffers.Builder();
                var msgBuilder = BServerG.EntityPropertyRequest;
                msgBuilder.startEntityPropertyRequest(fbb);
                msgBuilder.addAuth(fbb, BTypes.makeAuth(auth));
                msgBuilder.addObjectId(me.fbb, BTypes.makeObjectId(objectId));
                msgBuilder.addPropertyMatch(fbb, this.makeString(filter));
                var bltMsg = msgBuilder.endEntityPropertyRequest(fbb);
                this.flow.callFlowMsg(fbb, BServerG.BasilServerMsgMsg.EntityPropertyRequest,
                            bltMsg, BServerG.BasilServerMsg,
                    function(response) {
                        var fetchedProperties = GetThePropertiesFromTheResponseMsg;
                        // Response should come back as an instance of BasilServerMsg.
                        if (response.MsgType != BServerG.BasilServerMsgMsg.EntityPropertyResponse) {
                                throw 'BasilServer.EntityPropertyRequest: response message type not correct';
                        }
                        var fbb2 = new flatbuffers.Builder();
                        // TODO: THIS CODE IS WRONG!
                        var msgBuilder = BServerG.EntityPropertyResponse();
                        var resp = msgBuilder.getRootAsEntityPropertyResponse(fbb2, response.Msg);
                        var fetchedProperties = BTypes.extractPropertyList(resp.props);
                        propCallback(fetchedProperties);
                    }
                );
        };
        that.EntityPropertyResponse = function(objectId, props) {
        };
        that.InstancePropertyRequest = function(auth, objectId, filter, propCallback) {
                var fbb = new flatbuffers.Builder();
                var msgBuilder = BServerG.InstancePropertyRequest;
                msgBuilder.startInstancePropertyRequest(fbb);
                msgBuilder.addAuth(fbb, BTypes.makeAuth(auth));
                msgBuilder.addObjectId(fbb, BTypes.makeObjectId(objectId));
                msgBuilder.addPropertyMatch(fbb, this.makeString(filter));
                var bltMsg = msgBuilder.endInstancePropertyRequest(fbb);
                this.flow.callFlowMsg(fbb, BServerG.BasilServerMsgMsg.InstancePropertyRequest,
                            bltMsg, BServerG.BasilServerMsg,
                    function(response) {
                        // Response should come back as an instance of BasilServerMsg.
                        if (response.MsgType() != BServerG.BasilServerMsgMsg.InstancePropertyResponse) {
                                throw 'BasilServer.InstancePropertyRequest: response message type not correct';
                        }
                        // TODO: THIS CODE IS WRONG
                        var fbb2 = new flatbuffers.Builder();
                        var msgBuilder = BServerG.InstancePropertyResponse;
                        var resp = msgBuilder.getRootAsInstancePropertyResponse(fbb2, response.Msg);
                        var fetchedProperties = BTypes.extractPropertyList(resp.props);
                        propCallback(fetchedProperties);
                    }
                );
        };
        that.InstancePropertyResponse = function(instanceId, props) {
        };
        that.Close = function() {
        };
        that.OpenSession = function(auth, props, openedCallback) {
        };
        that.OpenSessionResponse = function(features) {
        };
        that.CloseSession = function(reason) {
        };
        that.aliveSequenceNumber = 11;
        that.AliveCheck = function() {
            // var msgBuilder = BServerG.AliveCheck;
            var fbb = new flatbuffers.Builder();
            var msgBuilder = BServerG.AliveCheck;
            msgBuilder.startAliveCheck(fbb);
            msgBuilder.addTime(fbb, fbb.createLong(Date.now()));
            msgBuilder.addSequenceNumber(fbb, this.aliveSequenceNumber++);
            var bltMsg = msgBuilder.endAliveCheck(fbb);
            DebugLog('BasilServer.AliveCheck: sending AliveCheck. seq=' + (this.aliveSequenceNumber - 1));
            this.flow.sendFlowMsg(fbb, BServerG.BasilServerMsgMsg.AliveCheck, bltMsg,
                function(response) {
                    DebugLog('BasilServer.AliveCheck: received AliveCheckResponse');
                }
            );
        };
        that.AliveResponse = function(incoming, time, sequenceNum, timeArrived, sequenceNumReceived) {
        };

        // =====================================================================
        that.processIncoming = function(serverMsg, context) {
            DebugLog('BasilServer.processIncoming: received msg. type=' + serverMsg.MsgType());

            switch (serverMsg.MsgType()) {
                case BServerG.BasilServerMsgMsg.AddEntity:
                    break;
                case BServerG.BasilServerMsgMsg.RemoveEntity:
                    break;
                case BServerG.BasilServerMsgMsg.AddInstance:
                    break;
                case BServerG.BasilServerMsgMsg.RemoveInstance:
                    break;
                case BServerG.BasilServerMsgMsg.GetUniqueInstanceId:
                    break;
                case BServerG.BasilServerMsgMsg.GetUniqueInstanceIdResponse:
                    break;
                case BServerG.BasilServerMsgMsg.UpdateEntityProperty:
                    break;
                case BServerG.BasilServerMsgMsg.UpdateInstanceProperty:
                    break;
                case BServerG.BasilServerMsgMsg.UpdateInstancePosition:
                    break;
                case BServerG.BasilServerMsgMsg.EntityPropertyRequest:
                    break;
                case BServerG.BasilServerMsgMsg.EntityPropertyResponse:
                    break;
                case BServerG.BasilServerMsgMsg.InstancePropertyRequest:
                    break;
                case BServerG.BasilServerMsgMsg.InstancePropertyResponse:
                    break;
                case BServerG.BasilServerMsgMsg.OpenSession:
                    break;
                case BServerG.BasilServerMsgMsg.OpenSessionResponse:
                    break;
                case BServerG.BasilServerMsgMsg.CloseSession:
                    break;
                case BServerG.BasilServerMsgMsg.AliveCheck:
                    var transHdr = serverMsg.BTransportHdr();
                    var seq = transHdr.seq();
                    if (seq) {
                        DebugLog('BasilServer.processIncoming: seqNum=' + seq.sequenceNum() + ', seq.stream=' + seq.stream());
                    }
                    var aliveCheckMsg = serverMsg.Msg(new BServerG.AliveCheck());
                    DebugLog('BasilServer.processIncoming: AliveCheck.'
                                + ' time=' + aliveCheckMsg.time()
                                + ', seq=' + aliveCheckMsg.sequenceNumber());
                    break;
                case BServerG.BasilServerMsgMsg.AliveResponse:
                    break;
                default:
                    break;
            }

        }

        // Add links to underlying libraries to this instance
        that.flow = aFlow;
        var me = that;
        aFlow.dataAvailable(function(data) {
            me.processIncoming(data, me);
        } );

        that.BServerG = BServerG;
        that.flat = flatbuffers;

        // remember this instance for debugging
        BS.Instances.push(that);

        return that;
    }
});
