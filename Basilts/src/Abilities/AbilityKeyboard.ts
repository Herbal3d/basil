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

import { BItem, PropValue, PropValueTypes, SetPropEventParams } from '@BItem/BItem';

import { Ability, RegisterAbility } from '@Abilities/Ability';
import { PropDefaultValidator, PropDefaultGetter, PropDefaultSetter } from '@Abilities/Ability';

import { GraphicsStateChangeProps, GraphicStates, Graphics } from '@Base/Graphics/Graphics';
import { KeyboardEventHandler, SetKeyboardEventHandler } from '@Base/Graphics/GraphicOps';

import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Base/Tools/Logging';
import { EventProcessor } from '@Base/Eventing/SubscriptionEntry';
import { timeStamp } from 'console';

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
    public static KeyCodeProp = 'keyCode';
    public static KeyRepeatingProp = 'keyRepeating';
    public static AltKeyProp = 'keyAltKey';
    public static CntlKeyProp = 'keyCtrlKey';
    public static ShiftKeyProp = 'keyShiftKey';
    public static MetaKeyProp = 'keyMetaKey';

    constructor() {
        super(AbKeyboardName, {
                [AbKeyboard.KeyDownProp]: {
                    propName: AbKeyboard.KeyDownProp,
                    propType: PropValueTypes.Boolean,
                    propDefault: false,
                    propDesc: 'Key is down',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbKeyboard.KeyNameProp]: {
                    propName: AbKeyboard.KeyNameProp,
                    propType: PropValueTypes.String,
                    propDefault: 'unknown',
                    propDesc: 'Name of the key that event is for',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbKeyboard.KeyCodeProp]: {
                    propName: AbKeyboard.KeyCodeProp,
                    propType: PropValueTypes.String,
                    propDefault: 'unknown',
                    propDesc: 'Code of the key that event is for',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbKeyboard.KeyRepeatingProp]: {
                    propName: AbKeyboard.KeyRepeatingProp,
                    propType: PropValueTypes.Boolean,
                    propDefault: false,
                    propDesc: 'If true, this is a repeating key event',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbKeyboard.AltKeyProp]: {
                    propName: AbKeyboard.AltKeyProp,
                    propType: PropValueTypes.Boolean,
                    propDefault: false,
                    propDesc: 'Alt key is pressed',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbKeyboard.CntlKeyProp]: {
                    propName: AbKeyboard.CntlKeyProp,
                    propType: PropValueTypes.Boolean,
                    propDefault: false,
                    propDesc: 'Cntl key is pressed',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbKeyboard.ShiftKeyProp]: {
                    propName: AbKeyboard.ShiftKeyProp,
                    propType: PropValueTypes.Boolean,
                    propDefault: false,
                    propDesc: 'Shift key is pressed',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbKeyboard.MetaKeyProp]: {
                    propName: AbKeyboard.MetaKeyProp,
                    propType: PropValueTypes.Boolean,
                    propDefault: false,
                    propDesc: 'Meta key is pressed',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },

        });
    };

    // Add all the properties from this assembly to the holding BItem
    addProperties(pBItem: BItem): void {
        super.addProperties(pBItem);

        pBItem.setReady();

        // Have to wait until the graphics system is initialized before there is a scene to watch
        Graphics.WatchGraphicsStateChange(this._onGraphicsReady.bind(this) as EventProcessor);
    };
    _onGraphicsReady(pEvent: GraphicsStateChangeProps): void {
        if (pEvent.state === GraphicStates.Initialized || pEvent.state === GraphicStates.Rendering) {   
            Logger.debug(`AbKeyboard._onGraphicsReady: subscribing to keyboard events`);
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
        this.propValues[AbKeyboard.KeyDownProp] = pDown;
        this.propValues[AbKeyboard.KeyNameProp] = pEvent.key;
        this.propValues[AbKeyboard.KeyCodeProp] = pEvent.code;
        this.propValues[AbKeyboard.AltKeyProp] = pEvent.altKey;
        this.propValues[AbKeyboard.ShiftKeyProp] = pEvent.shiftKey;
        this.propValues[AbKeyboard.CntlKeyProp] = pEvent.ctrlKey;
        this.propValues[AbKeyboard.MetaKeyProp] = pEvent.metaKey;
        // This causes the property changed event to be generated
        this.containingBItem.setProp(AbKeyboard.KeyDownProp, this.propValues[AbKeyboard.KeyDownProp]);
    }
};
