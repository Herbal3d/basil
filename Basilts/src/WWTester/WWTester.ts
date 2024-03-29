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

import { Config } from '@Base/Config';
import { WWConfig, initConfig } from '@Base/WWTester/WWTester.Config';
import { Comm, MakeConnectionParams } from '@Comm/Comm';
import { BasilConnection,  BasilConnectionEventParams, ServiceBasilServer } from '@Comm/BasilConnection';
import { AuthToken } from '@Tools/Auth';

import { Eventing } from '@Eventing/Eventing';

import { WaitABit, WaitUntilReady, CreateTopMenuDialog, CreateStatusDialog } from './WWTesterCommon';
import { GetCameraId } from './WWTesterCommon';
import { RequestProperties, PrintProperties } from './WWTesterCommon';

import { ExtractStringError, JSONstringify } from '@Tools/Utilities';
import { Logger, AddLogOutputter } from '@Tools/Logging';
import { CameraModes } from '@Abilities/AbilityCamera';

// For some reason ESLint thinks WWConfig is an 'any' and thus we shouldn't be
//    unsafely referencing it. It's exactly the same as the Config file which
//    it doesn't complain about. Will have to be resolved someday but
//    this is a kludge fix.
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

// TypeScript issue https://github.com/microsoft/TypeScript/issues/41628
// @ts-ignore
GlobalReady = false;

initConfig();

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

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
    try {
        // Create connection
        const conn = await doMakeConnection();
        // Start alive check when connected
        await StartAliveCheck(conn);
        // Resolve when an OpenSession is received
        const connParms = await waitForOpenSession(conn);
        if (connParms.request.IProps.testAssetURL) {
            // If an asset URL is passed, request the creation of that asset
            const assetURL = connParms.request.IProps['testAssetURL'] as string;
            const assetLoader = connParms.request.IProps['testAssetLoader'] as string;
            const assetDisplay = connParms.request.IProps['testAssetDisplay'] as string;
            const displayOpt = assetDisplay.toLowerCase().split(' ');
            Logger.debug(`Test asset URL: ${assetURL}, loader: ${assetLoader}, display: ${displayOpt}`);

            // Add the free camera to the scene
            const cameraId = await CreateFreeCamera(conn);

            // Create the status dialog box in the display
            if (displayOpt.includes('all') || displayOpt.includes('topmenu')) {
                await CreateTopMenuDialog(conn);
            }
            // Create the status dialog box in the display
            if (displayOpt.includes('all') || displayOpt.includes('status')) {
                await CreateStatusDialog(conn);
            }
            const assetId = await LoadTestAsset(conn, assetURL, assetLoader)

            // As a test, request the properties of the created asset
            await WaitUntilReady(conn, assetId);
            const props = await RequestProperties(conn, assetId);
            PrintProperties(assetId, props);
        }
    }
    catch (e) {
        Logger.error(`connection exception: ${ExtractStringError(e)}`);
    }
})();

// ====================================================================================

// Create the connection listener and return handle to it
async function doMakeConnection(): Promise<BasilConnection> {
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

        // Turn off security for just talking between me and  the Basil server
        WWConfig.security.ShouldCheckBasilServerRequestAuth = false;

        const conn = await Comm.MakeConnection(params);
        return conn;
    }
    catch (e) {
        throw new Error(`MakeConnection exception: ${ExtractStringError(e)}`);
    };
    return null;
}

// Return promise that is resolved when an OpenSession is received
async function waitForOpenSession(pConn: BasilConnection): Promise<BasilConnectionEventParams> {
    return new Promise( (resolve, reject) => {
        // @ts-ignore
        pConn.WatchMessageOp('OpenSession', (pProps: BasilConnectionEventParams, pTopic: string) => {
            Logger.debug(`OpenSession received`);
            if (pProps.request.IProps.testAssetURL) {
                // The client tells me what token to send with requests
                pProps.connection.OutgoingAuth = new AuthToken(pProps.request.IProps['clientAuth'] as string);
                // I respond with the token I want to receive for requests
                const serverAuth = new AuthToken();
                pProps.connection.IncomingAuth = serverAuth;
                pProps.response.IProps['serverAuth'] = serverAuth.token;
                pProps.response.IProps['serverVersion'] = 'WWTester';

                pProps.connection.Send(pProps.response);    // respond to the open session

                // resolve this Promise with the properties from the OpenSession request
                resolve(pProps);
            }
            else {
                const errMsg = `OpenSession did not have a test URL: ${JSONstringify(pProps.request.IProps)}`;
                Logger.error(errMsg);
                pProps.response.Exception = errMsg;
                pProps.connection.Send(pProps.response);
                reject(new Error(errMsg));
            };
        });
    });
};

// Start AliveCheck polling if configured
async function StartAliveCheck(pConn: BasilConnection): Promise<void> {
    if (WWConfig.WWTester && WWConfig.WWTester.GenerateAliveCheck) {
        pConn.WhenReady(10000)
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
};

// Ask the client to load a test asset
// Returns the ID of the created asset item
async function LoadTestAsset(pBasil: BasilConnection, pTestAssetURL: string, pTestAssetLoader: string): Promise<string> {
    const createItemProps = {
        abilities: [ 'Assembly' ,'Placement' ],
        assetUrl: pTestAssetURL,
        assetLoader: pTestAssetLoader,
        pos: [10, 11, 12]
    };
    const resp = await pBasil.CreateItem(createItemProps);
    if (resp.Exception) {
        throw new Error(`CreateItem response error: ${resp.Exception}`);
    }
    return resp.IProps.id as string;
}

async function CreateFreeCamera(pConn: BasilConnection): Promise<string> {
    const cameraId = await GetCameraId(pConn);
    const resp = await pConn.UpdateProperties(cameraId, {
        cameraMode: CameraModes.Orbit,
        pos: Config.webgl.camera.position,
        cameraTarget: Config.webgl.camera.target
    });
    return cameraId;
}