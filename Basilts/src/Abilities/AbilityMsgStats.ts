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

import { Ability, RegisterAbility } from '@Abilities/Ability';
import { BItem, PropValue } from '@BItem/BItem';
import { BKeyedCollection } from '@Base/Tools/bTypes';

export enum BItemState {
    UNINITIALIZED = 0,
    LOADING,
    FAILED,
    READY,
    SHUTDOWN
};

export const AbMsgStatsName = "MsgStats";

export function AbMsgStatsFromProps(pProps: BKeyedCollection): AbMsgStats {
    return new AbMsgStats();
};

// Register the ability with the AbilityFactory. Note this is run when this file is imported.
RegisterAbility(AbMsgStatsName, AbMsgStatsFromProps);

// Ability that holds messages received and sent count
export class AbMsgStats extends Ability {

    static MessagesReceivedProp: string = 'messagesReceived';
    static MessagesSentProp: string = 'messagesSent';

    public messagesSent: number = 0;
    public messagesReceived: number = 0;

    constructor() {
        super(AbMsgStatsName);
    };

    addProperties(pBItem: BItem): void {
        super.addProperties(pBItem);

        // Get and Set the number of received messages
        pBItem.addProperty(AbMsgStats.MessagesReceivedProp, this);
        pBItem.addProperty(AbMsgStats.MessagesSentProp, this);
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };
};
