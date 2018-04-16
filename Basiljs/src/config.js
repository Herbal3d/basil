// Configuration
// Just returns a data structure of configuration parameters.
// Note: colors may be specified as strings (a number as a string) or numbers.
'use strict';

// Using the CommonJS format as ES6 'default' doesn't work right in webpack (20171205)
export default {
    'comm': {
    },
    // Parameters for the main display page
    'page': {
        'webGLcontainerId': 'webGLcontainer',
        'webGLcanvasId': 'webGLcanvas',
        'showDebug': true,
        'debugLogLines': 35
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
            'axisHelperSize': 20
        },
        'lights': {
            'ambient': {
                'name': 'ambient1',
                'color': [ 0.1328, 0.1328, 0.1328 ],    // 0x222222
                'intensity': 0.9,
                'specular': [ 0.3, 0.3, 0.3 ],
                'diffuse': [ 0.3, 0.3, 0.3 ],
                'groundColor': [ 0, 0, 0 ]      //0x000000
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
                    'mapHeight': 2048
                }
            }
        },
        'renderer': {
            'ThreeJS': {
                'antialias': true,
                'alpha': true,      // there are alpha textures in the scene
                'logarithmicDepthBuffer': false
            }
        }
    },
    'assets': {
        'gltfURLBase': '/basil/'
    },
    'eventing': {
        'eventPollIntervalMS': 500
    },
    'WWTester': {
        'AliveCheckPollMS': 10000
    },
    // Information for loading multiple Atropia regions with filename and displacement
    'Atropia': [
            [ "convoar/Atropia_00.gltf", [0,0,512] ],
            [ "convoar/Atropia_01.gltf", [0,0,256] ],
            [ "convoar/Atropia_02.gltf", [0,0,0] ],
            [ "convoar/Atropia_10.gltf", [256,0,512] ],
            [ "convoar/Atropia_11.gltf", [256,0,256] ],
            [ "convoar/Atropia_12.gltf", [256,0,0] ],
            [ "convoar/Atropia_20.gltf", [512,0,512] ],
            [ "convoar/Atropia_21.gltf", [512,0,256] ],
            [ "convoar/Atropia_22.gltf", [512,0,0] ]
    ]
}
;
