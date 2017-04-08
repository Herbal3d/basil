// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

// Template for transport implmentations.
// Using 'functional pattern' from http://davidshariff.com/blog/javascript-inheritance-patterns/
//     mostly because it isolates all the children and fixes closure overlaps.

// open(transportSpecificParameters)
// close()
// write(data)
// data = read()
// dataAvailable(callBack)
// isOpen()

var BTransport = function() {
    var that = {
        'open': function(connectionString) {},
        'close': function() {},
        'write': function(data) {},
        'read': function(completionCallback) {},
        'dataAvailable': function(callBack) {},
        'isOpen': function() {}
    };
    return that;
}
