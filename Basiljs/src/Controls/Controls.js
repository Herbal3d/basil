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

import GP from 'GP';
import Config from 'xConfig';
import { BItem, BItemType, BItemState } from 'xBItem';

import * as Eventing from 'xEventing';

// Classes that implement different types of UI controls
import * as UIControls from './UIControls.js';

export class Controls extends BItem {
  constructor() {
    GP.DebugLog('Controls: constructor');
    super('org.basil.b.controls', undefined, BItemType.CONTROLS);

    // Make all 'class=clickable' page items create events
    Array.from(document.getElementsByClassName('clickable')).forEach( nn => {
        nn.addEventListener('click', this._onClickable.bind(this));
        // nn.onClick = OnClickable;
    });

    // Whether debug output window is initially displayed can be set in the configuration file
    this.ShowDebug(Config.page.showDebug);

    // Update the camera position for debugging
    this.infoCameraCoord = new UIControls.UI_Coord('div[b-info=camPosition]');
    if (this.infoCameraCoord) {
      this.eventCameraInfo = new Eventing.subscribe('display.cameraInfo', function(camInfo) {
        if (camInfo && camInfo.position && this.infoCameraCoord) {
          this.infoCameraCoord.Update(camInfo.position);
        }
      }.bind(this));
    }

    // UPdate the renderer info
    this.infoFPS = new UIControls.UI_Text('div[b-info=infoFPS]');
    this.infoDrawCalls = new UIControls.UI_Text('div[b-info=infoDrawCalls]');
    this.infoVertices = new UIControls.UI_Text('div[b-info=infoVertices]');
    this.infoTriangles = new UIControls.UI_Text('div[b-info=infoTriangles]');
    // this.infoPoints = new UIControls.UI_Text('div[b-info=infoPoints]');
    this.infoTextureMem = new UIControls.UI_Text('div[b-info=infoTextureMem]');
    this.infoGeometryMem = new UIControls.UI_Text('div[b-info=infoGeometryMem]');
    if (this.infoDrawCalls) {
        this.eventDisplayInfo = new Eventing.subscribe('display.info', function(info) {
            if (info && info.render && this.infoDrawCalls) {
                this.infoFPS.Update(Math.round(info.render.fps));
                this.infoDrawCalls.Update(info.render.calls);
                this.infoVertices.Update(info.render.vertices);
                this.infoTriangles.Update(info.render.faces);
                // this.infoPoints.Update(info.render.points);
            }
            if (info && info.memory && this.infoTextureMem) {
                this.infoTextureMem.Update(info.memory.textures);
                this.infoGeometryMem.Update(info.memory.geometries);
            }
        }.bind(this));
    }
  };

  ControlsStart() {
  };

  // Call to set debug window to specified state. Pass state that is should be in
  ShowDebug(onOff) {
    if (onOff) {   // want it on
      // var showMS = Config.page.DebugShowMS ? Config.page.DebugShowMS : 800;
      document.getElementById('DEBUGG').style.visibility = 'visible';
    }
    else {
      // var hideMS = Config.page.DebugHideMS ? Config.page.DebugHideMS : 400;
      document.getElementById('DEBUGG').style.visibility = 'hidden';
    }
  };

  // Operation called on UI button click ('clickable').
  const OnClickableOps  = {
    /*
    'loadGltf': function() {
        var url = Config.assets.gltfURLBase + document.querySelector$('#SelectGltf').val();
        GP.DebugLog('Controls: OnLoadButton: loading ' + url);
        DoLoadMultiple([ [ url, [0,0,0] ] ]);
    },
    'loadAtropia': function() {
        GP.DebugLog('Controls: OnLoadAtropia');
        let atropiaValue = Config.Atropia;
        if (atropiaValue) {
            GP.DebugLog('Getting value for regions from HTML')
            let parsedInput = JSON.parse(atropiaValue);
            // Add the url base for GLTF files (since it changes with the GLTF version)
            atropiaRegions = parsedInput.map(oneRegionInfo => {
                return [ Config.assets.gltfURLBase + oneRegionInfo[0], oneRegionInfo[1] ];
            });
            DoLoadMultiple(atropiaRegions);
        }
      },
      */
      'addTestObject': function() {
        // DEBUG DEBUG
        GP.GR.AddTestObject();
      },
      'showDebug': function() {
        // Make the state to the opposite of what it is now
        ShowDebug(!(document.getElementById('DEBUGG').style.visibility !== 'hidden'));
      }
  };

  // Process the HTML element that has class 'clickable'
  // The attribute 'op' says what to do when the element is clicked.
  _onClickable(evnt) {
    // var buttonOp = document.querySelector(evnt.target).getAttribute('op');
    var buttonOp = evnt.target.getAttribute('op');
    if (this.OnClickableOps[buttonOp]) {
      this.OnClickableOps[buttonOp](evnt.target);
    }
  };

  /*
  function DoLoadMultiple(urlsAndLocations) {
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
          Graphics.GraphicsStart(); // ClearScene possibly shuts down rendering
      });
  };
  */
}
