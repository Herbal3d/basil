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

import { Ability } from '@Abilities/Ability';
import { BItem, PropValue } from '@BItem/BItem';

import { BKeyedCollection } from '@Tools/bTypes';
// import { Logger } from '@Base/Tools/Logging';

export const AbKeyboardName = 'Keyboard'

// REMEMBER TO ADD the ability registration in AbilityManagement.ts

// Function that returns an instance of this Ability given a collection of properties (usually from BMessage.IProps)
export function AbKeyboardFromProps(pProps: BKeyedCollection): AbKeyboard {
    return new AbKeyboard();
};

export class AbKeyboard extends Ability {

    // When an ability is referenced in BMessage.IProps, these are the types of values passed in the request
    // These string names are the parameter names passed in the BMessage.IProps structure and they
    //     coorespond to the class property names.
    public static KeyDownProp = 'keyDown'; 
    public static KeyNameProp = 'keyName';
    public static KeyRepeatingProp = 'keyRepeating';
    public static AltKeyProp = 'keyAltKey';
    public static CntlKeyProp = 'keyCtrlKey';
    public static ShiftKeyProp = 'keyShiftKey';
    public static MetaKeyProp = 'keyMetaKey';

    constructor() {
        super(AbKeyboardName);
        document.onkeydown = this._onKeyDown.bind(this);
        document.onkeyup = this._onKeyUp.bind(this);
    };

    public keyDown: boolean = false;
    public keyName: string = 'unknown';
    public keyRepeating: boolean = false;
    public keyAlt: boolean = false;        // 'true' when alt key is pressed on last keyboard event
    public keyCtrl: boolean = false;       // 'true' when cntl key is pressed on last keyboard event
    public keyShift: boolean = false;      // 'true' when shift key is pressed on last keyboard event
    public keyMeta: boolean = false;       // 'true' when meta key is pressed on last keyboard event

    // Add all the properties from this assembly to the holding BItem
    addProperties(pBItem: BItem): void {
        super.addProperties(pBItem);

        pBItem.addProperty(AbKeyboard.KeyDownProp, this);
        pBItem.addProperty(AbKeyboard.KeyNameProp, this);
        pBItem.addProperty(AbKeyboard.KeyRepeatingProp, this);
        pBItem.addProperty(AbKeyboard.AltKeyProp, this);
        pBItem.addProperty(AbKeyboard.CntlKeyProp, this);
        pBItem.addProperty(AbKeyboard.ShiftKeyProp, this);
        pBItem.addProperty(AbKeyboard.MetaKeyProp, this);
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };

    _onKeyDown(e: KeyboardEvent) {
        this.keyDown = true;
        this._copyKeyboardEvent(e);
    }
    _onKeyUp(e: KeyboardEvent) {
        this.keyDown = false;
        this._copyKeyboardEvent(e);
    }
    _copyKeyboardEvent(pEvent: KeyboardEvent, pPushEvent?: boolean) {
        this.keyName = pEvent.key;
        this.keyAlt = pEvent.altKey;
        this.keyShift = pEvent.shiftKey;
        this.keyCtrl = pEvent.ctrlKey;
        this.keyMeta = pEvent.metaKey;
        if (pPushEvent) {
            this.containingBItem.setProp(AbKeyboard.KeyDownProp, this.keyDown);
        }

    }
};
