// Copyright 2020 Robert Adams
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
import { BItem, BItemType } from '../Items/BItem.js';

import { MsgProcessor } from './MsgProcessor.js';
import { BasilMessageOps } from './BasilMessageOps.js';

import { CombineParameters, CreateUniqueId, JSONstringify } from '../Utilities.js';

import { AbilityFactory } from '../Items/AbilityRegistration.js';

// Message API for the Basil <=> SpaceServer connection.

// This acts as both ends of a Basil <=> SpaceServer connection for Javascript.
//    The parameter 'AsServer' is true if this instance is acting as the SpaceServer end.
//    Organized this way so the JS code can be used both for the regular Basil viewer
//    as well as for JS testing code.
export class BasilComm extends MsgProcessor {
    constructor(pTransport, pParams) {
        // Merge the passed parameters with required parameter defaults
        let params = CombineParameters(Config.comm.BasilClient, pParams, {
            'id': undefined,    // unique generated if not specified
            'AsServer': false   // default to being a Basil client
        });
        params.id = params.id ? params.id : CreateUniqueId('BasilClientConnection');
        super(params.id, undefined);
        this.params = params;
        this.transport = pTransport;
        this.IsServer = params.AsServer;

        let processors = new Map();
        processors.set(BasilMessageOps.CreateItemReq, this._procCreateItem.bind(this));
        processors.set(BasilMessageOps.CreateItemResp, this.HandleResponse.bind(this));
        processors.set(BasilMessageOps.DeleteItemReq, this._procDeleteItem.bind(this));
        processors.set(BasilMessageOps.DeleteItemResp, this.HandleResponse.bind(this));
        processors.set(BasilMessageOps.AddAbilityReq, this._procAddAbility.bind(this));
        processors.set(BasilMessageOps.AddAbilityResp, this.HandleResponse.bind(this));
        processors.set(BasilMessageOps.RemoveAbilityReq, this._procRemoveAbility.bind(this));
        processors.set(BasilMessageOps.RemoveAbilityResp, this.HandleResponse.bind(this));
        processors.set(BasilMessageOps.RequestPropertiesReq, this._procRequestProperties.bind(this));
        processors.set(BasilMessageOps.RequestPropertiesResp, this.HandleResponse.bind(this));
        processors.set(BasilMessageOps.UpdatePropertiesReq, this._procUpdateProperties.bind(this));
        processors.set(BasilMessageOps.UpdatePropertiesResp, this.HandleResponse.bind(this));

        processors.set(BasilMessageOps.OpenSessionReq, this._procOpenSessionSession.bind(this));
        processors.set(BasilMessageOps.OpenSessionResp, this.HandleResponse.bind(this));
        processors.set(BasilMessageOps.CloseSessionReq, this._procCloseSession.bind(this));
        processors.set(BasilMessageOps.CloseSessionResp, this.HandleResponse.bind(this));
        processors.set(BasilMessageOps.MakeConnectionReq, this._procMakeConnection.bind(this));
        processors.set(BasilMessageOps.MakeConnectionResp, this.HandleResponse.bind(this));

        processors.set(BasilMessageOps.AliveCheckReq, this._procAliveCheck.bind(this));
        processors.set(BasilMessageOps.AliveCheckResp, this.HandleResponse.bind(this));

        this.RegisterMsgProcess(this.transport, processors);
    };

    Start() {
        if (this.IsServer) {
            // If a server, don't become ready until an OpenSession has been received
        }
        else {
          this.SetReady();
        };
    };

    Close() {
    };

    CreateItem(pAuth, pProps, pAbilities) {
        let msg = { 'Op': BasilMessageOps.CreateItemReq};
        if (pAuth) msg['SessionAuth'] = pAuth;
        if (pProps) msg['IProps'] = this.CreatePropertyList(pProps);
        if (pAbilities) msg['AProps'] = this.BuildAbilityProps(pAbilities);
        return this.SendAndPromiseResponse(msg);
    };

