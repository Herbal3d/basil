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

// import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { Engine, Scene, TargetCamera, Node, TransformNode,
        Light, DirectionalLight, HemisphericLight,
        ShadowGenerator, SceneInstrumentation, AbstractMesh,
        SceneOptimizer, SceneOptimizerOptions } from "@babylonjs/core";
import { Vector3 as BJSVector3, Color3 as BJSColor3 } from '@babylonjs/core/Maths';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';

import { Eventing } from '@Eventing/Eventing';
import { TopicEntry } from '@Eventing/TopicEntry';

import { CombineParameters, JSONstringify, ParseThreeTuple } from '@Tools/Utilities';
import { BKeyedCollection } from '@Tools/bTypes.js';
import { Logger } from '@Tools/Logging';

// The camera generates periodic events. This is the parameter block
//    returned with the event.
export const CameraInfoEventTopic = 'Graphics.CameraInfo';
export interface CameraInfoEventProps {
    position: number[];
    rotation: number[];
};
// The renderer generates periodic events. This is the parameter block
//    returned with the event.
export const RenderInfoEventTopic = 'Graphics.RenderInfo';
export interface RenderInfoEventProps {
    fps: number;
    render: {
        calls: number;
        triangles: number;
        points: number;
        lines: number;
        frame: number;
    };
    memory: {
        geometries: number;
        textures: number;
    };
};
export enum GraphicStates {
    Uninitilized = 0,
    Initializing,
    Initialized,
    Rendering,
    Paused,
    ShuttingDown,
    Shutdown,
}
export const GraphicsStateEventName = 'Graphics.State';
export interface GraphicStateEventProps {
    state: GraphicStates;
};

