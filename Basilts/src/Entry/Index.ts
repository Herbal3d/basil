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

import { Config } from '@Entry/IndexConfig';
import { VERSION } from '@Base/VERSION';

import { ClickOpLoginOpenSim } from '@Entry/LoginOpenSim';

import { Logger, initLogging } from '@Tools/Logging';

type ClickOperation = ( pTarget: EventTarget ) => void;
const ClickableOps: { [key: string]: ClickOperation } = {};

// Initialize logging to output to the console and to the visible debug messsage area
initLogging(Config.Debug.DebugLogToConsole, Config.Debug.VisibleDebugLog);
Logger.setLogLevel(Config.Debug.LogLevel);
// CSS starts the debug area hidden. We force it to be visible.
const debugElement = document.getElementById(Config.page.debugElementId);
if (debugElement) {
    debugElement.style.visibility = 'visible';
}

// Make all 'class=b-clickable' page items create events
for (const nn of Array.from(document.getElementsByClassName('b-clickable'))) {
    nn.addEventListener('click', (evnt: Event) => {
        const buttonOp = (evnt.target as HTMLElement).getAttribute('op');
        Logger.debug(`Click: ${buttonOp}`);
        if (buttonOp && typeof(ClickableOps[buttonOp]) === 'function') {
            ClickableOps[buttonOp](evnt.target);
        }
        else {
            Logger.error(`Click: unknown op ${buttonOp}`);
        };
    });
};

// Set the values that are used to get to the grid and region
const gridURLNode = document.getElementById('gridLogin-gridURL') as HTMLTextAreaElement;
gridURLNode.value = Config.gridLoginURL;
const gridWSNode = document.getElementById('gridLogin-WSURL') as HTMLTextAreaElement;
gridWSNode.value = Config.regionWssURL;

// Put current Basil version info on the bottom of the window
const versionTextNode = document.getElementById(Config.page.versionElementId);
if (versionTextNode) {
    versionTextNode.innerText = 'Basil version ' + VERSION['version-tag'];
}

ClickableOps['gridLogin'] = ClickOpLoginOpenSim;
