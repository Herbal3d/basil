// Copyright 2018 Robert Adame
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

import { GP } from 'GLOBALS';
import Config from '../config.js';
import { BItem, BItemType } from '../Items/BItem.js';

import { CombineParameters, ParseThreeTuple, JSONstringify } from '../Utilities.js';

import { Register, Subscribe } from '../Eventing/Eventing.js';

import * as Coord from './Coord.js';

// Even though these are not explicilty referenced, this causes webpack to include the libraries.
import { OrbitControls } from '../jslibs/OrbitControls.js';
import { GLTFLoader } from '../jslibs/GLTFLoader.js';
import { ColladaLoader } from '../jslibs/ColladaLoader.js';
import { DRACOLoader } from '../jslibs/DRACOLoader.js';
import { FBXLoader } from '../jslibs/FBXLoader.js';
import { OBJLoader } from '../jslibs/OBJLoader.js';
import { BVHLoader } from '../jslibs/BVHLoader.js';

import { AbilityCamera } from '../Items/AbilityCamera.js';

// import { InstancedMesh } from 'three-instanced-mesh';
require ( 'three-instanced-mesh')(THREE);

// Class that wraps the renderer implementation.
export class Graphics extends BItem {
    constructor(container, canvas, eventing) {
        GP.DebugLog('Graphics: constructor');
        let id = (Config.webgl && Config.webgl.graphicsId) ? Config.webgl.graphicsId : 'org.basil.b.renderer';
        let auth = undefined;
        super(id, auth, BItemType.RENDERER);
        this.layer = Config.layers ? Config.layers.service : 'org.basil.b.layer.graphics';
        this.container = container;
        this.canvas = canvas;
        this.events = eventing;

        this.scene = new THREE.Scene();

        this._initializeCamera();
        this._initializeLights();
        this._initializeEnvironment();

        // parameters specific to setting up WebGL in the renderer
        let renderParms =(Config.webgl && Config.webgl.renderer) ? Config.webgl.renderer : {};

        // parameters to pass to the THREE.renderer creation
        let rendererParams = renderParms.ThreeJS ? renderParms.ThreeJS : {};
        if (rendererParams.UseWebGL2) {
            // Instructions from https://threejs.org/docs/#manual/en/introduction/How-to-use-WebGL2
            rendererParams.canvas = canvas;
            rendererParams.context = canvas.GetContext('webgl2', { alpha: false } );
            this.renderer = new THREE.WebGLRenderer(rendererParams);
        }
        else {
            rendererParams.canvas = canvas;
            this.renderer = new THREE.WebGLRenderer(rendererParams);
        }

        if (renderParms.clearColor) {
            this.renderer.setClearColor(this._colorFromValue(renderParms.clearColor));
        }
        if (renderParms.gammaFactor) {
            this.renderer.gammaFactor = Number(renderParms.gammaFactor);
        }

        if (renderParms.shadows) {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFShoftShadowMap;
        }

        // keep the camera and environment adjusted for the display size
        this._onContainerResize();  // initial aspect ration computation
        this.container.addEventListener('resize', this._onContainerResize.bind(this), false);

        // For the moment, camera control comes from the user
        this._initializeCameraControl();

        // Clock used to keep track of frame time and FPS
        this.clock = new THREE.Clock();
        this.frameNum = 0;    // counted once each frame time
        this.fps = 10;        // an initial value to start computation
        this.throttleFPS = 0; // if zero, no throttling

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
        // This is disabled until someone needs it
        // this.eventEachFrame = this.events.Register('display.eachFrame', 'Graphics');

        // Set up the BItem environment.
        // The Renderer is just a BItem.
        super.DefineProperties( {
            'capabilities': {
                'get': (th) => { return JSON.stringify(this.renderer.capabilities); },
                name: 'Capabilities'
            },
            'extensions': {
                'get': (th) => { return JSON.stringify(this.renderer.extensions); },
                name: 'Extensions'
            },
            'info': {
                'get': (th) => { return JSON.stringify(this.renderer.info); },
                name: 'Info'
            }
          } );

        // Graphics creates an Instance to represent the camera.
        this._initializeCameraInstance();

    };

