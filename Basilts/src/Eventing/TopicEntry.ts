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

import { TopicName, SubscriptionEntry } from '@Eventing/SubscriptionEntry';
import { BKeyedCollection } from '@Tools/bTypes';

// One topic that can be subscribed to.
// This is the datastructure for a topic, its subscriptions, and actions.
// This data structure is passed around to the subscribers so 'fire' can be called.
export class TopicEntry {
  public topic: TopicName;
  public subs: SubscriptionEntry[];
  public numTopicEventsFired: number;
  public registar: string;
  public registered: boolean;

  constructor(pTopicName: TopicName) {
    this.topic = pTopicName;
    this.subs = [];
    this.numTopicEventsFired = 0;
    this.registered = false;
  }
  hasSubscriptions(): boolean {
    return this.subs.length > 0;
  };
  addSubscription(sub: SubscriptionEntry): void {
    this.subs.push(sub);
  };
  removeSubscription(sub: SubscriptionEntry): void {
    for (let ii=this.subs.length-1; ii>=0; ii--) {
      if (this.subs[ii].id === sub.id) {
        this.subs.splice(ii, 1);
      }
    }
  };
  wasRegistered(): boolean {
    return this.registered;
  };
  async fire(params: BKeyedCollection): Promise<SubscriptionEntry[]> {
    this.numTopicEventsFired++;
    if (this.subs.length > 0) {
      // this.subs.map( sub => { sub.fire(params); } );
      // Could wait for the resolution of the Promises
      return Promise.all(this.subs.map( sub => { return sub.fire(params); } ));
    };
    return null;
  };
};

