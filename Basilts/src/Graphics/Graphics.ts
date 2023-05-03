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

import { Config, AmbientLightingParameters, DirectionalLightingParameters, ConfigGetQueryVariable } from '@Base/Config';

// import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { ActionManager, AssetContainer, Camera, Engine, Scene, SceneInstrumentation, SceneOptimizer, SceneOptimizerOptions } from "@babylonjs/core";
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
import { Object3D } from './Object3d';
import { FromPlanetCoord, FromPlanetRot } from '@Base/Tools/Coords';

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
        Logger.debug(`Graphics.SetGraphicsState: new state ${GraphicStates[pState]}`);
        void Eventing.Fire(GraphicsStateChangeTopic, { state: pState });
    },
    // Watch graphics state changes. Note that this does an initial state change event
    WatchGraphicsStateChange(pProcessor: EventProcessor): SubscriptionEntry {
        const sub = Eventing.Subscribe(GraphicsStateChangeTopic, pProcessor);
        void sub.fire({ state: Graphics._graphicsState });
        return sub;
    },
    // Call EventProcessor before each frame. Wrap BabylonJS Observer with Eventing
    //      so all callbacks look the same.
    _beforeFrameObserver: <Observer<Scene>>undefined,
    _beforeFrameTopic: <TopicEntry>undefined,
    _timeOfLastBeforeFrame: 0,
    WatchBeforeFrame(pProcessor: EventProcessor): SubscriptionEntry {
        if (Graphics._beforeFrameObserver === undefined) {
            // Create the Observer when the first one asks to watch
            Graphics._beforeFrameTopic = Eventing.Register(GraphicsBeforeFrameTopic, 'Graphics');
            Graphics._beforeFrameObserver = Graphics._scene.onBeforeRenderObservable.add(
                (eventData: Scene, eventState: EventState): void => {
                    const now = Date.now();
                    const deltaTime = (now - Graphics._timeOfLastBeforeFrame) / 1000;
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

    // activateUniversalCamera(pName: string, pPos: number[], pRot: number[], pTarget: number[], pAttachControl: boolean) {
    activateUniversalCamera(pPassedParms: BKeyedCollection): Camera {
        interface activateUniversalCameraParms {
            name: string;
            position: number[];
            rotationQ?: number[];
            cameraSpeed: number;
            cameraMinZ: number;
            cameraMaxZ: number;
            target?: number[];      // target is a point
            attachControl?: boolean;
        }
        const parms = CombineParameters(undefined, pPassedParms, {
            name: 'cameraX',
            position: Config.webgl.camera.position,
            rotationQ: undefined,
            cameraSpeed: Config.webgl.camera.maxCameraSpeed,
            cameraAcceleration: Config.webgl.camera.cameraAcceleration,
            cameraMinZ: Config.webgl.camera.cameraMinZ,
            cameraMaxZ: Config.webgl.camera.cameraMaxZ,
            target: undefined,
            attachControl: false
        }) as unknown as activateUniversalCameraParms;

        const pos = FromPlanetCoord(undefined, parms.position);

        const cam = Graphics._cameraUniversal ?? new UniversalCamera(parms.name, pos, Graphics._scene);

        cam.speed = parms.cameraSpeed;
        cam.minZ = parms.cameraMinZ;
        cam.maxZ = parms.cameraMaxZ;
        if (parms.rotationQ) {
            const rot = FromPlanetRot(undefined, parms.rotationQ);
            cam.rotationQuaternion = rot;
        }
        if (parms.target) {
            cam.lockedTarget = FromPlanetCoord(undefined, parms.target);
        }

        Graphics._cameraUniversal = cam;
        return Graphics.setActiveCamera(cam, parms.attachControl);
    },
    activateArcRotateCamera(pPassedParms: BKeyedCollection): Camera {
        interface activateArcRotateCameraParms {
            name: string;
            position: number[];
            rotationQ?: number[];
            alpha: number;
            beta: number;
            viewDistance: number;
            target: number[];   // target is a point
            attachControl?: boolean;
        }
        const parms = CombineParameters(undefined, pPassedParms, {
            name: 'cameraX',
            position: Config.webgl.camera.position,
            rotationQ: undefined,
            alpha: 0,
            beta: 0,
            viewDistance: Config.world.viewDistance,
            target: [0, 0, 0],
            attachControl: true
        }) as unknown as activateArcRotateCameraParms;

        const pos = FromPlanetCoord(undefined, parms.position);
        const lookAt = FromPlanetCoord(undefined, parms.target);

        const cam = Graphics._cameraArcRotate
                            ?? new ArcRotateCamera(parms.name,
                                parms.alpha,    /* alpha angle */
                                parms.beta,     /* beta angle */
                                parms.viewDistance,
                                lookAt,
                                Graphics._scene);

        cam.position = pos;

        if (parms.rotationQ) {
            cam.rotationQuaternion  = FromPlanetRot(undefined, parms.rotationQ);
        }

        Graphics._cameraArcRotate = cam;
        return Graphics.setActiveCamera(cam, parms.attachControl);

    },
    activateFollowCamera(pPassedParms: BKeyedCollection): Camera {
        interface activateFollowCameraParms {
            name: string;
            position: number[];
            radius: number;
            heightOffset: number;
            rotationalOffset: number;
            cameraAcceleration: number;
            maxCameraSpeed: number;
            target: Object3D;   // target is a mesh
            attachControl: boolean;
        }
        const parms = CombineParameters(undefined, pPassedParms, {
            name: 'cameraX',
            position: undefined,
            radius: Config.world.thirdPersonDisplacement[1],
            heightOffset: -Config.world.thirdPersonDisplacement[2],
            rotationalOffset: 0,
            cameraAcceleration: Config.webgl.camera.cameraAcceleration,
            maxCameraSpeed: Config.webgl.camera.maxCameraSpeed,
            cameraMinZ: Config.webgl.camera.cameraMinZ,
            cameraMaxZ: Config.webgl.camera.cameraMaxZ,
            target: undefined,
            attachControl: true
        }) as unknown as activateFollowCameraParms;

        const pos = FromPlanetCoord(undefined, parms.position);

        const cam = Graphics._cameraFollow
                            ?? new FollowCamera(
                                parms.name,
                                pos,
                                Graphics._scene);

        cam.radius = parms.radius;
        cam.heightOffset = parms.heightOffset;
        cam.rotationOffset = parms.rotationalOffset;
        cam.cameraAcceleration = parms.cameraAcceleration;
        cam.maxCameraSpeed = parms.maxCameraSpeed;

        if (parms.target && parms.target.mesh) {
            cam.lockedTarget = parms.target.mesh;
        }
        else {
            cam.target = FromPlanetCoord(undefined, Config.webgl.camera.target);
        }

        Graphics._cameraFollow = cam;
        return Graphics.setActiveCamera(cam, parms.attachControl);

    },
    setActiveCamera(pCam: TargetCamera, pAttach: boolean): Camera {
        Graphics._camera = pCam;
        if (pAttach) Graphics._camera.attachControl();
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
        const parms = CombineParameters(Config.webgl.camera, passedParms, {
            attachControl: false
        });

        Graphics.activateUniversalCamera(parms);

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
    },

    // Object3d can be made up of a container with a root node
    // The containerness is important since the root node can't be parented
    //    so removing this collection has to de-parent the root node.
    addObject3dToWorldView(pObject: Object3D): void {
        pObject.mesh.parent = Graphics._groupWorldRel;
    }

};
