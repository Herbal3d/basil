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

import { BasilConnection } from '@Comm/BasilConnection';

import { BTransport } from '@Comm/BTransport';
import { BTransportWW } from '@Comm/BTransportWW';
import { BTransportWS } from '@Comm/BTransportWS';

import { BProtocol } from '@Comm/BProtocol';
import { BProtocolJSON } from '@Comm/BProtocolJSON';
import { BProtocolFB } from '@Comm/BProtocolFB';
import { BProtocolPB } from '@Comm/BProtocolPB';

import { CombineParameters, ExtractStringError, JSONstringify } from "@Tools/Utilities";
import { BKeyedCollection } from "@Tools/bTypes";
import { Logger } from '@Tools/Logging';
import { Config } from '@Base/Config';

export interface MakeConnectionParams extends BKeyedCollection {
    transport: string,            // type of the transport
    transportURL: string,         // link to service to connect to
    protocol: string,             // format of the messages on the transport
};

export const Comm = {
    // Process an incoming MakeConnection request
    // This creates a new outgoing connection to the specified transport and protocol
    async MakeConnection(pParams: BKeyedCollection): Promise<BasilConnection> {
        const params= <MakeConnectionParams>CombineParameters(undefined, pParams, {
            'transport': 'WS',          // type of the transport
            'transportURL': undefined,  // link to service to connect to
            'protocol': 'Basil-JSON',   // format of the messages on the transport
        });
        Logger.cdebug('MakeConnectionDetail', `MakeConnection: ${JSONstringify(params)}`);
        try {
            const xport = await Comm.TransportFactory(params);
            const proto = await Comm.ProtocolFactory(params, xport);
            const conn = await Comm.BasilConnectionFactory(params, proto);
            return conn;
        }
        catch (e) {
            const ee = ExtractStringError(e);
            throw ee;
        };
    },

    async TransportFactory(pParams: BKeyedCollection): Promise<BTransport> {
        const params = CombineParameters(undefined, pParams, {
            'transport': 'WS',          // type of transport
            'transportURL': undefined   // link to service to connect to
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
                Logger.error(`Comm.TransportFactory: unknown transport "${params.transport}"`);
                break;
        };
        if (xport) {
            return xport.Start(params);
        }
        throw 'Creation of transport failed';
    },

    async ProtocolFactory(pParams: BKeyedCollection, pXPort: BTransport): Promise<BProtocol> {
        const params = CombineParameters(undefined, pParams, {
            'protocol': 'Basil-JSON',          // type of protocol processor
        });
        let proto: BProtocol;
        switch (params.protocol) {
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
                Logger.error(`Comm.ProtocolFactory: unknown protocol "${params.protocol}"`);
                break;
        };
        if (proto) {
            return proto.Start(params);
        };
        throw 'Creation of protocol failed';
    },

    async BasilConnectionFactory(pParams: BKeyedCollection, pProto: BProtocol): Promise<BasilConnection> {
        const connection = new BasilConnection(pParams, pProto);
        return connection;
    }
};
