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

import { Config } from '@Base/Config';
import { Logger } from '@Tools/Logging';

export const DialogMgt = {
    // map dialog name to the dialog HTMLElement
    dialogs: new Map<string, HTMLDivElement>(),

    createDialog: function(pName: string, pUrl: string, pPlacement?: string): void {
        Logger.debug(`createDialog: ${pName} ${pUrl} ${pPlacement}`);

        if (DialogMgt.dialogs.has(pName)) {
            Logger.debug(`createDialog: dialog already exists. Recreating the dialog.`);
            DialogMgt.removeDialog(pName);
        }

        const dialogId = `${pName}-dialog`;

        // Create the wrapper that goes around the draggable/resizable dialog.
        const dialogWrapper = document.createElement('div');
        dialogWrapper.className = "b-dialog-wrapper";
        dialogWrapper.id = dialogId;
        dialogWrapper.style.opacity = "0.6";

        // First area in a dialog is the control title bar.
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

        // The iframe for the actual dialog contents
        const iframeId = `${pName}-iframe`;
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', pUrl);
        iframe.setAttribute('id', iframeId);
        iframe.setAttribute('name', pName);
        iframe.setAttribute('class', 'b-dialog-iframe');
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('marginwidth', '0');
        iframe.setAttribute('marginheight', '0');
        iframe.setAttribute('frameborder', '0');

        // The iframe is wrapped in an extra div so sizing works correctly
        const iframeDivWrapperId = `${iframeId}-wrapper`;
        const iframeDivWrapper = document.createElement('div');
        iframeDivWrapper.id = iframeDivWrapperId;
        iframeDivWrapper.className = 'b-dialog-iframe-wrapper';
        iframeDivWrapper.appendChild(iframe);

        dialogWrapper.appendChild(iframeDivWrapper);

        // Add the dialog to the div area set up in the HTML.
        const dialogInDoc = document.getElementById(Config.page.dialogsElementId).appendChild(dialogWrapper);
        if (dialogInDoc) {
            DialogMgt.dialogs.set(pName, dialogInDoc);
        }
        else {
            Logger.error(`createDialog: failed to create dialog ${pName}`);
        }

        // Pass in handles to our objects so the dialog can do things
        // Refer to definitions of 'Window' added variables in @Base/DialogWindow.ts
        if (iframe) {
            iframe.contentWindow.BItems = BItems;
            iframe.contentWindow.Eventing = Eventing;
            iframe.contentWindow.Logger = Logger;
        }

        const dialog = DialogBox(dialogId, DialogMgt._buttonClicked, {
            titlebar: '.b-dialog-titlebar',         // class of titlebar
            content: `#${iframeDivWrapperId}`,      // ID of whole element (titlebar + content)
            buttonContainer: 'b-containing-dialog'  // attribute added to buttons to identify dialog
        });

        DialogMgt.showDialog(pName);

        if (pPlacement) {
            const place = pPlacement.toLowerCase().split(' ');
            if (place.includes('top')) {
                dialogInDoc.style.top = '5%';
            }
            if (place.includes('bottom')) {
                dialogInDoc.style.top = '75%';
            }
            if (place.includes('right')) {
                dialogInDoc.style.left = '65%';
            }
            if (place.includes('left')) {
                dialogInDoc.style.left = '5%';
            }
        }

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