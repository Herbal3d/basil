/**
 * Copyright (c) 2017, Robert Adams
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in
 * the documentation and/or other materials provided with the distribution.
 * 
 * 3. Neither the name of the copyright holder nor the names of its
 * contributors may be used to endorse or promote products derived
 * from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// Global parameters and variables. "GP.variable"
var GP = GP || {};

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
requirejs.config({
    'baseUrl': "",
    'paths': {
        'config': 'config',
        'jquery': 'jslibs/jquery-3.1.0.min',

        // see https://github.com/mrdoob/three.js/issues/9602 about this wrapper thing
        'threejs': 'jslibs/threejs-wrapper',
        'real-threejs': 'jslibs/three-dev-20170207.min',
        'orbitControl': 'jslibs/OrbitControls',
        'stats': 'jslibs/stats.min',
        'GLTFLoader': 'jslibs/GLTFLoader',

        'Comm': 'js/Comm',
        'Graphics': 'js/Graphics',
        'Coordinates': 'js/Coordinates',
        'Controls': 'js/Controls',
        'UIControls': 'js/UIControls',
        'Eventing': 'js/Eventing'

    },
    'shim': {
        'threejs': {
            'exports': 'THREE'
        },
        'orbitControl': {
            'deps': ['threejs']
        },
        'stats': {
            'deps': ['threejs']
        },
        'GLTFLoader': {
            'deps': ['threejs']
        }
    }
});

require(['config', 'jquery', 'threejs'], function(Config, $, THREE) {
    GP.Config = Config;
    GP.Ready = false;

    require(['Comm', 'Graphics', 'Coordinates', 'Controls'],
                function(pComm, pDisplay, pCoord, pControls, pEventing, pUIControls) {

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

