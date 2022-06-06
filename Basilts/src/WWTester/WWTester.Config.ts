// Configuration for WWTester
'use strict';

import { resetConfig } from '@Base/Config';

// All the possible configuration parameters.
// This sets defaults values and is over-written by environment variables and
//     supplied configuration file contents.
export const WWConfig = {
    // Various overall Basil viewer parameters
    'basil': {
        // ms before removing deleted BItem
        'BItemDeleteInterval': 60000,
        // A random string used to identify this Basil instance
        'SessionId': '1234567890',
        // Note that basename begins with a dot
        'UniqueIdBase': '.wwt.herbal3d.org',
        // If 'true', rewite UniqueIdBase to be the SessionId
        'UseSessionIdForUniqueBase': true,
     },
    'comm': {
        'transports': [ 'WW', 'WS' ],
        'protocols': [ 'Basil-JSON', 'Basil-FB', 'Basil-PB' ],
    },
    'security': {
        'ShouldCheckBasilServerRequestAuth': false,
    },
    // Parameters for the main display page
    'page': {
        'webGLcontainerId': 'b-webGLdiv',
        'webGLcanvasId': 'b-webGLcanvas',
        'showDebug': false,
        'debugElementId': 'b-DEBUGG',
        'debugErrorClass': 'b-errorMsg',
        'debugLogLines': 30
    },
    // Loader for assets
    'assetLoader': {
        'useDRACO': true,           // unpack DRACO compression if used
        'combineInstances': true    // whether to combine instances
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
    }, // Connection and debug information when running the WebWorker test
    'WWTester': {
        'LogToConsole': true,        // Log to console. Otherwise, use msg to debug BItem
        'LogToDebugInstance': false, // Log to the remote debug instance
        'GenerateAliveCheck': false, // whether to generate AlvieCheck messages
        'AliveCheckPollMS': 10000,   // ms interval to generate AliveCheck's
        'PrintDebugOnAliveResponse': false  // print message on AliveCheck response
    },
    // Various flags that turn on/off debug logging, etc
    'Debug': {
        'EnableLogging': true,          // whether to output any logging
        'DebugLogToConsole': true,      // output debug message to console rather than debug window
        'LogLevel': 'debug',            // output log level (error, warn, info, debug)
        'DebugLogInstanceName': 'bitem.debug.b.basil.org', // Name of debug logging instance,
        'RPCSent': true,                // print sent RPC message
        'RPCResponse': true             // print RPC response message
    }
};

// Initialize configuration parameters.
// TODO: look at URL query parameters and get values from there
export function initConfig(): void {
    // Config.basil.SessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    WWConfig.basil.SessionId = Math.random().toString(36).substring(3, 15);
    if (WWConfig.basil.UseSessionIdForUniqueBase) {
        WWConfig.basil.UniqueIdBase = '.' + WWConfig.basil.SessionId;
    };
    configSub(WWConfig, '.UNIQUEIDBASE', WWConfig.basil.UniqueIdBase);

    resetConfig(WWConfig);
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


