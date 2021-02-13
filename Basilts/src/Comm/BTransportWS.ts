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

import { BTransport, BTransportReceptionCallback } from '@Comm/BTransport';
import { CombineParameters, CreateUniqueId } from "@Tools/Utilities";
import { BKeyedCollection } from '@Tools/bTypes';

import { Logger } from '@Tools/Logging';

export class BTransportWS extends BTransport {
  _socket: WebSocket;

  constructor(pParams: BKeyedCollection) {
    super(CreateUniqueId('BTransportWS'), 'org.herbal3d.b.transport.ws');
    this._params = CombineParameters(undefined, pParams, {
      'transportURL': undefined   // name of Worker to connect to
    });
  };
    async Start(pParams: BKeyedCollection): Promise<BTransport> {
        this.setLoading();
        return new Promise( (resolve, reject) => {
            try {
                this._socket = new WebSocket(this._params.transporturl);
                if (this._socket) {
                    this._socket.binaryType = 'arraybuffer';
                    this._socket.addEventListener('message', function(event: Event) {
                        this.messages.push(new Uint8Array((event as any).data));
                        this.stats.messagesReceived++;
                        this.PushReception();
                    }.bind(this));
                        this._socket.addEventListener('open', function(event: Event) {
                        this.SetReady();
                    }.bind(this));
                    resolve(this);
                }
                else {
                    const errMsg = 'BTransportWS: could not open websocket: ' + this._params.transportURL;
                    this.setFailed();
                    Logger.error(errMsg);
                };
            }
            catch(err) {
                const errMsg = 'BTransportWS: exception opening websocket: ' + err.message;
                this.setFailed();
                Logger.error(errMsg);
                reject(errMsg);
            };
        });
    };

    Close(): void {
        this.setShutdown();
        if (this._socket) {
            this._socket.close();
            this._socket = undefined;
        };
    };

    Send(pData: any): boolean {
        if (this._socket) {
            this._socket.send(pData);
            this._stats.messagesSent++;
            return true;
        };
        return false;
    };

    get isConnected(): boolean {
        return this._socket.readyState === WebSocket.OPEN;
    };
};