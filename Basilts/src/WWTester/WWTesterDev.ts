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

import { WWConfig, initConfig } from '@Base/WWTester/WWTester.Config';
import { Comm, MakeConnectionParams } from '@Comm/Comm';
import { Eventing } from '@Eventing/Eventing';
import { BasilConnection,  BasilConnectionEventParams, ServiceBasilServer } from '@Comm/BasilConnection';
import { AuthToken } from '@Tools/Auth';
import { WellKnownCameraName } from '@Base/BItem/WellKnownBItems';
import { WellKnownKeyboardName } from '@Base/BItem/WellKnownBItems';
import { WellKnownMouseName } from '@Base/BItem/WellKnownBItems';
import { WellKnownEnvironName } from '@Base/BItem/WellKnownBItems';
import { BItemState } from '@Abilities/AbilityBItem';
import { CameraModes } from '@Abilities/AbilityCamera';


import { ExtractStringError, JSONstringify } from '@Tools/Utilities';
import { Logger, AddLogOutputter } from '@Tools/Logging';
import { BMessage, BMessageIProps } from '@Base/Comm/BMessage';

// For some reason ESLint thinks WWConfig is an 'any' and thus we shouldn't be
//    unsafely referencing it. It's exactly the same as the Config file which
//    it doesn't complain about. Will have to be resolved someday but
//    this is a kludge fix.
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

// TypeScript issue https://github.com/microsoft/TypeScript/issues/41628
// @ts-ignore
GlobalReady = false;

// Test object to load and display
const duckURL = 'https://files.misterblue.com/BasilTest/gltf/Duck/glTF/Duck.gltf';

// Merge our config into Config and make Config and WWConfig the same
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

Logger.debug(`Starting WWTesterDev`);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
    try {
        // Create connection
        const conn = await DoMakeConnection();
        // Start alive check when connected
        await StartAliveCheck(conn);
        // Resolve when an OpenSession is received
        const connParms = await WaitForOpenSession(conn);

        // Show properties of well known BItems.
        // await ShowWellKnownBItemProperties(conn);

        // Get the ID of the camera BItem
        const cameraId = await GetCameraId(conn);
        const height = 35.5;
        const center = [ 50, height, -50 ];

        void conn.UpdateProperties(cameraId, {
            cameraMode: CameraModes.FreeLook,
            pos: [ 70, 40, -80],
            cameraTarget: center
        });

        // Create some items and diddle them
        await CreateAndDeleteItem(conn, center)
        await WaitABit(2000);
        await CreateTenItemsAndDelete(conn, center);
        await WaitABit(2000);
        await Create125ItemsAndDelete(conn, center);
        await WaitABit(2000);
        await CreateMovingItemWithCamera(conn, cameraId, center);
    }
    catch (e) {
        Logger.error(`connection exception: ${ExtractStringError(e)}`);
    }
})();

// =============================================================================

// Create the connection listener and return handle to it
async function DoMakeConnection(): Promise<BasilConnection> {
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
        Logger.debug(`MakeConnection complete`);
        return conn;
    }
    catch (e) {
        throw new Error(`MakeConnection exception: ${ExtractStringError(e)}`);
    };
    return null;
}