export const Graphics = {
    _container: <HTMLElement>undefined,
    _canvas: <HTMLCanvasElement>undefined,
    _engine: <Engine>undefined,
    _scene: <Scene>undefined,

    _graphicsState: GraphicStates.Uninitilized,

    // Top of trees for world and camera relative objects
    _groupWorldRel: <TransformNode>undefined,
    _groupCameraRel: <TransformNode>undefined,

    _camera:  <TargetCamera>undefined,
    _ambientLight: <Light>undefined,
    _directionalLight: <Light>undefined,

    _sceneInstrumentation: <SceneInstrumentation>undefined,
    frameNum: <number>undefined,
    FPS: <number>undefined,
    _lastFrameDelta: <number>undefined,
    _throttleFPS: <number>undefined,

    _eventEachFrame: <TopicEntry>undefined,

    _eventCameraInfo: <TopicEntry>undefined,
    _eventCameraInfoTimer: <string>undefined,
    _eventDisplayInfo: <TopicEntry>undefined,
    _eventDisplayInfoTimer: <string>undefined,
    _prevCamPosition: <BJSVector3>undefined,

    connectGraphics(pContainer: HTMLElement, pCanvas: HTMLCanvasElement): void {
        Logger.debug('Graphics: constructor');
        Graphics.SetGraphicsState(GraphicStates.Initializing);
        Graphics._container = pContainer;
        Graphics._canvas = pCanvas;

        Graphics._engine = new Engine(pCanvas, true, Config.webgl.renderer.BabylonJS.engineOptions, false);
        Graphics._scene = new Scene(Graphics._engine, Config.webgl.renderer.BabylonJS.sceneOptions);
        // DEBUG DEBUG DEBUG
        // This puts the scene in the external environment so it is easy to find when debugging.
        // @ts-ignore
        window._scene = Graphics._scene;
        // END DEBUG DEBUG DEBUG

        Graphics._initializeCamera();
        Graphics._initializeLights();
        Graphics._initializeEnvironment();

        // keep the camera and environment adjusted for the display size
        Graphics._onContainerResize();  // initial aspect ration computation
        // eslint-disable-next-line @typescript-eslint/unbound-method
        window.addEventListener('resize', Graphics._onContainerResize);

        // Clock used to keep track of frame time and FPS
        Graphics._sceneInstrumentation  = new SceneInstrumentation(Graphics._scene);
        Graphics._sceneInstrumentation.captureFrameTime = true;
        Graphics.frameNum = 0;    // counted once each frame time
        Graphics.FPS = 10;        // an initial value to start computation
        Graphics._throttleFPS = 0; // if zero, no throttling

        // There are several top level groups for objects in different coordinate systems
        Graphics._groupWorldRel = new TransformNode('GroupWorldRel' + Config.basil.UniqueIdBase, Graphics._scene);
        Graphics._groupCameraRel = new TransformNode('GroupCameraRel' + Config.basil.UniqueIdBase, Graphics._scene);

        // BabylonJS has an optimizer
        Graphics._makeOptimizations();

        // Graphics generate a bunch of events so people can display stuff
        Graphics._generateCameraEvents();
        Graphics._generateRendererStatEvents();
        // This is disabled until someone needs it
        // Graphics.eventEachFrame = Eventing.Register('display.eachFrame', 'Graphics');
        Graphics.SetGraphicsState(GraphicStates.Initialized);
    },
    Start() {
        Logger.debug(`Graphics.Start: Start`);
        Graphics._startRendering();
        Graphics.SetGraphicsState(GraphicStates.Rendering);
    },
    SetGraphicsState(pState: GraphicStates) {
        Graphics._graphicsState = pState;
        void Eventing.Fire(GraphicsStateEventName, { state: pState });
    },
    _startRendering() {
        if (Graphics._engine) {
            Graphics._engine.runRenderLoop(() => {
                Graphics.frameNum++;
                Graphics._lastFrameDelta = Graphics._sceneInstrumentation.frameTimeCounter.count;
                Graphics._doAnimation(Graphics._lastFrameDelta);
                Graphics._engine.scenes.forEach((scene) => {
                    scene.render();
                });
            });
        }
    },

    _stopRendering() {
        if (Graphics._engine) {
            Graphics._engine.runRenderLoop(null);
        };
    },

    _doAnimation(delta: number) {
        // look into https://github.com/tweenjs/tween.js
    },

    // Adjust the camera and environment when display size changes
    _onContainerResize() {
        Logger.debug(`Graphics._onContainerResize: width=${Graphics._canvas.clientWidth}, height=${Graphics._canvas.clientHeight}`);
        Graphics._engine.resize();
    },

    _initializeCamera(passedParms?: BKeyedCollection) {
        if (Graphics._camera) {
            return;
        }

        // Set the parameter default values if not specified in the config file
        const parms = <CameraParameters><unknown>CombineParameters(Config.webgl.camera, passedParms, {
            name: 'cameraX',
            camtype: 'arcRotateCamera',
            initialViewDistance: 10,
            initialCameraPosition: [200, 50, 200],
            initialCameraLookAt: [0, 0, 0]
        });

        const initialCameraPosition = BJSVector3.FromArray(parms.initialCameraPosition);
        const lookAt = BJSVector3.FromArray(parms.initialCameraLookAt);
        const camType = parms.camtype;
        if (camType == 'free') {
            Graphics._camera = new FreeCamera(parms.name, initialCameraPosition, Graphics._scene);
            Graphics._camera.setTarget(lookAt);
            Graphics._camera.attachControl(Graphics._canvas, false /*noPreventDefault*/);
            // Ellipsoid around the camera to limit what we can run into
            // Graphics._camera.ellipsiod = new BABYLON.Vector3(1,2,1);
        }
        if (camType == 'universal') {
            // THis camera definition is in the documentation but not the code... odd.
            Graphics._camera = new UniversalCamera(parms.name, initialCameraPosition, Graphics._scene);
            Graphics._camera.setTarget(lookAt);
            Graphics._camera.attachControl(null, false /*noPreventDefault*/);
        }
        if (camType == 'arcRotateCamera') {
            // Graphics._camera = new ArcRotateCamera(parms.name, 0, 0, parms.initialViewDistance, lookAt, Graphics._scene);
            // Graphics._camera.position = BJSVector3.FromArray(parms.initialCameraPosition);
            Graphics._camera = new ArcRotateCamera(parms.name, 0, 0, 10, new BJSVector3(0,0,0), Graphics._scene);
            Graphics._camera.position = new BJSVector3(0,0,20);
            Graphics._camera.attachControl(Graphics._canvas, false /*noPreventDefault*/);
            // GR.camera.checkCollisions = true;
            // Ellipsoid around the camera to limit what we can run into
            // GR.camera.ellipsiod = new BABYLON.Vector3(1,2,1);
        }
        // Logger.debug(`Graphics._initializeCamera: camera at ${JSONstringify(parms.initialCameraPosition)} pointing at ${JSONstringify(parms.initialCameraLookAt)}`);
        Logger.debug(`Graphics._initializeCamera: camera at ${Graphics._camera.position.toString()} pointing at ${Graphics._camera.target.toString()}`);
    },

    _initializeLights(passedParms?: BKeyedCollection) {
        const parms = <LightingParameters><unknown>CombineParameters(Config.webgl.lights, passedParms, undefined);
        if (parms.ambient) {
            const ambient = new HemisphericLight(parms.ambient.name, new BJSVector3(0,1,0), Graphics._scene);
            ambient.intensity = parms.ambient.intensity;
            ambient.specular = Graphics._colorFromValue(parms.ambient.specular);
            ambient.diffuse = Graphics._colorFromValue(parms.ambient.diffuse);
            ambient.groundColor = Graphics._colorFromValue(parms.ambient.groundColor);
            Graphics._ambientLight = ambient;
        }
        if (parms.directional) {
            const directionalLight = new DirectionalLight(parms.directional.name, BJSVector3.FromArray(parms.directional.direction), Graphics._scene);
            directionalLight.intensity = parms.directional.intensity;
            directionalLight.diffuse = Graphics._colorFromValue(parms.directional.color);

            Graphics._directionalLight = directionalLight;

            if (parms.directional.shadows.useShadows) {
                // TODO: Babylonjs wants the meshes added to the generator. Hard to do in a dynamic world
                //     Figure this out.
                // const generator = new ShadowGenerator(1024, Graphics._directionalLight as DirectionalLight);
                // generator.addShadowCaster(Graphics._groupWorldRel);
            }
        }
    },

    // Initialize environmental properties (fog, sky, ...)
    _initializeEnvironment(passedParams?: BKeyedCollection) {
        if (Config.webgl && Config.webgl.fog && Config.webgl.fog.enabled) {
            const parms = CombineParameters(Config.webgl.fog, passedParams, {
                'enabled': false,
                'color': '[230,230,230]',
                'density': 0.00025
            });

            if (parms.enable) {
                Graphics._scene.fogMode = Scene.FOGMODE_EXP2;
                Graphics._scene.fogColor = Graphics._colorFromValue(parms.color as string);
                Graphics._scene.fogDensity = parms.density as number;
            }
        };
    },

    _makeOptimizations() {
        if (Config.webgl.renderer.BabylonJS.optimizations.enable) {
            let opOptions = new SceneOptimizerOptions();
            if (Config.webgl.renderer.BabylonJS.optimizations.moderate) {
                opOptions = SceneOptimizerOptions.ModerateDegradationAllowed();
            }
            else {
                if (Config.webgl.renderer.BabylonJS.optimizations.aggressive) {
                    opOptions = SceneOptimizerOptions.HighDegradationAllowed();
                }
            }
            SceneOptimizer.OptimizeAsync(Graphics._scene, opOptions);
        }
    },

    // Return a ThreeJS color number from an array of color values
    _colorFromValue(pColorValue: number[] | string ): BJSColor3 {
        if (typeof(pColorValue) === 'string') {
            if (pColorValue.startsWith('#')) {
                return new BJSColor3(Number.parseInt('0x' + pColorValue.substring(1)));
            }
            return new BJSColor3(Number.parseInt(pColorValue));
        };
        const val = ParseThreeTuple(pColorValue);
        return new BJSColor3(val[0], val[1], val[2]);
    },

    // Generate subscribable periodic when camera info (position) changes
    _generateCameraEvents() {
        Graphics._eventCameraInfo = Eventing.Register(CameraInfoEventTopic, 'Graphics');
        Graphics._eventCameraInfoTimer = Eventing.CreateTimedEventProcessor( Graphics._eventCameraInfo,
            (topic) => {
                if (Graphics._eventCameraInfo.hasSubscriptions) {
                    if (Graphics._prevCamPosition == undefined) {
                        Graphics._prevCamPosition = new BJSVector3(0,0,0);
                    }
                    const oldPos = Graphics._prevCamPosition;
                    // must clone or 'newPos' will be just a reference to the old value.
                    const newPos = Graphics._camera.position.clone();
                    if (!newPos.equals(oldPos)) {
                        const pos = [0,0,0];
                        Graphics._camera.position.toArray(pos, 0);
                        const rot = [0,0,0,0];
                        Graphics._camera.rotation.toArray(rot, 0);
                        const camInfo: CameraInfoEventProps = {
                            'position': pos,
                            'rotation': rot 
                        };
                        void Graphics._eventCameraInfo.fire(camInfo as unknown as BKeyedCollection);
                        Graphics._prevCamPosition = newPos;
                    };
                };
            }
        );
    },

    // Start the generation of renderer statistic events
    _generateRendererStatEvents() {
        // Generate subscribable periodic events when display info changes
        Graphics._eventDisplayInfo = Eventing.Register(RenderInfoEventTopic, 'Graphics');
        Graphics._eventDisplayInfoTimer = Eventing.CreateTimedEventProcessor(Graphics._eventDisplayInfo,
            (topic) => {
                if (Graphics._eventDisplayInfo.hasSubscriptions) {
                    // not general, but, for the moment, just return the WebGL info
                    const dispInfo = {
                        fps: Graphics._engine.getFps(),
                        render: {
                            calls: Graphics._engine._drawCalls.current,
                            triangles: Math.round(Graphics._scene.totalVerticesPerfCounter.current / 3),
                            points: Graphics._scene.totalVerticesPerfCounter.current,
                            lines: 13,
                            frame: Graphics.frameNum
                        // },
                        // memory: {
                        //     geometries: Graphics._engine.
                        //     textures: 30
                        }
                    };
                    void Graphics._eventDisplayInfo.fire(dispInfo);
                };
            }
        );
    },

    _disposeScene(scene: Scene): void {
        Graphics._scene.dispose();
        Graphics._scene = null;
    },

    addNodeToWorldView(pNode: AbstractMesh): void {
        pNode.parent = Graphics._groupWorldRel;
    },
    addNodeToCameraView(pNode: AbstractMesh): void {
        pNode.parent = Graphics._groupCameraRel;
    }

};
