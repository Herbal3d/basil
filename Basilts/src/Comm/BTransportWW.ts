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
import { Logger } from '@Base/Tools/Logging';

export class BTransportWW extends BTransport {
    _worker: Worker;
    _isWorker: boolean = false;

    constructor(pParams: BKeyedCollection) {
        super(CreateUniqueId('BTransportWW'), 'org.herbal3d.b.transport.ww');
        const params = CombineParameters(undefined, pParams, {
            'transportURL': undefined   // name of Worker to connect to
        });

    };
    async Start(pParams: BKeyedCollection): Promise<BTransport> {
        this.setLoading();
        return new Promise( (resolve, reject) => {
            // @ts-ignore
            if (typeof WorkerGlobalScope === 'undefined') {
                // We're the master
                // this.params.transporturl is WebWorker URL to connect to
                try {
                    this._worker = new Worker(this._params.transporturl);
                    this._isWorker = false;
                    this._worker.onmessage = function(evnt: Event) {
                        this.messages.push((evnt as any).data);
                        this.stats.messagesReceived++;
                        this.PushReception();
                    }.bind(this);
                    this._worker.onerror = function(err: Error) {
                        Logger.error(`BTransportWW: worker error: reason: ${err.message}`);
                        this.Close();
                    }.bind(this);
                    this.setReady();
                    resolve(this);
                }
                catch(e) {
                    const emsg = `BTransportWW: exception initializing worker: ${e}`;
                    Logger.error(emsg);
                    reject(emsg);
                }
            }
            else {
                // We're the worker
                this._isWorker = true;
                onmessage = function(evnt: Event) {
                    this.messages.push((evnt as any).data);
                    this.PushReception();
                }.bind(this);
                this.setReady();
                resolve(this);
            };
        });
    };

    Close(): void {
        this.setShutdown();
        if (this._worker) {
            this._worker.terminate();
            this._worker = undefined;
        };
    };

    Send(pData: any): boolean {
        if (this._worker) {
            this._worker.postMessage(pData);
        }
        else {
            // @ts-ignore
            postMessage(pData);
        };
        this._stats.messagesSent++;
        return true;
    };

    get isConnected(): boolean {
        return false;
    };
};

