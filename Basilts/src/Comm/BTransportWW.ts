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

import { BTransport, BTransportMsg } from '@Comm/BTransport';
import { MessagesReceivedProp, MessagesSentProp } from '@Abilities/AbilityMsgStats';

import { CombineParameters, CreateUniqueId, ExtractStringError } from "@Tools/Utilities";
import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Base/Tools/Logging';

export class BTransportWW extends BTransport {
    _worker: Worker;
    _isWorker: boolean = false;

    constructor(pParams: BKeyedCollection) {
        super();
        Logger.debug(`BTransportWW: setting up WebWorker transport`);
        this._params = CombineParameters(undefined, pParams, {
            'transportURL': undefined   // name of Worker to connect to
        });
    };
    async Start(pParams: BKeyedCollection): Promise<BTransport> {
        this.setLoading();

        // For some reason the WorkerGlobalScope variable is not known by TypeScript
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (typeof(WorkerGlobalScope) === 'undefined') {
            // We're the master
            // this.params.transporturl is WebWorker URL to connect to
            try {
                this._worker = new Worker(this._params.transporturl);
                if (this._worker) {
                    this._isWorker = false;
                    const _this = this;
                    this._worker.onmessage = (evnt: MessageEvent) => {
                        _this._messages.push(evnt.data);
                        _this.incrementProp(MessagesReceivedProp);
                        _this.PushReception();
                    };
                    this._worker.onerror = (err: ErrorEvent) => {
                        Logger.error(`BTransportWW: worker error: reason: ${err.message}`);
                        _this.Close();
                    };
                    this.setReady();
                    return this;
                }
                else {
                    throw `BTransportWW: unable to open WebWorker at ${this._params.transporturl}`;
                }
            }
            catch(e) {
                const ee = ExtractStringError(e);
                const emsg = `BTransportWW: exception initializing worker: ${ee}`;
                Logger.error(emsg);
                throw emsg;
            };
        }
        else {
            // We're the worker
            this._isWorker = true;
            const _this = this;
            onmessage = (evnt: MessageEvent) => {
                _this._messages.push(evnt.data);
                _this.incrementProp(MessagesReceivedProp);
                _this.PushReception();
            };
            this.setReady();
            return this;
        };
    };

    Close(): void {
        this.setShutdown();
        if (this._worker) {
            this._worker.terminate();
            this._worker = undefined;
        };
    };

    Send(pData: BTransportMsg): boolean {
        if (this._worker) {
            this._worker.postMessage(pData);
        }
        else {
            (self as unknown as Worker).postMessage(pData);
        };
        this.incrementProp(MessagesSentProp);
        return true;
    };

    get isConnected(): boolean {
        return false;
    };
};

