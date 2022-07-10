// Copyright 2022 Robert Adams
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

import { BMessage, BMessageIProps } from '@Base/Comm/BMessage';
import { BasilConnection,  BasilConnectionEventParams, ServiceBasilServer } from '@Comm/BasilConnection';

import { WellKnownCameraName } from '@Base/BItem/WellKnownBItems';

import { BItemState } from '@Abilities/AbilityBItem';
import { Logger } from '@Tools/Logging';

// Test the message and throw an error if the message contains an error report
// The string error message is what is thrown
export function throwIfError(pMsg: BMessage) {
    if (pMsg.Exception) {
        throw pMsg.Exception;
    }
}
// Wait until the specified BItem reports READY
export async function WaitUntilReady(pConn: BasilConnection, pId: string): Promise<void> {
    let notReady = 1;
    while (notReady > 0) {
        const resp = await pConn.RequestProperties(pId, 'state');
        if (resp.Exception) {
            throw "Error getting properties";
        }
        const state = Number(resp.IProps['state']);
        if (state === Number(BItemState.FAILED) || state === Number(BItemState.SHUTDOWN)) {
            throw "Loadind Failed"
        }
        if (state === Number(BItemState.READY)) {
            notReady = 0;
        }
        else {
            Logger.debug(`WaitUntilReady: state=${state}. Not ready ${notReady}`);
            notReady++;
            await WaitABit(100);
        }
    }
}
// Return a Promise that is resolved in 'pTime' milliseconds
export async function WaitABit(pTime: number): Promise<void> {
    return new Promise<void>( (resolve) => {
        const timer = setTimeout( () => {
            resolve();
        }, pTime);
    })
}

// Return an integer between min (inclusive) and max (exclusive)
export function RandomInt(min:number, max:number):number {
    const imin = Math.ceil(min);
    const imax = Math.floor(max);
    return Math.floor(Math.random() * (imax - imin) + imin);
}

// =============================================================================

// Ask the client to load a test asset
export async function LoadTestAsset(pBasil: BasilConnection, pTestAssetURL: string, pTestAssetLoader: string): Promise<string> {
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

// Request the ID of the camera BItem
export async function GetCameraId(pConn: BasilConnection): Promise<string|undefined> {
    let ret: string|undefined = undefined;
    const knownBItems = await RequestProperties(pConn, 'registration.bitem', WellKnownCameraName);
    if (knownBItems[WellKnownCameraName]) {
        ret = knownBItems[WellKnownCameraName] as string;
    }
    return ret;
}

// Create the top Menu
export async function CreateTopMenuDialog(pBasil: BasilConnection): Promise<void> {
    const resp = await pBasil.CreateItem({
        abilities: [ 'Dialog' ],
        dialogUrl: './Dialogs/topMenu.html',
        dialogName: 'topMenu',
        dialogPlacement: 'menu'
    });
    if (resp.Exception) {
        throw new Error(`CreateItem dialog response error: ${resp.Exception}`);
    }
}

// Create the status dialog box in the display
export async function CreateStatusDialog(pBasil: BasilConnection): Promise<void> {
    Logger.debug(`Adding statistics and status dialog`);
    const resp = await pBasil.CreateItem({
        abilities: [ 'Dialog' ],
        dialogUrl: './Dialogs/status.html',
        dialogName: 'Status',
        dialogPlacement: 'bottom right'
    });
    if (resp.Exception) {
        throw new Error(`CreateItem dialog response error: ${resp.Exception}`);
    }
}

// Request and print the properties of the asset
export async function RequestAndPrintProperties(pBasil: BasilConnection, pId: string): Promise<BMessageIProps> {
    const resp = await pBasil.RequestProperties(pId, '');
    if (resp.Exception) {
        throw new Error(`RequestProperties response error: ${resp.Exception}`);
    }
    PrintProperties(pId, resp.IProps);
    return resp.IProps;
}

// Request and print the properties of the asset
export async function RequestProperties(pBasil: BasilConnection, pItemID: string, pFilter: string = ''): Promise<BMessageIProps> {
    Logger.debug(`requestProperties`);
    const resp = await pBasil.RequestProperties(pItemID, pFilter);
    if (resp.Exception) {
        throw new Error(`RequestProperties response error: ${resp.Exception}`);
    }
    return resp.IProps;
}

export function PrintProperties(pId: string, pProps: BMessageIProps): void {
    Logger.debug(`Properties received for item ${pId}`);
    Object.keys(pProps).forEach( key => {
        Logger.debug(`   ${key}: ${pProps[key]}`);
    });
}


