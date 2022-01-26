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

import { BMessage } from '@Comm/BMessage';
import { BProtocol } from '@Comm/BProtocol';
import { BTransport, BTransportMsg } from '@Comm/BTransport';

import { CombineParameters, CreateUniqueId, ExtractStringError, JSONstringify } from "@Tools/Utilities";
import { BKeyedCollection } from '@Base/Tools/bTypes';
import { Logger } from '@Base/Tools/Logging';

// The data format is just JSON text.
export class BProtocolJSON extends BProtocol {
    _encoder = new TextEncoder();

    constructor(pParams: BKeyedCollection, pXPort: BTransport) {
        super(pXPort, CreateUniqueId('BProtocolJSON'));
        this._params = CombineParameters(undefined, pParams, {
        });
    };
    async Start(pParams: BKeyedCollection): Promise<BProtocol> {
        this._xport.SetReceiveCallback(Processor, this);
        this._xport.WhenReady().then(() => {
            this.setReady();
        })
        .catch((pErr) => {
            Logger.error(`BProtocolJSON: WhenReady on transport failed: ${ExtractStringError(pErr)}`);
        });
        return this;
    };
    Close(): void {
        if (this._xport) {
            this._xport.Close();
            this._xport = undefined;
        };
    };
    Send(pData: BMessage): boolean {
        if (this._xport) {
            this._xport.Send(this._encoder.encode(JSONstringify(pData)).buffer);
            // this._xport.Send(JSONstringify(pData));
            return true;
        };
        return false;
    };
    get isDataAvailable(): boolean {
        return false;
    };
    get isConnected(): boolean {
        return typeof(this._xport) !== 'undefined';
    };
};

// Process the incoming message
const _decoder = new TextDecoder();
function Processor(pMsg: BTransportMsg, pContext: BProtocolJSON, pXPort: BTransport): void {
    // Unpack the message into a BMessage and call the message processor
    if (pContext._receiveCallback) {
        try {
            if (typeof(pMsg) === 'string') {
                const parsedMessage = JSON.parse(pMsg);
                // Logger.debug(`BProtocolJSON: received message: ${JSONstringify(parsedMessage)}`);
                void pContext._receiveCallback(parsedMessage, pContext._receiveCallbackContext, pContext);
            }
            else {
                const parsedMessage = JSON.parse(_decoder.decode(pMsg));
                // Logger.debug(`BProtocolJSON: received message: ${JSONstringify(parsedMessage)}`);
                void pContext._receiveCallback(parsedMessage, pContext._receiveCallbackContext, pContext);
            };
        }
        catch ( err ) {
            const serror = ExtractStringError(err);        // Kludge for eslint
            const errMsg = `BProtocolJSON: error parsing JSON message: ${serror}`;
            Logger.error(errMsg);
        };
    };
};