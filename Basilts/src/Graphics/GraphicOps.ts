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

import { Mesh, ISceneLoaderProgressEvent, AssetContainer } from '@babylonjs/core';
import { KeyboardEventTypes, KeyboardInfo, IKeyboardEvent } from '@babylonjs/core';
import { VertexBuffer, BoundingInfo } from '@babylonjs/core';
import { SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import '@babylonjs/loaders/OBJ';
import '@babylonjs/loaders/STL';
import { Vector3 as BJSVector3, Color3 as BJSColor3 } from '@babylonjs/core/Maths';

import { Graphics } from '@Graphics/Graphics';
import { Object3D } from '@Graphics/Object3d';

import { BKeyedCollection, BKeyValue } from '@Tools/bTypes';
import { JSONstringify, CombineParameters, ExtractStringError, ParseThreeTuple } from '@Tools/Utilities';
import { Logger } from '@Tools/Logging';

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
};

// While asset is loading, state is reported
export enum AssetLoadingState {
    NotLoaded,
    Started,
    Working,
    Loaded,
    Failed
};
export interface IProgressInfo {
    state: AssetLoadingState;
    asset: string;
    percent: number | undefined;    // percent completed or undefined if not known
}
// Routine called from LoadSimpleAsset to package and report loading progress
export function AnnounceProgress(pState: AssetLoadingState, 
                            pAsset: string,
                            pProgress: ISceneLoaderProgressEvent,
                            pProgressCallback: ProgressCallback) {
    if (typeof(pProgressCallback) !== 'undefined') {
        let percent: number | undefined;
        if (pProgress && pProgress.lengthComputable) {
            percent = pProgress.loaded / pProgress.total;
        }
        pProgressCallback({state: pState, asset: pAsset, percent: percent});
    }
};

// Return a Promise that wraps the loading of an asset.
// Load an asset that is 'simple": represented by an URL to a displayable item
// The Promise resolves to the underlying graphical object representation.
export type ProgressCallback = (pProgress: IProgressInfo) => void;
export async function LoadSimpleAsset(pProps: LoadAssetParams, pProgressCallback?: ProgressCallback): Promise<Object3D> {
    const parms = <LoadAssetParams><unknown>CombineParameters(Config.assetLoader, pProps as unknown as BKeyedCollection, {
        AssetURL: undefined,
        AssetLoader: 'gltf',
        Auth: undefined
    });

    let asset: Object3D = undefined;
    try {
        // Load the asset
        AnnounceProgress(AssetLoadingState.Started, parms.AssetURL, null, pProgressCallback);
        const assetContainer = await SceneLoader.LoadAssetContainerAsync(
            parms.AssetURL,
            '',
            Graphics._scene,
            (event: ISceneLoaderProgressEvent) => {
                AnnounceProgress(AssetLoadingState.Working, parms.AssetURL, event, pProgressCallback);
            }
        );
        AnnounceProgress(AssetLoadingState.Loaded, parms.AssetURL, null, pProgressCallback);
        if (assetContainer) {
            if (assetContainer.meshes.length > 0) {
                PrepareMeshesInContainer(assetContainer);
                // Create one node that holds everything that was loaded
                const rootNode = assetContainer.createRootMesh();
                // Add the loaded things to the scene
                assetContainer.addAllToScene();
                // Create handle for all the assets in this load
                asset = new Object3D(assetContainer, rootNode);
                // Add the contents to the world coordinate system
                Graphics.addObject3dToWorldView(asset);
                // Remember to remove it from the WorldView before unloading the container
            }
        };
    }
    catch (e) {
        AnnounceProgress(AssetLoadingState.Failed, parms.AssetURL, null, pProgressCallback);
        Logger.error(`Graphics: LoadSimpleAsset: Exception: ${e}`);
        asset = undefined;
    }
    return asset; 
};

// We've loaded a container and need to set flags on the meshes therein.
// This adds diagnostic things (bounding boxes), recomputes bounding boxes
//     (since the GLTF loader creates odd things), and add shadows.
// All these operation and optional and controlled by Config parameters.
function PrepareMeshesInContainer(pContainer: AssetContainer): void {
    if (Config.Debug.ShowBoundingBox) {
        Logger.debug(`GraphicsOps: showing bounding boxes`);
        pContainer.meshes.forEach( mesh => {
            mesh.showBoundingBox = true;
        });
    };
    Logger.debug(`GraphicsOps: making all meshes pickable`);
    pContainer.meshes.forEach( mesh => {
        mesh.isPickable = true;
    });
    if (Config.webgl.renderer.BabylonJS.rebuildBoundingBoxes) {
        Logger.debug(`GraphicsOps: refreshing bounding boxes`);
        for (const mesh of pContainer.meshes) {
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
}

export function DeleteAsset(pAsset: Object3D): boolean {
    Logger.debug(`GraphicsOps.DeleteAsset: removing`);
    pAsset.container.removeAllFromScene();
    pAsset.container.dispose();
    return true;
}

// Add a test object to the scene
export function AddTestObject() {
    const cube = Mesh.CreateBox('box1', 1, Graphics._scene);
    cube.position = BJSVector3.FromArray(Config.webgl.camera.target);
    Logger.debug(`Graphics: added test cube at ${Config.webgl.camera.target}`);
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
