// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

// From https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
// Used to see if 'engine' is specified before any environment or libraries are loaded.
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

// Global parameters and variables. "GP.variable"
var GP = GP || {};

var Config = require('../BasilConfig');
GP.Config = Config;

// Get optional invocation parameter specifying which rendering engine to use
var gEngine = configGetQueryVariable('engine');
if (gEngine) {
    Config.webgl.engine = gEngine;
}

/*
    Pattern for Basil is for each package to define a global variable to hold
    local state. This is two character (GR, EV, CM, CO, ...). There is one
    global var named 'GP' that has references to everything but that is ONLY
    for use in debugging.

    Each package creates a map named 'op' that has the packages external operations.
    'op' is what is returned by require() for external access to the package.
    This is added to the packages local var so there is always a 'GP.EV.op', for
    instance.
*/

var Comm = require('../BasilComm');
var Graphics = require('../BasilGraphics');
var Controls = require('../BasilControls');

GP.Ready = false;

var container = document.getElementById(Config.page.webGLcontainerId);
var canvas = document.getElementById(Config.page.webGLcanvasId);
Graphics.Init(container, canvas, function() {
    Controls.Init();

    Graphics.Start();
    Comm.Start();

    GP.Ready = true;
});

// Global debug information printout.
// Adds a text line to a div and scroll the area
var DebugLogLines = 20;
function DebugLog(msg) {
    LogMessage(msg, undefined);
}

function ReportError(msg) {
    LogMessage(msg, 'errorMsg');
};

function LogMessage(msg, classs) {
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
