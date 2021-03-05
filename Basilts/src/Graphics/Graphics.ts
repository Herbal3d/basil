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

import { Config, LightingParameters, CameraParameters } from '@Base/Config';
import { GlobalReady } from '@Base/Globals';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { PointCameraAt, SetCameraPosition } from '@Graphics/GraphicOps';
import { RegisterAbility } from '@Abilities/AbilityManagement';
import { AssemblyAbilityName, AbilityAssemblyFromProps } from '@Graphics/AbilityAssembly';
import { InstanceAbilityName, AbilityInstanceFromProps } from '@Graphics/AbilityInstance';
import { Eventing } from '@Eventing/Eventing';
import { TopicEntry } from '@Eventing/TopicEntry';

import { CombineParameters, ParseThreeTuple } from '@Tools/Utilities';
import { BKeyedCollection, BKeyValue } from '@Tools/bTypes.js';
import { Logger } from '@Tools/Logging';
import { Object3D } from 'three';

export const Graphics = {
    _container: <HTMLElement>undefined,
    _canvas: <HTMLCanvasElement>undefined,
    _scene: <THREE.Scene>undefined,
    _renderer: <THREE.WebGLRenderer>undefined,

    _clock: <THREE.Clock>undefined,
    frameNum: <number>undefined,
    FPS: <number>undefined,
    _lastFrameDelta: <number>undefined,
    _throttleFPS: <number>undefined,

    _groupWorldRel: <THREE.Group>undefined,
    _groupCameraRel: <THREE.Group>undefined,

    _camera:  <THREE.PerspectiveCamera>undefined,
    _axesHelper: <THREE.AxesHelper>undefined,
    _cameraHelper: <THREE.CameraHelper>undefined,
    _ambientLight: <THREE.AmbientLight>undefined,
    _directionalLight: <THREE.DirectionalLight>undefined,
    _cameraControl: <OrbitControls>undefined,
    _eventEachFrame: <TopicEntry>undefined,

    _eventCameraInfo: <TopicEntry>undefined,
    _eventCameraInfoTimer: <string>undefined,
    _eventDisplayInfo: <TopicEntry>undefined,
    _eventDisplayInfoTimer: <string>undefined,
    _prevCamPosition: <THREE.Vector3>undefined,

    connectGraphics(pContainer: HTMLElement, pCanvas: HTMLCanvasElement): void {
        Logger.debug('Graphics: constructor');
        Graphics._container = pContainer;
        Graphics._canvas = pCanvas;

        Graphics._scene = new THREE.Scene();

        Graphics._initializeCamera();
        Graphics._initializeLights();
        Graphics._initializeEnvironment();

        // parameters to pass to the THREE.renderer creation
        const rendererParams: THREE.WebGLRendererParameters = Config.webgl.renderer.ThreeJS;
        rendererParams.canvas = Graphics._canvas;
        rendererParams.context = Graphics._canvas.getContext('webgl2', { alpha: false } );
        Graphics._renderer = new THREE.WebGLRenderer(rendererParams);

        if (Config.webgl.renderer.clearColor) {
            Graphics._renderer.setClearColor(Graphics._colorFromValue(Config.webgl.renderer.clearColor));
        }
        if (Config.webgl.renderer.gammaFactor) {
            Graphics._renderer.gammaFactor = Config.webgl.renderer.gammaFactor;
        }

        if (Config.webgl.renderer.shadows) {
            Graphics._renderer.shadowMap.enabled = true;
            Graphics._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }

        // keep the camera and environment adjusted for the display size
        Graphics._onContainerResize();  // initial aspect ration computation
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Graphics._container.addEventListener('resize', Graphics._onContainerResize, false);

        // For the moment, camera control comes from the user
        Graphics._initializeCameraControl();

        // Clock used to keep track of frame time and FPS
        Graphics._clock = new THREE.Clock();
        Graphics.frameNum = 0;    // counted once each frame time
        Graphics.FPS = 10;        // an initial value to start computation
        Graphics._throttleFPS = 0; // if zero, no throttling

        // There are several top level groups for objects in different coordinate systems
        Graphics._groupWorldRel = new THREE.Group();
        Graphics._groupWorldRel.name = 'org.basil.b.GroupWorldRel';
        Graphics._groupCameraRel = new THREE.Group();
        Graphics._groupCameraRel.name = 'org.basil.b.GroupCameraRel';
        Graphics._scene.add(Graphics._groupWorldRel);
        Graphics._scene.add(Graphics._groupCameraRel);

        // Graphics generate a bunch of events so people can display stuff
        Graphics._generateCameraEvents();
        Graphics._generateRendererStatEvents();
        // This is disabled until someone needs it
        // Graphics.eventEachFrame = Eventing.Register('display.eachFrame', 'Graphics');

        RegisterAbility(AssemblyAbilityName, AbilityAssemblyFromProps);
        RegisterAbility(InstanceAbilityName, AbilityInstanceFromProps);
    },
    Start() {
        Graphics._startRendering();
    },
    // Remove everything from the scene
    ClearScene() {
        Graphics._stopRendering();

        Graphics._disposeScene(Graphics._scene);
        Logger.debug('Graphics: cleared scene');

        Graphics._startRendering();
    },

    _startRendering() {
        if (Graphics._renderer) {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            Graphics._doRendering();
        }
    },

    _stopRendering() {
        if (Graphics._renderer) {
            requestAnimationFrame(undefined);
        }
    },

    // Do per-frame updates and then render the frame
    _doRendering() {
        if (GlobalReady && Graphics._scene && Graphics._camera) {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            requestAnimationFrame(Graphics._doRendering);

            Graphics.frameNum++;
            Graphics._lastFrameDelta = Graphics._clock.getDelta();
            // compute a running average of FPS
            Graphics.FPS = Math.min((0.25 * (1 / Graphics._lastFrameDelta)) + (0.75 * Graphics.FPS), 300);

            if (Graphics._cameraControl) {
                Graphics._cameraControl.update();
            };
            if (Graphics._eventEachFrame) {
                void Graphics._eventEachFrame.fire({});
            };
            Graphics._doAnimation(Graphics._lastFrameDelta);
            if (Graphics._throttleFPS != 0) {
                // Do some computation to skip frames to approx the throttle frame rate
            };
            Graphics._renderer.render(Graphics._scene, Graphics._camera);
        };
    },

    _doAnimation(delta: number) {
        // look into https://github.com/tweenjs/tween.js
    },

    // Adjust the camera and environment when display size changes
    _onContainerResize() {
        Logger.debug(`Graphics._onContainerResize: width=${Graphics._canvas.clientWidth}, height=${Graphics._canvas.clientHeight}`);
        Graphics._renderer.setSize(Graphics._canvas.clientWidth, Graphics._canvas.clientHeight);
        Graphics._camera.aspect = Graphics._canvas.clientWidth / Graphics._canvas.clientHeight;
        Graphics._camera.updateProjectionMatrix();
        Graphics._renderer.setPixelRatio(window.devicePixelRatio);
    },

    _initializeCamera(passedParms?: BKeyedCollection) {
        if (Graphics._camera) {
            return;
        }

        // Set the parameter default values if not specified in the config file
        const parms = <CameraParameters>CombineParameters(Config.webgl.camera, passedParms, {
            name: 'cameraX',
            initialViewDistance: 1000,
            initialCameraPosition: [200, 50, 200],
            initialCameraLookAt: [ 0, 0, 0],
            addCameraHelper: false,
            addAxesHelper: false
        });

        Graphics._camera = new THREE.PerspectiveCamera( 75,
                        Graphics._canvas.clientWidth / Graphics._canvas.clientHeight,
                        1, parms.initialViewDistance );
        // camera.up = new THREE.Vector3(0, 1, 0);
        Graphics._scene.add(Graphics._camera);

        SetCameraPosition(parms.initialCameraPosition);
        PointCameraAt(parms.initialCameraLookAt);

        if (parms.addCameraHelper) {
            Graphics._cameraHelper = new THREE.CameraHelper(Graphics._camera);
            Graphics._scene.add(Graphics._cameraHelper);
        }
        if (parms.addAxesHelper) {
            const helperSize = parms.axesHelperSize || 5;
            Graphics._axesHelper = new THREE.AxesHelper(Number(helperSize));
            Graphics._scene.add(Graphics._axesHelper);
        }
    },

    _initializeLights(passedParms?: BKeyedCollection) {
        const parms = <LightingParameters>CombineParameters(Config.webgl.lights, passedParms, undefined);

        if (parms.ambient) {
            const ambient = new THREE.AmbientLight(Graphics._colorFromValue(parms.ambient.color),
                                                Number(parms.ambient.intensity));
            Graphics._ambientLight = ambient;
            Graphics._scene.add(ambient);
        }
        if (parms.directional) {
            const directionalLight = new THREE.DirectionalLight(Graphics._colorFromValue(parms.directional.color),
                                                Number(parms.directional.intensity));
            directionalLight.position.fromArray(parms.directional.direction).normalize();
            Graphics._directionalLight = directionalLight;
            if (parms.directional.shadows) {
                Graphics._directionalLight.castShadow = true;
                Graphics._directionalLight.shadow.bias = parms.directional.shadows.bias;
                Graphics._directionalLight.shadow.mapSize.width = parms.directional.shadows.mapWidth;
                Graphics._directionalLight.shadow.mapSize.height = parms.directional.shadows.mapHeight;
            }
            Graphics._scene.add(directionalLight);
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
        const cameraControl = new OrbitControls(Graphics._camera, Graphics._renderer.domElement);
        cameraControl.enableDamping = true;
        cameraControl.dampingFactor = 0.25;
        cameraControl.screenSpacePanning = true;
        cameraControl.minDistance = 50;
        cameraControl.maxDistance = Graphics._camera.far;
        Graphics._cameraControl = cameraControl;
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
        Graphics._eventCameraInfo = Eventing.Register('display.cameraInfo', 'Graphics');
        Graphics._eventCameraInfoTimer = Eventing.CreateTimedEventProcessor( Graphics._eventCameraInfo,
            (topic) => {
                if (Graphics._eventCameraInfo.hasSubscriptions) {
                    if (Graphics._prevCamPosition == undefined) {
                        Graphics._prevCamPosition = new THREE.Vector3(0,0,0);
                    }
                    const oldPos = Graphics._prevCamPosition;
                    // must clone or 'newPos' will be just a reference to the old value.
                    const newPos = Graphics._camera.position.clone();
                    if (!newPos.equals(oldPos)) {
                        const camInfo = {
                            'position': Graphics._camera.position.clone(),
                            'rotation': Graphics._camera.rotation.clone()
                        };
                        void Graphics._eventCameraInfo.fire(camInfo);
                        Graphics._prevCamPosition = newPos;
                    };
                };
            }
        );
    },

    // Start the generation of renderer statistic events
    _generateRendererStatEvents() {
        // Generate subscribable periodic events when display info changes
        Graphics._eventDisplayInfo = Eventing.Register('display.info', 'Graphics');
        Graphics._eventDisplayInfoTimer = Eventing.CreateTimedEventProcessor(Graphics._eventDisplayInfo,
            (topic) => {
                if (Graphics._eventDisplayInfo.hasSubscriptions) {
                    // not general, but, for the moment, just return the WebGL info
                    const dispInfo = Graphics._renderer.info;
                    (dispInfo as BKeyedCollection).fps = Graphics.FPS;
                    void Graphics._eventDisplayInfo.fire(dispInfo);
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
    _disposeHierarchy(node: THREE.Object3D): void {
        for (let i = node.children.length - 1; i >= 0; i--) {
            const child = node.children[i];
            Graphics._disposeHierarchy(child);
            Graphics._disposeNode(child);
        }
        Graphics._disposeNode(node);
    },

    _disposeScene(scene: THREE.Scene): void {
        for (let ii = scene.children.length - 1; ii >= 0; ii--) {
            Graphics._disposeHierarchy(scene.children[ii]);
        }
    },

    addNodeToWorldView(pNode: Object3D): void {
        Graphics._groupWorldRel.add(pNode);
    },
    addNodeToCameraView(pNode: Object3D): void {
        Graphics._groupCameraRel.add(pNode);
    }

};
