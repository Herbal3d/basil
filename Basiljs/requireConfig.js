// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

// 'require' needs configuration that points to the files for the features
// There are several options (different graphics systems) and that is
//    specified here.
// This global data structure is added to 'GP.requireConfig'.

// From https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
// Used to see if 'engine' is specified before any environment or libraries are loaded.
function requireConfigGetQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return undefined;
}

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
        'BFlowGenerated': 'jslibs/BFlow_generated',
        'BasilServerGenerated': 'jslibs/BasilServer_generated',
        'BasilServer': 'js/BasilServer',
        'BasilTypesGenerated': 'jslibs/BasilTypes_generated',
        'BasilTypes': 'js/BasilTypes'
    },
    'shim': {
        'FlatBuffers': { 'exports': 'flatbuffers' },
        'BasilTypesGenerated': { 'exports': 'org.herbal3d.protocol.basil' },
        'BFlowGenerated': { 'exports': 'org.herbal3d.protocol.basil' },
        'BasilServerGenerated': { 'exports': 'org.herbal3d.protocol.basil.server' },
    }
};

// Two different underlying graphics libraries. Choose only one.
var useGraphics = requireConfigGetQueryVariable('engine');
if (useGraphics == undefined) {
    // default to ThreeJS
    useGraphics = 'ThreeJS'.toLowerCase();
}
else {
    useGraphics = useGraphics.toLowerCase();
}

// Set global gltfVersion to 1 or 2
var gltfVersion = requireConfigGetQueryVariable('gltf');
if (gltfVersion == undefined) {
    gltfVersion = 1;
}
else {
    if (gltfVersion == 2) {
        gltfVersion = 2;
    }
    else {
        gltfVersion = 1;
    }
}

if (useGraphics == 'ThreeJS'.toLowerCase()) {
    requireConfig.paths['Graphics'] = 'js/Graphics-ThreeJS';
    // see https://github.com/mrdoob/three.js/issues/9602 about this wrapper thing
    requireConfig.paths['threejs'] = 'jslibs/threejs-wrapper';
    requireConfig.paths['real-threejs'] = 'jslibs/three.min';
    requireConfig.paths['orbitControl'] = 'jslibs/OrbitControls';
    if (gltfVersion == 1) {
        requireConfig.paths['GLTFLoader'] = 'jslibs/GLTFLoader';
    }
    else {
        requireConfig.paths['GLTFLoader'] = 'jslibs/GLTFLoader';
    }
    requireConfig.shim['threejs'] = { 'exports': 'THREE' };
    requireConfig.shim['orbitControl'] = { 'deps': [ 'threejs' ]};
    requireConfig.shim['GLTFLoader'] = { 'deps': [ 'threejs' ]};
}

if (useGraphics == 'BabylonJS'.toLowerCase()) {
    requireConfig.paths['Graphics'] = 'js/Graphics-Babylon';
    // requireConfig.paths['babylonjs'] = 'jslibs/babylon.max';
    requireConfig.paths['babylonjs'] = 'jslibs/babylon';
    requireConfig.paths['GLTFLoader'] = 'jslibs/babylon.glTFFileLoader';
    requireConfig.shim['babylonjs'] = { 'exports': 'BABYLON' };
    requireConfig.shim['GLTFLoader'] = { 'deps': [ 'babylonjs' ]};
    requireConfig.shim['babylonjs-inspector'] = { 'deps': [ 'babylonjs' ]};
}

if (useGraphics == 'Cesium'.toLowerCase()) {
    requireConfig.waitSeconds = 60; // it takes a while to load the large Cesium.js file
    requireConfig.paths['Graphics'] = 'js/Graphics-Cesium';
    requireConfig.paths['Cesium'] = 'jslibs/Cesium/Cesium';
    requireConfig.shim['Cesium'] = { 'exports': 'Cesium' };
}
