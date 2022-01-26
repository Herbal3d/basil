// Copyright 2021 Robert Adams.ClientAuth
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
import { BMessage, BMessageOps } from '@Comm/BMessage';
import { OpenSessionReqProps } from '@Comm/BMessageProps';
import { Eventing } from '@Eventing/Eventing';
import { TopicEntry } from '@Eventing/TopicEntry';
import { EventProcessor, SubscriptionEntry } from '@Eventing/SubscriptionEntry';
import { ProcessDelayedGraphicsOperations } from '@Graphics/GraphicOps';
import { VERSION } from '@Base/VERSION';

import { CombineParameters, ExtractStringError, JSONstringify, RandomIdentifier } from "@Tools/Utilities";
import { BKeyedCollection } from "@Tools/bTypes";
import { Logger } from '@Tools/Logging';
import { BItems } from '@Base/BItem/BItems';
import { AbilityFactory } from '@Abilities/AbilityManagement';

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

export type AfterRequestOperation = ( pProps: BKeyedCollection ) => Promise<void>;

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
        super(undefined, 'org.herbal3d.b.basilconn');
        this._params = CombineParameters(undefined, pParams, {
        });
        this._proto = pProtocol;
        this._proto.SetReceiveCallback(Processor, this);
        this._rpcSessions = new Map<string,RPCInfo>();

        // Create a client token for this connection
        this.IncomingAuth = new AuthToken();
        this.OutgoingAuth = new AuthToken();

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
        const id = this.id;
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
            pMsg.Auth = this.OutgoingAuth.token;
            this._proto.Send(pMsg);
        };
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
async function Processor(pReq: BMessage, pConnection: BasilConnection, pProto: BProtocol): Promise<void> {
    if (Config.security.ShouldCheckBasilServerRequestAuth && ((pReq.Auth ?? 'UNKNOWN') !== pConnection.IncomingAuth.token) ) {
        // The sender is not authorized!
        Logger.error(`BasilConnection; unauthorized. rcvd=${pReq.Auth}, shouldBe=${pConnection.IncomingAuth.token}`);
        const resp: BMessage = MakeResponse(pReq, BMessageOps.UnknownResp);
        resp.Exception = 'Not authorized';
        pConnection.Send(resp);
        return;
    };
    if (pReq.RCode) {
        // Has a response code. Must be a response to an RPC
        const session = pConnection._rpcSessions.get(pReq.RCode);
        if (session) {
            try {
                Logger.cdebug('RPCResponse', `BasilConnection.Processor: response: ${JSONstringify(pReq)}`);
                pConnection._rpcSessions.delete(pReq.RCode);
                // eslint-disable-next-line
                session.resolve(pReq);
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
            const errMsg = `Processor.HandleResponse: received msg which is not RPC response: ${JSONstringify(pReq)}`;
            Logger.error(errMsg);
        };
    }
    else {
        // No response code, must be an incoming request
        switch (pReq.Op) {
            case BMessageOps.CreateItemReq: {
                const resp: BMessage = MakeResponse(pReq, BMessageOps.CreateItemResp);
                try {
                    const newBItem = BItems.createFromProps(pReq.IProps);
                    if (newBItem) {
                        resp.IId = newBItem.id;
                        resp.IProps['Id'] = newBItem.id;
                    }
                    else {
                        resp.Exception = 'Failed creation';
                    };
                }
                catch(e) {
                    resp.Exception = ExtractStringError(e);
                }
                await Eventing.Fire(pConnection.GetEventTopicForMessageOp('CreateItem'), {
                    request: pReq,
                    response: resp,
                    connection: pConnection,
                    protocol: pProto
                });
                pConnection.Send(resp);
                break;
            }
            case BMessageOps.DeleteItemReq: {
                const resp: BMessage = MakeResponse(pReq, BMessageOps.DeleteItemResp);
                // TODO: check auth and prevent deleting system BItems
                BItems.removeById(pReq.IId);
                await Eventing.Fire(pConnection.GetEventTopicForMessageOp('DeleteItem'), {
                    request: pReq,
                    response: resp,
                    connection: pConnection,
                    protocol: pProto
                });
                pConnection.Send(resp);
                break;
            }
            case BMessageOps.AddAbilityReq: {
                const resp: BMessage = MakeResponse(pReq, BMessageOps.AddAbilityResp);
                // TODO: check auth and prevent adding abilities to system BItems
                const bitem = BItems.get(pReq.IId);
                const abilities = pReq.IProps['Abilities'];
                if (bitem) {
                    if (abilities) {
                        const abils = abilities.split(',');
                        for (const abil of abils) {
                            const newAbility = AbilityFactory(abil, pReq.IProps);
                            if (newAbility) {
                                bitem.addAbility(newAbility);
                            }
                            else {
                                resp.Exception = `Could not create Ability ${abil}`;
                                break;
                            };
                        };
                    }
                    else {
                        resp.Exception = 'No abilities specified';
                    };
                }
                else {
                    resp.Exception = 'BItem not found';
                };
                resp.IId = pReq.IId;
                await Eventing.Fire(pConnection.GetEventTopicForMessageOp('AddAbility'), {
                    request: pReq,
                    response: resp,
                    connection: pConnection,
                    protocol: pProto
                });
                pConnection.Send(resp);
                break;
            }
            case BMessageOps.RemoveAbilityReq: {
                // TODO: check auth and prevent removing abilities from system BItems
                const resp: BMessage = MakeResponse(pReq, BMessageOps.RemoveAbilityResp);
                const bitem = BItems.get(pReq.IId);
                const abilities = pReq.IProps['Abilities'];
                if (bitem) {
                    if (abilities) {
                        const abils = abilities.split(',');
                        for (const abil of abils) {
                            bitem.removeAbility(abil);
                        };
                    }
                    else {
                        resp.Exception = 'No abilities specified';
                    };
                }
                else {
                    resp.Exception = 'BItem not found';
                };
                resp.IId = pReq.IId;
                await Eventing.Fire(pConnection.GetEventTopicForMessageOp('RemoveAbility'), {
                    request: pReq,
                    response: resp,
                    connection: pConnection,
                    protocol: pProto
                });
                pConnection.Send(resp);
                break;
            }
            case BMessageOps.RequestPropertiesReq: {
                const resp: BMessage = MakeResponse(pReq, BMessageOps.RequestPropertiesResp);
                const bitem = BItems.get(pReq.IId);
                const filter = pReq.IProps['Filter'];
                if (bitem) {
                    resp.IProps = bitem.getProperties(filter);
                    resp.IId = bitem.id;
                };
                resp.IId = pReq.IId;
                await Eventing.Fire(pConnection.GetEventTopicForMessageOp('RequestProperties'), {
                    request: pReq,
                    response: resp,
                    connection: pConnection,
                    protocol: pProto
                });
                pConnection.Send(resp);
                break;
            }
            case BMessageOps.UpdatePropertiesReq: {
                const resp: BMessage = MakeResponse(pReq, BMessageOps.UpdatePropertiesResp);
                const bitem = BItems.get(pReq.IId);
                if (bitem) {
                    for (const prop of Object.keys(pReq.IProps)) {
                        bitem.setProp(prop, pReq.IProps[prop]);
                    };
                }
                else {
                    resp.Exception = 'BItem not found';
                };
                resp.IId = pReq.IId;
                await Eventing.Fire(pConnection.GetEventTopicForMessageOp('UpdateProperties'), {
                    request: pReq,
                    response: resp,
                    connection: pConnection,
                    protocol: pProto
                });
                pConnection.Send(resp);
                break;
            }
            // This code for OpenSession and CloseSession does not send a response
            // This is explected to be done by the event subscriber
            case BMessageOps.OpenSessionReq: {
                const resp: BMessage = MakeResponse(pReq, BMessageOps.OpenSessionResp);
                if (pReq.IProps?.hasOwnProperty('ClientAuth')) {
                    pConnection.OutgoingAuth = new AuthToken(pReq.IProps['ClientAuth']);
                };
                await Eventing.Fire(pConnection.GetEventTopicForMessageOp('OpenSession'), {
                    request: pReq,
                    response: resp,
                    connection: pConnection,
                    protocol: pProto
                });
                break;
            }
            case BMessageOps.CloseSessionReq: {
                const resp: BMessage = MakeResponse(pReq, BMessageOps.CloseSessionResp);
                await Eventing.Fire(pConnection.GetEventTopicForMessageOp('CloseSession'), {
                    request: pReq,
                    response: resp,
                    connection: pConnection,
                    protocol: pProto
                });
                pConnection.setShutdown();
                break;
            }
            case BMessageOps.AliveCheckReq: {
                const resp: BMessage = MakeResponse(pReq, BMessageOps.AliveCheckResp);
                resp.IProps = CreatePropertyList( {
                    'time': Date.now(),
                    'sequenceNum': pConnection._aliveSequenceNumber++,
                    'timeReceived': pReq.IProps??['time'],
                    'sequenceNumberReceived': pReq.IProps??['sequenceNum']
                });
                pConnection.Send(resp);
                break;
            }
            case BMessageOps.MakeConnectionReq: {
                // Logger.debug(`MakeConnectionReq: ${pReq.IProps['transportURL']}`);
                const resp: BMessage = MakeResponse(pReq, BMessageOps.MakeConnectionResp);
                // I've been asked to make a connection somewhere
                const params: MakeConnectionParams = {
                    'transport':    pReq.IProps['transport'] ?? 'WS',
                    'transportURL': pReq.IProps['transportURL'] ?? undefined,
                    'protocol':     pReq.IProps['protocol'] ?? 'Basil-JSON',
                    'service':      pReq.IProps['service'] ?? 'SpaceServer'
                };
                // Just in case someone is watching and wants to record or change parameters
                await Eventing.Fire(pConnection.GetEventTopicForMessageOp('MakeConnection'), {
                    request: pReq,
                    response: resp,
                    connection: pConnection,
                    protocol: pProto,
                    params: params
                });
                try {
                    const newConnection = await Comm.MakeConnection(params);
                    newConnection.OutgoingAuth = new AuthToken(pReq.IProps['serviceAuth']);
                    const openProps: OpenSessionReqProps = {
                        basilVersion: VERSION['version-tag'],
                        clientAuth: newConnection.IncomingAuth.token,
                    };
                    await newConnection.OpenSession(openProps);
                    pConnection.Send(resp);
                }
                catch (e) {
                    const err = <BMessage>e;    // kludge for eslint
                    const resp: BMessage = { 'Op': BMessageOps.MakeConnectionResp, IProps: {}};
                    resp.Exception = `OpenSession exception: ${err.Exception}`;
                    if (err.ExceptionHints) {
                        resp.ExceptionHints = err.ExceptionHints;
                    }
                    pConnection.Send(resp);
                };
                break;
            }
            case BMessageOps.AliveCheckReq: {
                const resp: BMessage = MakeResponse(pReq, BMessageOps.AliveCheckResp);
                resp.IProps = CreatePropertyList( {
                    'time': Date.now(),
                    'sequenceNum': pConnection._aliveSequenceNumber++,
                    'timeReceived': pReq.IProps??['time'],
                    'sequenceNumberReceived': pReq.IProps??['sequenceNum']
                });
                // Just in case someone is watching and wants to record
                await Eventing.Fire(pConnection.GetEventTopicForMessageOp('AliveCheck'), {
                    request: pReq,
                    response: resp,
                    connection: pConnection,
                    protocol: pProto
                });
                pConnection.Send(resp);
                break;
            }
            default:
                break;
        };
        void ProcessDelayedGraphicsOperations();
    };
};

// Add the proper thing to a response to make it a response
function MakeResponse(pReq: BMessage, pOp: number): BMessage {
    const resp: BMessage = { 'Op': pOp, IProps: {} };
    if (pReq.SCode) {
        resp.RCode = pReq.SCode;
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

// Send the message and return a Promise that is completed when the message
//    response is received. The Promise returns the response message.
//    Additionally, the Promise is rejected if there are errors (timeout, ...).
function SendAndPromiseResponse(pReq: BMessage, pContext: BasilConnection): Promise<BMessage> {
    const responseSession = RandomIdentifier();
    pReq.SCode = responseSession;
    if (Config.Debug && Config.Debug.RPCSent) {
        Logger.debug('BasilConnection.SendAndPromiseResponse: sending: ' + JSONstringify(pReq));
    }
    // Return a promise and pass the 'resolve' function to the response message processor
    return new Promise( (resolve,reject) => {
        pContext.RememberRPCSession(responseSession, {
            timeRPCCreated: Date.now(),
            resolve,
            reject,
        } );
        pContext._proto.WhenReady()
        .then( () => {
            pContext._proto.Send(pReq);
        })
        .catch( (e) => {
            pContext._rpcSessions.delete(responseSession);
            Logger.error(`BasilConnection.SendAndPromiseResponse: WhenReady failed: ${ExtractStringError(e)}`);
            reject(ExtractStringError(e));
        });
    });
};