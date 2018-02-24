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

// holds the graphics context for this threejs instance
// Generates Events:
//      display.objectSelected
//      display.cameraInfo
//      display.info
var GR = GR || {};

import Config from 'xConfig';
import * as Eventing from 'xEventing';

import * as THREE from 'xThreeJS';
import { OrbitControls } from 'xThreeJSOrbit';
import { GLTFLoader } from 'xThreeJSGLTF';

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
function disposeNode (node) {
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
function disposeHierarchy (node, callback) {
    for (var i = node.children.length - 1; i >= 0; i--) {
        var child = node.children[i];
        disposeHierarchy (child, callback);
        callback (child);
    }
    disposeNode(node);
}

function disposeScene(scene) {
    for (var ii = scene.children.length - 1; ii >= 0; ii--) {
        disposeHierarchy(scene.children[ii], node => { scene.remove(node)});
    }
}

export function Init(container, canvas, initializedCallback) {
    return new Promise((resolve, reject) => {
        GR.container = container;
        GR.canvas = canvas;

        GR.scene = new THREE.Scene();

        internalInitializeCameraAndLights(GR.scene, GR.canvas);

        var rendererParams = Config.webgl.renderer.ThreeJS;
        rendererParams.canvas = canvas;
        GR.renderer = new THREE.WebGLRenderer(rendererParams);
        if (Config.webgl.renderer.clearColor) {
            GR.renderer.setClearColor(colorFromArray(Config.webgl.renderer.clearColor));
        }
        GR.renderer.setSize( canvas.clientWidth, canvas.clientHeight );

        if (Config.webgl.renderer.shadows) {
            GR.renderer.shadowMap.enabled = true;
            GR.renderer.shadowMap.type = THREE.PCFShoftShadowMap;
        }

        internalInitializeCameraControl(GR.scene, GR.container);
        container.addEventListener('resize', internalOnContainerResize, false);

        // GR.eventEachFrame = Eventing.register('display.eachFrame', 'Graphics');
        GR.eventObjectSelected = Eventing.register('display.objectSelected', 'Graphics');

        // Generate subscribable periodic when camera info (position) changes
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

        // Generate subscribable periodic events when display info changes
        GR.eventDisplayInfo = Eventing.register('display.info', 'Graphics');
        GR.eventDisplayInfo.timer = Eventing.createTimedEventProcessor(GR.eventDisplayInfo, function(topic) {
            if (GR.eventDisplayInfo.hasSubscriptions) {
                // not general, but, for the moment, just return the WebGL info
                var dispInfo = GR.renderer.info;
                dispInfo.render.fps = GR.fps;
                Eventing.fire(GR.eventDisplayInfo, dispInfo);
            }
        });
        // start FPS computation
        GR.lastFrameTime = new Date().getTime();
        resolve();
    });
};

export function Start() {
    if (!GR.runLoopIdentifier) {
        internalStartRendering();
    }
};

function internalStartRendering() {
    var keepRendering = function() {
        GR.runLoopIdentifier = requestAnimationFrame(keepRendering);
        internalDoRendering();
    };
    keepRendering();
};

// Do per-frame updates and then render the frame
function internalDoRendering() {
    if (GP.Ready && GR.scene && GR.camera) {
        // compute fps
        if (GR.lastFrameTime) {
            var nowTime = new Date().getTime();
            var secondsSinceLastFrame = (nowTime - GR.lastFrameTime) / 1000;
            GR.lastFrameTime = nowTime;
            if (secondsSinceLastFrame > 0) {
                GR.fps = 1 / secondsSinceLastFrame;
            }
        }
        if (GR.cameraControl) {
            GR.cameraControl.update();
        }
        if (GR.eventEachFrame) {
            Eventing.fire(GR.eventEachFrame, {});
        }
        // TODO: insert animation updates (shouldn't this be done before render time?)
        GR.renderer.render(GR.scene, GR.camera);
    }
};

// Container was resized
function internalOnContainerResize() {
    GP.DebugLog('Graphics: container resize');
    GR.camera.aspect = GR.canvas.clientWidth / GR.canvas.clientHeight;
    GR.camera.updateProjectionMatrix();

    renderer.setSize( GR.canvas.clientWidth, GR.canvas.clientHeight );
};

// Remove everything from the scene
export function ClearScene() {
    if (GR.runLoopIdentifier) {
        cancelAnimationFrame(GR.runLoopIdentifier);
        GP.DebugLog('Graphics: canelling runLoop');
    }
    GR.runLoopIdentifier = undefined;

    // http://stackoverflow.com/questions/29417374/threejs-remove-all-together-object-from-scene
    for (let ii= GR.scene.children.length-1; ii >= 0; ii--) {
        GR.scene.remove(GR.scene.children[ii]);
    }
    GP.DebugLog('Graphics: cleared scene');
    // GR.scene = undefined;
};

// Load the passed gltf file into the scene
export function LoadScene(url, loaded) {
    try {
        var loader;
        if (THREE.GLTFLoader) {
            loader = new THREE.GLTFLoader;
        }
        if (THREE.GLTF2Loader) {
            loader = new THREE.GLTF2Loader;
        }
        if (loader != undefined) {
            loader.load(url, function(gltf) {
                var theScene = gltf.scene ? gltf.scene : gltf.scenes[0];
                theScene.updateMatrixWorld(true);
                // For the moment, we're ignoring camera and lights from gltf
                GR.scene = theScene;
                internalInitializeCameraAndLights(theScene, GR.canvas);
                internalInitializeCameraControl(theScene, GR.container);
                GP.DebugLog('Graphics: Loaded GLTF scene');
                loaded();
            });
        }
        else {
            ReportError('Could not find a suitable GLTF loader in ThreeJS');
        }
    }
    catch (e) {
        ReportError('Failed reading GLTF file: ' + e);
    }
};

// Load multiple scenes.
// The caller should clear and release the previous scene as this creates new.
// Pass in an array: [ [url1, [x,y,x]], [url2,[x,y,x]], ...]
//     Where the [x,y,z] is a displacement base for the region.
export function LoadSceneMultiple(urlsAndLocations, loaded) {
    try {
        var newScene = new THREE.Scene();
        GR.scene = newScene;
        Promise.all(urlsAndLocations.map(oneRegionInfo => {
            let regionURL = oneRegionInfo[0];
            let regionOffset = oneRegionInfo[1];
            GP.DebugLog('Graphics: Loading multiple regions from ' + regionURL + " at offset " + regionOffset);
            return new Promise(function(resolve, reject) {
                try {
                    GP.DebugLog('Graphics: starting loading of ' + regionURL);
                    THREE.GLTFLoader.load(regionURL, function(gltf) {
                        GP.DebugLog('Graphics: resolving loading of ' + regionURL);
                        resolve([gltf, regionURL, regionOffset]);
                    }, undefined// onProgress
                    , function() { // onError
                        // If this does a reject, the whole 'all' fails.
                        // Fake a resolve but pass an undefined gltf pointer.
                        GP.DebugLog('Graphics: resolving fake gltf because error for ' + regionURL);
                        resolve([ undefined, regionURL, regionOffset]);
                    });
                }
                catch (e) {
                    GP.DebugLog('Graphics: rejecting loading of ' + regionURL);
                    reject(e);
                }
            });
        }))
        .catch(function(e) {
            GP.DebugLog('Graphics: failed loading multiple region');
        })
        // The above reads in all the gltf files and they show up here
        //    as an array of arrays each containing '[gltf, url, offset]'
        .then(loadedGltfs => {
            if (loadedGltfs) {
                loadedGltfs.forEach(gltfInfo => {
                    var gltf = gltfInfo[0];
                    var regionURL = gltfInfo[1];
                    var regionOffset = gltfInfo[2];
                    if (gltf) {
                        GP.DebugLog('Graphics: processing loaded region ' + regionURL);
                        var theScene = gltf.scene ? gltf.scene : gltf.scenes[0];
                        var group = new THREE.Group();
                        group.position.fromArray(regionOffset);
                        // group.setRotationFromAxisAngle(1, 0, 0, -0.7071068);
                        GP.DebugLog('loadedGltf: num children = ' + theScene.children.length);
                        theScene.children.forEach(function(aNode, iii) {
                            var newNode = aNode.clone();
                            if (newNode instanceof THREE.Mesh) {
                                newNode.material = aNode.material.clone();
                                newNode.position.set(aNode.position.clone());
                            }
                            // GP.DebugLog('loadedGltf: adding child named ' + aNode.name + ' with index ' + iii);
                            group.add(newNode);
                        });
                        GP.DebugLog('loadedGltf: num children after = ' + theScene.children.length);
                        newScene.add(group);
                        disposeScene(theScene);
                    }
                    else {
                        GP.DebugLog('Graphics: not processing gltf for ' + regionURL);
                    }
                })
            }
            else {
                GP.DebugLog('Graphics: no regions loaded');
            }
        })
        // All the scenes have been merged into 'newScene'.
        // Finish scene initialization.
        .then(function() {
            GP.DebugLog('Graphics: doing final processing to the scene');
            internalInitializeCameraAndLights(newScene, GR.canvas);
            internalInitializeCameraControl(newScene, GR.container);
            GP.DebugLog('Graphics: Loaded GLTF scene');
            loaded();
        });
    }
    catch (e) {
        ReportError('Failed reading GLTF file: ' + e);
    }
};

// Given a scene and optional gltf info, create a new scene
function internalInitializeCameraAndLights(theScene, canvas) {
    var parms = Config.webgl.camera;

    GR.camera = new THREE.PerspectiveCamera( 75, canvas.clientWidth / canvas.clientHeight, 1, parms.initialViewDistance );
    // GR.camera.up = new THREE.Vector3(0, 1, 0);
    GR.camera.position.fromArray(parms.initialCameraPosition);
    var lookAt = new THREE.Vector3;
    lookAt.fromArray(parms.initialCameraLookAt);
    GR.camera.lookAt(lookAt);
    if (parms.addCameraHelper) {
        GR.cameraHelper = new THREE.CameraHelper(GR.camera);
        theScene.add(GR.cameraHelper);
    }
    if (Config.webgl.camera.addAxisHelper) {
        var helperSize = parms.axisHelperSize || 5;
        GR.axisHelper = new THREE.AxisHelper(Number(helperSize));
        theScene.add(GR.axisHelper);
    }
    theScene.add(GR.camera);

    if (Config.webgl.lights) {
        parms = Config.webgl.lights;
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
};

// Add camera control to the scene.
function internalInitializeCameraControl(theScene, container) {
    GR.controls = new THREE.OrbitControls(GR.camera, GR.renderer.domElement);
};

export function GetCameraPosition() {
    return GR.camera.position;
};

export function SetCameraPosition(pos) {
    // var newPos;
    if (Array.isArray(pos)) {
        // newPos = new THREE.Vector3().fromArray(pos);
        GR.camera.position.fromArray(pos);
    }
    else {
        // newPos = pos;
        GR.camera.position.set(pos);
        GP.DebugLog("Graphics-ThreeJS: camera position: " + pos.x + " " + pos.y + " " + pos.z)
        // GR.camera.position = newPos;
    }
};

// Point the camera at a place. Takes either an array or a Vector3.
export function PointCameraAt(pos) {
    var look = new THREE.Vector3;
    if (Array.isArray(pos)) {
        look.fromArray(pos);
    }
    else
        look = pos;

    if (GR.controls) {
        GR.controls.target = look;
        GR.controls.update();
    }
    else {
        GR.camera.lookAt(look);
    }
    // Move axis helper to where the camera is looking
    if (GR.axisHelper) {
        GR.axisHelper.geometry.translate(look.x, look.y, look.z);
    }
};

// Add a test object to the scene
export function AddTestObject() {
    var geometry = new THREE.BoxGeometry( 1, 2, 3);
    var material = new THREE.MeshBasicMaterial( { color: 0x10cf10 } );
    var cube = new THREE.Mesh(geometry, material);
    cube.position.fromArray(Config.webgl.camera.initialCameraLookAt);
    GR.scene.add(cube);
    GP.DebugLog('Graphics: added test cube at ' + Config.webgl.camera.initialCameraLookAt);
};

export function SetDebugMode(enable) {
};

GP.GR = GR; // for debugging. Don't use for cross package access.