    _procCreateItem(req) {
        let ret = { 'Op': BasilMessageOps.CreateItemResp};
        if (this._CheckAuth(req.SessionAuth)) {
            // We create a unique Id if one not supplied.
            // TODO: check if ID already exists!!
            let id = req.ItemId ? req.ItemId : CreateUniqueId('remote');
            let itemAuth = req.ItemAuth ? req.itemAuth : req.SessionAuth;
            let newItem = new BItem(id, itemAuth);
            newItem.ownerId = this.id;    // So we know who created what
            // TODO: copy IProps
            // If Ability definitions have been sent, add those abilities
            if (req.AProps && req.AProps.length > 0) {
                req.AProps.forEach( abil => {
                    let newAbility = AbilityFactory(abil);
                    if (newAbility) {
                        newItem.AddAbility(newAbility);
                    }
                    else {
                        GP.ErrorLog('BasilComm._procCreateItem: failed creation of ability: ' + JSONstringify(abil));
                    };
                });
            };
            ret['IProps'] = this.CreatePropertyList( {
                'ItemId': newItem.id,
                'ItemIdN': newItem.idN
            });
        }
        else {
            ret['Exception'] = 'Not authorized';
      };
      return ret;
    };

    DeleteItem(asset, id) {
    };

    _procDeleteItem(req) {
    };

    AddAbility(pAuth, pId, pAbilities) {
    };
    _procAddAbility(req) {
    };
    
    RemoveAbility(pAuth, pId, pAbilities) {
    };
    _procRemoveAbility(req) {
    };
    
    RequestProperties(pAuth, pId, filter) {
        let msg = { 'Op': BasilMessageOps.RequestPropertiesReq};
        if (pAuth) msg['SessionAuth'] = pAuth;
        if (pId) msg['ItemId'] = pId;
        if (filter) msg['IProps'] = this.CreatePropertyList({ 'filter': filter });
        return this.SendAndPromiseResponse(msg);
    };
    _procRequestProperties(req) {
        let ret = { 'Op': BasilMessageOps.RequestPropertiesResp};
        if (this._CheckAuth(req.auth)) {
            let filter = (req.IProps && req.IProps['filter']) ? req.IProps['filter'] : undefined;
            let item = BItem.GetItemN(req.ItemId, req.ItemIdN);
            if (item) {
                ret['IProps'] = this.CreatePropertyList(item.FetchProperties(filter));
            }
            else {
                ret['Exception'] = 'Instance not found';
            }
        }
        else {
            ret['Exception'] = 'Not authorized';
        }
        return ret;
    };

    UpdateProperties(pAuth, pId, pProps) {
    };
    _procUpdateProperties(req) {
    };

    OpenSession(pAuth, propertyList) {
        let msg = { 'Op': BasilMessageOps.OpenSessionReq};
        if (pAuth) msg['SessionAuth'] = pAuth;
        if (propertyList) msg['IProps'] = this.CreatePropertyList(propertyList);
        return this.SendAndPromiseResponse(msg);
    };
    _procOpenSessionSession(req) {
        // A server end is ready after processing an OpenSession request
        let msg = { 'Op': BasilMessageOps.OpenSessionResp};
        this.openSessionProperties = req.IProps;
        this.SetReady();
        return msg;
    };

    CloseSession(pAuth, reason) {
        let msg = { 'Op': BasilMessageOps.CloseSessionReq};
        if (pAuth) msg['SessionAuth'] = pAuth;
        if (reason) msg['IProps'] = this.CreatePropertyList({ 'reason': reason } );
        return this.SendAndPromiseResponse(msg);
    };
    _procCloseSession(req) {
        let ret = { 'Op': BasilMessageOps.CloseSessionResp};
        return ret;
    };

    MakeConnection(pAuth, propertyList) {

    };
    _procMakeConnection(req) {
    };

    AliveCheck(pAuth) {
        let msg = { 'Op': BasilMessageOps.AliveCheckReq};
        if (pAuth) msg['pAuth'] = pAuth;
        msg['IProps'] = this.CreatePropertyList( {
            'time': Date.now(),
            'sequenceNum': this.aliveSequenceNum++
        });
        // GP.DebugLog('AliveCheckBasil.AliveCheck: sending: ' + JSON.stringify(msg));
        return this.SendAndPromiseResponse(msg);
    };

    _procAliveCheck(req) {
        let msg = { 'Op': BasilMessageOps.AliveCheckResp};
        msg['IProps'] = this.CreatePropertyList( {
            'time': Date.now(),
            'sequenceNum': this.aliveSequenceNum++,
            'timeReceived': req.IProps.Values['time'],
            'sequenceNumberReceived': req.IProps.Values['sequenceNum']
        });
        return msg;
    };

    _CheckAuth(pAuth) {
        return true;
    }


}
