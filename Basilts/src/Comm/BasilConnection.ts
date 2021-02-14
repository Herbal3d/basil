// Copyright 2021 Robert Adams
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

import { BProtocol, BProtocolReceptionCallback } from '@Comm/BProtocol';
import { BItem } from '@BItem/BItem';
import { AuthToken } from '@Tools/Auth';
import { BMessage, BMessageOps, PositionBlock, CoordSystem, RotationSystem } from '@Comm/BMessage';

import { CombineParameters, CreateUniqueId, JSONstringify, RandomIdentifier } from "@Tools/Utilities";
import { BKeyedCollection } from "@Tools/bTypes";
import { Logger } from '@Tools/Logging';
import { Config } from '@Base/Config';
import { Comm } from './Comm';

// When an RPC operation is done, this remembers the send so we can process the response
interface RPCInfo {
    timeRPCCreated: number,
    resolve: any,
    reject: any,
};

export class BasilConnection extends BItem {
    _params: BKeyedCollection;
    _proto: BProtocol;
    _outgoingAuth: AuthToken;
    _incomingAuth: AuthToken;
    _rpcSessions: Map<string, RPCInfo>;
    _aliveSequenceNumber: number = 22;

    constructor(pParams: BKeyedCollection, pProtocol: BProtocol) {
        super(CreateUniqueId('BasilConnection'), undefined, 'org.herbal3d.b.protocol.fb');
        this._params = CombineParameters(undefined, pParams, {
        });
        this._proto.SetReceiveCallback(Processor, this);
        this._rpcSessions = new Map<string,RPCInfo>();
    };

    RememberRPCSession(pSessionCode: string, pRPCInfo: RPCInfo) {
        this._rpcSessions.set(pSessionCode, pRPCInfo);
    };

    // Send a message over this connection
    Send(pMsg: BMessage) {
        if (this._proto) {
            this._proto.Send(pMsg);
        };
    };

    async CreateItem(pProps: BKeyedCollection): Promise<BMessage> {
        let bmsg: BMessage = { 'Op': BMessageOps.CreateItemReq };
        if (this._outgoingAuth) bmsg.SessionAuth = this._outgoingAuth.token;
        if (pProps) bmsg.ItemProps = CreatePropertyList(pProps);
        return SendAndPromiseResponse(bmsg, this);
    };
    async DeleteItem(pId: string, pItemAuth?: AuthToken): Promise<BMessage> {
        let bmsg: BMessage = { 'Op': BMessageOps.DeleteItemReq};
        if (this._outgoingAuth) bmsg.SessionAuth = this._outgoingAuth.token;
        if (pId) bmsg.ItemId = pId;
        if (pItemAuth) bmsg.ItemAuth = pItemAuth.token;
        return SendAndPromiseResponse(bmsg, this);
    };
    async AddAbility(pId: string, pAbilities: any): Promise<BMessage> {
        let bmsg: BMessage = { 'Op': BMessageOps.AddAbilityReq};
        if (this._outgoingAuth) bmsg.SessionAuth = this._outgoingAuth.token;
        if (pId) bmsg.ItemId = pId;
        // TODO:
        return SendAndPromiseResponse(bmsg, this);
    };
    async RemoveAbility(pId: string, pAbilities: any): Promise<BMessage> {
        let bmsg: BMessage = { 'Op': BMessageOps.RemoveAbilityReq};
        if (this._outgoingAuth) bmsg.SessionAuth = this._outgoingAuth.token;
        if (pId) bmsg.ItemId = pId;
        // TODO:
        return SendAndPromiseResponse(bmsg, this);
    };
    async RequestProperties(pId: string, filter: string): Promise<BMessage> {
        let bmsg: BMessage = { 'Op': BMessageOps.RequestPropertiesReq};
        if (this._outgoingAuth) bmsg.SessionAuth = this._outgoingAuth.token;
        if (pId) bmsg.ItemId = pId;
        if (filter) bmsg.ItemProps = CreatePropertyList({ 'filter': filter });
        return SendAndPromiseResponse(bmsg, this);
    };
    async UpdateProperties(pId: string, pProps: BKeyedCollection): Promise<BMessage> {
        let bmsg: BMessage = { 'Op': BMessageOps.UpdatePropertiesReq};
        if (this._outgoingAuth) bmsg.SessionAuth = this._outgoingAuth.token;
        if (pId) bmsg.ItemId = pId;
        if (pProps) bmsg.ItemProps = CreatePropertyList(pProps);
        return SendAndPromiseResponse(bmsg, this);
    };
    // OpenSession has an 'extended' authorization as it contains the new sessionkey
    //    as well as the auth for access the service.
    async OpenSession(pUserAuth: AuthToken, pProps: BKeyedCollection): Promise<BMessage> {
        let bmsg: BMessage = { 'Op': BMessageOps.OpenSessionReq};
        if (pUserAuth) bmsg.SessionAuth = pUserAuth.token;
        if (pProps) bmsg.ItemProps = CreatePropertyList(pProps);
        return SendAndPromiseResponse(bmsg, this);
    };
    async CloseSession(reason: string): Promise<BMessage> {
        let bmsg: BMessage = { 'Op': BMessageOps.CloseSessionReq};
        if (this._outgoingAuth) bmsg.SessionAuth = this._outgoingAuth.token;
        if (reason) bmsg.ItemProps = CreatePropertyList({ 'reason': reason } );
        return SendAndPromiseResponse(bmsg, this);
    };
    async MakeConnection(pProps: BKeyedCollection): Promise<BMessage> {
        let bmsg: BMessage = { 'Op': BMessageOps.MakeConnectionReq};
        if (this._outgoingAuth) bmsg.SessionAuth = this._outgoingAuth.token;
        if (pProps) bmsg.ItemProps = CreatePropertyList(pProps);
        return SendAndPromiseResponse(bmsg, this);
    };
    async AliveCheck(): Promise<BMessage> {
        let bmsg: BMessage = { 'Op': BMessageOps.AliveCheckReq};
        if (this._outgoingAuth) bmsg.SessionAuth = this._outgoingAuth.token;
        bmsg.ItemProps = CreatePropertyList( {
            'time': Date.now(),
            'sequenceNum': this._aliveSequenceNumber++;
        });
        return SendAndPromiseResponse(bmsg, this);
    };
};

