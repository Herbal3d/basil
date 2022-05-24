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

import { Config } from '@Entry/EntryConfig';
import { VERSION } from '@Base/VERSION';

import { ClickOpLoginOpenSim } from '@Entry/LoginOpenSim';

import { Buffer } from 'buffer';
import { JSONstringify, RandomIdentifier } from '@Tools/Utilities';
import { Logger, initLogging, LOGLEVEL_INFO, LOGLEVEL_DEBUG } from '@Tools/Logging';

type ClickOperation = ( pTarget: EventTarget ) => void;
const ClickableOps: { [key: string]: ClickOperation } = {};

// Initialize logging to output to the console and to the visible debug messsage area
initLogging(true, true);
Logger.setLogLevel(LOGLEVEL_INFO);
// Logger.setLogLevel(LOGLEVEL_DEBUG);
// CSS starts the debug area hidden. We force it to be visible.
const debugElement = document.getElementById(Config.page.debugElementId.substring(1));
if (debugElement) {
    debugElement.style.visibility = 'visible';
}

// Make all 'class=clickable' page items create events
for (const nn of Array.from(document.getElementsByClassName('clickable'))) {
    Logger.debug(`Adding clickable event listener`);
    nn.addEventListener('click', (evnt: Event) => {
        const buttonOp = (evnt.target as HTMLElement).getAttribute('op');
        Logger.debug(`Click: ${buttonOp}`);
        if (buttonOp && typeof(ClickableOps[buttonOp]) === 'function') {
            ClickableOps[buttonOp](evnt.target);
        }
        else {
            Logger.error(`Click: unknown op ${buttonOp}`);
        };
    });
};

// Put current Basil version info on the bottom of the window
const versionTextNode = document.getElementById('BasilVersion');
versionTextNode.innerText = 'Basil version ' + VERSION['version-tag'];

LoadGridSelection();
LoadTestURLs();
// LoadBasilTestURLs();

ClickableOps['testScene'] = function() {
    const basilTestURL = GetSelectedValue('test-sceneURL');
    const testConfigParams = {
        'Init': {
            'transport': 'WW',
            'transportURL': './wwtester.js',
            'protocol': 'Basil-JSON',
            'service': 'SpaceServer',
            'serviceAuth': RandomIdentifier() + RandomIdentifier() + RandomIdentifier(),  // authorization key
            'openParams': {
                'assetURL': basilTestURL,
                'loaderType': 'GLTF',
            }
        }
    };
    console.log('testConfigParams=' + JSONstringify(testConfigParams));

    const configParams = Buffer.from(JSONstringify(testConfigParams)).toString('base64');

    window.location.assign('Basil.html?c=' + configParams);
};

ClickableOps['gridLogin'] = ClickOpLoginOpenSim;

// Load the grid name selection box with the names from the configuration file.
// Uses the information in Config.Grids.
function LoadGridSelection() {
    if (Config.Grids) {
        const selectNode = document.getElementById('gridLogin-gridName');
        if (selectNode) {
            for (const grid of Config.Grids) {
                const opt = document.createElement('option');
                opt.setAttribute('value', grid.LoginURL);
                opt.appendChild(document.createTextNode(grid.Name));
                if (grid.Selected) {
                    opt.setAttribute('selected', '');
                    // Put the value of the selected item into the URL text field
                    const textField = document.getElementById('gridLogin-gridURL');
                    textField.setAttribute('value', grid.LoginURL);
                };
                selectNode.appendChild(opt);
            };
            selectNode.addEventListener('change', GridSelectionChanged);
        }
        else {
            Logger.error(`LoadTestURLs: could not find element id "gridLogin-gridName"`);
        };
    };
};

// The grid name field was changed. Update the login URL.
function GridSelectionChanged(evt: Event): void {
    const selectedGridURL = GetSelectedValue('gridLogin-gridName');
    const gridURLNode = document.getElementById('gridLogin-gridURL') as HTMLTextAreaElement;
    gridURLNode.value = selectedGridURL;
};

// Load the test URLs from Config.TestGLTFFiles
function LoadTestURLs(): void {
    if (Config.TestGLTFFiles) {
        const selectNode = document.getElementById('test-sceneURL') as HTMLSelectElement;
        if (selectNode) {
            for (const testURL of Config.TestGLTFFiles) {
                const opt = document.createElement('option');
                opt.setAttribute('value', testURL.URL);
                opt.appendChild(document.createTextNode(testURL.Description));
                selectNode.appendChild(opt);
                if (testURL.Selected) {
                    opt.setAttribute('selected', '');
                };
                selectNode.appendChild(opt);
            };
        }
        else {
            Logger.error(`LoadTestURLs: could not find element id "test-sceneURL"`);
        };
    };
};
// Load the possible BasilTest URLs
function LoadBasilTestURLs(): void {
    if (Config.BasilTestURLs) {
        const selectNode = document.getElementById('test-basilURL') as HTMLSelectElement;
        if (selectNode) {
            for (const testURL of Config.BasilTestURLs) {
                const opt = document.createElement('option');
                opt.setAttribute('value', testURL.URL);
                opt.appendChild(document.createTextNode(testURL.Description));
                selectNode.appendChild(opt);
                if (testURL.Selected) {
                    opt.setAttribute('selected', '');
                }
                selectNode.appendChild(opt);
            };
        }
        else {
            Logger.error(`LoadBasilTestURLs: could not find element id "test-basilURL"`);
        };
    };
};

// ======================================================
// Given the ID name of an index HTML element, return the currently selected value
function GetSelectedValue(optionID: string): string {
    let selectionValue = 'UNKNOWN';
    const selection = document.getElementById(optionID) as HTMLSelectElement;
    if (selection) {
        selectionValue = selection.options[selection.selectedIndex].value;
    }
    else {
        Logger.error(`GetSelectedValue: could not find element id ${optionID}`);
    }
    return selectionValue;
}

// Given a DOM node, remove all its children.
export function EmptyNode(nn: HTMLElement): void {
    while (nn.firstChild) {
        nn.removeChild(nn.firstChild);
    }
};

// Given a DOM node, empty the node and add the passed text as a text node.
export function SetNodeText(nn: HTMLElement, txt: string): void {
    EmptyNode(nn);
    nn.appendChild(document.createTextNode(txt));
};

