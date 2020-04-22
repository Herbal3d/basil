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

import { Controls } from '../Controls/Controls.js';
import { JSONstringify, RandomIdentifier } from '../Utilities.js';
import { ParseOSDXML } from '../llsd.js';
import { LoginResponse_XML } from '../llsdTest.js';

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
        var debugg = document.getElementById('DEBUGG');
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

let GetSelectedValue = function(optionID) {
    let selection = document.getElementById(optionID);
    let selectionValue = selection.options[selection.selectedIndex].value;
    return selectionValue;
}

LoadGridSelection();
LoadTestURLs();
LoadBasilTestURLs();

GP.CO = new Controls();
GP.CO.ShowDebug(true);      // make debug stuff visible

let testConfigParams = {};

GP.CO.ClickableOps['testBasil'] = function() {
    let selectedScene = GetSelectedValue('test-sceneURL');
    testConfigParams = {
        'comm': {
            'testmode': true,
            'transport': 'WW',
            'transportURL': './wwtester.js',
            'service': 'BasilComm',
            'TestAsset': {
                'displayableurl': selectedScene,
                'loaderType': 'GLTF'
            }
        },
        'auth': {
            // Made up numbers for testing
            'SessionKey': 'EntrySession-' + RandomIdentifier(),               // identifier for the session
            'UserAuth': RandomIdentifier() + RandomIdentifier() + RandomIdentifier()  // authorization key
        }
    };
    console.log('testConfigParams=' + JSONstringify(testConfigParams));

    let configParams = Base64.encode(JSONstringify(testConfigParams));

    window.location = 'Basil.html?c=' + configParams;
};
GP.CO.ClickableOps['connectBasilTest'] = function() {
    let basilTestURL = GetSelectedValue('test-basilURL');
    testConfigParams = {
        'comm': {
            'testmode': true,
            'transport': 'WS',
            'transportURL': basilTestURL,
            'service': 'BasilComm'
        },
        'auth': {
            // Made up numbers for testing
            'SessionKey': 'EntrySession-' + RandomIdentifier(),               // identifier for the session
            'UserAuth': RandomIdentifier() + RandomIdentifier() + RandomIdentifier()  // authorization key
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

        let loginURL = document.getElementById('gridLogin-gridURL').value.trim();
        LoginProgress('Start location = ' + startLocation + ', loginURL=' + loginURL);

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
            // resp.global-textures[0].sun_texture_id = UUID
            // resp.global-textures[0].cloud_texture_id = UUID
            // resp.global-textures[0].moon_texture_id = UUID

            OSregion.regionX = resp.region_X;                // integer of region X (ie, 284416)
            OSregion.regionY = resp.region_y;                // integer of region Y (ie, 284416)
            OSregion.regionSizeX = resp.region_size_x;       // integer region size in meters (ie, 256)
            OSregion.regionSizeY = resp.region_size_y;       // integer region size in meters (ie, 256)
            
            OSregion.simIP = resp.sim_ip;                    // IP address of simulator
            OSregion.simPort = resp.sim_port;
            OSregion.httpPort = resp.http_port;
            OSregion.circuitCode = resp.circuit_code;

            OSregion.seedCapability = resp.seed_capability;  // URI of initial CAPS entry
            OSregion.secureSessionId = resp.secure_session_id;   // UUID string
            OSregion.seconds_since_epoch = resp.seconds_since_epoch; // integer region time
            OSregion.mapServerUrl = resp['map-server-url'];     // URL to map server
            LoginProgress('regionResponse=' + JSONstringify(OSregion));

            // Build the encoded auth string that is sent through Basil to the service.
            // Someday this will be a JWT token that comes from the login server.
            let userAuthInfo = {
                'AgentId': OSregion.agentId,
                'SessionID': OSregion.sessionID,
                // Extra stuff added to accomodate OpenSim login
                'SSID': OSregion.secureSessionId,
                'CC': OSregion.circuitCode,
                'FN': OSregion.firstName,
                'LN': OSregion.lastName
            };

            let regionConfigParams = {
                'comm': {
                    'transport': 'WS',
                    'transportURL': 'ws://' + OSregion.simIP + ':11440',
                    'service': 'BasilComm'
                },
                'auth': {
                    // Made up numbers for testing
                    // 'SessionKey': 'EntrySession-' + RandomIdentifier(),               // identifier for the session
                    // 'UserAuth': RandomIdentifier() + RandomIdentifier() + RandomIdentifier()  // authorization key
                    'SessionKey': OSregion.sessionID,           // identifier for the session
                    'UserAuth': Base64.encode(JSON.stringify(userAuthInfo))
                },
                // Extra information added for OpenSimulator login.
                // This passes information to Basil that it can use or not
                'OpenSimulator': {
                    'FN': OSregion.firstName,
                    'LN': OSregion.lastname,
                    'aID': OSregion.agentId,
                    'WM': OSregion.welcomeMessage,
                    'rX': OSregion.regionX,
                    'rY': OSregion.regionY,
                    'MSU': OSregion.mapServerUrl

                }
            };
            // LoginProgress('gridLoginParams=' + JSONstringify(regionConfigParams));
            LoginProgress('gridLogin. URL=' + regionConfigParams.comm.transportURL);

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
        LoginProgress('Login failure: ' + JSONstringify(resp));
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

// Login using XMLRPC raw request (no library or frameworks).
// I tried libraries and porting other JS code. It is easier to just do it myself.
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
                    // LoginProgress('LoginXML2: Login failed: ' + resp.message);
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
            failureCallback(undefined);
        }
    })
    .catch (err => {
        LoginProgress('XMLRPC2: Exception from fetch. err=' + JSONstringify(err));
        console.log('XMLRPC2: Exception from fetch. err=' + JSONstringify(err));
        failureCallback(err);
    });
}


