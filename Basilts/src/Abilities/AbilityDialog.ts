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

import { Ability, RegisterAbility, ParseValueToType } from '@Abilities/Ability';
import { PropDefaultGetter, PropDefaultSetter } from '@Abilities/Ability';
import { BItem, PropValue, PropValueTypes } from '@BItem/BItem';
import { DialogMgt } from '@Base/DialogMgt/DialogMgt';

import { BKeyedCollection } from '@Tools/bTypes';
import { RandomIdentifier } from '@Tools/Utilities';
import { Logger } from '@Tools/Logging';

export const AbDialogName = 'Dialog'

// Function that returns an instance of this Ability given a collection of properties (usually from BMessage.IProps)
export function AbDialogFromProps(pProps: BKeyedCollection): AbDialog {
    return new AbDialog(
        <string>ParseValueToType(PropValueTypes.String, pProps[AbDialog.DialogUrlProp]),
        <string>ParseValueToType(PropValueTypes.String, pProps[AbDialog.DialogNameProp]),
        <string>ParseValueToType(PropValueTypes.String, pProps[AbDialog.DialogPlacementProp])
    );
};

// Register the ability with the AbilityFactory. Note this is run when this file is imported.
RegisterAbility(AbDialogName, AbDialogFromProps);

export class AbDialog extends Ability {

    // When an ability is referenced in BMessage.IProps, these are the types of values passed in the request
    // These string names are the parameter names passed in the BMessage.IProps structure and they
    //     coorespond to the class property names.
    public static DialogUrlProp = 'dialogUrl';
    public static DialogNameProp = 'dialogName';
    public static DialogPlacementProp = 'dialogPlacement';

    constructor(pUrl: string, pDialogName?: string, pPlacement?: string) {
        super(AbDialogName, {
                [AbDialog.DialogUrlProp]: {
                    propName: AbDialog.DialogUrlProp,
                    propType: PropValueTypes.String,
                    propDefault: pUrl,
                    propDesc: 'URL of the dialog to display',
                    propGetter: PropDefaultGetter,
                    propSetter: (pAbil: Ability, pPropName: string, pVal: PropValue) => {
                        PropDefaultSetter(pAbil, pPropName, pVal);
                        // Setting the URL causes the dialog to be created
                        if (pAbil.propValues[AbDialog.DialogUrlProp]) {
                            DialogMgt.createDialog(
                                this.propValues[AbDialog.DialogNameProp] as string,
                                this.propValues[AbDialog.DialogUrlProp] as string,
                                this.propValues[AbDialog.DialogPlacementProp] as string
                            );
                        }
                    }
                },
                [AbDialog.DialogNameProp]: {
                    propName: AbDialog.DialogNameProp,
                    propType: PropValueTypes.String,
                    propDefault: pDialogName ?? 'Dialog' + RandomIdentifier(),
                    propDesc: 'Name to use to reference the dialog',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbDialog.DialogPlacementProp]: {
                    propName: AbDialog.DialogPlacementProp,
                    propType: PropValueTypes.String,
                    propDefault: pPlacement ?? 'center',
                    propDesc: 'Page placement of the dialog',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                }
        });
    };

    // Add all the properties from this assembly to the holding BItem
    addProperties(pBItem: BItem): void {
        // Always do this!!
        super.addProperties(pBItem);

        pBItem.setReady();

        // If an URL was specified when this ability was created, see that the dialog is created
        this.setProp(AbDialog.DialogUrlProp, this.propValues[AbDialog.DialogUrlProp]);
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };
};

