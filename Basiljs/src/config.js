// Configuration
// Just returns a data structure of configuration parameters.
// Note: colors may be specified as strings (a number as a string) or numbers.
'use strict';

module.exports = {
    // Parameters for the main display page
    'page': {
        'webGLcontainerId': 'webGLcontainer',
        'webGLcanvasId': 'webGLcanvas',
        'showDebug': false,
        'noComma': 0
    },
    // Parameters for the webgl environment
    'webgl': {
        'engine': 'ThreeJS',
        'camera': {
            'name': 'camera1',
            'initialCameraPosition': [ 200, 50, 200 ],
            'initialViewDistance': 2000,
            'initialCameraLookAt': [ 128, 30, 128 ],
            'addCameraHelper': false,
            'addAxisHelper': true,
            'axisHelperSize': 20,
            'noComma': 0
        },
        'lights': {
            'ambient': {
                'name': 'ambient1',
                'color': [ 0.1328, 0.1328, 0.1328 ],    // 0x222222
                'intensity': 0.9,
                'specular': [ 0.3, 0.3, 0.3 ],
                'diffuse': [ 0.3, 0.3, 0.3 ],
                'groundColor': [ 0, 0, 0 ], //0x000000
                'noComma': 0
            },
            // placeholder for the eventual sun system
            'directional': {
                'name': 'directional1',
                'color': [ 0.93, 0.93, 0.93 ], // 0xeeeeee
                'direction': [ 1000, 1000, 1000 ],
                'intensity': 1,
                'shadows': {
                    'bias': 0.0001,
                    'mapWidth': 2048,
                    'mapHeight': 2048,
                    'noComma': 0
                },
                'noComma': 0
            },
            'noComma': 0
        },
        'renderer': {
            'ThreeJS': {
                'scripts': [
                    'jslibs/three.min.js',
                    'jslibs/OrbitControls.js',
                    'jslibs/GLTFLoader.js'
                ],
                'antialias': true,
                'alpha': true,      // there are alpha textures in the scene
                'logarithmicDepthBuffer': false,
                'noComma': 0
            },
            'Cesium': {
                'scripts': [
                    'jslibs/Cesium/Cesium.js'
                ],
                'noComma': 0
            },
            'noComma': 0
        },
        'noComma': 0
    },
    'eventing': {
        'eventPollIntervalMS': 500,
        'noComma': 0
    },
    'noComma': 0
}
;
