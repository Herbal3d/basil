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

define(['Config', 'FlatBuffers', 'BasilTypesGenerated', 'BasilServerGenerated'],
            function( Config, Flat, BTypes, BServer) {

    GP.BS = BS; // For debugging. Don't use for cross package access.

    BS.Instances = [];

    // Return a factory that creates a BasilServer communication object
    return function(aFlow) {
        var that = {
            'AddEntity': function(auth, objectId, assetInfo, aabb) {
                var msgBuilder = BServer.org.herbal3d.protocol.basil.server.AddEntity;
                msgBuilder.startAddEntity(me.fbb);
                msgBuilder.addAuth(me.fbb, me.makeAuth(auth));
                msgBuilder.addObjectId(me.fbb, me.makeObjectId(objectId));
                msgBuilder.addAssetInfo(me.fbb, me.makeAssetInfo(assetInfo));
                msgBuilder.addAabb(me.fbb, me.makeAabb(aabb));
                var bltMsg = msgBuilder.endAddEntity(me.fbb);
                me.flow.sendFlowMsg(bltMsg, BServer.org.herbal3d.protocol.basil.server.BasilServerMsg);
            },
            'RemoveEntity': function(auth, objectId) {
                var msgBuilder = BServer.org.herbal3d.protocol.basil.server.RemoveEntity;
                msgBuilder.startRemoveEntity(me.fbb);
                msgBuilder.addAuth(me.fbb, me.makeAuth(auth));
                msgBuilder.addObjectId(me.fbb, me.makeObjectId(objectId));
                var bltMsg = msgBuilder.endRemoveEntity(me.fbb);
                me.flow.sendFlowMsg(bltMsg, BServer.org.herbal3d.protocol.basil.server.BasilServerMsg);
            },
            'AddInstance': function(auth, instanceId, pos, propertiesToSet) {
                var msgBuilder = BServer.org.herbal3d.protocol.basil.server.AddInstance;
                msgBuilder.startAddInstance(me.fbb);
                msgBuilder.addAuth(me.fbb, me.makeAuth(auth));
                msgBuilder.addInstanceId(me.fbb, me.makeInstanceId(objectId));
                msgBuilder.addPos(me.fbb, me.makePositionInfo(pos));
                msgBuilder.addPropertiesToSet(me.fbb, me.makeProperties(propertiesToSet));
                var bltMsg = msgBuilder.endAddInstance(me.fbb);
                me.flow.sendFlowMsg(bltMsg, BServer.org.herbal3d.protocol.basil.server.BasilServerMsg);
            },
            'RemoveInstance': function(auth, instanceId) {
                var msgBuilder = BServer.org.herbal3d.protocol.basil.server.RemoveInstance;
                msgBuilder.startRemoveInstance(me.fbb);
                msgBuilder.addAuth(me.fbb, me.makeAuth(auth));
                msgBuilder.addInstanceId(me.fbb, me.makeInstanceId(objectId));
                var bltMsg = msgBuilder.endRemoveInstance(me.fbb);
                me.flow.sendFlowMsg(bltMsg, BServer.org.herbal3d.protocol.basil.server.BasilServerMsg);
            },
            'GetUniqueInstanceId': function(newIdCallback) {
                var msgBuilder = BServer.org.herbal3d.protocol.basil.server.GetUniqueInstanceId;
                msgBuilder.startGetUniqueInstanceId(me.fbb);
                var bltMsg = msgBuilder.endGetUniqueInstanceId(me.fbb);
                me.flow.callFlowMsg(bltMsg, BServer.org.herbal3d.protocol.basil.server.BasilServerMsg,
                    function(response) {
                        var newID = GetTheIdFromTheResponseMsg;
                        newIdCallback(newId);
                    }
                );
            },
            'GetUniqueInstanceIdResponse': function(instanceId) {
            },
            'UpdateEntityProperty': function(auth, objectId, props) {
                var msgBuilder = BServer.org.herbal3d.protocol.basil.server.UpdateEntityProperty;
                msgBuilder.startUpdateEntityProperty(me.fbb);
                msgBuilder.addAuth(me.fbb, me.makeAuth(auth));
                msgBuilder.addObjectId(me.fbb, me.makeObjectId(objectId));
                msgBuilder.addProps(me.fbb, me.makeProperties(props));
                var bltMsg = msgBuilder.endUpdateEntityProperty(me.fbb);
                me.flow.sendFlowMsg(bltMsg, BServer.org.herbal3d.protocol.basil.server.BasilServerMsg);
            },
            'UpdateInstanceProperty': function(auth, instanceId, props) {
                var msgBuilder = BServer.org.herbal3d.protocol.basil.server.UpdateInstanceProperty;
                msgBuilder.startUpdateInstanceProperty(me.fbb);
                msgBuilder.addAuth(me.fbb, me.makeAuth(auth));
                msgBuilder.addInstanceId(me.fbb, me.makeInstanceId(objectId));
                msgBuilder.addProps(me.fbb, me.makeProperties(props));
                var bltMsg = msgBuilder.endUpdateInstanceProperty(me.fbb);
                me.flow.sendFlowMsg(bltMsg, BServer.org.herbal3d.protocol.basil.server.BasilServerMsg);
            },
            'UpdateInstancePosition': function(auth, instanceId, pos) {
                var msgBuilder = BServer.org.herbal3d.protocol.basil.server.UpdateInstancePosition;
                msgBuilder.startUpdateInstancePosition(me.fbb);
                msgBuilder.addAuth(me.fbb, me.makeAuth(auth));
                msgBuilder.addInstanceId(me.fbb, me.makeInstanceId(objectId));
                msgBuilder.addPos(me.fbb, me.makePositionInfo(pos));
                var bltMsg = msgBuilder.endUpdateInstancePosition(me.fbb);
                me.flow.sendFlowMsg(bltMsg, BServer.org.herbal3d.protocol.basil.server.BasilServerMsg);
            },
            'EntityPropertyRequest': function(auth, objectId, filter, propCallback) {
                var msgBuilder = BServer.org.herbal3d.protocol.basil.server.EntityPropertyRequest;
                msgBuilder.startEntityPropertyRequest(me.fbb);
                msgBuilder.addAuth(me.fbb, me.makeAuth(auth));
                msgBuilder.addObjectId(me.fbb, me.makeObjectId(objectId));
                msgBuilder.addPropertyMatch(me.fbb, me.makeString(filter));
                var bltMsg = msgBuilder.endEntityPropertyRequest(me.fbb);
                me.flow.callFlowMsg(bltMsg, BServer.org.herbal3d.protocol.basil.server.BasilServerMsg, function(response) {
                    var fetchedProperties = GetThePropertiesFromTheResponseMsg;
                    propCallback(fetchedProperties);
                });
            },
            'EntityPropertyResponse': function(objectId, props) {
            },
            'InstancePropertyRequest': function(auth, objectId, filter, propCallback) {
                var msgBuilder = BServer.org.herbal3d.protocol.basil.server.InstancePropertyRequest;
                msgBuilder.startInstancePropertyRequest(me.fbb);
                msgBuilder.addAuth(me.fbb, me.makeAuth(auth));
                msgBuilder.addObjectId(me.fbb, me.makeObjectId(objectId));
                msgBuilder.addPropertyMatch(me.fbb, me.makeString(filter));
                var bltMsg = msgBuilder.endInstancePropertyRequest(me.fbb);
                me.flow.callFlowMsg(bltMsg, BServer.org.herbal3d.protocol.basil.server.BasilServerMsg, function(response) {
                    var fetchedProperties = GetThePropertiesFromTheResponseMsg;
                    propCallback(fetchedProperties);
                });
            },
            'InstancePropertyResponse': function(instanceId, props) {
            },
            'Close': function() {
            },
            'OpenSession': function(auth, props, openedCallback) {
            },
            'OpenSessionResponse': function(features) {
            },
            'CloseSession': function(reason) {
            },
            'AliveCheck': function(time, sequenceNum) {
            },
            'AliveResponse': function(time, sequenceNum, timeArrived, sequenceNumReceoved) {
            },
            'noComma': 0
        };
        // Add links to underlying libraries to this instance
        that.flow = aFlow;
        that.flat = Flat;
        that.bClient = BClient;
        that.bServer = BServer;
        that.fbb = new Flat.Builder(200);
        that.me = that;       // link to myself for local refs

        // Helper functions for building message parts
        that.makeAuth = function(auth){ };
        that.makeObjectId = function(objectId){ };
        that.makeInstanceId = function(instanceId){ };
        that.makeAssetInfo = function(assetInfo){ };
        that.makeAabb = function(aabb){ };
        that.makePositionInfo = function(pos){ };
        that.makeProperties = function(props){ };
        that.makeString = function(aString){ };

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
