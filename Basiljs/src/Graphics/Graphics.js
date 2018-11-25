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
import { BItem, BItemType, BItemState } from 'xBItem';
import * as Eventing from 'xEventing';
import { CombineParameters, ParseThreeTuple } from 'xUtilities';

import { OrbitControls } from 'xThreeJSOrbit';
import { GLTFLoader } from 'xThreeJSGLTF';
import { ColladaLoader } from 'xThreeJSCollada';
import { DRACOLoader } from 'xThreeJSDRACO';
import { FBXLoader } from 'xThreeJSFBX';
import { OBJLoader } from 'xThreeJSOBJ';
import { BVHLoader } from 'xThreeJSBVH';

export class Graphics extends BItem {
  constructor(container, canvas) {
    GP.DebugLog('Graphics: constructor');
    let id = (Config.webgl && Config.webgl.graphicsId) ? Config.webgl.graphicsId : 'default.graphics';
    let auth = undefined;
    let itemType = BItemType.RENDERER;
    super(id, auth, itemType);
    this.container = container;
    this.canvas = canvas;

    this.scene = new THREE.Scene();

    this._initializeCamera(this.scene, this.canvas);
    this._initializeLights(this.scene);
    this._initializeEnvironment(this.scene);

    // parameters specific to setting up WebGL in the renderer
    let parms =(Config.webgl && Config.webgl.renderer) ? Config.webgl.renderer : {};

    let rendererParams = {};  // parameters to pass to the THREE.renderer creation
    if (parms.ThreeJS) {
      rendererParams = parms.ThreeJS;
    }
    rendererParams.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer(rendererParams);

    if (parms.clearColor) {
        this.renderer.setClearColor(Graphics.ColorFromValue(parms.clearColor));
    }

    if (parms.shadows) {
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShoftShadowMap;
    }

    // keep the camera and environment adjusted for the display size
    this._onContainerResize();  // initial aspect ration computation
    this.container.addEventListener('resize', this._onContainerResize, false);

    // For the moment, camera control comes from the user
    this._initializeCameraControl(this.scene, this.container);

    // Clock used to keep track of frame time and FPS
    this.clock = new THREE.Clock();

    // There are several top level groups for objects in different coordinate systems
    this.GroupWorldRel = new THREE.Group();
    this.GroupWorldRel.name = 'org.basil.b.GroupWorldRel';
    this.GroupCameraRel = new THREE.Group();
    this.GroupCameraRel.name = 'org.basil.b.GroupCameraRel';
    this.scene.add(this.GroupWorldRel);
    this.scene.add(this.GroupCameraRel);

    // Graphics generate a bunch of events so people can display stuff
    this._generateCameraEvents();
    this._generateRendererStatEvents();
  };

  GraphicsStart() {
    this._startRendering();
  };

  _startRendering() {
    if (this.renderer) {
      this.renderer.animate(this._doRendering);
    }
  };

  _stopRendering() {
    if (this.renderer) {
      this.renderer.stopAnimation();
    }
  };

  // Do per-frame updates and then render the frame
  _doRendering() {
      if (GP.Ready && this.scene && this.camera) {
          // compute fps
          this.lastFrameDelta = this.clock.getDelta();
          this.fps = 1 / this.lastFrameDelta;

          if (this.cameraControl) {
              this.cameraControl.update();
          }
          if (this.eventEachFrame) {
              Eventing.fire(this.eventEachFrame, {});
          }
          this._doAnimation();
          this.renderer.render(this.scene, this.camera);
      }
  };

  _doAnimation() {
    // look into https://github.com/tweenjs/tween.js
  };

  // Adjust the camera and environment when display size changes
  _onContainerResize() {
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(window.devicePixelRatio);
  };

  // Access function for the renderer itself
  THREErenderer() {
    return this.renderer;
  }

  // Access function for the camera.
  THREEcamera() {
    return this.camera;
  }

  // Remove everything from the scene
  ClearScene() {
    this.StopRendering();

    Graphics.disposeScene();
    GP.DebugLog('Graphics: cleared scene');

    this.StartRendering();
  }

  // Add this new node to the world coordinate system
  _addNodeToWorld(node) {
    this.GroupWorldRel.add(node);
  }

  _removeNodeFromWorld(node) {
    this.GroupWorldRel.remove(node);
  }

  // Add this node to the camera relative coordinate system
  _addNodeToCamera(node) {
    this.GroupCameraRel.add(node);
  }

  _removeNodeFromCamera(node) {
    this.GroupCameraRel.remove(node);
  }

