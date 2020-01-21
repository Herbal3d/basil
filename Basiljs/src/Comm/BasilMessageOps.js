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

// List of BasilMessage 'op' codes and what the expected parameters are.
// Indexable by either the operation code or the name of the operation.
export let BasilMessageOps = new Map();

// Build 'BasilMessageOps' from the operation enum in the Protobuf definition.
// Note that the map is built for name=>num and num=>name.
export function BuildBasilMessageOps() {
    new Map( [
        [ 'UnknownReq'                  , 0   ],
        [ 'CreateItemReq'               , 101 ],
        [ 'CreateItemResp'              , 102 ],
        [ 'DeleteItemReq'               , 103 ],
        [ 'DeleteItemResp'              , 104 ],
        [ 'AddAbilityReq'               , 105 ],
        [ 'AddAbilityResp'              , 106 ],
        [ 'RemoveAbilityReq'            , 107 ],
        [ 'RemoveAbilityResp'           , 108 ],
        [ 'RequestPropertiesReq'        , 109 ],
        [ 'RequestPropertiesResp'       , 110 ],
        [ 'UpdatePropertiesReq'         , 111 ],
        [ 'UpdatePropertiesResp'        , 112 ],

        [ 'OpenSessionReq'              , 201 ],
        [ 'OpenSessionResp'             , 202 ],
        [ 'CloseSessionReq'             , 203 ],
        [ 'CloseSessionResp'            , 204 ],
        [ 'MakeConnectionReq'           , 205 ],
        [ 'MakeConnectionResp'          , 206 ],

        [ 'AliveCheckReq'               , 301 ],
        [ 'AliveCheckResp'              , 302 ]
    ]).forEach( (key, val) => {
        BasilMessageOps.set(key, val);
        BasilMessageOps.set(val, key);
    })
}