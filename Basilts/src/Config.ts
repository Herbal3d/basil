// Configuration
// Just returns an object that has all the parameters
// Someday integrate with 'command-line-args' or 'dotenv'

'use strict';

// All the possible configuration parameters.
// This sets defaults values and is over-written by environment variables and
//     supplied configuration file contents.
export let Config = {
    // Various overall Basil viewer parameters
    'basil': {
        // ms before removing deleted BItem
        'BItemDeleteInterval': 60000
     },
    // Filled by parameters passed in initial invocation
    'initialMakeConnection': {
        'transport': 'WW',
        'transportURL': './wwtester.js',
        'protocol': 'Basil-JSON',
        'service': 'SpaceServerClient',
        'receiveAuth': '',
        'sendAuth': '',
        'openParams': {
            'testAssetURL': '',
            'loaderType': 'GLTF'
        }
    },
    'comm': {
        'transports': [ 'WW', 'WS' ],
        'protocols': [ 'Basil-JSON', 'Basil-FB', 'Basil-PB' ],
    },
    'security': {
        'ShouldCheckBasilServerRequestAuth': true,
    },
    // Parameters for the main display page
    'page': {
        'webGLcontainerId': 'webGLcontainer',
        'webGLcanvasId': 'webGLcanvas',
        'showDebug': false,
        'debugElementId': '#DEBUGG',
        'debugErrorClass': 'errorMsg',
        'debugLogLines': 30
    },
    // Loader for assets
    'assetLoader': {
        'useDRACO': true,           // unpack DRACO compression if used
        'combineInstances': true    // whether to combine instances
    },
    // Parameters for the webgl environment
    'webgl': {
        'graphicsId': 'org.basil.b.graphics',
        'engine': 'ThreeJS',
        'camera': {
            'cameraId': 'org.basil.b.camera.1',
            'cameraInstanceId': 'org.basil.b.instance.camera.1',
            'name': 'camera1',
            'initialCameraPosition': [ 200, 50, 200 ],
            'initialViewDistance': 2000,
            'initialCameraLookAt': [ 128, 30, 128 ],
            'addCameraHelper': false,
            'addAxesHelper': true,
            'axesHelperSize': 20
        },
        'lights': {
            'ambient': {
                'name': 'ambient1',
                'color': 0x222222,
                'intensity': 0.9,
                'specular': 0x505050,
                'diffuse': 0x505050,
                'groundColor': 0x000000      // 0x000000
            },
            // placeholder for the eventual sun system
            'directional': {
                'name': 'directional1',
                'color': 0xEEEEEE,
                'direction': [ 1000, 1000, 1000 ],
                'intensity': 1,
                'shadows': {
                    'bias': 0.0001,
                    'mapWidth': 2048,
                    'mapHeight': 2048
                }
            }
        },
        'fog-disabled': { // change to 'fog' to enable
            'type': 'linear',   // 'linear' or 'exponential'
            'color': 0xE6E6E6,
            'density': 0.00025,
            'near': 1,
            'far': 5000
        },
        'renderer': {
            'ThreeJS': {
                'useWebGL2': true,
                // Parameters passed to the renderer when created.
                //   see https://threejs.org/docs/index.html#api/renderers/WebGLRenderer
                'antialias': true,
                'alpha': true,      // there are alpha textures in the scene
                'logarithmicDepthBuffer': false
            },
            'clearColor': [ 0.1, 0.1, 0.1 ],
            'shadows': false,
            // As suggested in the ThreeJS documentation for GLTFLoader:
            'gammaFactor': 2.20
        },
    },
    // Names for predefined/service BItem layers
    'layers': {
        'default': 'org.herbal3d.b.layers.default',
        'comm': 'org.herbal3d.b.layers.comm',
        'service': 'org.herbal3d.b.layers.service',
        'eventing': 'org.herbal3d.b.layers.eventing'
    },
    // Flags for fetching assets.
    'assets': {
        'gltfURLBase': '/basil/',
        'assetFetchTimeoutMS': 20000,       // MS timeout for an asset to load
        'assetFetchCheckIntervalMS': 200,   // MS between checks for asset loaded
        'assetFetchCheckIntervalMaxMS': 1000,   // MS for max interval to check for asset loaded
        'instanceAssetWaitTimeoutMS': 20000 // MS for instance to wait for its displayable to load
    },
    // Parameters for the simple eventing system
    'eventing': {
        'eventPollIntervalMS': 500
    },
    // Connection and debug information when running the WebWorker test
    'WWTester': {
        'LogToConsole': false,       // Log to console. Otherwise, use msg to debug BItem
        'GenerateAliveCheck': false, // whether to generate AlvieCheck messages
        'AliveCheckPollMS': 10000,   // ms interval to generate AliveCheck's
        'PrintDebugOnAliveResponse': false, // print message on AliveCheck response
        'initialMakeConnection': {
            'transport': 'WW',
            'transportURL': './wwtester.js',
            'protocol': 'Basil-JSON',
            'service': 'SpaceServerClient',
            'TestAsset': {
                // 'displayableurl': 'https://files.misterblue.com/BasilTest/convoar/testtest88/unoptimized/testtest88.gltf',
                'displayableurl': 'https://files.misterblue.com/BasilTest/convoar/epiccastle/smallassets/epiccastle.gltf',
                'loaderType': 'GLTF',
                'displayType': 'meshset'
            }
        }
    },
    // Various flags that turn on/off debug logging, etc
    'Debug': {
        'EnableLogging': true,                // whether to output any logging
        'LogLevel': 'info',                   // output log level (error, warn, info, debug)
        'DebugLogToConsole': false,           // output debug message to console rather than debug window
        'DebugLogInstanceName': 'bitem.debug.b.basil.org' // Name of debug logging instance
    },
    // Used by Entry.js/Entry.html to specify BasilTest URLs
    'BasilTestURLs': [
        {   'URL': 'ws://127.0.0.1:14690',
            'Description': 'LocalHost',
            'selected': true
        },
        {   'URL': 'ws://regions.herbal3d.org:14690',
            'Description': 'Region test service (region.herbal3d.org:14690)',
        },
        {   'URL': 'ws://basiltest.herbal3d.org:14690',
            'Description': 'Official test service (basiltest.herbal3d.org:14690)',
        }
    ],
    // Used by Entry.js/Entry.html to select grid.
    // Specifies a grid name and the 'get_grid_info' URL for that grid.
    'Grids': [
        {
            'Name': 'localhost',
            'GridInfo': 'http://127.0.0.1:9000/get_grid_info',
            'LoginURL': 'http://127.0.0.1:9000/',
            'Selected': true
        },
        {
            'Name': 'OSGrid.org',
            'GridInfo': 'http://login.osgrid.org/get_grid_info',
            'LoginURL': 'http://login.osgrid.org/'
        },
        {
            'Name': 'OurGrid.life',
            'GridInfo': 'http://ourgrid.life/get_grid_info',
            'LoginURL': 'http://ourgrid.life:80/'
        },
        {
            'Name': 'localTestGrid',
            'GridInfo': 'http://192.168.86.56:9000/get_grid_info',
            'LoginURL': 'http://192.168.86.56:9000/'
        },
        {
            'Name': 'Herbal3dTestRegion',
            'GridInfo': 'http://region.herbal3d.org:9000/get_grid_info',
            'LoginURL': 'http://region.herbal3d.org:9000/'
        }
    ],
    // Used by Entry.js/Entry.html to select test files to load.
    'TestGLTFFiles': [
        {
            'URL': 'https://files.misterblue.com/BasilTest/convoar/epiccastle/mergedmaterials/epiccastle.gltf',
            'Description': 'Epic Castle (mergedmaterials)',
            'Selected': true
        },
        {
            'URL': 'https://files.misterblue.com/BasilTest/convoar/epiccastle/smallassets/epiccastle.gltf',
            'Description': 'Epic Castle (smallassets)'
        },
        {
            'URL': 'https://files.misterblue.com/BasilTest/convoar/epiccastle/unoptimized/epiccastle.gltf',
            'Description': 'Epic Castle (unoptimized)'
        },
        {
            'URL': 'https://files.misterblue.com/BasilTest/convoar/alfea3/mergedmaterials/alfea3.gltf',
            'Description': 'Alfea3 (mergedmaterials)'
        },
        {
            'URL': 'https://files.misterblue.com/BasilTest/convoar/alfea3/smallassets/alfea3.gltf',
            'Description': 'Alfea3 (smallassets)'
        },
        {
            'URL': 'https://files.misterblue.com/BasilTest/convoar/art_city_2025/mergedmaterials/art_city_2025.gltf',
            'Description': 'art_city_2025 (mergedmaterials)'
        },
        {
            'URL': 'https://files.misterblue.com/BasilTest/convoar/art_city_2025/smallassets/art_city_2025.gltf',
            'Description': 'art_city_2025 (smallassets)'
        },
        {
            'URL': 'https://files.misterblue.com/BasilTest/convoar/testtest88/unoptimized/testtest88.gltf',
            'Description': 'Testtest88 (unoptimized)'
        },
        {
            'URL': 'https://files.misterblue.com/BasilTest/convoar/PalmyraTemple/unoptimized/PalmyraTemple.gltf',
            'Description': 'PalmyraTemple (unoptimized)'
        }
    ]
};
