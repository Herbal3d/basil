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

import { Ability, RegisterAbility } from '@Abilities/Ability';
import { BItem, PropValue } from '@BItem/BItem';
import { DialogMgt } from '@Base/DialogMgt/DialogMgt';

import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Tools/Logging';
import { RandomIdentifier } from '@Tools/Utilities';

export const AbDialogName = 'Dialog'
// REMEMBER TO ADD the ability registration in AbilityManagement.ts

// Function that returns an instance of this Ability given a collection of properties (usually from BMessage.IProps)
export function AbDialogFromProps(pProps: BKeyedCollection): AbDialog {
    if (pProps.hasOwnProperty(AbDialog.UrlProp)) {
        const urlProp = pProps[AbDialog.UrlProp] as string;
        return new AbDialog(urlProp);
    };
    Logger.error(`AbAssemblyFromProps: Missing required properties for ${AbDialogName}. pProps: ${JSON.stringify(pProps)}`);
};

// Register the ability with the AbilityFactory. Note this is run when this file is imported.
RegisterAbility(AbDialogName, AbDialogFromProps);

export class AbDialog extends Ability {

    // When an ability is referenced in BMessage.IProps, these are the types of values passed in the request
    // These string names are the parameter names passed in the BMessage.IProps structure and they
    //     coorespond to the class property names.
    public static UrlProp = 'url';
    public static DialogNameProp = 'dialogName';

    constructor(pUrl: string, pDialogName?: string) {
        super(AbDialogName);
        this.dialogName = pDialogName ?? 'Dialog' + RandomIdentifier();
        this.url = pUrl;
    };

    public dialogName: string;

    public _url: string;
    public get url(): string {
        return this._url;
    }
    public set url(pVal: string) {
        this._url = pVal;
        DialogMgt.createDialog(this.dialogName, this.url);
    }

    // Add all the properties from this assembly to the holding BItem
    addProperties(pBItem: BItem): void {
        // Always do this!!
        super.addProperties(pBItem);

        pBItem.addProperty(AbDialog.UrlProp, this);
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };
};

