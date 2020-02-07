// Copyright 2020 Robert Adams
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// This is the logic for a simple passthrough web page for viewing
// pages from the Misterblue OARs page (https://misterblue.com/oars/).

// It takes two query parameters 'b' and 'v' where 'b' is the name of
// the OAR file (without the '.oar' suffix) and 'v' is the type of
// image to load. The type is one of "unoptimized", "smallasset", or
// "mergedmaterials". These are actually the names of directories
// where the actual GLTF file and its sub-files are stored.

'use strict';

import { GP } from 'GLOBALS';
import Config from '../config.js';

import { JSONstringify, RandomIdentifier } from '../Utilities.js';

import { Base64 } from 'js-base64';

GGP = GP;   // easy linkage to global context for debugging
GP.Config = Config;

// From https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
// Used to fetch invocation parameters. The request better be well formed as
//     parsing is pretty simplistic and unforgiving.
var ConfigGetQueryVariable = function (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
    return undefined;
};

window.onload = (ev) => {
  CallBasilWithTheFile();
}

var CallBasilWithTheFile = function() {
  let repository = 'https://files.misterblue.com/BasilTest/';

  let baseName = ConfigGetQueryVariable('b');
  let version = ConfigGetQueryVariable('v');
  if (typeof(version) === 'undefined') {
      version = 'unoptimized';
  }

  let GLTFTOLOAD = repository + 'convoar/testtest88/' + version + '/testtest88.gltf';

  if (baseName) {
      GLTFTOLOAD =  repository + 'convoar/' + baseName + '/' + version + '/' + baseName + '.gltf';
  }

  let testConfigParams = {
    'comm': {
      'testmode': true,
      'transport': 'WW',
      'transportURL': './wwtester.js',
      // 'transport': 'WS',
      // 'transportURL': 'ws://192.168.86.41:11440/',
      'service': 'BasilComm',
      'TestAsset': {
        'url': GLTFTOLOAD,
        'loaderType': 'GLTF'
      }
    }
  };

  // console.log('testConfigParams=' + JSONstringify(testConfigParams));

  let configParams = Base64.encode(JSONstringify(testConfigParams));

  window.location = 'Basil.html?c=' + configParams;
}
