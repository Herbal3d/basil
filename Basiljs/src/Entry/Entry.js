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
import { JSONstringify, RandomIdentifier } from '../Utilities.js';

import { createClient, createSecureClient } from 'xmlrpc';
import { MD5 } from '../MD5.js';

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
let GetSelectedValue = function(optionID) {
    let selection = document.getElementById(optionID);
    let selectionValue = selection.options[selection.selectedIndex].value;
    return selectionValue;
}

GP.CO = new Controls();
GP.CO.ClickableOps['testBasil'] = function() {
    let selectedScene = GetSelectedValue('test-sceneURL');
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
    console.log('testConfigParams=' + JSONstringify(testConfigParams));

    let configParams = Base64.encode(JSONstringify(testConfigParams));

    window.location = 'Basil.html?c=' + configParams;
};
GP.CO.ClickableOps['spaceServerConnect'] = function() {
    let regionConfigParams = {
        'comm': {
            'transport': GetSelectedValue('region-transport'),
            'transportURL': GetSelectedValue('region-transportURL'),
            'service': GetSelectedValue('region-service')
        },
        'auth': {
            // Made up numbers for testing
            'SessionKey': 'EntrySession-' + RandomIdentifier(),               // identifier for the session
            'UserAuth': RandomIdentifier() + RandomIdentifier() + RandomIdentifier()  // authorization key
        }
    };
    console.log('gridConfigParams=' + JSONstringify(regionConfigParams));

    // NOTE: not using Utilities:JSONstringify because need to create a legal JSON string
    let configParams = Base64.encode(JSON.stringify(regionConfigParams));

    window.location = 'Basil.html?c=' + configParams;
};

let SentLoginMessage = false;
let SuccessfulLogin = false;
let FailedLogin = false;
GP.CO.ClickableOps['gridLogin'] = function() {
    LoginProgress('Login button pressed');
    SentLoginMessage = false;
    SuccessfulLogin = false;
    FailedLogin = false;

    try {
        let userName = document.getElementById('gridLogin-userName').value.trim();
        let firstname = 'Hippo';
        let lastname = 'Hippo';
        let namePieces = userName.split(' ');
        if (namePieces.length == 2) {
            firstname = namePieces[0];
            lastname = namePieces[1];
        }
        else if (namePieces.length == 1) {
            firstname = namePieces[0];
            lastname = 'Resident';
        }
        else {
            LoginProgress('Login failed: name requires one or two pieces');
            return;
        }

        let password = document.getElementById('gridLogin-userPassword').value.trim();

        let startLocation = document.getElementById('gridLogin-region').value.trim().toLowerCase();
        if (startLocation.length == 0) {
            startLocation = 'last';
        }

        let loginURL = document.getElementById('gridLogin-gridURL').innerHTML.trim();
        let loginName = document.getElementById('gridLogin-gridName').value.trim();
        if (loginName.length > 0 && loginName.startsWith('http')) {
            loginURL = loginName;
        }

        LoginWS(firstname, lastname, password, startLocation, loginURL, resp => {
            LoginProgress('Login success');
            console.log('Login response = ' + JSONstringify(resp));
            // NOTE: not using Utilities:JSONstringify because need to create a legal JSON string
            // let configParams = Base64.encode(JSON.stringify(regionConfigParams));

            // window.location = 'Basil.html?c=' + configParams;
        });
        LoginProgress('Return from Login func.');
    }
    catch (e) {
        LoginProgress('Login fail: exception: ' + e);
        FailedLogin = true;
    }
};

// Used to display login progress in the dialogs.
function LoginProgress(msg, classs) {
    var logPlace = document.querySelector('#gridLogin-progress');
    if (logPlace) {
        var newLine = document.createElement('div');
        newLine.appendChild(document.createTextNode(msg));
        if (classs) {
        newLine.setAttribute('class', classs);
        }
        logPlace.appendChild(newLine);
    }
};

// Log into grid using XMLRPC interface
function LoginXML(firstname, lastname, password, startLocation, loginURL, successCallback) {
    LoginProgress('LoginXML. URL=' + loginURL);
    let theURL = new URL(loginURL);
    // let client = createClient( { 'url': loginURL, 'rejectUnauthorized': 'false' });
    // let client = createClient( { 'url': loginURL, 'rejectUnauthorized': 'false' });
    let client = createClient( {
         'host': theURL.hostname,
         'port': theURL.port,
         'path': theURL.path,
         'rejectUnauthorized': 'false'
    });
    if (client) {
        try {
            let hashedPW = '$1$' + MD5(password);
            LoginProgress('Hashed password=' + hashedPW);
            let loginInfo = [ {
                'first': firstname,
                'last': lastname,
                'passwd': hashedPW,
                'startlocation': startLocation,
                'channel': 'Herbal3d',
                'version': 'Herbal3d 1.0.0.1',
                'platform': 'Linux',
                'mac': '11:22:33:44:55:66',
                'id0': '11:22:33:44:55:66',
                'options': [
                    "login-flags"
                ]
            } ];
            LoginProgress('Before client.methodCall');
            client.methodCall('login_to_simulator', loginInfo, (error, resp) => {
                LoginProgress('methodCall callback');
                if (resp) {
                    if (resp['login'] == 'true') {
                        if (typeof(successCallback) == 'function') {
                            successCallback(resp);
                        }
                    }
                    else {
                        FailedLogin = true;
                        LoginProgress('Login failed: ' + resp.reason);
                    }
                }
                else {
                    LoginProgress('No response body');
                    LoginProgress('No response to login XMLRPC: ' + JSONstringify(error));
                }
            });
            LoginProgress('After client.methodCall');
        }
        catch (e) {
            LoginProgress('Exception logging in:' + e);
            FailedLogin = true;
        }
    }
    else {
        FailedLogin = true;
        LoginProgress('Login failed: could not make WebSocket connection to ' + wsURL);
    }
}

