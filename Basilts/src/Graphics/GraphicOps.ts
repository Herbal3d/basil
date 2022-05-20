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

import { Config, AmbientLightingParameters } from '@Base/Config';

import { Mesh, ISceneLoaderProgressEvent } from '@babylonjs/core';
import { KeyboardEventTypes, KeyboardInfo, IKeyboardEvent } from '@babylonjs/core';
import { VertexBuffer, BoundingInfo } from '@babylonjs/core';
import { SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import '@babylonjs/loaders/OBJ';
import '@babylonjs/loaders/STL';
import { Vector3 as BJSVector3, Color3 as BJSColor3 } from '@babylonjs/core/Maths';

import { Graphics } from '@Graphics/Graphics';
import { Object3D } from '@Graphics/Object3d';
import { CoordSystem } from '@Comm/BMessage';

import { BKeyedCollection, BKeyValue } from '@Tools/bTypes';
import { JSONstringify, CombineParameters, ExtractStringError, ParseThreeTuple } from '@Tools/Utilities';
import { Logger } from '@Tools/Logging';
import { minmaxReduxPixelShader } from '@babylonjs/core/Shaders/minmaxRedux.fragment';

// Collection of graphical operations.
// Externally, code doesn't know how graphics is implemented and this presents the functions
//    that the rest of the code operates on the graphical system.

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
    const look = ParseThreeTuple(gPos); 
    Graphics._camera.target = BJSVector3.FromArray(look);
    Logger.debug(`Graphics: camera looking at: [${look[0]}, ${look[1]}, ${look[2]}`);
};

// Parameter block passed to LoadSimpleAssets
export interface LoadAssetParams {
    AssetURL: string;       // URL to load from
    AssetLoader: string;    // type of loader to use
    Auth?: string;           // authorization needed to access URL
    useDRACO?: boolean;      // whether to include DRACO compressed image loader
    combineInstances?: boolean;  // whether to combine instances
};

// Return a Promise that wraps the loading of an asset.
// Load an asset that is 'simple": represented by an URL to a displayable item
// The Promise resolves to the underlying graphical object representation.
export type ProgressCallback = (pState: string) => void;
export async function LoadSimpleAsset(pProps: LoadAssetParams, pProgressCallback?: ProgressCallback): Promise<Object3D> {
    const parms = <LoadAssetParams><unknown>CombineParameters(Config.assetLoader, pProps as unknown as BKeyedCollection, {
        AssetURL: undefined,
        AssetLoader: 'gltf',
        Auth: undefined
    });

    let asset: Object3D = undefined;
    try {
        const assetContainer = await SceneLoader.LoadAssetContainerAsync(parms.AssetURL, '', Graphics._scene,
            (event: ISceneLoaderProgressEvent) => {
                if (typeof(pProgressCallback) !== 'undefined') {
                    pProgressCallback('Working');
                }
        });
        if (assetContainer) {
            if (assetContainer.meshes.length > 0) {
                if (Config.Debug.ShowBoundingBox) {
                    Logger.debug(`GraphicsOps: showing bounding boxes`);
                    assetContainer.meshes.forEach( mesh => {
                        mesh.showBoundingBox = true;
                    });
                };
                if (Config.webgl.renderer.BabylonJS.rebuildBoundingBoxes) {
                    Logger.debug(`GraphicsOps: refreshing bounding boxes`);
                    for (const mesh of assetContainer.meshes) {
                        const verts = mesh.getVerticesData(VertexBuffer.PositionKind);
                        if (verts) {
                            const inds = mesh.getIndices();
                            if (inds) {
                                let minX = 0, minY = 0, minZ = 0, maxX = 0, maxY = 0, maxZ = 0;
                                for (let i = 0; i < inds.length; i++) {
                                    const ind = inds[i];
                                    const x = verts[ind * 3];
                                    const y = verts[ind * 3 + 1];
                                    const z = verts[ind * 3 + 2];
                                    if (x < minX) { minX = x; }
                                    if (y < minY) { minY = y; }
                                    if (z < minZ) { minZ = z; }
                                    if (x > maxX) { maxX = x; }
                                    if (y > maxY) { maxY = y; }
                                    if (z > maxZ) { maxZ = z; }
                                };
                                // Logger.debug(`GraphicsOps: min=[${minX}, ${minY}, ${minZ}], max=[${maxX}, ${maxY}, ${maxZ}]`);
                                mesh.setBoundingInfo(new BoundingInfo(
                                    BJSVector3.FromArray([minX, minY, minZ]),
                                    BJSVector3.FromArray([maxX, maxY, maxZ])));
                                // mesh.refreshBoundingInfo();
                            }
                        }
                    };
                };
                const rootNode = assetContainer.createRootMesh();
                asset = new Object3D(assetContainer, rootNode);
                assetContainer.addAllToScene();
            }
        };
    }
    catch (e) {
        Logger.error(`Graphics: LoadSimpleAsset: Exception: ${e}`);
        asset = undefined;
    }
    return asset; 
};

export type DelayedGraphicsOperation = (pProp: BKeyedCollection) => Promise<void>;
interface DelayedGraphicsEntry {
    op: DelayedGraphicsOperation,
    params: BKeyedCollection
};

const _DelayedGraphicsOperations: DelayedGraphicsEntry[] = [];

// Queue an operation that is performed in a group
export function ScheduleDelayedGraphicsOperation(pOp: DelayedGraphicsOperation, pParams: BKeyedCollection): void {
    _DelayedGraphicsOperations.push({
        op: pOp,
        params: pParams
    });
};

// Process all the queued graphical operations
export async function ProcessDelayedGraphicsOperations(): Promise<void> {
    while (_DelayedGraphicsOperations.length > 0) {
        Logger.debug(`GraphicsOp.ProcessDelayedGraphicsOperations: doing delayed op`);
        const opEntry = _DelayedGraphicsOperations.shift();
        void opEntry.op(opEntry.params);
    };
};

// Add a test object to the scene
export function AddTestObject() {
    const cube = Mesh.CreateBox('box1', 1, Graphics._scene);
    cube.position = BJSVector3.FromArray(Config.webgl.camera.initialCameraLookAt);
    Logger.debug(`Graphics: added test cube at ${Config.webgl.camera.initialCameraLookAt}`);
};

// Set up a function to receive keyboard events
// Note that only one process can set this event handles.
export type KeyboardEventHandler = (pEvent: IKeyboardEvent, pDown: boolean) => void;
let _keyboardEventHandler: KeyboardEventHandler = undefined;
export function SetKeyboardEventHandler(pHandler: KeyboardEventHandler) {
    _keyboardEventHandler = pHandler;
    Graphics._scene.onKeyboardObservable.add((pEvent: KeyboardInfo) => {
        if (typeof(_keyboardEventHandler) !== 'undefined') {
            if (pEvent.type === KeyboardEventTypes.KEYDOWN
                    || pEvent.type === KeyboardEventTypes.KEYUP) {
                _keyboardEventHandler(pEvent.event, pEvent.type === KeyboardEventTypes.KEYDOWN);
            };
        };
    });
};
