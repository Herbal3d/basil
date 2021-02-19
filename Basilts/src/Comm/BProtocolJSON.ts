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
import { BProtocol, BProtocolReceptionCallback } from '@Comm/BProtocol';
import { BTransport } from '@Comm/BTransport';

import { CombineParameters, CreateUniqueId, JSONstringify } from "@Tools/Utilities";
import { BKeyedCollection } from '@Base/Tools/bTypes';
import { Logger } from '@Base/Tools/Logging';

// The data format is just JSON text.
export class BProtocolJSON extends BProtocol {
    constructor(pParams: BKeyedCollection, pXPort: BTransport) {
        super(pXPort, CreateUniqueId('BProtocolJSON'), 'org.herbal3d.b.protocol.fb');
        this._params = CombineParameters(undefined, pParams, {
        });
    };
    async Start(pParams: BKeyedCollection): Promise<BProtocol> {
        this._xport.SetReceiveCallback(Processor, this);
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
            this._xport.Send(JSONstringify(pData));
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
function Processor(pMsg: any, pContext: BProtocolJSON, pXPort: BTransport) {
    // Unpack the message into a BMessage
    try {
        const parsedMessage = JSON.parse(pMsg);
        if (pContext._receiveCallback) {
            pContext._receiveCallback(parsedMessage, pContext._receiveCallbackContext, pContext);
        };
    }
    catch ( err ) {
        const errMsg = `BProtocolJSON: error parsing JSON message: ${err}`;
        Logger.error(errMsg);
    };
};