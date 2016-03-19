/**
 * Copyright (c) 2016, Robert Adams
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
//    which is the gPos converted using a local reference global position ("refPos")
//    and a reference frame rotation ("refRot"). These are often combined into a
//    reference transform matrix ("refMatix"). The refRot is often computed to be
//    tangential to the global sphere thus giving the local coordinates similarity
//    to standing on the Earth.

// Sometimes the refPos has to change due to camera movement or whatever. This
//    requires all objects to be passed over an their lPos to be recomputed from
//    their gPos.

function InitPositions() {
	// Start at Disneyland
	GP.refMatrix = gPositionFromGPS("33.8120962,-117.9211629,17z");
	GP.refPos = GP.refMatrix.getPosition();
	GP.refRot = new THREE.Quaternion().setFromRotationMatrix(GP.refMatrix.getBasis());
}
function lPosFromgPos() {
	
}

// Return a transform matrix passed GPS latitude and longitude strings
function gPositionFromGPS(latlong) {
}

// Convert a global position into a local position given GP.refMatrix.
function lPosFromgPos(pos) {
}

// Convert a local position into a global position given GP.refMatrix
function gPosFromlPos(pos) {
	
}

// Given a position on the Earth, return a reference matrix with surface rotation.
// The rotation Z points away from the center of the earth and X points in the
//    direction of the north pole.
function computeLocalReferenceFrame(pos) {
	
}