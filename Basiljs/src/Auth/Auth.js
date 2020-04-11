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
import { JSONstringify, RandomIdentifier } from '../Utilities.js';

import { BItem, BItemType } from '../Items/BItem.js';

import { Base64 } from 'js-base64';

// Create an identifying token. Just randomly generated.
export static function CreateToken(connection) {
    let token = RandomIdentifier() + RandomIdentifier() + RandomIdentifier();
    if (connection) {
        token = connection + '-' + token;
    }
    return token;
}

// As good as 'never'. This will be a problem in 2300.
export static function ExpirationNever() {
    return '2299-12-31T23:59:59Z';
}

export class AuthToken extends BItem {
    constructor() {
        super(CreateToken(CreateToken('Basil'), null, BItemType.SERVICE);
        this.srv = 'Basil';             // Service
        this.exp = ExpirationNever();   // expiration time of this token
        this.sid = undefined;           // serviceId
        this.secret = this.id;          // secret in the token
        this.tokenJSON = undefined;     // JSON version of string token
        this.token = undefined;         // Base64 version of JSON token
        this.randomString = undefined;  // if not a JSON token, the string that is the token
        this.doBuild = true;            // set to 'true' to cause build of token
    }

    Start() {
        // Not much to do yet
    }

    TokenJSON() {
    }

    Token() {
    }

    BuildToken() {
        if (this.doBuild) {
            // If just a random string then use that as the token
            if (this.randomString) {
                this.tokenJSON = undefined;
                this.token = this.randomString;
            }
            else {
                let tok = {};
                if (this.srv) tok.srv = this.srv;
                if (this.exp) tok.exp = this.exp;
                if (this.sid) tok.sid = this.sid;
                if (this.secret) tok.secret = this.secret;
                this.tokenJSON = JSONstringify(tok);
                this.token = Base64.encode(this.tokenJSON);
                
            }
            this.doBuild = false;
        }
    }
}

// Return a new AuthToken instance built from the passed string.
export static function FromString(pTokenString) {
}
