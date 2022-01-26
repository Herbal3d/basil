// Configuration For the Entry environment
// Sets up logging and other utility functions

'use strict';

export const Config = {
    'page': {
        'showDebug': true,
        'debugElementId': '#DEBUGG'

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
    // Names for predefined/service BItem layers
    'layers': {
        'default': 'org.herbal3d.b.layers.default',
        'comm': 'org.herbal3d.b.layers.comm',
        'service': 'org.herbal3d.b.layers.service',
        'eventing': 'org.herbal3d.b.layers.eventing'
    },
    // Various flags that turn on/off debug logging, etc
    'Debug': {
        'EnableLogging': true,                // whether to output any logging
        'LogLevel': 'debug',                  // output log level (error, warn, info, debug)
        'SendAndPromisePrintMsg': false,        // optionally print response message
        'DebugLogToConsole': true,           // output debug message to console rather than debug window
        'DebugLogInstanceName': 'bitem.debug.b.basil.org' // Name of debug logging instance
    },
    // Used by Entry.js/Entry.html to specify BasilTest URLs
    'BasilTestURLs': [
        {   'URL': 'ws://127.0.0.1:14690',
            'Description': 'LocalHost',
            'Selected': true
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
            'Description': 'Testtest88 (unoptimized)',
            'Selected': true
        },
        {
            'URL': 'https://files.misterblue.com/BasilTest/convoar/PalmyraTemple/unoptimized/PalmyraTemple.gltf',
            'Description': 'PalmyraTemple (unoptimized)'
        }
    ]
};

