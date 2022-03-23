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
import { BItem } from '@BItem/BItem';

import { BKeyedCollection } from '@Tools/bTypes';
// import { Logger } from '@Base/Tools/Logging';

export const MouseAbilityName = 'Mouse'

// Function that returns an instance of this Ability given a collection of properties (usually from BMessage.IProps)
export function AbilityMouseFromProps(pProps: BKeyedCollection): AbilityMouse {
    return new AbilityMouse();
};

// Basic pointer as a mouse.
// Note: only three properties generate change events: PageXYProp, DownProp, and InPageProp.
// TODO: generalize for working with headsets
export class AbilityMouse extends Ability {

    public static PageXYProp = 'ptrPageXY';
    public static ClientXYProp = 'ptrClientXY';
    public static ClickedProp = 'ptrClicked';
    public static DownProp = 'ptrDown';
    public static ButtonProp = 'ptrButton';
    public static InPageProp = 'ptrInPage';
    public static AltKeyProp = 'ptrAltKey';
    public static CntlKeyProp = 'ptrCtrlKey';
    public static ShiftKeyProp = 'ptrShiftKey';
    public static MetaKeyProp = 'ptrMetaKey';
    public static ModeProp = 'ptrMode';

    constructor() {
        super(MouseAbilityName);
        document.onmousemove = this._mouseMove.bind(this);
        document.onmouseup = this._mouseUp.bind(this);
        document.onmousedown = this._mouseDown.bind(this);
        document.onmouseenter = this._mouseEnter.bind(this);
        document.onmouseleave = this._mouseLeave.bind(this);
    };

    public ptrPageXY: number[] = [0, 0];   // reported page XY position
    public ptrClientXY: number[] = [0, 0]; // reported client (sub-region) position
    public ptrClicked: Date = new Date();  // updated on click. Use to sense mouse clicks
    public ptrDown: boolean = false;       // true if mouse is down
    public ptrButton: number = 0;          // button number on last mouse click
    public ptrInPage: boolean = false;
    public ptrAlt: boolean = false;        // 'true' when alt key is pressed on last mouse event
    public ptrCtrl: boolean = false;       // 'true' when cntl key is pressed on last mouse event
    public ptrShift: boolean = false;      // 'true' when shift key is pressed on last mouse event
    public ptrMeta: boolean = false;       // 'true' when meta key is pressed on last mouse event
    public ptrMode: number = 0;            // mode used by apps to differentiate pointing and movement global setting

    // Add all the properties from this assembly to the holding BItem
    addProperties(pBItem: BItem): void {
        super.addProperties(pBItem);

        pBItem.addProperty(AbilityMouse.PageXYProp, this);
        pBItem.addProperty(AbilityMouse.ClientXYProp, this);
        pBItem.addProperty(AbilityMouse.ClickedProp, this);
        pBItem.addProperty(AbilityMouse.DownProp, this);
        pBItem.addProperty(AbilityMouse.ButtonProp, this);
        pBItem.addProperty(AbilityMouse.InPageProp, this);
        pBItem.addProperty(AbilityMouse.AltKeyProp, this);
        pBItem.addProperty(AbilityMouse.CntlKeyProp, this);
        pBItem.addProperty(AbilityMouse.ShiftKeyProp, this);
        pBItem.addProperty(AbilityMouse.MetaKeyProp, this);
        pBItem.addProperty(AbilityMouse.ModeProp, this);
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };

    _mouseMove(e: MouseEvent): void {
        this._copyMouseEvent(e, true);
    }

    _mouseUp(e: MouseEvent): void {
        this.ptrDown = false;
        this._copyMouseEvent(e, true);
    }

    _mouseDown(e: MouseEvent): void {
        this.ptrDown = true;
        this.ptrButton = e.button;
        this.ptrClicked = new Date();
        this._copyMouseEvent(e, true);
    }

    _mouseEnter(e: MouseEvent): void {
        this.ptrInPage = true;
        this._copyMouseEvent(e, true);
    }

    _mouseLeave(e: MouseEvent): void {
        this.ptrInPage = false;
        this._copyMouseEvent(e, true);
    }

    _copyMouseEvent(pEvent: MouseEvent, pPushUpdate: boolean): void {
        this.ptrClientXY = [ pEvent.clientX, pEvent.clientY ];
        this.ptrPageXY = [ pEvent.pageX, pEvent.pageY ];
        this.ptrClicked = new Date();
        this.ptrAlt = pEvent.altKey;
        this.ptrShift = pEvent.shiftKey;
        this.ptrCtrl = pEvent.ctrlKey;
        this.ptrMeta = pEvent.metaKey
        this.ptrClientXY = [ pEvent.clientX, pEvent.clientY ];
        this.ptrPageXY = [ pEvent.pageX, pEvent.pageY ];
        // If update events are to be sent...
        if (pPushUpdate) {
            this.containingBItem.setProp(AbilityMouse.PageXYProp, this.ptrPageXY);
            this.containingBItem.setProp(AbilityMouse.DownProp, this.ptrDown);
            this.containingBItem.setProp(AbilityMouse.InPageProp, this.ptrInPage);
        }
    }
};
