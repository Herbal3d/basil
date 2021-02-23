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

import { BItem } from '@BItem/BItem';
import { BTransport } from '@Comm/BTransport';
import { BMessage } from '@Comm/BMessage';

import { BKeyedCollection } from '@Base/Tools/bTypes';

// On reception, the receiver gets a binary message to deserialize
export type BProtocolReceptionCallback = (pMsg: BMessage, pContext: BItem, pProto: BProtocol) => Promise<void>;

// Protocol sends and receives BMessages.
export abstract class BProtocol extends BItem {
    _xport: BTransport;
    _params: BKeyedCollection;
    _receiveCallback: BProtocolReceptionCallback;
    _receiveCallbackContext: BItem;

    constructor(pTransport: BTransport, pId: string, pLayer: string) {
        super(pId, undefined, pLayer);
        this._xport = pTransport;
    };

    abstract Start(pParams: BKeyedCollection): Promise<BProtocol>;

    abstract Close(): void;

    abstract Send(pData: BMessage): boolean;

    SetReceiveCallback(pCallBack: BProtocolReceptionCallback, pContext?: BItem): void {
      this._receiveCallback = pCallBack;
      this._receiveCallbackContext = pContext;
    };

    abstract isDataAvailable: boolean;

    abstract isConnected: boolean;
};
