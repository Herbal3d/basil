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

import { Comm, MakeConnectionParams } from '@Comm/Comm';
import { BProtocol } from '@Comm/BProtocol';
import { BItem } from '@BItem/BItem';
import { AuthToken } from '@Tools/Auth';
import { BMessage, BMessageOps, PositionBlock, CoordSystem, RotationSystem, OpenSessionRespProps } from '@Comm/BMessage';
import { OpenSessionReqProps } from '@Comm/BMessage';
import { Eventing } from '@Eventing/Eventing';
import { TopicEntry } from '@Eventing/TopicEntry';
import { EventProcessor, SubscriptionEntry } from '@Eventing/SubscriptionEntry';

import { CombineParameters, CreateUniqueId, ExtractStringError, JSONstringify, RandomIdentifier } from "@Tools/Utilities";
import { BKeyedCollection } from "@Tools/bTypes";
import { Logger } from '@Tools/Logging';
import { IdProp } from '@Abilities/AbilityBItem';

// When an RPC operation is done, this remembers the send so we can process the response
interface RPCInfo {
    timeRPCCreated: number,
    resolve: any,
    reject: any,
};

// Received operations generate event which pass these parameters
export interface BasilConnectionEventParams {
    request: BMessage,              // the request making the event
    response: BMessage,             // prototype of the response
    connection: BasilConnection,    // the connection the request is on
    protocol: BProtocol,            // the packaging protocol being used
    params?: BKeyedCollection       // any parameters for this event
};

// The type of server that I am
export const ServiceSpaceServer = 'SpaceServer';
export const ServiceBasilServer = 'BasilServer';

export const OpenBasilConnections: Map<string, BasilConnection> = new Map<string,BasilConnection>();

export class BasilConnection extends BItem {
    _params: BKeyedCollection;
    _proto: BProtocol;
    _rpcSessions: Map<string, RPCInfo>;
    _aliveSequenceNumber: number = 22;
    _eventTopics: Map<string,TopicEntry>;
    OutgoingAuth: AuthToken;
    IncomingAuth: AuthToken;
    ServerVersion: string;          // the version of the server we're talking to

    constructor(pParams: BKeyedCollection, pProtocol: BProtocol) {
        super(CreateUniqueId('BasilConnection'), undefined, 'org.herbal3d.b.basilconn');
        this._params = CombineParameters(undefined, pParams, {
            'service': ServiceSpaceServer
        });
        this._proto = pProtocol;
        this._proto.SetReceiveCallback(Processor, this);
        this._rpcSessions = new Map<string,RPCInfo>();
        this.IncomingAuth = new AuthToken(pParams['receiveauth'] ?? undefined);
        this.OutgoingAuth = new AuthToken(pParams['serviceauth'] ?? undefined);
        this.GenerateEventTopics();
    };

