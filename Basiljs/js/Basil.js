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

requirejs.config({
    "baseUrl": "",
    "paths": {
        "config": "config",
        "jquery": "jslibs/jquery-3.1.0.min",
        "threejs": "jslibs/three-dev-20170106",
        "BasilComm": "js/BasilComm",
        "BasilGraphics": "js/BasilGraphics",
        "BasilCoordinates": "js/BasilCoordinates"
    },
    "shim": {
        
    }
});

require(['config', 'jquery', 'threejs', 'BasilComm', 'BasilGraphics', 'BasilCoordinates'],
    function(config, $, THREE, bComm, bDisplay, bCoord) {
        GP.config = config;
        GP.Ready = false;

        GP.comm = bComm;
        GP.display = bDisplay;
        GP.coord = bCoord;

        var container = document.getElementById(GP.config.page.webGLcontainerId);
        var canvas = document.getElementById(GP.config.page.webGLcanvasId);
        bDisplay.Init(container, canvas);
        bDisplay.Start();
        bComm.Start();
    }
);

// Adds a text line to a div and scroll the area
var DebugLogLines = 20;
function DebugLog(msg) {
    if ($('#DEBUGG')) {
        $('#DEBUGG').append('<div>' + msg + '</div>');
        if ($('#DEBUGG').children().length > DebugLogLines) {
            $('#DEBUGG').children('div:first').remove();
            
        }
    }
};
