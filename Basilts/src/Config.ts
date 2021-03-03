// Configuration
// Just returns an object that has all the parameters
// Someday integrate with 'command-line-args' or 'dotenv'

'use strict';

// All the possible configuration parameters.
// This sets defaults values and is over-written by environment variables and
//     supplied configuration file contents.
export const Config = {
    // Various overall Basil viewer parameters
    'basil': {
        // The invocation of Basil can pass sections to add to configuration
        //      Comma separated list of section names
        'KnownConfigurationSections': 'OpenSimulator',
        // ms before removing deleted BItem
        'BItemDeleteInterval': 60000,
        // Note that basename begins with a dot
        'UniqueIdBase': '.b.basil.org'
     },
    // Filled by parameters passed in initial invocation
    'initialMakeConnection': {
        'Transport': 'WW',
        'TransportURL': './wwtester.js',
        'Protocol': 'Basil-JSON',
        'Service': 'SpaceServer',
        'ServiceAuth': '',
        'OpenParams': {
            'AssetURL': '',
            'LoaderType': 'GLTF'
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
        'showDebug': true,
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
            'cameraId': '1.camera.b.basil.org',
            'cameraInstanceId': '1.camera.instance.b.basil.org',
            'name': 'camera1',
            'initialCameraPosition': [ 200, 50, 200 ],
            'initialViewDistance': 2000,
            'initialCameraLookAt': [ 128, 30, 128 ],
            'addCameraHelper': false,
            'addAxesHelper': true,
            'axesHelperSize': 20
        },
        'lights': {
            // Change interface LightingParameters if any thing is changed here
            'ambient': {
                'name': 'ambient1',
                'color': '[34,34,34]',
                'intensity': 0.9,
                'specular': 0x505050,
                'diffuse': 0x505050,
                'groundColor': '[0,0,0]'
            },
            // placeholder for the eventual sun system
            'directional': {
                'name': 'directional1',
                'color': '[238,238,238]',
                'direction': [ 1000, 1000, 1000 ],
                'intensity': 1,
                'shadows': {
                    'bias': 0.0001,
                    'mapWidth': 2048,
                    'mapHeight': 2048
                }
            }
        },
        'fog': {
            'enabled': false,
            'type': 'linear',   // 'linear' or 'exponential'
            'color': '[230,230,230]',
            'density': 0.00025,
            'near': 1,
            'far': 5000
        },
        'renderer': {
            'ThreeJS': {
                // Parameters passed to the renderer when created.
                //   see https://threejs.org/docs/index.html#api/renderers/WebGLRenderer
                // 'canvas': null,         // value set by code before passing to ThreeJS
                // 'context': null,        // value set by code before passing to ThreeJS
                'precision': 'lowp',    // 'highp', 'mediump', lowp' (default is 'highp')
                'alpha': true,          // there are alpha textures in the scene
                'premultipliedAlpha': true, // renderer assumes colors have premultipled alphs
                'antialias': false,     // enable anti-aliasing
                'stencil': true,        // drawing buffer has stencil buffer of at least 8 bits
                'preserveDrawingBuffer': false, // preserve until manually removed
                'powerPreference': 'default',   // 'high-performace', 'low-power', 'default'
                'failIfMajorPerformanceCaveat': false,  // see WebGL spec
                'depth': true,          // depth buffer of greater than 16 bits
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
        'default': 'default.layer.b.basil.org',
        'comm': 'comm.layer.b.basil.org',
        'service': 'service.layer.b.basil.org',
        'eventing': 'eventing.layer.b.basil.org',
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
    WWTester: {
        LogToConsole: false,       // Log to console. Otherwise, use msg to debug BItem
        GenerateAliveCheck: false, // whether to generate AlvieCheck messages
        AliveCheckPollMS: 10000,   // ms interval to generate AliveCheck's
        PrintDebugOnAliveResponse: false, // print message on AliveCheck response
        initialMakeConnection: {
            Transport: 'WW',
            TransportURL: './wwtester.js',
            Protocol: 'Basil-JSON',
            Service: 'SpaceServer',
            ServiceAuth: '',
            OpenParams: {
                // 'AssetURL': 'https://files.misterblue.com/BasilTest/convoar/testtest88/unoptimized/testtest88.gltf',
                AssetURL: 'https://files.misterblue.com/BasilTest/convoar/epiccastle/smallassets/epiccastle.gltf',
                LoaderType: 'GLTF'
            }
        }
    },
    // Various flags that turn on/off debug logging, etc
    'Debug': {
        'EnableLogging': true,          // whether to output any logging
        'DebugLogToConsole': true,      // output debug message to console rather than debug window
        'LogLevel': 'debug',            // output log level (error, warn, info, debug)
        'DebugLogInstanceName': 'bitem.debug.b.basil.org', // Name of debug logging instance
        'RPCSent': true,                // print sent RPC message
        'RPCResponse': true             // print RPC response message
    }
};

export interface LightingParameters {
    ambient: {
        name: string;
        color: string;
        intensity: number;
        specular: number;
        diffuse: number;
        groundColor: number;
    },
    // placeholder for the eventual sun system
    directional: {
        name: string;
        color: string;
        direction: number[];
        intensity: number;
        shadows: {
            bias: number;
            mapWidth: number;
            mapHeight: number;
        }
    }
};

// When Basil is started, it is passed configuration parameters
// This is the format of Config.initialMakeConnection
export interface EntryConfigParameters {
    'Transport': string,
    'TransportURL': string,
    'Protocol': string,
    'Service': string,
    'ServiceAuth': string,
    'OpenParams': {
        'AssetURL': string,
        'LoaderType': string
    }
};