// Process the incoming message
function Processor(pMsg: BMessage, pContext: BasilConnection, pProto: BProtocol) {
    if (pMsg.ResponseCode) {
        // Has a response code. Must be a response to an RPC
        let session = pContext._rpcSessions.get(pMsg.ResponseCode);
        if (session) {
            try {
                session.resolve(pMsg);
            }
            catch (err) {
                let errMsg = 'MsgProcessor.HandleResponse: exception processing msg: ' + e;
                Logger.error(errMsg);
                session.reject(errMsg);
            };
        }
        else {
            let errMsg = 'MsgProcessor.HandleResponse: received msg which is not RPC response: '
                                        + JSONstringify(pMsg);
            Logger.error(errMsg);
        };
    }
    else {
        // No response code, must be an incoming request
        switch (pMsg.Op) {
            case BMessageOps.CreateItemReq: {
                let msg: BMessage = { 'Op': BMessageOps.CreateItemResp};
                break;
            }
            case BMessageOps.DeleteItemReq: {
                let msg: BMessage = { 'Op': BMessageOps.DeleteItemResp};
                break;
            }
            case BMessageOps.AddAbilityReq: {
                let msg: BMessage = { 'Op': BMessageOps.add};
                break;
            }
            case BMessageOps.RemoveAbilityReq: {
                let msg: BMessage = { 'Op': BMessageOps.MakeConnectionResp};
                break;
            }
            case BMessageOps.RequestPropertiesReq: {
                let msg: BMessage = { 'Op': BMessageOps.MakeConnectionResp};
                break;
            }
            case BMessageOps.UpdatePropertiesReq: {
                let msg: BMessage = { 'Op': BMessageOps.MakeConnectionResp};
                break;
            }
            case BMessageOps.OpenSessionReq: {
                let msg: BMessage = { 'Op': BMessageOps.MakeConnectionResp};
                break;
            }
            case BMessageOps.CloseSessionReq: {
                let msg: BMessage = { 'Op': BMessageOps.MakeConnectionResp};
                break;
            }
            case BMessageOps.MakeConnectionReq: {
                let msg: BMessage = { 'Op': BMessageOps.MakeConnectionResp};
                // I'm being asked to make a connection somewhere
                const params: BKeyedCollection = {
                    'transport': 'WS',
                    'transportURL': undefined,
                    'protocol': 'Basil-JSON',
                    'service': 'SpaceServer',
                    'receiveAuth': undefined,
                    'sendAuth': undefined,
                    'openParams': undefined
                };
                Comm.MakeConnection(params)
                .then ( bconnection => {

                })
                .catch ( err => {

                });
                break;
            }
            case BMessageOps.AliveCheckReq: {
                let msg: BMessage = { 'Op': BMessageOps.AliveCheckResp};
                msg.ItemProps = CreatePropertyList( {
                    'time': Date.now(),
                    'sequenceNum': this.aliveSequenceNum++,
                    'timeReceived': pMsg.ItemProps??['time'],
                    'sequenceNumberReceived': pMsg.ItemProps??['sequenceNum']
                });
                pContext.Send(msg);
                break;
            }
            default:
                break;
        };
    };
};

function CreatePropertyList(pProps: BKeyedCollection): BKeyedCollection {
    let list: BKeyedCollection = {};
    Object.keys(pProps).forEach(prop => {
        let val = pProps[prop];
        if (typeof(val) !== 'undefined') {
            if (typeof(val) == 'string' ) {
                list[prop] = val;
            }
            else {
                list[prop] = JSON.stringify(val);
            };
        };
    });
    return list;
};

function SendAndPromiseResponse(pMsg: BMessage, pContext: BasilConnection): Promise<BMessage> {
    let responseSession = RandomIdentifier();
    pMsg.ResponseCode = responseSession;
    if (Config.Debug && Config.Debug.SendAndPromisePrintMsg) {
        Logger.debug('MsgProcessor.SendAndPromiseResponse: sending: ' + JSONstringify(pMsg));
    }
    // Return a promise and pass the 'resolve' function to the response message processor
    return new Promise( (resolve,reject) => {
        pContext.RememberRPCSession(responseSession, {
            timeRPCCreated: Date.now(),
            resolve: resolve,
            reject: reject,
        } );
        pContext._proto.Send(pMsg);
    });
};

