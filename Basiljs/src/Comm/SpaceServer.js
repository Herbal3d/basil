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
import { BasilMessageOps  } from './BasilMessageOps.js';

import { CombineParameters, CreateUniqueId } from '../Utilities.js';
import { BException } from '../BException.js';

// Interface of a SpaceServer talking over the Basil/SpaceServer stream connection
export class SpaceServerConnection extends MsgProcessor {
    constructor(pTransport, pParams) {
        // Merge the passed parameters with required parameter defaults
        let params = CombineParameters(Config.comm.SpaceServer, pParams, {
            'id': undefined     // unique generated if non-specified
        });
        params.id = params.id ? params.id : CreateUniqueId('SpaceServer');
        super(params.id, undefined);
        this.params = params;
        this.transport = pTransport;

        // templates = entry_name: [ message_processor, BasilServerMessage_reply_name ]
        //      If the _reply_name is 'undefined', then the message doesn't expect a response.
        let processors = new Map()
        console.log('SpaceServer.constructor: get=' + BasilMessageOps.get('OpenSessionReq'));
        processors.set(BasilMessageOps.get('OpenSessionReq'), this._ProcOpenSession.bind(this));
        processors.set(BasilMessageOps.get('CloseSessionReq'), this._ProcCloseSession.bind(this));
        processors.set(BasilMessageOps.get('CameraViewReq'), this._ProcCameraView.bind(this));
        this.RegisterMsgProcess(this.transport, processors);
    }

    Start() {
        // this.SetReady(); // not ready until OpenSession happens
    }
    Close() {
    }

    _ProcOpenSession(req) {
        let ret = { 'op': BasilMessageOps.get('OpenSessionResp') };
        this.SetReady();
        return ret;
    }

    _ProcCloseSession(req) {
        let ret = { 'op': BasilMessageOps.get('CloseSessionResp') };
        return ret;
    }

    _ProcCameraView(req) {
        let ret = { 'op': BasilMessageOps.get('CameraViewResp') };
        return ret;
    }

}