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

define(['jquery'], function($) {
    var op = {
        'Init': function() {
            if ($('#ButtonLoad')) {
                $('#ButtonLoad').click(op.OnLoadButton);
            }
            if ($('#ButtonShowDebug')) {
                $('#ButtonShowDebug').click(op.OnShowDebugButton);
            }
            
        },
        'Start': function() {
        },
        'OnShowDebugButton': function() {
            DebugLog('Controls: OnShowDebugButton');
            var isOn = $('#DEBUGG').is(':visible');
            op.ShowDebug(!isOn);
        },
        'ShowDebug': function(onOff) {
            if (onOff) {
                var showMS = GP.config.page.DebugShowMS ? GP.config.page.DebugShowMS : 800;
                $('#DEBUGG').show(showMS);
            }
            else {
                var hideMS = GP.config.page.DebugHideMS ? GP.config.page.DebugHideMS : 400;
                $('#DEBUGG').hide(hideMS);
            }
        },
        'OnLoadButton': function() {
            DebugLog('Controls: OnLoadButton');
        },
        'DoLoad': function(url) {
            // clear out any existing stuff
            // TODO:
            // load the new thing
            // TODO:
        },
        'noComma': 0
    };

    return op;

});

