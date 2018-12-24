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
import { BItem, BItemType, BItemState } from '../Items/BItem.js';

import { SpaceServerConnection } from './SpaceServer.js';
import { PestoClient } from './PestoClient.js';

import { BTransportWW } from './BTransportWW.js';
import { BTransportWS } from './BTransportWS.js';
import { BTransportTest } from './BTransportTest.js';

import { CombineParameters } from '../Utilities.js';
import { BException } from '../BException.js';
import { BasilServerConnection } from './BasilServer.js';

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
                      // GP.DebugLog('Comm.ConnectTransportService: service: ' + params.service);
                      return this.ConnectService(xport, params);
                  }
                  else {
                      return null;
                  }
              })
              .then (svc => {
                  if (svc) {
                      // GP.DebugLog('Comm.ConnectTransportService: service connected');
                  }
                  resolve();
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
          'transportURL': undefined     // URL to connect transport to
      });
      return new Promise(function(resolve, reject) {
          let xport = undefined;
          try {
              if (params.transport) {
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
                          let errorMsg = 'Comm.Connect: transport type unknown: '
                                        + JSON.stringify(params);
                          GP.ErrorLog(errorMsg);
                          reject(errorMsg);
                  }
              }
              else {
                  GP.DebugLog('Comm.Connect: defaulting to WS transport');
                  xport = new BTransportWS(params);
              }
          }
          catch(e) {
              reject('Comm.Connect: exception opening transport: ' + e);
          }
          GP.DebugLog('Comm.Connect: created transport ' + xport.id)
          resolve(xport);
      }.bind(this));
  };

  // A misnomer as this will connect a transport to either a Pseto service or a
  //     Basil client (Creating the BasilService for this end))
  // Expects parms.service = either 'BasilServer" or 'Pesto'
  // Returns a Promise that has a handle to the created processor or undefined.
  ConnectService(pTransport, pParams) {
      let params = CombineParameters(undefined, pParams, {
          'service': 'SpaceServer',     // or 'Pesto'
          'serviceId': undefined,       // if not passed, unique one created
          'pestoId': undefined          // if not passed, unique one created
      });
      return new Promise(function(resolve, reject) {
          let svc = undefined;
          let serviceType = params.service;
          switch (serviceType) {
              case 'SpaceServer':
                  svc = new SpaceServerClientConnection(pTransport, params);
                  let basil = new BasilServerConnection(pTransport, params);
                  let alive = new AliveCheckBasilConnection(pTransport, params);
                  alive.Start();
                  alive.SetReady();
                  basil.Start();
                  basil.SetReady();
                  svc.Start();
                  svc.SetReady();
                  GP.DebugLog('Comm.Connect: created BasilServer. Id=' + serverId);
                  break;
              case 'Pesto':
                  svc = new PestoClientConnection(pTransport, params);
                  let basilpesto = new BasilServerConnection(pTransport, params);
                  let alivepesto = new AliveCheckBasilConnection(pTransport, params);
                  alivepesto.Start();
                  alivepesto.SetReady();
                  basilpesto.Start();
                  basilpesto.SetReady();
                  svc.Start();
                  svc.SetReady();
                  GP.DebugLog('Comm.Connect: created PestoClient. Id=' + pestorId);
                  break;
              default:
                  let errorMsg = 'Comm.Connect: service type unknown: ' + JSON.stringify(params.service);
                  GP.ErrorLog(errorMsg)
                  reject(errorMsg)
          }
          GP.DebugLog('Comm.Connect: created service ' + svc.id)
          resolve(svc);
      }.bind(this));
  };
}
