// Configuration For the Entry environment
// Sets up logging and other utility functions

'use strict';

export const Config = {
    'page': {
        'showDebug': false,
        'debugElementId': 'b-DEBUGG',
        'versionElementId': 'b-version'
    },
    // the current 'index.html' just lets us get to one region
    'gridLoginURL': 'https://basil.bluestuff.org/osgrid/',
    'regionWssURL': 'wss://basil.bluestuff.org/wss/',

    // Until the region returns its connection URL, we construct it from
    //    the returned IP address and this template
    'transportURLTemplate': 'ws://IP-ADDRESS:11440/',
    // Various flags that turn on/off debug logging, etc
    'Debug': {
        'EnableLogging': true,           // whether to output any logging
        'DebugLogToConsole': true,       // output debug message to console rather than debug window
        'VisibleDebugLog': true,         // whether to show debug log in browser
        'LogLevel': 'debug',              // output log level (error, warn, info, debug)
        'SendAndPromisePrintMsg': false, // optionally print response message
        'DebugLogInstanceName': 'bitem.debug.b.basil.org' // Name of debug logging instance
    }
};


