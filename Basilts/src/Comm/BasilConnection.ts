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

import { Config } from '@Base/Config';

import { Comm } from '@Comm/Comm';
import { BProtocol, BProtocolReceptionCallback } from '@Comm/BProtocol';
import { BItem } from '@BItem/BItem';
import { AuthToken } from '@Tools/Auth';
import { BMessage, BMessageOps, PositionBlock, CoordSystem, RotationSystem } from '@Comm/BMessage';

import { CombineParameters, CreateUniqueId, JSONstringify, RandomIdentifier } from "@Tools/Utilities";
import { BKeyedCollection } from "@Tools/bTypes";
import { Logger } from '@Tools/Logging';

// When an RPC operation is done, this remembers the send so we can process the response
interface RPCInfo {
    timeRPCCreated: number,
    resolve: any,
    reject: any,
};

// The type of server that I am
export const ServiceSpaceServer = 'SpaceServer';
export const ServiceBasilServer = 'BasilServer';

export const OpenBasilConnections: Map<string, BasilConnection> = new Map<string,BasilConnection>();

export class BasilConnection extends BItem {
    _params: BKeyedCollection;
    _proto: BProtocol;
    _outgoingAuth: AuthToken;
    _incomingAuth: AuthToken;
    _rpcSessions: Map<string, RPCInfo>;
    _aliveSequenceNumber: number = 22;

    constructor(pParams: BKeyedCollection, pProtocol: BProtocol) {
        super(CreateUniqueId('BasilConnection'), undefined, 'org.herbal3d.b.basilconn');
        this._params = CombineParameters(undefined, pParams, {
            'service': ServiceSpaceServer
        });
        this._proto = pProtocol;
        this._proto.SetReceiveCallback(Processor, this);
        this._rpcSessions = new Map<string,RPCInfo>();
    };

    // This is making an RPC requests so remember info so we can match the response
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
        const bmsg: BMessage = { 'Op': BMessageOps.CreateItemReq };
        if (this._outgoingAuth) bmsg.Auth = this._outgoingAuth.token;
        if (pProps) bmsg.IProps = CreatePropertyList(pProps);
        return SendAndPromiseResponse(bmsg, this);
    };
    async DeleteItem(pId: string, pItemAuth?: AuthToken): Promise<BMessage> {
        const bmsg: BMessage = { 'Op': BMessageOps.DeleteItemReq};
        if (this._outgoingAuth) bmsg.Auth = this._outgoingAuth.token;
        if (pId) bmsg.IId = pId;
        if (pItemAuth) bmsg.IAuth = pItemAuth.token;
        return SendAndPromiseResponse(bmsg, this);
    };
    async AddAbility(pId: string, pAbilities: any): Promise<BMessage> {
        const bmsg: BMessage = { 'Op': BMessageOps.AddAbilityReq};
        if (this._outgoingAuth) bmsg.Auth = this._outgoingAuth.token;
        if (pId) bmsg.IId = pId;
        // TODO:
        return SendAndPromiseResponse(bmsg, this);
    };
    async RemoveAbility(pId: string, pAbilities: any): Promise<BMessage> {
        const bmsg: BMessage = { 'Op': BMessageOps.RemoveAbilityReq};
        if (this._outgoingAuth) bmsg.Auth = this._outgoingAuth.token;
        if (pId) bmsg.IId = pId;
        // TODO:
        return SendAndPromiseResponse(bmsg, this);
    };
    async RequestProperties(pId: string, filter: string): Promise<BMessage> {
        const bmsg: BMessage = { 'Op': BMessageOps.RequestPropertiesReq};
        if (this._outgoingAuth) bmsg.Auth = this._outgoingAuth.token;
        if (pId) bmsg.IId = pId;
        if (filter) bmsg.IProps = CreatePropertyList({ 'filter': filter });
        return SendAndPromiseResponse(bmsg, this);
    };
    async UpdateProperties(pId: string, pProps: BKeyedCollection): Promise<BMessage> {
        const bmsg: BMessage = { 'Op': BMessageOps.UpdatePropertiesReq};
        if (this._outgoingAuth) bmsg.Auth = this._outgoingAuth.token;
        if (pId) bmsg.IId = pId;
        if (pProps) bmsg.IProps = CreatePropertyList(pProps);
        return SendAndPromiseResponse(bmsg, this);
    };
    // OpenSession has an 'extended' authorization as it contains the new sessionkey
    //    as well as the auth for access the service.
    async OpenSession(pUserAuth: AuthToken, pProps: BKeyedCollection): Promise<BMessage> {
        const bmsg: BMessage = { 'Op': BMessageOps.OpenSessionReq};
        if (pUserAuth) bmsg.Auth = pUserAuth.token;
        if (pProps) bmsg.IProps = CreatePropertyList(pProps);
        return SendAndPromiseResponse(bmsg, this);
    };
    async CloseSession(reason: string): Promise<BMessage> {
        const bmsg: BMessage = { 'Op': BMessageOps.CloseSessionReq};
        if (this._outgoingAuth) bmsg.Auth = this._outgoingAuth.token;
        if (reason) bmsg.IProps = CreatePropertyList({ 'reason': reason } );
        return SendAndPromiseResponse(bmsg, this);
    };
    async MakeConnection(pProps: BKeyedCollection): Promise<BMessage> {
        const bmsg: BMessage = { 'Op': BMessageOps.MakeConnectionReq};
        if (this._outgoingAuth) bmsg.Auth = this._outgoingAuth.token;
        if (pProps) bmsg.IProps = CreatePropertyList(pProps);
        return SendAndPromiseResponse(bmsg, this);
    };
    async AliveCheck(): Promise<BMessage> {
        const bmsg: BMessage = { 'Op': BMessageOps.AliveCheckReq};
        if (this._outgoingAuth) bmsg.Auth = this._outgoingAuth.token;
        bmsg.IProps = CreatePropertyList( {
            'time': Date.now(),
            'sequenceNum': this._aliveSequenceNumber++
        });
        return SendAndPromiseResponse(bmsg, this);
    };
};

