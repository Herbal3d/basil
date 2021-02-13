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

export enum BMessageOps {
  UnknownReq                  = 0,
  CreateItemReq               = 101,
  CreateItemResp              = 102,
  DeleteItemReq               = 103,
  DeleteItemResp              = 104,
  AddAbilityReq               = 105,
  AddAbilityResp              = 106,
  RemoveAbilityReq            = 107,
  RemoveAbilityResp           = 108,
  RequestPropertiesReq        = 109,
  RequestPropertiesResp       = 110,
  UpdatePropertiesReq         = 111,
  UpdatePropertiesResp        = 112,

  OpenSessionReq              = 201,
  OpenSessionResp             = 202,
  CloseSessionReq             = 203,
  CloseSessionResp            = 204,
  MakeConnectionReq           = 205,
  MakeConnectionResp          = 206,

  AliveCheckReq               = 301,
  AliveCheckResp              = 302,
};

export enum CoordSystem {
  WGS86     = 0,    // WGS84 earth coordinates
  CAMERA    = 1,    // Coordinates relative to camera position (-1..1 range, zero center)
  CAMERAABS = 2,    // Absolute coordinates relative to the camera position (zero center)
  VIRTUAL   = 3,    // Zero based un-rooted coordinates
  MOON      = 4,    // Earth-moon coordinates
  MARS      = 5,    // Mars coordinates
  REL1      = 6,    // Mutually agreed base coordinates
  REL2      = 7,
  REL3      = 8
};
export enum RotationSystem {
  WORLDR    = 0,    // world relative
  LOCALR    = 1,    // local relative
  FORR      = 2,    // frame of reference relative
  CAMERAR   = 3     // camera relative
};
export interface PositionBlock {
  Pos: number[];
  Rot: number[];
  CoordSystem: CoordSystem,
  RotationSystem: RotationSystem,
  Vel: number[];
  Path: number[];
  // Sometimes PostionBlock is repeated to apply to many Items/Components
  ItemId: string;         // BItem being operated on
  SessionAuth: string;    // Auth for the session
  ItemAuth: string;       // Auth for accessing the BItem
};

export interface BMessage {
  ResponseCode: number;
  ResponseKey: string;
  StreamId: number;
  ProtocolVersion: number

  ChangeSeq: number;
  ChangeTime: number;

  QueueTime: number;
  SendTime: number;
  TransportClass: number;

  Op: number;
  SessionAuth: string;
  ItemId: string;
  ItemAuth: string;
  ItemProps: { [ key: string ]: string };

  Positions: PositionBlock[];

  // Responses can report errors
  Exception: string;
  ExceptionHints: { [ key: string ]: string }
};

