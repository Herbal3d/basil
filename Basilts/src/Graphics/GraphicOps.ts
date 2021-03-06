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

import * as THREE from 'three';

import { CoordSystem } from '@Comm/BMessage';
import { Graphics } from '@Graphics/Graphics';

import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { ColladaLoader, Collada } from 'three/examples/jsm/loaders/ColladaLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { BVHLoader, BVH } from 'three/examples/jsm/loaders/BVHLoader';

import { BKeyedCollection, BKeyValue } from '@Tools/bTypes';
import { JSONstringify, CombineParameters, ExtractStringError, ParseThreeTuple } from '@Tools/Utilities';
import { Logger } from '@Tools/Logging';
import { Object3D } from 'three';

// Function to move the camera from where it is to a new place.
// This is movement from external source which could conflict with AR
//     and VR camera control.
export function SetCameraPosition(gPos: string | number[]) {
    // TODO: conversion of gPos to lPos
    const pos = ParseThreeTuple(gPos);
    Graphics._camera.position.fromArray(pos);
    Logger.debug(`Graphics: camera position: [${pos[0]}, ${pos[1]}, ${pos[2]}]`);
};

// Pass position as either THREE.Vector3 or array of three numbers
export function PointCameraAt(gPos: string | number[] ) {
    const lookArray = ParseThreeTuple(gPos);
    const look = new THREE.Vector3(lookArray[0], lookArray[1], lookArray[2]);
    if (Graphics._cameraControl) {
        Graphics._cameraControl.target = look;
        Graphics._cameraControl.update();
    }
    else {
        Graphics._camera.lookAt(look);
    }
    // Move axes helper to where the camera is looking
    if (Graphics._axesHelper) {
        Graphics._axesHelper.geometry.translate(look.x, look.y, look.z);
    }

    Logger.debug(`Graphics: camera looking at: [${look.x}, ${look.y}, ${look.z}]`);
};

// Parameter block passed to LoadSimpleAssets
export interface LoadAssetParams {
    AssetURL: string;       // URL to load from
    AssetLoader: string;    // type of loader to use
    Auth?: string;           // authorization needed to access URL
    useDRACO?: boolean;      // whether to include DRACO compressed image loader
    combineInstances?: boolean;  // whether to combine instances
};

export type ProgressCallback = (pState: string) => void;
export async function LoadSimpleAsset(pProps: BKeyedCollection, pProgressCallback?: ProgressCallback): Promise<THREE.Object3D> {
    const parms = <LoadAssetParams>CombineParameters(Config.assetLoader, pProps, {
        AssetURL: undefined,
        AssetLoader: 'gltf',
        Auth: undefined,
        useDRACO: true,
        combineInstances: true
    });

    let asset: THREE.Object3D = undefined;

    return new Promise<THREE.Object3D>( (resolve, reject) => {

        let loader = undefined;
        switch (parms.AssetLoader.toLowerCase()) {
            case 'gltf':    loader = new GLTFLoader();
                            if (parms.useDRACO) {
                                loader.setDRACOLoader( new DRACOLoader() );
                                // THREE.DRACOLoader.getDecoderModule();
                            }
                            break;
            case 'collada': loader = new ColladaLoader(); break;
            case 'fbx':     loader = new FBXLoader(); break;
            case 'obj':     loader = new OBJLoader(); break;
            case 'bvh':     loader = new BVHLoader(); break;
        };
        if (loader) {
            let requestURL = parms.AssetURL;
            // If auth info is in parameters, add a "bearer-*" item into the access URL
            //     so the receiver can verify the request.
            if (parms.Auth) {
                // Authorization code is packed into the URL
                const urlPieces = parms.AssetURL.split('/');
                const lastIndex = urlPieces.length - 1;
                urlPieces.push(urlPieces[lastIndex]);
                urlPieces[lastIndex] = 'bearer-' + parms.Auth;
                requestURL = urlPieces.join('/');
            }
            Logger.debug(`Graphics.LoadSimpleAsset: loading from: ${requestURL}`);
            // To complicate things, ThreeJS loaders return different things
            loader.load(requestURL, (loaded: GLTF | THREE.Group | BVH | Collada) => {
                // Successful load
                Logger.debug(`Graphics.LoadSimpleAsset: loaded`);
                if (loaded instanceof THREE.Group) {
                    asset = loaded;
                }
                else if (loaded.hasOwnProperty('scene') || loaded.hasOwnProperty('scenes')) {
                    const gltf: GLTF = loaded as GLTF;
                    if (gltf.scene) {
                        asset = gltf.scene;
                    };
                    if (gltf.scenes) {
                        asset = gltf.scenes[0];
                    };
                }
                else if (loaded) {
                    const errMsg = `LoadSimpleAsset: return type not implemented`;
                    Logger.error(errMsg);
                    reject(errMsg);
                };

                if (typeof(asset) === 'undefined') {
                    const err = `Graphics.LoadSimpleAsset: Could not understand loaded contents. type=${parms.AssetLoader},url=${parms.AssetURL}`;
                    reject(err);
                };
                resolve(asset);
            },
            // loading progress
            function(xhr) {
                if (typeof(pProgressCallback) !== 'undefined') {
                    pProgressCallback('Working');
                }
            },
            // Failed load
            function(e) {
                const errMsg = `Graphics.LoadSimpleAsset: loading failed: ${ExtractStringError(e)}`;
                Logger.debug(errMsg);
                reject(errMsg);
            });
        }
        else {
            reject(`No loader for type ${parms.AssetLoader}`);
        };
    });
};

