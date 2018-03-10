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
import Config from 'xConfig';
import { BasilServer as BasilServerMsgs } from "xBasilServerMessages"

var BS = BS || {};
GP.BS = BS;

export class BasilClientConnection {
    constructor(clientID, xport, parms) {
        this.clientID = clientID;
        this.transport = xport;
    }
    Start() {
    }
    Close() {
    }
    // function that sends the request and returns a Promise for the response.
    static function SendAndPromiseResponse(msg, xport, reqName) {
        let smsg = {};
        smsg[ reqName + 'ReqMsg'] = msg;
        let cmsg = BasilServerMsgs.BasilServerMessage.create(smsg);
        let emsg = BasilServerMsgs.BasilServerMessage.encode(cmsg).finish();
        return new Promise((resolve, reject) => {
            xport.sendRPC(msg, xport)
            .then( resp => {
                let response = BasilServerMsgs.BasilServerMessage.decode(resp);
                if (response.hasOwnProperty( reqName + 'RespMsg')) {
                    resolve(response[ reqName + 'RespMsg']);
                }
                else {
                    reject('illegal response:' + JSON.stringify(response));
                }
            })
            .catch( e => {
                reject(e);
            });
        });
    }

    IdentifyDisplayableObject(auth, id, asset, aabb) {
        let msg = {
            'id': id,
            'asset': asset
        };
        if (auth !== undefined) msg['auth'] = auth;
        if (aabb !== undefined) msg['aabb'] = aabb;
        return BasilClientConnection.SendAndPromiseResponse(msg, this.transport, 'IdentifyDisplayableObject');
    }
    ForgetDisplayableObject(auth, id) {
        let msg = {
            'id': id
        };
        if (auth !== undefined) msg['auth'] = auth;
        return BasilClientConnection.SendAndPromiseResponse(msg, this.transport, 'ForgetDisplayableObject');
    }
    CreateObjectInstance(auth, id, pos, props) {
        let msg = {
            'id': id
        };
        if (auth !== undefined) msg['auth'] = auth;
        if (pos !== undefined) msg['pos'] = pos;
        if (props !== undefined) msg['props'] = props;
        return BasilClientConnection.SendAndPromiseResponse(msg, this.transport, 'CreateObjectInstance');
    }
    DeleteObjectInstance(auth, id) {
        let msg = {
            'id': id
        };
        if (auth !== undefined) msg['auth'] = auth;
        return BasilClientConnection.SendAndPromiseResponse(msg, this.transport, 'DeleteObjectInstance');
    }
    UpdateObjectProperty(auth, id, props) {
        let msg = {
            'id': id
        };
        if (auth !== undefined) msg['auth'] = auth;
        if (props !== undefined) msg['props'] = props;
        return BasilClientConnection.SendAndPromiseResponse(msg, this.transport, 'UpdateObjectProperty');
    }
    UpdateInstanceProperty(auth, id, props) {
        let msg = {
            'id': id
        };
        if (auth !== undefined) msg['auth'] = auth;
        if (props !== undefined) msg['props'] = props;
        return BasilClientConnection.SendAndPromiseResponse(msg, this.transport, 'UpdateInstanceProperty');
    }
    UpdateInstancePosition(auth, id,  pos) {
        let msg = {
            'id': id
        };
        if (auth !== undefined) msg['auth'] = auth;
        if (pos !== undefined) msg['pos'] = pos;
        return BasilClientConnection.SendAndPromiseResponse(msg, this.transport, 'UpdateInstancePosition');
    }
    RequestObjectProperties(auth, id, filter) {
        let msg = {
            'id': id
        };
        if (auth !== undefined) msg['auth'] = auth;
        if (filter !== undefined) msg['filter'] = filter;
        return BasilClientConnection.SendAndPromiseResponse(msg, this.transport, 'RequestObjectProperties');
    }
    RequestInstanceProperties(auth, id, filter) {
        let msg = {
            'id': id
        };
        if (auth !== undefined) msg['auth'] = auth;
        if (filter !== undefined) msg['filter'] = filter;
        return BasilClientConnection.SendAndPromiseResponse(msg, this.transport, 'RequestInstanceProperties');
    }
    OpenSession(auth, props) {
        let msg = {};
        if (auth !== undefined) msg['auth'] = auth;
        if (props !== undefined) msg['props'] = props;
        return BasilClientConnection.SendAndPromiseResponse(msg, this.transport, 'OpenSession');
    }
    CloseSession(auth, reason) {
        let msg = {};
        if (auth !== undefined) msg['auth'] = auth;
        if (reason !== undefined) msg['reason'] = reason;
        return BasilClientConnection.SendAndPromiseResponse(msg, this.transport, 'CloseSession');
    }
    AliveCheck(auth) {
        let msg = {};
        if (auth !== undefined) msg['auth'] = auth;
        return BasilClientConnection.SendAndPromiseResponse(msg, this.transport, 'AliveCheck');
    }
}

export function NewBasilClient(clientID, xport, parms) {
    return new BasilClientConnection(clientID, xport, parms);
}
