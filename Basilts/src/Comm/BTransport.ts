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

import { BItem } from '@BItem/BItem';

import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Base/Tools/Logging';
import { AbilityMsgStats } from '@Abilities/AbilityMsgStats';

export type BTransportMsg = ArrayBuffer;
// On reception, the receiver gets a raw message to deserialize
export type BTransportReceptionCallback = (pMsg: BTransportMsg, pContext: any, pTransport: BTransport) => void;

// Transport sends and receives buffers of bytes
export abstract class BTransport extends BItem {
    _params: BKeyedCollection;
    _messages: BTransportMsg[];
    _receiveCallback: BTransportReceptionCallback;
    _receiveCallbackContext: any;

    constructor(pLayer?: string) {
        super(undefined, pLayer);
        this._messages = [];
        this._receiveCallback = undefined;
        this.addAbility(new AbilityMsgStats());
    };

    abstract Start(pParams: BKeyedCollection): Promise<BTransport>;

    abstract Close(): void;

    // Note that is function is not async. It can hang.
    abstract Send(pData: BTransportMsg): boolean;

    SetReceiveCallback(pCallBack: BTransportReceptionCallback, pContext?: BItem): void {
      this._receiveCallback = pCallBack;
      this._receiveCallbackContext = pContext;
    };

    // Push the reception of a message.
    // Returns 'true' if a message was processed.
    // TODO: should this be a Promise or something to not tie up reception?
    PushReception(): boolean {
        // Logger.debug(`BTransport: PushReception: ${this._messages.length} messages`);
        const msg = this._messages.shift();
        if (msg) {
            if (this._receiveCallback && (typeof(this._receiveCallback) === 'function')) {
                this._receiveCallback(msg, this._receiveCallbackContext, this);
            }
            else {
                Logger.error('BTransport.PushReception: msg received but no message processor');
            };
            return true;
        };
        return false;
    };

    get isDataAvailable(): boolean {
      return this._messages.length > 0;
    };

    abstract isConnected: boolean;
};

