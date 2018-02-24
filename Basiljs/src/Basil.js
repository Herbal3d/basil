// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).
'use strict';

// Global parameters and variables. "GP.variable"
// var GP = GP || {};

import Config from 'xConfig';
import * as $ from 'jquery';

GP.Config = Config;

// Force the processing of the CSS format file
require('./Basiljs.less');

// From https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
// Used to fetch invocation parameters. The request better be well formed as
//     parsing is pretty unforgiving.
function configGetQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return undefined;
}

// Global debug information printout.
// Adds a text line to a div and scroll the area
var DebugLogLines = 20;
GP.LogMessage = function LogMessage(msg, classs) {
    if ($('#DEBUGG')) {
        if (classs)
            $('#DEBUGG').append('<div class="' + classs + '">' + msg + '</div>');
        else
            $('#DEBUGG').append('<div>' + msg + '</div>');

        if ($('#DEBUGG').children().length > DebugLogLines) {
            $('#DEBUGG').children('div:first').remove();

        }
    }
};
GP.DebugLog = function DebugLog(msg) {
    GP.LogMessage(msg, undefined);
}

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

import * as Comm from 'xComm';
import * as Graphics from 'xGraphics';
import * as Controls from 'xControls';

GP.Ready = false;

var container = document.getElementById(Config.page.webGLcontainerId);
var canvas = document.getElementById(Config.page.webGLcanvasId);

Graphics.Init(container, canvas)
.then(() => {
    Controls.Init();

    Graphics.Start();
    Comm.Start();

    GP.Ready = true;
})
.catch ((e) => {
    GP.DebugLog('Basil.main: failure initializing:' + e);
});
