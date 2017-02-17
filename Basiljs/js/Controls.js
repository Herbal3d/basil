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
define(['config', 'Graphics', 'jquery', 'UIControls', 'Eventing'],
                    function(Config, Display, $, UIControls, Eventing) {

    // ======================================================
    var op = {
        'Init': function() {
            $('.clickable').click(op.OnClickable);

            // Whether debug output window is initially displayed can be set in the configuration file
           op.ShowDebug(Config.page.showDebug);

            // Update the camera position for debugging
            CO.infoCameraCoord = new UIControls.UI_Coord('div[b-info=camPosition]');
            CO.eventCameraInfo = new Eventing.subscribe('display.cameraInfo', function(camInfo, topic) {
                if (camInfo && camInfo.position && CO.infoCameraCoord) {
                    CO.infoCameraCoord.Update(camInfo.position);
                }
            });

            // UPdate the renderer info
            CO.infoDrawCalls = new UIControls.UI_Text('div[b-info=infoDrawCalls]');
            CO.infoVertices = new UIControls.UI_Text('div[b-info=infoVertices]');
            CO.infoFaces = new UIControls.UI_Text('div[b-info=infoFaces]');
            // CO.infoPoints = new UIControls.UI_Text('div[b-info=infoPoints]');
            CO.infoTextureMem = new UIControls.UI_Text('div[b-info=infoTextureMem]');
            CO.infoGeometryMem = new UIControls.UI_Text('div[b-info=infoGeometryMem]');
            CO.eventDisplayInfo = new Eventing.subscribe('display.info', function(info, topic) {
                if (info && info.render && CO.infoDrawCalls) {
                    CO.infoDrawCalls.Update(info.render.calls);
                    CO.infoVertices.Update(info.render.vertices);
                    CO.infoFaces.Update(info.render.faces);
                    // CO.infoPoints.Update(info.render.points);
                }
                if (info && info.memory && CO.infoTextureMem) {
                    CO.infoTextureMem.Update(info.memory.textures);
                    CO.infoGeometryMem.Update(info.memory.geometries);
                }
            });
        },
        'Start': function() {
        },
        'OnShowDebugButton': function() {
            var isOn = $('#DEBUGG').is(':visible');
            op.ShowDebug(!isOn);
        },
        // Call to set debug window to specified state. Pass state that is should be in
        'ShowDebug': function(onOff) {
            if (onOff) {   // want it on
                var showMS = Config.page.DebugShowMS ? Config.page.DebugShowMS : 800;
                $('#DEBUGG').show(showMS);
            }
            else {
                var hideMS = Config.page.DebugHideMS ? Config.page.DebugHideMS : 400;
                $('#DEBUGG').hide(hideMS);
            }
        },
        // Operation called on UI button click ('clickable').
        'OnClickable': function(evnt) {
            var buttonOp = $(evnt.target).attr('op');
            if (buttonOp == 'loadGltf') {
                var url = $('#SelectGltf').val();
                DebugLog('Controls: OnLoadButton: loading ' + url);
                op.DoLoad(url);
            }
            if (buttonOp == 'addTest') {
                DebugLog('Controls: OnAddTestObject');
                Display.AddTestObject();
            }
            if (buttonOp == 'showDebug') {
                // Make the state to the opposite of what it is now
                op.ShowDebug(!$('#DEBUGG').is(':visible'));
            }
        },
        'DoLoad': function(url) {
            Display.ClearScene();
            Display.LoadGltf(url, function() {

                // DEBUG DEBUG -- initially point camera at one of the objects in the scene
                var aPlace = GP.GR.scene.children[0].position;
                var cameraPlace = new THREE.Vector3( aPlace.x + 40, aPlace.y + 40, aPlace.z + 40);
                // cameraPlace = cameraPlace.add(new THREE.Vector3(100,100,100));
                Display.SetCameraPosition(cameraPlace);
                Display.PointCameraAt(aPlace);
                DebugLog('Control: placing camera at <' + cameraPlace.toArray() + '> looking at <' + aPlace.toArray() + '>');
                // end DEBUG DEBUG
                Display.Start(); // ClearScene possibly shuts down rendering
            });
        },
        'noComma': 0
    };

    GP.CO = CO;

    CO.op = op;
    return op;

});
