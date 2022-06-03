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
'use strict';

import { PropValue } from "@BItem/BItem";
import { BKeyedCollection } from "@Tools/bTypes";

// In addition to IId, Auth, and IAuth, all BMessage's have a list
//      of properties that varies by operation.
// This defines the expected properties for each of the requests

export interface MakeConnectionReqProps {
    transport: string;        // transport type: 'WW'|'WS'
    transportURL: string;   // URL to connect transport to
    protocol: string;       // message encoding: 'Basil-JSON'|...
    service: string;        // service connecting too (usually 'SpaceServer')
    serviceAuth: string;     // authorization token to use when connecting
    serviceAddr?: string;    // routing address of service
    openParams?: BKeyedCollection; // optional parameters to send when doing OpenConnection
};
export interface MakeConnectionRespProps {
    none: string;           // place holder REPLACE ME
};
export interface OpenSessionReqProps {
    basilVersion: string;   // version string for Basil
    clientAuth: string      // token to use when talking back to me
    clientAddr?: string      // routing address to client
    // The Test* props are for WWTester and causes it to create the specified asset.
    //    These are not use for normal SpaceServer operation.
    //    They usually come from the OpenParams prop in the MakeConnectionReq
    //       so passing the test asset through Entry => Basil => WWTester => Basil works
    testAssetURL?: string;  // URL of test asset to load
    testAssetLoader?: string;   // loader to use for test asset
};
export interface OpenSessionRespProps {
    serverVersion?: string; // server version string
    serverAuth:string;      // token to use talking to this server
    serverAddr:string;      // routing address of server
};
export interface CreateItemReqProps {
    itemAuthToken?: string;     // token required to access item
    layer?: string;             // layer the BItem is associated with
    abilities?: string[];       // comma separated list of abilities to add
    [ key: string ]: PropValue;    // any parameters required or the added abilities

};
export interface CreateItemRespProps {
    id: string;                 // Id of newly created item
};
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeleteItemReqProps {
};
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeleteItemRespProps {
};
export interface AddAbilityReqProps {
    abilities: string[],        // array of ability names to add
    [ key: string ]: PropValue;    // any parameters required or the added abilities
};
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AddAbilityRespProps {
};
export interface RemoveAbilityReqProps {
    abilities: string[];         // array of ability names to remove
};
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RemoveAbilityRespProps {
};
export interface RequestPropertiesReqProps {
    filter?: string;
};
export interface RequestPropertiesRespProps {
    [ key: string ]: string;    // requested properties
};
export interface UpdatePropertiesReqProps {
    [ key: string ]: string;    // properties to update
};
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UpdatePropertiesRespProps {
};

