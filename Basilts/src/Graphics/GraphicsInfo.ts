// Copyright 2022 Robert Adams
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use static';

import { Config } from '@Base/Config';

import { Graphics } from '@Graphics/Graphics';

import { Engine, Scene, SceneInstrumentation, SceneOptimizer, SceneOptimizerOptions } from "@babylonjs/core";
import { Vector3 as BJSVector3, Color3 as BJSColor3 } from '@babylonjs/core/Maths';

import { Eventing } from '@Eventing/Eventing';
import { TopicEntry } from '@Eventing/TopicEntry';
import { EventProcessor, SubscriptionEntry } from '@Base/Eventing/SubscriptionEntry';

import { BKeyedCollection } from '@Tools/bTypes.js';
import { Logger } from '@Tools/Logging';

// The camera generates periodic events. This is the parameter block
//    returned with the event.
export const CameraInfoEventTopic = 'Graphics.CameraInfo';
export interface CameraInfoEventProps {
    position: number[];
    rotation: number[];
};
// The renderer generates periodic events. This is the parameter block
//    returned with the event.
export const RenderInfoEventTopic = 'Graphics.RenderInfo';
export interface RenderInfoEventProps {
    fps: number;
    render: {
        calls: number;
        triangles: number;
        points: number;
        lines: number;
        frame: number;
    };
    memory: {
        geometries: number;
        textures: number;
    };
};

// Information about graphics state, loading progress, and general statistics
export const GraphicsInfo = {
    // Receive events for camera position info (about once a second)
    WatchCameraInfoEvents(pProcessor: EventProcessor): SubscriptionEntry {
        return Eventing.Subscribe(CameraInfoEventTopic, pProcessor);
    },
    // Receive events for render statistics (about once a second)
    WatchRendererStateEvents(pProcessor: EventProcessor): SubscriptionEntry {
        return Eventing.Subscribe(RenderInfoEventTopic, pProcessor);
    },
    UnwatchEvents(pSub: SubscriptionEntry): void {
        Eventing.Unsubscribe(pSub);
    },
    // Events generated giving camera position information
    _eventCameraInfo: <TopicEntry>undefined,
    _eventCameraInfoTimer: <NodeJS.Timer>undefined,
    _prevCamPosition: <BJSVector3>undefined,
    // Events generated giving renderer information
    _eventDisplayInfo: <TopicEntry>undefined,
    _eventDisplayInfoTimer: <NodeJS.Timer>undefined,

    // Generate subscribable periodic when camera info (position) changes
    SetupCameraInfoEvents(): void {
        GraphicsInfo._eventCameraInfo = Eventing.Register(CameraInfoEventTopic, 'Graphics');
        GraphicsInfo._eventCameraInfoTimer = setInterval( () => {
            if (GraphicsInfo._eventCameraInfo.hasSubscriptions) {
                if (GraphicsInfo._prevCamPosition == undefined) {
                    GraphicsInfo._prevCamPosition = new BJSVector3(0,0,0);
                }
                const oldPos = GraphicsInfo._prevCamPosition;
                // must clone or 'newPos' will be just a reference to the old value.
                const newPos = Graphics._camera.position.clone();
                if (!newPos.equals(oldPos)) {
                    const pos = [0,0,0];
                    Graphics._camera.position.toArray(pos, 0);
                    const rot = [0,0,0,0];
                    Graphics._camera.rotation.toArray(rot, 0);
                    const camInfo: CameraInfoEventProps = {
                        'position': pos,
                        'rotation': rot 
                    };
                    void GraphicsInfo._eventCameraInfo.fire(camInfo as unknown as BKeyedCollection);
                    GraphicsInfo._prevCamPosition = newPos;
                };
            };
        }, 1000);
    },

    // Statistics and information about the renderer
    _sceneInstrumentation: <SceneInstrumentation>undefined,
    frameNum: <number>undefined,
    FPS: <number>undefined,
    _lastFrameDelta: <number>undefined,
    _throttleFPS: <number>undefined,
    // Start the generation of renderer statistic events
    SetupRendererStatEvents(): void {
        // Clock used to keep track of frame time and FPS
        GraphicsInfo._sceneInstrumentation  = new SceneInstrumentation(Graphics._scene);
        GraphicsInfo._sceneInstrumentation.captureFrameTime = true;
        GraphicsInfo.frameNum = 0;    // counted once each frame time
        GraphicsInfo.FPS = 10;        // an initial value to start computation
        GraphicsInfo._throttleFPS = 0; // if zero, no throttling

        // Generate subscribable periodic events when display info changes
        GraphicsInfo._eventDisplayInfo = Eventing.Register(RenderInfoEventTopic, 'Graphics');
        GraphicsInfo._eventCameraInfoTimer = setInterval( () => {
            if (GraphicsInfo._eventDisplayInfo.hasSubscriptions) {
                // not general, but, for the moment, just return the WebGL info
                const dispInfo = {
                    fps: Graphics._engine.getFps(),
                    render: {
                        calls: Graphics._engine._drawCalls.current,
                        triangles: Math.round(Graphics._scene.totalVerticesPerfCounter.current / 3),
                        points: Graphics._scene.totalVerticesPerfCounter.current,
                        lines: 13,
                        frame: GraphicsInfo.frameNum
                    // },
                    // memory: {
                    //     geometries: Graphics._engine.
                    //     textures: 30
                    }
                };
                void GraphicsInfo._eventDisplayInfo.fire(dispInfo);
            };
        }, 1000);
    },
    // Called each frame to update per-frame statistics.
    // Returns the ms of last frame rendering time
    UpdateFrameInfo(): number {
        GraphicsInfo.frameNum++;
        GraphicsInfo._lastFrameDelta = GraphicsInfo._sceneInstrumentation.frameTimeCounter.count;
        return GraphicsInfo._lastFrameDelta;
    }
}

