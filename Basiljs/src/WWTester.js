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
/* global GP */ // debugging global context (ESlint)

// Global parameters and variables. "GP.variable"
import GP from 'GP';

import Config from 'xConfig';

GP.Config = Config;

// Debug function to mimic the non-WebWorker one
GP.DebugLog = function(msg) {};

import BTransportWW from './Comm/BTransportWW.js';
import { BTransport, EncodeMessage, EncodeRPCMessage, PushReception } from './Comm/BTransport.js';
import { BasilServer as BasilServerMsgs } from './jslibs/BasilServerMessages.js';
import { BException } from './BException.js';

GP.Ready = false;
GP.aliveSequenceNum = 444;

let parms  = {};
GP.wwTransport = new BTransportWW(parms);
GP.wwTransport.SetReceiveCallbackObject( {
    'procMessage': function(buff, tcontext) {
        let msg = BasilServerMsgs.BasilServerMessage.decode(buff);
        // Do something with the messsage
    }
})
GP.Ready = true;

GP.aliveIntervalID = setInterval(function() {
    SendAliveCheckReq(GP.wwTransport);
}, Config.WWTester.AliveCheckPollMS);

// Send an AliveCheckReq message
function SendAliveCheckReq(xport) {
    let bmsg = {
        'AliveCheckReqMsg': {
            'time': Date.now(),
            'sequenceNum': GP.aliveSequenceNum++
        }
    }
    let bdata = BasilServerMsgs.BasilServerMessage.encode(bmsg).finish();
    xport.SendRPC(bdata, undefined, xport);
}
