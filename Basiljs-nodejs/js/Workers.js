// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

var WO = WO || {};

// Library for creating WebWorkers.
// This doesn't do much but it is here so I can eventually create and
//     manage a pool of WebWorkers.

define([], function() {
    var op = {};

    // Set the number of workers in the pool
    op.SetPoolSize = function(numWorkers) {
    };

    // Create a worker from the pool
    op.CreateWorker: function(workerURL) {
        var worker;
        try {
            worker = new Worker(workerURL);
        }
        catch (e) {
            worker = undefined;
        }
        return worker;
    };

    op.TerminateWorker = function(worker) {
        worker.terminate();
        // Add worker back to pool
    };

    // Pool of workers
    WO.workers = [];
    WO.maxPoolSize = 10;

    GP.WO = WO; // for debugging. Don't use for cross package access.

    WO.op = op;

    return op;
});