    Start() {
        this._startRendering();
        this.SetReady();
    };

    _startRendering() {
        if (this.renderer) {
            this.renderer.setAnimationLoop(this._doRendering.bind(this));
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
            this.frameNum++;
            this.lastFrameDelta = this.clock.getDelta();
            // compute a running average of FPS
            this.fps = Math.min((0.25 * (1 / this.lastFrameDelta)) + (0.75 * this.fps), 300);

            if (this.cameraControl) {
                this.cameraControl.update();
            }
            if (this.eventEachFrame) {
                this.eventEachFrame.fire({});
            }
            this._doAnimation(this.lastFrameDelta);
            if (this.throttleFPS != 0) {
                // Do some computation to skip frames to approx the throttle frame rate
            }
            this.renderer.render(this.scene, this.camera);
        }
    };

    _doAnimation(delta) {
        // look into https://github.com/tweenjs/tween.js
    };

    // Adjust the camera and environment when display size changes
    _onContainerResize() {
        GP.DebugLog("Graphics._onContainerResize: width=" + this.canvas.clientWidth
                    + ", height=" + this.canvas.clientHeight);
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setPixelRatio(window.devicePixelRatio);
    };

    // Remove everything from the scene
    ClearScene() {
        this.StopRendering();

        this._disposeScene();
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

    // The main function used to place an Instance into the world.
    // Pass an AbilityInstance and an AbilityDisplayable.
    //    The displayable is placed in the world and the node info
    //    is added to the instance.
    // The instance is decorated with 'worldNode' which is the underlying
    //    graphical representation object.
    // Assume the displayable is ready.
    PlaceInWorld(pInst, pDisp) {
        if (typeof(pInst.worldNode) === 'undefined') {
            try {
                let worldNode = new THREE.Group();
                worldNode.position.fromArray(pInst.gPos);
                worldNode.quaternion.fromArray(pInst.gRot);
                worldNode.name = pInst.parent.id;
                if (Array.isArray(pDisp.representation)) {
                    pDisp.representation.forEach( piece => {
                        worldNode.add(piece.clone());
                    });
                }
                else {
                    worldNode.add(pDisp.representation.clone());
                }
                pInst.worldNode = worldNode;
            }
            catch (e) {
                GP.ErrorLog('Graphics.PlaceInWorld: Exception adding. e=' + JSONStringify(e));
            }
        }
        else {
            return; // already in world
        };
        if (pInst.gPosCoordSystem == Coord.CoordSystem.CAMERA) {
            // item is camera relative
            this._addNodeToCamera(pInst.worldNode);
        }
        else {
            // item is world coordinate relative
            this._addNodeToWorld(pInst.worldNode);
        };
    };

    // Remove this instance from the displayed world data structure
    RemoveFromWorld(inst) {
        if (inst.worldNode) {
            let wNode = inst.worldNode;
            inst.worldNode = undefined;
            this._removeNodeFromWorld(wNode);
            this._removeNodeFromCamera(wNode);
            this.ReleaseSimpleAsset(wNode);
        }
    };

    // Load an asset.
    // TODO: some formats have animations, cameras, ... What to do with those?
    // Passed parameters:
    // parms.auth authorization info
    // parms.url: URL to asset
    // parms.type = GLTF, Collada, OBJ, FBX
    // Returns a promise of a handle to ThreeJS node(s) read and created.
    // Note: only returns the nodes. For animations, etc, need a different routine.
    LoadSimpleAsset(passedParams, progressCallback) {
        let parms = CombineParameters(Config.assetLoader, passedParams, {
            'displayableurl': undefined,       // URL to load from
            'loaderType': 'gltf',   // type of loader to use
            'displayableauth': undefined,      // authorization needed to access URL
            'useDRACO': true,
            'combineInstances': true    // whether to combine instances
        });
        // GP.DebugLog('Graphics.LoadSimpleAsset: call parms: ' + JSON.stringify(parms));
        return new Promise(function(resolve, reject) {
            let loader = undefined;
            switch (parms.loadertype.toLowerCase()) {
                case 'gltf':    loader = new THREE.GLTFLoader();
                                if (parms.usedraco) {
                                    loader.setDRACOLoader( new THREE.DRACOLoader() );
                                    // THREE.DRACOLoader.getDecoderModule();
                                }
                                break;
                case 'collada': loader = new THREE.ColladaLoader(); break;
                case 'fbx':     loader = new THREE.FBXLoader(); break;
                case 'obj':     loader = new THREE.OBJLoader(); break;
                case 'bvh':     loader = new THREE.BVHLoader(); break;
            }
            if (loader) {
                let requestURL = parms.displayableurl;
                // If auth info is in parameters, add a "bearer-*" item into the access URL
                //     so the receiver can verify the request.
                if (parms.displayableauth) {
                    // Authorization code is packed into the URL
                    let urlPieces = parms.displayableurl.split('/');
                    let lastIndex = urlPieces.length - 1;
                    urlPieces.push(urlPieces[lastIndex]);
                    urlPieces[lastIndex] = 'bearer-' + parms.displayableauth;
                    requestURL = urlPieces.join('/');
                }
                GP.DebugLog('Graphics.LoadSimpleAsset: loading from: ' + requestURL);
                // To complicate things, ThreeJS loaders return different things
                loader.load(requestURL, function(loaded) {
                    // Successful load
                    let scene = undefined;
                    if (loaded.scene) scene = loaded.scene;
                    if (loaded.scenes) scene = loaded.scenes[0];
                    let nodes = [];
                    if (scene) {
                        if (parms.combineinstances) {
                            try {
                                Graphics._rebuildSceneInstances(scene);
                            }
                            catch (e) {
                                let err = 'Graphics.LoadSimpleAsset: Exception combining instances.'
                                    + ' url=' + parms.displayableurl
                                    + ', e=' + e;
                                reject(err);
                            }
                        }
                        // Take the children out of the scene and return list of children nodes.
                        // The remove/push thing is done to clean up any scene meta-data.
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
                            + ', url=' + parms.displayableurl;
                        reject(err);
                    }
                },
                // loading progress
                function(xhr) {
                    if (typeof(progressCallback) !== 'undefined') {
                        progressCallback(xhr);
                    }
                },
                // Failed load
                function(e) {
                    GP.DebugLog('Graphics.LoadSimpleAsset: loading failed: ' + JSONstringify(e));
                    reject(e);
                });
            }
            else {
                reject('No loader for type ' + parms.loaderType);
            }
        });
    }

    // LoadSimpleAsset returns an array of nodes. Here we free them.
    ReleaseSimpleAsset(asset) {
        if (Array.isArray(asset)) {
            asset.forEach( node => {
                this._disposeHierarchy(node);
            });
        }
        else {
            this._disposeHierarchy(asset);
        }
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
            this.axesHelper.geometry.translate(look[0], look[1], look[2]);
        }

        GP.DebugLog('Graphics: camera looking at:'
            + ' [' + look[0] + ', ' + look[1] + ', ' + look[2] + ']' );
    }

