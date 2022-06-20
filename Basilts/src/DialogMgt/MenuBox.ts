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

'use strict';

import { Config } from '@Base/Config';
import { Logger } from '@Tools/Logging';

let resizerHasBeenSet = false;

// Make any linkages to the new menu box that goes in the menu area of the page
// @param pDialogId - the id of the menu dialog created
// @param pWrapper - the HTMLDivElement that wraps the menu dialog
// @param pIFrame - the HTMLIFrameElement if the iframe that is wrapped by above
export function MenuBox(pDialogId: string, pWrapper: HTMLDivElement, pIFrame: HTMLIFrameElement): void {
    if (!resizerHasBeenSet) {
        window.addEventListener('resize', (evnt: Event) => {
            ResizeMenuBox();
        });
        resizerHasBeenSet = true;
    }
    ResizeMenuBox();
    return;
}

export function ResizeMenuBox(): void {
    const menuPlace = document.getElementById(Config.page.topDialogsElementId);

    // collect the sizes of all the menu dialogs
    let totalHeight = 0;
    Array.from(menuPlace.children).forEach((child: Element) => {
        // inside the <div> is an <iframe>
        if (child.childElementCount === 1) {
            const iframe = child.firstElementChild as HTMLIFrameElement;
            if (iframe) {
                const iframeBody = iframe.contentDocument.body;
                if (iframeBody) {
                    const iframeBodyStyle = getComputedStyle(iframeBody);
                    // Logger.debug(`ResizeMenuBox: iframeBody.height = ${iframeBodyStyle.height}`);
                    iframe.setAttribute('height', iframeBodyStyle.height);
                    totalHeight += parseInt(iframeBodyStyle.height);
                }
            }
        }
        else {
            totalHeight += child.clientHeight;
        }
    });
    menuPlace.style.height = `${totalHeight}px`;
    // Logger.debug(`ResizeMenuBox: total height = ${menuPlace.style.height}`);
}

