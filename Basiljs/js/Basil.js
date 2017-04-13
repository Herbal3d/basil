// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

// Global parameters and variables. "GP.variable"
var GP = GP || {};

GP.requireConfig = requireConfig;   // from the './requireConfig.js' in index.html

/*
    Pattern for Basil packages is each has a local, global variable to hold
    local state. This is two character (GR, EV, CM, CO, ...). There is one
    global var named 'GP' that has references to everything but that is ONLY
    for use in debugging.

    Each package creates a map named 'op' that has the packages external operations.
    'op' is what is returned by RequireJS for external access to the package.
    This is added to the packages local var so there is always a 'GP.EV.op', for
    instance.
*/
requirejs.config(GP.requireConfig);

require(['Config', 'jquery'], function(Config, $) {
    GP.Config = Config;
    GP.Ready = false;

    require(['Comm', 'Graphics', 'Coordinates', 'Controls'],
                function(pComm, pDisplay, pCoord, pControls) {

        var container = document.getElementById(Config.page.webGLcontainerId);
        var canvas = document.getElementById(Config.page.webGLcanvasId);
        pDisplay.Init(container, canvas);
        pControls.Init();

        pDisplay.Start();
        pComm.Start();
        GP.Ready = true;
    });
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
