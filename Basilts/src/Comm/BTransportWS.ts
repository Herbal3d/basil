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

import { BTransport } from '@Comm/BTransport';
import { CombineParameters, CreateUniqueId } from "@Tools/Utilities";
import { BKeyedCollection } from '@Tools/bTypes';

import { Logger } from '@Tools/Logging';
import { AbMsgStats } from '@Abilities/AbilityMsgStats';

export class BTransportWS extends BTransport {
  _socket: WebSocket;

    constructor(pParams: BKeyedCollection) {
        super();
        this._params = CombineParameters(undefined, pParams, {
            'transportURL': undefined   // name of Worker to connect to
        });
    };
    async Start(pParams: BKeyedCollection): Promise<BTransport> {
        this.setLoading();
        try {
            this._socket = new WebSocket(this._params.transporturl);
            if (this._socket) {
                // Logger.debug(`BTransportWS: have socket for ${this._params.transporturl}`);
                this._socket.binaryType = 'arraybuffer';
                const _this = this;
                this._socket.onmessage = (event: MessageEvent) => {
                    _this._messages.push(new Uint8Array(event.data).buffer);
                    this.incrementProp(AbMsgStats.MessagesReceivedProp);
                    _this.PushReception();
                };
                this._socket.onopen = (event: Event) => {
                    // Logger.debug(`BTransportWS: onopen. Setting READY`);
                    _this.setReady();
                };
                return this;
            }
            else {
                const errMsg = `BTransportWS: could not open websocket: ${this._params['transporturl']}`;
                this.setFailed();
                Logger.error(errMsg);
                throw errMsg;
            };
        }
        catch (err) {
            const errr = <SyntaxError>err;
            const errMsg = `BTransportWS: exception opening websocket: ${errr.message}`;
            this.setFailed();
            Logger.error(errMsg);
            throw errMsg;
        };
    };

    Close(): void {
        this.setShutdown();
        if (this._socket) {
            this._socket.close();
            this._socket = undefined;
        };
    };

    Send(pData: ArrayBuffer): boolean {
        if (this._socket) {
            this._socket.send(pData);
            this.incrementProp(AbMsgStats.MessagesSentProp);
            return true;
        };
        return false;
    };

    // WebSocket doesn't have a routing address
    RoutingAddress(): string | undefined {
        return undefined;
    }

    get isConnected(): boolean {
        return this._socket.readyState === WebSocket.OPEN;
    };
};