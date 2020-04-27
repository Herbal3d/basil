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
import { GP } from 'GLOBALS';

import Config from './config.js';
import { Comm } from './Comm/Comm.js';
import { BTransportWW } from './Comm/BTransportWW.js';
import { BasilComm } from './Comm/BasilComm.js';
import { AbilityDisplayable } from './Items/AbilityDisplayable.js';
import { AbilityInstance } from './Items/AbilityInstance.js';

import { BasilMessage } from './jslibs/BasilMessages.js'
import { JSONstringify } from './Utilities.js';

GP.Config = Config;

// Debug function to mimic the non-WebWorker one
GP.DebugLog = function(msg) {};
GP.ErrorLog = function(msg) {};

GP.Ready = false;

GP.CM = new Comm();
GP.CM.Start();

let parms  = {};
GP.wwTransport = new BTransportWW(parms);

GP.Ready = true;

GP.client = new BasilComm(GP.wwTransport, { 'AsServer': true } );
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
        GP.DebugLog = function(msg) {
            if (GP.client && GP.client.IsReady()) {
                GP.client.UpdateProperties(Config.Debug.DebugLogInstanceName,
                        { 'Msg': msg } );
            }
            else {
                console.log('WW.DebugLog: ' + msg);
            };
        };
        GP.ErrorLog = function(msg) {
            let props = {
            };
            if (GP.client && GP.client.IsReady()) {
                GP.client.UpdateProperties(Config.Debug.DebugLogInstanceName,
                        { 'ErrorMsg': msg } );
            }
            else {
                console.log('WW.ErrorLog: ' + msg);
            };
        }
    }
}

// Start AliveCheck polling if configured
if (Config.WWTester && Config.WWTester.GenerateAliveCheck) {
    GP.client.WhenReady(10000)
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
GP.DebugLog('Starting SpaceServer');
GP.client.WhenReady(10000)
.then( sServer => {
    let displayableProps = {
        'displayableurl': 'https://files.misterblue.com/BasilTest/convoar/testtest88/unoptimized/testtest88.gltf',
        'loaderType': 'GLTF',
        'displayableType': 'meshset'
    };
    // Add the URL from the configuration file if specified
    if (Config.WWTester && Config.WWTester.comm.TestAsset) {
        displayableProps = Config.WWTester.comm.TestAsset;
    }
    let openSessionProps = GP.client.openSessionProperties;
    // Parameters could have been passed from the invoker (test info in OpenSession req)
    if (openSessionProps) {
        if (openSessionProps.TestURL) {
            displayableProps.displayableurl = openSessionProps.TestURL;
        }
        if (openSessionProps.TestLoaderType) {
            displayableProps.loaderType = openSessionProps.TestLoaderType;
        }
        if (openSessionProps.TestDisplayType) {
            displayableProps.displayableType = openSessionProps.TestDisplayType;
        }
    }
    GP.DebugLog('Asset spec for CreateItem' + JSON.stringify(displayableProps));

    let displayableItemId = undefined;
    let displayableItemIdN = undefined;
    let instanceItemId = undefined;
    let instanceItemIdN = undefined;

    // Create the initial displayable item
    let createItemProps = {};
    GP.client.CreateItem(createItemProps, [
            new AbilityDisplayable().SetFromValues(undefined, displayableProps)
    ])
    .then( resp => {
        if (resp.Exception) {
            throw new Exception('failed creation of displayable:' + resp.Exception);
        };
        displayableItemId = resp.IProps.ItemId;
        displayableItemIdN = resp.IProps.ItemIdN;
        GP.DebugLog('Created displayable. Id = ' + displayableItemId);

        // Create a displayed instance of the displayable
        createItemProps = {};
        let aProps = {
            'Pos': '[ 100, 101, 102 ]',
            'Rot':  '[ 0, 0, 0, 1 ]',
            'PosRef': '0',   // BasilMessage.CoordSystem.WGS86,
            'RotRef': '0'    // BasilMessage.RotationSystem.WORLDR
        };
        return GP.client.CreateItem(createItemProps, [
            new AbilityInstance().SetFromValues(displayableItemId, aProps)
        ]);
    })
    .then ( resp => {
        if (resp.Exception) {
            throw new Exception('failed creation of instance:' + resp.Exception);
        };
        instanceItemId = resp.IProps.ItemId;
        instanceItemIdN = resp.IProps.ItemIdN;
        GP.DebugLog('Created instance. Id = ' + instanceItemId);

        // Get the properties for the instance
        return GP.client.RequestProperties(instanceItemId);
    })
    .then ( resp => {
        if (resp.Exception) {
            throw new Exception('failed fetching properties for instance ' + instanceItemId
                + ', e=' + e);
        }
        GP.DebugLog('Fetched properties for ' + instanceItemId + ':');
        if (resp.IProps) {
            Object.keys(resp.IProps).forEach(prop => {
                GP.DebugLog('    ' + prop + ' => ' + resp.IProps[prop]);
            });
        }
        else {
            GP.ErrorLog('No properties were returned');
        };
    })
    .catch ( e => {
        GP.ErrorLog('Test failure');
        if (displayableItemId) GP.ErrorLog('    Displayable ItemId = ' + displayableItemId);
        if (instanceItemId) GP.ErrorLog('    Instance ItemId = ' + instanceItemId);
        GP.ErrorLog('    Error = ' + JSONstringify(e));

    });
});
