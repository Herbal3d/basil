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

import { BasilMessage } from '../jslibs/BasilServerMessages.js';

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

/*
export const BasilMessageOps = {
    0x01001: 'IdentifyDisplayableObjectReq',
    'IdentifyDisplayableObjectReq': 0x01001,
        // auth, assetInfo, optional objectId, optional aabb
    0x01002: 'IdentifyDisplayableObjectResp',
    'IdentifyDisplayableObjectResp': 0x01002,
        // exception, objectId
    0x01003: 'ForgetDisplayableObjectReq',
    'ForgetDisplayableObjectReq': 0x01003,
        // auth, objectId
    0x01004: 'ForgetDisplayableObjectResp',
    'ForgetDisplayableObjectResp': 0x01004,
        // exception
    0x01005: 'CreateObjectInstanceReq',
    'CreateObjectInstanceReq': 0x01005,
        // auth, objectId, optional instanceId, pos, optional propertiesToSet, optional instanceCountHint
    0x01006: 'CreateObjectInstanceResp',
    'CreateObjectInstanceResp': 0x01006,
        // exception, instanceId
    0x01007: 'DeleteObjectInstanceReq',
    'DeleteObjectInstanceReq': 0x01007,
        // auth, objectId
    0x01008: 'DeleteObjectInstanceResp',
    'DeleteObjectInstanceResp': 0x01008,
        // exception
    0x01009: 'UpdateObjectPropertyReq',
    'UpdateObjectPropertyReq': 0x01009,
        // auth, objectId, properties
    0x0100a: 'UpdateObjectPropertyResp',
    'UpdateObjectPropertyResp': 0x0100a,
        // exception
    0x0100b: 'UpdateInstancePropertyReq',
    'UpdateInstancePropertyReq': 0x0100b,
        // auth, instanceId, properties
    0x0100c: 'UpdateInstancePropertyResp',
    'UpdateInstancePropertyResp': 0x0100c,
        // exception
    0x0100d: 'UpdateInstancePositionReq',
    'UpdateInstancePositionReq': 0x0100d,
        // auth, instanceId, pos
    0x0100e: 'UpdateInstancePositionResp',
    'UpdateInstancePositionResp': 0x0100e,
        // exception
    0x0100f: 'RequestObjectPropertiesReq',
    'RequestObjectPropertiesReq': 0x0100f,
        // auth, objectId, optional filter
    0x01010: 'RequestObjectPropertiesResp',
    'RequestObjectPropertiesResp': 0x01010,
        // exception, properties
    0x01011: 'RequestInstancePropertiesReq',
    'RequestInstancePropertiesReq': 0x01011,
        // auth, instanceId, optional filter
    0x01012: 'RequestInstancePropertiesResp',
    'RequestInstancePropertiesResp': 0x01012,
        // exception, properties
    0x01013: 'CloseSessionReq',
    'CloseSessionReq': 0x01013,
        // auth, optional reason
    0x01014: 'CloseSessionResp',
    'CloseSessionResp': 0x01014,
        // exception
    0x01015: 'MakeConnectionReq',
    'MakeConnectionReq': 0x01015,
        // auth, parameters
    0x01016: 'MakeConnectionRest',
    'MakeConnectionRest': 0x01016,
        // exception
    
    // AliveCheck ping/pong
    0x02001: 'AliveCheckReq',
    'AliveCheckReq': 0x02001,
        // time, sequenceNum
    0x02002: 'AliveCheckResp',
    'AliveCheckResp': 0x02002,
        // time, sequenceNum, timeReceived, sequenceNumberReceived

    // SpaceServer
    0x03001: 'OpenSessionReq',
    'OpenSessionReq': 0x03001,
        // auth, parameters
    0x03002: 'OpenSessionResp',
    'OpenSessionResp': 0x03002,
        // exception, parameters
    0x03003: 'CameraViewReq',
    'CameraViewReq': 0x03003,
        // auth
    0x03004: 'CameraViewResp',
    'CameraViewResp': 0x03004,
}
*/