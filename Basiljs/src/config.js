// Configuration
// Just returns a data structure of configuration parameters.
// Note: colors may be specified as strings (a number as a string) or numbers.
'use strict';

// Using the CommonJS format as ES6 'default' doesn't work right in webpack (20171205)
export default {
    // Various overall Basil viewer parameters
    'basil': {
        // ms before removing deleted BItem
        'BItemDeleteInterval': 60000
     },
    'comm': {
        // Filled by parameters passed in initial invocation
        /*
        'transportURL': 'connectionURLForTransport',
        'transport': 'one of WS, WW',
        'service': 'one of SpaceServerClient, Pesto',
        'testmode': false,
        'TestAsset': {
            'url': 'URL to asset',
            'loaderType': 'GLTF'
        }
        */
    },
    'auth': {
        // Filled by parameters passed in initial invocation
        /*
        'SessionKey': '',   // identifier for the session
        'SessionAuth': ''   // authorization key
        */
    },
    // Parameters for the main display page
    'page': {
        'webGLcontainerId': 'webGLcontainer',
        'webGLcanvasId': 'webGLcanvas',
        'showDebug': false,
        'debugLogLines': 20
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
                'groundColor': 0x000000      //0x000000
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
            'gammaOutput': true,
            'gammaFactor': 2.20
        },
    },
    // Names for predefined/service BItem layers
    'layers': {
        'default': 'org.basil.b.layers.default',
        'comm': 'org.basil.b.layers.comm',
        'service': 'org.basil.b.layers.service',
        'eventing': 'org.basil.b.layers.eventing'
    },
    // Flags for fetching assets.
    'assets': {
        'gltfURLBase': '/basil/',
        'assetFetchTimeoutMS': 5000,        // MS timeout for an asset to load
        'assetFetchCheckIntervalMS': 200,   // MS between checks for asset loaded
        'instanceAssetWaitTimeoutMS': 10000 // MS for instance to wait for its displayable to load
    },
    // Parameters for the simple eventing system
    'eventing': {
        'eventPollIntervalMS': 500
    },
    'security': {
        'ShouldCheckBasilServerRequestAuth': true,
    },
    // Connection and debug information when running the WebWorker test
    'WWTester': {
        'LogToConsole': false,       // Log to console. Otherwise, use msg to debug BItem
        'GenerateAliveCheck': true, // whether to generate AlvieCheck messages
        'AliveCheckPollMS': 10000,   // ms interval to generate AliveCheck's
        'PrintDebugOnAliveResponse': false, // print message on AliveCheck response
        'comm': {
            'testmode': true,
            'transport': 'WW',
            'transportURL': './wwtester.js',
            'service': 'SpaceServerClient',
            'TestAsset': {
                // 'url': 'http://files.misterblue.com/BasilTest/convoar/testtest88/unoptimized/testtest88.gltf',
                // 'url': 'http://files.misterblue.com/BasilTest/convoar/PalmyraTemple/unoptimized/PalmyraTemple.gltf',
                // 'url': 'http://files.misterblue.com/BasilTest/convoar/Atropia_11/smallassets/Atropia_11.gltf',
                // 'url': 'http://files.misterblue.com/BasilTest/convoar/Atropia_11/unoptimized/Atropia_11.gltf',
                'url': 'http://files.misterblue.com/BasilTest/convoar/epiccastle/smallassets/epiccastle.gltf',
                'loaderType': 'GLTF'
            }
        }
    },
    // Connection information when running WebSocket tester
    'WSTester': {
        'comm': {
            'testmode': true,
            'transport': 'WS',
            'transportURL': 'ws://192.168.86.41:11440/',
            'service': 'SpaceServerClient',
            'TestAsset': {
                // 'url': 'http://files.misterblue.com/BasilTest/convoar/testtest88/unoptimized/testtest88.gltf',
                // 'url': 'http://files.misterblue.com/BasilTest/convoar/PalmyraTemple/unoptimized/PalmyraTemple.gltf',
                'url': 'http://files.misterblue.com/BasilTest/convoar/epiccastle/unoptimized/epiccastle.gltf',
                'loaderType': 'GLTF'
            }
        }
    },
    // Various flags that turn on/off debug logging, etc
    'Debug': {
      'CollectDebug': true,                 // output debugging info
      'DebugLogToConsole': false,           // output debug message to console rather than debug window
      'VerifyProtocol': false,              // call 'verify' on created protocol messages
      'MsgProcessorProcessPrintMsg': false, // DebugLog each message processed by MsgProcessor
      'MsgProcessorResponsePrintMsg': false, // DebugLog each message sent as a response by MsgProcessor
      'SendAndPromisePrintMsg': false,      // DebugLog each message sent with expected response
      'HandleResponsePrintMsg': false,      // DebugLog each message handled as a response
      'DebugLogInstanceName': 'org.basil.b.debug.BItem' // Name of debug logging instance
    },
    // Information for loading multiple Atropia regions with filename and displacement.
    // Left over from testing multiple region display. Not used any more.
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
    ],
    // Used by Entry.js/Entry.html to select grid.
    // Specifies a grid name and the 'get_grid_info' URL for that grid.
    'Grids': [
        {
            'Name': 'localhost',
            'GridInfo': 'http://127.0.0.1:9000/get_grid_info',
            'LoginURL': 'http://127.0.0.1:8002/',
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
}
;
