// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

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
    requireConfig.paths['real-threejs'] = 'jslibs/three-dev-20170305.min';
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
