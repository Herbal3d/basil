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
import { CombineParameters } from 'xUtilities';

import { OrbitControls } from 'xThreeJSOrbit';
import { GLTFLoader } from 'xThreeJSGLTF';
import { ColladaLoader } from 'xThreeJSCollada';
import { DRACOLoader } from 'xThreeJSDRACO';
import { FBXLoader } from 'xThreeJSFBX';
import { OBJLoader } from 'xThreeJSOBJ';
import { BVHLoader } from 'xThreeJSBVH';

var GR = GR || {};
GP.GR = GR; // for debugging. Don't use for cross package access.

// return a ThreeJS color number from an array of color values
var ColorFromValue = function(colorValue) {
    if (Array.isArray(colorValue)) {
        return new THREE.Color(colorValue[0], colorValue[1], colorValue[2]);
    }
    return new THREE.Color(colorValue);
}

// For unknow reasons, ThreeJS doesn't have a canned way of disposing a scene
// From https://stackoverflow.com/questions/33152132/three-js-collada-whats-the-proper-way-to-dispose-and-release-memory-garbag/33199591#33199591
function disposeNode (node) {
    if (node instanceof THREE.Mesh) {
        if (node.geometry) {
            node.geometry.dispose ();
        }
        if (node.material) {
            let matTypes = [ 'map', 'lightMap', 'bumpMap', 'normalMap', 'specularMap', 'envMap' ];
            if (node.material.materials) {
              node.material.materials.forEach( mtrl => {
                matTypes.forEach( matType => {
                  if (mtrl[matType]) mtrl[matType].dispose();
                } );
                mtrl.dispose();
              } );
            }
            else {
                matTypes.forEach( matType => {
                  if (node.material[matType]) node.material[matType].dispose();
                });
                node.material.dispose();
            }
        }
        if (node.texture) {
          node.texture.dispose();
        }
    }
}   // disposeNode

// disposeHierarchy (YOUR_OBJECT3D, disposeNode);
function disposeHierarchy (node) {
    for (var i = node.children.length - 1; i >= 0; i--) {
        var child = node.children[i];
        disposeHierarchy(child);
        disposeNode(child);
    }
    disposeNode(node);
}

function disposeScene(scene) {
  for (var ii = scene.children.length - 1; ii >= 0; ii--) {
      disposeHierarchy(scene.children[ii], node => { scene.remove(node)});
  }
}

export function GraphicsInit(container, canvas) {
  GP.DebugLog('Graphics: GraphicsInit');
  GR.container = container;
  GR.canvas = canvas;

  GR.scene = new THREE.Scene();

  InitializeCamera(GR.scene, canvas);
  InitializeLights(GR.scene);
  InitializeEnvironment(GR.scene);

  let parms = {}; // parameters specific to setting up WebGL in the renderer
  if (Config.webgl && Config.webgl.renderer) {
    parms = Config.webgl.renderer;
  }

  let rendererParams = {};  // parameters to pass to the THREE.renderer creation
  if (parms.ThreeJS) {
    rendererParams = parms.ThreeJS;
  }
  rendererParams.canvas = canvas;
  GR.renderer = new THREE.WebGLRenderer(rendererParams);

  if (parms.clearColor) {
      GR.renderer.setClearColor(ColorFromValue(parms.clearColor));
  }

  if (parms.shadows) {
      GR.renderer.shadowMap.enabled = true;
      GR.renderer.shadowMap.type = THREE.PCFShoftShadowMap;
  }

  // keep the camera and environment adjusted for the display size
  OnContainerResize();  // initial aspect ration computation
  container.addEventListener('resize', OnContainerResize, false);

  // For the moment, camera control comes from the user
  InitializeCameraControl(GR.scene, GR.container);

  // Clock used to keep track of frame time and FPS
  GR.clock = new THREE.Clock();

  // There are several top level groups for objects in different coordinate systems
  GR.GroupWorldRel = new THREE.Group();
  GR.GroupWorldRel.name = 'org.basil.b.GroupWorldRel';
  GR.GroupCameraRel = new THREE.Group();
  GR.GroupCameraRel.name = 'org.basil.b.GroupCameraRel';
  GR.scene.add(GR.GroupWorldRel);
  GR.scene.add(GR.GroupCameraRel);

  // Graphics generate a bunch of events so people can display stuff
  GenerateCameraEvents();
  GenerateRendererStatEvents();
};

export function GraphicsStart() {
  StartRendering();
};

export function StartRendering() {
  if (GR.renderer) {
    GR.renderer.animate(DoRendering);
  }
};

export function StopRendering() {
  if (GR.renderer) {
    GR.renderer.stopAnimation();
  }
};

// Do per-frame updates and then render the frame
function DoRendering() {
    if (GP.Ready && GR.scene && GR.camera) {
        // compute fps
        GR.lastFrameDelta = GR.clock.getDelta();
        GR.fps = 1 / GR.lastFrameDelta;

        if (GR.cameraControl) {
            GR.cameraControl.update();
        }
        if (GR.eventEachFrame) {
            Eventing.fire(GR.eventEachFrame, {});
        }
        DoAnimation();
        GR.renderer.render(GR.scene, GR.camera);
    }
};

