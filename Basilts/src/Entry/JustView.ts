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

// This is the logic for a simple passthrough web page for viewing
// pages from the Misterblue OARs page (https://misterblue.com/oars/).

// It takes two query parameters 'b' and 'v' where 'b' is the name of
// the OAR file (without the '.oar' suffix) and 'v' is the type of
// image to load. The type is one of "unoptimized", "smallasset", or
// "mergedmaterials". These are actually the names of directories
// where the actual GLTF file and its sub-files are stored.

// If there is a 'd' parameter, the version is not used and the subdir is used
// as the base directory to find the specified basename ("subdir/basename/basename.gltf").

'use strict';

import { JSONstringify, RandomIdentifier } from '@Tools/Utilities';
import { ConfigGetQueryVariable } from '@Base/Config'

window.onload = (ev: Event) => {
  CallBasilWithTheFile();
}

function CallBasilWithTheFile(): void {
  const repository = 'https://files.misterblue.com/BasilTest/';

  const baseName = ConfigGetQueryVariable('b');
  let version = ConfigGetQueryVariable('v');
  const subDir = ConfigGetQueryVariable('d');
  if (typeof(version) === 'undefined') {
      version = 'unoptimized';
  };

  let GLTFTOLOAD = `${repository}convoar/testtest88/${version}/testtest88.gltf`;

  if (typeof(subDir) === 'undefined') {
    if (baseName) {
        GLTFTOLOAD =  `${repository}convoar/${baseName}/${version}/${baseName}.gltf`;
    };
  }
  else {
        // If subDir is specified, the basename is just in that subdir
        GLTFTOLOAD =  `${repository}convoar/${subDir}/${baseName}/${baseName}.gltf`;
  };

    const testConfigParams = {
        'Init': {
            'transport': 'WW',
            'transportURL': './wwtester.js',
            'protocol': 'Basil-JSON',
            'service': 'SpaceServer',
            'serviceAuth': RandomIdentifier() + RandomIdentifier() + RandomIdentifier(),  // authorization key
            'openParams': {
                'assetURL': GLTFTOLOAD,
                'loaderType': 'GLTF',
            }
        }
    };

    // console.log('testConfigParams=' + JSONstringify(testConfigParams));

    const configParams = Buffer.from(JSONstringify(testConfigParams));

    window.location.assign('Basil.html?c=' + configParams.toString('base64'));
}

