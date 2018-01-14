// Copyright 2018 Robert Adams
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
    GP.DebugLog('Loading graphics script ' + script);
    importScript(script, function() {
            // script loaded
        },
        function() {
            // script load failed
        }
    );
}
