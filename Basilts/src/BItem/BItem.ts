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

import { Ability } from '@Abilities/Ability';
import { AbilityBItem, BItemState, StateProp } from '@Abilities/AbilityBItem';

import { AuthToken } from '@Tools/Auth';

// A property entry has either getter/setters to access the property value or
//    it has just a 'value' entry. Calling getProp() or setProp() uses what
//    is defined for that property.
export type getterFunction = (pDfd: PropEntry, pD: BItem) => Promise<any>;
export type setterFunction = (pDfd: PropEntry, pD: BItem, pV: any) => Promise<void>;
export interface PropEntry {
    name: string,
    value?: any,
    getter?: getterFunction,
    setter?: setterFunction,
    ability: Ability
};

export abstract class BItem {

    _props: Map<string, PropEntry>;
    _abilities: Map<string, Ability>;

    constructor(pId: string, pAuth: AuthToken, pLayer: string) {
        this._props = new Map<string,PropEntry>();

        this.addAbility(new AbilityBItem(this, pId, pAuth, pLayer));

        this.setProp(StateProp, BItemState.UNINITIALIZED)
    };
    async getProp(pPropName: string): Promise<any> {
        const prop = this._props.get(pPropName);
        if (prop && prop.getter) {
            return prop.getter(prop, this);
        }
        return prop.value;
    };
    async setProp(pPropName: string, pVal: any): Promise<void> {
        const prop = this._props.get(pPropName);
        if (prop && prop.setter) {
            return prop.setter(prop, this, pVal);
        };
        prop.value = pVal;
        return;
    };
    async incrementProp(pPropName: string) : Promise<number> {
        const prop = this._props.get(pPropName);
        if (prop && prop.getter && prop.setter) {
            const val = await prop.getter(prop, this) + 1;
            await prop.setter(prop, this, val);
            return val;
        };
        prop.value += 1;
        return prop.value;
    };
    addProperty(pPropEntry: PropEntry) {
        this._props.set(pPropEntry.name, pPropEntry);
    };
    removeProperty(pPropEntry: PropEntry) {
        this._props.delete(pPropEntry.name);
    };
    addAbility(pAbility: Ability) {
        this._abilities.set(pAbility.name, pAbility);
    };
    removeAbility(pAbility: Ability) {
        this._abilities.delete(pAbility.name);
    };
    setReady() {
        this.setProp('state', BItemState.READY)
    };
    setFailed() {
        this.setProp('state', BItemState.FAILED)
    };
    setLoading() {
        this.setProp('state', BItemState.LOADING)
    };
    setShutdown() {
        this.setProp('state', BItemState.SHUTDOWN)
    };
};
