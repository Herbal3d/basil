// Configuration for WWTester
'use strict';

// All the possible configuration parameters.
// This sets defaults values and is over-written by environment variables and
//     supplied configuration file contents.
export const Config = {
    // Various overall Basil viewer parameters
    'basil': {
        // ms before removing deleted BItem
        'BItemDeleteInterval': 60000
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
}