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

import { Controls } from '../Controls/Controls.js';

import { Base64 } from 'js-base64';

GGP = GP;   // easy linkage to global context for debugging
GP.Config = Config;

// Force the processing of the css format file
import './Entry.less';

// Global debug information printout.
// Adds a text line to a div and scroll the area
GP.LogMessage = function LogMessage(msg, classs) {
    if (GP.EnableDebugLog) {
        var debugg = document.querySelector('#DEBUGG');
        if (debugg) {
            var newLine = document.createElement('div');
            newLine.appendChild(document.createTextNode(msg));
            if (classs) {
            newLine.setAttribute('class', classs);
            }
            debugg.appendChild(newLine);
            if (debugg.childElementCount > Config.page.debugLogLines) {
                debugg.removeChild(debugg.firstChild);
            }
        }
    }
};
GP.DebugLog = function DebugLog(msg) {
    GP.LogMessage(msg, undefined);
};

GP.ErrorLog = function ErrorLog(msg) {
    GP.LogMessage(msg, 'errorMsg');
};

let testConfigParams = {};
/*
if (Config.WSTester) {
    Object.assign(testConfigParams, Config.WSTester);
}
*/

GP.CO = new Controls();
GP.CO.ClickableOps['launchBasil'] = function() {
    let selectedScene = document.getElementById('sceneURL').innerText;
    testConfigParams = {
        'comm': {
            'testmode': true,
            'transport': 'WW',
            'transportURL': './wwtester.js',
            // 'transport': 'WS',
            // 'transportURL': 'ws://192.168.86.41:11440/',
            'service': 'SpaceServerClient',
            'TestAsset': {
                'url': selectedScene,
                'loaderType': 'GLTF'
            }
        }
    };

    let configParams = Base64.encode(JSON.stringify(testConfigParams));

    window.location = 'Basil.html?c=' + configParams;
};
