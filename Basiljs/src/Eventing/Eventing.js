//@ts-check
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

import { BItem, BItemType } from '../Items/BItem.js';

import { RandomIdentifier } from '../Utilities.js';

// A simple pub/sub system. An event producer registers a topic
//    and later 'fire's event on the topic. A envent consumer subscribers
//    to a topic and has a function called when that topic is 'fire'ed.
// The coding pattern:
// Event producer:
//    topicHandle = Eventing.register(topicName, whoIsRegistering);
//    ...
//    topicHandle.fire(params);
//        // 'params' is a JS object which is usually a map of values
//
// Event consumer:
//    eventHandle = Eventing.subscribe(topicName, function(params, topicName) {
//         //event processor
//    });
//    ...
//    Eventing.unsubscribe(eventHandle);
//
// NOTE: there is no locking here so beware of using multi-threaded JavaScript

// ===========================================
// One subscription
// Subscriptions are created with a unique ID so individual subscriptions can be
//     found for removal (because there can be multiple subescitions for the same processor).
// Note: currently 'limits' is unused but someday will be used for timing and frequency limiting
export class SubEntry {
    constructor(topic, processor, id, limits) {
        this.topic = topic;
        this.processor = processor;
        this.id = id;
        this.limits = limits;
    }
    fire(params) {
        this.processor(params, this.topic);
    }
}

// ===========================================
// One topic that can be subscribed to.
// This is the datastructure for a topic, its subscriptions, and actions.
// This data structure is passed around to the subscribers so 'fire' can be called.
export class TopicEntry {
    constructor(topicName) {
        this.topic = topicName;
        this.subs = [];
    }
    hasSubscriptions() {
        return this.subs.length > 0;
    };
    addSubscription(sub) {
        this.subs.push(sub);
    };
    removeSubscription(sub) {
        for (let ii=0; ii<this.subs.length; ii++) {
            if (this.subs[ii].id == sub.id) {
                this.subs.splice(ii, 1);
            }
        }
    };
    fire(params) {
        this.subs.forEach( sub => {
            sub.fire(params);
        });
    };
}

export class Eventing extends BItem {
    constructor()  {
        GP.DebugLog('Eventing: constructor');
        super('org.basil.b.eventing', undefined, BItemType.SERVICE);
        this.layer = Config.layers ? Config.layers.eventing : 'org.basil.b.layer.eventing';
        this.topics = new Map();
        this.timedEventProcessors = new Map();
        this.numSubscriptions = 0;
        this.numEventsFired = 0;

        // Start the timed event clock
        this._processTimedEvents();

        // There should be only one and we keep a pointer in GP
        GP.EventingInstance = this;
    }

    static Instance() {
        return GP.EventingInstance;
    }

    // ===========================================
    // Call the event processors that get called twice a second.
    _processTimedEvents() {
        if (this.timedEventProcessors) {
            this.timedEventProcessors.forEach(function(proc, topic) {
                // GP.DebugLog('Eventing.processTimedEvents: calling processor for topic=' + topic);
                proc(topic);
            });
        }
        let interval = 500;
        if (Config.eventing && Config.eventing.eventPollIntervalMS) {
            interval = Number(Config.eventing.eventPollIntervalMS);
        }
        setTimeout(this._processTimedEvents.bind(this), interval);
    };

    // ===========================================
    // Register to receive events for a topic.
    // Returns a handle to control the subscription.
    Subscribe(topic, processor, limits) {
        this.numSubscriptions++;
        let sub = new SubEntry(topic, processor, RandomIdentifier(), limits);
        let topicEnt = this.FindTopic(topic);
        if (topicEnt == undefined) {
            // 'creator' is 'subscribe' so we can tell the topic was initially
            //    created because someone subscribed to it. Hopefully someone
            //    will register the topic.
            topicEnt = this.Register(topic, 'subscribe');
        }
        topicEnt.addSubscription(sub);
        GP.DebugLog("Eventing.subscribe: adding subscription to event " + topic);
        if (this.SubscribeEventProcessor) this.SubscribeEventProcessor(topic);
        return sub;
    };
    SubscribeEvent(eventHandler) {
        this.SubscribeEventProcessor = eventHandler;
    }