    _initializeCamera(passedParms) {
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

        this.camera = new THREE.PerspectiveCamera( 75,
                        this.canvas.clientWidth / this.canvas.clientHeight,
                        1, parms.initialViewDistance );
        // this.camera.up = new THREE.Vector3(0, 1, 0);
        this.scene.add(this.camera);

        this.SetCameraPosition(parms.initialCameraPosition);
        this.PointCameraAt(parms.initialCameraLookAt);

        if (parms.addCameraHelper) {
            this.cameraHelper = new THREE.CameraHelper(this.camera);
            this.scene.add(this.cameraHelper);
        }
        if (parms.addAxesHelper) {
            let helperSize = parms.axesHelperSize || 5;
            this.axesHelper = new THREE.AxesHelper(Number(helperSize));
            this.scene.add(this.axesHelper);
        }
    }

    _initializeLights(passedParms) {
        let parms = CombineParameters(Config.webgl.lights, passedParms, undefined);

        if (parms.ambient) {
            var ambient = new THREE.AmbientLight(this._colorFromValue(parms.ambient.color),
                                                Number(parms.ambient.intensity));
            this.ambientLight = ambient;
            this.scene.add(ambient);
        }
        if (parms.directional) {
            var directional = new THREE.DirectionalLight(this._colorFromValue(parms.directional.color),
                                                Number(parms.directional.intensity));
            directional.position.fromArray(parms.directional.direction).normalize();
            this.directionalLight = directional;
            if (parms.directional.shadows) {
                directional.castShadow = true;
                directional.shadow.bias = parms.directional.shadows.bias;
                directional.shadow.mapSize.width = parms.directional.shadows.mapWidth;
                directional.shadow.mapSize.height = parms.directional.shadows.mapHeight;
            }
            this.scene.add(directional);
        }
    }

