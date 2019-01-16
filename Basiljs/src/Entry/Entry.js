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

import GP from 'GP';
import Config from '../config.js';
import { Base64 } from 'js-base64';

GGP = GP;   // easy linkage to global context for debugging
GP.Config = Config;

// Force the processing of the css format file
import './Entry.less';

let testConfigParams = {};
if (Config.WSTester) {
    Object.assign(testConfigParams, Config.WSTester);
}
/*
let testConfigParams = {
    'comm': {
        'testmode': true,
        'transport': 'WS',
        'transportURL': 'ws://192.168.86.41:11440/',
        'service': 'SpaceServerClient',
        'testURL': 'http://files.misterblue.com/BasilTest/convoar/testtest88/unoptimized/testtest88.gltf',
        'testLoaderType': 'GLTF'
    }
};
*/
let configParams = Base64.encode(JSON.stringify(testConfigParams));

window.location = 'Basil.html?c=' + configParams;


