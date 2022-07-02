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

import { Config, AmbientLightingParameters, DirectionalLightingParameters, CameraParameters } from '@Base/Config';

// import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { ActionManager, Camera, Engine, Scene, SceneInstrumentation, SceneOptimizer, SceneOptimizerOptions } from "@babylonjs/core";
import { Light, DirectionalLight, HemisphericLight, ShadowGenerator } from "@babylonjs/core";
import { TargetCamera, TransformNode, MeshBuilder, AbstractMesh, Mesh  } from "@babylonjs/core";
import { StandardMaterial, Texture, CubeTexture } from '@babylonjs/core';
import { SkyMaterial } from '@babylonjs/materials';
import { Vector3 as BJSVector3, Color3 as BJSColor3, Quaternion as BJSQuaternion} from '@babylonjs/core/Maths';
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
import { FollowCamera } from '@babylonjs/core/Cameras/followCamera';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Observer, EventState } from '@babylonjs/core/Misc/observable';

import { GraphicsInfo } from '@Graphics/GraphicsInfo';
import { Eventing  } from '@Eventing/Eventing';
import { EventProcessor, SubscriptionEntry } from '@Base/Eventing/SubscriptionEntry';
import { TopicEntry } from '@Eventing/TopicEntry';

import { CombineParameters, JSONstringify, ParseThreeTuple } from '@Tools/Utilities';
import { BKeyedCollection } from '@Tools/bTypes.js';
import { Logger } from '@Tools/Logging';
import { timeStamp } from 'console';

export enum GraphicStates {
    Uninitilized = 0,
    Initializing,
    Initialized,
    Rendering,
    Paused,
    ShuttingDown,
    Shutdown,
}
// Event topic name for before frame render events
export const GraphicsBeforeFrameTopic = 'Graphics.BeforeFrame';
export interface GraphicsBeforeFrameProps {
    scene: Scene,           // handle to the scene
    eventState: EventState, // Babylonjs event information
    delta?: number          // seconds since last frame event
}

// Event topic name for Graphic state changes
export const GraphicsStateChangeTopic = 'Graphics.State';
export interface GraphicsStateChangeProps {
    state: GraphicStates;
};

