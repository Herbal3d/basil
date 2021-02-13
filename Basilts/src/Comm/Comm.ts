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

import { BasilConnection } from '@Comm/BasilConnection';

import { BTransport } from '@Comm/BTransport';
import { BTransportWW } from '@Comm/BTransportWW';
import { BTransportWS } from '@Comm/BTransportWS';

import { BProtocol } from '@Comm/BProtocol';
import { BProtocolJSON } from '@Comm/BProtocolJSON';
import { BProtocolFB } from '@Comm/BProtocolFB';
import { BProtocolPB } from '@Comm/BProtocolPB';

import { CombineParameters } from "@Tools/Utilities";
import { BKeyedCollection } from "@Tools/bTypes";

export const Comm = {
  async MakeConnection(pParams: BKeyedCollection): Promise<BasilConnection> {
    const params = CombineParameters(undefined, pParams, {
      'transport': 'WS',          // type of the transport
      'transportURL': undefined,  // name of Worker to connect to
      'protocol': 'Basil-JSON',   // format of the messages on the transport
      'service': 'SpaceServer',   // type of service connecting to
      'receiveAuth': undefined,   // authentication expected on reception
      'sendAuth': undefined,      // authentication for sent messages
      'openParams': undefined  // parameters to send on the open connection message
    });
    return new Promise( (resolve,reject) => {
      Comm.TransportFactory(params)
      .then( xport => {
        Comm.ProtocolFactory(params, xport)
        .then( proto => {
          Comm.BasilConnectionFactory(params, proto)
          .then( conn => {
            resolve(conn);
          })
          .catch( err => {
            reject(err);
          });
        })
        .catch( err => {
          reject(err);
        });
      })
      .catch( err => {
        reject(err);
      });
    });
  },
  async TransportFactory(pParams: BKeyedCollection): Promise<BTransport> {
    const params = CombineParameters(undefined, pParams, {
      'transport': 'WS',          // type of transport
      'transportURL': undefined   // name of Worker to connect to
    });
    let xport: BTransport;
    switch (params.transport) {
      case 'WW':
        xport = new BTransportWW(params);
        break;
      case 'WS':
        xport = new BTransportWS(params);
        break;
      default:
        break;
    };
    if (xport) {
      return xport.Start(params);
    }
    return undefined;
  },
  async ProtocolFactory(pParams: BKeyedCollection, pXPort: BTransport): Promise<BProtocol> {
    const params = CombineParameters(undefined, pParams, {
      'protocol': 'Basil-JSON',          // type of protocol processor
    });
    let proto: BProtocol;
    switch (params.transport) {
      case 'Basil-JSON':
        proto = new BProtocolJSON(params, pXPort);
        break;
      case 'Basil-PB':
        proto = new BProtocolPB(params, pXPort);
        break;
      case 'Basil-FB':
        proto = new BProtocolFB(params, pXPort);
        break;
      default:
        break;
    };
    if (proto) {
      return proto.Start(params);
    }
    return undefined;

  },
  async BasilConnectionFactory(pParams: BKeyedCollection, pProto: BProtocol): Promise<BasilConnection> {
      return undefined;
  }
};
