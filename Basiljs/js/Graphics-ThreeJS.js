// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

// holds the graphics context for this threejs instance
// Generates Events:
//      display.objectSelected
//      display.cameraInfo
//      display.info
var GR = GR || {};

define(['threejs', 'Config', 'Eventing', 'orbitControl', 'GLTFLoader' ],
                    function(THREE, Config, Eventing) {

    // return a ThreeJS color number from an array of color values
    var colorFromArray = function(colorArr) {
        return new THREE.Color(colorArr[0], colorArr[1], colorArr[2]);
        /*
        return colorArr[0] * 255 * 65536
            + colorArr[1] * 255 * 256
            + colorArr[2] * 255;
            */
    }

    var op = {
        'Init': function(container, canvas) {
            GR.container = container;
            GR.canvas = canvas;

            GR.scene = new THREE.Scene();

            // DebugLog('Graphics.Init: canvas width=' + canvas.clientWidth + ', height=' + canvas.clientHeight);
            op.internalInitializeCameraAndLights(GR.scene, GR.canvas);

            var rendererParams = Config.webgl.renderer.ThreeJSparams;
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

            op.internalInitializeCameraControl(GR.scene, GR.container);
            container.addEventListener('resize', op.internalOnContainerResize, false);

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
        },
        'Start': function() {
            if (!GR.runLoopIdentifier) {
                op.internalStartRendering();
            }
        },
        'internalStartRendering': function() {
            var keepRendering = function() {
                GR.runLoopIdentifier = requestAnimationFrame(keepRendering);
                GR.op.internalDoRendering();
            };
            keepRendering();
        },
        // Do per-frame updates and then render the frame
        'internalDoRendering': function() {
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
            if (GR.runLoopIdentifier) {
                cancelAnimationFrame(GR.runLoopIdentifier);
                DebugLog('Graphics: canelling runLoop');
            }
            GR.runLoopIdentifier = undefined;

            // http://stackoverflow.com/questions/29417374/threejs-remove-all-together-object-from-scene
            for (let ii= GR.scene.children.length-1; ii >= 0; ii--) {
                GR.scene.remove(GR.scene.children[ii]);
            }
            DebugLog('Graphics: cleared scene');
            // GR.scene = undefined;
        },
        // Load the passed gltf file into the scene
        'LoadScene': function(url, loaded) {
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
                        op.internalInitializeCameraAndLights(theScene, GR.canvas);
                        op.internalInitializeCameraControl(theScene, GR.container);
                        DebugLog('Graphics: Loaded GLTF scene');
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
        },
        // Given a scene and optional gltf info, create a new scene
        'internalInitializeCameraAndLights': function(theScene, canvas) {
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
        },
        // Add camera control to the scene.
        'internalInitializeCameraControl': function(theScene, container) {
            GR.controls = new THREE.OrbitControls(GR.camera, GR.renderer.domElement);
        },
        'GetCameraPosition': function() {
            return GR.camera.position;
        },
        'SetCameraPosition': function(pos) {
            var newPos = new THREE.Vector3;
            if (Array.isArray(pos)) {
                newPos.fromArray(pos);
            }
            else
                newPos = pos;
            GR.camera.position = pos;
        },
        // Point the camera at a place. Takes either an array or a Vector3.
        'PointCameraAt': function(pos) {
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
        },
        // Add a test object to the scene
        'AddTestObject': function() {
            var geometry = new THREE.BoxGeometry( 1, 2, 3);
            var material = new THREE.MeshBasicMaterial( { color: 0x10cf10 } );
            var cube = new THREE.Mesh(geometry, material);
            cube.position.fromArray(Config.webgl.camera.initialCameraLookAt);
            GR.scene.add(cube);
            DebugLog('Graphics: added test cube at ' + Config.webgl.camera.initialCameraLookAt);
        },
        'SetDebugMode': function(enable) {
        },
        'noComma': 0
    };

    GP.GR = GR; // for debugging. Don't use for cross package access.

    GR.op = op;

    return op;
});
