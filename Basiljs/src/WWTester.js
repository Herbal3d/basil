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
/* global GP */ // debugging global context (ESlint)

// Global parameters and variables. "GP.variable"
import GP from 'GP';

import Config from './config.js';
import { BasilClientConnection } from './Comm/BasilClient.js';
import { BTransportWW } from './Comm/BTransportWW.js';

import { BasilType } from './jslibs/BasilServerMessages.js'
import { SpaceServerConnection } from './Comm/SpaceServer.js';
import { AliveCheckClientConnection } from './Comm/AliveCheckClient.js';

GP.Config = Config;

// Debug function to mimic the non-WebWorker one
GP.DebugLog = function(msg) {};
GP.ErrorLog = function(msg) {};

GP.Ready = false;

let parms  = {};
GP.wwTransport = new BTransportWW(parms);

GP.Ready = true;

GP.client = new BasilClientConnection(GP.wwTransport, {} );
GP.spaceServer = new SpaceServerConnection(GP.wwTransport, {});
GP.aliveCheck = new AliveCheckClientConnection(GP.wwTransport, {});
GP.aliveCheck.Start();
GP.spaceServer.Start();
GP.client.Start();

// Once client is created and connected, debug messsages can be sent to the
//    predefined debug instance.
if (Config.WWTester && Config.WWTester.LogToConsole) {
    GP.DebugLog = function(msg) {
        console.log('WORKER: ' + msg);
    }
    GP.ErrorLog = function(msg) {
        console.log('WORKER ERROR: ' + msg);
    }
}
else {
    // Debug messages are sent to debug BItem and displayed there.
    if (Config.Debug && Config.Debug.DebugLogInstanceName) {
        GP.DebugInstanceId = Config.Debug.DebugLogInstanceName;
        GP.DebugLog = function(msg) {
            let auth = undefined;
            let instanceId = GP.DebugInstanceId;
            let props = {
                'Msg': msg
            };
            GP.client.UpdateInstanceProperty(auth, instanceId, props);
            // console.log('WW.DebugLog: ' + msg);
        };
        GP.ErrorLog = function(msg) {
            let auth = undefined;
            let instanceId = GP.DebugInstanceId;
            let props = {
                'ErrorMsg': msg
            };
            GP.client.UpdateInstanceProperty(auth, instanceId, props);
            // console.log('WW.ErrorLog: ' + msg);
        }
    }
}

// Start AliveCheck polling if configured
if (Config.WWTester && Config.WWTester.GenerateAliveCheck) {
    GP.aliveCheck.WhenReady(10000)
    .then( alive => {
        let pollMS = Config.WWTester.AliveCheckPollMS
                    ? Config.WWTester.AliveCheckPollMS : 10000;
        // Start alive polling
        GP.aliveIntervalID = setInterval(function() {
            alive.AliveCheck()
            .then( resp => {
                if (Config.WWTester.PrintDebugOnAliveResponse) {
                    GP.DebugLog('Keep alive response: ' + JSON.stringify(resp));
                }
            })
            .catch( e => {
                // Got it back!
            });
        }, pollMS);
    })
    .catch( e => {
    });
}

// Wait for the SpaceServer to come ready (OpenSession from client)
//    then send test data to the viewer.
GP.DebugLog('Starting SpaceSErver');
GP.spaceServer.WhenReady(10000)
.then( sServer => {
    let auth = undefined; // no authentication at the moment
    let anAsset = {
        // 'id': { 'id': someID }, // not needed for creation
        'displayInfo': {
            'displayableType': 'meshset',
            'asset': {
                'url': 'http://files.misterblue.com/BasilTest/convoar/testtest88/unoptimized/testtest88.gltf',
                'loaderType': 'GLTF'
            }
        }
    };
    GP.DebugLog('Checking for test asset in config file');
    if (Config.WWTester && Config.WWTester.comm.TestAsset) {
        GP.DebugLog('Adding config test asset:' + JSON.stringify(Config.WWTester.comm.TestAsset));
        anAsset.displayInfo.asset = Config.WWTester.comm.TestAsset;
    }
    GP.client.IdentifyDisplayableObject(auth, anAsset)
    .then( resp => {
        if (resp.exception) {
            GP.DebugLog('failed creation of displayable:' + resp.exception.reason);
        }
        else {
            let displayableId = resp.objectId.id;
            GP.DebugLog('Created displayable ' + displayableId);
            let instancePositionInfo = {
                // 'id': { 'id': someID },  // not needed for creation
                'pos': {
                    'pos': { x: 100, y: 101, z: 102 },
                    // 'rot': { x: 0, y: 0, z: 0, w: 1 },
                    'posRef': BasilType.CoordSystem.WGS86,
                    'rotRef': BasilType.RotationSystem.WORLDR
                }
            };
            GP.client.CreateObjectInstance(auth, displayableId, instancePositionInfo)
            .then( resp => {
                if (resp.exception) {
                    GP.DebugLog('failed creation of instance:' + resp.exception.reason);
                }
                else {
                    let instanceId = resp.instanceId.id;
                    GP.DebugLog('Created instance ' + instanceId);
                    GP.client.RequestInstanceProperties(auth, instanceId)
                    .then( resp => {
                        if (resp.exception) {
                            GP.DebugLog('failed fetching of instance properties: ' + resp.exception.reason);
                        }
                        else {
                            if (resp.properties) {
                                GP.DebugLog('Fetched properties for ' + instanceId + ':');
                                Object.keys(resp.properties).forEach(prop => {
                                    GP.DebugLog('    ' + prop + ' => ' + resp.properties[prop]);
                                });
                            }
                        }
                    })
                }
            });
        }
        // One asset is in the scene
    });

});