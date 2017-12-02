// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).
'use strict';

// Template for transport implmentations.
// Using 'functional pattern' from http://davidshariff.com/blog/javascript-inheritance-patterns/
//     mostly because it isolates all the children and fixes closure overlaps.
// To create a new instance: var newInstance = BTransportWebWorker();

// open(transportSpecificParameters)
// close()
// write(data)
// data = read()
// dataAvailable(callBack)
// isOpen()

define(['Config'],
            function( Config ) {

    return function() {
        var that = BTransport();
        that.open = function(connectionString) {};
        that.close = function() {};
        that.send = function(data) {};
        that.receive = function(completionCallback) {};
        that.dataAvailable = function(callBack) {};
        that.isOpen = function() {};
        return that;
    }
});
