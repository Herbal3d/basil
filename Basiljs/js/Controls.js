// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

// holds the controls context for this threejs instance
var CO = CO || {};

// ('controls' does not reference ThreeJS. All graphics go through the graphics routine.)
define(['Config', 'Graphics', 'jquery', 'UIControls', 'Eventing'],
                    function(Config, Graphics, $, UIControls, Eventing) {

    // ======================================================
    var op = {
        'Init': function() {
            $('.clickable').click(op.internalOnClickable);

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
        'internalOnClickable': function(evnt) {
            var buttonOp = $(evnt.target).attr('op');
            if (buttonOp == 'loadGltf') {
                var url = $('#SelectGltf').val();
                DebugLog('Controls: OnLoadButton: loading ' + url);
                op.internalDoLoad(url);
            }
            if (buttonOp == 'addTest') {
                DebugLog('Controls: OnAddTestObject');
                Graphics.AddTestObject();
            }
            if (buttonOp == 'showDebug') {
                // Make the state to the opposite of what it is now
                op.ShowDebug(!$('#DEBUGG').is(':visible'));
            }
        },
        'internalDoLoad': function(url) {
            Graphics.ClearScene();
            Graphics.LoadGltf(url, function() {

                // DEBUG DEBUG -- initially point camera at one of the objects in the scene
                var aPlace;
                if (GP.GR.scene.children) {
                    aPlace = GP.GR.scene.children[0].position;  // for ThreeJS
                }
                else {
                    if (GP.GR.scene.meshes) {
                        aPlace = GP.GR.scene.meshes[0].position;    // for BabylonJS
                    }
                }
                if (aPlace != undefined) {
                    var cameraPlace = [aPlace.x + 40, aPlace.y + 40, aPlace.z + 40];
                    Graphics.SetCameraPosition(cameraPlace);
                    Graphics.PointCameraAt([aPlace.x, aPlace.y, aPlace.z]);
                    DebugLog('Control: placing camera at <' + cameraPlace + '> looking at <' + aPlace + '>');
                }
                // end DEBUG DEBUG
                Graphics.Start(); // ClearScene possibly shuts down rendering
            });
        },
        'noComma': 0
    };

    GP.CO = CO;         // added for debugging. Do not use for inter-package access

    CO.op = op;
    return op;
});
