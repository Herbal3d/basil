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

import GP from 'GP';
import Config from 'xConfig';
import * as BasilServer from './BasilServer.js';
import * as PestoClient from './PestoClient.js';
import BTransportWW from './BTransportWW.js';
import BTransportWS from './BTransportWS.js';
import BTransportTest from './BTransportTest.js';

import { CreateUniqueId } from 'xUtilities';

var CM = CM || {};
GP.CM = CM; // for debugging. Don't use for cross package access.

export function Init(parms) {
}

export function Start() {
};

// Initialize a transport and a service and resolve the promise when connected
// The 'parms' are passed to the transport and service creation routimes.
// If 'parms.testmode' is defined and 'true', test configuration is forced.
// REturns a promise that is resolved when both transport and service are running.
export function ConnectTransportService(parms) {
    return new Promise((resolve, reject) => {
        if (parms.testmode) {
            // Test mode sets up the WebWorker transport and a BasilServer here
            parms.transport = 'WW';
            parms.transportURL = parms.testWWURL;
            parms.service = 'BasilServer';
        }
        if (parms.transport && parms.transportURL) {
            GP.DebugLog('Comm.ConnectTransportService: transport: ' + parms.transport
                        + '=>' + parms.transportURL);
            ConnectTransport(parms)
            .then (xport => {
                GP.DebugLog('Comm.ConnectTransportService: transport connected');
                if (parms.service) {
                    GP.DebugLog('Comm.ConnectTransportService: service: ' + parms.service);
                    return ConnectService(xport, parms);
                }
                else {
                    return null;
                }
            })
            .then (svc => {
                if (svc) {
                    GP.DebugLog('Comm.ConnectTransportService: service connected');
                }
                resolve();
            })
            .catch ( e => {
                GP.DebugLog('Comm.ConnectTransportService: failed initialization: ' + e);
                reject(e);
            })
        }
    })
};

// Make a connection to a service.
// 'parms' is a map with:
//      'transport' = 'ww', 'test', 'ws' (default 'ws')
//      'transportURL' = if set, will do an 'open' with that URL and pass these parms
//      'service': 'Basil', 'Pesto' (default ('Basil')
// 'parms' is passed to the created transport/service
export function ConnectTransport(parms) {
    return new Promise((resolve, reject) => {
        let xport = undefined;
        try {
            if (parms.transportId === undefined) {
              // If the caller is not specifying a unique identifier, create one
              parms.transportId = CreateUniqueId('transport', parms.transport);
            }
            if (parms.transport) {
                switch (parms.transport) {
                    case 'WW':
                        xport = new BTransportWW(parms);
                        break;
                    case 'WS':
                        xport = new BTransportWS(parms);
                        break;
                    case 'Test':
                        xport = new BTransportTest(parms);
                        break;
                    default:
                        GP.DebugLog('Comm.Connect: transport type unknown: ' + parms.transport);
                        reject('Comm.Connect: transport type unknown: ' + parms.transport);
                }
            }
            else {
                GP.DebugLog('Comm.Connect: defaulting to WS transport');
                xport = new BTransportWS(parms);
            }
        }
        catch(e) {
            reject('Comm.Connect: exception opening transport: ' + e);
        }
        GP.DebugLog('Comm.Connect: created transport ' + xport.Id)
        resolve(xport);
    });
};

// A misnomer as this will connect a transport to either a Pseto service or a
//     Basil client (Creating the BasilService for this end))
// Expects parms.service = either 'BasilServer" or 'Pesto'
// Returns a Promise that has a handle to the created processor or undefined.
export function ConnectService(xport, parms) {
    return new Promise((resolve, reject) => {
        var svc;
        let serviceType = parms.service ? parms.service : 'BasilServer';
        if (parms.serviceId === undefined) {
          // If the caller is not specifying a unique identifier, create one
          parms.serviceId = CreateUniqueId('service', serviceType);
        }
        switch (serviceType) {
            case 'BasilServer':
                svc = BasilServer.NewBasilServerConnection(parms.serviceId, xport, parms);
                GP.DebugLog('Comm.Connect: created BasilService: ' + serviceType + ', Id=' + parms.serviceId);
                break;
            case 'Pesto':
                svc = new PestoClient(parms.serviceId, xport, parms);
                break;
            default:
                GP.DebugLog('Comm.Connect: service type unknown: ' + parms.service)
                reject('Comm.Connect: service type unknown: ' + parms.service)
        }
        GP.DebugLog('Comm.Connect: created service ' + svc.Id)
        resolve(svc);
    });
};

export function stats() {

}
