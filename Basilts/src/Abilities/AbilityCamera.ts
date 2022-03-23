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
import { BItem, PropValue } from '@BItem/BItem';

import { BKeyedCollection } from '@Tools/bTypes';
// import { Logger } from '@Base/Tools/Logging';

export const CameraAbilityName = 'Camera'

// REMEMBER TO ADD the ability registration in AbilityManagement.ts

// Function that returns an instance of this Ability given a collection of properties (usually from BMessage.IProps)
export function AbilityCameraFromProps(pProps: BKeyedCollection): AbilityCamera {
    return new AbilityCamera(pProps[AbilityCamera.CameraIndexProp]);
};

export enum CameraModes {
    FirstPerson = 1,
    ThirdPerson = 2,
    FreeLook = 3,
    Orbit = 4,
    Track = 5,
    Follow = 6
}

export class AbilityCamera extends Ability {

    public static CameraIndexProp = 'cameraIndex';
    public static CameraModeProp = 'cameraMode';

    constructor(pIndex: number) {
        super(CameraAbilityName);
        this.cameraIndex = pIndex;
    };

    public cameraIndex: number = 0;
    public cameraMode: CameraModes = CameraModes.ThirdPerson;

    // Add all the properties from this assembly to the holding BItem
    addProperties(pBItem: BItem): void {
        // Always do this!!
        super.addProperties(pBItem);

        pBItem.addProperty(AbilityCamera.CameraIndexProp, this);
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        return;
    };
};
