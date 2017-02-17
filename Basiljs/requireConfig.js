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

// 'require' needs configuration that points to the files for the features
// There are several options (different graphics systems) and that is
//    specified here.
// This global data structure is added to 'GP.requireConfig'.

var requireConfig = {
    'baseUrl': "",
    'paths': {
        'config': 'config',
        'jquery': 'jslibs/jquery-3.1.0.min',

        'Comm': 'js/Comm',
        // 'Graphics': 'js/Graphics',
        'Coordinates': 'js/Coordinates',
        'Controls': 'js/Controls',
        'UIControls': 'js/UIControls',
        'Eventing': 'js/Eventing'

    },
    'shim': {
    }
};

// Two different underlying graphics libraries. Choose only one.
var useThreeJS = true;
var useBabylonJS = false;

if (useThreeJS) {
    requireConfig.paths['Graphics'] = 'js/Graphics';
    // see https://github.com/mrdoob/three.js/issues/9602 about this wrapper thing
    requireConfig.paths['threejs'] = 'jslibs/threejs-wrapper';
    requireConfig.paths['real-threejs'] = 'jslibs/three-dev-20170207.min';
    requireConfig.paths['orbitControl'] = 'jslibs/OrbitControls';
    requireConfig.paths['GLTFLoader'] = 'jslibs/GLTFLoader';
    requireConfig.paths['stats'] = 'jslibs/stats.min';
    requireConfig.shim['threejs'] = { 'exports': 'THREE' };
    requireConfig.shim['orbitControl'] = { 'deps': [ 'threejs' ] };
    requireConfig.shim['stats'] = { 'deps': [ 'threejs' ] };
    requireConfig.shim['GLTFLoader'] = { 'deps': [ 'threejs' ] };
}

if (useBabylonJS) {
    requireConfig.paths['Graphics'] = 'js/Graphics-Babylon';
    // not yet
}
