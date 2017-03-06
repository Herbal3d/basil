// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

// holds the graphics context for this threejs instance
var GR = GR || {};

define(['threejs', 'config', 'stats', 'Eventing', 'orbitControl', 'GLTFLoader'],
                            function(THREE, Config, stats, Eventing) {

    var op = {
        'Init': function(container, canvas) {
            GR.container = container;
            GR.canvas = canvas;

            GR.scene = new THREE.Scene();

            // DebugLog('Graphics.Init: canvas width=' + canvas.clientWidth + ', height=' + canvas.clientHeight);
            op.internalInitializeCameraAndLights(GR.scene, GR.canvas);

            var rendererParams = Config.webgl.renderer.params;
            rendererParams.canvas = canvas;
            GR.renderer = new THREE.WebGLRenderer(rendererParams);
            if (Config.webgl.renderer.clearColor) {
                GR.renderer.setClearColor(Number(Config.webgl.renderer.clearColor));
            }
            GR.renderer.setSize( canvas.clientWidth, canvas.clientHeight );

            if (Config.webgl.renderer.shadows) {
                GR.renderer.shadowMap.enabled = true;
                GR.renderer.shadowMap.type = THREE.PCFShoftShadowMap;
            }

            op.internalInitializeCameraControl(GR.scene, GR.container);
            container.addEventListener('resize', op.internalOnContainerResize, false);

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
                    Eventing.fire(GR.eventDisplayInfo, dispInfo);
                }
            });
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
                if (GR.stats) {
                    GR.stats.begin();
                }
                if (GR.cameraControl) {
                    GR.cameraControl.update();
                }
                if (GR.eventEachFrame) {
                    Eventing.fire(GR.eventEachFrame, {});
                }
                // TODO: insert animation updates (shouldn't this be done before render time?)
                if (GR.stats) {
                    GR.stats.end();
                    GR.stats.update();
                }
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
        'LoadGltf': function(url, loaded) {
            try {
                var loader = new THREE.GLTFLoader;
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
            catch (e) {
                ReportError('Failed reading GLTF file: ' + e);
            }
        },
        // Given a scene and optional gltf info, create a new scene
        'internalInitializeCameraAndLights': function(theScene, canvas) {
            GR.camera = new THREE.PerspectiveCamera( 75, canvas.clientWidth / canvas.clientHeight, 1, Config.webgl.camera.initialViewDistance );
            // GR.camera.up = new THREE.Vector3(0, 1, 0);
            GR.camera.position.fromArray(Config.webgl.camera.initialCameraPosition);
            var lookAt = new THREE.Vector3;
            lookAt.fromArray(Config.webgl.camera.initialCameraLookAt);
            GR.camera.lookAt(lookAt);
            if (Config.webgl.camera.addCameraHelper) {
                GR.cameraHelper = new THREE.CameraHelper(GR.camera);
                theScene.add(GR.cameraHelper);
            }
            if (Config.webgl.camera.addAxisHelper) {
                var helperSize = Config.webgl.camera.axisHelperSize || 5;
                GR.axisHelper = new THREE.AxisHelper(Number(helperSize));
                theScene.add(GR.axisHelper);
            }
            theScene.add(GR.camera);

            if (Config.webgl.lights) {
                if (Config.webgl.lights.ambient) {
                    var ambient = new THREE.AmbientLight(Number(Config.webgl.lights.ambient.color),
                                                        Number(Config.webgl.lights.ambient.intensity));
                    theScene.add(ambient);
                }
                if (Config.webgl.lights.directional) {
                    var directional = new THREE.DirectionalLight(Number(Config.webgl.lights.directional.color),
                                                        Number(Config.webgl.lights.directional.intensity));
                    directional.position.fromArray(Config.webgl.lights.directional.position).normalize();
                    GR.directionalLight = directional;
                    if (Config.webgl.lights.directional.shadows) {
                        directional.castShadow = true;
                        directional.shadow.bias = Config.webgl.lights.directional.shadows.bias;
                        directional.shadow.mapSize.width = Config.webgl.lights.directional.shadows.mapWidth;
                        directional.shadow.mapSize.height = Config.webgl.lights.directional.shadows.mapHeight;
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
            GR.camera.position = pos;
        },
        // Point the camera at a place. Takes either an array or a Vector3.
        'PointCameraAt': function(pos) {
            var look = new THREE.Vector3;
            if (pos.isVector3) {
                look = pos;
            }
            else {
                if (pos.isArray()) {
                    look.fromArray(pos);
                }
            }
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
        'noComma': 0
    };

    GP.GR = GR; // for debugging. Don't use for cross package access.

    GR.op = op;

    return op;
});
