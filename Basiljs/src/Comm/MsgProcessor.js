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

class TransportReceiver {
    constructor(pTransport, pContext, pEncoder, pDecoder) {
        this.transport = pTransport;
        this.context = pContext;
        this.decoder = pDecoder;
        this.encoder = pEncoder;
    }

    Process(pRawMsg) {
        let msg = this.decoder.decode(pRawMsg);
        // GP.DebugLog('TransportReceiver: received: ' + JSON.stringify(msg));
        let replyContents = undefined;
        let reqName = Object.keys(msg).filter(k => { return k.endsWith('Msg'); } ).shift();
        let processor = MsgProcessor.processors.get(this.transport.id)[reqName];
        if (processor) {
            // The 'processor' specification is either an array consisting of:
            //       [ processorFunction, replyMsgName, otherParameters ]
            //   where 'procesorFunction' takes the parameters:
            //       processorFunction(specificMsgBody, nameOfRequest, enclosingMsg, processorArray)
            //   The return of 'processorFunction' is the reply contents or 'undefined'.
            // If 'processor' is not an array, it is expected to be a function
            //   that returns what should be returned as a reply or 'undefined'.
            if (Array.isArray(processor)) {
                let innerReply = undefined;
                try {
                    innerReply = processor[0](msg[reqName], reqName, msg, processor);
                }
                catch (e) {
                    innerReply = this.MakeException('Exception processing ' + reqName + ': ' + e);
                }
                finally {
                    if (innerReply) {
                        let replyMsgName = processor[1];
                        replyContents = {};
                        replyContents[replyMsgName] = innerReply;
                    }
                }
            }
            else {
                replyContents = processor(msg[reqName], reqName, msg);
            }
        }
        else {
            GP.ErrorLog('MsgProcessor.Process: Unknown message: ' + JSON.stringify(msg));
        }
        if (replyContents) {
            // There is a response to the message
            if (msg.ResponseReq) {
                // Return the binding that allows the other side to match the response
                replyContents['ResponseReq'] = msg.ResponseReq;
            }
            if (Config.Debug && Config.Debug.VerifyProtocol) {
                if (! this.encoder.verify(replyContents)) {
                    GP.ErrorLog('MsgProcessor.Process: Verification fail: '
                                    + JSON.stringify(replyContents));
                }
            }
            this.transport.Send(this.encoder.encode(replyContents).finish());
        }
    }

    MakeException(pReason, pHints) {
        let except = { 'exception': {} };
        if (pReason) { except.exception.reason = pReason; }
        if (pHints) { except.exception.hints = pHints; }
        return except;
    }
}

export class MsgProcessor extends BItem {
    constructor(pId, pAuth) {
        super(pId, pAuth, BItemType.SERVICE);
        this.RPCsession = 900222;
        this.RPCSessionCallback = new Map();
        if (typeof MsgProcessor.processors === 'undefined') {
            // static variable that indexes transport.id => msgProcessingFunctions
            MsgProcessor.processors = new Map();
            MsgProcessor.transportReceivers = new Map();
        }
    }

    // Given a transport system and a set of message type processors,
    //    add the type processors for this transport.
    RegisterMsgProcess(pTransport, pEncoder, pDecoder, pProcessors) {
        if (! MsgProcessor.processors.has(pTransport.id)) {
            MsgProcessor.processors.set(pTransport.id, {});
            let xportReceiver = new TransportReceiver(pTransport, this, pEncoder, pDecoder);
            MsgProcessor.transportReceivers.set(pTransport.id, xportReceiver);
            pTransport.SetReceiveCallback(xportReceiver.Process.bind(xportReceiver));
        }
        this.encoder = pEncoder;  // Remember outbound encoder for sending messages
        // Merge new message processors into the set of message processors
        Object.assign(MsgProcessor.processors.get(pTransport.id), pProcessors);
    }

    // Function that sends the request and returns a Promise for the response.
    // The value returned by the Promise will be the body of the response message.
    SendAndPromiseResponse(pMsg, pReqName) {
        // crypto.GetRandomValues could be slow. Maybe replace with Math.random.
        //   let randomness = new Uint32Array(1);
        //   crypto.getRandomValues(randomness);
        //   let responseSession = randomness[0];
        // let responseSession = (new Uint32Array((new Float32Array( [ Math.random() ] )).buffer))[0];
        let responseSession = Math.floor( Math.random() * 536870912 );   // 2^30
        let smsg = {};
        smsg[ pReqName + 'ReqMsg'] = pMsg;
        smsg['ResponseReq'] = {
            'responseSession': responseSession
        };
        if (Config.Debug && Config.Debug.VerifyProtocol) {
            if (! this.encoder.verify(smsg)) {
                GP.ErrorLog('MsgProcessor.SendAndPromiseResponse: verification fail: '
                            + JSON.stringify(smsg));
            }
        }
        // GP.DebugLog('MsgProcessor.SendAndPromiseResponse: sending: ' + JSON.stringify(smsg));
        let emsg = this.encoder.encode(smsg).finish();
        // Return a promise and pass the 'resolve' function to the response message processor
        return new Promise( function(resolve,reject) {
            this.RPCSessionCallback[responseSession] = {
                'timeRPCCreated': Date.now(),
                'resolve': resolve,
                'reject': reject,
                'requestName': pReqName,
                'rawMessage': smsg
            };
            this.transport.Send(emsg);
        }.bind(this));
    };

    // Function that handles the response type message
    HandleResponse(responseMsg, responseMsgName, containingMsg) {
        if (containingMsg.ResponseReq && containingMsg.ResponseReq.responseSession) {
            let sessionIndex = containingMsg.ResponseReq.responseSession;
            let session = this.RPCSessionCallback[sessionIndex];
            if (session) {
                this.RPCSessionCallback.delete(sessionIndex);
                try {
                    (session.resolve)(responseMsg, responseMsgName);
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
                                    + JSON.stringify(pMsg);
                console.log(errMsg);
                GP.ErrorLog(errMsg);
            }
        }
        else {
            let errMsg = 'MsgProcessor.HandleResponse: received misformed msg: '
                                + JSON.stringify(pMsg);
            console.log(errMsg);
            GP.ErrorLog(errMsg);
        }
    }
    // Create an exception object
    MakeException(reason, hints) {
        let except = { 'exception': {} };
        if (reason) { except.exception.reason = reason; }
        if (hints) { except.exception.hints = hints; }
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
                    val = JSON.stringify(val);
                }
                list[prop] = val;
            }
        });
        return list;
    };
}
