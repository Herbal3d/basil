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
import { Eventing } from '@Base/Eventing/Eventing';
import { GraphicsStateEventName, GraphicStateEventProps, GraphicStates } from '@Base/Graphics/Graphics';
import { KeyboardEventHandler, SetKeyboardEventHandler } from '@Base/Graphics/GraphicOps';
import { BItem } from '@BItem/BItem';

import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Base/Tools/Logging';
import { EventProcessor } from '@Base/Eventing/SubscriptionEntry';

export const AbKeyboardName = 'Keyboard'

// Function that returns an instance of this Ability given a collection of properties (usually from BMessage.IProps)
export function AbKeyboardFromProps(pProps: BKeyedCollection): AbKeyboard {
    return new AbKeyboard();
};

// Register the ability with the AbilityFactory. Note this is run when this file is imported.
RegisterAbility(AbKeyboardName, AbKeyboardFromProps);

// Ability that interfaces to the keyboard.
// Subscribe to events from KeyDownProp to get all changes in keyboard state.
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

        // Have to wait until the graphics system is initialized before there is a scene to watch
        Eventing.Subscribe(GraphicsStateEventName, this._onGraphicsReady.bind(this) as EventProcessor);

        pBItem.setReady();
    };
    _onGraphicsReady(pEvent: GraphicStateEventProps): void {
        if (pEvent.state === GraphicStates.Initialized || pEvent.state === GraphicStates.Rendering) {   
            SetKeyboardEventHandler(this._onKeyEvent.bind(this) as KeyboardEventHandler);
        };
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        // When being removed, remove the event handler
        SetKeyboardEventHandler(undefined);
        return;
    };

    _onKeyEvent(pEvent: KeyboardEvent, pDown: boolean): void {
        this.keyDown = pDown;
        this.keyName = pEvent.key;
        this.keyAlt = pEvent.altKey;
        this.keyShift = pEvent.shiftKey;
        this.keyCtrl = pEvent.ctrlKey;
        this.keyMeta = pEvent.metaKey;
        this.containingBItem.setProp(AbKeyboard.KeyDownProp, this.keyDown);
    }
};
