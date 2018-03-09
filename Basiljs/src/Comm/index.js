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

var CM = CM || {};
GP.CM = CM; // for debugging. Don't use for cross package access.

CM.transports = [];
CM.services = [];

export function Init(parms) {
    return new Promise((resolve, reject) => {
        if (Config.comm.testmode && Config.comm.testmode == true) {
            // Test mode sets up the WebWorker transport and a BasilServer here
            Config.comm.transport = 'WW';
            Config.comm.transportURL = Config.comm.testWWURL;
            Config.comm.service = 'BasilServer';
        }
        if (Config.comm.transport && Config.comm.transportURL) {
            GP.DebugLog('Comm.Init: first transport: ' + Config.comm.transport
                        + '=>' + Config.comm.transportURL);
            ConnectTransport(Config.comm)
            .then (xport => {
                GP.DebugLog('Comm.Init: transport connected');
                CM.transports.push(xport);
                if (Config.comm.service) {
                    GP.DebugLog('Comm.Init: first service: ' + Config.comm.service);
                    return ConnectService(xport, Config.comm);
                }
                else {
                    return null;
                }
            })
            .then (svc => {
                if (svc) {
                    CM.services.push(svc);
                    GP.DebugLog('Comm.Init: service connected');
                }
                resolve();
            })
            .catch ( e => {
                GP.DebugLog('Comm.Init: failed initialization: ' + e);
                reject(e);
            })
        }
    })
};

export function Start() {
    for (let svc of CM.services) {
        svc.Start();
    }
};

// Make a connection to a service.
// 'parms' is a map with:
//      'transport' = 'ww', 'test', 'ws' (default 'ws')
//      'transportURL' = if set, will do an 'open' with that URL and pass these parms
//      'service': 'Basil', 'Pesto' (default ('Basil')
// 'parms' is passed to the created transport/service
export function ConnectTransport(parms) {
    return new Promise((resolve, reject) => {
        var xport;
        try {
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
                        GP.DebugLog('Comm.Connect: transport type unknown: ' + parms.transport)
                        reject('Comm.Connect: transport type unknown: ' + parms.transport)
                }
            }
            else {
                xport = new BTransportWS(parms);
            }
        }
        catch(e) {
            reject('Comm.Connect: exception opening transport: ' + e);
        }
        GP.DebugLog('Comm.Connect: created transport ' + xport.type)
        resolve(xport);
    });
};

export function ConnectService(xport, parms) {
    return new Promise((resolve, reject) => {
        var svc;
        let serviceType = parms.service ? parms.service : 'BasilServer';
        switch (serviceType) {
            case 'BasilServer':
                let serverID = parms.BasilServerID ? parms.BasilServerID : 'BasilServer';
                svc = BasilServer.NewBasilServerConnection(serverID, xport, parms);
                GP.DebugLog('Comm.Connect: created BasilService: ' + serviceType + ', ID=' + serverID);
                break;
            case 'Pesto':
                svc = new PestoClient(xport, parms);
                break;
            default:
                GP.DebugLog('Comm.Connect: service type unknown: ' + parms.service)
                reject('Comm.Connect: service type unknown: ' + parms.service)
        }
        GP.DebugLog('Comm.Connect: created service ' + svc.serverID)
        resolve(svc);
    });
};

export function TestComm() {
    if (GP.TestCommService) {
        GP.DebugLog('Comm.TestComm: stopping test');
        GP.TestCommService.Close();
        GP.TestCommService = undefined;
    }
    else {
        GP.DebugLog('Comm.TestComm: starting test');
        ConnectTransport( {
            'transport': 'Test',
            'transportURL': 'TESTTEST',
            'testInterval': 1000,       // MS between alive checks
        })
        .then (xport => {
            return ConnectService(xport, {
                'service': 'BasilServer'
            })
        })
        .then (svc => {
            GP.DebugLog('TestComm: service connected and running');
            GP.TestCommService = svc;
        })
        .catch ( e => {
            GP.DebugLog('Comm.TestComm: failed test: ' + e);
        })
    }
}

export function stats() {

}