    // Release a topic subscription.
    Unsubscribe(subEntry) {
        if (subEntry && subEntry.topic) {
            let topicEnt = this.FindTopic(subEntry.topic);
            if (topicEnt) {
                topicEnt.removeSubscription(subEntry);
                if (this.UnsubscribeEventProcessor) this.UnsubscribeEventProcessor(subEntry.topic);
            }
            GP.DebugLog("Eventing.unsubscribe: removing subscription for event " + subEntry.topic);
        }
    };
    UnsubscribeEvent(eventProcessor) {
        this.UnsubscribeEventProcessor = eventProcessor;
    }

    // Register a topic that can be generated.
    // This returns a handle for the topic for later 'event' calls.
    // The returned object just happens to be the TopicEntry object.
    Register(topic, registar) {
        let topicEnt = this.FindTopic(topic);
        if (topicEnt == undefined) {
            topicEnt = new TopicEntry(topic);
            topicEnt.registar = registar;
            this.topics.set(topic, topicEnt);
            GP.DebugLog("Eventing.register: registering event " + topic);
            if (this.RegisterEventProcessor) this.RegisterEventProcessor(topic);
        }
        return topicEnt;
    };
    RegisterEvent(eventProcessor) {
        this.RegisterEventProcessor = eventProcessor;
    }

    // Unregister a topic.
    // @ts-ignore
    Unregister(topicEntry, topic) {
        // cannot unregister a topic yet
        GP.DebugLog("Eventing.unregister: unregistering event " + topicEntry.topic);
        if (this.UnregisterEventProcessor) this.UnregisterEventProcessor(topic);
    };
    UnregisterEvent(eventProcessor) {
        this.UnregisterEventProcessor = eventProcessor;
    }

    // An event happened for a topic.
    // Fire the event processors and pass 'params' to all subscribers.
    Fire(topicEntryOrTopic, params) {
        let topicEntry = topicEntryOrTopic;
        if (typeof(topicEntryOrTopic) == 'string') {
            topicEntry = this.FindTopic(topicEntryOrTopic);
        }
        this.numEventsFired++;
        if (topicEntry && topicEntry.topic) {
            topicEntry.fire(params);
            if (this.FireEventProcessor) this.FireEventProcessor(topicEntry.topic, params);
        }
    };
    FireEvent(eventProcessor) {
        this.FireEventProcessor = eventProcessor;
    }

    // Return a TopicEntry for the given topic name.
    // Return undefined if not found.
    FindTopic(topic) {
        return this.topics.get(topic);
    };

    // Return the list of topics that are defined
    RegisteredTopics() {
        return this.topics.keys();
    }
    RegisteredTopicEntries() {
        return this.topics.values();
    }

    // Calls a processor every 0.5 seconds for polled type events.
    // First parameter can be either a TopicEntry or a topic name
    // Returns handle  that can be used to remove timer.
    CreateTimedEventProcessor (topicEntryOrTopic, processor) {
        let topic = topicEntryOrTopic;
        if ('topic' in topicEntryOrTopic) {
            GP.DebugLog("Eventing.createTimedEventProcessor: topicEntry. Getting topic");
            topic = topicEntryOrTopic.topic;
        }
        this.timedEventProcessors.set(topic, processor);
        GP.DebugLog("Eventing.createTimedEventProcessor: creating for event " + topic);
        return topic;
    };

    // Return 'true' if a processor entry was actually removed
    RemoveTimedEventProcessor(topicEntryOrTopic) {
        let ret = false;
        if (this.timedEventProcessors) {
            let topic = topicEntryOrTopic;
            if ('topic' in topicEntryOrTopic) {
                topic = topicEntryOrTopic.topic;
            }
            ret = this.timedEventProcessors.delete(topic);
            GP.DebugLog("Eventing.removeTimedEventProcessor: removing for event " + topic);
        }
        return ret;
    };

}
