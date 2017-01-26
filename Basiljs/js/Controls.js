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

// holds the controls context for this threejs instance
var CO = CO || {};

// ('controls' does not reference ThreeJS. All graphics go through the graphics routine.)
define(['config', 'Graphics', 'jquery', 'UIControls', 'Eventing'], function(config, GR, $, UIControls, Eventing) {
    var op = {
        'Init': function() {
            if ($('#ButtonLoad')) {
                $('#ButtonLoad').click(op.OnLoadButton);
            }

            // Whether debug output window is displayed can be set in the configuration file
            if (config.page.showDebug) {
               op.ShowDebug(config.page.showDebug);
            }
            else {
               op.ShowDebug(false);
            }
            if ($('#ButtonShowDebug')) {
                $('#ButtonShowDebug').click(op.OnShowDebugButton);
            }

            if ($('#ButtonAddTestObject')) {
                $('#ButtonAddTestObject').click(op.OnAddTestObject);
            }
            CO.cameraCoord = new UIControls.UI_Coord('#CameraPosition');
            
        },
        'Start': function() {
        },
        // Called by graphics section for each frame
        'PerFrameUpdate': function() {
            if (CO.cntlCameraPosition) {
                var camPos = GR.GetCameraPosition();
                if (CO.lastCameraPosition) {
                    if (camPos != CO.lastCameraPosition) {
                        CO.cntlCameraPosition.Update(camPos);
                    }
                }
                CO.lastCameraPosition = camPos;
            }
        },
        'OnShowDebugButton': function() {
            var isOn = $('#DEBUGG').is(':visible');
            op.ShowDebug(!isOn);
        },
        'ShowDebug': function(onOff) {
            if (onOff) {
                var showMS = config.page.DebugShowMS ? config.page.DebugShowMS : 800;
                $('#DEBUGG').show(showMS);
            }
            else {
                var hideMS = config.page.DebugHideMS ? config.page.DebugHideMS : 400;
                $('#DEBUGG').hide(hideMS);
            }
        },
        'OnLoadButton': function() {
            var url = $('#SelectGltf').val();
            DebugLog('Controls: OnLoadButton: loading ' + url);
            op.DoLoad(url);
        },
        'DoLoad': function(url) {
            GR.ClearScene();
            GR.LoadGltf(url, function() {

                // DEBUG DEBUG -- initially point camera at one of the objects in the scene
                var aPlace = GP.GR.scene.children[0].position;
                var cameraPlace = new THREE.Vector3( aPlace.x + 40, aPlace.y + 40, aPlace.z + 40);
                // cameraPlace = cameraPlace.add(new THREE.Vector3(100,100,100));
                GR.SetCameraPosition(cameraPlace);
                CO.cameraCoord.Update(cameraPlace);
                GR.PointCameraAt(aPlace);
                DebugLog('Control: placing camera at <' + cameraPlace.toArray() + '> looking at <' + aPlace.toArray() + '>');

                GR.Start(); // ClearScene possibly shuts down rendering
            });
        },
        'OnAddTestObject': function() {
            DebugLog('Controls: OnAddTestObject');
            GR.AddTestObject();
        },
        'noComma': 0
    };

    // ======================================================

    CO.op = op;
    return op;

});