export type DelayedGraphicsOperation = (pProp: BKeyedCollection) => Promise<void>;
interface DelayedGraphicsEntry {
    op: DelayedGraphicsOperation,
    params: BKeyedCollection
};

const _DelayedGraphicsOperations: DelayedGraphicsEntry[] = [];


export function ScheduleDelayedGraphicsOperation(pOp: DelayedGraphicsOperation, pParams: BKeyedCollection): void {
    _DelayedGraphicsOperations.push({
        op: pOp,
        params: pParams
    });
};

export async function ProcessDelayedGraphicsOperations(): Promise<void> {
    while (_DelayedGraphicsOperations.length > 0) {
        Logger.debug(`GraphicsOp.ProcessDelayedGraphicsOperations: doing delayed op`);
        const opEntry = _DelayedGraphicsOperations.shift();
        void opEntry.op(opEntry.params);
    };
};

export interface PlaceInWorldProps {
    Name: string,
    Pos: number[];
    PosCoord: CoordSystem;
    Rot: number[];
    RosCoord: number;
    Object: Object3D;
};
export function PlaceInWorld(pParams: PlaceInWorldProps): Object3D {
    try {
        const worldNode = new THREE.Group();
        worldNode.position.fromArray(pParams.Pos);
        worldNode.quaternion.fromArray(pParams.Rot);
        worldNode.name = pParams.Name;  // usually the holding BItem name
        if (Array.isArray(pParams.Object)) {
            for (const piece of (pParams.Object as Object3D[])) {
                worldNode.add(piece.clone())
            };
        }
        else {
            worldNode.add(pParams.Object.clone());
        };
        if (pParams.PosCoord == CoordSystem.CAMERA) {
            // item is camera relative
            Graphics.addNodeToCameraView(worldNode);
        }
        else {
            // item is world coordinate relative
            Graphics.addNodeToWorldView(worldNode);
        };
        return worldNode;
    }
    catch (e) {
        Logger.error(`Graphics.PlaceInWorld: Exception adding. e=${ExtractStringError(e)}`);
    };
};

// Add a test object to the scene
export function AddTestObject() {
    const geometry = new THREE.BoxGeometry( 1, 2, 3);
    const material = new THREE.MeshBasicMaterial( { color: 0x10cf10 } );
    const cube = new THREE.Mesh(geometry, material);
    cube.position.fromArray(Config.webgl.camera.initialCameraLookAt);
    Graphics.addNodeToWorldView(cube);
    Logger.debug(`Graphics: added test cube at ${Config.webgl.camera.initialCameraLookAt}`);
};
