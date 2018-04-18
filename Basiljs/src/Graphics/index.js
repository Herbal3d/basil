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

import GP from 'GP';
import Config from 'xConfig';
import * as Eventing from 'xEventing';

import { OrbitControls } from 'xThreeJSOrbit';
import { GLTFLoader } from 'xThreeJSGLTF';

var GR = GR || {};
GP.GR = GR; // for debugging. Don't use for cross package access.

// return a ThreeJS color number from an array of color values
var colorFromArray = function(colorArr) {
    return new THREE.Color(colorArr[0], colorArr[1], colorArr[2]);
    /*
    return colorArr[0] * 255 * 65536
        + colorArr[1] * 255 * 256
        + colorArr[2] * 255;
        */
}

// For unknow reasons, ThreeJS doesn't have a canned way of disposing a scene
// From https://stackoverflow.com/questions/33152132/three-js-collada-whats-the-proper-way-to-dispose-and-release-memory-garbag/33199591#33199591
export function disposeNode (node) {
    if (node instanceof THREE.Mesh) {
        if (node.geometry) {
            node.geometry.dispose ();
        }
        if (node.material) {
            if (node.material instanceof THREE.MeshFaceMaterial) {
                for (let mtrl in node.material.materials) {
                    if (mtrl.map)           mtrl.map.dispose ();
                    if (mtrl.lightMap)      mtrl.lightMap.dispose ();
                    if (mtrl.bumpMap)       mtrl.bumpMap.dispose ();
                    if (mtrl.normalMap)     mtrl.normalMap.dispose ();
                    if (mtrl.specularMap)   mtrl.specularMap.dispose ();
                    if (mtrl.envMap)        mtrl.envMap.dispose ();
                    mtrl.dispose ();    // disposes any programs associated with the material
                }
            }
            else {
                if (node.material.map)          node.material.map.dispose ();
                if (node.material.lightMap)     node.material.lightMap.dispose ();
                if (node.material.bumpMap)      node.material.bumpMap.dispose ();
                if (node.material.normalMap)    node.material.normalMap.dispose ();
                if (node.material.specularMap)  node.material.specularMap.dispose ();
                if (node.material.envMap)       node.material.envMap.dispose ();
                node.material.dispose ();   // disposes any programs associated with the material
            }
        }
    }
}   // disposeNode

// disposeHierarchy (YOUR_OBJECT3D, disposeNode);
export function disposeHierarchy (node) {
    for (var i = node.children.length - 1; i >= 0; i--) {
        var child = node.children[i];
        disposeHierarchy(child);
        disposeNode(child);
    }
    disposeNode(node);
}

export function disposeScene(scene) {
  for (var ii = scene.children.length - 1; ii >= 0; ii--) {
      disposeHierarchy(scene.children[ii], node => { scene.remove(node)});
  }
}

export function GraphicsInit(container, canvas) {
  GR.container = container;
  GR.canvas = canvas;

  GR.scene = new THREE.Scene();

  InitializeCamera(GR.scene, canvas);
  InitializeLights(GR.scene);

  let parms = {};
  if (Config.webgl && Config.webgl.renderer) {
    parms = Config.webgl.renderer;
  }
  let rendererParams = {};
  if (parms.ThreeJS) {
    Object.assign(renderParms, parms.ThreeJS);
  }
  rendererParams.canvas = canvas;
  GR.renderer = new THREE.WebGLRenderer(parms);
  if (parms.clearColor) {
      GR.renderer.setClearColor(colorFromArray(Config.webgl.renderer.clearColor));
  }
  GR.renderer.setSize( canvas.clientWidth, canvas.clientHeight );

  if (parms.shadows) {
      GR.renderer.shadowMap.enabled = true;
      GR.renderer.shadowMap.type = THREE.PCFShoftShadowMap;
  }

  // resizing causes recomputations
  container.addEventListener('resize', OnContainerResize, false);

  // For the moment, camera control comes from the user
  InitializeCameraControl(GR.scene, GR.container);

  // Graphics generate a bunch of events so people can display stuff
  GenerateCameraEvents();
  GenerateRendererStatEvents();
}

export function GraphicsStart() {
}

function InitializeCamera(theScene, canvas, passedParms) {
  if (GR.camera) {
    return;
  }

  let parms = {};
  if (Config.webgl && Config.webgl.camera) {
    parms = Config.webgl.camera;
  }
  if (passedParms) {
    Object.assign(parms, passedParms);  // merge
  }
  let requiredParameters = new Map( [
        [ 'name', 'cameraX' ],
        [ 'initialViewDistance', 1000 ],
        [ 'initialCameraPosition', [200, 50, 200] ],
        [ 'initialCameraLookAt', [ 0, 0, 0] ],
        [ 'addCameraHelper', false ],
        [ 'addAxesHelper', false ]
  ]);
  requiredParameters.forEach( (val, parm) => {
    if (typeof(parms[parm]) == 'undefined') {
      parms[parm] = val;
    }
  });

  GR.camera = new THREE.PerspectiveCamera( 75, canvas.clientWidth / canvas.clientHeight, 1, parms.initialViewDistance );
  GR[parms.name] = GR.camera;
  // GR.camera.up = new THREE.Vector3(0, 1, 0);
  GR.camera.position.fromArray(parms.initialCameraPosition);
  var lookAt = new THREE.Vector3;
  lookAt.fromArray(parms.initialCameraLookAt);
  GR.camera.lookAt(lookAt);
  if (parms.addCameraHelper) {
      GR.cameraHelper = new THREE.CameraHelper(GR.camera);
      theScene.add(GR.cameraHelper);
  }
  if (parms.addAxesHelper) {
      let helperSize = parms.axesHelperSize || 5;
      GR.axesHelper = new THREE.AxesHelper(Number(helperSize));
      theScene.add(GR.axesHelper);
  }
  theScene.add(GR.camera);
}

function InitializeLights(theScene, passedParms) {
  let parms = {};
  if (Config.webgl && Config.webgl.lights) {
    parms = Config.webgl.lights;
  }
  if (passedParms) {
    Object.assign(parms, passedParms);  // merge
  }

  if (parms.ambient) {
      var ambient = new THREE.AmbientLight(colorFromArray(parms.ambient.color),
                                          Number(parms.ambient.intensity));
      GR.ambientLight = ambient;
      theScene.add(ambient);
  }
  if (parms.directional) {
      var directional = new THREE.DirectionalLight(colorFromArray(parms.directional.color),
                                          Number(parms.directional.intensity));
      directional.position.fromArray(parms.directional.direction).normalize();
      GR.directionalLight = directional;
      if (parms.directional.shadows) {
          directional.castShadow = true;
          directional.shadow.bias = parms.directional.shadows.bias;
          directional.shadow.mapSize.width = parms.directional.shadows.mapWidth;
          directional.shadow.mapSize.height = parms.directional.shadows.mapHeight;
      }
      theScene.add(directional);
  }
}
