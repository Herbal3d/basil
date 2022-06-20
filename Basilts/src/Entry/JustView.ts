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
// This results in the URL "${repository}/${baseName}/${version}/${baseName}.gltf".

// If there is a 'd' parameter, the 'v' type is not used and the subdir is used
// as the base directory to find the specified basename. This results
// in the URL "${repository}/${subDir}/${baseName}/${baseName}.gltf".

// There is also the 'r' parameter which gives the base URL.
// Default is 'https://files.misterblue.com/BasilTest/convoar'.

// This URL is passed to Basil as a test URL to load and display using
// WWTester.

'use strict';

import { Buffer } from 'buffer';
import { JSONstringify, RandomIdentifier } from '@Tools/Utilities';
import { ConfigGetQueryVariable } from '@Base/Config'

window.onload = (ev: Event) => {
    CallBasilWithTheFile();
}

function CallBasilWithTheFile(): void {

    const bn = ConfigGetQueryVariable('b');
    const ver = ConfigGetQueryVariable('v');
    const subDir = ConfigGetQueryVariable('d');
    const repos = ConfigGetQueryVariable('r');

    const baseName = bn ?? 'testtest88';
    const version = ver ?? 'unoptimized';
    const repository = repos ?? 'https://files.misterblue.com/BasilTest/convoar';

    let GLTFTOLOAD = `${repository}/testtest88/${version}/testtest88.gltf`;

    if (typeof(subDir) === 'undefined') {
        // was passed "?b=BASENAME&v=VERSION"
        GLTFTOLOAD =  `${repository}/${baseName}/${version}/${baseName}.gltf`;
    }
    else {
        // was passed "?b=BASENAME&d=SUBDIR"
        GLTFTOLOAD =  `${repository}/${subDir}/${baseName}/${baseName}.gltf`;
    };

    const testConfigParams = {
        'Init': {
            'transport': 'WW',
            'transportURL': './wwtester.js',
            'protocol': 'Basil-JSON',
            'service': 'SpaceServer',
            'serviceAuth': RandomIdentifier(),  // authorization key
            'openParams': {
                'assetURL': GLTFTOLOAD,
                'loaderType': 'GLTF',
                'display': 'status'
            }
        }
    };

    // console.log('testConfigParams=' + JSONstringify(testConfigParams));

    const configParams = Buffer.from(JSONstringify(testConfigParams));

    window.location.assign('./Basil.html?c=' + configParams.toString('base64'));
}

