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
import Config from '../config.js';

import { BItem, BItemType } from '../Items/BItem.js';

import { SpaceServerConnection } from './SpaceServer.js';
import { SpaceServerClientConnection } from './SpaceServerClient.js';
import { BasilServerConnection } from './BasilServer.js';
import { BasilClientConnection } from './BasilClient.js';
import { AliveCheckBasilConnection } from './AliveCheckBasil.js';
import { AliveCheckClientConnection } from './AliveCheckClient.js';
import { PestoClientConnection } from './PestoClient.js';

import { BTransportWW } from './BTransportWW.js';
import { BTransportWS } from './BTransportWS.js';
import { BTransportTest } from './BTransportTest.js';

import { CombineParameters } from '../Utilities.js';
import { BException } from '../BException.js';

export class Comm extends BItem {
    constructor() {
        GP.DebugLog('Comm: constructor');
        super('org.basil.b.comm', undefined, BItemType.COMM);
    }

    Start() {
        this.SetReady();
    };

    // Initialize a transport and a service and resolve the promise when connected
    // The 'parms' are passed to the transport and service creation routimes.
    // Returns a promise that is resolved when both transport and service are running.
    ConnectTransportAndService(parms) {
        let params = CombineParameters(undefined, parms, {
            'transport': 'WS',            // the type of transport to connect (WW, WS, test)
            'transportURL': undefined,    // URL to connect transport to
            'service': undefined          // service to add on top of that transport
        });
        return new Promise(function(resolve, reject) {
            if (params.transport && params.transportURL) {
                GP.DebugLog('Comm.ConnectTransportService: transport: ' + params.transport
                            + '=>' + params.transportURL);
                this.ConnectTransport(params)
                .then (xport => {
                    GP.DebugLog('Comm.ConnectTransportService: transport connected');
                    if (params.service) {
                        // Connect to the service
                        return this.ConnectService(xport, params);
                    }
                    else {
                        // No service to connect to
                        reject('Comm.ConnectTransportAndService: No service specified to connect');
                    }
                })
                .then (svc => {
                    resolve(svc);
                })
                .catch ( e => {
                    GP.ErrorLog('Comm.ConnectTransportService: failed initialization: ' + e);
                    reject(e);
                })
            }
        }.bind(this))
    };

    // Make a connection to a service.
    // 'parms' is passed to the created transport/service
    ConnectTransport(parms) {
        let params = CombineParameters(undefined, parms, {
            'transportId': undefined,     // identifier for the created transport
            'transport': 'WS',            // the type of transport to connect (WW, WS, test)
            'transportURL': undefined,    // URL to connect transport to
            'waitTilTransportReadyMS': 5000  // MS before timeout waiting for transport ready
        });
        return new Promise(function(resolve, reject) {
            let xport = undefined;
            try {
                switch (params.transport) {
                    case 'WW':
                        xport = new BTransportWW(params);
                        break;
                    case 'WS':
                        xport = new BTransportWS(params);
                        break;
                    case 'Test':
                        xport = new BTransportTest(params);
                        break;
                    default:
                        let errorMsg = 'Comm.ConnectTransport: transport type unknown: '
                                        + JSON.stringify(params);
                        GP.ErrorLog(errorMsg);
                        reject(errorMsg);
                }
            }
            catch(e) {
                reject('Comm.ConnectTransport: exception opening transport: ' + e.message);
            }
            if (xport) {
                GP.DebugLog('Comm.ConnectTransport: created transport ' + xport.id)
                xport.WhenReady(params.waitTilTransportReadyMS)
                .then( xxport => {
                    resolve(xxport);
                })
                .catch( e => {
                    reject(new BException('Conn.ConnectTransport: timeout waiting for ready'));
                });
            }
            else {
                let errorMsg = 'Comm.ConnectTransport: Did not create transport: '
                                + JSON.stringify(params);
                GP.ErrorLog(errorMsg);
                reject(errorMsg);
            }
        }.bind(this));
    };

    // A misnomer as this will connect a transport to either a Pseto service or a
    //     Basil client (Creating the BasilService for this end))
    // Expects parms.service = either 'BasilServer" or 'Pesto'
    // Returns a Promise that has a handle to the created processor or undefined.
    ConnectService(pTransport, pParams) {
        let params = CombineParameters(undefined, pParams, {
            'service': 'SpaceServerClient',     // or 'Pesto'
            'serviceId': undefined,       // if not passed, unique one created
            'pestoId': undefined          // if not passed, unique one created
        });
        return new Promise(function(resolve, reject) {
            let svc = undefined;
            let serviceType = params.service;
            switch (serviceType) {
                case 'SpaceServer':
                    svc = new SpaceServerConnection(pTransport, params);
                    let basilSpace = new BasilClientConnection(pTransport, params);
                    let aliveSpace = new AliveCheckClientConnection(pTransport, params);
                    aliveSpace.Start();
                    basilSpace.Start();
                    svc.Start();
                    GP.DebugLog('Comm.Connect: created SpaceServerConnection. Id=' + svc.id);
                    resolve(svc);
                    break;
                case 'SpaceServerClient':
                    svc = new SpaceServerClientConnection(pTransport, params);
                    let basilSpaceClient = new BasilServerConnection(pTransport, params);
                    let aliveSpaceClient = new AliveCheckBasilConnection(pTransport, params);
                    aliveSpaceClient.Start();
                    basilSpaceClient.Start();
                    svc.Start();
                    GP.DebugLog('Comm.Connect: created SpaceServerClientConnection. Id=' + svc.id);
                    resolve(svc);
                    break;
              case 'Pesto':
                    svc = new PestoClientConnection(pTransport, params);
                    let basilPesto = new BasilServerConnection(pTransport, params);
                    let alivePesto = new AliveCheckBasilConnection(pTransport, params);
                    alivePesto.Start();
                    basilPesto.Start();
                    svc.Start();
                    GP.DebugLog('Comm.Connect: created PestoClientConnection. Id=' + svc.id);
                    resolve(svc);
                    break;
              default:
                    let errorMsg = 'Comm.Connect: service type unknown: ' + JSON.stringify(params.service);
                    GP.ErrorLog(errorMsg)
                    reject(errorMsg)
            }
        });
    };
}
