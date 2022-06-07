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
import { BItem, setPropEventParams } from '@BItem/BItem';
import { AbPlacement } from '@Abilities/AbilityPlacement';

import { BKeyedCollection } from '@Tools/bTypes';
import { Eventing } from '@Eventing/Eventing';
import { EventProcessor, SubscriptionEntry } from '@Eventing/SubscriptionEntry';
import { Logger } from '@Base/Tools/Logging';

export const AbCameraName = 'Camera'

// Function that returns an instance of this Ability given a collection of properties (usually from BMessage.IProps)
export function AbCameraFromProps(pProps: BKeyedCollection): AbCamera {
    if (pProps.hasOwnProperty(AbCamera.CameraIndexProp)) {
        let camIndex = 0;
        if (typeof pProps[AbCamera.CameraIndexProp] === 'string') {
            camIndex = parseInt(pProps[AbCamera.CameraIndexProp] as string);
        }
        else {
            if (typeof pProps[AbCamera.CameraIndexProp] === 'number') {
                camIndex = pProps[AbCamera.CameraIndexProp] as number;
            }
        }
        return new AbCamera(camIndex);
    }
    Logger.error(`AbCameraFromProps: Missing required properties for ${AbCameraName}. pProps: ${JSON.stringify(pProps)}`);
};

export enum CameraModes {
    FirstPerson = 1,
    ThirdPerson = 2,
    FreeLook = 3,
    Orbit = 4,
    Track = 5,
    Follow = 6
}

// Register the ability with the AbilityFactory. Note this is run when this file is imported.
RegisterAbility( AbCameraName, AbCameraFromProps );

/// <summary>
/// Base camera operation. This holds the state (type of view) and other central
///    camera operations.
/// A camera instance is usually a BItem with AbPlacement (for location in the world),
///    this AbCamera for camera operation coordination, and then one of the world-centric
///    camera operation abilities (AbOSCamera, AbFreeCamera, etc.).
/// </summary>
export class AbCamera extends Ability {

    public static CameraIndexProp = 'cameraIndex';
    public static CameraModeProp = 'cameraMode';

    constructor(pIndex: number) {
        super(AbCameraName);
        this.cameraIndex = pIndex;
    };

    public cameraIndex: number = 0;
    public cameraMode: CameraModes = CameraModes.ThirdPerson;

    _posSubscription: SubscriptionEntry;
    _rotSubscription: SubscriptionEntry;

    // Add all the properties from this assembly to the holding BItem
    addProperties(pBItem: BItem): void {
        // Always do this!!
        super.addProperties(pBItem);

        pBItem.addProperty(AbCamera.CameraIndexProp, this);
        pBItem.addProperty(AbCamera.CameraModeProp, this);

        // Subscribe to the AbPlacement on this BItem so camera knows when it is moved.
        this._posSubscription = Eventing.Subscribe(pBItem.getPropEventTopicName(AbPlacement.PosProp),
                    this._onPosUpdate.bind(this) as EventProcessor);
        this._rotSubscription = Eventing.Subscribe(pBItem.getPropEventTopicName(AbPlacement.RotProp),
                    this._onRotUpdate.bind(this) as EventProcessor);

        pBItem.setReady();
    };

    // When a property is removed from the BItem, this is called
    propertyBeingRemoved(pBItem: BItem, pPropertyName: string): void {
        if (pPropertyName === AbCamera.CameraIndexProp) {
            Eventing.Unsubscribe(this._posSubscription);
            Eventing.Unsubscribe(this._rotSubscription);
        };
        return;
    };

    _onPosUpdate(pBItem: BItem, pPos: setPropEventParams): void {
        // TODO: put code here
        return;
    }
    _onRotUpdate(pBItem: BItem, pRot: setPropEventParams): void {
        // TODO: put code here
        return;
    }
};
