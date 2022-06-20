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

import { SubscriptionEntry } from '@Base/Eventing/SubscriptionEntry';

// things passed into our iFrame
const BItems = window.BItems;
const Eventing = window.Eventing;
const Logger = window.Logger;

type ClickOperation = ( pTarget: EventTarget ) => void;
const ClickableOps: { [key: string]: ClickOperation } = {};

window.onload = function() {
    _initilize();
};

ClickableOps['audio'] = function() {
    Logger.debug(`Click: wwTesterDev`);
}

ClickableOps['logout'] = function() {
    Logger.debug(`Click: wwTesterDev`);
}


const _initilize = function() {
    Logger.debug(`topMenu.js _initilize entered`);

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
}