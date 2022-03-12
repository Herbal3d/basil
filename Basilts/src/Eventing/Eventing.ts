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

import { TopicName, EventProcessor, SubscriptionEntry } from '@Eventing/SubscriptionEntry';
import { TopicEntry } from '@Eventing/TopicEntry';

import { RandomIdentifier } from '@Tools/Utilities';
import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Base/Tools/Logging';
import { IsNullOrEmpty } from '@Base/Tools/Misc';

// A simple pub/sub system. An event producer registers a topic
//    and later 'fire's event on the topic. An event consumer subscribers
//    to a topic and has a function called when that topic is 'fire'ed.
// The coding pattern:
// Event producer:
//    topicHandle = Eventing.Register(topicName, whoIsRegistering);
//    ...
//    topicHandle.fire(params);
//        // 'params' is a JS object which is usually a map of values
//
// Event consumer:
//    eventHandle = Eventing.Subscribe(topicName, function(params, topicName) {
//         //event processor
//    });
//    ...
//    Eventing.Unsubscribe(eventHandle);
//
// A topic DOES NOT NEED to be registered. In this case, subscribes will create
// the TopicEntry and Eventing.Fire('topicName', params) is used to fire the
// event. In this case, the TopicEntry is removed when all the subscriptions are
// gone. This is an optimization since many topics can be fired but there will
// not be any subscribers so doing it that way doesn't allocate structures if
// there are no subscribers.
//
// NOTE: there is no locking here so beware of using multi-threaded JavaScript.
// NOTE: subEntry.fire() returns a Promise which is resolved when the event has been processed.
//    This also means that event processing can happen async.

