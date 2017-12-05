// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).
'use strict';

// Global holding event subscription state
var EV = EV || {};

import Config from 'xConfig';

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
//    eventHandle = Eventing.subscribe(topicName, function(topicName, params) {
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
let SubEntry = function(topic, processor, id, limits) {
    this.topic = topic;
    this.processor = processor;
    this.id = id;
    this.limits = limits;
};
SubEntry.prototype.fire = function(params) {
    this.processor(params, this.topic);
};

// ===========================================
// One topic that can be subscribed to.
// This is the datastructure for a topic, its subscriptions, and actions.
// THis data structure is passed around to the subscribers so 'fire' can be called.
let TopicEntry = function(topicName) {
    this.topic = topicName;
    this.subs = [];
};
TopicEntry.prototype.hasSubscriptions = function(sub) {
    return this.subs.length > 0;
};
TopicEntry.prototype.addSubscription = function(sub) {
    this.subs.push(sub);
};
TopicEntry.prototype.removeSubscription = function(sub) {
    for (let ii=0; ii<this.subs.length; ii++) {
        if (this.subs[ii].id == sub.id) {
            subs.splice(ii, 1);
        }
    }
};
TopicEntry.prototype.fire = function(params) {
    this.subs.forEach( sub => {
        sub.fire(params);
    });
};


// ===========================================
// Call the event processors that get called twice a second.
let processTimedEvents = function() {
    if (EV.timedEventProcessors) {
        EV.timedEventProcessors.forEach(function(proc, topic) {
            // GP.DebugLog('Eventing.processTimedEvents: calling processor for topic=' + topic);
            proc(topic);
        });
    }
    setTimeout(processTimedEvents, Number(Config.eventing.eventPollIntervalMS));
};

// ===========================================
// Register to receive events for a topic.
// Returns a handle to control the subscription.
export function subscribe(topic, processor, limits) {
    EV.numSubscriptions++;
    let sub = new SubEntry(topic, processor, Math.random(), limits);
    let topicEnt = FindTopic(topic);
    if (topicEnt == undefined) {
        // 'creator' is 'subscribe' so we can tell the topic was initially
        //    created because someone subscribed to it. Hopefully someone
        //    will register the topic.
        topicEnt = register(topic, 'subscribe');
    }
    topicEnt.addSubscription(sub);
    GP.DebugLog("Eventing.subscribe: adding subscription to event " + topic);
    return sub;
};

// Release a topic subscription.
export function unsubscribe(subEntry) {
    if (subEntry && subEntry.topic) {
        let topicEnt = FindTopic(subEntry.topic);
        if (topicEnt) {
            topicEnt.removeSubscription(subEntry);
        }
        GP.DebugLog("Eventing.unsubscribe: removing subscription for event " + subEntry.topic);
    }
};

// Register a topic that can be generated.
// This returns a handle for the topic for later 'event' calls.
// The returned object just happens to be the TopicEntry object.
export function register(topic, registar) {
    let topicEnt = FindTopic(topic);
    if (topicEnt == undefined) {
        topicEnt = new TopicEntry(topic);
        topicEnt.registar = registar;
        EV.topics.set(topic, topicEnt);
        GP.DebugLog("Eventing.register: registering event " + topic);
    }
    return topicEnt;
};

// Unregister a topic.
export function unregister(topicEntry, topic) {
    // cannot unregister a topic yet
        GP.DebugLog("Eventing.unregister: unregistering event " + topicEntry.topic);
};

// An event happened for a topic.
// Fire the event processors and pass 'params' to all subscribers.
export function fire(topicEntry, params) {
    EV.numEventsFired++;
    if (topicEntry && topicEntry.topic) {
        topicEntry.fire(params);
    }
};

// Return a TopicEntry for the given topic name.
// Return undefined if not found.
export function FindTopic(topic) {
    return EV.topics.get(topic);
};

// Calls a processor every 0.5 seconds for polled type events.
// First parameter can be either a TopicEntry or a topic name
// Returns handle  that can be used to remove timer.
export function createTimedEventProcessor (topicEntryOrTopic, processor) {
    if (EV.timedEventProcessors == undefined) {
        EV.timedEventProcessors = new Map();
    }
    let topic = topicEntryOrTopic;
    if ('topic' in topicEntryOrTopic) {
        GP.DebugLog("Eventing.createTimedEventProcessor: topicEntry. Getting topic");
        topic = topicEntryOrTopic.topic;
    }
    EV.timedEventProcessors.set(topic, processor);
    GP.DebugLog("Eventing.createTimedEventProcessor: creating for event " + topic);
    return topic;
};

// Return 'true' if a processor entry was actually removed
export function removeTimedEventProcessor(topicEntryOrTopic) {
    let ret = false;
    if (EV.timedEventProcessors) {
        let topic = topicEntryOrTopic;
        if ('topic' in topicEntryOrTopic) {
            topic = topicEntryOrTopic.topic;
        }
        ret = EV.timedEventProcessors.delete(topic);
        GP.DebugLog("Eventing.removeTimedEventProcessor: removing for event " + topic);
    }
    return ret;
};

GP.EV = EV; // For debugging. Don't use for cross package access.

EV.topics = EV.topics || new Map();
EV.numSubscriptions = 0;
EV.numEventsFired = 0;

// Start the timed event clock
processTimedEvents();