  // The main funciton used to place an Instance into the world.
  // The instance is decorated with 'worldNode' which is the underlying
  //    graphical representation object.
  PlaceInWorld(inst) {
    if (inst.worldNode) {
      return; // already in world
    }
    inst.WhenReady()
    .then( item => {
      if (typeof(item.worldNode) == 'undefined') {
        GP.DebugLog('Graphics.PlaceInWorld: creating THREE node for ' + item.id);
        item.worldNode = new THREE.Group();
        item.worldNode.name = item.id;
        if (Array.isArray(item.displayable.representation)) {
          item.displayable.representation.forEach( piece => {
            item.worldNode.add(piece);
          });
        }
        else {
          item.worldNode.add(item.displayable.representation);
        }
      }
      if (item.gPosCoordSystem == BasilType.CoordSystem.CAMERA) {
        // item is camera relative
        this._addNodeToCamera(item.worldNode);
      }
      else {
        // item is world coordinate relative
        this._addNodeToWorld(item.worldNode);
      }
    })
    .catch( (item, reason) => {
      GP.DebugLog('Graphics.PlaceInWorld: item never ready. id=' + item.id);
    });
  }

  // Remove this instance from the displayed world data structure
  function RemoveFromWorld(inst) {
    if (inst.worldNode) {
      this._removeNodeFromWorld(inst.worldNode);
      this._removeNodeFromCamera(inst.worldNode);
      inst.worldNode = undefined;
    }
  }