// ===========================================
let eventingDefaultLayer: string;
let eventingTopics: Map<TopicName, TopicEntry>;
let eventingTimedProcessors: Map<TopicName, EventProcessor>;
let eventingEventsFired: number;
let onRegister: TopicEntry;
let onUnregister: TopicEntry;
let onSubscribe: TopicEntry;
let onUnsubscribe: TopicEntry;
export const Eventing = {
    init(): void {
        eventingDefaultLayer = Config.layers?.eventing ?? 'eventing.layer.b.herbal3d.org',
        eventingTopics = new Map<TopicName, TopicEntry>();
        eventingTimedProcessors = new Map<TopicName, EventProcessor>();
        eventingEventsFired = 0;

        // Eventing generates events on subscriptions and registrations
        onRegister = Eventing.Register('Eventing.Register', 'Eventing');
        onUnregister = Eventing.Register('Eventing.Unregister', 'Eventing');
        onSubscribe = Eventing.Register('Eventing.Subscribe', 'Eventing');
        onUnsubscribe = Eventing.Register('Eventing.Unsubscribe', 'Eventing');

        // Start the timed event clock
        Eventing._processTimedEvents();
    },
    // ===========================================
    // Call the event processors that get called twice a second.
    _processTimedEvents(): void {
        if (eventingTimedProcessors) {
            eventingTimedProcessors.forEach( (proc, topic) =>{
                // GP.DebugLog('Eventing.processTimedEvents: calling processor for topic=' + topic);
                proc(undefined, topic, undefined);
            });
        };
        let interval = 500;
        if (Config.eventing && Config.eventing.eventPollIntervalMS) {
            interval = Number(Config.eventing.eventPollIntervalMS);
        };
        // I know this is an 'unbound function' but it doesn't use 'this'
        // eslint-disable-next-line @typescript-eslint/unbound-method
        setTimeout(Eventing._processTimedEvents, interval);
    },
    // ===========================================
    // Register to receive events for a topic.
    // Returns a handle to control the subscription.
    Subscribe(pTopic: TopicName, pProcessor: EventProcessor, pExtraParams?: any, pLimits?: number): SubscriptionEntry{
        const sub = new SubscriptionEntry(pTopic, pProcessor, RandomIdentifier(), pExtraParams, pLimits);
        let topicEnt = Eventing.FindTopic(pTopic);
        if (IsNullOrEmpty(topicEnt)) {
            // 'creator' is 'subscribe' so we can tell the topic was initially
            //    created because someone subscribed to it. Hopefully someone
            //    will register the topic.
            topicEnt = Eventing.Register(pTopic, 'subscribe');
        };
        topicEnt.addSubscription(sub);
        Logger.debug("Eventing.subscribe: adding subscription to event " + pTopic);
        void onSubscribe.fire({ 'topic': pTopic, 'topicEntry': topicEnt });
        return sub;
    },
    // Release a topic subscription.
    Unsubscribe(pSubEntry: SubscriptionEntry): void {
        if (pSubEntry && pSubEntry.topic) {
            const topicEnt = Eventing.FindTopic(pSubEntry.topic);
            if (topicEnt) {
                topicEnt.removeSubscription(pSubEntry);
                void onUnsubscribe.fire({ 'topic': topicEnt.topic, 'topicEntry': topicEnt });
                if (! (topicEnt.hasSubscriptions() || topicEnt.wasRegistered()) ) {
                    // Topics that are created from subscriptions can be removed
                    //      when there are no more subscriptions
                    Eventing.Unregister(topicEnt);
                };
            };
            Logger.debug("Eventing.unsubscribe: removing subscription for event " + pSubEntry.topic);
        };
    },
    // Register a topic that can be generated.
    // This returns a handle for the topic for later 'event' calls.
    // 'registar' is just a tag added to the topic registration for debugging.
    // The returned object just happens to be the TopicEntry object.
    Register(pTopic: TopicName, pRegistar: string): TopicEntry {
        let topicEnt = Eventing.FindTopic(pTopic);
        if (IsNullOrEmpty(topicEnt)) {
            topicEnt = new TopicEntry(pTopic);
            topicEnt.registar = pRegistar;
            eventingTopics.set(pTopic, topicEnt);
            // Logger.debug("Eventing.register: registering event " + pTopic);
            if (onRegister) {
              void onRegister.fire({ 'topic': topicEnt.topic, 'topicEntry': topicEnt });
            };
        };
        // Remember that it was registered so this topic expects an Unregister()
        topicEnt.registered = true;
        return topicEnt;
    },
    // Unregister a topic.
    Unregister(pTopicEnt: TopicEntry, pTopic?: string): void {
        // cannot unregister a topic yet
        Logger.debug("Eventing.unregister: unregistering event " + pTopicEnt.topic);
        void onUnregister.fire({ 'topic': pTopicEnt.topic, 'topicEntry': pTopicEnt });
    },
    // An event happened for a topic.
    // Fire the event processors and pass 'params' to all subscribers.
    // This is a convience function if the caller doesn't have a handle to
    //    the topic entry.
    // If given a topic name, this will find the topic entry then do the fire() on it.
    // This also takes a TopicEntry for convenience.
    // Note: this returns a Promise which is completed when the fired event is done processing.
    async Fire(pTopic: TopicEntry | TopicName, params: BKeyedCollection): Promise<SubscriptionEntry[]> {
        let topicEntry: TopicEntry
        if (typeof(pTopic) === 'string') {
            topicEntry = Eventing.FindTopic(pTopic);
        }
        else {
            topicEntry = pTopic;
        };
        if (topicEntry && topicEntry.topic) {
            return topicEntry.fire(params);
        };
        return null;
    },
    // Return a TopicEntry for the given topic name.
    // Return undefined if not found.
    FindTopic(topic: TopicName): TopicEntry {
        return eventingTopics.get(topic);
    },
    // Return the list of topics that are defined
    RegisteredTopics(): IterableIterator<string> {
        return eventingTopics.keys();
    },
    // Return all the TopicEntry's
    RegisteredTopicEntries(): IterableIterator<TopicEntry> {
        return eventingTopics.values();
    },
    // Calls a processor every 0.5 seconds for polled type events.
    // First parameter can be either a TopicEntry or a topic name
    // Returns handle  that can be used to remove timer.
    CreateTimedEventProcessor (pTopic: TopicEntry | TopicName, processor: EventProcessor): TopicName {
        const theTopic = Eventing.TopicNameFromTopicEntry(pTopic);
        eventingTimedProcessors.set(theTopic, processor);
        Logger.debug("Eventing.createTimedEventProcessor: creating for event " + theTopic);
        return theTopic;
    },
    // Return 'true' if a processor entry was actually removed
    RemoveTimedEventProcessor(pTopic: TopicEntry | TopicName): boolean {
        let ret = false;
        if (eventingTimedProcessors) {
            const theTopic = Eventing.TopicNameFromTopicEntry(pTopic);
            ret = eventingTimedProcessors.delete(theTopic);
            Logger.debug("Eventing.removeTimedEventProcessor: removing for event " + theTopic);
        };
        return ret;
    },
    // Conveniance function that takes either a TopicEntry or a TopicName and returns the TopicName
    TopicNameFromTopicEntry(pTopicEntry: TopicEntry | string): TopicName {
        if (typeof(pTopicEntry) === 'string') {
            return pTopicEntry;
        };
        return pTopicEntry.topic;
    }
};