function DoAnimation() {
  // look into https://github.com/tweenjs/tween.js
};

// Adjust the camera and environment when display size changes
function OnContainerResize() {
  GR.renderer.setSize(GR.canvas.clientWidth, GR.canvas.clientHeight);
  GR.camera.aspect = GR.canvas.clientWidth / GR.canvas.clientHeight;
  GR.camera.updateProjectionMatrix();
  GR.renderer.setPixelRatio(window.devicePixelRatio);
};

// Access function for the renderer itself
export function THREErenderer() {
  return GR.renderer;
}

// Access function for the camera.
export function THREEcamera() {
  return GR.camera;
}

// Remove everything from the scene
export function ClearScene() {
  StopRendering();

  disposeScene();
  GP.DebugLog('Graphics: cleared scene');

  StartRendering();
}

// Add this new node to the world coordinate system
export function AddNodeToWorld(node) {
  GR.GroupWorldRel.add(node);
}

export function RemoveNodeFromWorld(node) {
  GR.GroupWorldRel.remove(node);
}

// Add this node to the camera relative coordinate system
export function AddNodeToCamera(node) {
  GR.GroupCameraRel.add(node);
}

export function RemoveNodeFromCamera(node) {
  GP.GroupCameraRel.remove(node);
}

// Load an asset.
// TODO: some formats have animations, cameras, ... What to do with those?
// Passed parameters:
// parms.auth authorization info
// parms.url: URL to asset
// parms.type = GLTF, Collada, OBJ, FBX
// returns a promise of a handle to the ThreeJS node that is created
export function LoadSimpleAsset(userAuth, parms, progressCallback) {
  GP.DebugLog('Graphics.LoadSimpleAsset: call parms: ' + JSON.stringify(parms));
  return new Promise(function(resolve, reject) {
    let loader = undefined;
    switch (parms.loaderType.toLowerCase()) {
      case 'gltf':    loader = new THREE.GLTFLoader; break;
      case 'collada': loader = new THREE.ColladaLoader; break;
      case 'draco':   loader = new THREE.DRACOLoader; break;
      case 'fbx':     loader = new THREE.FBXLoader; break;
      case 'obj':     loader = new THREE.OBJLoader; break;
      case 'bvh':     loader = new THREE.BVHLoader; break;
    }
    if (loader) {
        GP.DebugLog('Graphics.LoadSimpleAsset: loading from: ' + parms.url);
        // To complicate things, ThreeJS loaders return different things
        loader.load(parms.url, function(loaded) {
          // Successful load
          if (loaded.scene) {     // GLTF scene
              resolve(loaded.scene.children);
          }
          else if (loaded.scenes) {   // GLTF multiple scenes
              resolve(loaded.scenes[0].children);
          }
          let err = 'Graphics.LoadSimpleAsset: Could not understancd loaded contents.'
              + ' type=' + parms.loaderType
              + ', url=' + parms.url;
          reject(err);
        },
        function(xhr) {
          // loading progress
          if (typeof(progressCallback) !== 'undefined') {
            progressCallback(xhr);
          }
        },
        function(e) {
            // Failed load
            reject(e);
        });
    }
    else {
        reject('No loader for type ' + parms.loaderType);
    }
  });
}

// Function to move the camera from where it is to a new place.
// This is movement from external source which could conflict with AR
//     and VR camera control.
export function SetCameraPosition(gPos) {
  // TODO: conversion of gPos to lPos
  if (Array.isArray(gPos)) {
      // newPos = new THREE.Vector3().fromArray(pos);
      GR.camera.position.fromArray(gPos);
  }
  else {
      // newPos = pos;
      GR.camera.position.set(gPos);
      // GR.camera.position = newPos;
  }
  GP.DebugLog('Graphics: camera position: ['
    + GR.camera.position.x
    + ', '
    + GR.camera.position.y
    + ', '
    + GR.camera.position.z
    + ']'
  );
}

// Pass position as either THREE.Vector3 or array of three numbers
export function PointCameraAt(gPos) {
  // TODO: conversion of gPos to lPos
  let look = new THREE.Vector3;
  if (Array.isArray(gPos)) {
    look.fromArray(gPos);
  }
  else {
    look = gPos;
  }

  if (GR.cameraControl) {
      GR.cameraControl.target = look;
      GR.cameraControl.update();
  }
  else {
      GR.camera.lookAt(look);
  }
  // Move axes helper to where the camera is looking
  if (GR.axesHelper) {
      GR.axesHelper.geometry.translate(look.x, look.y, look.z);
  }

  GP.DebugLog('Graphics: camera looking at: ['
    + look.x
    + ', '
    + look.y
    + ', '
    + look.z
    + ']'
  );
}

