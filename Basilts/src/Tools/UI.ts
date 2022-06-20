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
import { AddTestObject } from '@Graphics/GraphicOps';
import { Eventing } from '@Eventing/Eventing';

import { SubscriptionEntry } from '@Base/Eventing/SubscriptionEntry';
import { BVector3, BVector4 } from '@Tools/bTypes';
import { Logger } from '@Tools/Logging';
import { CameraInfoEventTopic, CameraInfoEventProps, RenderInfoEventTopic, RenderInfoEventProps } from '@Base/Graphics/Graphics';
import { JSONstringify } from './Utilities';

type ClickOperation = ( pTarget: EventTarget ) => void;
const ClickableOps: { [key: string]: ClickOperation } = {};

export const UI = {
    init() {
        // Make all 'class=b-clickable' page items create events
        Array.from(document.getElementsByClassName('b-clickable')).forEach( nn => {
            nn.addEventListener('click', (evnt: Event) => {
                const buttonOp = (evnt.target as HTMLElement).getAttribute('op');
                if (buttonOp && typeof(ClickableOps[buttonOp]) === 'function') {
                    ClickableOps[buttonOp](evnt.target);
                };
            });
        });

        // Whether debug output window is initially displayed can be set in the configuration file
        UI.ShowDebug(Config.page.showDebug);
    },
    // Call to set debug window to specified state. Pass state that is should be in
    ShowDebug(pOnOff: boolean) {
        const debugElement = document.getElementById(Config.page.debugElementId);
        if (debugElement) {
            if (pOnOff) {   // want it on
                // const showMS = Config.page.DebugShowMS ? Config.page.DebugShowMS : 800;
                debugElement.style.visibility = 'visible';
            }
            else {
                // const hideMS = Config.page.DebugHideMS ? Config.page.DebugHideMS : 400;
                debugElement.style.visibility = 'hidden';
            }
        }
    },
};

ClickableOps['showDebug'] = function() {
    UI.ShowDebug(!(document.getElementById(Config.page.debugElementId).style.visibility !== 'hidden'));
};
ClickableOps['addTestObject'] = function() {
    AddTestObject();
};
// ======================================================
// Given a DOM node, remove all its children.
export function EmptyNode(nn: HTMLElement) {
    while (nn.firstChild) {
        nn.removeChild(nn.firstChild);
    }
};