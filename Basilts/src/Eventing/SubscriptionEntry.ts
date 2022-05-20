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

import { BKeyedCollection } from '@Tools/bTypes';

export type TopicName = string;
export type EventProcessor = (pParams: BKeyedCollection, pTopic?: TopicName, pExtraParams?: any) => void;
// ===========================================
// One subscription
// Subscriptions are created with a unique ID so individual subscriptions can be
//     found for removal (because there can be multiple subsriptions for the same processor).
// Note: currently 'limits' is unused but someday will be used for timing and frequency limiting
export class SubscriptionEntry {
  public topic: TopicName;            // subscribed topic name
  public processor: EventProcessor;// Processor for this subscription
  public id: string;               // Unique ID for this subscription
  public limits: number;           // Rate limit
  public numSubscriptionFired: number; // Count of times fired
  public extraParams: any;

  constructor(pTopic: string, pProcessor: EventProcessor, pId: string, pExtraParams?: any, pLimits?: number) {
    this.topic = pTopic;
    this.processor = pProcessor;
    this.id = pId;
    this.limits = pLimits;
    this.extraParams = pExtraParams;
    this.numSubscriptionFired = 0;
  };
  // Returns a promise for when event has been processed
  async fire(params: BKeyedCollection): Promise<SubscriptionEntry> {
    this.numSubscriptionFired++;
    this.processor(params, this.topic, this.extraParams);
    return this;
  };
};
