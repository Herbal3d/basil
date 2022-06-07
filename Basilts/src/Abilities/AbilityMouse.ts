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
import { BItem } from '@BItem/BItem';

import { BKeyedCollection } from '@Tools/bTypes';
// import { Logger } from '@Base/Tools/Logging';

export const AbMouseName = 'Mouse'

// Function that returns an instance of this Ability given a collection of properties (usually from BMessage.IProps)
export function AbMouseFromProps(pProps: BKeyedCollection): AbMouse {
    return new AbMouse();
};

// Register the ability with the AbilityFactory. Note this is run when this file is imported.
RegisterAbility(AbMouseName, AbMouseFromProps);

// Basic pointer as a mouse.
// Note: only one property generates change events: DownProp. For mouse events,
//    subscribe to that one and check the other properties to see if they changed.
// TODO: generalize for working with headsets
export class AbMouse extends Ability {

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
        super(AbMouseName);
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

        pBItem.addProperty(AbMouse.PageXYProp, this);
        pBItem.addProperty(AbMouse.ClientXYProp, this);
        pBItem.addProperty(AbMouse.ClickedProp, this);
        pBItem.addProperty(AbMouse.DownProp, this);
        pBItem.addProperty(AbMouse.ButtonProp, this);
        pBItem.addProperty(AbMouse.InPageProp, this);
        pBItem.addProperty(AbMouse.AltKeyProp, this);
        pBItem.addProperty(AbMouse.CntlKeyProp, this);
        pBItem.addProperty(AbMouse.ShiftKeyProp, this);
        pBItem.addProperty(AbMouse.MetaKeyProp, this);
        pBItem.addProperty(AbMouse.ModeProp, this);

        pBItem.setReady();
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
            this.containingBItem.setProp(AbMouse.DownProp, this.ptrDown);
        }
    }
};
