// Copyright 2018 Robert Adams
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';
/* global GP */ // debugging global context (ESlint)

// Global parameters and variables. "GP.variable"
import GP from 'GP';
import Config from 'xConfig';

GGP = GP;   // easy linkage to global context for debugging
GP.Config = Config;

import { Base64 } from 'js-base64';

import { GraphicsInit, GraphicsStart } from 'xGraphics';
import { ControlsInit, ControlsStart } from 'xControls';
import { CommInit, CommStart, ConnectTransportService } from 'xComm';
import { PredefinedBItemInit } from 'xPredefinedItems';

// Force the processing of the CSS format file
import './Basiljs.less';

// From https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
// Used to fetch invocation parameters. The request better be well formed as
//     parsing is pretty simplistic and unforgiving.
GP.ConfigGetQueryVariable = function (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return undefined;
};

// Global debug information printout.
// Adds a text line to a div and scroll the area
GP.LogMessage = function LogMessage(msg, classs) {
    if ($('#DEBUGG')) {
        if (classs)
            $('#DEBUGG').append('<div class="' + classs + '">' + msg + '</div>');
        else
            $('#DEBUGG').append('<div>' + msg + '</div>');

        if ($('#DEBUGG').children().length > Config.page.debugLogLines) {
            $('#DEBUGG').children('div:first').remove();

        }
    }
};
GP.DebugLog = function DebugLog(msg) {
    GP.LogMessage(msg, undefined);
};

GP.ReportError = function ReportError(msg) {
    GP.LogMessage(msg, 'errorMsg');
};

// =====================================================
/*
    Pattern for Basil is for each package to define a global variable to hold
    local state. This is two character (GR, EV, CM, CO, ...). There is one
    global var named 'GP' that has references to everything but that is ONLY
    for use in debugging.
*/

GP.Ready = false;

// Can be called with communication configuration parameters in the URL
let configParams = GP.ConfigGetQueryVariable('c');
if (configParams === undefined) {
    // If no communication parameters are given, use testing parameters
    let testConfigParams = {
        'comm': {
            'testmode': true,
            'testWWURL': './wwtester.js'
        }
    };
    configParams = Base64.encode(JSON.stringify(testConfigParams));
}
if (configParams) {
    try {
        let unpacked = Base64.decode(configParams);
        let newParams = JSON.parse(unpacked);
        if (newParams) {
            Object.assign(Config, newParams);    // property merge of unpacked into Config
        }
    }
    catch(e) {
        GP.DebugLog('Basiljs: failed parsing option config: ' + e);
    }
}

let container = document.getElementById(Config.page.webGLcontainerId);
let canvas = document.getElementById(Config.page.webGLcanvasId);

GraphicsInit(container, canvas);
ControlsInit();
CommInit();

// Initialize the BItem system with predefined items (camera, renderer, debug, ...)
PredefinedBItemInit();

GraphicsStart();
CommStart();
GP.Ready = true;

// If there are connection parameters, start the first connection
if (Config.comm && Object.keys(Config.comm).length > 0) {
  ConnectTransportService(Config.comm)
  .then( () => {
    GP.DebugLog('Basiljs: initial transport and service connected');
  })
  .catch( e => {
    GP.DebugLog('Basiljs: failed connecting initial transport and service: ${e}');
  });
};
