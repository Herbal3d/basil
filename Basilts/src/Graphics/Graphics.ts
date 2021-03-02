// Copyright 2021 Robert Adams
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use static';

import { Config, LightingParameters } from '@Base/Config';
import { GlobalReady } from '@Base/Globals';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { BVHLoader } from 'three/examples/jsm/loaders/BVHLoader';

import { Eventing } from '@Eventing/Eventing';
import { TopicEntry } from '@Eventing/TopicEntry';

import { CombineParameters, ParseThreeTuple } from '@Tools/Utilities';
import { BKeyedCollection, BKeyValue } from '@Tools/bTypes.js';
import { Logger } from '@Tools/Logging';
import { Object3D } from 'three';

export const Graphics = {
    container: <HTMLElement>undefined,
    canvas: <HTMLCanvasElement>undefined,
    scene: <THREE.Scene>undefined,
    renderer: <THREE.WebGLRenderer>undefined,

    clock: <THREE.Clock>undefined,
    frameNum: <number>undefined,
    fps: <number>undefined,
    lastFrameDelta: <number>undefined,
    throttleFPS: <number>undefined,

    GroupWorldRel: <THREE.Group>undefined,
    GroupCameraRel: <THREE.Group>undefined,

    _camera:  <THREE.PerspectiveCamera>undefined,
    axesHelper: <THREE.AxesHelper>undefined,
    cameraHelper: <THREE.CameraHelper>undefined,
    ambientLight: <THREE.AmbientLight>undefined,
    directionalLight: <THREE.DirectionalLight>undefined,
    cameraControl: <OrbitControls>undefined,
    eventEachFrame: <TopicEntry>undefined,

    eventCameraInfo: <TopicEntry>undefined,
    eventCameraInfoTimer: <string>undefined,
    eventDisplayInfo: <TopicEntry>undefined,
    eventDisplayInfoTimer: <string>undefined,
    prevCamPosition: <THREE.Vector3>undefined,

    connectGraphics(pContainer: HTMLElement, pCanvas: HTMLCanvasElement): void {
        Logger.debug('Graphics: constructor');
        Graphics.container = pContainer;
        Graphics.canvas = pCanvas;

        Graphics.scene = new THREE.Scene();

        Graphics._initializeCamera();
        Graphics._initializeLights();
        Graphics._initializeEnvironment();

        // parameters to pass to the THREE.renderer creation
        const rendererParams: THREE.WebGLRendererParameters = Config.webgl.renderer.ThreeJS;
        rendererParams.canvas = Graphics.canvas;
        rendererParams.context = Graphics.canvas.getContext('webgl2', { alpha: false } );
        Graphics.renderer = new THREE.WebGLRenderer(rendererParams);

        if (Config.webgl.renderer.clearColor) {
            Graphics.renderer.setClearColor(Graphics._colorFromValue(Config.webgl.renderer.clearColor));
        }
        if (Config.webgl.renderer.gammaFactor) {
            Graphics.renderer.gammaFactor = Config.webgl.renderer.gammaFactor;
        }

        if (Config.webgl.renderer.shadows) {
            Graphics.renderer.shadowMap.enabled = true;
            Graphics.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }

        // keep the camera and environment adjusted for the display size
        Graphics._onContainerResize();  // initial aspect ration computation
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Graphics.container.addEventListener('resize', Graphics._onContainerResize, false);

        // For the moment, camera control comes from the user
        Graphics._initializeCameraControl();

        // Clock used to keep track of frame time and FPS
        Graphics.clock = new THREE.Clock();
        Graphics.frameNum = 0;    // counted once each frame time
        Graphics.fps = 10;        // an initial value to start computation
        Graphics.throttleFPS = 0; // if zero, no throttling

        // There are several top level groups for objects in different coordinate systems
        Graphics.GroupWorldRel = new THREE.Group();
        Graphics.GroupWorldRel.name = 'org.basil.b.GroupWorldRel';
        Graphics.GroupCameraRel = new THREE.Group();
        Graphics.GroupCameraRel.name = 'org.basil.b.GroupCameraRel';
        Graphics.scene.add(Graphics.GroupWorldRel);
        Graphics.scene.add(Graphics.GroupCameraRel);

        // Graphics generate a bunch of events so people can display stuff
        Graphics._generateCameraEvents();
        Graphics._generateRendererStatEvents();
        // This is disabled until someone needs it
        // Graphics.eventEachFrame = Eventing.Register('display.eachFrame', 'Graphics');
    },
    Start() {
        Graphics._startRendering();
    },
    // Remove everything from the scene
    ClearScene() {
        Graphics._stopRendering();

        Graphics._disposeScene(Graphics.scene);
        Logger.debug('Graphics: cleared scene');

        Graphics._startRendering();
    },

    // Function to move the camera from where it is to a new place.
    // This is movement from external source which could conflict with AR
    //     and VR camera control.
    SetCameraPosition(gPos: string | number[]) {
        // TODO: conversion of gPos to lPos
        const pos = ParseThreeTuple(gPos);
        Graphics._camera.position.fromArray(pos);
        Logger.debug(`Graphics: camera position: [${pos[0]}, ${pos[1]}, ${pos[2]}]`);
    },

    // Pass position as either THREE.Vector3 or array of three numbers
    PointCameraAt(gPos: string | number[] ) {
        const lookArray = ParseThreeTuple(gPos);
        const look = new THREE.Vector3(lookArray[0], lookArray[1], lookArray[2]);
        if (Graphics.cameraControl) {
            Graphics.cameraControl.target = look;
            Graphics.cameraControl.update();
        }
        else {
            Graphics._camera.lookAt(look);
        }
        // Move axes helper to where the camera is looking
        if (Graphics.axesHelper) {
            Graphics.axesHelper.geometry.translate(look.x, look.y, look.z);
        }

        Logger.debug(`Graphics: camera looking at: [${look.x}, ${look.y}, ${look.z}]`);
    },

    _startRendering() {
        if (Graphics.renderer) {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            requestAnimationFrame(Graphics._doRendering);
        }
    },

    _stopRendering() {
        if (Graphics.renderer) {
            Graphics.renderer.setAnimationLoop(undefined);
        }
    },

    // Do per-frame updates and then render the frame
    _doRendering() {
        if (GlobalReady && Graphics.scene && Graphics._camera) {
            Graphics.frameNum++;
            Graphics.lastFrameDelta = Graphics.clock.getDelta();
            // compute a running average of FPS
            Graphics.fps = Math.min((0.25 * (1 / Graphics.lastFrameDelta)) + (0.75 * Graphics.fps), 300);

            if (Graphics.cameraControl) {
                Graphics.cameraControl.update();
            };
            if (Graphics.eventEachFrame) {
                void Graphics.eventEachFrame.fire({});
            };
            Graphics._doAnimation(Graphics.lastFrameDelta);
            if (Graphics.throttleFPS != 0) {
                // Do some computation to skip frames to approx the throttle frame rate
            };
            Graphics.renderer.render(Graphics.scene, Graphics._camera);
        };
    },

    _doAnimation(delta: number) {
        // look into https://github.com/tweenjs/tween.js
    },

    // Adjust the camera and environment when display size changes
    _onContainerResize() {
        Logger.debug(`Graphics._onContainerResize: width=${Graphics.canvas.clientWidth}, height=${Graphics.canvas.clientHeight}`);
        Graphics.renderer.setSize(Graphics.canvas.clientWidth, Graphics.canvas.clientHeight);
        Graphics._camera.aspect = Graphics.canvas.clientWidth / Graphics.canvas.clientHeight;
        Graphics._camera.updateProjectionMatrix();
        Graphics.renderer.setPixelRatio(window.devicePixelRatio);
    },

    _initializeCamera(passedParms?: BKeyedCollection) {
        if (Graphics._camera) {
            return;
        }

        // Set the parameter default values if not specified in the config file
        const parms = CombineParameters(Config.webgl.camera, passedParms, {
            'name': 'cameraX',
            'initialViewDistance': 1000,
            'initialCameraPosition': [200, 50, 200],
            'initialCameraLookAt': [ 0, 0, 0],
            'addCameraHelper': false,
            'addAxesHelper': false
        });

        Graphics._camera = new THREE.PerspectiveCamera( 75,
                        Graphics.canvas.clientWidth / Graphics.canvas.clientHeight,
                        1, parms.initialViewDistance );
        // camera.up = new THREE.Vector3(0, 1, 0);
        Graphics.scene.add(Graphics._camera);

        Graphics.SetCameraPosition(parms.initialCameraPosition);
        Graphics.PointCameraAt(parms.initialCameraLookAt);

        if (parms.addCameraHelper) {
            Graphics.cameraHelper = new THREE.CameraHelper(Graphics._camera);
            Graphics.scene.add(Graphics.cameraHelper);
        }
        if (parms.addAxesHelper) {
            const helperSize = parms.axesHelperSize || 5;
            Graphics.axesHelper = new THREE.AxesHelper(Number(helperSize));
            Graphics.scene.add(Graphics.axesHelper);
        }
    },

    _initializeLights(passedParms?: BKeyedCollection) {
        const parms = <LightingParameters>CombineParameters(Config.webgl.lights, passedParms, undefined);

        if (parms.ambient) {
            const ambient = new THREE.AmbientLight(Graphics._colorFromValue(parms.ambient.color),
                                                Number(parms.ambient.intensity));
            Graphics.ambientLight = ambient;
            Graphics.scene.add(ambient);
        }
        if (parms.directional) {
            const directionalLight = new THREE.DirectionalLight(Graphics._colorFromValue(parms.directional.color),
                                                Number(parms.directional.intensity));
            directionalLight.position.fromArray(parms.directional.direction).normalize();
            Graphics.directionalLight = directionalLight;
            if (parms.directional.shadows) {
                Graphics.directionalLight.castShadow = true;
                Graphics.directionalLight.shadow.bias = parms.directional.shadows.bias;
                Graphics.directionalLight.shadow.mapSize.width = parms.directional.shadows.mapWidth;
                Graphics.directionalLight.shadow.mapSize.height = parms.directional.shadows.mapHeight;
            }
            Graphics.scene.add(directionalLight);
        }
    },

    // Initialize environmental properties (fog, sky, ...)
    _initializeEnvironment(passedParams?: BKeyedCollection) {
        if (Config.webgl && Config.webgl.fog && Config.webgl.fog.enabled) {
            const parms = CombineParameters(Config.webgl.fog, passedParams, {
                'enabled': false,
                'type': 'linear',
                'color': 'lightblue',
                'far': 1000,
                'density': 0.00025
            });

            /* 2021 ThreeJS changed how fog is done this code need a rework
            const fogColor = Graphics._colorFromValue(parms['color']);
            if (parms.type == 'linear') {
                let fogger = new THREE.Fog(fogColor, parms.far);
                if (parms.name) fogger.name = parms.name;
                if (parms.near) fogger.near = parms.near;
                Graphics.scene.add(fogger);
            };
            if (parms.type == 'exponential') {
                let fogger = new THREE.FogExp2(fogColor, parms.density);
                if (parms.name) fogger.name = parms.name;
                Graphics.scene.add(fogger);
            };
            */
        };
    },

    /*
    _initializeCameraInstance(passedParams?: BKeyedCollection) {
        // Set up a camera Instance.
        // Cameras can be displayed so there is a type.
        let cid = Config.webgl.camera.cameraId ? Config.webgl.camera.cameraId : 'org.basil.b.camera';
        let cauth = undefined;
        cameraInstance = new BItem(cid, cauth, BItemType.CAMERA);
        cameraInstance.AddAbility( new AbilityCamera() );
    },
    */
    // For initial debugging, camera is controlled by the console
    _initializeCameraControl() {
        const cameraControl = new OrbitControls(Graphics._camera, Graphics.renderer.domElement);
        cameraControl.enableDamping = true;
        cameraControl.dampingFactor = 0.25;
        cameraControl.screenSpacePanning = true;
        cameraControl.minDistance = 50;
        cameraControl.maxDistance = Graphics._camera.far;
        Graphics.cameraControl = cameraControl;
    },
    // Return a ThreeJS color number from an array of color values
    _colorFromValue(pColorValue: number[] | string ): THREE.Color {
        if (typeof(pColorValue) === 'string' 
                    && (pColorValue.startsWith('#') || pColorValue.startsWith('0x')) ) {
            return new THREE.Color(pColorValue);
        }
        const val = ParseThreeTuple(pColorValue);
        return new THREE.Color(val[0], val[1], val[2]);
    },

    // Generate subscribable periodic when camera info (position) changes
    _generateCameraEvents() {
        Graphics.eventCameraInfo = Eventing.Register('display.cameraInfo', 'Graphics');
        Graphics.eventCameraInfoTimer = Eventing.CreateTimedEventProcessor( Graphics.eventCameraInfo,
            (topic) => {
                if (Graphics.eventCameraInfo.hasSubscriptions) {
                    if (Graphics.prevCamPosition == undefined) {
                        Graphics.prevCamPosition = new THREE.Vector3(0,0,0);
                    }
                    const oldPos = Graphics.prevCamPosition;
                    // must clone or 'newPos' will be just a reference to the old value.
                    const newPos = Graphics._camera.position.clone();
                    if (!newPos.equals(oldPos)) {
                        const camInfo = {
                            'position': Graphics._camera.position.clone(),
                            'rotation': Graphics._camera.rotation.clone()
                        };
                        void Graphics.eventCameraInfo.fire(camInfo);
                        Graphics.prevCamPosition = newPos;
                    };
                };
            }
        );
    },

    // Start the generation of renderer statistic events
    _generateRendererStatEvents() {
        // Generate subscribable periodic events when display info changes
        Graphics.eventDisplayInfo = Eventing.Register('display.info', 'Graphics');
        Graphics.eventDisplayInfoTimer = Eventing.CreateTimedEventProcessor(Graphics.eventDisplayInfo,
            (topic) => {
                if (Graphics.eventDisplayInfo.hasSubscriptions) {
                    // not general, but, for the moment, just return the WebGL info
                    const dispInfo = Graphics.renderer.info;
                    (dispInfo as BKeyedCollection).fps = Graphics.fps;
                    void Graphics.eventDisplayInfo.fire(dispInfo);
                };
            }
        );
    },

    // For unknown reasons, ThreeJS doesn't have a canned way of disposing a scene
    // From https://stackoverflow.com/questions/33152132/three-js-collada-whats-the-proper-way-to-dispose-and-release-memory-garbag/33199591#33199591
    _disposeNode(node: THREE.Object3D) {
        if (node instanceof THREE.Mesh) {
            /*
            // 2021 Looks like ThreeJS has changed its internal node structure so this doesn't work
            if (node.geometry) {
                node.geometry.dispose ();
            }
            if (node.material) {
                let matTypes = [ 'map', 'lightMap', 'bumpMap', 'normalMap', 'specularMap', 'envMap' ];
                if (node.material) {
                    let mater = <THREE.Material>node.material;
                    mater.materials.forEach( mtrl => {
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
                };
            };
            */
        };
    },

    // disposeHierarchy (YOUR_OBJECT3D, disposeNode);
    _disposeHierarchy(node: THREE.Object3D) {
        for (let i = node.children.length - 1; i >= 0; i--) {
            const child = node.children[i];
            Graphics._disposeHierarchy(child);
            Graphics._disposeNode(child);
        }
        Graphics._disposeNode(node);
    },

    _disposeScene(scene: THREE.Scene) {
        for (let ii = scene.children.length - 1; ii >= 0; ii--) {
            Graphics._disposeHierarchy(scene.children[ii]);
        }
    }

};
