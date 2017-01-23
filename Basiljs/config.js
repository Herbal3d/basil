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
            'showDebug': true,
            'showStats': true,
            'noComma': 0
        },

        // Parameters for the webgl environment
        'webgl': {
            'camera': {
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
                    'color': '0x222222',
                    'intensity': 0.9,
                    'noComma': 0
                },
                // placeholder for the eventual sun system
                'directional': {
                    'color': '0xeeeeee',
                    'position': [ 1000, 1000, 1000 ],
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
                'params': {
                    'antialias': true,
                    'alphs': true,      // there are alpha textures in the scene
                    'logarithmicDepthBuffer': false
                },
                'clearColor': '0x222222',
                'shadows': {
                    'noComma': 0
                },
                'noComma': 0
            },

            'noComma': 0
        }
    }
);