function LoginXML2(firstname, lastname, password, startLocation, loginURL, successCallback) {
    let hashedPW = '$1$' + MD5(password);
    LoginProgress('Hashed password=' + hashedPW);
    let xmlreq = '<?xml version="1.0"?>';
    xmlreq = xmlreq + '<methodCall><methodName>login_to_simulator</methodName>';
    xmlreq = xmlreq + '<params>';
    xmlreq = xmlreq + '<param><value><struct>';
    xmlreq = xmlreq + '<member><name>first</name><value><string>' + firstname + '</string></value></member>';
    xmlreq = xmlreq + '<member><name>last</name><value><string>' + lastname + '</string></value></member>';
    xmlreq = xmlreq + '<member><name>passwd</name><value><string>' + hashedPW + '</string></value></member>';
    xmlreq = xmlreq + '<member><name>startlocation</name><value><string>' + startLocation + '</string></value></member>';
    xmlreq = xmlreq + '<member><name>channel</name><value><string>Herbal3d</string></value></member>';
    xmlreq = xmlreq + '<member><name>version</name><value><string>Herbal3d 1.0.0.1</string></value></member>';
    xmlreq = xmlreq + '<member><name>platform</name><value><string>Linux</string></value></member>';
    xmlreq = xmlreq + '<member><name>mac</name><value><string>11:22:33:44:55:66</string></value></member>';
    xmlreq = xmlreq + '<member><name>id0</name><value><string>11:22:33:44:55:66</string></value></member>';
    xmlreq = xmlreq + '<member><name>options</name><value>';
    xmlreq = xmlreq + '<array><data><value><string>login-flags</string></value></data></array></value></member>';
    xmlreq = xmlreq + '</struct></value></param>';
    xmlreq = xmlreq + '</params>';
    xmlreq = xmlreq + '</methodCall>';
    LoginProgress('LoginXML2: doing fetch from ' + loginURL);
    fetch(loginURL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'text/xml'
        },
        body: xmlreq
    }) 
    .then( data => {
        console.log('XMLRPC: resp=' + JSONstringify(data));
    })
    .catch (err => {
    });
}


// Log into grid using the WebSocket interface
// This code should work but the OpenSimulator WebSocket implementation needs debugging
function LoginWS(firstname, lastname, password, startLocation, loginURL, successCallback) {
    // Mangle LoginURL to make it a websocket url
    let wsURL = '';
    if (loginURL.startsWith('http:')) {
        wsURL = 'ws:' + loginURL.substring(5);
    }
    if (loginURL.startsWith('https:')) {
        wsURL = 'wss:' + loginURL.substring(6);
    }
    if (loginURL.endsWith('/')) {
        wsURL = wsURL.substring(0, wsURL.length-1);
    }
    wsURL += '/WebSocket/GridLogin';

    let hashedPW = '$1$' + MD5(password);
    LoginProgress('LoginWS: Hashed password=' + hashedPW);

    LoginProgress('LoginWS: login url=' + wsURL);
    GP.loginConnection = new WebSocket(wsURL);
    if (GP.loginConnection) {
        GP.loginConnection.addEventListener('message', (event) => {
            LoginProgress('Received login response');
            try {
                console.log('Login response = ' + JSONstringify(event.data));
            }
            catch (e) {
                LoginProgress('Exception getting data:' + e);
            }
        });
        GP.loginConnection.addEventListener('open', (event) => {
            let loginInfo = {
                'firstname': firstname,
                'lastname': lastname,
                'passwd': hashedPW,
                'startlocation': startLocation,
                'channel': 'Herbal3d',
                'version': 'Herbal3d 1.0.0.1',
                'mac': '11:22:33:44:55:66',
                'id0': '11:22:33:44:55:66'
            };
            SentLoginMessage = true;
            GP.loginConnection.send(JSON.stringify(loginInfo));
            LoginProgress('Login messsage sent to ' + wsURL);
        });
        GP.loginConnection.addEventListener('close', (event) => {
            LoginProgress('Connection closed: ' + event.reason);
            GP.loginConnection = null;
        });
        GP.loginConnection.addEventListener('error', (event) => {
            FailedLogin = true;
            LoginProgress('WebSocket open to ' + wsURL + ' failed:' + event);
            GP.loginConnection.close();
        });
    }
    else {
        FailedLogin = true;
        LoginProgress('Login failed: could not make WebSocket connection to ' + wsURL);
    }
}
