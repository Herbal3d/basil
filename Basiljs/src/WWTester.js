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
import * as BasilClient from 'xBasilClient';
import BTransportWW from 'xBTransportWW';
import { BException } from 'xBException';

GP.Config = Config;

// Debug function to mimic the non-WebWorker one
GP.DebugLog = function(msg) {};

GP.Ready = false;

let parms  = {};
GP.wwTransport = new BTransportWW(parms);
/*
GP.wwTransport.SetReceiveCallbackObject( {
    'procMessage': function(buff, tcontext) {
        let msg = BasilServerMsgs.BasilServerMessage.decode(buff);
        // Do something with the messsage
    }
})
*/
GP.Ready = true;

GP.client = BasilClient.NewBasilClient('client', GP.wwTransport, {} );

GP.client.OpenSession(undefined, {
    'originator': 'com.basil.b.tester'
})
.then( resp => {
    GP.aliveIntervalID = setInterval(function() {
        GP.client.AliveCheck()
        .then( resp => {
        // Got it back!
        })
        .catch( e => {
        // Got it back!
        });
    }, Config.WWTester.AliveCheckPollMS);
});
