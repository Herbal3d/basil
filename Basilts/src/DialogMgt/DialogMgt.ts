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

import { Config } from '@Base/Config';
import { Logger } from '@Tools/Logging';

export const DialogMgt = {
    dialogs: new Map<string, HTMLIFrameElement>(),

    createDialog: function(pName: string, pUrl: string): void {
        Logger.debug(`createDialog: ${pName} ${pUrl}`);

        if (DialogMgt.dialogs.has(pName)) {
            Logger.debug(`createDialog: dialog already exists. Recreating the dialog.`);
            DialogMgt.removeDialog(pName);
        }

        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', pUrl);
        iframe.setAttribute('id', pName);
        iframe.setAttribute('name', pName);
        iframe.setAttribute('class', 'b-dialog-iframe');
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('marginwidth', '0');
        iframe.setAttribute('marginheight', '0');
        iframe.setAttribute('frameborder', '0');

        const iFrameInDoc = document.getElementById(Config.page.dialogsElementId).appendChild(iframe);
        if (iFrameInDoc) {
            DialogMgt.dialogs.set(pName, iFrameInDoc);
        }
        else {
            Logger.error(`createDialog: failed to create dialog ${pName}`);
        }

        // Pass in handles to our objects so the dialog can do things
        // Refer to definitions of 'Window' added variables in @Base/DialogWindow.ts
        if (iFrameInDoc) {
            iFrameInDoc.contentWindow.BItems = BItems;
            iFrameInDoc.contentWindow.Eventing = Eventing;
            iFrameInDoc.contentWindow.Logger = Logger;
        }
        return;
    },
    removeDialog: (pName: string): void => {
        if (DialogMgt.dialogs.has(pName)) {
            const iFrameInDoc = document.getElementById(pName) as HTMLIFrameElement;
            if (iFrameInDoc && iFrameInDoc.parentElement) {
                iFrameInDoc.parentElement.removeChild(iFrameInDoc);
            }
            DialogMgt.dialogs.delete(pName);
        }
    }
}