function InitializeCamera(theScene, canvas, passedParms) {
  if (GR.camera) {
    return;
  }

  let parms = CombineParameters(Config.webgl.camera, passedParms, {
        'name': 'cameraX',
        'initialViewDistance': 1000,
        'initialCameraPosition': [200, 50, 200],
        'initialCameraLookAt': [ 0, 0, 0],
        'addCameraHelper': false,
        'addAxesHelper': false
  });

  GR.camera = new THREE.PerspectiveCamera( 75, canvas.clientWidth / canvas.clientHeight,
                    1, parms.initialViewDistance );
  // GR.camera.up = new THREE.Vector3(0, 1, 0);
  theScene.add(GR.camera);

  SetCameraPosition(parms.initialCameraPosition);
  PointCameraAt(parms.initialCameraLookAt);

  if (parms.addCameraHelper) {
      GR.cameraHelper = new THREE.CameraHelper(GR.camera);
      theScene.add(GR.cameraHelper);
  }
  if (parms.addAxesHelper) {
      let helperSize = parms.axesHelperSize || 5;
      GR.axesHelper = new THREE.AxesHelper(Number(helperSize));
      theScene.add(GR.axesHelper);
  }
}

function InitializeLights(theScene, passedParms) {
  let parms = CombineParameters(Config.webgl.lights, passedParms, undefined);

  if (parms.ambient) {
      var ambient = new THREE.AmbientLight(ColorFromValue(parms.ambient.color),
                                          Number(parms.ambient.intensity));
      GR.ambientLight = ambient;
      theScene.add(ambient);
  }
  if (parms.directional) {
      var directional = new THREE.DirectionalLight(ColorFromValue(parms.directional.color),
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

// Initialize environmental properties (fog, sky, ...)
function InitializeEnvironment(theScene, passedParams) {
    if (Config.webgl && Config.webgl.fog) {
        let parms = CombineParameters(Config.webgl.fog, passedParams, {
            'type': 'linear',
            'color': 'lightblue',
            'far': 1000,
            'density': 0.00025
        });
        let fogColor = ColorFromValue(parms.color);

        if (parms.type == 'linear') {
            let fogger = new THREE.Fog(fogColor, parms.far);
            if (parms.name) fogger.name = parms.name;
            if (parms.near) fogger.near = parms.near;
            theScene.add(fogger);
        }
        if (parms.type == 'exponential') {
            let fogger = new THREE.FogExp2(fogColor, parms.density);
            if (parms.name) fogger.name = parms.name;
            theScene.add(fogger);
        }
    }
}

// Add a test object to the scene
export function AddTestObject() {
    var geometry = new THREE.BoxGeometry( 1, 2, 3);
    var material = new THREE.MeshBasicMaterial( { color: 0x10cf10 } );
    var cube = new THREE.Mesh(geometry, material);
    cube.position.fromArray(Config.webgl.camera.initialCameraLookAt);
    GR.scene.add(cube);
    GP.DebugLog('Graphics: added test cube at ' + Config.webgl.camera.initialCameraLookAt);
};

// For initial debugging, camera is controlled by the console
function InitializeCameraControl(theScene, theContainer) {
  let control = new THREE.OrbitControls(GR.camera, GR.renderer.domElement);
  control.enableDamping = true;
  control.dampingFactor = 0.25;
  controls.screenSpacePanning = true;
  control.minDistance = 50;
  control.maxDistance = GR.camera.far;
  GR.cameraControl = control;
}

// Generate subscribable periodic when camera info (position) changes
function GenerateCameraEvents() {
  GR.eventCameraInfo = Eventing.register('display.cameraInfo', 'Graphics');
  GR.eventCameraInfo.timer = Eventing.createTimedEventProcessor(GR.eventCameraInfo, function(topic) {
      if (GR.eventCameraInfo.hasSubscriptions) {
          if (GR.eventCameraInfo.prevCamPosition == undefined) {
              GR.eventCameraInfo.prevCamPosition = new THREE.Vector3(0,0,0);
          }
          var oldPos = GR.eventCameraInfo.prevCamPosition;
          // must clone or 'newPos' will be just a reference to the old value.
          var newPos = GR.camera.position.clone();
          if (!newPos.equals(oldPos)) {
              var camInfo = {
                  'position': GR.camera.position.clone(),
                  'rotation': GR.camera.rotation.clone()
              };
              Eventing.fire(GR.eventCameraInfo, camInfo);
              GR.eventCameraInfo.prevCamPosition = newPos;
          }
      }
  });
}

// Start the generation of renderer statistic events
function GenerateRendererStatEvents() {
    // Generate subscribable periodic events when display info changes
    GR.eventDisplayInfo = Eventing.register('display.info', 'Graphics');
    GR.eventDisplayInfo.timer = Eventing.createTimedEventProcessor(GR.eventDisplayInfo,
      function(topic) {
        if (GR.eventDisplayInfo.hasSubscriptions) {
            // not general, but, for the moment, just return the WebGL info
            var dispInfo = GR.renderer.info;
            dispInfo.render.fps = GR.fps;
            Eventing.fire(GR.eventDisplayInfo, dispInfo);
        }
    });
}
