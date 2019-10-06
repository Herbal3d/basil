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
import { ParseOSDXML } from '../llsd.js';
import { LoginResponse_XML } from '../llsdTest.js';

// import { createClient, createSecureClient } from 'xmlrpc';
import { MD5 } from '../MD5.js';

import { Base64 } from 'js-base64';

GGP = GP;   // easy linkage to global context for debugging
GP.Config = Config;

GP.EnableDebugLog = true;

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
// Temp thingy to test LLSD parser
GP.CO.ClickableOps['testLLSDParser'] = function() {
    var packed = ParseOSDXML(LoginResponse_XML);
    GP.DebugLog('Converted: ' + JSONstringify(packed));
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
        LoginProgress('Start location = ' + startLocation);

        let loginURL = document.getElementById('gridLogin-gridURL').innerHTML.trim();
        let loginName = document.getElementById('gridLogin-gridName').value.trim();
        if (loginName.length > 0 && loginName.startsWith('http')) {
            loginURL = loginName;
        }

        LoginXML2(firstname, lastname, password, startLocation, loginURL,
                                LoginResponseSuccess, LoginResponseFailure);
        LoginProgress('Waiting for login response');
    }
    catch (e) {
        LoginProgress('Login fail: exception: ' + e);
        FailedLogin = true;
    }
};

function LoginResponseSuccess(resp) {
    LoginProgress('Login success');
    // console.log('Login response = ' + JSONstringify(resp));
    return new Promise( function(resolve, reject) {
        try {
            let OSregion = {};
            // resp.look_at = looking at location (as string of LLSD numbers ("[r-0.681,r-0.732,r0]"))
            OSregion.firstName = resp.first_name;
            OSregion.lastName = resp.last_name;
            OSregion.agentId = resp.agent_id;                // agentID as a string UUID
            OSregion.sessionID = resp.session_id;            // Session ID as a string UUID
            OSregion.welcomeMessage = resp.message;          // Welcome message from grid
            console.log('LoginResponseSuccess: first=' + resp.first_name + ' last=' + resp.last_name);
            // resp.global-textures[0].sun_texture_id = UUID
            // resp.global-textures[0].cloud_texture_id = UUID
            // resp.global-textures[0].moon_texture_id = UUID

            OSregion.regionX = resp.region_X;                // integer of region X (ie, 284416)
            OSregion.regionY = resp.region_y;                // integer of region Y (ie, 284416)
            OSregion.regionSizeX = resp.region_size_x;       // integer region size in meters (ie, 256)
            OSregion.regionSizeY = resp.region_size_y;       // integer region size in meters (ie, 256)
            
            OSregion.simIP = resp.sim_ip;                    // IP address of simulator
            // resp.sim_port = region port

            OSregion.seedCapability = resp.seed_capability;  // URI of initial CAPS entry
            OSregion.secureSessionId = resp.secure_session_id;   // UUID string
            OSregion.seconds_since_epoch = resp.seconds_since_epoch; // integer region time
            OSregion.mapServerUrl = resp['map-server-url'];     // URL to map server
            console.log('LoginResponseSuccess: mapUrl=' + OSregion.mapServerUrl);

            LoginProgress('regionResponse=' + JSONstringify(OSregion));

            let regionConfigParams = {
                'comm': {
                    'transport': 'WS',
                    'transportURL': 'ws://' + OSregion.simIP + ':11440',
                    'service': 'SpaceServerClient'
                },
                'auth': {
                    // Made up numbers for testing
                    'SessionKey': 'EntrySession-' + RandomIdentifier(),               // identifier for the session
                    'UserAuth': RandomIdentifier() + RandomIdentifier() + RandomIdentifier()  // authorization key
                }
            };
            LoginProgress('gridLoginParams=' + JSONstringify(regionConfigParams));

            // NOTE: not using Utilities:JSONstringify because need to create a legal JSON string
            let configParams = Base64.encode(JSON.stringify(regionConfigParams));
            SuccessfulLogin = true;

            window.location = 'Basil.html?c=' + configParams;
            resolve();
        }
        catch (e) {
            LoginProgress('LoginResponseSuccess: exception doing login: ' + e);
            FailedLogin = true;
            reject();
        }
    });
}

