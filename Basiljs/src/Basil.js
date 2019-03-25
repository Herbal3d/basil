// @ts-nocheck

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

// Global debugging parameters and variables. "GP.variable"
import GP from 'GP';
import Config from './config.js';
import { BItem, BItemType, BItemState } from './Items/BItem.js';

GGP = GP;   // easy linkage to global context for debugging
GP.Config = Config;

import { Base64 } from 'js-base64';

import { Eventing } from './Eventing/Eventing.js';
import { Graphics } from './Graphics/Graphics.js';
import { Controls } from './Controls/Controls.js';
import { Comm } from './Comm/Comm.js';

// Force the processing of the CSS format file
import './Basiljs.less';

// From https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
// Used to fetch invocation parameters. The request better be well formed as
//     parsing is pretty simplistic and unforgiving.
GP.ConfigGetQueryVariable = function (variable) {
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

// A special instance that displays it's 'Msg' property in the debug window
export class DebugBItem extends BItem {
    constructor() {
        let debugInstanceName = (Config.Debug && Config.Debug.DebugLogInstanceName)
                          ? Config.Debug.DebugLogInstanceName : 'org.basil.b.debug.bitem';
        super(debugInstanceName, undefined);
        this.lastMessage = 'none';
        this.lastErrorMessage = 'none';

        super.DefineProperties( {
            'Msg': {
                'get': function() {
                    return this.lastMessage;
                }.bind(this),
                'set': function(val) {
                    this.lastMessage = val;
                    GP.DebugLog('WORKER: ' + val);
                }.bind(this)
            },
            'ErrorMsg': {
                'get': function() {
                    return this.lastErrorMessage;
                }.bind(this),
                'set': function(val) {
                    this.lastErrorMessage = val;
                    GP.ErrorLog('WORKER: ' + val);
                }.bind(this)
            }
        } );
    }
}

// =====================================================
/* The GP variable is for debugging only. Most of the major components
   have an instance there and reference GP for outputting debug information.
   It is NOT intended to be used for general commuinication between modules.
*/

GP.Ready = false;

// Called with communication configuration parameters in the URL.
// The 'c' parameter is Base64 encoded JSON data which is merged into
//    'Config' thus it can specify any configuration parameter but
//    most commonly has a 'comm' section for setting up the
//    initial connections from this viewer to space servers.
let configParams = GP.ConfigGetQueryVariable('c');
if (typeof(configParams) == 'undefined') {
    // If no communication parameters are given, use testing parameters
    let testConfigParams = {
        'comm': {
            'testmode': true,
            'transportURL': './wwtester.js',
            'transport': 'WW',
            'service': 'SpaceServerClient',
            'TestAsset': {
                'url': '',
                'loaderType': 'GLTF'
            }
        }
    };
    if (Config.WWTester && Config.WWTester.comm) {
        testConfigParams.comm = Config.WWTester.comm;
    }
    configParams = Base64.encode(JSON.stringify(testConfigParams));
}
if (configParams) {
    try {
        let unpacked = Base64.decode(configParams);
        let newParams = JSON.parse(unpacked);
        if (newParams) {
            Object.assign(Config, newParams);    // property merge of unpacked into Config
        }
    }
    catch(e) {
        GP.DebugLog('Basiljs: failed parsing option config: ' + e);
    }
}

// Whether to enable DebugLog writing somewhere
if (Config && Config.page && Config.page.collectDebug) {
    GP.EnableDebugLog = Config.page.collectDebug;
    // This BItem receives remote messages and calls DebugLog
    GP.debugItem = new DebugBItem();
}

// Names of display regions on web page.
let container = document.getElementById(Config.page.webGLcontainerId);
let canvas = document.getElementById(Config.page.webGLcanvasId);

// Create the major component instances (Singletons)
GP.EV = new Eventing();
GP.GR = new Graphics(container, canvas, GP.EV);
GP.CO = new Controls(GP.EV);
GP.CM = new Comm();

// Push the 'Start' button
GP.CO.Start();
GP.GR.Start();
GP.CM.Start();
GP.Ready = true;

// If there are connection parameters, start the first connection
if (Config.comm && Config.comm.transportURL) {
    GP.DebugLog('Basiljs: starting transport and service: ' + JSON.stringify(Config.comm));
    GP.CM.ConnectTransport(Config.comm)
    .then( xport => {
        GP.DebugLog('Basiljs: initial transport connection successful. Id=' + xport.id);

        if (Config.comm.service) {
            GP.CM.ConnectService(xport, Config.comm)
            .then( srv => {
                GP.DebugLog('Basiljs: initial service connection successful. Id=' + srv.id);
                try {
                    let srvParams = {};
                    if (Config.comm.testmode) {
                        // If a test session, pass the test parameters to the service
                        Object.assign(srvParams, {
                            'TestConnection': 'true',
                            'TestURL': Config.comm.TestAsset.url,
                            'TestLoaderType': Config.comm.TestAsset.loaderType
                        });
                    }
                    let auth = Config.comm.auth;
                    srv.OpenSession(auth, srvParams)
                    .then( resp => {
                        GP.DebugLog('Basiljs: Session opened to SpaceServer');
                    })
                    .catch( e => {
                        GP.DebugLog('Basiljs: error from OpenSession: ' + e.message);
                    });
                }
                catch (e) {
                    GP.DebugLog('Basiljs: exception from OpenSession: ' + e);
                }
            })
            .catch( e => {
                GP.DebugLog('Basiljs: failed connecting initial SpaceServer: ' + e.message);
            });
        }
    })
    .catch ( e => {
        GP.DebugLog('Basiljs: failed connecting initial transport: ' + e.message);
    
    });
};
