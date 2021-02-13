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
import { AbilityBItem, BItemState } from '@Abilities/AbilityBItem';

import { AuthToken } from '@Tools/Auth';

export type getterFunction = (pDfd: PropEntry, pD: BItem) => Promise<any>;
export type setterFunction = (pDfd: PropEntry, pD: BItem, pV: any) => Promise<void>;
export interface PropEntry {
  name: string,
  getter: getterFunction,
  setter: setterFunction,
  ability: Ability
}
export abstract class BItem {

  props: Map<string, PropEntry>;
  abilities: Map<string, Ability>;

  constructor(pId: string, pAuth: AuthToken, pLayer: string) {
    this.props = new Map<string,PropEntry>();
    this.addAbility(new AbilityBItem(this, pId, pAuth, pLayer));
    this.setProp('state', BItemState.UNINITIALIZED)
  };

  async getProp(pPropName: string): Promise<any> {
    const prop = this.props.get(pPropName);
    if (prop && prop.getter) {
      return prop.getter(prop, this);
    };
    return undefined;
  };
  async setProp(pPropName: string, pVal: any): Promise<void> {
    const prop = this.props.get(pPropName);
    if (prop && prop.setter) {
      return prop.setter(prop, this, pVal);
    };
    return undefined;
  };
  addProperty(pPropEntry: PropEntry) {
    this.props.set(pPropEntry.name, pPropEntry);
  };
  removeProperty(pPropEntry: PropEntry) {
    this.props.delete(pPropEntry.name);
  };
  addAbility(pAbility: Ability) {
    this.abilities.set(pAbility.name, pAbility);
  };
  removeAbility(pAbility: Ability) {
    this.abilities.delete(pAbility.name);
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




}