    // Each of the message operations generate events.
    // This registers the event topic for later subscriptions/firing.
    // Note that it saves TopicEntry's to save one lookup when fired.
    GenerateEventTopics() {
        const EventingMessageNames: string[] = [
            'CreateItem', 'DeleteItem',
            'AddAbility', 'RemoveAbility',
            'RequestProperties', 'UpdateProperties',
            'OpenSession', 'CloseSession',
            'MakeConnection', 'AliveCheck'
        ];
        this._eventTopics = new Map<string,TopicEntry>();
        const id = <string>this.getProp(IdProp);
        for (const opName of EventingMessageNames) {
            const sub = Eventing.Register(opName + '-' + id, 'BasilConnection');
            this._eventTopics.set(opName, sub);
        };
    };
    // To get the topic name for the events generated by message operations
    //     for this connection.
    GetEventTopicForMessageOp(pOp: string): TopicEntry {
        return this._eventTopics.get(pOp);
    };
    // Subscribe to a particular message operation.
    SubscribeToMessageOp(pOp: string, pEventProcessor: EventProcessor): SubscriptionEntry {
        const topicEnt = this.GetEventTopicForMessageOp(pOp);
        if (topicEnt) {
            return Eventing.Subscribe(topicEnt.topic, pEventProcessor);
        };
        return undefined;
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

    // Once the BasilConnection is connected, this sends an OpenConnection and
    // finalizes the session.
    async CreateSession(pProps: OpenSessionReqProps): Promise<BasilConnection> {
        const resp = await this.OpenSession(pProps);
        if (resp.Exception) {
            // The open session failed.
            throw resp;
        }
        this.OutgoingAuth = new AuthToken(resp.IProps['ServerAuth']);
        this.ServerVersion = resp.IProps['ServerVersion'];
        this.setReady();
        return this;
    };

    async CreateItem(pProps: BKeyedCollection): Promise<BMessage> {
        const bmsg: BMessage = { 'Op': BMessageOps.CreateItemReq, IProps: {} };
        if (this.OutgoingAuth) bmsg.Auth = this.OutgoingAuth.token;
        if (pProps) bmsg.IProps = CreatePropertyList(pProps);
        return SendAndPromiseResponse(bmsg, this);
    };
    async DeleteItem(pId: string, pItemAuth?: AuthToken): Promise<BMessage> {
        const bmsg: BMessage = { 'Op': BMessageOps.DeleteItemReq, IProps: {}};
        if (this.OutgoingAuth) bmsg.Auth = this.OutgoingAuth.token;
        if (pId) bmsg.IId = pId;
        if (pItemAuth) bmsg.IAuth = pItemAuth.token;
        return SendAndPromiseResponse(bmsg, this);
    };
    async AddAbility(pId: string, pAbilities: any): Promise<BMessage> {
        const bmsg: BMessage = { 'Op': BMessageOps.AddAbilityReq, IProps: {}};
        if (this.OutgoingAuth) bmsg.Auth = this.OutgoingAuth.token;
        if (pId) bmsg.IId = pId;
        // TODO:
        return SendAndPromiseResponse(bmsg, this);
    };
    async RemoveAbility(pId: string, pAbilities: any): Promise<BMessage> {
        const bmsg: BMessage = { 'Op': BMessageOps.RemoveAbilityReq, IProps: {}};
        if (this.OutgoingAuth) bmsg.Auth = this.OutgoingAuth.token;
        if (pId) bmsg.IId = pId;
        // TODO:
        return SendAndPromiseResponse(bmsg, this);
    };
    async RequestProperties(pId: string, filter: string): Promise<BMessage> {
        const bmsg: BMessage = { 'Op': BMessageOps.RequestPropertiesReq, IProps: {}};
        if (this.OutgoingAuth) bmsg.Auth = this.OutgoingAuth.token;
        if (pId) bmsg.IId = pId;
        if (filter) bmsg.IProps = CreatePropertyList({ 'filter': filter });
        return SendAndPromiseResponse(bmsg, this);
    };
    async UpdateProperties(pId: string, pProps: BKeyedCollection): Promise<BMessage> {
        const bmsg: BMessage = { 'Op': BMessageOps.UpdatePropertiesReq, IProps: {}};
        if (this.OutgoingAuth) bmsg.Auth = this.OutgoingAuth.token;
        if (pId) bmsg.IId = pId;
        if (pProps) bmsg.IProps = CreatePropertyList(pProps);
        return SendAndPromiseResponse(bmsg, this);
    };
    // OpenSession has an 'extended' authorization as it contains the new sessionkey
    //    as well as the auth for access the service.
    async OpenSession(pProps: OpenSessionReqProps): Promise<BMessage> {
        const bmsg: BMessage = { 'Op': BMessageOps.OpenSessionReq, IProps: {}};
        if (this.OutgoingAuth) bmsg.Auth = this.OutgoingAuth.token;
        if (pProps) bmsg.IProps = CreatePropertyList(pProps);
        return SendAndPromiseResponse(bmsg, this);
    };
    async CloseSession(reason: string): Promise<BMessage> {
        const bmsg: BMessage = { 'Op': BMessageOps.CloseSessionReq, IProps: {}};
        if (this.OutgoingAuth) bmsg.Auth = this.OutgoingAuth.token;
        if (reason) bmsg.IProps = CreatePropertyList({ 'reason': reason } );
        return SendAndPromiseResponse(bmsg, this);
    };
    async MakeConnection(pProps: BKeyedCollection): Promise<BMessage> {
        const bmsg: BMessage = { 'Op': BMessageOps.MakeConnectionReq, IProps: {}};
        if (this.OutgoingAuth) bmsg.Auth = this.OutgoingAuth.token;
        if (pProps) bmsg.IProps = CreatePropertyList(pProps);
        return SendAndPromiseResponse(bmsg, this);
    };
    async AliveCheck(): Promise<BMessage> {
        const bmsg: BMessage = { 'Op': BMessageOps.AliveCheckReq, IProps: {}};
        if (this.OutgoingAuth) bmsg.Auth = this.OutgoingAuth.token;
        bmsg.IProps = CreatePropertyList( {
            'time': Date.now(),
            'sequenceNum': this._aliveSequenceNumber++
        });
        return SendAndPromiseResponse(bmsg, this);
    };
};

// Process the incoming message
async function Processor(pMsg: BMessage, pContext: BasilConnection, pProto: BProtocol): Promise<void> {
    if (pMsg.RCode) {
        // Has a response code. Must be a response to an RPC
        const session = pContext._rpcSessions.get(pMsg.RCode);
        if (session) {
            try {
                Logger.cdebug('RPCResponse', `BasilConnection.Processor: response: ${JSONstringify(pMsg)}`);
                // eslint-disable-next-line
                session.resolve(pMsg);
            }
            catch (err) {
                const errr = ExtractStringError(err);
                const errMsg = `Processor.HandleResponse: exception processing msg: ${errr}`;
                Logger.error(errMsg);
                // eslint-disable-next-line
                session.reject(errMsg);
            };
        }
        else {
            const errMsg = `Processor.HandleResponse: received msg which is not RPC response: ${JSONstringify(pMsg)}`;
            Logger.error(errMsg);
        };
    }
    else {
        // No response code, must be an incoming request
        switch (pMsg.Op) {
            case BMessageOps.CreateItemReq: {
                const msg: BMessage = MakeResponse(pMsg, BMessageOps.CreateItemResp);
                await Eventing.Fire(pContext.GetEventTopicForMessageOp('CreateItem'), {
                    request: pMsg,
                    response: msg,
                    connection: pContext,
                    protocol: pProto
                });
                break;
            }
            case BMessageOps.DeleteItemReq: {
                const msg: BMessage = MakeResponse(pMsg, BMessageOps.DeleteItemResp);
                await Eventing.Fire(pContext.GetEventTopicForMessageOp('DeleteItem'), {
                    request: pMsg,
                    response: msg,
                    connection: pContext,
                    protocol: pProto
                });
                break;
            }
            case BMessageOps.AddAbilityReq: {
                const msg: BMessage = MakeResponse(pMsg, BMessageOps.AddAbilityResp);
                await Eventing.Fire(pContext.GetEventTopicForMessageOp('AddAbility'), {
                    request: pMsg,
                    response: msg,
                    connection: pContext,
                    protocol: pProto
                });
                break;
            }
            case BMessageOps.RemoveAbilityReq: {
                const msg: BMessage = MakeResponse(pMsg, BMessageOps.RemoveAbilityResp);
                await Eventing.Fire(pContext.GetEventTopicForMessageOp('RemoveAbility'), {
                    request: pMsg,
                    response: msg,
                    connection: pContext,
                    protocol: pProto
                });
                break;
            }
            case BMessageOps.RequestPropertiesReq: {
                const msg: BMessage = MakeResponse(pMsg, BMessageOps.RequestPropertiesResp);
                await Eventing.Fire(pContext.GetEventTopicForMessageOp('RequestProperties'), {
                    request: pMsg,
                    response: msg,
                    connection: pContext,
                    protocol: pProto
                });
                break;
            }
            case BMessageOps.UpdatePropertiesReq: {
                const msg: BMessage = MakeResponse(pMsg, BMessageOps.UpdatePropertiesResp);
                await Eventing.Fire(pContext.GetEventTopicForMessageOp('UpdateProperties'), {
                    request: pMsg,
                    response: msg,
                    connection: pContext,
                    protocol: pProto
                });
                break;
            }
            case BMessageOps.OpenSessionReq: {
                const msg: BMessage = MakeResponse(pMsg, BMessageOps.OpenSessionResp);
                await Eventing.Fire(pContext.GetEventTopicForMessageOp('OpenSession'), {
                    request: pMsg,
                    response: msg,
                    connection: pContext,
                    protocol: pProto
                });
                break;
            }
            case BMessageOps.CloseSessionReq: {
                const msg: BMessage = MakeResponse(pMsg, BMessageOps.CloseSessionResp);
                await Eventing.Fire(pContext.GetEventTopicForMessageOp('CloseSession'), {
                    request: pMsg,
                    response: msg,
                    connection: pContext,
                    protocol: pProto
                });
                pContext.setShutdown();
                break;
            }
            case BMessageOps.AliveCheckReq: {
                const msg: BMessage = MakeResponse(pMsg, BMessageOps.AliveCheckResp);
                msg.IProps = CreatePropertyList( {
                    'time': Date.now(),
                    'sequenceNum': pContext._aliveSequenceNumber++,
                    'timeReceived': pMsg.IProps??['time'],
                    'sequenceNumberReceived': pMsg.IProps??['sequenceNum']
                });
                pContext.Send(msg);
                break;
            }
            case BMessageOps.MakeConnectionReq: {
                const msg: BMessage = MakeResponse(pMsg, BMessageOps.MakeConnectionResp);
                // I've been asked to make a connection somewhere
                const params: MakeConnectionParams = {
                    'transport':    pMsg.IProps['Transport'] ?? 'WS',
                    'transporturl': pMsg.IProps['TransportURL'] ?? undefined,
                    'protocol':     pMsg.IProps['Protocol'] ?? 'Basil-JSON',
                    'service':      pMsg.IProps['Service'] ?? 'SpaceServer',
                    'serviceauth':  pMsg.IProps['ClientAuth'] ?? undefined,
                };
                // Just in case someone is watching and wants to record or change parameters
                await Eventing.Fire(pContext.GetEventTopicForMessageOp('MakeConnection'), {
                    request: pMsg,
                    response: msg,
                    connection: pContext,
                    protocol: pProto,
                    params: params
                });
                try {
                    const bconnection = await Comm.MakeConnection(params);
                    const openProps: OpenSessionReqProps = {
                        BasilVersion: "I dont' know"
                    };
                    for ( const prop of Object.keys(pMsg.IProps)) {
                        (openProps as BKeyedCollection)[prop] = pMsg.IProps
                    }
                    await pContext.CreateSession(openProps);
                    pContext.Send(msg);
                }
                catch (e) {
                    const err = <BMessage>e;    // kludge for eslint
                    const msg: BMessage = { 'Op': BMessageOps.MakeConnectionResp, IProps: {}};
                    msg.Exception = `OpenSession exception: ${err.Exception}`;
                    msg.ExceptionHints = err.ExceptionHints;
                    pContext.Send(msg);
                };
                break;
            }
            case BMessageOps.AliveCheckReq: {
                const msg: BMessage = MakeResponse(pMsg, BMessageOps.AliveCheckResp);
                msg.IProps = CreatePropertyList( {
                    'time': Date.now(),
                    'sequenceNum': pContext._aliveSequenceNumber++,
                    'timeReceived': pMsg.IProps??['time'],
                    'sequenceNumberReceived': pMsg.IProps??['sequenceNum']
                });
                // Just in case someone is watching and wants to record
                await Eventing.Fire(pContext.GetEventTopicForMessageOp('AliveCheck'), {
                    request: pMsg,
                    response: msg,
                    connection: pContext,
                    protocol: pProto
                });
                pContext.Send(msg);
                break;
            }
            default:
                break;
        };
    };
};

// Add the proper thing to a response to make it a response
function MakeResponse(pMsg: BMessage, pOp: number): BMessage {
    const resp: BMessage = { 'Op': pOp, IProps: {} };
    if (pMsg.SCode) {
        resp.RCode = pMsg.SCode;
    }
    return resp;
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
    Logger.debug('BasilConnection.SendAndPromiseResponse: entry');
    const responseSession = RandomIdentifier();
    pMsg.SCode = responseSession;
    if (Config.Debug && Config.Debug.RPCSent) {
        Logger.debug('BasilConnection.SendAndPromiseResponse: sending: ' + JSONstringify(pMsg));
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