    // Initialize environmental properties (fog, sky, ...)
    _initializeEnvironment(passedParams) {
        if (Config.webgl && Config.webgl.fog) {
            let parms = CombineParameters(Config.webgl.fog, passedParams, {
                'type': 'linear',
                'color': 'lightblue',
                'far': 1000,
                'density': 0.00025
            });
            let fogColor = this._colorFromValue(parms.color);

            if (parms.type == 'linear') {
                let fogger = new THREE.Fog(fogColor, parms.far);
                if (parms.name) fogger.name = parms.name;
                if (parms.near) fogger.near = parms.near;
                this.scene.add(fogger);
            }
            if (parms.type == 'exponential') {
                let fogger = new THREE.FogExp2(fogColor, parms.density);
                if (parms.name) fogger.name = parms.name;
                this.scene.add(fogger);
            }
        }
    }

    _initializeCameraInstance(passedParams) {
        // Set up a camera Instance.
        // Cameras can be displayed so there is a type.
        let cparam = (Config.webgl && Config.webgl.camera) ? Config.webgl.camera : {};
        let cid = cparam.cameraId ? cparam.cameraId : 'org.basil.b.camera';
        let cauth = undefined;
        this.cameraInstance = new BItem(cid, cauth, BItemType.CAMERA);
        this.cameraInstance.AddAbility( new AbilityCamera() );
    }