  // Load an asset.
  // TODO: some formats have animations, cameras, ... What to do with those?
  // Passed parameters:
  // parms.auth authorization info
  // parms.url: URL to asset
  // parms.type = GLTF, Collada, OBJ, FBX
  // returns a promise of a handle to the ThreeJS node that is created
  LoadSimpleAsset(userAuth, parms, progressCallback) {
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
            let scene = undefined;
            if (loaded.scene) scene = loaded.scene;
            if (loaded.scenes) scene = loaded.scenes[0];
            let nodes = [];
            if (scene) {
              while (scene.children.length > 0) {
                let first = scene.children[0];
                scene.remove(first);
                nodes.push(first);
              }
              resolve(nodes);
            }
            else {
              let err = 'Graphics.LoadSimpleAsset: Could not understand loaded contents.'
                  + ' type=' + parms.loaderType
                  + ', url=' + parms.url;
              reject(err);
            }
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
  SetCameraPosition(gPos) {
    // TODO: conversion of gPos to lPos
    let pos = ParseThreeTuple(gPos);
    this.camera.position.fromArray(gPos);
    GP.DebugLog('Graphics: camera position: ['
      + this.camera.position.x
      + ', '
      + this.camera.position.y
      + ', '
      + this.camera.position.z
      + ']'
    );
  }

  // Pass position as either THREE.Vector3 or array of three numbers
  PointCameraAt(gPos) {
    let look = ParseThreeTuple(gPos);
    if (this.cameraControl) {
        this.cameraControl.target = look;
        this.cameraControl.update();
    }
    else {
        this.camera.lookAt(look);
    }
    // Move axes helper to where the camera is looking
    if (this.axesHelper) {
        this.axesHelper.geometry.translate(look.x, look.y, look.z);
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

  _initializeCamera(theScene, canvas, passedParms) {
    if (this.camera) {
      return;
    }

    // Set the parameter default values if not specified in the config file
    let parms = CombineParameters(Config.webgl.camera, passedParms, {
          'name': 'cameraX',
          'initialViewDistance': 1000,
          'initialCameraPosition': [200, 50, 200],
          'initialCameraLookAt': [ 0, 0, 0],
          'addCameraHelper': false,
          'addAxesHelper': false
    });

    this.camera = new THREE.PerspectiveCamera( 75, canvas.clientWidth / canvas.clientHeight,
                      1, parms.initialViewDistance );
    // this.camera.up = new THREE.Vector3(0, 1, 0);
    theScene.add(this.camera);

    this.SetCameraPosition(parms.initialCameraPosition);
    this.PointCameraAt(parms.initialCameraLookAt);

    if (parms.addCameraHelper) {
        this.cameraHelper = new THREE.CameraHelper(this.camera);
        theScene.add(this.cameraHelper);
    }
    if (parms.addAxesHelper) {
        let helperSize = parms.axesHelperSize || 5;
        this.axesHelper = new THREE.AxesHelper(Number(helperSize));
        theScene.add(this.axesHelper);
    }
  }

  _initializeLights(theScene, passedParms) {
    let parms = CombineParameters(Config.webgl.lights, passedParms, undefined);

    if (parms.ambient) {
        var ambient = new THREE.AmbientLight(Graphics.ColorFromValue(parms.ambient.color),
                                            Number(parms.ambient.intensity));
        this.ambientLight = ambient;
        theScene.add(ambient);
    }
    if (parms.directional) {
        var directional = new THREE.DirectionalLight(Graphics.ColorFromValue(parms.directional.color),
                                            Number(parms.directional.intensity));
        directional.position.fromArray(parms.directional.direction).normalize();
        this.directionalLight = directional;
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
  _initializeEnvironment(theScene, passedParams) {
      if (Config.webgl && Config.webgl.fog) {
          let parms = CombineParameters(Config.webgl.fog, passedParams, {
              'type': 'linear',
              'color': 'lightblue',
              'far': 1000,
              'density': 0.00025
          });
          let fogColor = Graphics.ColorFromValue(parms.color);

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
  AddTestObject() {
      var geometry = new THREE.BoxGeometry( 1, 2, 3);
      var material = new THREE.MeshBasicMaterial( { color: 0x10cf10 } );
      var cube = new THREE.Mesh(geometry, material);
      cube.position.fromArray(Config.webgl.camera.initialCameraLookAt);
      this.scene.add(cube);
      GP.DebugLog('Graphics: added test cube at ' + Config.webgl.camera.initialCameraLookAt);
  };

  // For initial debugging, camera is controlled by the console
  _initializeCameraControl(theScene, theContainer) {
    let control = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    control.enableDamping = true;
    control.dampingFactor = 0.25;
    controls.screenSpacePanning = true;
    control.minDistance = 50;
    control.maxDistance = this.camera.far;
    this.cameraControl = control;
  }

  // Generate subscribable periodic when camera info (position) changes
  _generateCameraEvents() {
    this.eventCameraInfo = Eventing.register('display.cameraInfo', 'Graphics');
    this.eventCameraInfo.timer = Eventing.createTimedEventProcessor(this.eventCameraInfo, function(topic) {
        if (this.eventCameraInfo.hasSubscriptions) {
            if (this.eventCameraInfo.prevCamPosition == undefined) {
                this.eventCameraInfo.prevCamPosition = new THREE.Vector3(0,0,0);
            }
            var oldPos = this.eventCameraInfo.prevCamPosition;
            // must clone or 'newPos' will be just a reference to the old value.
            var newPos = this.camera.position.clone();
            if (!newPos.equals(oldPos)) {
                var camInfo = {
                    'position': this.camera.position.clone(),
                    'rotation': this.camera.rotation.clone()
                };
                Eventing.fire(this.eventCameraInfo, camInfo);
                this.eventCameraInfo.prevCamPosition = newPos;
            }
        }
    });
  }

  // Start the generation of renderer statistic events
  _generateRendererStatEvents() {
      // Generate subscribable periodic events when display info changes
      this.eventDisplayInfo = Eventing.register('display.info', 'Graphics');
      this.eventDisplayInfo.timer = Eventing.createTimedEventProcessor(this.eventDisplayInfo,
        function(topic) {
          if (this.eventDisplayInfo.hasSubscriptions) {
              // not general, but, for the moment, just return the WebGL info
              var dispInfo = this.renderer.info;
              dispInfo.render.fps = this.fps;
              Eventing.fire(this.eventDisplayInfo, dispInfo);
          }
      });
  }

  // return a ThreeJS color number from an array of color values
  static function ColorFromValue(colorValue) {
      if (Array.isArray(colorValue)) {
          return new THREE.Color(colorValue[0], colorValue[1], colorValue[2]);
      }
      return new THREE.Color(colorValue);
  }

  // For unknow reasons, ThreeJS doesn't have a canned way of disposing a scene
  // From https://stackoverflow.com/questions/33152132/three-js-collada-whats-the-proper-way-to-dispose-and-release-memory-garbag/33199591#33199591
  static function disposeNode (node) {
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
  static function disposeHierarchy (node) {
      for (var i = node.children.length - 1; i >= 0; i--) {
          var child = node.children[i];
          Graphics.disposeHierarchy(child);
          Graphics.disposeNode(child);
      }
      Graphics.disposeNode(node);
  }

  static function disposeScene(scene) {
    for (var ii = scene.children.length - 1; ii >= 0; ii--) {
        Graphics.disposeHierarchy(scene.children[ii], node => { scene.remove(node)});
    }
  }

}
