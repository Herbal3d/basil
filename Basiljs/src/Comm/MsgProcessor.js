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

import { BItem, BItemType, BItemState } from '../Items/BItem.js';

import { BasilMessage } from "../jslibs/BasilMessages.js"
import { BasilMessageOpMap } from "./BasilMessageOps.js";
import { RandomIdentifier, JSONstringify } from '../Utilities.js';
import { ExpirationNever } from '../Auth/Auth.js';
import { BException } from '../BException.js';

// A class which is instanced for each transport system and
//   maps received messsages to the message processors.
// The static dictionary 'MsgProcessor.processors' contains the map of
//   received message name to the processing routine for each transport Id.
class TransportReceiver {
    constructor(pTransport, pContext) {
        this.transport = pTransport;
        this.context = pContext;
    }

    Process(pRawMsg) {
        let msg = BasilMessage.BasilMessage.decode(pRawMsg);
        if (Config.Debug && Config.Debug.MsgProcessorProcessPrintMsg) {
            GP.DebugLog('MsgProcessor.Process: received: ' + JSONstringify(msg));
        }
        let processor = MsgProcessor.processors.get(this.transport.id).get(msg.Op);
        if (processor) {
            processor(msg)
            .then (resp => {
                if (resp) {
                    // There is a response to the message.
                    // If the sender didn't supply response bindings, don't send the response.
                    if (msg.ResponseCode) {
                        // Return the binding that allows the other side to match the response
                        resp['ResponseCode'] = msg.ResponseCode;
                        if (msg.ResponseKey) {
                            resp['ResponseKey'] = msg.ResponseKey
                        }

                        if (Config.Debug && Config.Debug.VerifyProtocol) {
                            if (! BasilMessage.verify(resp)) {
                                GP.ErrorLog('MsgProcessor.Process: Verification fail: '
                                                + JSONstringify(resp));
                            }
                        };

                        if (Config.Debug && Config.Debug.MsgProcessorResponsePrintMsg) {
                            GP.DebugLog('MsgProcessor.Process: sending response: ' + JSONstringify(resp));
                        };
                    };
                    this.transport.Send(BasilMessage.BasilMessage.encode(resp).finish());
                };
            })
            .catch ( e => {
                let replyContents = {};
                let replyName = String(BasilMessageOpMap.get(msg.Op)).replace('Req$', 'Resp$');
                replyContents['Op'] = BasilMessageOpMap.get(replyName);
                let errMsg = 'Exception processing ' + BasilMessageOpMap.get(msg.Op) + ': ' + JSONstringify(e);
                replyContents['Exception'] = errMsg;
                GP.ErrorLog('MsgProcessor.Process: ' + errMsg);
                this.transport.Send(BasilMessage.BasilMessage.encode(replyContents).finish());
            });
        }
        else {
            GP.ErrorLog('MsgProcessor.Process: Unknown message: ' + JSONstringify(msg));
        };
    };
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
        };
    };

    // Function that sends the request and returns a Promise for the response.
    // The value returned by the Promise will be the body of the response message.
    SendAndPromiseResponse(pMsg) {
        let responseSession = RandomIdentifier();
        pMsg['ResponseCode'] = responseSession;
        if (Config.Debug && Config.Debug.VerifyProtocol) {
            if (! BasilMessage.verify(pMsg)) {
                GP.ErrorLog('MsgProcessor.SendAndPromiseResponse: verification fail: '
                            + JSONstringify(pMsg));
            };
        };
        if (Config.Debug && Config.Debug.SendAndPromisePrintMsg) {
            GP.DebugLog('MsgProcessor.SendAndPromiseResponse: sending: ' + JSONstringify(pMsg));
        }
        let emsg = BasilMessage.BasilMessage.encode(pMsg).finish();
        // Return a promise and pass the 'resolve' function to the response message processor
        return new Promise( function(resolve,reject) {
            this.RPCSessionCallback[responseSession] = {
                'timeRPCCreated': Date.now(),
                'resolve': resolve,
                'reject': reject,
                'rawMessage': pMsg
            };
            this.transport.Send(emsg);
        }.bind(this));
    };

    // Easy, just send the message and don't expect any response
    SendMessage(pMsg) {
        let emsg = BasilMessage.BasilMessage.encode(pMsg).finish();
        this.transport.Send(emsg);
    }

    // Function that handles the response type message
    HandleResponse(responseMsg) {
        return new Promise (function( resolve, reject) {
            if (Config.Debug && Config.Debug.HandleResponsePrintMsg) {
                GP.DebugLog('MsgProcessor.HandleResponse: received: ' + JSONstringify(responseMsg));
            };
            if (responseMsg.ResponseCode) {
                let sessionIndex = responseMsg.ResponseCode;
                let session = this.RPCSessionCallback[sessionIndex];
                if (session) {
                    this.RPCSessionCallback.delete(sessionIndex);
                    try {
                        (session.resolve)(responseMsg);
                        // A response doesn't generate a response
                        resolve(undefined);
                    }
                    catch (e) {
                        let errMsg = 'MsgProcessor.HandleResponse: exception processing msg: ' + e;
                        console.log(errMsg);
                        GP.ErrorLog(errMsg);
                        (session.reject)(errMsg);
                        reject(new BException(errMsg));
                    }
                }
                else {
                    let errMsg = 'MsgProcessor.HandleResponse: received msg which is not RPC response: '
                                        + JSONstringify(responseMsg);
                    console.log(errMsg);
                    GP.ErrorLog(errMsg);
                    reject(new BException(errMsg));
                }
            }
            else {
                let errMsg = 'MsgProcessor.HandleResponse: received misformed msg: '
                                    + JSONstringify(responseMsg);
                console.log(errMsg);
                GP.ErrorLog(errMsg);
                reject(new BException(errMsg));
            };
            // Return from the promise with no reply message
        }.bind(this) );
    }

    // Create a well formed property list from an object.
    // This does a lot of guessing about the values to create the ParamValue
    // Note the check for 'undefined'. Property lists cannot have undefined values.
    CreatePropertyList(obj) {
        let list = {};
        Object.keys(obj).forEach(prop => {
            let val = obj[prop];
            if (typeof(val) !== 'undefined') {
                if (typeof(val) == 'string' ) {
                    list[prop] = val;
                }
                else {
                    list[prop] = JSONstringify(val);
                };
            };
        });
        return list;
    };

    // Given an array of AnAbility instances, return an array of ParamBlock's
    // If passed 'undefined', return 'undefined'
    BuildAbilityProps(pAbilities) {
        if (typeof(pAbilities) === 'undefined'          // if undefined
                || (! Array.isArray(pAbilities))        //   or if not an array
                || pAbilities.length == 0)  {           //   or if the array is empty
            return undefined;                           // return a nothing
        }
        let ret = [];
        pAbilities.forEach( abil => {
            ret.push( {
                'Ability': abil.Name,
                'Props': abil.GetProperties()
            } );
        });
        return ret;
    };
}