function LoginResponseFailure(resp) {
    return new Promise( function(resolve, reject) {
        LoginProgress('Login failure: ' + resp.message);
        FailedLogin = true;
        resolve();
    });
}

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

// Log into grid using XMLRPC npm library
/*
function LoginXML(firstname, lastname, password, startLocation, loginURL, successCallback, failureCallback) {
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
                'start': startLocation,
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
*/

// Login using XMLRPC raw request (no library or frameworks)
function LoginXML2(firstname, lastname, password, startLocation, loginURL, successCallback, failureCallback) {
    let hashedPW = '$1$' + MD5(password);
    LoginProgress('LoginXML2: Hashed password=' + hashedPW);
    let xmlreq = [
        '<?xml version="1.0"?>',
        '<methodCall><methodName>login_to_simulator</methodName>',
        '<params>',
        '<param><value><struct>',
        '<member><name>first</name><value><string>' + firstname + '</string></value></member>',
        '<member><name>last</name><value><string>' + lastname + '</string></value></member>',
        '<member><name>passwd</name><value><string>' + hashedPW + '</string></value></member>',
        '<member><name>start</name><value><string>' + startLocation + '</string></value></member>',
        '<member><name>channel</name><value><string>Herbal3d</string></value></member>',
        '<member><name>version</name><value><string>Herbal3d 1.0.0.1</string></value></member>',
        '<member><name>platform</name><value><string>Linux</string></value></member>',
        '<member><name>mac</name><value><string>11:22:33:44:55:66</string></value></member>',
        '<member><name>id0</name><value><string>11:22:33:44:55:66</string></value></member>',
        '<member><name>options</name><value>',
        '<array><data><value><string>login-flags</string></value></data></array></value></member>',
        '</struct></value></param>',
        '</params>',
        '</methodCall>'
    ].join('');
    LoginProgress('LoginXML2: doing fetch from ' + loginURL);
    fetch(loginURL, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'text/xml'
        },
        body: xmlreq
    }) 
    .then( responseObject => {
        // LoginProgress('LoginXML2: responded. status=' + responseObject.status + ', ok=' + responseObject.ok);
        return responseObject.ok ? responseObject.text() : undefined;
    })
    .then( data => {
        // LoginProgress('LoginXML2: data =' + data);
        if (data) {
            var resp = undefined;
            try {
                resp = ParseOSDXML(data);
            }
            catch (e) {
                LoginProgress('LoginXML2: parsing of response failed. Data=' + data);
                resp = undefined;
            }
            if (resp) {
                // LoginProgress('LoginXML2: Login resp= ' + JSONstringify(resp));
                if (resp['login'] === 'true') {
                    if (typeof(successCallback) === 'function') {
                        successCallback(resp)
                        .then( () => { return; } )
                        .catch (err => {
                            LoginProgress('LoginXML2: successCallback catch: ' + JSONstringify(err));
                        });
                    }
                }
                else {
                    LoginProgress('LoginXML2: Login failed: ' + resp.message);
                    if (typeof(failureCallback) === 'function') {
                        failureCallback(resp)
                        .then( () => { return; } )
                        .catch (err => {
                            LoginProgress('LoginXML2: failureCallback catch: ' + JSONstringify(err));
                        });
                    }
                }
            }
        }
        else {
            LoginProgress('No response body');
            LoginProgress('LoginXML2: calling failureCallback 2');
            failureCallback(undefined);
        }
    })
    .catch (err => {
        LoginProgress('XMLRPC2: Exception from fetch. err=' + JSONstringify(err));
        console.log('XMLRPC2: Exception from fetch. err=' + JSONstringify(err));
        LoginProgress('LoginXML2: calling failureCallback 3');
        failureCallback(err);
    });
}


// Log into grid using the WebSocket interface
// This code should work but the OpenSimulator WebSocket implementation needs debugging
function LoginWS(firstname, lastname, password, startLocation, loginURL, successCallback, failureCallback) {
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
                'startLocation': startLocation,
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
