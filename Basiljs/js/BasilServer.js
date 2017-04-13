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
                var msgBuilder = this.BServerG.AddEntity;
                msgBuilder.startAddEntity(this.fbb);
                msgBuilder.addAuth(this.fbb, BTypes.makeAuth(auth));
                msgBuilder.addObjectId(this.fbb, BTypes.makeObjectId(objectId));
                msgBuilder.addAssetInfo(this.fbb, BTypes.makeAssetInfo(assetInfo));
                msgBuilder.addAabb(this.fbb, this.makeAabb(aabb));
                var bltMsg = msgBuilder.endAddEntity(this.fbb);
                this.flow.sendFlowMsg(this.BServerG.BasilServerMsgMsg.AddEntity,
                            bltMsg, this.BServerG.BasilServerMsg);
        };
        that.RemoveEntity = function(auth, objectId) {
                var msgBuilder = this.BServerG.RemoveEntity;
                msgBuilder.startRemoveEntity(this.fbb);
                msgBuilder.addAuth(this.fbb, BTypes.makeAuth(auth));
                msgBuilder.addObjectId(this.fbb, BTypes.makeObjectId(objectId));
                var bltMsg = msgBuilder.endRemoveEntity(this.fbb);
                this.flow.sendFlowMsg(this.BServerG.BasilServerMsgMsg.RemoveEntity,
                            bltMsg, this.BServerG.BasilServerMsg);
        };
        that.AddInstance = function(auth, instanceId, pos, propertiesToSet) {
                var msgBuilder = this.BServerG.AddInstance;
                var props = (propertiesToSet == undefined) ? undefined : BTypes.makePropertyList(propertiesToSet);
                msgBuilder.startAddInstance(this.fbb);
                msgBuilder.addAuth(this.fbb, BTypes.makeAuth(auth));
                msgBuilder.addInstanceId(this.fbb, BTypes.makeInstanceId(objectId));
                msgBuilder.addPos(this.fbb, BTypes.makeCoordPosition(pos));
                if (props != undefined) msgBuilder.addPropertiesToSet(this.fbb, props);
                var bltMsg = msgBuilder.endAddInstance(this.fbb);
                this.flow.sendFlowMsg(this.BServerG.BasilServerMsgMsg.AddInstance,
                            bltMsg, this.BServerG.BasilServerMsg);
        };
        that.RemoveInstance = function(auth, instanceId) {
                var msgBuilder = this.BServerG.RemoveInstance;
                msgBuilder.startRemoveInstance(this.fbb);
                msgBuilder.addAuth(this.fbb, BTypes.makeAuth(auth));
                msgBuilder.addInstanceId(this.fbb, BTypes.makeInstanceId(objectId));
                var bltMsg = msgBuilder.endRemoveInstance(this.fbb);
                this.flow.sendFlowMsg(this.BServerG.BasilServerMsgMsg.RemoveInstance,
                            bltMsg, this.BServerG.BasilServerMsg);
        };
        that.GetUniqueInstanceId = function(newIdCallback) {
                var msgBuilder = this.BServerG.GetUniqueInstanceId;
                msgBuilder.startGetUniqueInstanceId(this.fbb);
                var bltMsg = msgBuilder.endGetUniqueInstanceId(this.fbb);
                this.flow.callFlowMsg(this.BServerG.BasilServerMsgMsg.GetUniqueInstanceId,
                            bltMsg, this.BServerG.BasilServerMsg,
                    function(response) {
                        // Response should come back as an instance of BasilServerMsg.
                        if (response.MsgType != this.BServerG.BasilServerMsgMsg.GetUniqueInstanceIdResponse) {
                            throw 'BasilServer.GetUniqueInstanceId: response message type not correct';
                        }
                        var msgBuilder = this.BServerG.GetUniqueInstanceIdResponse;
                        var resp = msgBuilder.getRootAsGetUniqueInstanceResponse(ms.fbb, response.Msg);
                        var newID = resp.instanceId;
                        newIdCallback(newId);
                    }
                );
        };
        that.GetUniqueInstanceIdResponse = function(incoming, instanceId) {
                var msgBuilder = this.BServerG.GetUniqueInstanceIdResponse;
                msgBuilder.startGetUniqueInstanceIdResponse(this.fbb);
                msgBuilder.addInstanceId(this.fbb, BTypes.makeInstanceId(instanceId));
                var bltMsg = msgBuilder.endGetUniqueInstanceIdResponse(this.fbb);
                this.flow.respondFlowMsg(incoming,
                    this.BServerG.BasilServerMsgMsg.GetUniqueInstanceIdResponse,
                    bltMsg, this.BServerG.BasilServerMsg);
        };
        that.UpdateEntityProperty = function(auth, objectId, propsToUpdate) {
                var msgBuilder = this.BServerG.UpdateEntityProperty;
                msgBuilder.startUpdateEntityProperty(this.fbb);
                msgBuilder.addAuth(this.fbb, BTypes.makeAuth(auth));
                msgBuilder.addObjectId(this.fbb, BTypes.makeObjectId(objectId));
                msgBuilder.addProps(this.fbb, BTypes.makePropertyList(propsToUpdate));
                var bltMsg = msgBuilder.endUpdateEntityProperty(this.fbb);
                this.flow.sendFlowMsg(this.BServerG.BasilServerMsgMsg.UpdateEntityProperty,
                            bltMsg, this.BServerG.BasilServerMsg);
        };
        that.UpdateInstanceProperty = function(auth, instanceId, propsToUpdate) {
                var msgBuilder = this.BServerG.UpdateInstanceProperty;
                msgBuilder.startUpdateInstanceProperty(this.fbb);
                msgBuilder.addAuth(this.fbb, BTypes.makeAuth(auth));
                msgBuilder.addInstanceId(this.fbb, BTypes.makeInstanceId(objectId));
                msgBuilder.addProps(this.fbb, BTypes.makePropertyList(propsToUpdate));
                var bltMsg = msgBuilder.endUpdateInstanceProperty(this.fbb);
                this.flow.sendFlowMsg(this.BServerG.BasilServerMsgMsg.UpdateInstanceProperty,
                            bltMsg, this.BServerG.BasilServerMsg);
        };
        that.UpdateInstancePosition = function(auth, instanceId, pos) {
                var msgBuilder = this.BServerG.UpdateInstancePosition;
                msgBuilder.startUpdateInstancePosition(this.fbb);
                msgBuilder.addAuth(this.fbb, BTypes.makeAuth(auth));
                msgBuilder.addInstanceId(this.fbb, BTypes.makeInstanceId(objectId));
                msgBuilder.addPos(this.fbb, BTypes.makePositionInfo(pos));
                var bltMsg = msgBuilder.endUpdateInstancePosition(this.fbb);
                this.flow.sendFlowMsg(this.BServerG.BasilServerMsgMsg.UpdateInstancePosition,
                            bltMsg, this.BServerG.BasilServerMsg);
        };
        that.EntityPropertyRequest = function(auth, objectId, filter, propCallback) {
                var msgBuilder = this.BServerG.EntityPropertyRequest;
                msgBuilder.startEntityPropertyRequest(this.fbb);
                msgBuilder.addAuth(this.fbb, BTypes.makeAuth(auth));
                msgBuilder.addObjectId(me.fbb, BTypes.makeObjectId(objectId));
                msgBuilder.addPropertyMatch(this.fbb, this.makeString(filter));
                var bltMsg = msgBuilder.endEntityPropertyRequest(this.fbb);
                this.flow.callFlowMsg(this.BServerG.BasilServerMsgMsg.EntityPropertyRequest,
                            bltMsg, this.BServerG.BasilServerMsg,
                    function(response) {
                        var fetchedProperties = GetThePropertiesFromTheResponseMsg;
                        // Response should come back as an instance of BasilServerMsg.
                        if (response.MsgType != this.BServerG.BasilServerMsgMsg.EntityPropertyResponse) {
                                throw 'BasilServer.EntityPropertyRequest: response message type not correct';
                        }
                        var msgBuilder = this.BServerG.EntityPropertyResponse;
                        var resp = msgBuilder.getRootAsEntityPropertyResponse(ms.fbb, response.Msg);
                        var fetchedProperties = BTypes.extractPropertyList(resp.props);
                        propCallback(fetchedProperties);
                    }
                );
        };
        that.EntityPropertyResponse = function(objectId, props) {
        };
        that.InstancePropertyRequest = function(auth, objectId, filter, propCallback) {
                var msgBuilder = this.BServerG.InstancePropertyRequest;
                msgBuilder.startInstancePropertyRequest(this.fbb);
                msgBuilder.addAuth(this.fbb, BTypes.makeAuth(auth));
                msgBuilder.addObjectId(this.fbb, BTypes.makeObjectId(objectId));
                msgBuilder.addPropertyMatch(this.fbb, this.makeString(filter));
                var bltMsg = msgBuilder.endInstancePropertyRequest(this.fbb);
                this.flow.callFlowMsg(this.BServerG.BasilServerMsgMsg.InstancePropertyRequest,
                            bltMsg, this.BServerG.BasilServerMsg,
                    function(response) {
                        // Response should come back as an instance of BasilServerMsg.
                        if (response.MsgType != this.BServerG.BasilServerMsgMsg.InstancePropertyResponse) {
                                throw 'BasilServer.InstancePropertyRequest: response message type not correct';
                        }
                        var msgBuilder = this.BServerG.InstancePropertyResponse;
                        var resp = msgBuilder.getRootAsInstancePropertyResponse(ms.fbb, response.Msg);
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
        that.AliveCheck = function(time, sequenceNum) {
            // var msgBuilder = this.BServerG.AliveCheck;
            var msgBuilder = this.BServerG.AliveCheck;
            msgBuilder.startAliveCheck(this.fbb);
            msgBuilder.addTime(this.fbb, this.fbb.createLong(Date.now()));
            msgBuilder.addSequenceNumber(this.fbb, this.fbb.createLong(this.aliveSequenceNumber++));
            var bltMsg = msgBuilder.endAliveCheck(this.fbb);
            DebugLog('BasilServer.AliveCheck: sending AliveCheck');
            this.flow.sendFlowMsg(this.BServerG.BasilServerMsgMsg.AliveCheck,
                        bltMsg, this.BServerG.BasilServerMsg,
                function(response) {
                    DebugLog('BasilServer.AliveCheck: received AliveCheckResponse');

                }
            );
        };
        that.AliveResponse = function(time, sequenceNum, timeArrived, sequenceNumReceived) {
        };

        // =====================================================================
        that.processIncoming = function(inMsg) {
            // TODO: processing incoming message
            DebugLog('BasilServer.processIncoming: received msg');
        }

        // Add links to underlying libraries to this instance
        that.flow = aFlow;
        aFlow.dataAvailable(this.processIncoming);

        that.BServerG = BServerG;

        that.flat = flatbuffers;
        that.fbb = new flatbuffers.Builder();
        that.fbb2 = new flatbuffers.Builder();  // extra one for building while building
        that.fbb3 = new flatbuffers.Builder();  // extra one for building while building
        that.me = that;       // link to myself for local refs

        // remember this instance for debugging
        BS.Instances.push(that);

        return that;
    }
});
