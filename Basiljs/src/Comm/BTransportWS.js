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
import { BException } from 'xBException';

// There are two halfs: the 'service' and the 'worker'.
export class BTransportWS extends BTransport {
  constructor(parms) {
    super(parms);
    GP.DebugLog('BTransportWS constructor');
    this.itemTYpe = 'BTransport.TransportWS';
    try {
      this.tempSocket = new WebSocket(params.transportURL);
      if (this.tempSocket) {
        this.socket.addEventListener('open', event => {
          // Socket is opened so put it in a place where everyone can use it
          this.socket = this.tempSocket;
          socket.addEventListener('message', event => {
            this.messages.push(d.data);
            this.stats.messagesReceived++;
            this.PushReception();
          });
        });
      }
      else {
        let errMsg = 'BTransportWS: could not open websocket: ' + parms.transportURL;
        console.log(errMsg);
        GP.DebugLog(errMsg);
        throw new BException(errMsg);
      }
    }
    catch (e) {
      let errMsg = 'BTransportWS: exception opening websocket: ' + e;
      console.log(errMsg);
      GP.DebugLog(errMsg);
      throw new BException(errMsg);
    }
  }
  Close() {
    if (this.socket) {
      this.socket.close();
      this.socket = undefined;
    }
  }
  // Send the data. Places message in output queue
  Send(data, tcontext) {
    if (socket) {
      let emsg = this.EncodeMessage(data);
      socket.send(emsg);
      this.stats.messagesSent++;
    }

  }
  // Set a calback to be called whenever a message is received
  SetReceiveCallback(callback) {
    this.receiveCallbackObject = callback;
    // GP.DebugLog('BTransportWS: set receiveCallback');
  }
  // Return 'true' is there is data in the input queue
  get isDataAvailable() {
    return this.messsages.length > 0;
  }
  get isConnected() {
    return (typeof this.socket !== 'undefined');
  }
}
