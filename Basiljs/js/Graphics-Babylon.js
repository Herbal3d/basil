// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

// holds the graphics context for the Babylon implementation
var GR = GR || {};

define([ 'babylonjs', 'Config', 'Eventing', 'GLTFLoader' ],
                        function(BABYLON, Config, Eventing) {

    // Create a Corlor3 from an array of values specified in 'paramName'.
    var paramColor = function(paramName) {
        return new BABYLON.Color3(paramName[0], paramName[1], paramName[2]);
    }
    // Create a Vector3 from an array of values specified in 'paramName'.
    var paramVector = function(paramName) {
        return new BABYLON.Vector3(paramName[0], paramName[1], paramName[2]);
    }

    var op = {
        'Init': function(container, canvas) {
            GR.container = container;
            GR.canvas = canvas;

            GR.engine = new BABYLON.Engine(canvas, true);
            GR.scene = new BABYLON.Scene(GR.engine);

            // DebugLog('Graphics.Init: canvas width=' + canvas.clientWidth + ', height=' + canvas.clientHeight);
            op.internalInitializeCameraAndLights();

            if (Config.webgl.renderer.clearColor) {
                GR.scene.clearColor = BABYLON.Color3.FromArray(Config.webgl.renderer.clearColor, 0);
            }

            /*
            if (Config.webgl.renderer.shadows) {
                GR.renderer.shadowMap.enabled = true;
                GR.renderer.shadowMap.type = THREE.PCFShoftShadowMap;
            }
            */

            op.internalInitializeCameraControl();
            container.addEventListener('resize', op.internalOnContainerResize, false);

            /*
            if (Config.page.showStats) {
                var stat = stats();
                stat.showPanel(0);  // FPS
                // stat.showPanel(1);  // MS rendering
                // stat.showPanel(2);  // MB allocated mem
                stat.dom.style.position = 'absolute';
                stat.dom.style.top = '0%';
                stat.dom.style.right = '0%';
                stat.dom.style.margin = '10px';
                stat.dom.style.zIndex = 100;
                GR.stats = stat;
                container.appendChild(GR.stats.dom);
            }
            */

            // GR.eventEachFrame = Eventing.register('display.eachFrame', 'Graphics');
            GR.eventObjectSelected = Eventing.register('display.objectSelected', 'Graphics');

            // Generate subscribable periodic when camera info (position) changes
            GR.eventCameraInfo = Eventing.register('display.cameraInfo', 'Graphics');
            GR.eventCameraInfo.timer = Eventing.createTimedEventProcessor(GR.eventCameraInfo, function(topic) {
                if (GR.eventCameraInfo.hasSubscriptions) {
                    if (GR.eventCameraInfo.prevCamPosition == undefined) {
                        GR.eventCameraInfo.prevCamPosition = new BABYLON.Vector3(0,0,0);
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
                    dispInfo = {};
                    dispInfo.render = {};
                    dispInfo.render.fps = GR.engine.getFps();
                    dispInfo.render.calls = GR.engine.drawCalls;
                    dispInfo.render.vertices = GR.scene.totalVerticesPerfCounter.current;
                    dispInfo.render.faces = GR.scene.totalActiveIndicesPerfCounter.current / 3;
                    Eventing.fire(GR.eventDisplayInfo, dispInfo);
                }
            });
        },
        'Start': function() {
            op.internalStartRendering();
        },
        'internalStartRendering': function() {
            GR.engine.runRenderLoop(GR.op.internalDoRendering);
        },
        // Do per-frame updates and then render the frame
        'internalDoRendering': function() {
            if (GP.Ready && GR.scene && GR.camera) {
                if (GR.cameraControl) {
                    GR.cameraControl.update();
                }
                if (GR.eventEachFrame) {
                    Eventing.fire(GR.eventEachFrame, {});
                }
                // TODO: insert animation updates (shouldn't this be done before render time?)
                GR.scene.render();
            }
        },
        // Container was resized
        'internalOnContainerResize': function() {
            DebugLog('Graphics: container resize');
            GR.camera.aspect = GR.canvas.clientWidth / GR.canvas.clientHeight;
            GR.camera.updateProjectionMatrix();

            renderer.setSize( GR.canvas.clientWidth, GR.canvas.clientHeight );
        },
        // Remove everything from the scene
        'ClearScene': function() {
            GR.scene.dispose();
            DebugLog('Graphics: cleared scene');
        },
        // Load the passed gltf file into the scene
        'LoadScene': function(url, loaded) {
            try {
                GR.engine.stopRenderLoop();
                // Remove the old scene
                GR.engine.scenes.forEach(scene => {
                    scene.dispose();
                });

                var urlPieces = url.split('/');
                var baseFilename = urlPieces.pop().split('#')[0].split('?')[0];
                var urlDir = urlPieces.join('/');
                urlDir += '/';
                DebugLog('LoadScene: urlDir=' + urlDir + ', baseFilename=' + baseFilename);
                // BABYLON.GLTFFileLoader.HomogeneousCoordinates = true;
                BABYLON.SceneLoader.Load(urlDir, baseFilename, GR.engine, function(newScene) {
                    // For the moment, we're ignoring camera and lights from gltf
                    GR.scene = newScene;
                    op.internalInitializeCameraAndLights();
                    op.internalInitializeCameraControl();
                    DebugLog('Graphics: Loaded scene');
                    loaded();
                });
            }
            catch (e) {
                ReportError('Failed reading GLTF file: ' + e);
            }
        },
        // Given a scene and optional gltf info, create a new scene
        'internalInitializeCameraAndLights': function() {
            var parms = Config.webgl.camera;

            var initialCameraPosition = paramVector(parms.initialCameraPosition);
            var lookAt = paramVector(parms.initialCameraLookAt);
            // trying out the many different camera types in Babylon
            var camType = 'arcRotateCamera';
            if (camType == 'free') {
                GR.camera = new BABYLON.FreeCamera(parms.name, initialCameraPosition, GR.scene);
                GR.camera.setTarget(lookAt);
                GR.camera.attachControl(GR.canvas, false /*noPreventDefault*/);
                GR.camera.checkCollisions = true;
                // Ellipsoid around the camera to limit what we can run into
                GR.camera.ellipsiod = new BABYLON.Vector3(1,2,1);
            }
            if (camType == 'universal') {
                // THis camera definition is in the documentation but not the code... odd.
                GR.camera = new BABYLON.UniversalCamera(parms.name, initialCameraPosition, GR.scene);
                GR.camera.setTarget(lookAt);
                GR.camera.attachControl(GR.canvas, false /*noPreventDefault*/);
            }
            if (camType == 'arcRotateCamera') {
                GR.camera = new BABYLON.ArcRotateCamera(parms.name, 1, 0.8, 10, lookAt, GR.scene);
                GR.camera.setPosition(initialCameraPosition);
                GR.camera.attachControl(GR.canvas, false /*noPreventDefault*/, false /*useCtrlForPanning*/);
                // GR.camera.checkCollisions = true;
                // Ellipsoid around the camera to limit what we can run into
                // GR.camera.ellipsiod = new BABYLON.Vector3(1,2,1);
            }

            if (Config.webgl.lights) {
                parms = Config.webgl.lights;
                if (parms.ambient) {
                    DebugLog('Creating ambient light');
                    var ambient = new BABYLON.HemisphericLight(parms.ambient.name,
                                    new BABYLON.Vector3(0,1,0), GR.scene);
                    ambient.intensity = Number(parms.ambient.intensity);
                    ambient.diffuse = BABYLON.Color3.FromArray(parms.ambient.diffuse, 0);
                    ambient.specular = BABYLON.Color3.FromArray(parms.ambient.specular, 0);
                    ambient.groundColor = BABYLON.Color3.FromArray(parms.ambient.groundColor, 0);

                    GR.ambientLight = ambient;
                }
                if (parms.directional) {
                    DebugLog('Creating directional light');
                    var dirPos = BABYLON.Vector3.FromArray(parms.directional.direction, 0);
                    var dirPosNegNorm = BABYLON.Vector3.Normalize(dirPos).negate();
                    var directional = new BABYLON.DirectionalLight(parms.directional.name, dirPosNegNorm, GR.scene);
                    directional.position = dirPos;
                    directional.diffuse = BABYLON.Color3.FromArray(parms.directional.color, 0);
                    directional.intensity = Number(parms.directional.intensity);

                    GR.directionalLight = directional;

                    if (parms.directional.shadows) {
                        // directional.castShadow = true;
                        // directional.shadow.bias = parms.directional.shadows.bias;
                        // directional.shadow.mapSize.width = parms.directional.shadows.mapWidth;
                        // directional.shadow.mapSize.height = parms.directional.shadows.mapHeight;
                    }
                }
            }
        },
        // Add camera control to the scene.
        'internalInitializeCameraControl': function() {
            // GR.controls = new THREE.OrbitControls(GR.camera, GR.renderer.domElement);
        },
        'GetCameraPosition': function() {
            return GR.camera.position;
        },
        'SetCameraPosition': function(pos) {
            if (Array.isArray(pos)) {
                GR.camera.position = BABYLON.Vector3.FromArray(pos);
            }
            else
                GR.camera.position = pos;
        },
        // Point the camera at a place. Takes either an array or a Vector3.
        'PointCameraAt': function(pos) {
            var look = new BABYLON.Vector3;
            if (Array.isArray(pos)) {
                look = BABYLON.Vector3.FromArray(pos);
            }
            else
                look = pos;
            GR.camera.setTarget(look);
        },
        // Add a test object to the scene
        'AddTestObject': function() {
            var cube = new BABYLON.Mesh.CreateBox('box1', 1, GR.scene);
            cube.position = BABYLON.Vector3.FromArray(Config.webgl.camera.initialCameraLookAt);
            DebugLog('Graphics: added test cube at ' + Config.webgl.camera.initialCameraLookAt);
        },
        'SetDebugMode': function(enable) {
            if (GR.scene.debugLayer) {
                if (GR.scene.debugLayer.isVisible()) {
                    GR.scene.debugLayer.hide();
                }
                else {
                    GR.scene.debugLayer.show();
                }
            }
            else {
                DebugLog('Graphics: no debug layer available');
            }
        },
        'noComma': 0
    };

    GP.GR = GR; // for debugging. Don't use for cross package access.

    GR.op = op;

    return op;
});
