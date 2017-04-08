// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

// Template for transport implmentations.
// Using 'functional pattern' from http://davidshariff.com/blog/javascript-inheritance-patterns/
//     mostly because it isolates all the children and fixes closure overlaps.

// See MessagingDesign.md for what the flow layer is supposed to do

var BFlow = function(transport) {
    var that = {
        'write': function(msg) {},
        'call': function(msg, responseCallback) {},
        'read': function(completionCallback) {},
        'dataAvailable': function(callBack) {},
    };
    that.transport = transport
    return that;
}
