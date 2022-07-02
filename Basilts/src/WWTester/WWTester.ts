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
import { BMessage, BMessageIProps } from '@Comm/BMessage';
import { AuthToken } from '@Tools/Auth';

import { Eventing } from '@Eventing/Eventing';

import { BItemState } from '@Abilities/AbilityBItem';
import { WellKnownCameraName } from '@Base/BItem/WellKnownBItems';

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
        cameraMode: CameraModes.FreeLook,
        pos: Config.webgl.camera.initialCameraPosition,
        cameraTarget: Config.webgl.camera.initialCameraLookAt
    });
    return cameraId;
}

// Create the top Menu
async function CreateTopMenuDialog(pBasil: BasilConnection): Promise<void> {
    const resp = await pBasil.CreateItem({
        abilities: [ 'Dialog' ],
        url: './Dialogs/topMenu.html',
        dialogName: 'topMenu',
        dialogPlacement: 'menu'
    });
    if (resp.Exception) {
        throw new Error(`CreateItem dialog response error: ${resp.Exception}`);
    }
}

// Create the status dialog box in the display
async function CreateStatusDialog(pBasil: BasilConnection): Promise<void> {
    const resp = await pBasil.CreateItem({
        abilities: [ 'Dialog' ],
        url: './Dialogs/status.html',
        dialogName: 'Status',
        dialogPlacement: 'bottom right'
    });
    if (resp.Exception) {
        throw new Error(`CreateItem dialog response error: ${resp.Exception}`);
    }
}

// ====================================================================================

// Test the message and throw an error if the message contains an error report
// The string error message is what is thrown
function throwIfError(pMsg: BMessage) {
    if (pMsg.Exception) {
        throw pMsg.Exception;
    }
}
// Wait until the specified BItem reports READY
async function WaitUntilReady(pConn: BasilConnection, pId: string): Promise<void> {
    let notReady = 1;
    while (notReady > 0) {
        const resp = await pConn.RequestProperties(pId, '');
        if (resp.Exception) {
            throw "Error getting properties";
        }
        if (Number(resp.IProps['state']) === Number(BItemState.READY)) {
            notReady = 0;
        }
        else {
            Logger.debug(`WaitUntilReady: not ready ${notReady}`);
            notReady++;
            await WaitABit(100);
        }
    }
}
async function WaitABit(pTime: number): Promise<void> {
    return new Promise<void>( (resolve) => {
        const timer = setTimeout( () => {
            resolve();
        }, pTime);
    })
}

// Return an integer between min (inclusive) and max (exclusive)
function RandomInt(min:number, max:number):number {
    const imin = Math.ceil(min);
    const imax = Math.floor(max);
    return Math.floor(Math.random() * (imax - imin) + imin);
}

// ====================================================================================

// Request the ID of the camera BItem
async function GetCameraId(pConn: BasilConnection): Promise<string|undefined> {
    let ret: string|undefined = undefined;
    const knownBItems = await RequestProperties(pConn, 'registration.bitem');
    if (knownBItems[WellKnownCameraName]) {
        ret = knownBItems[WellKnownCameraName] as string;
    }
    return ret;
}

// Request and print the properties of the asset
async function RequestProperties(pBasil: BasilConnection, pItemID: string): Promise<BMessageIProps> {
    const resp = await pBasil.RequestProperties(pItemID, '');
    if (resp.Exception) {
        throw new Error(`RequestProperties response error: ${resp.Exception}`);
    }
    return resp.IProps;
}

function PrintProperties(pId: string, pProps: BMessageIProps): void {
    Logger.debug(`Properties received for item ${pId}`);
    Object.keys(pProps).forEach( key => {
        Logger.debug(`   ${key}: ${pProps[key]}`);
    });
}
