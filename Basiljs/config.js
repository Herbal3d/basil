// Configuration
// This is called by RequireJS and expects a parameters map returned.
//     Do any processing needed and just return a data structure.
// Note: colors may be specified as strings (a number as a string) or numbers.
define(
    {
        // Parameters for the main display page
        'page': {
            'webGLcontainerId': 'webGLcontainer',
            'webGLcanvasId': 'webGLcanvas',
            'showDebug': false,
            'noComma': 0
        },
        'controlPanel': {
            'testurls': [
                { 'name': 'testtest02', 'url': './gltf/testtest02.gltf' },
                { 'name': 'testtest88', 'url': './gltf/testtest88.gltf', 'selected': true },
                { 'name': 'testtest00', 'url': './gltf/testtest00.gltf' },
                { 'name': 'testtest10', 'url': './gltf/testtest10.gltf' },
                { 'name': 'testtest01', 'url': './gltf/testtest01.gltf' }
            ]
        },

        // Parameters for the webgl environment
        'webgl': {
            'camera': {
                'name': 'camera1',
                'initialCameraPosition': [ 200, 50, 200 ],
                'initialViewDistance': 1000,
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
                'ThreeJSparams': {
                    'antialias': true,
                    'alpha': true,      // there are alpha textures in the scene
                    'logarithmicDepthBuffer': false
                },
                'BabylonJSparams': {
                },
                'clearColorXX': [ 0.53, 0.828, 0.594 ],    // 0x88d493
                'clearColor': [ 0.53, 0.528, 0.594 ],    // 0x88d493
                'shadows': {
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
);
