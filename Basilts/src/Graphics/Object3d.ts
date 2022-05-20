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

import { Config } from '@Base/Config';

import { AbstractMesh, AssetContainer, ISceneLoaderProgressEvent } from '@babylonjs/core';
import { Vector3 as BJSVector3, Quaternion as BJSQuaternion } from '@babylonjs/core/Maths';

import { Graphics } from '@Graphics/Graphics';
import { CoordSystem } from '@Comm/BMessage';

import { Logger } from '@Tools/Logging';

// A representation of the 3D object that is passed around by the rest of the code.
// This hides the definition of the internal 3D object.
export class Object3D {
    // This is the top level node of the container. It is usually a TransforNode.
    public mesh: AbstractMesh = undefined;
    public container: AssetContainer = undefined;

    public pos: BJSVector3;
    public rot: BJSQuaternion;
    public for: number;

    constructor(pContainer?: AssetContainer, pMesh?: AbstractMesh) {
        this.container = pContainer;
        this.mesh = pMesh;
    }
    isMesh(): boolean {
        return this.mesh !== undefined;
    }
}
