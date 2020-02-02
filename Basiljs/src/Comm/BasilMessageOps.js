// Copyright 2018 Robert Adams
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

import { BasilMessage } from '../jslibs/BasilMessages.js';

import { MakeArray3, MakeArray4 } from '../Utilities.js';

// List of BasilMessage 'op' codes and what the expected parameters are.
// Indexable by either the operation code or the name of the operation.
export let BasilMessageOps = new Map();

// Build 'BasilMessageOps' from the operation enum in the Protobuf definition.
// The way ProtobufJS builds this array, it includes both the name to value
//    and value to name mappings which is just what we want.
// Note that the index is always a string even if it is a number
export function BuildBasilMessageOps() {
    for (let element in BasilMessage.BasilMessageOps) {
        // If the element is the op number, index by number rather than string
        let elementAsNum = Number(element);
        if (Number.isNaN(elementAsNum)) {
            BasilMessageOps.set(element, BasilMessage.BasilMessageOps[element]);
        }
        else {
            BasilMessageOps.set(elementAsNum, BasilMessage.BasilMessageOps[element]);
        }
    };
}

// Create and return a PositionBlock with the passed information
export function PosInfo(pPos, pRot, pPosRef, pRotRef, pVel) {
    let ret = {};
    if (pPos) ret.Pos = MakeArray3(pPos);
    if (pRot) ret.Rot = MakeArray4(pRot);
    if (pPosRef) ret.PosRef = pPosRef;
    if (pRotRef) ret.RotRef = pRotRef;
    if (pVel) ret.Vel = MakeArray3(pVel);
    return ret;
}