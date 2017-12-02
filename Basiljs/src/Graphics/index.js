// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).
'use strict';

// Load the underlying graphics library
var Config = require('XConfig');

var engine = Config.webgl.engine;

var importScript = (function (oHead) {
    return function (sSrc, fOnload, fOnError) {
        let oScript = document.createElement("script");
        oScript.type = "text\/javascript";
        oScript.onerror = fOnError;
        if (fOnload) { oScript.onload = fOnload; }
        oHead.appendChild(oScript);
        oScript.src = sSrc;
    }

})(document.head || document.getElementsByTagName("head")[0]);

// The configuration ways which graphis engine to load.
// Load the engine and save the state of the load.
for (var script of Config.webgl.renderer[engine].scripts) {
    DebugLog('Loading graphics script ' + script);
    importScript(script, function() {
            // script loaded
        },
        function() {
            // script load failed
        }
    );
}
