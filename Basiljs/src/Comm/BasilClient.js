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
import { BasilMessageOps } from './BasilMessageOps.js';

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
        this.transport = pTransport;
        let processors = {};
        processors[BasilMessageOps['IdentifyDisplayableObjectResp']] = this.HandleResponse.bind(this);
        processors[BasilMessageOps['ForgetDisplayableObjectResp']] = this.HandleResponse.bind(this);
        processors[BasilMessageOps['CreateObjectInstanceResp']] = this.HandleResponse.bind(this);
        processors[BasilMessageOps['DeleteObjectInstanceResp']] = this.HandleResponse.bind(this);
        processors[BasilMessageOps['UpdateObjectPropertyResp']] = this.HandleResponse.bind(this),
        processors[BasilMessageOps['UpdateInstancePropertyResp']] = this.HandleResponse.bind(this);
        processors[BasilMessageOps['UpdateInstancePositionResp']] = this.HandleResponse.bind(this);
        processors[BasilMessageOps['RequestObjectPropertiesResp']] = this.HandleResponse.bind(this);
        processors[BasilMessageOps['RequestInstancePropertiesResp']] = this.HandleResponse.bind(this);
        processors[BasilMessageOps['CloseSessionResp']] = this.HandleResponse.bind(this);
        this.RegisterMsgProcess(this.transport, processors);
    };

    Start() {
        this.SetReady();
    };

    Close() {
    };

    IdentifyDisplayableObject(auth, asset, id, aabb) {
        let msg = { 'op': BasilMessageOps.IdentifyDisplayableObjectReq };
        msg['assetInfo'] = asset;
        if (auth) msg['auth'] = auth;
        if (id) msg['objectId'] = { 'id': id };
        if (aabb) msg['aabb'] = aabb;
        return this.SendAndPromiseResponse(msg);
    };
    ForgetDisplayableObject(auth, id) {
        let msg = { 'op': BasilMessageOps.ForgetDisplayableObjectReq };
        msg['objectId'] = { 'id': id };
        if (auth) msg['auth'] = auth;
        return this.SendAndPromiseResponse(msg);
    };
    CreateObjectInstance(auth, objectId, instancePositionInfo, propertyList, instanceId) {
        let msg = { 'op': BasilMessageOps.CreateObjectInstanceReq };
        msg['objectId'] = { 'id': objectId };
        if (auth) msg['auth'] = auth;
        if (instancePositionInfo) msg['pos'] = instancePositionInfo;
        if (propertyList) msg['props'] = propertyList;
        if (instanceId) msg['instanceId'] = { 'id': instanceId };
        return this.SendAndPromiseResponse(msg);
    };
    DeleteObjectInstance(auth, instanceId) {
        let msg = { 'op': BasilMessageOps.DeleteObjectInstanceReq };
        msg['instanceId'] = { 'id': instanceId };
        if (auth) msg['auth'] = auth;
        return this.SendAndPromiseResponse(msg);
    };
    UpdateObjectProperty(auth, objectId, propertyList) {
        let msg = { 'op': BasilMessageOps.UpdateObjectPropertyReq };
        msg['objectId'] = { 'id': objectId };
        if (auth) msg['auth'] = auth;
        if (propertyList) msg['properties'] = propertyList;
        return this.SendAndPromiseResponse(msg);
    };
    UpdateInstanceProperty(auth, instanceId, propertyList) {
        let msg = { 'op': BasilMessageOps.UpdateInstancePropertyReq };
        msg['instanceId'] = { 'id': instanceId };
        if (auth) msg['auth'] = auth;
        if (propertyList) msg['properties'] = propertyList;
        return this.SendAndPromiseResponse(msg);
    };
    UpdateInstancePosition(auth, instanceId,  pos) {
        let msg = { 'op': BasilMessageOps.UpdateInstancePositionReq };
        msg['instanceId'] = { 'id': instanceId };
        if (auth) msg['auth'] = auth;
        if (pos) msg['pos'] = pos;
        return this.SendAndPromiseResponse(msg);
    };
    RequestObjectProperties(auth, objectId, filter) {
        let msg = { 'op': BasilMessageOps.RequestObjectPropertiesReq };
        msg['objectId'] = { 'id': objectId };
        if (auth) msg['auth'] = auth;
        if (filter) msg['filter'] = filter;
        return this.SendAndPromiseResponse(msg);
    };
    RequestInstanceProperties(auth, instanceId, filter) {
        let msg = { 'op': BasilMessageOps.RequestInstancePropertiesReq };
        msg['instanceId'] = { 'id': instanceId };
        if (auth) msg['auth'] = auth;
        if (filter) msg['filter'] = filter;
        return this.SendAndPromiseResponse(msg);
    };
    CloseSession(auth, reason) {
        let msg = {'op': BasilMessageOps.CloseSessionReq};
        if (auth) msg['auth'] = auth;
        if (reason) msg['reason'] = reason;
        return this.SendAndPromiseResponse(msg);
    };
};
