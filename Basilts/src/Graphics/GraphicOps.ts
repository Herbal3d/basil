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

import { Mesh, ISceneLoaderProgressEvent } from '@babylonjs/core';
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
export async function LoadSimpleAsset(pProps: BKeyedCollection, pProgressCallback?: ProgressCallback): Promise<Object3D> {
    const parms = <LoadAssetParams>CombineParameters(Config.assetLoader, pProps, {
        AssetURL: undefined,
        AssetLoader: 'gltf',
        Auth: undefined
    });

    let asset: Object3D = undefined;
    const assetContainer = await SceneLoader.LoadAssetContainerAsync(parms.AssetURL, '', Graphics._scene, (event: ISceneLoaderProgressEvent) => {
        if (typeof(pProgressCallback) !== 'undefined') {
            pProgressCallback('Working');
        }
    });
    if (assetContainer) {
        if (assetContainer.meshes.length > 0) {
            const rootNode = assetContainer.createRootMesh();
            asset = new Object3D(assetContainer, rootNode);
        }
    };
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