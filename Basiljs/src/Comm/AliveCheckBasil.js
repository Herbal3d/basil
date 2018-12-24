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
import { BasilSpaceStream  } from "../jslibs/BasilServerMessages.js"

import { CombineParameters, CreateUniqueId } from '../Utilities.js';

// Alive check processing that happens in the Basil Server.
export class AliveCheckBasilConnection extends MsgProcessor {
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
        this.RegisterMsgProcess(this.transport, /*    sends */ BasilSpaceStream.SpaceStreamMessage,
                                                /* receives */ BasilSpaceStream.BasilStreamMessage, {
            'AliveCheckRespMsg': [ this._ProcAliveCheckResp.bind(this), undefined ]
        });
    };

    AliveCheck(auth) {
        let msg = {};
        if (auth) msg['auth'] = auth;
        msg['time'] = Date.now(),
        msg['sequenceNum']  = this.aliveSequenceNum++
        // GP.DebugLog('AliveCheckBasil.AliveCheck: sending: ' + JSON.stringify(msg));
        return this.SendAndPromiseResponse(msg, 'AliveCheck');
    };

    _ProcAliveCheckResp(req) {
        // Match response with sent alive check
        return {
        };
    };
}