    // Scan the scene and, if there are any duplicated geometries, replace the duplicated
    //    nodes with an InstancedMesh.
    // Note that the node replacements only happen if the duplicates are siblings.
    static _rebuildSceneInstances(scene) {
        // Force the computation of the world matrix for the nodes in the scene
        scene.updateMatrixWorld(true);

        Graphics._rebuildSiblingInstances(scene, scene, scene.children);
    }
    // See if any of these siblings share geometries.
    // If so, replace the nodes that share geometries with a single InstancedMesh.
    static _rebuildSiblingInstances(scene, parent, siblings) {

        if (siblings && siblings.length > 0) {
            // Do the children of these siblings before doing this set of siblings
            siblings.forEach( sib => {
                Graphics._rebuildSiblingInstances(scene, sib, sib.children);
            });

            // Collect the nodes that share a geometry
            let geomsById = new Map();
            siblings.forEach( sib => {
                if (sib.geometry) {
                    let idd = sib.geometry.id;
                    if (!geomsById.has(idd)) {
                        geomsById.set(idd, []);
                    }
                    geomsById.get(idd).push(sib);
                }
            });

            // For nodes that share a geometry, remove them from the sibling list
            //     and replace with a single InstancedMesh.
            geomsById.forEach( (val, key) => {
                if (val.length > 1) {
                    let oneInstance = val[0];
                    // Create the mesh that displays all the instances
                    let newSib = new THREE.InstancedMesh(
                        oneInstance.geometry.clone(),
                        oneInstance.material,   // material is cloned by the library
                        val.length,         // number of instances
                        false,              // is it dynamic
                        false,              // does it have color
                        true                // uniform scale (1,1,1)
                    );
                    // Put each instance at the location the original geometry was
                    let targetV = new THREE.Vector3();
                    let targetV2 = new THREE.Vector3(1,1,1);
                    let targetQ = new THREE.Quaternion();
                    for (let ii = 0; ii < val.length; ii++) {
                        // Instance addresses are in world coordinates
                        val[ii].getWorldPosition(targetV);
                        newSib.setPositionAt(ii, targetV);
                        val[ii].getWorldQuaternion(targetQ);
                        newSib.setQuaternionAt(ii, targetQ);
                        // For some reason scales end up like '0.999999876...'. Use a clean '1'.
                        // val[ii].getWorldScale(targetV2);
                        newSib.setScaleAt(ii, targetV2);
                    }

                    // Since the nodes that share geometries are being combined, we must
                    //     reparent any children.
                    val.forEach( instancedParent => {
                        if (instancedParent.children && instancedParent.children.length > 0) {
                            let replacementParent = new THREE.Group();
                            replacementParent.position.copy(instancedParent.position);
                            replacementParent.rotation.copy(instancedParent.rotation);
                            replacementParent.scale.copy(instancedParent.scale);
                            replacementParent.updateMatrix();
                            instancedParent.children.forEach( child => {
                                instancedParent.remove(child);
                                replacementParent.add(child);
                                child.updateMatrixWorld(true);
                            });
                            parent.add(replacementParent);
                        }
                    });

                    // Remove the nodes that went to the duplicated geometry
                    val.forEach( sibWithDup => {
                        parent.remove(sibWithDup);
                    });

                    // The new set of instances goes into the scene
                    scene.add(newSib);
                    newSib.needsUpdate();
                }
            });
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
    }

    // For initial debugging, camera is controlled by the console
    _initializeCameraControl() {
        let control = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        control.enableDamping = true;
        control.dampingFactor = 0.25;
        control.screenSpacePanning = true;
        control.minDistance = 50;
        control.maxDistance = this.camera.far;
        this.cameraControl = control;
    }

    // Generate subscribable periodic when camera info (position) changes
    _generateCameraEvents() {
        this.eventCameraInfo = this.events.Register('display.cameraInfo', 'Graphics');
        this.eventCameraInfo.timer = this.events.CreateTimedEventProcessor(
                            this.eventCameraInfo, function(topic) {
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
                    this.eventCameraInfo.fire(camInfo);
                    this.eventCameraInfo.prevCamPosition = newPos;
                }
            }
        }.bind(this));
    }

    // Start the generation of renderer statistic events
    _generateRendererStatEvents() {
        // Generate subscribable periodic events when display info changes
        this.eventDisplayInfo = this.events.Register('display.info', 'Graphics');
        this.eventDisplayInfo.timer = this.events.CreateTimedEventProcessor(this.eventDisplayInfo,
            function(topic) {
                if (this.eventDisplayInfo.hasSubscriptions) {
                    // not general, but, for the moment, just return the WebGL info
                    var dispInfo = this.renderer.info;
                    dispInfo.render.fps = this.fps;
                    this.eventDisplayInfo.fire(dispInfo);
                }
            }.bind(this)
        );
    }

    // Return a ThreeJS color number from an array of color values
    _colorFromValue(colorValue) {
        if (Array.isArray(colorValue)) {
            return new THREE.Color(colorValue[0], colorValue[1], colorValue[2]);
        }
        return new THREE.Color(colorValue);
    }

    // For unknown reasons, ThreeJS doesn't have a canned way of disposing a scene
    // From https://stackoverflow.com/questions/33152132/three-js-collada-whats-the-proper-way-to-dispose-and-release-memory-garbag/33199591#33199591
    _disposeNode(node) {
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
    _disposeHierarchy(node) {
        for (var i = node.children.length - 1; i >= 0; i--) {
            var child = node.children[i];
            this._disposeHierarchy(child);
            this._disposeNode(child);
        }
        this._disposeNode(node);
    }

    _disposeScene(scene) {
        for (var ii = scene.children.length - 1; ii >= 0; ii--) {
            this._disposeHierarchy(scene.children[ii], node => { scene.remove(node)});
        }
    }
}
