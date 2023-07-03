// Copyright 2021 Robert Adams
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

import { Ability, ParseValueToType } from '@Abilities/Ability';
import { PropDefaultGetter, PropDefaultSetter, PropCannotSet } from '@Abilities/Ability';
import { BItem, PropValue, PropValueTypes } from '@BItem/BItem';
import { AuthToken } from '@Tools/Auth';

import { CreateUniqueId } from '@Tools/Utilities';
import { BKeyedCollection } from '@Tools/bTypes';
import { Config } from '@Base/Config';
import { BasilConnection } from '@Comm/BasilConnection';

export enum BItemState {
    UNINITIALIZED = 0,
    LOADING,
    FAILED,
    READY,
    SHUTDOWN
};

export const AbBItemName = 'BItem';

export function AbBItemFromProps(pProps: BKeyedCollection): AbBItem {
    return new AbBItem(ParseValueToType(PropValueTypes.String, pProps[AbBItem.IdProp]) as string,
                       ParseValueToType(PropValueTypes.AuthToken, pProps[AbBItem.AuthTokenProp]) as AuthToken,
                       ParseValueToType(PropValueTypes.String, pProps[AbBItem.LayerProp]) as string,
                       undefined);
};

export class AbBItem extends Ability {
    public static IdProp: string = 'id';
    public static LayerProp: string = 'layer';
    public static StateProp: string = 'state';
    public static AuthTokenProp: string = 'bitemAuthToken';
    public static CreatingConnection: string = 'creatingConnection';
    public static AbilityProp: string = 'abilities';

    public id: string;

    private _creatingConnection: BasilConnection;

    constructor(pId: string, pAuth: AuthToken, pLayer: string, pConnection?: BasilConnection) {
        super(AbBItemName, {
                [AbBItem.IdProp]: {
                    propName: AbBItem.IdProp,
                    propType: PropValueTypes.String,
                    propDefault: pId ?? CreateUniqueId('BItemConstruct'),    // NOTE: this passed as parameter
                    propDesc: 'identifier for the BItem',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbBItem.LayerProp]: {
                    propName: AbBItem.LayerProp,
                    propType: PropValueTypes.String,
                    propDefault: pLayer ?? Config.layers.default,    // NOTE: this passed as parameter
                    propDesc: 'identifier for the BItem',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter
                },
                [AbBItem.StateProp]: {
                    propName: AbBItem.StateProp,
                    propType: PropValueTypes.Number,
                    propDefault: BItemState.UNINITIALIZED,
                    propDesc: 'current state of the BItem',
                    propGetter: PropDefaultGetter,
                    propSetter: (pAbil: Ability, pPropName: string, pVal: PropValue) => {   // Set camera position
                        // State can be passed as either its numeric value or as the string name of the state
                        if (typeof(pVal) === 'string') {
                            this.propValues[AbBItem.StateProp] = BItemState[pVal.toUpperCase() as keyof typeof BItemState];
                        }
                        else {
                            this.propValues[AbBItem.StateProp] = Number(pVal);
                        };
                    }
                },
                [AbBItem.AuthTokenProp]: {
                    propName: AbBItem.AuthTokenProp,
                    propType: PropValueTypes.String,
                    propDefault: pAuth ?? undefined,    // NOTE: this passed as parameter
                    propDesc: 'token required for access to the BItem',
                    propGetter: PropDefaultGetter,
                    propSetter: PropDefaultSetter,
                    private: true
                },
                [AbBItem.CreatingConnection]: {
                    propName: AbBItem.CreatingConnection,
                    propType: PropValueTypes.Object,
                    propDefault: undefined,
                    propDesc: 'the connection that created the BItem',
                    propGetter: (pAbil: Ability, pPropName: string): PropValue => {
                        const abil = pAbil as AbBItem;
                        return abil._creatingConnection as unknown as PropValue;
                    },
                    propSetter: PropCannotSet,
                    private: true
                },
                [AbBItem.AbilityProp]: {
                    propName: AbBItem.AbilityProp,
                    propType: PropValueTypes.StringArray,
                    propDefault: 'abilities',
                    propDesc: 'identifier for the BItem',
                    // Returns the list of abilities that have been added to the BItem
                    propGetter: (pAbil: Ability, pPropName: string): PropValue => {
                        const abils: string[] = [];
                        this._creatingConnection._propToAbility.forEach( (abil: Ability, propName: string) => {
                            if (!(abil.abilityName in abils)) {
                                abils.push(abil.abilityName);
                            }
                        });
                        return abils;
                    },
                    propSetter: PropCannotSet
                }

        });
        this._creatingConnection = pConnection;
    };

    addProperties(pBItem: BItem): void {
        super.addProperties(pBItem);
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };
};
