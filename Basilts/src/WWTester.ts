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

import { GlobalReady } from '@Base/Globals';

import { WWConfig } from '@Base/WWTester.Config';
import { Comm, MakeConnectionParams } from '@Comm/Comm';
import { Eventing } from '@Eventing/Eventing';
import { BasilConnection,  BasilConnectionEventParams, ServiceBasilServer } from '@Comm/BasilConnection';
import { AuthToken } from '@Tools/Auth';

import { ExtractStringError, JSONstringify } from '@Tools/Utilities';
import { Logger, AddLogOutputter } from '@Tools/Logging';

// For some reason ESLint thinks WWConfig is an 'any' and thus we shouldn't be
//    unsafely referencing it. It's exactly the same as the Config file which
//    it doesn't complain about. Will have to be resolved someday but
//    this is a kludge fix.
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

// TypeScript issue https://github.com/microsoft/TypeScript/issues/41628
// @ts-ignore
GlobalReady = false;

let _basilClient: BasilConnection;
let _aliveIntervalID: NodeJS.Timer;

// Setup logging: Basic console output for logging
if (WWConfig.WWTester.LogToConsole) {
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
if (WWConfig.Debug && WWConfig.Debug.DebugLogInstanceName && WWConfig.WWTester.LogToDebugInstance) {
    AddLogOutputter( ( pMsg:string, pClass?: string) => {
        if (_basilClient && _basilClient.isReady()) {
            if (pClass) {
                void _basilClient.UpdateProperties(WWConfig.Debug.DebugLogInstanceName,
                        { 'ErrorMsg': pMsg } );
            }
            else {
                void _basilClient.UpdateProperties(WWConfig.Debug.DebugLogInstanceName,
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
        'transportURL': undefined,
        'protocol': 'Basil-JSON',
        'service': ServiceBasilServer,
        'clientAuth': 'xxxx',
        'serviceAuth': 'yyyy'
    };
    Comm.MakeConnection(params)
    .then ( conn => {
        Logger.debug(`MakeConnection complete`);
        conn.SubscribeToMessageOp('OpenSession', ( pProps: BasilConnectionEventParams, pTopic: string) => {
            Logger.debug(`OpenSession received`);
            if (pProps.request.IProps.testAssetURL) {
                const assetURL = pProps.request.IProps['testAssetURL'] as string;
                const assetLoader = pProps.request.IProps['testAssetLoader'] as string;
                Logger.debug(`Test asset URL: ${assetURL}, loader: ${assetLoader}`)

                // The client tells me what token to send with requests
                pProps.connection.OutgoingAuth = new AuthToken(pProps.request.IProps['clientAuth'] as string);
                // I respond with the token I want to receive for requests
                const serverAuth = new AuthToken();
                pProps.connection.IncomingAuth = serverAuth;
                pProps.response.IProps['serverAuth'] = serverAuth.token;

                pProps.connection.Send(pProps.response);

                void LoadTestAsset(conn, assetURL, assetLoader)
            }
            else {
                const errMsg = `OpenSession did not have a test URL: ${JSONstringify(pProps.request.IProps)}`;
                Logger.error(errMsg);
                pProps.response.Exception = errMsg;
                pProps.connection.Send(pProps.response);
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
if (WWConfig.WWTester && WWConfig.WWTester.GenerateAliveCheck) {
    _basilClient.WhenReady(10000)
    .then( alive => {
        const pollMS = WWConfig.WWTester.AliveCheckPollMS
                    ? WWConfig.WWTester.AliveCheckPollMS : 10000;
        // Start alive polling
        _aliveIntervalID = setInterval(function() {
            (alive as BasilConnection).AliveCheck()
            .then( resp => {
                if (WWConfig.WWTester.PrintDebugOnAliveResponse) {
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
    let createdItemId: string;
    const createItemProps = {
        abilities: [ 'Assembly' ,'Placement' ],
        assetUrl: pTestAssetURL,
        assetLoader: pTestAssetLoader,
        pos: [10, 11, 12]
    };
    Logger.debug(`Before CreateItem`);
    pBasil.CreateItem(createItemProps)
    .then ( resp => {
        Logger.debug(`Response from CreateItem`);
        if (typeof(resp.Exception) === 'undefined') {
            createdItemId = resp.IProps.id as string;

            Logger.debug(`Before RequestProperties`);
            pBasil.RequestProperties(createdItemId, '')
            .then ( resp2 => {
                if (resp2.Exception) {
                    Logger.debug(`RequestProperties returned error: ${resp.Exception}`);
                }
                else {
                    Logger.debug(`Properties received for item ${createdItemId}`);
                    Object.keys(resp2.IProps).forEach( key => {
                        Logger.debug(`   ${key}: ${resp2.IProps[key]}`);
                    });
                };
            })
            .catch ( e => {
                Logger.debug(`Exception from RequestProperties: ${ExtractStringError(e)}`);
            });
        }
        else {
            Logger.debug(`CreateItem returned error: ${resp.Exception}`);
        };
    })
    .catch ( e => {
        Logger.debug(`Exception from CreateItem: ${ExtractStringError(e)}`);
    });
};
