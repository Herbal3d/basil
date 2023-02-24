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
import { PropDefaultGetter, PropDefaultSetter } from '@Abilities/Ability';
import { BItem, PropValue, PropValueTypes } from '@BItem/BItem';

import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Base/Tools/Logging';

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
// Mouse movement events will be returned by subscribing to ClientXYProp.
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
        super(AbMouseName, {
                [AbMouse.PageXYProp]: {
                    propName: AbMouse.PageXYProp,
                    propType: PropValueTypes.NumberArray,
                    propDefault: [0, 0],
                    propDesc: 'Page XY position of pointer',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbMouse.ClientXYProp]: {
                    propName: AbMouse.ClientXYProp,
                    propType: PropValueTypes.NumberArray,
                    propDefault: [0, 0],
                    propDesc: 'client XY position of pointer',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbMouse.ClickedProp]: {
                    propName: AbMouse.ClickedProp,
                    propType: PropValueTypes.Object,
                    propDefault: 0,
                    propDesc: 'Date of last click',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbMouse.DownProp]: {
                    propName: AbMouse.DownProp,
                    propType: PropValueTypes.Boolean,
                    propDefault: false,
                    propDesc: 'whether mouse button is down',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbMouse.ButtonProp]: {
                    propName: AbMouse.ButtonProp,
                    propType: PropValueTypes.Number,
                    propDefault: 0,
                    propDesc: 'Button number of last mouse event',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbMouse.InPageProp]: {
                    propName: AbMouse.InPageProp,
                    propType: PropValueTypes.Boolean,
                    propDefault: false,
                    propDesc: 'Whether mouse is in the page or not',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbMouse.AltKeyProp]: {
                    propName: AbMouse.AltKeyProp,
                    propType: PropValueTypes.Boolean,
                    propDefault: false,
                    propDesc: 'true when alt key is down on last mouse event',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbMouse.CntlKeyProp]: {
                    propName: AbMouse.CntlKeyProp,
                    propType: PropValueTypes.Boolean,
                    propDefault: false,
                    propDesc: 'true when cntl key is down on last mouse event',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbMouse.ShiftKeyProp]: {
                    propName: AbMouse.ShiftKeyProp,
                    propType: PropValueTypes.Boolean,
                    propDefault: false,
                    propDesc: 'true when shift key is down on last mouse event',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbMouse.MetaKeyProp]: {
                    propName: AbMouse.MetaKeyProp,
                    propType: PropValueTypes.Boolean,
                    propDefault: false,
                    propDesc: 'true when meta key is down on last mouse event',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbMouse.ModeProp]: {
                    propName: AbMouse.ModeProp,
                    propType: PropValueTypes.Number,
                    propDefault: 0,
                    propDesc: 'used by apps to differentiate pointing and movement global settings',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },

        });
        this.propValues[AbMouse.ClickedProp] = <PropValue><unknown>new Date();

        document.onmousemove = this._mouseMove.bind(this);
        document.onmouseup = this._mouseUp.bind(this);
        document.onmousedown = this._mouseDown.bind(this);
        document.onmouseenter = this._mouseEnter.bind(this);
        document.onmouseleave = this._mouseLeave.bind(this);
    };

    // Add all the properties from this assembly to the holding BItem
    addProperties(pBItem: BItem): void {
        super.addProperties(pBItem);

        pBItem.setReady();
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };

    // The mouse moved
    _mouseMove(e: MouseEvent): void {
        // Since this happens a lot, only generate events if the caller
        //    has subscribed to ptrClientXY
        this._copyMouseEvent(e, false);
        this.containingBItem.setProp(AbMouse.ClientXYProp, this.propValues[AbMouse.ClientXYProp]);
    }

    // 
    _mouseUp(e: MouseEvent): void {
        Logger.debug(`AbilityMouse._mouseUp: UP`);  //DEBUG DEBUG
        this.propValues[AbMouse.DownProp] = false;
        this._copyMouseEvent(e);
    }

    // Mouse button went down
    _mouseDown(e: MouseEvent): void {
        Logger.debug(`AbilityMouse._mouseDown: DOWN`);//DEBUG DEBUG
        this.propValues[AbMouse.DownProp] = true;
        this.propValues[AbMouse.ButtonProp] = e.button;
        this.propValues[AbMouse.ClickedProp] = <PropValue><unknown>Date.now;
        this._copyMouseEvent(e);
    }

    // Mouse cursor entered our area
    _mouseEnter(e: MouseEvent): void {
        this.propValues[AbMouse.InPageProp] = true;
        this._copyMouseEvent(e);
    }

    // Mouse cursor left our area
    _mouseLeave(e: MouseEvent): void {
        this.propValues[AbMouse.InPageProp] = false;
        this._copyMouseEvent(e, true);
    }

    // Make local copies of the mouse information and then generate changed event
    _copyMouseEvent(pEvent: MouseEvent, pPushUpdate: boolean = true): void {
        this.propValues[AbMouse.AltKeyProp] = pEvent.altKey;
        this.propValues[AbMouse.ShiftKeyProp] = pEvent.shiftKey;
        this.propValues[AbMouse.CntlKeyProp] = pEvent.ctrlKey;
        this.propValues[AbMouse.MetaKeyProp] = pEvent.metaKey;
        this.propValues[AbMouse.ClientXYProp] = [ pEvent.clientX, pEvent.clientY ];
        this.propValues[AbMouse.PageXYProp] = [ pEvent.pageX, pEvent.pageY ];
        // If update events are to be sent...
        if (pPushUpdate) {
            this.containingBItem.setProp(AbMouse.DownProp, this.propValues[AbMouse.DownProp]);
        }
    }
};
