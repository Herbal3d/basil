// Copyright 2018 Robert Adams
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

import GP from 'GP';
import Config from '../config.js';

import { MsgProcessor } from './MsgProcessor.js';
import { BasilMessageOps } from './BasilMessageOps.js';

import { CombineParameters, CreateUniqueId } from '../Utilities.js';

// Alive check processing that happens in the Basil Server.
export class AliveCheckConnection extends MsgProcessor {
    constructor(pTransport, pParams) {
        // Merge the passed parameters with required parameter defaults
        let params = CombineParameters(Config.comm.AliveCheckBasil, pParams, {
            'beginningAliveSequenceNumber': 888,
            'id': undefined     // unique generated if non-specified
        });
        params.id = params.id ? params.id : CreateUniqueId('AliveCheckBasil');
        super(params.id, undefined);
        this.params = params;
        this.transport = pTransport;
        this.aliveSequenceNum = this.params.beginningAliveSequenceNumber;

        let processors = new Map();
        processors.set(BasilMessageOps.get('AliveCheckReq'), this._ProcAliveCheckReq.bind(this));
        processors.set(BasilMessageOps.get('AliveCheckResp'), this.HandleResponse.bind(this));
        this.RegisterMsgProcess(this.transport, processors);
        this.SetReady();
    };

    Start() {
    }
    Close() {
    }

    AliveCheck(auth) {
        let msg = { 'op': BasilMessageOps.get('AliveCheckReq') };
        if (auth) msg['auth'] = auth;
        msg['opProperties'] = {
            'time': String(Date.now()),
            'sequenceNum': String(this.aliveSequenceNum++)
        };
        // GP.DebugLog('AliveCheckBasil.AliveCheck: sending: ' + JSON.stringify(msg));
        return this.SendAndPromiseResponse(msg);
    };

    _ProcAliveCheckReq(req) {
        let msg = { 'op': BasilMessageOps.get('AliveCheckResp') };
        msg['opProperties'] = {
            'time': String(Date.now()),
            'sequenceNum': String(this.aliveSequenceNum++),
            'timeReceived': req.opParameters['time'],
            'sequenceNumberReceived': req.opParameters['sequenceNum']
        };
        return msg;
    };
}