// Log into grid using the WebSocket interface
// This code should work but the OpenSimulator WebSocket implementation needs debugging
// NOTE: this is not debugged!! This does not work!! Here for possible future reference.
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

// Load the grid name selection box with the names from the configuration file.
// Uses the information in Config.Grids.
function LoadGridSelection() {
    if (Config.Grids) {
        let selectNode = document.getElementById('gridLogin-gridName');
        Config.Grids.forEach(grid => {
            let opt = document.createElement('option');
            opt.setAttribute('value', grid.LoginURL);
            opt.appendChild(document.createTextNode(grid.Name));
            if (grid.Selected) {
                opt.setAttribute('selected', '');
                // Put the value of the selected item into the URL text field
                let textField = document.getElementById('gridLogin-gridURL');
                textField.setAttribute('value', grid.LoginURL);
            }
            selectNode.appendChild(opt);
        });
        selectNode.addEventListener('change', GridSelectionChanged);
    }
}

// The grid name field was changed. Update the login URL.
function GridSelectionChanged(evt) {
    let selectedGridURL = GetSelectedValue('gridLogin-gridName');
    let gridURLNode = document.getElementById('gridLogin-gridURL');
    gridURLNode.value = selectedGridURL;
}

// Load the test URLs from Config.TestGLTFFiles
function LoadTestURLs() {
    if (Config.TestGLTFFiles) {
        let selectNode = document.getElementById('test-sceneURL');
        Config.TestGLTFFiles.forEach( testURL => {
            let opt = document.createElement('option');
            opt.setAttribute('value', testURL.URL);
            opt.appendChild(document.createTextNode(testURL.Description));
            selectNode.appendChild(opt);
            if (testURL.Selected) {
                opt.setAttribute('selected', '');
            }
            selectNode.appendChild(opt);
        });
    }
};
// Load the possible BasilTest URLs
function LoadBasilTestURLs() {
    if (Config.BasilTestURLs) {
        let selectNode = document.getElementById('test-basilURL');
        Config.BasilTestURLs.forEach( testURL => {
            let opt = document.createElement('option');
            opt.setAttribute('value', testURL.URL);
            opt.appendChild(document.createTextNode(testURL.Description));
            selectNode.appendChild(opt);
            if (testURL.Selected) {
                opt.setAttribute('selected', '');
            }
            selectNode.appendChild(opt);
        });
    };
};

// ======================================================
// Given a DOM node, remove all its children.
export function EmptyNode(nn) {
    while (nn.firstChild) {
        nn.removeChild(nn.firstChild);
    }
};

// Given a DOM node, empty the node and add the passed text as a text node.
export function SetNodeText(nn, txt) {
    EmptyNode(nn);
    nn.appendChild(document.createTextNode(txt));
};
