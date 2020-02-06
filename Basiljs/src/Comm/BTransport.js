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

import { GP } from 'GLOBALS';
import Config from '../config.js';

import { BItem, BItemType } from '../Items/BItem.js';
import { BException } from '../BException.js';
import { CombineParameters, CreateUniqueId, JSONstringify } from '../Utilities.js';

// Template for transport implmentations.
export class BTransport extends BItem {
    constructor(pParams) {
        let params = CombineParameters(Config.comm.Transport, pParams, {
            'transportId': undefined,
            'transportAuth': undefined,
            'initialSequenceNumber': 111,
            'initialAliveSequenceNumber': 333
        });
        if (typeof(params.transportId) === 'undefined') {
            // Really need a unique Id for every instance of transport
            params.transportId = CreateUniqueId('transport', 'default');
        }
        super(params.transportId, params.transportauth, BItemType.TRANSPORT);
        this.layer = (Config.layers && Config.layers.comm) ? Config.layers.comm : 'org.basil.b.layer.comm';
        this.params = params;
        this.messages = [];
        this.stats = {};
        this.stats.messagesSent = 0;
        this.stats.messagesReceived = 0;
        this.sequenceNum = this.params.initialsequencenumber;
        this.aliveSequenceNum = this.params.initialalivesequencenumber;
    
        // The properties that can be read as a BItem
        super.DefineProperties( {
            'messagessent': {
                get: (th) => { return th.stats.messagesSent; },
                name: 'Transport.MessagesSent'
            },
            'messagesreceived': {
                get: (th) => { return th.stats.messagesReceived; },
                name: 'Transport.MessagesReceived'
            },
            'stats': {
                get: (th) => { return th.stats; },
                name: 'Transport.Stats'
            },
            'Transport.QueueSize': {
                get: (th) => { return th.messages.length; },
                name: 'Transport.QueueSize'
            }
        } );
    };

    Close() {
    };

    // Send the data. Places message in output queue
    Send(data, tcontext) {
        GP.ErrorLog('BTransport: call of undefined Send()');
        throw new BException('BTransport: call of undefined Send()');
    };

    // Set a callback object for recevieving messages.
    // The passed object must have a 'procMessage' method
    SetReceiveCallback(callback) {
        GP.ErrorLog('BTransport: call of undefined SetReceiveCallback()');
        throw new BException('BTransport: call of undefined SetReceiveCallback()');
    };

    // Check the input queue for messages and, if present, process one.
    // If 'tthis' is passed, it is used as the BTransport to push reception for.
    PushReception() {
        let msg = this.messages.shift();
        if (msg) {
            this.stats.messagesReceived++;

            if (this.receiveCallback
                    && (typeof this.receiveCallback == 'function')) {
                // GP.DebugLog('BTransportTest: dequeue msg: seq=' + dmsg.sequenceNum);
                this.receiveCallback(msg);
            }
            else {
                GP.ErrorLog('BTransport.PushReception: msg received but no message processor');
            };
        };
    };
    // Return 'true' is there is data in the input queue
    get isDataAvailable() {
        return false;
    };
    get isConnected() {
        return false;
    };
}
