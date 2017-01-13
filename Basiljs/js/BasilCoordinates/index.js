/**
 * Copyright (c) 2017, Robert Adams
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in
 * the documentation and/or other materials provided with the distribution.
 * 
 * 3. Neither the name of the copyright holder nor the names of its
 * contributors may be used to endorse or promote products derived
 * from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

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

// An object to hold a transform or whatever is holding a position/rotation.
function Loc() {
    this.location = new THREE.Matrix4();
};

Loc.prototype.trans = function() {
	return this.location;
};

Loc.prototype.pos = function() {
    return this.location.getPosition();
};

// Return a quatenion of the rotation held in this location
Loc.prototype.rot = function() {
	return new THREE.Quaternion().setFromRotationMatrix(this.location.getBasis());
};

Loc.prototype.setTrans = function(aTrans) {
    this.location.copy(aTrans);
};

// =====================================================

module.exports = (function() {
    GP.refLoc = new Loc();
	// Start at Disneyland
    GP.refLoc.setTrans(gPositionFromLatLong("33.8120962", "-117.9211629,17z"));

    return operations;
})();

var operations = {
    // Return a transform matrix passed latitude and longitude strings
    'gPositionFromLatLong': function(lat, long) {
        return new THREE.Matrix4(); // TODO: put some real code here
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
