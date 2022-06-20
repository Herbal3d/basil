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

import { BItems } from '@BItem/BItems';
import { Eventing } from '@Eventing/Eventing';

import { DialogBox } from './draggable-resizable-dialog';
import { MenuBox } from './MenuBox';

import { Config } from '@Base/Config';
import { Logger } from '@Tools/Logging';

export const DialogMgt = {
    // map dialog name to the dialog HTMLElement
    dialogs: new Map<string, HTMLDivElement>(),

    // This creates a bunch of DOM to hold a dialog to appear on the page.
    // These dialogs include a title bar that holds a title, minimize, and close buttons
    //     followed by a content area that holding the iframe.
    // 'type' is either 'dialog' or 'menu'.
    //
    //  <div class="b-${type}-wrapper" id="${pName}">
    //      <div class="b-dialog-titlebar">
    //          pName
    //          <div class="b-dialog-titlebar-titlearea"></div>
    //          <button class="b-dialog-titlebar-minimize" name="minimize" b-containing-dialog="${pName}">
    //              &#x2796;
    //          </button>
    //          <button class="b-dialog-titlebar-close" name="close" b-containing-dialog="${pName}">
    //              &#x2716;
    //          </button>
    //      </div>
    //      <iframe src="${pUrl}"
    //              id="${pName}-iframe">
    //              name="${pName}"
    //              class="b-dialog-iframe"
    //              scrolling="no"
    //              marginwidth="0"
    //              marginheight="0"
    //              frameborder="0"
    //      </iframe>
    //  </div>
    //
    // <param name="pName">The name of the dialog. This is used to identify the dialog</param>
    // <param name="pUrl">The URL of the iframe to be displayed in the dialog</param>
    // <param name="pPlacement">Where to put dialog on page: top|bottom|left|right|menu</param>
    createDialog: function(pName: string, pUrl: string, pPlacement?: string): void {
        Logger.debug(`createDialog: ${pName} ${pUrl} ${pPlacement}`);

        if (DialogMgt.dialogs.has(pName)) {
            Logger.debug(`createDialog: dialog already exists. Recreating the dialog.`);
            DialogMgt.removeDialog(pName);
        }

        // Page placement information
        let placement: string[] = [];
        if (pPlacement) {
            placement = pPlacement.toLowerCase().split(' ');
        }
        // The keyword "menu" means to title bar and in different page div
        const isMenuDialog = placement.includes('menu');
        const dialogType = isMenuDialog ? 'menu' : 'dialog';

        // The id that refers to this dialog
        const dialogId = `${pName}-${dialogType}`;

        // Create the wrapper that goes around the whole dialog.
        const dialogWrapper = document.createElement('div');
        dialogWrapper.className = `b-${dialogType}-wrapper`;
        dialogWrapper.id = dialogId;

        // Non-menu dialogs hav a title bar for resizing and movement
        if (!isMenuDialog) {
            const titlebar = document.createElement('div');
            titlebar.className = 'b-dialog-titlebar';
            titlebar.innerHTML = pName;
            const titlebarTitleArea = document.createElement('div');
            titlebarTitleArea.className = 'b-dialog-titlebar-titlearea';
            const titlebarMinimize = document.createElement('button');
            titlebarMinimize.className = 'b-dialog-titlebar-minimize';
            titlebarMinimize.name = 'minimize';
            titlebarMinimize.setAttribute('b-containing-dialog', pName);
            titlebarMinimize.innerHTML = '&#x2796;'; // use of innerHTML is required to show  Unicode characters
            const titlebarClose = document.createElement('button');
            titlebarClose.className = 'b-dialog-titlebar-close';
            titlebarClose.name = 'close';
            titlebarClose.setAttribute('b-containing-dialog', pName);
            titlebarClose.innerHTML = '&#x2716;'; // use of innerHTML is required to show  Unicode characters
            titlebar.appendChild(titlebarTitleArea);
            titlebar.appendChild(titlebarMinimize);
            titlebar.appendChild(titlebarClose);

            dialogWrapper.appendChild(titlebar);
        }

        // The iframe for the actual dialog contents
        const iframeId = `${pName}-iframe`;
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', pUrl);
        iframe.setAttribute('id', iframeId);
        iframe.setAttribute('name', pName);
        iframe.setAttribute('class', `b-${dialogType}-iframe`);
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('marginwidth', '0');
        iframe.setAttribute('marginheight', '0');
        iframe.setAttribute('frameborder', '0');

        dialogWrapper.appendChild(iframe);

        // Add the dialog to the div area set up in the HTML.
        // 'menu' dialogs go into the menu area and other dialogs go into the main area.
        const dialogDiv = isMenuDialog
                ? document.getElementById(Config.page.topDialogsElementId)
                : document.getElementById(Config.page.dialogsElementId);
        const dialogInDoc = dialogDiv.appendChild(dialogWrapper);

        DialogMgt.dialogs.set(pName, dialogWrapper);

        // Pass in handles to our objects so the dialog can do things
        // Refer to definitions of 'Window' added variables in @Base/DialogWindow.ts
        iframe.contentWindow.BItems = BItems;
        iframe.contentWindow.Eventing = Eventing;
        iframe.contentWindow.Logger = Logger;

        if (!isMenuDialog) {
            // If a regular dialog, wrap it with draggable/resizable functionality
            const dialog = DialogBox(dialogId, DialogMgt._buttonClicked, {
                titlebar: '.b-dialog-titlebar',         // class of titlebar
                content: `#${iframeId}`,      // ID of whole element (titlebar + content)
                buttonContainer: 'b-containing-dialog'  // attribute added to buttons to identify dialog
            });

            // Do initial page placement
            if (placement.includes('top')) {
                dialogInDoc.style.top = '5%';
            }
            if (placement.includes('bottom')) {
                dialogInDoc.style.top = '75%';
            }
            if (placement.includes('right')) {
                dialogInDoc.style.left = '65%';
            }
            if (placement.includes('left')) {
                dialogInDoc.style.left = '5%';
            }
        }
        else {
            // If a menu bar, add menu sizing and processing
            const menu = MenuBox(dialogId, dialogWrapper, iframe);
        }

        DialogMgt.showDialog(pName);

        return;
    },
    showDialog: (pName: string): void => {
        DialogMgt.dialogs.get(pName).style.visibility = 'visible';
        DialogMgt.dialogs.get(pName).style.display = 'block';
    },
    hideDialog: (pName: string): void => {
        DialogMgt.dialogs.get(pName).style.visibility = 'hidden';
        DialogMgt.dialogs.get(pName).style.display = 'none';
    },
    removeDialog: (pName: string): void => {
        if (DialogMgt.dialogs.has(pName)) {
            const dialogInDoc = document.getElementById(pName) as HTMLIFrameElement;
            if (dialogInDoc && dialogInDoc.parentElement) {
                dialogInDoc.parentElement.removeChild(dialogInDoc);
            }
            DialogMgt.dialogs.delete(pName);
        }
    },
    _buttonClicked: (pButtonName: string, pContainingId?: string): void => {
        Logger.debug(`DialogMgt._buttonClicked: ${pButtonName} ${pContainingId}`);
        switch (pButtonName) {
            case 'minimize':
                DialogMgt.hideDialog(pContainingId);
                break;
            case 'close':
                DialogMgt.removeDialog(pContainingId);
                break;
            default:
                Logger.error(`DialogMgt._buttonClicked: unknown button name ${pButtonName}`);
                break;
        };
        return;
    }
}