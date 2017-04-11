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
        'Config': 'config',
        'jquery': 'jslibs/jquery-3.1.0.min',

        'Scene': 'js/Scene',
        'Comm': 'js/Comm',
        // 'Graphics': 'js/Graphics',
        'Coordinates': 'js/Coordinates',
        'Controls': 'js/Controls',
        'UIControls': 'js/UIControls',
        'Eventing': 'js/Eventing',

        'BTransport': 'js/BTransport',
        'BTransportWebWorker': 'js/BTransportWW',
        'BTransportTest': 'js/BTransportTest',
        'BFlow': 'js/BFlow',

        'FlatBuffers': 'jslibs/flatbuffers',
        'BTransportHdrGenerated': 'jslibs/BTransportHdr_generated',
        'BasilServerGenerated': 'jslibs/BasilServer_generated',
        'BasilServer': 'js/BasilServer'
        'BasilTypesGenerated': 'jslibs/BasilTypes_generated',
        'BasilTypes': 'js/BasilTypes'
    },
    'shim': {
    }
};

// Two different underlying graphics libraries. Choose only one.
// var useGraphics = 'ThreeJS';
var useGraphics = 'BabylonJS';

if (useGraphics == 'ThreeJS') {
    requireConfig.paths['Graphics'] = 'js/Graphics-ThreeJS';
    // see https://github.com/mrdoob/three.js/issues/9602 about this wrapper thing
    requireConfig.paths['threejs'] = 'jslibs/threejs-wrapper';
    requireConfig.paths['real-threejs'] = 'jslibs/three.min';
    requireConfig.paths['orbitControl'] = 'jslibs/OrbitControls';
    requireConfig.paths['GLTFLoader'] = 'jslibs/GLTFLoader';
    requireConfig.shim['threejs'] = { 'exports': 'THREE' };
    requireConfig.shim['orbitControl'] = { 'deps': [ 'threejs' ]};
    requireConfig.shim['GLTFLoader'] = { 'deps': [ 'threejs' ]};
}

if (useGraphics == 'BabylonJS') {
    requireConfig.paths['Graphics'] = 'js/Graphics-Babylon';
    requireConfig.paths['babylonjs'] = 'jslibs/babylon';
    requireConfig.paths['GLTFLoader'] = 'jslibs/babylon.glTFFileLoader';
    requireConfig.shim['babylonjs'] = { 'exports': 'BABYLON' };
    requireConfig.shim['GLTFLoader'] = { 'deps': [ 'babylonjs' ]};
    requireConfig.shim['babylonjs-inspector'] = { 'deps': [ 'babylonjs' ]};
}
