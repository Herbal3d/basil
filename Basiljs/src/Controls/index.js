// Copyright 2018 Robert Adams
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// holds the controls context for this threejs instance
var CO = CO || {};

import Config from 'xConfig';
import * as $ from 'jquery';
import * as Graphics from 'xGraphics';
import * as Eventing from 'xEventing';
// Classes that implement different types of UI controls
import * as UIControls from './UIControls.js';

export function Init() {
    // Make all 'class=clickable' page items create events
    $('.clickable').click(internalOnClickable);

    // Whether debug output window is initially displayed can be set in the configuration file
    ShowDebug(Config.page.showDebug);

    // Update the camera position for debugging
    CO.infoCameraCoord = new UIControls.UI_Coord('div[b-info=camPosition]');
    if (CO.infoCameraCoord) {
        CO.eventCameraInfo = new Eventing.subscribe('display.cameraInfo', function(camInfo) {
            if (camInfo && camInfo.position && CO.infoCameraCoord) {
                CO.infoCameraCoord.Update(camInfo.position);
            }
        });
    }

    // UPdate the renderer info
    CO.infoFPS = new UIControls.UI_Text('div[b-info=infoFPS]');
    CO.infoDrawCalls = new UIControls.UI_Text('div[b-info=infoDrawCalls]');
    CO.infoVertices = new UIControls.UI_Text('div[b-info=infoVertices]');
    CO.infoTriangles = new UIControls.UI_Text('div[b-info=infoTriangles]');
    // CO.infoPoints = new UIControls.UI_Text('div[b-info=infoPoints]');
    CO.infoTextureMem = new UIControls.UI_Text('div[b-info=infoTextureMem]');
    CO.infoGeometryMem = new UIControls.UI_Text('div[b-info=infoGeometryMem]');
    if (CO.infoDrawCalls) {
        CO.eventDisplayInfo = new Eventing.subscribe('display.info', function(info) {
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
    }
};

export function Start() {
};

// Call to set debug window to specified state. Pass state that is should be in
export function ShowDebug(onOff) {
    if (onOff) {   // want it on
        var showMS = Config.page.DebugShowMS ? Config.page.DebugShowMS : 800;
        $('#DEBUGG').show(showMS);
    }
    else {
        var hideMS = Config.page.DebugHideMS ? Config.page.DebugHideMS : 400;
        $('#DEBUGG').hide(hideMS);
    }
};

// Operation called on UI button click ('clickable').
function internalOnClickable(evnt) {
    var buttonOp = $(evnt.target).attr('op');
    if (buttonOp == 'loadGltf') {
        var url = Config.assets.gltfURLBase + $('#SelectGltf').val();
        GP.DebugLog('Controls: OnLoadButton: loading ' + url);
        internalDoLoadMultiple([ [ url, [0,0,0] ] ]);
    }
    if (buttonOp == 'loadAtropia') {
        GP.DebugLog('Controls: OnLoadAtropia');
        var atropiaRegions = [
            [ "testtest00.gltf", [0,0,512] ],
            [ "testtest01.gltf", [0,0,256] ],
            [ "testtest02.gltf", [0,0,0] ],
            [ "testtest10.gltf", [256,0,512] ],
            // [ "testtest11.gltf", [256,0,256] ],
            [ "testtest12.gltf", [256,0,0] ],
            [ "testtest20.gltf", [512,0,512] ],
            [ "testtest21.gltf", [512,0,256] ],
            [ "testtest22.gltf", [512,0,0] ]
        ];
        var valueFromHTML = $(evnt.target).attr('value');
        if (valueFromHTML) {
            GP.DebugLog('Getting value for regions from HTML')
            let parsedInput = JSON.parse(valueFromHTML);
            // Add the url base for GLTF files (since it changes with the GLTF version)
            atropiaRegions = parsedInput.map(oneRegionInfo => {
                return [ Config.assets.gltfURLBase + oneRegionInfo[0], oneRegionInfo[1] ];
            });
        }
        internalDoLoadMultiple(atropiaRegions);
    }
    if (buttonOp == 'addTest') {
        GP.DebugLog('Controls: OnAddTestObject');
        Graphics.AddTestObject();
    }
    if (buttonOp == 'showDebug') {
        // Make the state to the opposite of what it is now
        ShowDebug(!$('#DEBUGG').is(':visible'));
    }
    if (buttonOp == 'showDebugLayer') {
        Graphics.SetDebugMode();
    }
};

function internalDoLoadMultiple(urlsAndLocations) {
    Graphics.ClearScene();
    Graphics.LoadSceneMultiple(urlsAndLocations, function() {

        // DEBUG DEBUG -- initially point camera at one of the objects in the scene
        var aPlace;
        if (GP.GR.scene.children) {
            // ThreeJS
            // Walk down the tree until we find something not at <9,9<
            var anObject = GP.GR.scene.children[0];
            while (anObject && anObject.position.x == 0 && anObject.position.y == 0) {
                let nextObj = anObject.children.find(xx => { return xx.type == 'Group'});
                if (nextObj == undefined) {
                    nextObj = anObject.children.find(xx => { return xx.type == 'Object3D'});
                }
                anObject = nextObj;
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
};

GP.CO = CO;         // added for debugging. Do not use for inter-package access