// Process the incoming message
function Processor(pMsg: BMessage, pContext: BasilConnection, pProto: BProtocol) {
    if (pMsg.RCode) {
        // Has a response code. Must be a response to an RPC
        const session = pContext._rpcSessions.get(pMsg.RCode);
        if (session) {
            try {
                // eslint-disable-next-line
                session.resolve(pMsg);
            }
            catch (err) {
                const errr = <Error>err;
                const errMsg = `MsgProcessor.HandleResponse: exception processing msg: ${errr.message}`;
                Logger.error(errMsg);
                // eslint-disable-next-line
                session.reject(errMsg);
            };
        }
        else {
            const errMsg = `MsgProcessor.HandleResponse: received msg which is not RPC response: ${JSONstringify(pMsg)}`;
            Logger.error(errMsg);
        };
    }
    else {
        // No response code, must be an incoming request
        switch (pContext._params.service) {
            // Person on the other side is talking to a SpaceServer
            // In this Javascript code, this is used by the WWTester
            // Someday fixup so there can be NodeJS SpaceServers
            case ServiceSpaceServer: {
                switch (pMsg.Op) {
                    case BMessageOps.OpenSessionReq: {
                        const msg: BMessage = { 'Op': BMessageOps.OpenSessionResp};
                        pContext.setReady();
                        break;
                    }
                    case BMessageOps.CloseSessionReq: {
                        const msg: BMessage = { 'Op': BMessageOps.CloseSessionResp};
                        pContext.setShutdown();
                        break;
                    }
                    case BMessageOps.AliveCheckReq: {
                        const msg: BMessage = { 'Op': BMessageOps.AliveCheckResp};
                        msg.IProps = CreatePropertyList( {
                            'time': Date.now(),
                            'sequenceNum': pContext._aliveSequenceNumber++,
                            'timeReceived': pMsg.IProps??['time'],
                            'sequenceNumberReceived': pMsg.IProps??['sequenceNum']
                        });
                        pContext.Send(msg);
                        break;
                    }
                    default:
                        break;
                };
                break;
            }
            // The person on the other side is talking to a Basil server
            case ServiceBasilServer: {
                switch (pMsg.Op) {
                    case BMessageOps.CreateItemReq: {
                        const msg: BMessage = { 'Op': BMessageOps.CreateItemResp};
                        break;
                    }
                    case BMessageOps.DeleteItemReq: {
                        const msg: BMessage = { 'Op': BMessageOps.DeleteItemResp};
                        break;
                    }
                    case BMessageOps.AddAbilityReq: {
                        const msg: BMessage = { 'Op': BMessageOps.AddAbilityResp};
                        break;
                    }
                    case BMessageOps.RemoveAbilityReq: {
                        const msg: BMessage = { 'Op': BMessageOps.RemoveAbilityResp};
                        break;
                    }
                    case BMessageOps.RequestPropertiesReq: {
                        const msg: BMessage = { 'Op': BMessageOps.RequestPropertiesResp};
                        break;
                    }
                    case BMessageOps.UpdatePropertiesReq: {
                        const msg: BMessage = { 'Op': BMessageOps.UpdatePropertiesResp};
                        break;
                    }
                    case BMessageOps.MakeConnectionReq: {
                        const msg: BMessage = { 'Op': BMessageOps.MakeConnectionResp};
                        // I've been asked to make a connection somewhere
                        const params: BKeyedCollection = {
                            'transport':    pMsg.IProps['transport'] ?? 'WS',
                            'transportURL': pMsg.IProps['transportURL'] ?? undefined,
                            'protocol':     pMsg.IProps['protocol'] ?? 'Basil-JSON',
                            'service':      pMsg.IProps['service'] ?? 'SpaceServer',
                            'receiveAuth':  pMsg.IProps['receiveAuth'] ?? undefined,
                        };
                        Comm.MakeConnection(params)
                        .then ( bconnection => {
                            const token = new AuthToken();
                            const openProps: BKeyedCollection = {};
                            for ( const prop of Object.keys(pMsg.IProps)) {
                                openProps[prop] = pMsg.IProps
                            }
                            bconnection.OpenSession(token, openProps)
                            .then ( resp => {
                                // Session successfully opened.
                                // Register the connection and wait for commands
                                const msg: BMessage = { 'Op': BMessageOps.MakeConnectionResp};
                                pContext.Send(msg);
                            })
                            .catch ( e => {
                                // The OpenSession failed
                                const err = <BMessage>e;    // kludge for eslint
                                const msg: BMessage = { 'Op': BMessageOps.MakeConnectionResp};
                                msg.Exception = err.Exception;
                                msg.ExceptionHints = err.ExceptionHints;
                                pContext.Send(msg);
                            });
                        })
                        .catch ( err => {
                            const xx = 5;     // make tslint ignore this
                        });
                        break;
                    }
                    case BMessageOps.AliveCheckReq: {
                        const msg: BMessage = { 'Op': BMessageOps.AliveCheckResp};
                        msg.IProps = CreatePropertyList( {
                            'time': Date.now(),
                            'sequenceNum': pContext._aliveSequenceNumber++,
                            'timeReceived': pMsg.IProps??['time'],
                            'sequenceNumberReceived': pMsg.IProps??['sequenceNum']
                        });
                        pContext.Send(msg);
                        break;
                    }
                    default:
                        break;
                };
                break;
            }
            default: {
                break;
            }
        };
    };
};

function CreatePropertyList(pProps: BKeyedCollection): BKeyedCollection {
    const list: BKeyedCollection = {};
    Object.keys(pProps).forEach(prop => {
        const val = pProps[prop];
        if (typeof(val) !== 'undefined') {
            if (typeof(val) === 'string' ) {
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
    const responseSession = RandomIdentifier();
    pMsg.RCode = responseSession;
    if (Config.Debug && Config.Debug.SendAndPromisePrintMsg) {
        Logger.debug('MsgProcessor.SendAndPromiseResponse: sending: ' + JSONstringify(pMsg));
    }
    // Return a promise and pass the 'resolve' function to the response message processor
    return new Promise( (resolve,reject) => {
        pContext.RememberRPCSession(responseSession, {
            timeRPCCreated: Date.now(),
            resolve,
            reject,
        } );
        pContext._proto.Send(pMsg);
    });
};

