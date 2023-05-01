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

// import { Config } from '@Base/Config';
import { ToPlanetCoord, ToPlanetRot, BFrameOfRef, FromPlanetCoord, FromPlanetRot } from '@Tools/Coords';

import { AbstractMesh, AssetContainer, ISceneLoaderProgressEvent } from '@babylonjs/core';
import { Vector3 as BJSVector3, Quaternion as BJSQuaternion } from '@babylonjs/core/Maths';

import { CoordSystem } from '@Comm/BMessage';

// import { Logger } from '@Tools/Logging';

// A representation of the 3D object that is passed around by the rest of the code.
// This hides the definition of the internal 3D object.
export class Object3D {
    // This is the top level node of the container. It is usually a TransforNode.
    public mesh: AbstractMesh = undefined;
    public container: AssetContainer = undefined;

    public get pos(): number[] {
        if (this.mesh) {
            return ToPlanetCoord(this._bFrameOfRef, this.mesh.position);
        }
        return [ 0, 0, 0 ];
    }
    // NOTE: the position passed here is always PlanetCoord. Need to localize
    public set pos(pVal: number[]) {
        if (this.mesh) {
            const localPos = FromPlanetCoord(this._bFrameOfRef, pVal);
            this.mesh.position = localPos;
        }
    }
    public get rot(): number[] {
        if (this.mesh) {
            return ToPlanetRot(this._bFrameOfRef, this.mesh.rotationQuaternion);
        }
        return [ 0, 0, 0, 1 ];
    }
    public set rot(pVal: number[]) {
        if (this.mesh) {
            this.mesh.rotationQuaternion = FromPlanetRot(this._bFrameOfRef, pVal);
        }
    }
    private _frameOfRef: number;
    private _bFrameOfRef: BFrameOfRef;
    public get frameOfRef() : number {
        return this._frameOfRef;
    };
    public set frameOfRef(pVal: number) {
        this._frameOfRef = pVal;
        this._bFrameOfRef = new BFrameOfRef(this._frameOfRef as CoordSystem);

    }

    constructor(pContainer?: AssetContainer, pMesh?: AbstractMesh) {
        this.container = pContainer;
        this.mesh = pMesh;
        this.frameOfRef = CoordSystem.WGS86;
    }
    isMesh(): boolean {
        return this.mesh !== undefined;
    }
}
