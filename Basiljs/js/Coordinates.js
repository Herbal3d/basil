// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

// Global position is a place on the surface of the earth defined by "WGS 84".
// This global position ("gPos") is represented as a triple of double length
//    floats.
// Because of limitations in display accuracy and the usual use of flat,
//    zero based coordinates, every object is assigned a local position ("lPos")
//    which is the gPos converted using a local reference global transform ("GP.refLoc").
//    The rotation of the reference is often computed to be
//    tangential to the global sphere thus giving the local coordinates similarity
//    to standing on the Earth.

// Sometimes the refLoc has to change due to camera movement or whatever. This
//    requires all objects to be passed over an their lPos to be recomputed from
//    their gPos.

// =====================================================

var CD = CD || [];

define([], function() {
    //Going to have to use some coordinate library. Which one to choose?
    // for the short term. Make something up.
    function Matrix4() {
    }
    Object.assign(Matrix4.prototype, {
        'copy': function(mat) { },
        'getPosition': function() { },
        'getBasis': function() { }
    });
    function Vector3(x, y, z) {
    }
    function Quaternion() {
    }
    Object.assign(Quaternion.prototype, {
        'setFromRotationMatrix': function(mat) { }
    });

    // An object to hold a transform or whatever is holding a position/rotation.
    function Loc() {
        this.location = new Matrix4();
    }
    Object.assign (Loc.prototype, {
        'trans': function() {
            return this.location;
        },
        'pos': function() {
            return this.location.getPosition();
        },
        // Return a quatenion of the rotation held in this location
        'rot': function() {
            return new Quaternion().setFromRotationMatrix(this.location.getBasis());
        },
        'setTrans': function(aTrans) {
            this.location.copy(aTrans);
        }
    });

    var op = {
        // Return a transform matrix passed latitude and longitude strings
        'gPositionFromLatLong': function(lat, long) {
            return new Matrix4(); // TODO: put some real code here
        },

        // Convert a global position into a local position given GP.refLoc.
        'lPosFromgPos': function(pos) {
        },

        // Convert a local position into a global position given GP.refLoc
        'gPosFromlPos': function(pos) {
        },

        // Given a position on the Earth, return a rotation matrix with surface rotation.
        // The rotation Z points away from the center of the earth and X points in the
        //    direction of the north pole.
        'computeLocalReferenceFrame': function(pos) {
        }
    };

    GP.CD = CD;

    CD.op = op;

    GP.refLoc = new Loc();
    // 28:25:10N 81:34:52W = Cinderella's Castle in WaltDisneyWorld
	// Start at Disneyland
    GP.refLoc.setTrans(op.gPositionFromLatLong("33.8120962", "-117.9211629,17z"));

    return op;

});
