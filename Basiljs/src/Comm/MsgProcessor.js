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
        let recvdMsg = this.decoder.decode(pRawMsg);
        let replyContents = undefined;
        let reqName = Object.keys(msg).filter(k => { return k.endsWith('Msg'); } ).shift();
        let processor = MsgProcessor.processors.get(this.transport.id)[reqName];
        if (processor) {
            // The 'processor' specification is either an array consisting of:
            //       [ processsorFunction, replyMsgName, otherParameters ]
            //   where 'processorFunction' takes the parameters:
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
                    innerReply = MakeException('Exception processing: ' + e);
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
            this.Send(this.encoder.encode(replyContents).finish());
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
        if (! MsgProcessor.processsors.has(pTransport.id)) {
            MsgProcessor.processors.set(pTransport.id, {});
            let xportReceiver = new TransportReceiver(pTransport, this, pEncoder, pDecoder);
            MsgProcessor.transportReceivers.set(pTransport.id, xportReceiver);
            pTransport.SetReceiveCallback(xportReceiver.Process.bind(xportReceiver));
        }
        this.encoder = pEncoder;  // Remember outbound encoder for sending messages
        // Merge new message processors into the set of message processors
        Object.assign(MsgProcessor.processors[pTransport.id], pProcessors);
    }

    // Function that sends the request and returns a Promise for the response.
    // The value returned by the Promise will be the body of the response message.
    SendAndPromiseResponse(pMsg, pReqName) {
        let responseSession = this.RPCsession++;
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
        });
    };

    // Function that handles the response type message
    HandleResponse(pMsg) {
        if (pMsg.ResponseReq && pMsg.ResponseReq.responseSession) {
            let sessionIndex = pMsg.ResponseReq.responseSession;
            let session = this.RPCSessionCallback[sessionIndex];
            if (session) {
                this.RPCSessionCallback.delete(sessionIndex);
                try {
                    let reqName = Object.keys(pMsg).filter(k => { return k.endsWith('Msg'); } ).shift();
                    if (reqName) {
                        (session.resolve)(pMsg[reqName], reqName);
                    }
                    else {
                        let errMsg = 'MsgProcessor.HandleResponse: could not find message'
                                        + JSON.stringify(pMsg);
                        console.log(errMsg);
                        GP.ErrorLog(errMsg);
                        (session.reject)(errMsg);
                    }
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
}