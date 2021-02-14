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

import { Ability } from '@Abilities/Ability';
import { BItem, PropEntry } from '@BItem/BItem';

export let MessagesReceivedProp: string = 'messagesReceived';
export let MessagesSentProp: string = 'messagesSent';

export enum BItemState {
    UNINITIALIZED = 0,
    LOADING,
    FAILED,
    READY,
    SHUTDOWN
};

export class AbilityMsgStats extends Ability {
    constructor(pBItem: BItem) {
        super('AbilityMsgStats', pBItem);

        pBItem.addProperty({
            name: MessagesReceivedProp,
            value: 0,
            ability: this,
        });
        pBItem.addProperty({
            name: MessagesSentProp,
            value: 0,
            ability: this,
        });
    };
};
