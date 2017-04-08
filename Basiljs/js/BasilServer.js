// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

// Global holding Basil server
var BS = BS || {};

define(['Config', 'FlatBuffers', 'BasilClientGenerated', 'BasilServerGenerated'],
            function( Config, Flat, BClient, BServer) {
    // ===========================================
    // Operations returned for Basil server.
    var op = {
        'addEntity': function() {
        },
        'removeEntity': function() {
        },
        'addInstance': function() {
        },
        'removeInstance': function() {
        },
        'noComma': 0
    };

    GP.BS = BS; // For debugging. Don't use for cross package access.

    BS.op = op;

    return op;
});