// Return promise that is resolved when an OpenSession is received
async function WaitForOpenSession(pConn: BasilConnection): Promise<BasilConnectionEventParams> {
    return new Promise( (resolve, reject) => {
        // @ts-ignore
        pConn.WatchMessageOp('OpenSession', (pProps: BasilConnectionEventParams, pTopic: string) => {
            Logger.debug(`OpenSession received`);
            // The client tells me what token to send with requests
            pProps.connection.OutgoingAuth = new AuthToken(pProps.request.IProps['clientAuth'] as string);
            // I respond with the token I want to receive for requests
            const serverAuth = new AuthToken();
            pProps.connection.IncomingAuth = serverAuth;
            pProps.response.IProps['serverAuth'] = serverAuth.token;
            pProps.response.IProps['serverVersion'] = 'WWTester';

            pProps.connection.Send(pProps.response);

            resolve(pProps);
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

// =============================================================================
// Print out the properties of the well known devices
async function ShowWellKnownBItemProperties(pConn: BasilConnection): Promise<void> {
    const knownBItems = await RequestProperties(pConn, 'registration.bitem');
    if (knownBItems[WellKnownCameraName]) {
        const cameraProps = await RequestProperties(pConn, knownBItems[WellKnownCameraName] as string);
        PrintProperties('camera', cameraProps);
    }
    if (knownBItems[WellKnownMouseName]) {
        const mouseProps = await RequestProperties(pConn, knownBItems[WellKnownMouseName] as string);
        PrintProperties('mouse', mouseProps);
    }
    if (knownBItems[WellKnownKeyboardName]) {
        const keyboardProps = await RequestProperties(pConn, knownBItems[WellKnownKeyboardName] as string);
        PrintProperties('keyboard', keyboardProps);
    }
    if (knownBItems[WellKnownEnvironName]) {
        const environProps = await RequestProperties(pConn, knownBItems[WellKnownEnvironName] as string);
        PrintProperties('environ', environProps);
    }
};

// Request the ID of the camera BItem
async function GetCameraId(pConn: BasilConnection): Promise<string|undefined> {
    let ret: string|undefined = undefined;
    const knownBItems = await RequestProperties(pConn, 'registration.bitem');
    if (knownBItems[WellKnownCameraName]) {
        ret = knownBItems[WellKnownCameraName] as string;
    }
    return ret;
}

// Create one item, delete it, and verify it has been deleted
async function CreateAndDeleteItem(pConn: BasilConnection, pCenter: number[]): Promise<void> {
    Logger.info(`CreateAndDeleteItem: enter`);
    const createResp = await pConn.CreateItem({
        abilities: [ 'Assembly' ,'Placement' ],
        assetUrl: duckURL,
        assetLoader: 'gltf',
        pos: pCenter
    });
    throwIfError(createResp);
    const createdId = createResp.IId;
    Logger.info(`CreateAndDeleteItem: created ${createdId}`);
    await RequestAndPrintProperties(pConn, createdId);

    await WaitUntilReady(pConn, createdId);

    Logger.info(`CreateAndDeleteItem: before delete`);
    const deleteResp = await pConn.DeleteItem(createdId);
    throwIfError(deleteResp);

    try {
        await RequestAndPrintProperties(pConn, createdId);
        Logger.info(`CreateAndDeleteItem: FAILURE - deleted item found`);
    }
    catch (e) {
        Logger.info(`CreateAndDeleteItem: SUCCESS - deleted item not found`);
    }

    return ;
}
// Create 10 items, delete one of them, and check to make sure there are nine items left
async function CreateTenItemsAndDelete(pConn: BasilConnection, pCenter: number[]): Promise<void> {
    const sep = 3;
    const items: string[] = [];
    // Create 10 items
    for (let ii=0; ii<10; ii++) {
        const createResp = await pConn.CreateItem({
            abilities: [ 'Assembly' ,'Placement' ],
            assetUrl: duckURL,
            assetLoader: 'gltf',
            pos: [pCenter[0], pCenter[1], pCenter[2] + (ii * sep)]
        });
        throwIfError(createResp);
        items.push(createResp.IId);
    }

    // Wait until the last one is ready
    await WaitUntilReady(pConn, items[items.length-1]);

    // Delete the items one at a time
    const delItems = [...items];
    while (delItems.length > 0) {
        const rand = RandomInt(0, delItems.length);
        const toDelId = delItems.splice(rand, 1);
        const deleteResp = await pConn.DeleteItem(toDelId[0]);
        throwIfError(deleteResp);
        await WaitABit(500);
    }

    // Verify all items are gone
    // TODO:

    return;
}
// Create a 5x5x5 array of Items, delete them slowly, and verify they were deleted
async function Create125ItemsAndDelete(pConn: BasilConnection, pCenter: number[]): Promise<void> {
    const sep = 3;
    const items: string[] = [];
    // Create 125 items
    for (let ii=0; ii<5; ii++) {
        for (let jj=0; jj<5; jj++) {
            for (let kk=0; kk<5; kk++) {
                const createResp = await pConn.CreateItem({
                    abilities: [ 'Assembly' ,'Placement' ],
                    assetUrl: duckURL,
                    assetLoader: 'gltf',
                    pos: [pCenter[0] + (ii * sep), pCenter[1] + (jj * sep), pCenter[2] + (kk * sep)]
                });
                throwIfError(createResp);
                items.push(createResp.IId);
            }
        }
    }

    // Wait until the last one is ready
    await WaitUntilReady(pConn, items[items.length-1]);

    // Delete the items but don't wait for the response
    const delItems = [...items];
    while (delItems.length > 0) {
        const rand = RandomInt(0, delItems.length);
        const toDelId = delItems.splice(rand, 1);
        void pConn.DeleteItem(toDelId[0]);
        // const deleteResp = await pConn.DeleteItem(toDelId[0]);
        // throwIfError(deleteResp);
        // await WaitABit(100);
    }

    // Verify all items are gone
    // TODO:

    return;
}

// Create a moving item and setup a follow camera
async function CreateMovingItemWithCamera(pConn: BasilConnection, pCameraId: string, pCenter: number[]): Promise<void> {

    const step = 40;
    const lastStep = step * 5;
    const center = pCenter;
    const radius = 5;

    const landCreateResp = await pConn.CreateItem({
        abilities: [ 'Assembly' ,'Placement' ],
        assetUrl: 'https://files.misterblue.com/BasilTest/convoar/testtest88/unoptimized/testtest88.gltf',
        assetLoader: 'gltf',
        pos: [0, 0, 0]
    });
    throwIfError(landCreateResp);
    const landId = landCreateResp.IId;
    Logger.info(`CreateMovingItemWithCamera: background asset ${landId}`);

    const createResp = await pConn.CreateItem({
        abilities: [ 'Assembly' ,'Placement' ],
        assetUrl: duckURL,
        assetLoader: 'gltf',
        // pos: [10, height, 10]
        pos: [center[0] + Math.cos(0) * radius, center[1], center[2] + Math.sin(0) * radius]
    });
    throwIfError(createResp);
    const createdId = createResp.IId;
    Logger.info(`CreateMovingItemWithCamera: moving asset ${createdId}`);

    // Setup the follow camera that watches our created item
    const camResp = await pConn.UpdateProperties(pCameraId, {
        cameraMode: CameraModes.ThirdPerson,
        cameraTargetAvatarId: createdId,
        cameraDisplacement: [ 0, 3.0, -20.0 ]
    });
    /*
    const camResp = await pConn.UpdateProperties(pCameraId, {
        cameraMode: CameraModes.FreeLook,
        cameraTarget: center,
        pos: [ 50, 70, -20 ]
    });
    */

    await CreateStatusDialog(pConn);

    // Wait for things to be loaded before moving stuff around
    await WaitUntilReady(pConn, landId);
    await WaitUntilReady(pConn, createdId);
    Logger.info(`CreateMovingItemWithCamera: assets are ready`);

    // Do the moving and wrap it in a Promise so we can await until it's finished
    await new Promise<void>( (resolve) => {
        let moveCount = 0;
        const _intervalHandle = setInterval(() => {
            const rads = (moveCount % step) / step * Math.PI * 2;
            const xx = center[0] + Math.cos(rads) * radius
            const yy = center[1];
            const zz = center[2] + Math.sin(rads) * radius
            moveCount++;
            void pConn.UpdateProperties(createdId, {
                posTo: [ xx, yy, zz ]
            });
            if (moveCount > lastStep) {
                clearInterval(_intervalHandle);
                // Delete the one item we've been moving around
                const deleteResp = pConn.DeleteItem(createdId);
                // reset camera to viewing the scene
                void pConn.UpdateProperties(pCameraId, {
                    cameraMode: CameraModes.FreeLook,
                    pos: [ 50, 70, -50],
                    cameraTarget: center
                });
                resolve();
            };
        }, 200);
    })
}

// ========================================================================

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

// =============================================================================

// Ask the client to load a test asset
async function LoadTestAsset(pBasil: BasilConnection, pTestAssetURL: string, pTestAssetLoader: string): Promise<string> {
    Logger.debug(`LoadTestAsset`);
    const createItemProps = {
        abilities: [ 'Assembly' ,'Placement' ],
        assetUrl: pTestAssetURL,
        assetLoader: pTestAssetLoader,
        pos: [10, 11, 12]
    };
    Logger.debug(`Before CreateItem`);
    const resp = await pBasil.CreateItem(createItemProps);
    if (resp.Exception) {
        throw new Error(`CreateItem response error: ${resp.Exception}`);
    }
    return resp.IProps.id as string;
}

// Create the status dialog box in the display
async function CreateStatusDialog(pBasil: BasilConnection): Promise<void> {
    Logger.debug(`Adding statistics and status dialog`);
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

// Request and print the properties of the asset
async function RequestAndPrintProperties(pBasil: BasilConnection, pId: string): Promise<BMessageIProps> {
    const resp = await pBasil.RequestProperties(pId, '');
    if (resp.Exception) {
        throw new Error(`RequestProperties response error: ${resp.Exception}`);
    }
    PrintProperties(pId, resp.IProps);
    return resp.IProps;
}

// Request and print the properties of the asset
async function RequestProperties(pBasil: BasilConnection, pItemID: string): Promise<BMessageIProps> {
    Logger.debug(`requestProperties`);
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
