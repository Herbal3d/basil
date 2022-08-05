// Copyright 2022 Robert Adams
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

import { Vector3 as BJSVector3, Quaternion as BJSQuaternion } from '@babylonjs/core/Maths';

import { CoordSystem } from '@Comm/BMessage';

export const degreesToRads = Math.PI / 180.0;

export class BFrameOfRef {
    constructor(pCoord: CoordSystem) {
        return;
    }
}

// The planet is [lat,long,elev] and the local coords are 
// NOTE: in devel, planet is [x,y,z] in map-ish, right-hand, Zup (Z is altitude)
// NOTE: in devel, local is [x,y,z] in BabylonJS left-hand, Yup
export function ToPlanetCoord(pFor: BFrameOfRef, pPos: BJSVector3): number[] {
    return [ pPos.x, pPos.z, -pPos.y ];
}
export function ToPlanetRot(pFor: BFrameOfRef, pRot: BJSQuaternion): number[] {
    // This is absolutely the most inefficient way to do this.
    // TODO: someone who knows what they are doing should fix this
    const eulers = pRot.toEulerAngles();
    const zup = BJSQuaternion.FromEulerAngles(eulers.x, eulers.z, eulers.y);
    return [ zup.x, zup.y, zup.z, zup.w ];
}
export function FromPlanetCoord(pFor: BFrameOfRef, pPos: number[]): BJSVector3 {
    return new BJSVector3(pPos[0], pPos[2], -pPos[1]);
}
export function FromPlanetRot(pFor: BFrameOfRef, pRot: number[]): BJSQuaternion {
    // This is absolutely the most inefficient way to do this.
    // TODO: someone who knows what they are doing should fix this
    const quat = new BJSQuaternion(pRot[0], pRot[1], pRot[2], pRot[3])
    const zup = quat.toEulerAngles();
    return BJSQuaternion.FromEulerAngles(zup.x, zup.z, zup.y);
}

export function VectorToArray(pVect: BJSVector3): number[] {
    return [ pVect.x, pVect.y, pVect.z ];
}
export function ArrayToVector(pVect: number[]): BJSVector3 {
    return new BJSVector3(pVect[0], pVect[1], pVect[2]);
}
export function QuaternionToArray(pQuat: BJSQuaternion): number[] {
    return [ pQuat.x, pQuat.y, pQuat.z, pQuat.w ];
}
export function ArrayToQuaternion(pQuat: number[]): BJSQuaternion {
    return new BJSQuaternion(pQuat[0], pQuat[1], pQuat[2], pQuat[3]);
}