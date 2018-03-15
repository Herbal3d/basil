
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
import { BTransport } from './BTransport.js';

// There are two halfs: the 'service' and the 'worker'.
export default class BTransportWS extends BTransport {
    constructor(parms) {
        super();
    }
    Open(connectionString) {
    }
    Close() {
    }
    // Send the data. Places message in output queue
    // 'tcontext' is optional and used for RPC responses.
    Send(data, tcontext) {
        GP.DebugLog('BTransportWS: call of undefined Send()');
        throw new BException('BTransportWS: call of undefined Send()');
    }
    // Send a messsage and expect a replay of some type.
    // Returns a promise
    SendRPC(data) {
        GP.DebugLog('BTransportWS: call of undefined SendRPC()');
        throw new BException('BTransportWS: call of undefined SendRPC()');
    }
    // Get data in the input queue. Returns a Promise as might wait for data.
    Receive() {
        GP.DebugLog('BTransportWS: call of undefined Receive()');
        throw new BException('BTransportWS: call of undefined Receive()');
    }
    // Set a calback to be called whenever a message is received
    SetReceiveCallback(callback) {
        GP.DebugLog('BTransportWS: call of undefined SetReceiveCallback()');
        throw new BException('BTransportWS: call of undefined SetReceiveCallback()');
    }
    // Return 'true' is there is data in the input queue
    get isDataAvailable() {
        return false;
    }
    get isConnected() {
        return false;
    }
    // Return a map with statistics
    get stats() {
        return {};
    }
    // Returns type of the transport. Like 'WWS' or 'WS'.
    get type() {
        return 'BTransportWS';
    }
    // Returns a longer identifying name of transport (usually includes endpoint name)
    get info() {
        return this.type + ' none';
    }
}
