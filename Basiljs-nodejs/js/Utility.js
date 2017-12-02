// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

var UT = UT || {};

define([], function() {
    var op = {};
    op.guid = {};
    op.guid.create = function() {
        return (S4() + S4()
                    + "-" + S4()
                    + "-4" + S4().substr(0,3)
                    + "-" + S4() 
                    + "-" + S4() + S4() + S4()
                ).toLowerCase();
    };
    op.guid.S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
    };
    op.guid.ZERO = "00000000-0000-0000-000000000000";

    GP.UT = UT; // for debugging. Don't use for cross package access.

    UT.op = op;

    return op;
});

