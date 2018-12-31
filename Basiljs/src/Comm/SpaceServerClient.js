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

import { CreateUniqueId, CombineParameters } from '../Utilities.js';

// Interface for a client talking to a SpaceServer over the Basil/SpaceServer stream
export class SpaceServerClientConnection extends MsgProcessor {
    constructor(pTransport, pParams) {
        // Merge the passed parameters with required parameter defaults
        let params = CombineParameters(Config.comm.SpaceServerClient, pParams, {
            'id': undefined     // unique generated if non-specified
        });
        params.id = params.id ? params.id : CreateUniqueId('SpaceServerClient');
        super(params.id, undefined);
        this.params = params;
        this.transport = pTransport;
        this.RegisterMsgProcess(this.transport, /*    sends */ BasilSpaceStream.SpaceStreamMessage,
                                                /* receives */ BasilSpaceStream.BasilStreamMessage, {
            'OpenSessionRespMsg': this.HandleResponse.bind(this),
            'CloseSessionRespMsg': this.HandleResponse.bind(this),
            'CameraViewRespMsg': this.HandleResponse.bind(this),
        });
    };

    Start() {
        // this.SetReady(); // not ready until OpenSession happens
    };

    Close() {
    };

    OpenSession(auth, propertyList) {
        let msg = {};
        if (auth) msg['auth'] = auth;
        if (propertyList) msg['features'] = this.CreatePropertyList(propertyList);
        return this.SendAndPromiseResponse(msg, 'OpenSession');
    };
    CloseSession(auth, reason) {
        let msg = {};
        if (auth) msg['auth'] = auth;
        if (reason) msg['reason'] = reason;
        return this.SendAndPromiseResponse(msg, 'CloseSession');
    };
    CameraView() {

    }
}

