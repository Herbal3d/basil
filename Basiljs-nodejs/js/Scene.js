// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

// Global holding scene state
var SC = SC || {};

define(['Graphics', 'Config'], function( Graphics, Config ) {
    // ===========================================
    // Operations returned for scene.
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

    GP.SC = SC; // For debugging. Don't use for cross package access.

    SC.op = op;

    return op;
});
