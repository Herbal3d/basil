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

import { BItem, BItemType, BItemState } from '../Items/BItem.js';

import { BasilMessage } from "../jslibs/BasilServerMessages.js"
import { BasilMessageOps } from "./BasilMessageOps.js";
import { RandomIdentifier, JSONstringify } from '../Utilities.js';
import { ExpirationNever } from '../Auth/Auth.js';

// A class which is instanced for each transport system and
//   maps received messsages to the message processors.
// The static dictionary 'MsgProcessor.processors' contains the map of
//   received message name to the processing routine for each transport Id.
class TransportReceiver {
    constructor(pTransport, pContext) {
        this.transport = pTransport;
        this.context = pContext;
    }

    Process(msg) {
        if (Config.Debug && Config.Debug.MsgProcessorProcessPrintMsg) {
            GP.DebugLog('MsgProcessor.Process: received: ' + JSONstringify(msg));
        }
        let replyContents = undefined;
        let processor = MsgProcessor.processors.get(this.transport.id).get(msg.op);
        if (processor) {
            // The 'processor' specification is either an array consisting of:
            //       [ processorFunction, otherParameters ]
            //   where 'procesorFunction' takes the parameters:
            //       processorFunction(messageBody)
            //   The return of 'processorFunction' is the reply contents or 'undefined'.
            // If 'processor' is not an array, it is expected to be a function
            //   that returns what should be returned as a reply or 'undefined'.
            if (Array.isArray(processor)) {
                let replyContents = undefined;
                try {
                    replyContents = processor[0](msg);
                }
                catch (e) {
                    replyContents = this.MakeException('Exception processing '
                                    + BasilMessageOps.get(op) + ': ' + e);
                    replyName = String(BasilMessageOps.get(msg.op)).replace('Req$', 'Resp$');
                    replyContents['op'] = BasilMessageOps.get(replyName);
                }
            }
            else {
                replyContents = processor(msg);
            }
        }
        else {
            GP.ErrorLog('MsgProcessor.Process: Unknown message: ' + JSONstringify(msg));
        }
        if (replyContents) {
            // There is a response to the message.
            // If the sender didn't supply response bindings, don't send the response.
            if (msg.resp) {
                // Return the binding that allows the other side to match the response
                replyContents['resp'] = msg.resp;

                if (Config.Debug && Config.Debug.MsgProcessorResponsePrintMsg) {
                    GP.DebugLog('MsgProcessor.Process: sending response: ' + JSONstringify(replyContents));
                }

                this.transport.Send(replyContents);
            }
        }
    }

    MakeException(pReason, pHints) {
        let except = { };
        if (pReason) { except.exception = pReason; }
        if (pHints) { except.exceptionHints = pHints; }
        return except;
    }
}

export class MsgProcessor extends BItem {
    constructor(pId, pAuth) {
        super(pId, pAuth, BItemType.SERVICE);
        this.layer = Config.layers ? Config.layers.comm : 'org.basil.b.layer.comm';
        this.RPCSessionCallback = new Map();
        if (typeof MsgProcessor.processors === 'undefined') {
            // static variable that indexes transport.id => msgProcessingFunctions
            MsgProcessor.processors = new Map();
            MsgProcessor.transportReceivers = new Map();
        }
    }

    // Given a transport system and a set of message type processors,
    //    add the type processors for this transport.
    RegisterMsgProcess(pTransport, pProcessors) {
        if (! MsgProcessor.processors.has(pTransport.id)) {
            MsgProcessor.processors.set(pTransport.id, new Map());
            let xportReceiver = new TransportReceiver(pTransport, this);
            MsgProcessor.transportReceivers.set(pTransport.id, xportReceiver);
            pTransport.SetReceiveCallback(xportReceiver.Process.bind(xportReceiver));
        }
        // Merge new message processors into the set of message processors
        let addTo = MsgProcessor.processors.get(pTransport.id);
        pProcessors.forEach( (v, k) => { addTo.set(k, v); });
    }

    // 'IncomingAuth' is the token needed for someone to talk to this connection
    SetIncomingAuth(authToken, authExp) {
        this.IncomingAuth = authToken;
        if (authExp) {
            this.IncomingAuthExpiration = authExp;
        }
        else {
            this.IncomingAuthExpiration = ExpirationNever;
        }
    }

    // 'OutgoingAuth' is the auth sent with requests to the other side
    SetOutgoingAuth(authToken, authExp) {
        this.OutgoingAuth = authToken;
        if (authExp) {
            this.OutgoingAuthExpiration = authExp;
        }
        else {
            this.OutgoingAuthExpiration = ExpirationNever;
        }
    }

    // Function that sends the request and returns a Promise for the response.
    // The value returned by the Promise will be the body of the response message.
    SendAndPromiseResponse(pMsg) {
        // Add code to message specifying we want a response and the response id
        let responseSession = RandomIdentifier();
        pMsg['resp'] = responseSession;
        if (Config.Debug && Config.Debug.SendAndPromisePrintMsg) {
            GP.DebugLog('MsgProcessor.SendAndPromiseResponse: sending: ' + JSONstringify(pMsg));
        }
        // Return a promise and pass the 'resolve' function to the response message processor
        return new Promise( function(resolve,reject) {
            this.RPCSessionCallback[responseSession] = {
                'timeRPCCreated': Date.now(),
                'resolve': resolve,
                'reject': reject,
                'rawMessage': pMsg
            };
            this.transport.Send(pMsg);
        }.bind(this));
    };

    // Easy, just send the message and don't expect any response
    SendMessage(pMsg) {
        this.transport.Send(emsg);
    }

    // Function that handles the response type message
    HandleResponse(responseMsg) {
        if (Config.Debug && Config.Debug.HandleResponsePrintMsg) {
            GP.DebugLog('MsgProcessor.HandleResponse: received: ' + JSONstringify(responseMsg));
        }
        if (responseMsg.resp) {
            let sessionIndex = responseMsg.resp;
            let session = this.RPCSessionCallback[sessionIndex];
            if (session) {
                this.RPCSessionCallback.delete(sessionIndex);
                try {
                    (session.resolve)(responseMsg);
                }
                catch (e) {
                    let errMsg = 'MsgProcessor.HandleResponse: exception processing msg: ' + e;
                    console.log(errMsg);
                    GP.ErrorLog(errMsg);
                    (session.reject)(errMsg);
                }
            }
            else {
                let errMsg = 'MsgProcessor.HandleResponse: received msg which is not RPC response: '
                                    + JSONstringify(responseMsg);
                console.log(errMsg);
                GP.ErrorLog(errMsg);
            }
        }
        else {
            let errMsg = 'MsgProcessor.HandleResponse: received misformed msg: '
                                + JSONstringify(responseMsg);
            console.log(errMsg);
            GP.ErrorLog(errMsg);
        }
    }
    // Create an exception object
    MakeException(reason, hints) {
        let except = {};
        if (reason) { except.exception = reason; }
        if (hints) { except.exceptionHints = hints; }
        return except;
    };

    // Create a well formed property list from an object. Values must be strings in the output.
    // Note the check for 'undefined'. Property lists cannot have undefined values.
    CreatePropertyList(obj) {
        let list = {};
        Object.keys(obj).forEach(prop => {
            let val = obj[prop];
            if (typeof(val) != 'undefined') {
                if (typeof(val) != 'string') {
                    val = JSONstringify(val);
                }
                list[prop] = val;
            }
        });
        return list;
    };
}
