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

define(['Config'],
            function( Config ) {

    return function() {
        var that = {};

        that.open = function(connectionString) {},
        that.close = function() {},
        that.send = function(data) {},
        // Read a message and call the callback when received. Will hang if no input yet.
        that.receive = function(completionCallback) {},
        // Call callback when there is data in put input queue.
        //    A way of getting called when data is available.
        //    Pass 'undefined' to turn off the callbacks.
        that.dataAvailable = function(callBack) {},
        that.isOpen = function() {}

        return that;
    }
});
