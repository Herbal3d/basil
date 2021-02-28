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

import { BMessage } from '@Comm/BMessage';
import { BProtocol, BProtocolReceptionCallback } from '@Comm/BProtocol';
import { BTransport } from '@Comm/BTransport';

import { CombineParameters, CreateUniqueId } from "@Tools/Utilities";
import { BKeyedCollection } from '@Base/Tools/bTypes';

export class BProtocolFB extends BProtocol {
    constructor(pParams: BKeyedCollection, pXPort: BTransport) {
        super(pXPort, CreateUniqueId('BProtocolFB'));
        this._params = CombineParameters(undefined, pParams, {
            'transportURL': undefined   // name of Worker to connect to
        });
    };
    async Start(pParams: BKeyedCollection): Promise<BProtocol> {
        this._xport.SetReceiveCallback(Processor, this);
        return this;
    };
    Close(): void {
        throw new Error('Method not implemented.');
    };
    Send(pData: BMessage): boolean {
        throw new Error('Method not implemented.');
    };
    SetReceiveCallback(pCallBack: BProtocolReceptionCallback): void {
        throw new Error('Method not implemented.');
    };
    PushReception(): void {
        throw new Error('Method not implemented.');
    };
    get isDataAvailable(): boolean {
        return false;
    };
    get isConnected(): boolean {
        return false;
    };
};

// Process the incoming message
function Processor(pMsg: any, pContext: BProtocolFB, pXPort: BTransport) {
    // Unpack the message into a BMessage
    const x = 5;      // make tslint happy. Remove when code is here
};
