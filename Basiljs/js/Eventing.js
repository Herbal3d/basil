/**
 * Copyright (c) 2017, Robert Adams
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in
 * the documentation and/or other materials provided with the distribution.
 * 
 * 3. Neither the name of the copyright holder nor the names of its
 * contributors may be used to endorse or promote products derived
 * from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// Global holding event subscription state
var EV = EV || {};

define(['config'], function( Config ) {

    // ===========================================
    // One subscription
    var SubEntry = function(topic, processor, id, limits) {
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
    var TopicEntry = function(topicName) {
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
        for (var ii=0; ii<this.subs.length; ii++) {
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
    var processTimedEvents = function() {
        if (EV.timedEventProcessors) {
            EV.timedEventProcessors.forEach(function(proc, topic) {
                // DebugLog('Eventing.processTimedEvents: calling processor for topic=' + topic);
                proc(topic);
            });
        }
        setTimeout(processTimedEvents, Number(Config.eventing.eventPollIntervalMS));
    };

    // ===========================================
    // Operations returned for eventing.
    var op = {
        // Register to receive events for a topic.
        // Returns a handle to control the subscription.
        'subscribe': function(topic, processor, limits) {
            EV.numSubscriptions++;
            var sub = new SubEntry(topic, processor, Math.random(), limits);
            var topicEnt = op.FindTopic(topic);
            if (topicEnt == undefined) {
                topicEnt = op.register(topic, 'subscribe');
            }
            topicEnt.addSubscription(sub);
            DebugLog("Eventing.subscribe: adding subscription to event " + topic);
            return sub;
        },
        // Release a topic subscription.
        'unsubscribe': function(subEntry) {
            if (subEntry && subEntry.topic) {
                var topicEnt = op.FindTopic(subEntry.topic);
                if (topicEnt) {
                    topicEnt.removeSubscription(subEntry);
                }
                DebugLog("Eventing.unsubscribe: removing subscription for event " + subEntry.topic);
            }
        },
        // Register a topic that can be generated.
        // This returns a handle for the topic for later 'event' calls.
        // The returned object just happens to be the TopicEntry object.
        'register': function(topic, registar) {
            var topicEnt = op.FindTopic(topic);
            if (topicEnt == undefined) {
                topicEnt = new TopicEntry(topic);
                topicEnt.registar = registar;
                EV.topics.set(topic, topicEnt);
                DebugLog("Eventing.register: registering event " + topic);
            }
            return topicEnt;
        },
        // Unregister a topic.
        'unregister': function(topicEntry, topic) {
            // cannot unregister a topic yet
                DebugLog("Eventing.unregister: unregistering event " + topicEntry.topic);
        },
        // An event happened for a topic.
        // Fire the event processors and pass 'params' to all subscribers.
        'fire': function(topicEntry, params) {
            EV.numEventsFired++;
            if (topicEntry && topicEntry.topic) {
                topicEntry.fire(params);
            }
        },
        // Return a TopicEntry for the given topic name.
        // Return undefined if not found.
        'FindTopic': function(topic) {
            return EV.topics.get(topic);
        },
        // Calls a processor every 0.5 seconds for polled type events.
        // First parameter can be either a TopicEntry or a topic name
        // Returns handle  that can be used to remove timer.
        'createTimedEventProcessor': function(topicEntryOrTopic, processor) {
            if (EV.timedEventProcessors == undefined) {
                EV.timedEventProcessors = new Map();
            }
            var topic = topicEntryOrTopic;
            if ('topic' in topicEntryOrTopic) {
                DebugLog("Eventing.createTimedEventProcessor: topicEntry. Getting topic");
                topic = topicEntryOrTopic.topic;
            }
            EV.timedEventProcessors.set(topic, processor);
            DebugLog("Eventing.createTimedEventProcessor: creating for event " + topic);
            return topic;
        },
        // Return 'true' if a processor entry was actually removed
        'removeTimedEventProcessor': function(topicEntryOrTopic) {
            var ret = false;
            if (EV.timedEventProcessors) {
                var topic = topicEntryOrTopic;
                if ('topic' in topicEntryOrTopic) {
                    topic = topicEntryOrTopic.topic;
                }
                ret = EV.timedEventProcessors.delete(topic);
                DebugLog("Eventing.removeTimedEventProcessor: removing for event " + topic);
            }
            return ret;
        },
        'noComma': 0
    };

    GP.EV = EV; // For debugging. Don't use for cross package access.

    EV.op = op;
    EV.topics = EV.topics || new Map();
    EV.numSubscriptions = 0;
    EV.numEventsFired = 0;

    // Start the timed event clock
    processTimedEvents();

    return op;
});


