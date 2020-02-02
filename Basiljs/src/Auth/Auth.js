// Copyright 2018 Robert Adams
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

import { GP } from 'GLOBALS';
import Config from '../config.js';
import { RandomIdentifier } from '../Utilities.js';

import { BItem, BItemType } from '../Items/BItem.js';

// Create an identifying token. Just randomly generated.
export function CreateToken(connection) {
    let token = RandomIdentifier() + RandomIdentifier() + RandomIdentifier();
    if (connection) {
        token = connection + '-' + token;
    }
    return token;
}

// As good as 'never'. This will be a problem in 2300.
export function ExpirationNever() {
    return '2299-12-31T23:59:59Z';
}

export class Auth extends BItem {
    constructor() {
        let anId = 'Basil-' + RandomIdentifier();
        super(anId, null, BItemType.SERVICE);
    }

    Start() {
        // Not much to do yet
    }

}
