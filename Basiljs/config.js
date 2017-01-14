// configuration
define(
    {
        'pageComment': 'Parameters for the main display page',
        'page': {
            'webGLcontainerId': 'webGLcontainer',
            'noComma': 0
        },

        'webglComment': 'Parameters for the webgl environment',
        'webgl': {
            'camera': {
                'initialCameraPosition': [ 200, 50, 200 ],
                'initialViewDistance': 1000,
                'initialCameraLookAt': [ 128, 30, 128 ],
                'noComma': 0
            },
            'lights': {
                'ambient': {
                    'color': '0x222222',
                    'intensity': 0.5,
                    'noComma': 0
                },
                'directionalComment': 'placeholder for the eventual sun system',
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
                    'antialias': true
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
