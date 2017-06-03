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
            CO.infoFPS = new UIControls.UI_Text('div[b-info=infoFPS]');
            CO.infoDrawCalls = new UIControls.UI_Text('div[b-info=infoDrawCalls]');
            CO.infoVertices = new UIControls.UI_Text('div[b-info=infoVertices]');
            CO.infoTriangles = new UIControls.UI_Text('div[b-info=infoTriangles]');
            // CO.infoPoints = new UIControls.UI_Text('div[b-info=infoPoints]');
            CO.infoTextureMem = new UIControls.UI_Text('div[b-info=infoTextureMem]');
            CO.infoGeometryMem = new UIControls.UI_Text('div[b-info=infoGeometryMem]');
            CO.eventDisplayInfo = new Eventing.subscribe('display.info', function(info, topic) {
                if (info && info.render && CO.infoDrawCalls) {
                    CO.infoFPS.Update(Math.round(info.render.fps));
                    CO.infoDrawCalls.Update(info.render.calls);
                    CO.infoVertices.Update(info.render.vertices);
                    CO.infoTriangles.Update(info.render.faces);
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
                op.internalDoLoadMultiple([ [ url, [0,0,0] ] ]);
            }
            if (buttonOp == 'loadAtropia') {
                DebugLog('Controls: OnLoadAtropia');
                var atropiaRegions = [
                    [ "./gltf/testtest00.gltf", [0,0,512] ],
                    [ "./gltf/testtest01.gltf", [0,0,256] ],
                    [ "./gltf/testtest02.gltf", [0,0,0] ],
                    [ "./gltf/testtest10.gltf", [256,0,512] ],
                    // [ "./gltf/testtest11.gltf", [256,0,256] ],
                    [ "./gltf/testtest12.gltf", [256,0,0] ],
                    [ "./gltf/testtest20.gltf", [512,0,512] ],
                    [ "./gltf/testtest21.gltf", [512,0,256] ],
                    [ "./gltf/testtest22.gltf", [512,0,0] ]
                ];
                op.internalDoLoadMultiple(atropiaRegions);
            }
            if (buttonOp == 'addTest') {
                DebugLog('Controls: OnAddTestObject');
                Graphics.AddTestObject();
            }
            if (buttonOp == 'showDebug') {
                // Make the state to the opposite of what it is now
                op.ShowDebug(!$('#DEBUGG').is(':visible'));
            }
            if (buttonOp == 'showDebugLayer') {
                Graphics.SetDebugMode();
            }
        },
        'internalDoLoadMultiple': function(urlsAndLocations) {
            Graphics.ClearScene();
            Graphics.LoadSceneMultiple(urlsAndLocations, function() {

                // DEBUG DEBUG -- initially point camera at one of the objects in the scene
                var aPlace;
                if (GP.GR.scene.children) {
                    // ThreeJS
                    // If loading multiple scenes, the top level is a group
                    var anObject;
                    let group = GP.GR.scene.children.find(xx => { return xx.type == 'Group'});
                    if (group) {
                        anObject = group.children.find(xx => { return xx.type == 'Object3D'});
                    }
                    else {
                        // there must not be a gropu
                        anObject = GP.GR.scene.children.find(xx => { return xx.type == 'Object3D'});
                    }
                    if (anObject) {
                        let pos = anObject.position;
                        aPlace = [pos.x, pos.y, pos.z];
                    }
                }
                else {
                    if (GP.GR.scene.meshes) {
                        // for BabylonJS
                        let ppos = GP.GR.scene.meshes[0].position;
                        aPlace = [ ppos.x, ppos.y, ppos.z ];
                    }
                }
                // The position is passed as an array because not using some libary's Vector3
                if (aPlace != undefined) {
                    var cameraPlace = [aPlace[0] + 40, aPlace[1] + 40, aPlace[2] + 40];
                    Graphics.SetCameraPosition(cameraPlace);
                    Graphics.PointCameraAt([aPlace[0], aPlace[1], aPlace[2]]);
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
