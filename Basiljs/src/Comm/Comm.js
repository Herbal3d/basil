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

// import { BasilServiceConnection } from './BasilServer.js';
// import { PestoClient } from './PestoClient.js';
// import { BTransportWW } from './BTransportWW.js';
// import { BTransportWS } from './BTransportWS.js';
// import { BTransportTest } from './BTransportTest.js';

import { CreateUniqueId } from '../Utilities.js';
import { SpaceServerConnection } from './SpaceServer.js';
import { BException } from '../BException.js';

export class Comm extends BItem {
  constructor() {
    GP.DebugLog('Comm: constructor');
    super('org.basil.b.comm', undefined, BItemType.COMM);

    // Comm keeps a list of the servers.
    this.servers = {};
    this.transports = {};
  }

  Start() {
    this.SetReady();
  };

  // Return a promise around connecting to the SpaceServer mentioned in the parameters
  ConnectSpaceServer(parms) {
      return new Promise( function(resolve, reject) {
          try {
            let connection = new SpaceServerConnection(parms);
            connection.Start();
            resolve(connection);
          }
          catch (e) {
              reject('Comm.ConnectSpaceServer: exception connecting: ' + JSON.stringify(e));
          }
      }.bind(this));
  }

  /*
  // Initialize a transport and a service and resolve the promise when connected
  // The 'parms' are passed to the transport and service creation routimes.
  // If 'parms.testmode' is defined and 'true', test configuration is forced.
  // Returns a promise that is resolved when both transport and service are running.
  //  parms.transport: WW, WS, test
  //  parms.transportURL: URL to use for connecting the transportId
  //  parms.service: BasilServer, Pesto
  //  parms.serviceId: optional identification string for this service connection
  //  parms.testmode: if present and true, force above params to test configuration
  ConnectTransportService(parms) {
      return new Promise(function(resolve, reject) {
          if (parms.testmode) {
              // Test mode sets up the WebWorker transport and a BasilServer here
              parms.transport = 'WW';
              parms.transportURL = parms.testWWURL;
              parms.service = 'BasilServer';
          }
          if (parms.transport && parms.transportURL) {
              GP.DebugLog('Comm.ConnectTransportService: transport: ' + parms.transport
                          + '=>' + parms.transportURL);
              this.ConnectTransport(parms)
              .then (xport => {
                  GP.DebugLog('Comm.ConnectTransportService: transport connected');
                  if (parms.service) {
                      // GP.DebugLog('Comm.ConnectTransportService: service: ' + parms.service);
                      return this.ConnectService(xport, parms);
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
                  GP.ReportError('Comm.ConnectTransportService: failed initialization: ' + e);
                  reject(e);
              })
          }
      }.bind(this))
  };

  // Make a connection to a service.
  // 'parms' is a map with:
  //      'transport' = 'ww', 'test', 'ws' (default 'ws')
  //      'transportURL' = if set, will do an 'open' with that URL and pass these parms
  //      'service': 'Basil', 'Pesto' (default ('Basil')
  // 'parms' is passed to the created transport/service
  ConnectTransport(parms) {
      return new Promise(function(resolve, reject) {
          let xport = undefined;
          try {
              if (typeof parms.transportId == 'undefined') {
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
                          GP.ReportError('Comm.Connect: transport type unknown: ' + parms.transport);
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
          GP.DebugLog('Comm.Connect: created transport ' + xport.id)
          resolve(xport);
      }.bind(this));
  };

  // A misnomer as this will connect a transport to either a Pseto service or a
  //     Basil client (Creating the BasilService for this end))
  // Expects parms.service = either 'BasilServer" or 'Pesto'
  // Returns a Promise that has a handle to the created processor or undefined.
  //  parms.service: BasilServer, Pesto
  //  parms.serviceId: identification string for this service connection
  //              if not present, a unique Id is created
  ConnectService(xport, parms) {
      return new Promise(function(resolve, reject) {
          let svc = undefined;
          let serviceType = parms.service ? parms.service : 'BasilServer';
          switch (serviceType) {
              case 'BasilServer':
                  let serverId = parms.serviceId ? parms.serviceId : CreateUniqueId('service', serviceType);
                  if (this.servers[serverId]) {
                      GP.DebugLog('BasilServer: Not creating service. Existing Id:' + serverId);
                      reject('Comm.ConnectService: connecting service with existing Id');
                  }
                  svc = new BasilServiceConnection(serverId, xport, parms);
                  svc.serverId = serverId;
                  this.servers[serverId] = svc;
                  svc.Start();
                  svc.SetReady();
                  GP.DebugLog('Comm.Connect: created BasilServer. Id=' + serverId);
                  break;
              case 'Pesto':
                  let pestoId = parms.pestoId ? parms.pestoId : CreateUniqueId('service', serviceType);
                  svc = new PestoClient(parms.pestoId, xport, parms);
                  svc.serverId = pestoId;
                  this.servers[pestoId] = svc;
                  svc.Start();
                  svc.SetReady();
                  GP.DebugLog('Comm.Connect: created PestoClient. Id=' + pestorId);
                  break;
              default:
                  GP.ReportError('Comm.Connect: service type unknown: ' + parms.service)
                  reject('Comm.Connect: service type unknown: ' + parms.service)
          }
          GP.DebugLog('Comm.Connect: created service ' + svc.id)
          resolve(svc);
      }.bind(this));
  };
  */
}
