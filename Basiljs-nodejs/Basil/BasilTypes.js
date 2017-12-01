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

        // May be passed an array (of XYZ) or a Vector3
        that.makeVector3 = function(vect) {
            var vect2 = me.getVectorArray(vect);
            var fbb = new flatbuffers.Builder();
            var msgBuilder = BTypesG.Vector3;
            return msgBuilder.createVector3(fbb, vect2[0], vect2[1], vect2[2]);
        };
        that.makeVector3F = function(vect) {
            var vect2 = me.getVectorArray(vect);
            var fbb = new flatbuffers.Builder();
            var msgBuilder = BTypesG.Vector3F;
            return msgBuilder.createVector3F(fbb, vect2[0], vect2[1], vect2[2]);
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
            var fbb = new flatbuffers.Builder();
            var msgBuilder = BTypesG.Quaterion;
            return msgBuilder.createQuaterion(fbb, quat2[0], quat2[1], quat2[2], quat2[3]);
        };
        that.makeQuaterionF = function(quat) {
            var quat2 = me.getQuaternionArray(quat);
            var fbb = new flatbuffers.Builder();
            var msgBuilder = BTypesG.QuaterionF;
            return msgBuilder.createQuaterionF(fbb, quat2[0], quat2[1], quat2[2], quat2[3]);
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
            var fbb = new flatbuffers.Builder();
            var msgBuilder = BTypesG.propertyValue;
            msgBuilder.startpropertyValue(fbb);
            msgBuilder.addProperty(fbb, me.makeString(prop));
            msgBuilder.addValue(fbb, me.makeString(val));
            return msgBuilder.endpropertyValue(fbb);
        }
        // @param {Object} Contains '{ key: val, key: val, ...}'
        // @return {flatbuffer.Offset} built propertyList
        that.makePropertyList = function(props) {
            var propVal = [];
            var msgBuilder = BTypesG.propertyValue
            props.keys().foreach(function(key) {
                var fbb = new flatbuffers.Builder();
                msgBuilder.startpropertyValue(fbb);
                msgBuilder.addProperty(fbb, me.makeString(key));
                msgBuilder.addValue(fbb, me.makeString(props[key]));
                propVal.push(msgBuilder.endpropertyValue(fbb));
            })
            var fbb = new flatbuffers.Builder();
            msgBuilder = BTypesG.propertyList
            propList = msgBuilder.createPropsVector(fbb, propVal);
            msgBuilder.startpropertyList(fbb);
            msgBuilder.addProps(fbb, propList)
            return msgBuilder.endpropertyList(fbb);
        };
        // @param {flatbuffers.Offset} reference to propertyList
        // @return [Object} returns '{key: val, key: val, ...}'
        that.extractPropertyList = function(propListOffset) {
            var fbb = new flatbuffers.Builder();
            var extractedPropList = {};
            msgBuilder = BTypesG.propertyList
            var propList = msgBuilder.getRootAspropertyList(fbb, propListOffset);
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

            var fbb = new flatbuffers.Builder();
            var msgBuilder = BTypesG.coordPosition;
            msgBuilder.startCoordPosition(fbb);
            if (posPos != undefined) msgBuilder.addPos(posPos);
            if (posRot != undefined) msgBuilder.addRot(posRot);
            if (posPosRef != undefined) msgBuilder.addPosRef(posPosRef);
            if (posRotRef != undefined) msgBuilder.addRotRef(posRotRef);
            return msgBuilder.endCoordPosition(fbb);
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
            var msgBuilder = BTypesG.aaBoundingBox;
            return msgBuilder.createaaBoundingBox(fbb,
                    ufl[0], ufl[1], ufl[2], lbr[0], lbr[1], lbr[2] );
        };
        that.makeObjectDisplayInfo = function(aabb) {
            var fbb = new flatbuffers.Builder();
            var msgBuilder = BTypesG.objectDisplayInfo;
            msgBuilder.startobjectDisplayInfo(fbb);
            msgBuilder.addAabb(fbb, me.makeAaBoundingBox(aabb));
            return msgBuilder.endobjectDisplayInfo(fbb);
        };
        // Create information about an asset. Where to fetch it anc such
        // Param: dispInfo: displayInfo -- a built displayInfo block
        // Param: has, fetchURL, assetServer, assetID are all strings and may be 'undefined'
        // Param: assetType is an asset type code (or 'undefined').
        that.makeAssetInformation = function(dispInfo, hash, fetchURL, assetServer, assetId, assetType) {
            var fbb = new flatbuffers.Builder();
            var msgBuilder = BTypesG.assetInformation;
            msgBuilder.startassetInformation(fbb);
            if (dispInfo != undefined) msgBuilder.addDisplayInfo(fbb, dispInfo);
            if (hash != undefined) msgBuilder.addHash(fbb, me.makeString(hash));
            if (fetchURL != undefined) msgBuilder.addFetchURL(fbb, me.makeString(fetchURL));
            if (assetServer != undefined) msgBuilder.addAssetServer(fbb, me.makeString(assetServer));
            if (assetId != undefined) msgBuilder.addAssetId(fbb, me.makeString(assetId));
            if (assetType != undefined) msgBuilder.addAssetType(fbb, assetType);
            return msgBuilder.endobjectDisplayInfo(fbb);
        }
        // Create a description of a path through space
        // Param: pathType: string -- desciption of a movement path (usually JSON)
        that.makePathDescription = function(pathType) {
            var fbb = new flatbuffers.Builder();
            var msgBuilder = BTypesG.pathDescription;
            msgBuilder.startpathDescription(fbb);
            if (pathType != undefined) msgBuilder.addPathType(fbb, me.makeString(pathType));
            return msgBuilder.endpathDescription(fbb);
        };
        // Create a position/movement update for an instance
        // Param: pos: coordPosition -- position of the instance
        // Param: instanceId: int
        // Param: vel: float (optional) -- velocity of instance
        // Param: path: pathDescription -- path item is moving along
        that.makeInstancePositionInfo = function(pos, instanceId, vel, path) {
            var fbb = new flatbuffers.Builder();
            var msgBuilder = BTypesG.instancePositionInfo;
            msgBuilder.startinstancePositionInfo(fbb);
            msgBuilder.addPos(fbb, pos);
            msgBuilder.addInstanceId(fbb, instanceId);
            if (vel != undefined) msgBuilder.addVel(fbb, vel);
            if (path != undefined) msgBuilder.addPath(md.fbb, path);
            return msgBuilder.endinstancePositionInfo(fbb);
        };
        that.makeAccessAuthorization = function(accessProperties) {
            var fbb = new flatbuffers.Builder();
            var msgBuilder = BTypesG.accessAuthorization;
            var props = me.makePropertyList(accessProperties);
            msgBuilder.startaccessAuthorization(fbb);
            msgBuilder.addAccessProperties(fbb, props);
            return msgBuilder.endaccessAuthorization(fbb);

        };
        // Create the FB thing for an ObjectId
        that.makeObjectId = function(objectId) {
            var fbb = new flatbuffers.Builder();
            return fbb.createString(objectId);
        };
        // Create the thing for an instanceId
        that.makeInstanceId = function(instanceId) {
            return instanceId;
        };
        that.makeString = function(aString) {
            var fbb = new flatbuffers.Builder();
            return fbb.createString(aString);
        };

        return that;
    }
});
