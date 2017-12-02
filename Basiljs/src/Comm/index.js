// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).
'use strict';

var CM = CM || {};

var op = {
    'Init': function() {
    },
    'Start': function() {
    },
    'Connect': function(spaceManagerURL, connector) {
    },
    'noComma': 0
};

GP.CM = CM; // for debugging. Don't use for cross package access.

CM.op = op;

export default op;


