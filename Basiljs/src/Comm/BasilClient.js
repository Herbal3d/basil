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

import { MsgProcessor } from './MsgProcessor.js';
import { BasilSpaceStream  } from "../jslibs/BasilServerMessages.js"

import { CombineParameters, CreateUniqueId } from '../Utilities.js';

// Interface of a client talking to a Basil Viewer over the Basil/SpaceServer stream connection
export class BasilClientConnection extends MsgProcessor {
    constructor(pTransport, pParams) {
        // Merge the passed parameters with required parameter defaults
        let params = CombineParameters(Config.comm.BasilClient, pParams, {
            'id': undefined     // unique generated if not specified
        });
        params.id = params.id ? params.id : CreateUniqueId('BasilClientConnection');
        super(params.id, undefined);
        this.params = params;
        this.xport = pTransport;
        this.RegisterMsgProcess(this.transport, /*    sends */ BasilSpaceStream.BasilStreamMessage,
                                                /* receives */ BasilSpaceStream.SpaceStreamMessage, {
            'IdentifyDisplayableObjectRespMsg': this.HandleResponse.bind(this),
            'ForgetDisplayableObjectRespMsg': this.HandleResponse.bind(this),
            'CreateObjectInstanceRespMsg': this.HandleResponse.bind(this),
            'DeleteObjectInstanceRespMsg': this.HandleResponse.bind(this),
            'UpdateObjectPropertyRespMsg': this.HandleResponse.bind(this),
            'UpdateInstancePropertyRespMsg': this.HandleResponse.bind(this),
            'UpdateInstancePositionRespMsg': this.HandleResponse.bind(this),
            'RequestObjectPropertiesRespMsg': this.HandleResponse.bind(this),
            'RequestInstancePropertiesRespMsg': this.HandleResponse.bind(this),
            'CloseSessionRespMsg': this.HandleResponse.bind(this),
        });
    };

    Start() {
        if (this.xport) {
            this.xport.SetReceiveCallback(this._ProcMessage.bind(this));
        }
    };

    Close() {
    };

    IdentifyDisplayableObject(auth, asset, id, aabb) {
        let msg = { 'assetInfo': asset };
        if (auth) msg['auth'] = auth;
        if (id) msg['objectId'] = { 'id': id };
        if (aabb) msg['aabb'] = aabb;
        return this.SendAndPromiseResponse(msg, 'IdentifyDisplayableObject');
    };
    ForgetDisplayableObject(auth, id) {
        let msg = { 'objectId': { 'id': id } };
        if (auth) msg['auth'] = auth;
        return this.SendAndPromiseResponse(msg, 'ForgetDisplayableObject');
    };
    CreateObjectInstance(auth, objectId, instancePositionInfo, propertyList, instanceId) {
        let msg = { 'objectId': { 'id': objectId } };
        if (auth) msg['auth'] = auth;
        if (instancePositionInfo) msg['pos'] = instancePositionInfo;
        if (propertyList) msg['props'] = propertyList;
        if (instanceId) msg['instanceId'] = { 'id': instanceId };
        return this.SendAndPromiseResponse(msg, 'CreateObjectInstance');
    };
    DeleteObjectInstance(auth, instanceId) {
        let msg = { 'instanceId': { 'id': instanceId } };
        if (auth) msg['auth'] = auth;
        return this.SendAndPromiseResponse(msg, 'DeleteObjectInstance');
    };
    UpdateObjectProperty(auth, objectId, propertyList) {
        let msg = { 'objectId': { 'id': objectId } };
        if (auth) msg['auth'] = auth;
        if (propertyList) msg['props'] = propertyList;
        return this.SendAndPromiseResponse(msg, 'UpdateObjectProperty');
    };
    UpdateInstanceProperty(auth, instanceId, propertyList) {
        let msg = { 'instanceId': { 'id': instanceId } };
        if (auth) msg['auth'] = auth;
        if (propertyList) msg['props'] = propertyList;
        return this.SendAndPromiseResponse(msg, 'UpdateInstanceProperty');
    };
    UpdateInstancePosition(auth, instanceId,  pos) {
        let msg = { 'instanceId': { 'id': instanceId } };
        if (auth) msg['auth'] = auth;
        if (pos) msg['pos'] = pos;
        return this.SendAndPromiseResponse(msg, 'UpdateInstancePosition');
    };
    RequestObjectProperties(auth, objectId, filter) {
        let msg = { 'objectId': { 'id': objectId } };
        if (auth) msg['auth'] = auth;
        if (filter) msg['filter'] = filter;
        return this.SendAndPromiseResponse(msg, 'RequestObjectProperties');
    };
    RequestInstanceProperties(auth, instanceId, filter) {
        let msg = { 'instanceId': { 'id': instanceId } };
        if (auth) msg['auth'] = auth;
        if (filter) msg['filter'] = filter;
        return this.SendAndPromiseResponse(msg, 'RequestInstanceProperties');
    };
    CloseSession(auth, reason) {
        let msg = {};
        if (auth) msg['auth'] = auth;
        if (reason) msg['reason'] = reason;
        return this.SendAndPromiseResponse(msg, 'CloseSession');
    };
};
