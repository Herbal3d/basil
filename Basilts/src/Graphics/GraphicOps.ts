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

import { AbstractMesh, ISceneLoaderProgressEvent, TransformNode } from '@babylonjs/core';
import { SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import '@babylonjs/loaders/OBJ';
import '@babylonjs/loaders/STL';
import { Vector3 as BJSVector3, Color3 as BJSColor3 } from '@babylonjs/core/Maths';

import { Graphics } from '@Graphics/Graphics';
import { CoordSystem } from '@Comm/BMessage';

import { BKeyedCollection, BKeyValue } from '@Tools/bTypes';
import { JSONstringify, CombineParameters, ExtractStringError, ParseThreeTuple } from '@Tools/Utilities';
import { Logger } from '@Tools/Logging';

// Collection of graphical operations.
// Externally, code doesn't know how graphics is implemented and this presents the functions
//    that the rest of the code operates on the graphical system.

// A representation of the 3D object that is passed around by the rest of the code.
// This hides the definition of the internal 3D object.
export class Object3D {
    public mesh: AbstractMesh = undefined;

    constructor(pMesh: AbstractMesh) {
        this.mesh = pMesh;
    }
    isMesh(): boolean {
        return this.mesh !== undefined;
    }
}

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
        Auth: undefined,
        useDRACO: true,
        combineInstances: true
    });

    let asset: Object3D = undefined;
    SceneLoader.LoadAssetContainerAsync(parms.AssetURL, '', Graphics._scene, (event: ISceneLoaderProgressEvent) => {
        if (typeof(pProgressCallback) !== 'undefined') {
            pProgressCallback('Working');
        }
    })
    .then ( assetContainer => {
        if (assetContainer.meshes.length > 0) {
            asset = new Object3D(assetContainer.meshes[0]);
        }
        return asset; 
    })
    .catch( (error) => {
        throw error;
    });
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

export interface PlaceInWorldProps {
    Name: string,
    Pos: number[];
    PosCoord: CoordSystem;
    Rot: number[];
    RosCoord: number;
    Object: Object3D;
};
// Do the graphics libaray stuff to place an instance of an Object3D into
//     a position in the visible world.
// The parameters are passed in the block defined above.
export function PlaceInWorld(pParams: PlaceInWorldProps): Object3D {
    try {
        const worldNode = new TransformNode(pParams.Name, Graphics._scene);
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

export function RemoveFromWorld(pNode: Object3D): void {
    if (pNode.parent) {
        pNode.parent.remove(pNode);
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
