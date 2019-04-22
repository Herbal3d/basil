// Configuration
// Just returns a data structure of configuration parameters.
// Note: colors may be specified as strings (a number as a string) or numbers.
'use strict';

// Using the CommonJS format as ES6 'default' doesn't work right in webpack (20171205)
export default {
    'comm': {
        /*
        // Filled by parameters passed in initial invocation
        'transportURL': 'connectionURLForTransport',
        'transport': 'one of WS, WW',
        'service': 'one of SpaceServerClient, Broth, Pesto',
        'testmode': false,
        'TestAsset': {
            'url': 'URL to asset',
            'loaderType': 'GLTF'
        }
        */
    },
    // Parameters for the main display page
    'page': {
        'webGLcontainerId': 'webGLcontainer',
        'webGLcanvasId': 'webGLcanvas',
        'collectDebug': true,
        'showDebug': true,
        'debugLogLines': 30
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
    'assets': {
        'gltfURLBase': '/basil/',
        'assetFetchTimeoutMS': 5000,        // MS timeout for an asset to load
        'assetFetchCheckIntervalMS': 200,   // MS between checks for asset loaded
        'instanceAssetWaitTimeoutMS': 10000 // MS for instance to wait for its displayable to load
    },
    'eventing': {
        'eventPollIntervalMS': 500
    },
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
    'Debug': {
      'VerifyProtocol': false,              // call 'verify' on created protocol messages
      'MsgProcessorProcessPrintMsg': false, // DebugLog each message processed by MsgProcessor
      'MsgProcessorResponsePrintMsg': false, // DebugLog each message sent as a response by MsgProcessor
      'SendAndPromisePrintMsg': false,      // DebugLog each message sent with expected response
      'HandleResponsePrintMsg': false,      // DebugLog each message handled as a response
      'DebugLogInstanceName': 'org.basil.b.debug.BItem' // Name of debug logging instance
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
    ],
    'EntrySelections': {
        'URLBase': 'https://files.misterblue.com/BasilTest/convoar/',
        'extension': '.gltf',
        'formats': [ 'unoptimized', 'smallassets', 'mergedmaterials' ],
        'scenes': [
            'testtest88',
            'epiccastle',
            'PalmyraTemple'
        ],
        'justURLS': [
            // [ 'title', 'url' ]
        ]
    }
}
;
