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
import { BItem, PropValue } from '@BItem/BItem';
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
    let authTok: AuthToken = undefined;
    if (pProps.hasOwnProperty(AbBItem.AuthTokenProp)) {
        authTok = new AuthToken(pProps[AbBItem.AuthTokenProp] as string);
    };
    return new AbBItem(pProps[AbBItem.IdProp] as string,
                        authTok,
                        pProps[AbBItem.LayerProp] as string,
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
    public layer: string;

    private _auth: AuthToken;
    public get bitemAuthToken(): AuthToken {
        return this._auth;
    };
    public set bitemAuthToken(pVal: PropValue) {
        if (pVal instanceof AuthToken) {
            this._auth = pVal;
        }
        else {
            this._auth = new AuthToken(<string>pVal);
        };
    };

    private _creatingConnection: BasilConnection;
    public get creatingConnection(): BasilConnection {
        return this._creatingConnection;
    };

    private _state: BItemState;
    public get state(): BItemState {
        return this._state;
    }
    public set state(pVal: PropValue) {
        if (typeof(pVal) === 'string') {
            this._state = BItemState[pVal.toUpperCase() as keyof typeof BItemState];
        }
        else {
            this._state = Number(pVal);
        };
    };

    constructor(pId: string, pAuth: AuthToken, pLayer: string, pConnection?: BasilConnection) {
        super(AbBItemName);
        this.id = pId ?? CreateUniqueId('BItemConstruct');
        this._auth = pAuth ?? undefined;
        this.layer = pLayer ?? Config.layers.default;
        this._state = BItemState.UNINITIALIZED;
        this._creatingConnection = pConnection;
    };

    addProperties(pBItem: BItem): void {
        super.addProperties(pBItem);

        pBItem.addProperty(AbBItem.IdProp, this);
        pBItem.addProperty(AbBItem.LayerProp, this);
        pBItem.addProperty(AbBItem.AuthTokenProp, this, { private: true });
        pBItem.addProperty(AbBItem.CreatingConnection, this, { private: true });
        pBItem.addProperty(AbBItem.StateProp, this);
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };
};
