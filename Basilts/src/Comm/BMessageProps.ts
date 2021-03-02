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

import { BKeyedCollection } from "@Base/Tools/bTypes";

// In addition to IId, Auth, and IAuth, all BMessage's have a list
//      of properties that varies by operation.
// This defines the expected properties for each of the requests

export interface MakeConnectionReqProps {
    Transport: string;        // transport type: 'WW'|'WS'
    TransportURL: string;   // URL to connect transport to
    Protocol: string;       // message encoding: 'Basil-JSON'|...
    Service: string;        // service connecting too (usually 'SpaceServer')
    ClientAuth: string;     // authorization token to use when connecting
    OpenParams: BKeyedCollection; // parameters to send when doing OpenConnection
};
export interface MakeConnectionRespProps {
    none: string;           // place holder REPLACE ME
};
export interface OpenSessionReqProps {
    BasilVersion: string;   // version string for Basil
    // The Test* props are for WWTester and causes it to create the specified asset.
    //    These are not use for normal SpaceServer operation.
    //    They usually come from the OpenParams prop in the MakeConnectionReq
    //       so passing the test asset through Entry => Basil => WWTester => Basil works
    TestAssetURL?: string;  // URL of test asset to load
    TestAssetLoader?: string;   // loader to use for test asset
};
export interface OpenSessionRespProps {
    ServerVersion?: string; // server version string
    ServerAuth:string;      // token to use talking to this server
    Exception?: string;     // Included if there was a failure
};
export interface CreateItemReqProps {
    ItemAuthToken?: string;     // token required to access item
    Layer?: string;             // layer the BItem is associated with
    InitialAbilities?: string;  // comma separated list of abilities to add
    [ key: string ]: string;    // any parameters required or the added abilities

};
export interface CreateItemRespProps {
    Id: string;                 // Id of newly created item
    Exception?: string;         // Included if there was a failure
};
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeleteItemReqProps {
};
export interface DeleteItemRespProps {
    Exception?: string;         // Included if there was a failure
};
export interface AddAbilityReqProps {
    Abilities: string           // comma separated list of abilities to add
    [ key: string ]: string;    // any parameters required or the added abilities
};
export interface AddAbilityRespProps {
    Exception?: string;         // Included if there was a failure
};
export interface RemoveAbilityReqProps {
    Abilities: string;          // comma separated list of abilities to remove
};
export interface RemoveAbilityRespProps {
    Exception?: string;         // Included if there was a failure
};
export interface RequestPropertiesReqProps {
    Filter?: string;
};
export interface RequestPropertiesRespProps {
    [ key: string ]: string;    // requested properties
    Exception?: string;         // Included if there was a failure
};
export interface UpdatePropertiesReqProps {
    [ key: string ]: string;    // properties to update
};
export interface UpdatePropertiesRespProps {
    Exception?: string;         // Included if there was a failure
};

