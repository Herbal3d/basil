// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

// This module retuns a factory funciton for creating a BasilTypes instance.
// THis is mostly used tocreate FlatBuffers structures as defined in BasilTypes.fbs
//
// The invocation is:
//      define(['BasilTypes']) function(BTypes) {
//          ...
//          var aTypesInstance = BTypes();
//          ...
//          var aVector3 = aTypesInstance.makeVector3([ 23, 24, 25]);
//          ...
//      }

// Global holding Basil server
var BS = BS || {};

define(['Config', 'FlatBuffers', 'BasilTypesGenerated'],
            function( Config, flatbuffers, BTypesG) {

    // Return a factory that creates a BasilServer communication object
    return function() {
        var that = {};
        that.flat = flatbuffers;
        that.bTypesG = BTypesG;
        that.fbb = new flatbuffers.Builder(200);
        that.fbb2 = new flatbuffers.Builder(200);  // extra one for building while building
        that.me = that;       // link to myself for local refs

        // May be passed an array (of XYZ) or a Vector3
        that.makeVector3 = function(vect) {
            var vect2 = me.getVectorArray(vect);
            var msgBuilder = BTypesG.org.herbal3d.protocol.basil.Vector3;
            return msgBuilder.createVector3(me.fbb2, vect2[0], vect2[1], vect2[2]);
        };
        that.makeVector3F = function(vect) {
            var vect2 = me.getVectorArray(vect);
            var msgBuilder = BTypesG.org.herbal3d.protocol.basil.Vector3F;
            return msgBuilder.createVector3F(me.fbb2, vect2[0], vect2[1], vect2[2]);
        };
        // Checks the passed parameter for a vector returns an array of [ x,y,z];
        this.getVectorArray = function(vect) {
            var ret;
            if (Array.isArray(vect))
                ret = [ vect[0], vect[1], vect[2] ];
            else if (vect.X != undefined)
                ret = [ vect.X, vect.Y, vect.Z ];
            else if (vect.x != undefined)
                ret = [ vect.x, vect.y, vect.z ];
            return ret;
        };
        that.makeQuaterion = function(quat) {
            var quat2 = me.getQuaternionArray(quat);
            var msgBuilder = BTypesG.org.herbal3d.protocol.basil.Quaterion;
            return msgBuilder.createQuaterion(me.fbb2, quat2[0], quat2[1], quat2[2], quat2[3]);
        };
        that.makeQuaterionF = function(quat) {
            var quat2 = me.getQuaternionArray(quat);
            var msgBuilder = BTypesG.org.herbal3d.protocol.basil.QuaterionF;
            return msgBuilder.createQuaterionF(me.fbb2, quat2[0], quat2[1], quat2[2], quat2[3]);
        };
        // Checks the passed parameter for a quaternion returns an array of [ x,y,z,w];
        that.getQuaternionArray = function(quant) {
            var ret;
            if (Array.isArray(quat))
                ret = [ quat[0], quat[1], quat[2], quat[3] ];
            else if (quat.X != undefined)
                ret = [ quat.X, quat.Y, quat.Z, quat.W ];
            else if (quat.x != undefined)
                ret = [ quat.x, quat.y, quat.z, quat.w ];
            return ret;
        };
        // that.makeTransform = function(mat) {};
        // that.makeTransformF = function(mat) {};
        that.makePropertyValue = function(prop, val) {
            var msgBuilder = BTypesG.org.herbal3d.protocol.basil.propertyValue;
            msgBuilder.startpropertyValue(me.fbb);
            msgBuilder.addProperty(me.fbb, me.makeString(prop));
            msgBuilder.addValue(me.fbb, me.makeString(val));
            return msgBuilder.endpropertyValue(me.fbb);
        }
        // @param {Object} Contains '{ key: val, key: val, ...}'
        // @return {flatbuffer.Offset} built propertyList
        that.makePropertyList = function(props) {
            var propVal = [];
            var msgBuilder = BTypesG.org.herbal3d.protocol.basil.propertyValue
            props.keys().foreach(function(key) {
                msgBuilder.startpropertyValue(me.fbb2);
                msgBuilder.addProperty(me.fbb2, me.makeString(key));
                msgBuilder.addValue(me.fbb2, me.makeString(props[key]));
                propVal.push(msgBuilder.endpropertyValue(me.fbb2));
            })
            msgBuilder = BTypesG.org.herbal3d.protocol.basil.propertyList
            propList = msgBuilder.createPropsVector(me.fbb2, propVal);
            msgBuilder.startpropertyList(me.fbb2);
            msgBuilder.addProps(me.fbb2, propList)
            return msgBuilder.endpropertyList(me.fbb2);
        };
        // @param {flatbuffers.Offset} reference to propertyList
        // @return [Object} returns '{key: val, key: val, ...}'
        that.extractPropertyList = function(propListOffset) {
            var extractedPropList = {};
            msgBuilder = BTypesG.org.herbal3d.protocol.basil.propertyList
            var propList = msgBuilder.getRootAspropertyList(me.fbb2, propListOffset);
            for (var ii=0; ii<propList.propsLength; ii++) {
                var propVal = propList.props(ii, propList);
                extractedPropList[propval.property] = propval.value;
            }
            return extractedPropList;
        };
        // that.makeBasilException = function(reason, hints) {};
        // Can pass individual coord parameters or a single parameter of
        //      {pos: vect, rot: quat, posRef: posRef, rotRef: rotRef}
        that.makeCoordPosition = function(pos, rot, posRef, rotRef) {
            var posPos, posRot, posPosRef, posRotRef;
            if (pos.pos != undefined) {
                if (pos.pos != undefined) posPos = me.makeVector3(pos.pos);
                if (pos.rot != undefined) posRot = me.makeQuaterionF(pos.rot);
                if (pos.posRef != undefined) posPosRef = pos.posRef;
                if (pos.rotRef != undefined) posRotRef = pos.rotRef;
            }
            else {
                if (pos != undefined) posPos = me.makeVector3(pos);
                if (rot != undefined) posRot = me.makeQuaterionF(rot);
                if (posRef != undefined) posPosRef = posRef;
                if (rotRef != undefined) posRotRef = rotRef;
            }

            var msgBuilder = BTypesG.org.herbal3d.protocol.basil.coordPosition;
            msgBuilder.startCoordPosition(me.fbb2);
            if (posPos != undefined) msgBuilder.addPos(posPos);
            if (posRot != undefined) msgBuilder.addRot(posRot);
            if (posPosRef != undefined) msgBuilder.addPosRef(posPosRef);
            if (posRotRef != undefined) msgBuilder.addRotRef(posRotRef);
            return msgBuilder.endCoordPosition(me.fbb2);
        };
        // May be called with a single parameter containing '[ [x,y,z],[x,y,z]]'
        //     or a single parameter containing '{upperFrontLeft: vector3, lowerBackRight: vector3}'
        //     or two parameters specifying upperFrontLeft and lowerBackRight.
        that.makeAaBoundingBox = function(upperFrontLeft, lowerBackRight) {
            var ufl;
            var lbr;
            if (lowerBackRight != undefined) {
                ufl = me.getVectorArray(upperFrontLeft);
                lbr = me.getVectorArray(lowerBackRight);
            }
            else if (Array.isArray(upperFrontLeft)
                            && upperFrontLeft.length == 2
                            && Array.isArray(upperFrontLeft[0])
                            && Array.isArray(upperFrontLeft[1]) ) {
                // presume it is [[x,y,z],[x,y,z]]
                ufl = me.getVectorArray(upperFrontLeft[0]);
                lbr = me.getVectorArray(upperFrontLeft[1]);
            }
            else if (upperFrontLeft.upperFrontLeft != undefined) {
                ufl = me.getVectorArray(upperFrontLeft.upperFrontLeft);
                lbr = me.getVectorArray(upperFrontLeft.lowerBackRight);
            }
            var msgBuilder = BTypesG.org.herbal3d.protocol.basil.aaBoundingBox;
            return msgBuilder.createaaBoundingBox(me.fbb2,
                    ufl[0], ufl[1], ufl[2], lbr[0], lbr[1], lbr[2] );
        };
        that.makeObjectDisplayInfo = function(aabb) {
            var msgBuilder = BTypesG.org.herbal3d.protocol.basil.objectDisplayInfo;
            msgBuilder.startobjectDisplayInfo(me.fbb);
            msgBuilder.addAabb(me.fbb, me.makeAaBoundingBox(aabb));
            return msgBuilder.endobjectDisplayInfo(me.fbb);
        };
        // Create information about an asset. Where to fetch it anc such
        // Param: dispInfo: displayInfo -- a built displayInfo block
        // Param: has, fetchURL, assetServer, assetID are all strings and may be 'undefined'
        // Param: assetType is an asset type code (or 'undefined').
        that.makeAssetInformation = function(dispInfo, hash, fetchURL, assetServer, assetId, assetType) {
            var msgBuilder = BTypesG.org.herbal3d.protocol.basil.assetInformation;
            msgBuilder.startassetInformation(me.fbb);
            if (dispInfo != undefined) msgBuilder.addDisplayInfo(me.fbb, dispInfo);
            if (hash != undefined) msgBuilder.addHash(me.fbb, me.makeString(hash));
            if (fetchURL != undefined) msgBuilder.addFetchURL(me.fbb, me.makeString(fetchURL));
            if (assetServer != undefined) msgBuilder.addAssetServer(me.fbb, me.makeString(assetServer));
            if (assetId != undefined) msgBuilder.addAssetId(me.fbb, me.makeString(assetId));
            if (assetType != undefined) msgBuilder.addAssetType(me.fbb, assetType);
            return msgBuilder.endobjectDisplayInfo(me.fbb);
        }
        // Create a description of a path through space
        // Param: pathType: string -- desciption of a movement path (usually JSON)
        that.makePathDescription = function(pathType) {
            var msgBuilder = BTypesG.org.herbal3d.protocol.basil.pathDescription;
            msgBuilder.startpathDescription(me.fbb);
            if (pathType != undefined) msgBuilder.addPathType(me.fbb, me.makeString(pathType));
            return msgBuilder.endpathDescription(me.fbb);
        };
        // Create a position/movement update for an instance
        // Param: pos: coordPosition -- position of the instance
        // Param: instanceId: int
        // Param: vel: float (optional) -- velocity of instance
        // Param: path: pathDescription -- path item is moving along
        that.makeInstancePositionInfo = function(pos, instanceId, vel, path) {
            var msgBuilder = BTypesG.org.herbal3d.protocol.basil.instancePositionInfo;
            msgBuilder.startinstancePositionInfo(me.fbb);
            msgBuilder.addPos(me.fbb, pos);
            msgBuilder.addInstanceId(me.fbb, instanceId);
            if (vel != undefined) msgBuilder.addVel(me.fbb, vel);
            if (path != undefined) msgBuilder.addPath(md.fbb, path);
            return msgBuilder.endinstancePositionInfo(me.fbb);
        };
        that.makeAccessAuthorization = function(accessProperties) {
            var msgBuilder = BTypesG.org.herbal3d.protocol.basil.accessAuthorization;
            var props = me.makePropertyList(accessProperties);
            msgBuilder.startaccessAuthorization(me.fbb);
            msgBuilder.addAccessProperties(me.fbb, props);
            return msgBuilder.endaccessAuthorization(me.fbb);

        };
        // Create the FB thing for an ObjectId
        that.makeObjectId = function(objectId) {
            return me.fbb2.createString(objectId);
        };
        // Create the thing for an instanceId
        that.makeInstanceId = function(instanceId) {
            return instanceId;
        };
        that.makeString = function(aString) {
            return me.fbb2.createString(aString);
        };

        return that;
    }
});
