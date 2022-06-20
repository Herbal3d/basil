// Configuration
// Just returns an object that has all the parameters
// Someday integrate with 'command-line-args' or 'dotenv'

'use strict';

import { BKeyedCollection } from '@Tools/bTypes';

// All the possible configuration parameters.
// This sets defaults values and is over-written by environment variables and
//     supplied configuration file contents.
export let Config = {
    // Various overall Basil viewer parameters
    'basil': {
        // The invocation of Basil can pass sections to add to configuration
        //      Comma separated list of section names
        'KnownConfigurationSections': 'OpenSimulator',
        // ms before removing deleted BItem
        'BItemDeleteInterval': 60000,
        // A random string used to identify this Basil instance
        'SessionId': '1234567890',
        // Note that basename begins with a dot
        'UniqueIdBase': '.b.herbal3d.org',
        // If 'true', rewite UniqueIdBase to be the SessionId
        'UseSessionIdForUniqueBase': true,
     },
    // Filled by parameters passed in initial invocation
    'initialMakeConnection': {
        'transport': 'WW',
        'transportURL': './wwtester.js',
        'protocol': 'Basil-JSON',
        'service': 'SpaceServer',
        'clientAuth': '12345678901234567890',
        'serviceAuth': '123456789012345678901234567890',
        'serviceAddr': '1234567890',
        'openParams': {
            'assetURL': '',
            'loaderType': 'GLTF',
            'display': 'none'
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
        'webGLcontainerId': 'b-webGLdiv',
        'webGLcanvasId': 'b-webGLcanvas',
        'topDialogsElementId': 'b-topDialogs',
        'dialogsElementId': 'b-dialogs',
        'showDebug': false,
        'debugElementId': 'b-DEBUGG',
        'versionElementId': 'b-version',
        'debugErrorClass': 'b-errorMsg',
        'debugLogLines': 30
    },
    // Loader for assets
    'assetLoader': {
        'useDRACO': true,           // unpack DRACO compression if used
        'combineInstances': true    // whether to combine instances
    },
    // Parameters for the webgl environment
    'webgl': {
        'graphicsId': 'graphics.UNIQUEIDBASE',
        'engine': 'BabylonJS',
        'camera': {
            // Change interface CameraParameters if any thing is changed here
            'name': 'camera.UNIQUEIDBASE',
            'camtype': 'universal',
            'initialCameraPosition': [ 200, 50, 200 ],
            'initialViewDistance': 200,
            'initialCameraLookAt': [ 0, 0, 0 ]
        },
        'lights': {
            // Change interface LightingParameters if any thing is changed here
            'ambient': {
                'name': 'ambient1',
                'color': [34, 34, 34],
                'intensity': 0.02,
                'specular': [ 80, 80, 80 ],
                'diffuse': [ 80, 80, 80 ],
                'groundColor': [0, 0, 0]
            },
            // placeholder for the eventual sun system
            'directional': {
                'name': 'directional1',
                'color': [238, 238, 238],
                'direction': [ 1000, 1000, 1000 ],
                'intensity': 0.01,
                'shadows': {
                    'useShadows': false,
                    'shadowMapSize': 1024
                }
            }
        },
        'fog': {
            'enabled': true,
            'color': '[230,230,230]',
            'density': 0.025,
        },
        'renderer': {
            'BabylonJS': {
                'engineOptions': {
                    'audioEngine': true,    // initialize the audio system also
                },
                'sceneOptions': {
                },
                'environment': {
                    'skyMaterial': {
                        'enable': true,
                        'turbidity': 2,         // scattering of haze (1..20)
                        'luminance': 1,         // overall luminance of the scene (0..1)
                        'inclination': 0.4,     // angle between the up and z axis (0..1)
                        'azimuth': 0.25,        // angle between the x and z axis (0..1)
                        'rayleigh': 1,          // sky color at the horizon. (0..2)
                        'mieDirectionalG': 0.8, // sun light scattering factor (0..1)
                        'mieCoefficient': 0.005,// sun light absorption factor (0..1)
                        'trackCamera': true     // follow camera height
                    }
                },
                'optimizations': {     // optimizations for the BabylonJS engine
                    'enable': true,
                    'moderate': true,   // only one of moderate or aggressive
                    'aggressive': false
                },
                // This is needed because of how Babylon interprets the vertex buffers
                'rebuildBoundingBoxes': true
            },
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
        'default': 'd.layer.UNIQUEIDBASE',
        'comm': 'comm.layer.UNIQUEIDBASE',
        'service': 'service.layer.UNIQUEIDBASE',
        'eventing': 'eventing.layer.UNIQUEIDBASE',
    },
    'infrastructureBItemNames': {
        'registration': 'registration.bitem',  // BItem created to contain AbRegistration
        'camera': 'camera.UNIQUEIDBASE',
        'keyboard': '0.keyboard.UNIQUEIDBASE',
        'mouse': '0.mouse.UNIQUEIDBASE',
        'environment': 'env.UNIQUEIDBASE'
    },
    // Flags for fetching assets.
    'assets': {
        'gltfURLBase': '/basil/',
        'assetFetchTimeoutMS': 20000,       // MS timeout for an asset to load
        'assetFetchCheckIntervalMS': 200,   // MS between checks for asset loaded
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
            'service': 'SpaceServer',
            'serviceAuth': '111999555222000777111222',
            'openParams': {
                'assetURL': 'https://files.misterblue.com/BasilTest/convoar/testtest88/unoptimized/testtest88.gltf',
                // 'AssetURL': 'https://files.misterblue.com/BasilTest/convoar/epiccastle/smallassets/epiccastle.gltf',
                'loaderType': 'GLTF'
            }
        }
    },
    // Various flags that turn on/off debug logging, etc
    'Debug': {
        'EnableLogging': true,          // whether to output any logging
        'DebugLogToConsole': true,      // output debug message to console rather than debug window
        'LogLevel': 'debug',            // output log level (error, warn, info, debug)
        'DebugLogInstanceName': 'bitem.debug.b.basil.org', // Name of debug logging instance
        'MakeConnectionDetail': false,  // output detailed info when processing MakeConnection
        'SendMsg': true,                // output detailed message when message sent
        'RcvdMsg': true,                // output detailed message when message received
        'RPCSent': true,                // print sent RPC message
        'RPCResponse': true,            // print RPC response message
        'PlacementDetail': false,       // print detailed info from AbPlacement

        'ShowBoundingBox': false         // show bounding box items loaded into scene
    }
};

export interface CameraParameters {
    cameraId: string,
    cameraInstanceId: string,
    name: string,
    camtype: string,
    initialCameraPosition: number[],
    initialViewDistance: number,
    initialCameraLookAt: number[],
    addCameraHelper: boolean,
    addAxesHelper: boolean,
    axesHelperSize: number
};
export interface AmbientLightingParameters {
    name?: string;
    color?: string | number[];
    intensity?: number;
    specular?: string | number[];
    diffuse?: string | number[];
    groundColor?: string | number[];
}
export interface DirectionalLightingParameters {
    name?: string;
    color?: string | number[];
    direction?: string | number[];
    intensity?: number;
    shadows?: {
        useShadows: boolean;
        shadowMapSize: number;
    }
};

// When Basil is started, it is passed configuration parameters
// This is the format of Config.initialMakeConnection
export interface EntryConfigParameters {
    'transport': string,
    'transportURL': string,
    'protocol': string,
    'service': string,
    'serviceAuth': string,
    'openParams': { // parameters specifying object to open for testing
        'assetURL': string,
        'loaderType': string,
        'display': string
    }
};

// When other config definitions are used, we need to sit on top of the base config
export function resetConfig(pNewConfig: BKeyedCollection): void {
    // @ts-ignore
    Config = pNewConfig;
}

// Initialize configuration parameters.
// TODO: look at URL query parameters and get values from there
export function initConfig(): void {
    // Config.basil.SessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    Config.basil.SessionId = Math.random().toString(36).substring(3, 15);
    if (Config.basil.UseSessionIdForUniqueBase) {
        Config.basil.UniqueIdBase = '.' + Config.basil.SessionId;
    };
    configSub(Config, '.UNIQUEIDBASE', Config.basil.UniqueIdBase);
};

export interface KeyedCollection {
  [ key: string]: any
};
// Replace occurances of pFind with pSub in any string value in the passed
//     key/value object. Recursively decends the object.
// Used to replace UNIQUEIDBASE in Config.
function configSub(pConfig: KeyedCollection, pFind: string, pSub: string): void {
    const regExp = new RegExp(pFind, 'g');
    Object.keys(pConfig).forEach((key: string) => {
        if (typeof(pConfig[key]) === 'object') {
            configSub(pConfig[key] as KeyedCollection, pFind, pSub);
        }
        else if (typeof(pConfig[key]) === 'string') {
            pConfig[key] = (pConfig[key] as string).replace(regExp, pSub);
        };
    });
}

// From https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
// Used to fetch invocation parameters. The request better be well formed as
//     parsing is pretty simplistic and unforgiving.
export function ConfigGetQueryVariable(pVariable: string): string {
    const query: string = window.location.search.substring(1);
    const vars: string[] = query.split('&');
    for (const oneQuery of vars) {
        const pair: string[] = oneQuery.split('=');
        if (decodeURIComponent(pair[0]) === pVariable) {
            return decodeURIComponent(pair[1]);
        };
    };
    return undefined;
};
// Take apart an URL query string and return an object of key/value pairs
export function ParseQueryString(pQuery: string): Map<string,string> {
  const ret = new Map<string,string>();
  const args = decodeURI(pQuery).split('&');
  args.forEach( arg => {
    const argPieces = arg.split('=');
    switch (argPieces.length) {
      case 1:
        ret.set(argPieces[0], null); break;
      case 2:
        ret.set(argPieces[0], argPieces[1]); break;
      default:
        break;  // doesn't make sense so ignore it
    };
  })
  return ret;
};
