/**
 * Copyright (c) 2017, Robert Adams
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in
 * the documentation and/or other materials provided with the distribution.
 * 
 * 3. Neither the name of the copyright holder nor the names of its
 * contributors may be used to endorse or promote products derived
 * from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// holds the graphics context for this threejs instance
var GR = GR || {};

define(['threejs'], function(THREE) {
        var operations = {
            'Init': function(container) {
                GP.GR = GR;
                GR.op = operations;

                GR.container = container;

                GR.scene = new THREE.Scene();

                GR.camera = new THREE.PerspectiveCamera( 75, container.innerWidth / container.innerHeight, 1, GP.webgl.camera.initialViewDistance );
                GR.camera.up = new THREE.Vector3(0, 1, 0);
                GR.camera.position.fromArray(GP.webgl.camera.initialCameraPosition);
                var lookAt = new THREE.Vector3;
                lookAt.fromArray(GP.webgl.camera.initialCameraLookAt);
                GR.camera.lookAt(lookAt);
                GR.scene.add(GR.camera);

                if (GP.webgl.lights) {
                    if (GP.webgl.lights.ambient) {
                        var ambient = new THREE.AmbientLight(GP.webgl.lights.ambient.color,
                                                            GP.webgl.lights.ambient.intensity);
                        GR.scene.add(ambient);
                    }
                    if (GP.webgl.lights.directional) {
                        var directional = new THREE.DirectionalLight(GP.webgl.lights.directional.color,
                                                            GP.webgl.lights.directional.intensity);
                        directional.position.fromArray(GP.webgl.lights.directional.position).normalize();
                        GR.directionalLight = directional;
                        if (GP.webgl.lights.directional.shadows) {
                            directional.castShadow = true;
                            directional.shadow.bias = GP.webgl.lights.directional.shadows.bias;
                            directional.shadow.mapSize.width = GP.webgl.lights.directional.shadows.mapWidth;
                            directional.shadow.mapSize.height = GP.webgl.lights.directional.shadows.mapHeight;
                        }
                        GR.scene.add(directional);
                    }
                }

                GR.renderer = new THREE.WebGLRenderer(GP.webgl.renderer.params);
                if (GP.webgl.renderer.clearColor) {
                    GR.renderer.setClearColor(GP.webgl.renderer.clearColor);
                }
                GR.renderer.setSize( container.offsetWidth, container.offsetWidth );

                if (GP.webgl.renderer.shadows) {
                    GR.renderer.shadowMap.enabled = true;
                    GR.renderer.shadowMap.type = THREE.PCFShoftShadowMap;
                }

                container.appendChild( GR.renderer.domElement );
                container.addEventListener('resize', GR.op.OnContainerResize, false);
            },
            'Start': function() {
                var keepRendering = function() {
                    requestAnimationFrame(keepRendering);
                    GR.op.DoRender();
                };
                keepRendering();
            },
            // Do per-frame updates and then render the frame
            'DoRender': function() {
                if (GR.cameraControl) {
                    GR.cameraControl.update();
                }
                // TODO: insert animation updates (shouldn't this be done before render time?)
                GR.renderer.render(GR.scene, GR.camera);
            },
            'OnContainerResize': function() {
                GR.camera.aspect = GR.container.innerWidth / GR.container.innerHeight;
                GR.camera.updateProjectionMatrix();

                renderer.setSize( GR.container.innerWidth, GR.container.innerHeight );
            },
            'noComma': 0
        };

        return operations;
    }
);

