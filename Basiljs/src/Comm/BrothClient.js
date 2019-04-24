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

import { CreateUniqueId, CombineParameters } from '../Utilities.js';

// Interface for a client talking to a SpaceServer over the Basil/SpaceServer stream
export class BrothClientConnection extends MsgProcessor {
    constructor(pTransport, pParams) {
        // Merge the passed parameters with required parameter defaults
        let params = CombineParameters(Config.comm.SpaceServerClient, pParams, {
            'id': undefined     // unique generated if non-specified
        });
        params.id = params.id ? params.id : CreateUniqueId('BrothClient');
        super(params.id, undefined);
        this.params = params;
        this.transport = pTransport;
        let processors = new Map();
        processors.set(BasilMessageOps.get('RegisterTopicResp'), this.HandleResponse.bind(this));
        processors.set(BasilMessageOps.get('DeregisterTopicResp'), this.HandleResponse.bind(this));
        processors.set(BasilMessageOps.get('SubscribeResp'), this.HandleResponse.bind(this));
        processors.set(BasilMessageOps.get('UnsubscribeResp'), this.HandleResponse.bind(this));
        processors.set(BasilMessageOps.get('SendEventResp'), this.HandleResponse.bind(this));
        processors.set(BasilMessageOps.get('EventResp'), this._procEventReceived.bind(this));
        processors.set(BasilMessageOps.get('SubscriptionMadeResp'), this._procSubscriptionMade.bind(this));
        processors.set(BasilMessageOps.get('SubscriptionClearResp'), this._procSubscriptionClear.bind(this));
        this.RegisterMsgProcess(this.transport, processors);
    };

    Start() {
    };

    Close() {
    };

    RegisterTopic(auth, topic, propertyList) {
        let msg = { 'op': BasilMessageOps.get('RegisterTopicReq') };
        if (auth) msg['auth'] = auth;
        msg['topic'] = topic;
        if (propertyList) msg['properties'] = this.CreatePropertyList(propertyList);
        return this.SendAndPromiseResponse(msg);
    };
    DeregisterTopic(auth, topic) {
        let msg = { 'op': BasilMessageOps.get('DeregisterTopicReq') };
        if (auth) msg['auth'] = auth;
        if (reason) msg['reason'] = reason;
        return this.SendAndPromiseResponse(msg);
    };
    Subscribe(auth, topic, propertyList) {
        let msg = { 'op': BasilMessageOps.get('SubscribeReq') };
        if (auth) msg['auth'] = auth;
        msg['topic'] = topic;
        if (propertyList) msg['properties'] = this.CreatePropertyList(propertyList);
        return this.SendAndPromiseResponse(msg);
    }
    Unsubscribe(auth, topic) {
        let msg = { 'op': BasilMessageOps.get('UnsubscribeReq') };
        if (auth) msg['auth'] = auth;
        msg['topic'] = topic;
        return this.SendAndPromiseResponse(msg);
    }
    SendEvent(auth, topic, featureList) {
        let msg = { 'op': BasilMessageOps.get('SendEventReq') };
        if (auth) msg['auth'] = auth;
        msg['topic'] = topic;
        if (featureList) msg['features'] = this.CreatePropertyList(featureList);
        return this.SendAndPromiseResponse(msg);
    }
    SendEventNoWait(auth, topic, featureList) {
        let msg = { 'op': BasilMessageOps.get('SendEventReq') };
        if (auth) msg['auth'] = auth;
        msg['topic'] = topic;
        if (featureList) msg['features'] = this.CreatePropertyList(featureList);
        this.SendMessage(msg);
    }

    _procEventReceived(responseMsg) {

    }
    _procSubscriptionMade(responseMsg) {

    }
    _procSubscriptionClear(responseMsg) {

    }
}