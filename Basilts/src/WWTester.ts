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

import { GP } from '@Base/Globals';

import { Config } from '@Base/WWTester.Config.ts';
import { Comm, MakeConnectionParams } from '@Comm/Comm';
import { Eventing } from '@Eventing/Eventing';
import { BasilConnection, ServiceSpaceServer, BasilConnectionEventParams, ServiceBasilServer } from '@Comm/BasilConnection';

import { ExtractStringError, JSONstringify } from '@Tools/Utilities';
import { BKeyedCollection } from './Tools/bTypes';
import { Logger, AddLogOutputter } from '@Tools/Logging';

GP.Ready = false;

let _basilClient: BasilConnection;
let _aliveIntervalID: NodeJS.Timeout;

// Setup logging: Basic console output for logging
if (Config.WWTester.LogToConsole) {
    AddLogOutputter( ( pMsg:string, pClass?: string) => {
        if (pClass) {
            /* tslint:disable-next-line */
            console.log('WORKER ERROR: ' + pMsg);
        }
        else {
            /* tslint:disable-next-line */
            console.log('WORKER: ' + pMsg);
        };
    });
};
// Setup logging: Send log messages to Basil debug BItem
if (Config.Debug && Config.Debug.DebugLogInstanceName && Config.WWTester.LogToDebugInstance) {
    AddLogOutputter( ( pMsg:string, pClass?: string) => {
        if (_basilClient && _basilClient.isReady()) {
            if (pClass) {
                void _basilClient.UpdateProperties(Config.Debug.DebugLogInstanceName,
                        { 'ErrorMsg': pMsg } );
            }
            else {
                void _basilClient.UpdateProperties(Config.Debug.DebugLogInstanceName,
                        { 'Msg': pMsg } );
            };
        };
    });
};
Eventing.init();

// Startup the testing and wait for the OpenSession
try {
    const params: MakeConnectionParams = {
        'transport': 'WW',
        'transporturl': undefined,
        'protocol': 'Basil-JSON',
        'service': ServiceBasilServer
    };
    Comm.MakeConnection(params)
    .then ( conn => {
        Logger.debug(`MakeConnection complete`);
        conn.SubscribeToMessageOp('OpenSession', ( pProps: BasilConnectionEventParams, pTopic: string) => {
            Logger.debug(`OpenSession received`);
            if (pProps.request.IProps.TestAssetURL) {
                const assetURL = pProps.request.IProps['TestAssetURL'];
                const assetLoader = pProps.request.IProps['TestAssetLoader'];
                Logger.debug(`Test asset URL: ${assetURL}, loader: ${assetLoader}`)
                LoadTestAsset(conn, assetURL, assetLoader)
                .then( () => {
                    Logger.debug(`Load test asset complete`);
                })
                .catch (e => {
                    Logger.error(`MakeConnection exception: ${ExtractStringError(e)}`);
                });
            }
            else {
                Logger.error(`OpenSession did not have a test URL: ${JSONstringify(pProps.request.IProps)}`);
            };
        });
    })
    .catch (e => {
        Logger.error(`MakeConnection exception: ${ExtractStringError(e)}`);
    });
}
catch (e) {
    const err = ExtractStringError(e);
    Logger.error(`MakeConnection exception: ${err}`);
};

// Start AliveCheck polling if configured
if (Config.WWTester && Config.WWTester.GenerateAliveCheck) {
    _basilClient.WhenReady(10000)
    .then( alive => {
        const pollMS = Config.WWTester.AliveCheckPollMS
                    ? Config.WWTester.AliveCheckPollMS : 10000;
        // Start alive polling
        _aliveIntervalID = setInterval(function() {
            (alive as BasilConnection).AliveCheck()
            .then( resp => {
                if (Config.WWTester.PrintDebugOnAliveResponse) {
                    Logger.debug('Keep alive response: ' + JSON.stringify(resp));
                }
            })
            .catch( e => {
                // Got it back!
            });
        }, pollMS);
    })
    .catch( e => {
        Logger.error(`AliveCheck: Basil client never became ready`);
    });
};

async function LoadTestAsset(pBasil: BasilConnection, pTestAssetURL: string, pTestAssetLoader: string): Promise<void> {
    Logger.debug(`LoadTestAsset`);
    /*
    let displayableProps = {
        'displayableurl': 'https://files.misterblue.com/BasilTest/convoar/testtest88/unoptimized/testtest88.gltf',
        'loaderType': 'GLTF',
        'displayableType': 'meshset'
    };
    let openSessionProps = _basilClient.openSessionProperties;
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
    Logger.debug('Asset spec for CreateItem' + JSON.stringify(displayableProps));

    let displayableItemId = undefined;
    let displayableItemIdN = undefined;
    let instanceItemId = undefined;
    let instanceItemIdN = undefined;

    // Create the initial displayable item
    let createItemProps = {};
    _basilClient.CreateItem(createItemProps)
    .then (resp => {
        _basilClient.addAbility()

    })
            new AbilityDisplayable().SetFromValues(displayableProps)
    ])
    .then( resp => {
        if (resp.Exception) {
            throw new Exception('failed creation of displayable:' + resp.Exception);
        };
        displayableItemId = resp.IProps.ItemId;
        displayableItemIdN = resp.IProps.ItemIdN;
        Logger.debug('Created displayable. Id = ' + displayableItemId);

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
        Logger.debug('Created instance. Id = ' + instanceItemId);

        // Get the properties for the instance
        return _basilClient.RequestProperties(instanceItemId);
    })
    .then ( resp => {
        if (resp.Exception) {
            throw new Exception('failed fetching properties for instance ' + instanceItemId
                + ', e=' + e);
        }
        Logger.debug('Fetched properties for ' + instanceItemId + ':');
        if (resp.IProps) {
            Object.keys(resp.IProps).forEach(prop => {
                Logger.debug('    ' + prop + ' => ' + resp.IProps[prop]);
            });
        }
        else {
            Logger.error('No properties were returned');
        };
    })
    .catch ( e => {
        Logger.error('Test failure');
        if (displayableItemId) Logger.error('    Displayable ItemId = ' + displayableItemId);
        if (instanceItemId) Logger.error('    Instance ItemId = ' + instanceItemId);
        Logger.error('    Error = ' + JSONstringify(e));

    });
    */
};
