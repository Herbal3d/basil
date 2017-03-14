// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

// Template for graphics routines.
// Both 'Graphics-Threejs' and 'Graphics-Babylon' implement all the functions.
// The idea is that this will evolve into the Basil interface as the operations
//    needed for the graphics sub-system is experimented with.

// Generates Events:
//      display.objectSelected => function(topic, xxx)
//      display.cameraInfo => function(topic, camInfo)
//      display.info => function(topic, dispInfo)


var GR = GR || {};

define(['Graphics', 'Config', 'Eventing'],
                            function(Graphics, Config, Eventing) {

    var op = {
        // Initialize graphics sub-system using passed 'canvas' DOM object
        //     that is contained in the 'container' DOM object.
        'Init': function(container, canvas) {
            GR.container = container;
            GR.canvas = canvas;

            GR.scene = new THREE.Scene();

            op.internalInitializeCameraAndLights(GR.scene, GR.canvas);

            op.internalInitializeCameraControl(GR.scene, GR.container);
            container.addEventListener('resize', op.internalOnContainerResize, false);

            // GR.eventEachFrame = Eventing.register('display.eachFrame', 'Graphics');
            GR.eventObjectSelected = Eventing.register('display.objectSelected', 'Graphics');

            // Generate subscribable periodic when camera info (position) changes
            GR.eventCameraInfo = Eventing.register('display.cameraInfo', 'Graphics');

            // Generate subscribable periodic events when display info changes
            GR.eventDisplayInfo = Eventing.register('display.info', 'Graphics');
            // Returns a 'params' object that contains:
            //   params.render.fps        number of frames per socond rendered
            //   params.render.calls      number of draw calls
            //   params.render.vertices   number of vertices in scene
            //   params.render.faces      number of faces in scene
            //   params.memory.texture      memory used for textures
            //   params.memory.geometries   memory used for meshes, etc
        },
        // Everything is ready so start rendering.
        'Start': function() {
            if (!GR.runLoopIdentifier) {
                op.internalStartRendering();
            }
        },
        // Remove all the objects from the scene
        'ClearScene': function() {
        },
        // Load the passed gltf file into the scene
        'LoadScene': function(url, loadedFunction) {
        },
        // Return the position that the camera is at
        'GetCameraPosition': function() {
            return GR.camera.position;
        },
        'SetCameraPosition': function(pos) {
            GR.camera.position = pos;
        },
        // Point the camera at a place. Takes either an array or a Vector3.
        'PointCameraAt': function(pos) {
        },
        // Add a test object to the scene
        'AddTestObject': function() {
        },
        // Do anything special that the graphics system has for debugging
        // Pass 'true' if to enable. 'false' if to disable.
        'SetDebugMode': function(enable) {
        },
        'noComma': 0
    };

    GP.GR = GR; // for debugging. Don't use for cross package access.

    GR.op = op;

    return op;
});
