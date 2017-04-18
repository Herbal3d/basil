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

define(['Config', 'FlatBuffers', 'BasilTypes', 'BasilServerGenerated', 'BFlowGenerated'],
            function( Config, flatbuffers, BTypes, BServerG, BFlowG) {

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
                this.flow.sendFlowMsg(fbb, BFlowG.BFlowMsgMsg.server_AddEntity, bltMsg);
        };
        that.RemoveEntity = function(auth, objectId) {
                var fbb = new flatbuffers.Builder();
                var msgBuilder = BServerG.RemoveEntity;
                msgBuilder.startRemoveEntity(fbb);
                msgBuilder.addAuth(fbb, BTypes.makeAuth(auth));
                msgBuilder.addObjectId(fbb, BTypes.makeObjectId(objectId));
                var bltMsg = msgBuilder.endRemoveEntity(fbb);
                this.flow.sendFlowMsg(fbb, BFlowG.BFlowMsgMsg.server_RemoveEntity, bltMsg);
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
                this.flow.sendFlowMsg(fbb, BFlowG.BFlowMsgMsg.server_AddInstance, bltMsg);
        };
        that.RemoveInstance = function(auth, instanceId) {
                var fbb = new flatbuffers.Builder();
                var msgBuilder = BServerG.RemoveInstance;
                msgBuilder.startRemoveInstance(fbb);
                msgBuilder.addAuth(fbb, BTypes.makeAuth(auth));
                msgBuilder.addInstanceId(fbb, BTypes.makeInstanceId(objectId));
                var bltMsg = msgBuilder.endRemoveInstance(fbb);
                this.flow.sendFlowMsg(fbb, BFlowG.BFlowMsgMsg.server_RemoveInstance, bltMsg);
        };
        that.GetUniqueInstanceId = function(newIdCallback) {
                var fbb = new flatbuffers.Builder();
                var msgBuilder = BServerG.GetUniqueInstanceId;
                msgBuilder.startGetUniqueInstanceId(fbb);
                var bltMsg = msgBuilder.endGetUniqueInstanceId(fbb);
                this.flow.callFlowMsg(fbb, BFlowG.BFlowMsgMsg.server_GetUniqueInstanceId, bltMsg,
                    function(response) {
                        // Response should come back as an instance of BasilServerMsg.
                        if (response.MsgType != BFlowG.BFlowMsgMsg.server_GetUniqueInstanceIdResponse) {
                            throw 'BasilServer.GetUniqueInstanceId: response message type not correct';
                        }
                        var getUniqueInstanceIdResponse = response.Msg(new BServerG.GetUniqueInstanceIdResponse());
                        var newID = getUniqueInstanceIdResponse.instanceId();
                        newIdCallback(newId);
                    }
                );
        };
        that.GetUniqueInstanceIdResponse = function(incoming, instanceId) {
                var fbb = new flatbuffers.Builder();
                var msgBuilder = BFlowG.GetUniqueInstanceIdResponse;
                msgBuilder.startGetUniqueInstanceIdResponse(fbb);
                msgBuilder.addInstanceId(fbb, BTypes.makeInstanceId(instanceId));
                var bltMsg = msgBuilder.endGetUniqueInstanceIdResponse(fbb);
                this.flow.respondFlowMsg(fbb, incoming,
                    BFlowG.BFlowMsgMsg.server_GetUniqueInstanceIdResponse,
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
                this.flow.sendFlowMsg(fbb, BFlowG.BFlowMsgMsg.server_UpdateEntityProperty, bltMsg);
        };
        that.UpdateInstanceProperty = function(auth, instanceId, propsToUpdate) {
                var fbb = new flatbuffers.Builder();
                var msgBuilder = BServerG.UpdateInstanceProperty;
                msgBuilder.startUpdateInstanceProperty(fbb);
                msgBuilder.addAuth(fbb, BTypes.makeAuth(auth));
                msgBuilder.addInstanceId(fbb, BTypes.makeInstanceId(objectId));
                msgBuilder.addProps(fbb, BTypes.makePropertyList(propsToUpdate));
                var bltMsg = msgBuilder.endUpdateInstanceProperty(fbb);
                this.flow.sendFlowMsg(fbb, BFlowG.BFlowMsgMsg.server_UpdateInstanceProperty, bltMsg);
        };
        that.UpdateInstancePosition = function(auth, instanceId, pos) {
                var fbb = new flatbuffers.Builder();
                var msgBuilder = BServerG.UpdateInstancePosition;
                msgBuilder.startUpdateInstancePosition(fbb);
                msgBuilder.addAuth(fbb, BTypes.makeAuth(auth));
                msgBuilder.addInstanceId(fbb, BTypes.makeInstanceId(objectId));
                msgBuilder.addPos(fbb, BTypes.makePositionInfo(pos));
                var bltMsg = msgBuilder.endUpdateInstancePosition(fbb);
                this.flow.sendFlowMsg(fbb, BFlowG.BFlowMsgMsg.server_UpdateInstancePosition, bltMsg);
        };
        that.EntityPropertyRequest = function(auth, objectId, filter, propCallback) {
                var fbb = new flatbuffers.Builder();
                var msgBuilder = BServerG.EntityPropertyRequest;
                msgBuilder.startEntityPropertyRequest(fbb);
                msgBuilder.addAuth(fbb, BTypes.makeAuth(auth));
                msgBuilder.addObjectId(me.fbb, BTypes.makeObjectId(objectId));
                msgBuilder.addPropertyMatch(fbb, this.makeString(filter));
                var bltMsg = msgBuilder.endEntityPropertyRequest(fbb);
                this.flow.callFlowMsg(fbb, BFlowG.BFlowMsgMsg.server_EntityPropertyRequest, bltMsg,
                    function(response) {
                        // Response should come back as an instance of BasilServerMsg.
                        if (response.MsgType != BFlowG.BFlowMsgMsg.server_EntityPropertyResponse) {
                                throw 'BasilServer.EntityPropertyRequest: response message type not correct';
                        }
                        var entityPropertyResponse = response.Msg(new BServer.EntityPropertyResponse());
                        var fetchedProperties = BTypes.extractPropertyList(entityPropertyResponse.props());
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
                this.flow.callFlowMsg(fbb, BFlowG.BFlowMsgMsg.server_InstancePropertyRequest,
                            bltMsg, BServerG.BasilServerMsg,
                    function(response) {
                        // Response should come back as an instance of BasilServerMsg.
                        if (response.MsgType() != BFlowG.BFlowMsgMsg.server_InstancePropertyResponse) {
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
            this.flow.sendFlowMsg(fbb, BFlowG.BFlowMsgMsg.server_AliveCheck, bltMsg,
                function(response) {
                    DebugLog('BasilServer.AliveCheck: received AliveCheckResponse');
                }
            );
        };
        that.AliveResponse = function(incoming, time, sequenceNum, timeArrived, sequenceNumReceived) {
        };

        // =====================================================================
        that.processIncoming = function(flowMsg, context) {
            DebugLog('BasilServer.processIncoming: received msg. type=' + flowMsg.msgType());

            switch (flowMsg.msgType()) {
                case BFlowG.BFlowMsgMsg.server_AddEntity:
                    break;
                case BFlowG.BFlowMsgMsg.server_RemoveEntity:
                    break;
                case BFlowG.BFlowMsgMsg.server_AddInstance:
                    break;
                case BFlowG.BFlowMsgMsg.server_RemoveInstance:
                    break;
                case BFlowG.BFlowMsgMsg.server_GetUniqueInstanceId:
                    break;
                case BFlowG.BFlowMsgMsg.server_GetUniqueInstanceIdResponse:
                    break;
                case BFlowG.BFlowMsgMsg.server_UpdateEntityProperty:
                    break;
                case BFlowG.BFlowMsgMsg.server_UpdateInstanceProperty:
                    break;
                case BFlowG.BFlowMsgMsg.server_UpdateInstancePosition:
                    break;
                case BFlowG.BFlowMsgMsg.server_EntityPropertyRequest:
                    break;
                case BFlowG.BFlowMsgMsg.server_EntityPropertyResponse:
                    break;
                case BFlowG.BFlowMsgMsg.server_InstancePropertyRequest:
                    break;
                case BFlowG.BFlowMsgMsg.server_InstancePropertyResponse:
                    break;
                case BFlowG.BFlowMsgMsg.server_OpenSession:
                    break;
                case BFlowG.BFlowMsgMsg.server_OpenSessionResponse:
                    break;
                case BFlowG.BFlowMsgMsg.server_CloseSession:
                    break;
                case BFlowG.BFlowMsgMsg.server_AliveCheck:
                    var seq = flowMsg.seq();
                    if (seq) {
                        DebugLog('BasilServer.processIncoming: seqNum=' + seq.sequenceNum() + ', seq.stream=' + seq.stream());
                    }
                    var aliveCheckMsg = flowMsg.msg(new BServerG.AliveCheck());
                    DebugLog('BasilServer.processIncoming: AliveCheck.'
                                + ' time=' + aliveCheckMsg.time()
                                + ', seq=' + aliveCheckMsg.sequenceNumber());
                    break;
                case BFlowG.BFlowMsgMsg.server_AliveResponse:
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
        that.BFlowG = BFlowG;
        that.flat = flatbuffers;

        // remember this instance for debugging
        BS.Instances.push(that);

        return that;
    }
});
