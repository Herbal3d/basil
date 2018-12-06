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

import { BException } from 'xBException';
import { BTransport as BTransportMsgs } from 'xBasilServerMessages';
import { BItem, BItemType } from 'xBItem';

import {org.herbal3d.protocol.basil as BTypes} from 'xBasilTypes';
import {org.herbal3d.protocol.basil.server as BServer} from 'xBasilServer';
import {org.herbal3d.protocol.basil as BMessage} from 'xBMessage';

// Template for transport implmentations.
export class BTransport extends BItem {
  constructor(parms) {
      super(parms.transportId, parms.transportAuth, BItemType.TRANSPORT);
      this.messages = [];
      this.stats = {};
      this.stats.messagesSent = 0;
      this.stats.messagesReceived = 0;
      this.sequenceNum = 111;
      this.aliveSequenceNum = 333;

      // The properties that can be read as a BItem
      super.DefineProperties( {
          'MessagesSent': { 'get': function() { return this.stats.messagesSent; }.bind(this) },
          'MessagesReceived': { 'get': function() { return this.stats.messagesReceived; }.bind(this) },
          'Stats': { 'get': function() { return this.stats; }.bind(this) },
          'QueueSize': { 'get': function() { return this.messages.length; }.bind(this) }
      } );
  }
  Close() {
  }
  // Send the data. Places message in output queue
  Send(fbb, xport, msgOffset, msgType, respSession, respSessionKey, auth) {
      GP.DebugLog('BTransport: call of undefined Send()');
      throw new BException('BTransport: call of undefined Send()');
  }
  // Set a callback object for recevieving messages.
  // The passed object must have a 'procMessage' method
  SetReceiveCallbackObject(callback) {
    GP.DebugLog('BTransport: call of undefined SetReceiveCallback()');
    throw new BException('BTransport: call of undefined SetReceiveCallback()');
  }

  // Check the input queue for messages and, if present, process one.
  // If 'tthis' is passed, it is used as the BTransport to push reception for.
  PushReception() {
      let msg = this.messages.shift();
      if (msg) {
          this.stats.messagesReceived++;
          let fbBuff = new flatbuffers.ByteBuffer(msg);
          let rcv = BMessage.BTransportMsg.getRootAsBTransportMsg(fbBuff);
          if (this.receiveCallbackObject
                  && this.receiveCallbackObject.procMessage
                  && (typeof this.receiveCallbackObject.procMessage == 'function')) {
              // GP.DebugLog('BTransportTest: dequeue msg: seq=' + dmsg.sequenceNum);
              this.receiveCallbackObject.procMessage(rcv);
          }
      }
  }
    // Return 'true' is there is data in the input queue
    get isDataAvailable() {
        return false;
    }
    get isConnected() {
        return false;
    }
}
