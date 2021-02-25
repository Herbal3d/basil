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

import { GenUUID, IsNullOrEmpty } from '@Tools/Misc';

export class AuthToken {
    _token: string;

    constructor(pToken?: string) {
        if (IsNullOrEmpty(pToken)) {
            this._token = GenUUID();
        }
        else {
            this._token = pToken;
        };
    };
    //
    get token(): string {
        return this._token;
    };
};