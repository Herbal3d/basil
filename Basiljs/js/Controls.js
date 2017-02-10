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

    var processEventCameraInfo = function(camInfo, topic) {
        if (camInfo && camInfo.position && CO.infoCameraCoord) {
            CO.infoCameraCoord.Update(camInfo.position);
        }
    };
    var processEventDisplayInfo = function(info, topic) {
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
    };

    // ======================================================
    var op = {
        'Init': function() {
            if ($('#ButtonLoad')) {
                $('#ButtonLoad').click(op.OnLoadButton);
            }

            // Whether debug output window is displayed can be set in the configuration file
            if (Config.page.showDebug) {
               op.ShowDebug(Config.page.showDebug);
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
            CO.infoCameraCoord = new UIControls.UI_Coord('div[b-info=camPosition]');
            CO.infoDrawCalls = new UIControls.UI_Text('div[b-info=infoDrawCalls]');
            CO.infoTextureMem = new UIControls.UI_Text('div[b-info=infoTextureMem]');
            CO.infoGeometryMem = new UIControls.UI_Text('div[b-info=infoGeometryMem]');
            CO.infoVertices = new UIControls.UI_Text('div[b-info=infoVertices]');
            CO.infoFaces = new UIControls.UI_Text('div[b-info=infoFaces]');
            // CO.infoPoints = new UIControls.UI_Text('div[b-info=infoPoints]');

            CO.eventCameraInfo = new Eventing.subscribe('display.cameraInfo', processEventCameraInfo);
            CO.eventDisplayInfo = new Eventing.subscribe('display.info', processEventDisplayInfo);
            
        },
        'Start': function() {
        },
        'OnShowDebugButton': function() {
            var isOn = $('#DEBUGG').is(':visible');
            op.ShowDebug(!isOn);
        },
        'ShowDebug': function(onOff) {
            if (onOff) {
                var showMS = Config.page.DebugShowMS ? Config.page.DebugShowMS : 800;
                $('#DEBUGG').show(showMS);
            }
            else {
                var hideMS = Config.page.DebugHideMS ? Config.page.DebugHideMS : 400;
                $('#DEBUGG').hide(hideMS);
            }
        },
        'OnLoadButton': function() {
            var url = $('#SelectGltf').val();
            DebugLog('Controls: OnLoadButton: loading ' + url);
            op.DoLoad(url);
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
        'OnAddTestObject': function() {
            DebugLog('Controls: OnAddTestObject');
            Display.AddTestObject();
        },
        'noComma': 0
    };

    GP.CO = CO;

    CO.op = op;
    return op;

});