// Code for manipulating the Graphics subsystem.
// Holds initialization and state changing control.
export const Graphics = {
    _container: <HTMLElement>undefined,
    _canvas: <HTMLCanvasElement>undefined,
    _engine: <Engine>undefined,
    _scene: <Scene>undefined,
    _skybox: <Mesh>undefined,

    // Graphics engine can be running or paused
    _graphicsState: GraphicStates.Uninitilized,

    // Top of trees for world and camera relative objects
    _groupWorldRel: <TransformNode>undefined,
    _groupCameraRel: <TransformNode>undefined,

    _camera:  <TargetCamera>undefined,
    _ambientLight: <Light>undefined,
    _directionalLight: <DirectionalLight>undefined,

    // ms of last frame rendering
    _lastFrameDelta: <number>undefined,

    // Topic for events generated each frame
    _eventEachFrame: <TopicEntry>undefined,

    // Initalize and setup the graphics engine
    connectGraphics(pContainer: HTMLElement, pCanvas: HTMLCanvasElement): void {
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

        Graphics._scene.useRightHandedSystem = true;

        // Add ActionManager for events in the scene
        Graphics._scene.actionManager = new ActionManager(Graphics._scene);

        Graphics._initializeCamera();
        Graphics._initializeLights();
        Graphics._initializeEnvironment();

        // keep the camera and environment adjusted for the display size
        Graphics._onContainerResize();  // initial aspect ration computation
        // eslint-disable-next-line @typescript-eslint/unbound-method
        window.addEventListener('resize', Graphics._onContainerResize);

        // There are several top level groups for objects in different coordinate systems
        Graphics._groupWorldRel = new TransformNode('GroupWorldRel' + Config.basil.UniqueIdBase, Graphics._scene);
        Graphics._groupCameraRel = new TransformNode('GroupCameraRel' + Config.basil.UniqueIdBase, Graphics._scene);

        // BabylonJS has an optimizer
        Graphics._makeOptimizations();

        // Graphics generate a bunch of events so people can display stuff
        GraphicsInfo.SetupCameraInfoEvents();
        GraphicsInfo.SetupRendererStatEvents();

        // This is disabled until someone needs it
        // Graphics.eventEachFrame = Eventing.Register('display.eachFrame', 'Graphics');
        Graphics.SetGraphicsState(GraphicStates.Initialized);
    },
    // After initialization, Graphics can be started or paused
    Start() {
        // Logger.debug(`Graphics.Start: Start`);
        Graphics._startRendering();
        Graphics.SetGraphicsState(GraphicStates.Rendering);
    },
    IsActive(): boolean {
        return Graphics._graphicsState === GraphicStates.Initialized
            || Graphics._graphicsState === GraphicStates.Rendering;
    },
    GetGraphicsState(): GraphicStates {
        return Graphics._graphicsState;
    },
    SetGraphicsState(pState: GraphicStates) {
        Graphics._graphicsState = pState;
        void Eventing.Fire(GraphicsStateChangeTopic, { state: pState });
    },
    WatchGraphicsStateChange(pProcessor: EventProcessor): SubscriptionEntry {
        return Eventing.Subscribe(GraphicsStateChangeTopic, pProcessor);
    },
    // Call EventProcessor before each frame. Wrap BabylonJS Observer with Eventing
    //      so all callbacks look the same.
    _beforeFrameObserver: <Observer<Scene>>undefined,
    _beforeFrameTopic: <TopicEntry>undefined,
    _timeOfLastBeforeFrame: <Date>undefined,
    WatchBeforeFrame(pProcessor: EventProcessor): SubscriptionEntry {
        if (Graphics._beforeFrameObserver === undefined) {
            // Create the Observer when the first one asks to watch
            Graphics._beforeFrameTopic = Eventing.Register(GraphicsBeforeFrameTopic, 'Graphics');
            Graphics._beforeFrameObserver = Graphics._scene.onBeforeRenderObservable.add(
                (eventData: Scene, eventState: EventState): void => {
                    if (Graphics._timeOfLastBeforeFrame === undefined) {
                        Graphics._timeOfLastBeforeFrame = new Date();
                    };
                    const now = new Date();
                    const deltaTime = (now.getTime() - Graphics._timeOfLastBeforeFrame.getTime()) / 1000;
                    Graphics._timeOfLastBeforeFrame = now;
                    void Graphics._beforeFrameTopic.fire({
                        scene: eventData,
                        eventState: EventState,
                        delta: deltaTime
                    });
            });
        }
        return Eventing.Subscribe(GraphicsBeforeFrameTopic, pProcessor);
    },
    _startRendering() {
        if (Graphics._engine) {
            Graphics._engine.runRenderLoop(() => {
                Graphics._lastFrameDelta = GraphicsInfo.UpdateFrameInfo();
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
        // look into https://github.com/tweenjs/tween.js or similar per-frame animation engines
    },

    // Adjust the camera and environment when display size changes
    _onContainerResize() {
        // Logger.debug(`Graphics._onContainerResize: width=${Graphics._canvas.clientWidth}, height=${Graphics._canvas.clientHeight}`);
        // Graphics._engine.resize();
        Graphics._engine.setSize(Graphics._canvas.clientWidth, Graphics._canvas.clientHeight);
    },

    // Get and activate a camera of a specific type.
    // If the type has been allocated before, reused the previously allocated one.
    // Parameter are passed in he param block
    _cameraUniversal: <UniversalCamera>undefined,
    _cameraFollow: <FollowCamera>undefined,
    _cameraArcRotate: <ArcRotateCamera>undefined,
    activateCamera(passedParms?: BKeyedCollection): Camera {
        // Set the parameter default values if not specified in the config file
        const parms = CombineParameters(Config.webgl.camera, passedParms, {
            name: 'cameraX',
            camtype: 'universal',
            position: [200, 50, 200],
            // rotationQuaternion: [0, 0, 0, 1], // rotation is not set if not passed
            target: [0, 0, 0],
            // for 'follow' camera
            heightOffset: 8,
            radius: 1,
            rotationOffset: 0,
            cameraAcceleration: 0.005,
            maxCameraSpeed: 10,
            // for 'arcRotateCamera'
            viewDistance: 10
        });

        const pos = BJSVector3.FromArray(<number[]>parms['position']);
        const pRot = <number[]>parms['rotationQuaterion'];
        const rot = pRot ? new BJSQuaternion(pRot[0], pRot[1], pRot[2], pRot[3]) : undefined;
        const lookAt = BJSVector3.FromArray(<number[]>parms['target']);
        const camType = (<string>parms['camtype']).toLowerCase();

        Logger.debug(`Graphics.activateCamera: activating ${camType} named ${parms.name}`);
        switch (camType) {
            case 'universal': {
                const cam = Graphics._cameraUniversal ?? new UniversalCamera(<string>parms.name, pos, Graphics._scene);
                cam.position            = pos;
                if (rot) cam.rotationQuaternion  = rot;
                Graphics._camera = cam;
                Graphics._cameraUniversal = cam;
                break;

            }
            case 'follow': {
                const cam = Graphics._cameraFollow
                                    ?? new FollowCamera(<string>parms['name'],
                                        pos,
                                        Graphics._scene);
                cam.position            = pos;
                if (rot) cam.rotationQuaternion  = rot;
                cam.heightOffset        = <number>parms['heightOffset'];
                cam.radius              = <number>parms['radius'];
                cam.rotationOffset      = <number>parms['rotationOffset'];
                cam.cameraAcceleration  = <number>parms['cameraAcceleration'];
                cam.maxCameraSpeed      = <number>parms['maxCameraSpeed'];
                cam.lockedTarget        = <AbstractMesh>parms['target'];
                Graphics._camera = cam;
                Graphics._cameraFollow = cam;
                break;

            }
            case 'arcRotateCamera': {
                const cam = Graphics._cameraArcRotate
                                    ?? new ArcRotateCamera(<string>parms['name'],
                                        0 /* alpha angle */,
                                        0 /* beta angle */,
                                        <number>parms['viewDistance>'],
                                        lookAt,
                                        Graphics._scene);
                cam.position            = pos;
                if (rot) cam.rotationQuaternion  = rot;
                Graphics._camera = cam;
                Graphics._cameraArcRotate = cam;
                break;

            }
            default: {
                Logger.error(`Graphics.activateCamera: unknown camera type ${camType}`);
                break;
            }

        }
        Graphics._camera.attachControl();
        Graphics._scene.activeCamera = Graphics._camera;
        return Graphics._camera;
    },
    releaseCamera(): void {
        if (!Graphics._camera) {
            return;
        }
        Graphics._camera.detachControl();
    },
    // Initialize the camera
    // Camera can be different types depending on whether Basil is being used as a content viewer
    //    (just displaying and object) or a virtual world presenece viewer (displaying avatar view).
    _initializeCamera(passedParms?: BKeyedCollection) {
        if (Graphics._camera) {
            return;
        }

        // Set the parameter default values if not specified in the config file
        const parms = <CameraParameters><unknown>CombineParameters(Config.webgl.camera, passedParms, {
            name: 'cameraX',
            initialCameraPosition: [200, 50, 200],
            initialCameraLookAt: [0, 0, 0]
        });

        const initialCameraPosition = BJSVector3.FromArray(parms.initialCameraPosition);
        const lookAt = BJSVector3.FromArray(parms.initialCameraLookAt);

        // The scene needs a camera while waiting for any client
        const cam = new UniversalCamera(parms.name, initialCameraPosition, Graphics._scene);
        cam.minZ = 0.1;
        cam.speed = 0.02;
        cam.setTarget(lookAt);
        cam.attachControl(null, false);
        Graphics._camera = cam;

        // Logger.debug(`Graphics._initializeCamera: camera at ${JSONstringify(parms.initialCameraPosition)} pointing at ${JSONstringify(parms.initialCameraLookAt)}`);
        // Logger.debug(`Graphics._initializeCamera: camera at ${Graphics._camera.position.toString()} pointing at ${Graphics._camera.target.toString()}`);
    },

    // At the moment, make things visible.
    // TODO: enable general environmental setup from the SpaceServer
    _initializeLights() {
        if (Config.webgl.lights.ambient) {
            const parms = <AmbientLightingParameters>Config.webgl.lights.ambient;
            const ambient = new HemisphericLight(parms.name, new BJSVector3(0,1,0), Graphics._scene);
            ambient.intensity = parms.intensity;
            ambient.specular = Graphics._colorFromValue(ParseThreeTuple(parms.specular));
            ambient.diffuse = Graphics._colorFromValue(ParseThreeTuple(parms.diffuse));
            ambient.groundColor = Graphics._colorFromValue(ParseThreeTuple(parms.groundColor));
            Graphics._ambientLight = ambient;
        }
        if (Config.webgl.lights.directional) {
            const parms = <DirectionalLightingParameters>Config.webgl.lights.directional;
            const directionalLight = new DirectionalLight(parms.name,
                        BJSVector3.FromArray(ParseThreeTuple(parms.direction)), Graphics._scene);
            directionalLight.intensity = parms.intensity;
            directionalLight.diffuse = Graphics._colorFromValue(ParseThreeTuple(parms.color));

            Graphics._directionalLight = directionalLight;

            if (Config.webgl.lights.directional.shadows.useShadows) {
                // TODO: Babylonjs wants the meshes added to the generator. Hard to do in a dynamic world
                //     Figure this out.
                // const generator = new ShadowGenerator(1024, Graphics._directionalLight);
                // const generator = new CascadedShadowGenerator(1024, Graphics._directionalLight);
                // generator.addShadowCaster(Graphics._groupWorldRel);
            }
        }
    },

    // TODO: enable general environmental setup from the SpaceServer
    _initializeEnvironment() {
        Graphics._skybox = MeshBuilder.CreateBox('skybox', { size: 1000 }, Graphics._scene);
        if (Config.webgl.renderer.BabylonJS.environment.skyMaterial.enable) {
            const skyMaterial = new SkyMaterial('skyMaterial', Graphics._scene);
            skyMaterial.backFaceCulling = false;
            skyMaterial.turbidity = Config.webgl.renderer.BabylonJS.environment.skyMaterial.turbidity;
            skyMaterial.luminance = Config.webgl.renderer.BabylonJS.environment.skyMaterial.luminance;
            skyMaterial.rayleigh = Config.webgl.renderer.BabylonJS.environment.skyMaterial.rayleigh;
            skyMaterial.inclination = Config.webgl.renderer.BabylonJS.environment.skyMaterial.inclination;
            skyMaterial.azimuth = Config.webgl.renderer.BabylonJS.environment.skyMaterial.azimuth;
            Graphics._skybox.material = skyMaterial;
        }
        else {
            const skyboxMaterial = new StandardMaterial("skyBox", Graphics._scene);
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.reflectionTexture = new CubeTexture("textures/skybox", Graphics._scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
            skyboxMaterial.diffuseColor = new BJSColor3(0, 0, 0);
            skyboxMaterial.specularColor = new BJSColor3(0, 0, 0);
            Graphics._skybox.material = skyboxMaterial;
        }

        if (Config.webgl && Config.webgl.fog && Config.webgl.fog.enabled) {
            const parms = CombineParameters(Config.webgl.fog, undefined, {
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
    GetSkybox(): Mesh {
        return Graphics._skybox;
    },

    // Called at initialization time to setup the engine optimization settings
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
