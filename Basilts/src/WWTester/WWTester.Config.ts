// Configuration for WWTester
'use strict';

import { Config, resetConfig } from '@Base/Config';
import deepmerge from 'deepmerge';

// Additional parameters for WWTester
export let WWConfig = {
    // Various overall Basil viewer parameters
    'basil': {
        // If 'true', rewite UniqueIdBase to be the SessionId
        'UseSessionIdForUniqueBase': false,
     },
    'security': {
        'ShouldCheckBasilServerRequestAuth': false,
    },
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
        'RPCSent': false,                // print sent RPC message
        'RPCResponse': false             // print RPC response message
    }
};

// Initialize configuration parameters.
// We merge the above parameters into 'Config' so Config = WWConfig = deepmerge(Config, WWConfig)
export function initConfig(): void {
    // Config.basil.SessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    WWConfig = deepmerge(Config, WWConfig);
    resetConfig(WWConfig);
};