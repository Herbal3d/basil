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
            function( Config, Flat, BTypes, BServerG) {

    GP.BS = BS; // For debugging. Don't use for cross package access.

    BS.Instances = [];

    // Return a factory that creates a BasilServer communication object
    return function(aFlow) {
        var that = {};
        that.AddEntity = function(auth, objectId, assetInfo, aabb) {
                var msgBuilder = BServerG.org.herbal3d.protocol.basil.server.AddEntity;
                msgBuilder.startAddEntity(me.fbb);
                msgBuilder.addAuth(me.fbb, BTypes.makeAuth(auth));
                msgBuilder.addObjectId(me.fbb, BTypes.makeObjectId(objectId));
                msgBuilder.addAssetInfo(me.fbb, BTypes.makeAssetInfo(assetInfo));
                msgBuilder.addAabb(me.fbb, me.makeAabb(aabb));
                var bltMsg = msgBuilder.endAddEntity(me.fbb);
                me.flow.sendFlowMsg(BServerG.org.herbal3d.protocol.basil.server.BasilServerMsgMsg.AddEntity,
                            bltMsg, BServerG.org.herbal3d.protocol.basil.server.BasilServerMsg);
        };
        that.RemoveEntity = function(auth, objectId) {
                var msgBuilder = BServerG.org.herbal3d.protocol.basil.server.RemoveEntity;
                msgBuilder.startRemoveEntity(me.fbb);
                msgBuilder.addAuth(me.fbb, BTypes.makeAuth(auth));
                msgBuilder.addObjectId(me.fbb, BTypes.makeObjectId(objectId));
                var bltMsg = msgBuilder.endRemoveEntity(me.fbb);
                me.flow.sendFlowMsg(BServerG.org.herbal3d.protocol.basil.server.BasilServerMsgMsg.RemoveEntity,
                            bltMsg, BServerG.org.herbal3d.protocol.basil.server.BasilServerMsg);
        };
        that.AddInstance = function(auth, instanceId, pos, propertiesToSet) {
                var msgBuilder = BServerG.org.herbal3d.protocol.basil.server.AddInstance;
                var props = (propertiesToSet == undefined) ? undefined : BTypes.makePropertyList(propertiesToSet);
                msgBuilder.startAddInstance(me.fbb);
                msgBuilder.addAuth(me.fbb, BTypes.makeAuth(auth));
                msgBuilder.addInstanceId(me.fbb, BTypes.makeInstanceId(objectId));
                msgBuilder.addPos(me.fbb, BTypes.makeCoordPosition(pos));
                if (props != undefined) msgBuilder.addPropertiesToSet(me.fbb, props);
                var bltMsg = msgBuilder.endAddInstance(me.fbb);
                me.flow.sendFlowMsg(BServerG.org.herbal3d.protocol.basil.server.BasilServerMsgMsg.AddInstance,
                            bltMsg, BServerG.org.herbal3d.protocol.basil.server.BasilServerMsg);
        };
        that.RemoveInstance = function(auth, instanceId) {
                var msgBuilder = BServerG.org.herbal3d.protocol.basil.server.RemoveInstance;
                msgBuilder.startRemoveInstance(me.fbb);
                msgBuilder.addAuth(me.fbb, BTypes.makeAuth(auth));
                msgBuilder.addInstanceId(me.fbb, BTypes.makeInstanceId(objectId));
                var bltMsg = msgBuilder.endRemoveInstance(me.fbb);
                me.flow.sendFlowMsg(BServerG.org.herbal3d.protocol.basil.server.BasilServerMsgMsg.RemoveInstance,
                            bltMsg, BServerG.org.herbal3d.protocol.basil.server.BasilServerMsg);
        };
        that.GetUniqueInstanceId = function(newIdCallback) {
                var msgBuilder = BServerG.org.herbal3d.protocol.basil.server.GetUniqueInstanceId;
                msgBuilder.startGetUniqueInstanceId(me.fbb);
                var bltMsg = msgBuilder.endGetUniqueInstanceId(me.fbb);
                me.flow.callFlowMsg(BServerG.org.herbal3d.protocol.basil.server.BasilServerMsgMsg.GetUniqueInstanceId,
                            bltMsg, BServerG.org.herbal3d.protocol.basil.server.BasilServerMsg,
                    function(response) {
                        // Response should come back as an instance of BasilServerMsg.
                        if (response.MsgType != BServerG.org.herbal3d.protocol.basil.server.BasilServerMsgMsg.GetUniqueInstanceIdResponse) {
                            throw 'BasilServer.GetUniqueInstanceId: response message type not correct';
                        }
                        var msgBuilder = BServerG.org.herbal3d.protocol.basil.server.GetUniqueInstanceIdResponse;
                        var resp = msgBuilder.getRootAsGetUniqueInstanceResponse(ms.fbb, response.Msg);
                        var newID = resp.instanceId;
                        newIdCallback(newId);
                    }
                );
        };
        that.GetUniqueInstanceIdResponse = function(incoming, instanceId) {
                var msgBuilder = BServerG.org.herbal3d.protocol.basil.server.GetUniqueInstanceIdResponse;
                msgBuilder.startGetUniqueInstanceIdResponse(me.fbb);
                msgBuilder.addInstanceId(me.fbb, BTypes.makeInstanceId(instanceId));
                var bltMsg = msgBuilder.endGetUniqueInstanceIdResponse(me.fbb);
                me.flow.respondFlowMsg(incoming,
                    BServerG.org.herbal3d.protocol.basil.server.BasilServerMsgMsg.GetUniqueInstanceIdResponse,
                    bltMsg, BServerG.org.herbal3d.protocol.basil.server.BasilServerMsg);
        };
        that.UpdateEntityProperty = function(auth, objectId, propsToUpdate) {
                var msgBuilder = BServerG.org.herbal3d.protocol.basil.server.UpdateEntityProperty;
                msgBuilder.startUpdateEntityProperty(me.fbb);
                msgBuilder.addAuth(me.fbb, BTypes.makeAuth(auth));
                msgBuilder.addObjectId(me.fbb, BTypes.makeObjectId(objectId));
                msgBuilder.addProps(me.fbb, BTypes.makePropertyList(propsToUpdate));
                var bltMsg = msgBuilder.endUpdateEntityProperty(me.fbb);
                me.flow.sendFlowMsg(BServerG.org.herbal3d.protocol.basil.server.BasilServerMsgMsg.UpdateEntityProperty,
                            bltMsg, BServerG.org.herbal3d.protocol.basil.server.BasilServerMsg);
        };
        that.UpdateInstanceProperty = function(auth, instanceId, propsToUpdate) {
                var msgBuilder = BServerG.org.herbal3d.protocol.basil.server.UpdateInstanceProperty;
                msgBuilder.startUpdateInstanceProperty(me.fbb);
                msgBuilder.addAuth(me.fbb, BTypes.makeAuth(auth));
                msgBuilder.addInstanceId(me.fbb, BTypes.makeInstanceId(objectId));
                msgBuilder.addProps(me.fbb, BTypes.makePropertyList(propsToUpdate));
                var bltMsg = msgBuilder.endUpdateInstanceProperty(me.fbb);
                me.flow.sendFlowMsg(BServerG.org.herbal3d.protocol.basil.server.BasilServerMsgMsg.UpdateInstanceProperty,
                            bltMsg, BServerG.org.herbal3d.protocol.basil.server.BasilServerMsg);
        };
        that.UpdateInstancePosition = function(auth, instanceId, pos) {
                var msgBuilder = BServerG.org.herbal3d.protocol.basil.server.UpdateInstancePosition;
                msgBuilder.startUpdateInstancePosition(me.fbb);
                msgBuilder.addAuth(me.fbb, BTypes.makeAuth(auth));
                msgBuilder.addInstanceId(me.fbb, BTypes.makeInstanceId(objectId));
                msgBuilder.addPos(me.fbb, BTypes.makePositionInfo(pos));
                var bltMsg = msgBuilder.endUpdateInstancePosition(me.fbb);
                me.flow.sendFlowMsg(BServerG.org.herbal3d.protocol.basil.server.BasilServerMsgMsg.UpdateInstancePosition,
                            bltMsg, BServerG.org.herbal3d.protocol.basil.server.BasilServerMsg);
        };
        that.EntityPropertyRequest = function(auth, objectId, filter, propCallback) {
                var msgBuilder = BServerG.org.herbal3d.protocol.basil.server.EntityPropertyRequest;
                msgBuilder.startEntityPropertyRequest(me.fbb);
                msgBuilder.addAuth(me.fbb, me.makeAuth(auth));
                msgBuilder.addObjectId(me.fbb, me.makeObjectId(objectId));
                msgBuilder.addPropertyMatch(me.fbb, me.makeString(filter));
                var bltMsg = msgBuilder.endEntityPropertyRequest(me.fbb);
                me.flow.callFlowMsg(BServerG.org.herbal3d.protocol.basil.server.BasilServerMsgMsg.EntityPropertyRequest,
                            bltMsg, BServerG.org.herbal3d.protocol.basil.server.BasilServerMsg,
                    function(response) {
                        var fetchedProperties = GetThePropertiesFromTheResponseMsg;
                        // Response should come back as an instance of BasilServerMsg.
                        if (response.MsgType != BServerG.org.herbal3d.protocol.basil.server.BasilServerMsgMsg.EntityPropertyResponse) {
                                throw 'BasilServer.EntityPropertyRequest: response message type not correct';
                        }
                        var msgBuilder = BServerG.org.herbal3d.protocol.basil.server.EntityPropertyResponse;
                        var resp = msgBuilder.getRootAsEntityPropertyResponse(ms.fbb, response.Msg);
                        var fetchedProperties = BTypes.extractPropertyList(resp.props);
                        propCallback(fetchedProperties);
                    }
                );
        };
        that.EntityPropertyResponse = function(objectId, props) {
        };
        that.InstancePropertyRequest = function(auth, objectId, filter, propCallback) {
                var msgBuilder = BServerG.org.herbal3d.protocol.basil.server.InstancePropertyRequest;
                msgBuilder.startInstancePropertyRequest(me.fbb);
                msgBuilder.addAuth(me.fbb, me.makeAuth(auth));
                msgBuilder.addObjectId(me.fbb, me.makeObjectId(objectId));
                msgBuilder.addPropertyMatch(me.fbb, me.makeString(filter));
                var bltMsg = msgBuilder.endInstancePropertyRequest(me.fbb);
                me.flow.callFlowMsg(BServerG.org.herbal3d.protocol.basil.server.BasilServerMsgMsg.InstancePropertyRequest,
                            bltMsg, BServerG.org.herbal3d.protocol.basil.server.BasilServerMsg,
                    function(response) {
                        // Response should come back as an instance of BasilServerMsg.
                        if (response.MsgType != BServerG.org.herbal3d.protocol.basil.server.BasilServerMsgMsg.InstancePropertyResponse) {
                                throw 'BasilServer.InstancePropertyRequest: response message type not correct';
                        }
                        var msgBuilder = BServerG.org.herbal3d.protocol.basil.server.InstancePropertyResponse;
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
        that.AliveCheck = function(time, sequenceNum) {
        };
        that.AliveResponse = function(time, sequenceNum, timeArrived, sequenceNumReceoved) {
        };

        // Add links to underlying libraries to this instance
        that.flow = aFlow;
        that.flat = Flat;
        that.bServerG = BServerG;
        that.fbb = new Flat.Builder(200);
        that.fbb2 = new Flat.Builder(200);  // extra one for building while building
        that.fbb3 = new Flat.Builder(200);  // extra one for building while building
        that.me = that;       // link to myself for local refs

        that.processIncoming = function(inMsg) {
            // TODO: processing incoming message
            me.flow.read(me.processIncoming);
        }
        that.start = function() {
            me.flow.read(me.processIncoming);
        };

        // remember this instance for debugging
        BS.Instances.push(that);

        return that;
    }
});
