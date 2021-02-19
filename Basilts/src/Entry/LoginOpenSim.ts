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

import { ParseOSDXML } from '@Tools/llsd.js';
import { MD5 } from '@Tools/MD5.js';

import { Base64 } from 'js-base64';

import { JSONstringify, RandomIdentifier } from '@Tools/Utilities';
import { Logger } from '@Tools/Logging';
import { BKeyedCollection } from '@Tools/bTypes';

let SentLoginMessage = false;
let SuccessfulLogin = false;
let FailedLogin = false;
export let ClickOpLoginOpenSim = function() {
    Logger.info('Login button pressed');
    SentLoginMessage = false;
    SuccessfulLogin = false;
    FailedLogin = false;

    try {
        let userName = (document.getElementById('gridLogin-userName') as HTMLTextAreaElement).value.trim();
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
            Logger.info('Login failed: name requires one or two pieces');
            return;
        }

        let password = (document.getElementById('gridLogin-userPassword') as HTMLTextAreaElement).value.trim();

        let startLocation = (document.getElementById('gridLogin-region') as HTMLTextAreaElement).value.trim().toLowerCase();
        if (startLocation.length == 0) {
            startLocation = 'last';
        }

        let loginURL = (document.getElementById('gridLogin-gridURL') as HTMLTextAreaElement).value.trim();
        Logger.info('Start location = ' + startLocation + ', loginURL=' + loginURL);

        LoginXML2(firstname, lastname, password, startLocation, loginURL,
                                LoginResponseSuccess, LoginResponseFailure);
        Logger.info('Waiting for login response');
    }
    catch (e) {
        Logger.info('Login fail: exception: ' + e);
        FailedLogin = true;
    }
};

type LoginResponseSuccessCallback = (pResp: any) => Promise<void>;
type LoginResponseFailureCallback = (pResp: any) => Promise<void>;
async function LoginResponseSuccess(resp: any): Promise<void> {
    Logger.info('Login success');
    // console.log('Login response = ' + JSONstringify(resp));
    return new Promise( function(resolve, reject) {
        try {
            let OSregion: BKeyedCollection = {};
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
            Logger.info('regionResponse=' + JSONstringify(OSregion));

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
            // Logger.info('gridLoginParams=' + JSONstringify(regionConfigParams));
            Logger.info('gridLogin. URL=' + regionConfigParams.comm.transportURL);

            // NOTE: not using Utilities:JSONstringify because need to create a legal JSON string
            let configParams = Base64.encode(JSON.stringify(regionConfigParams));
            SuccessfulLogin = true;

            window.location.assign('Basil.html?c=' + configParams);
            resolve();
        }
        catch (e) {
            Logger.info('LoginResponseSuccess: exception doing login: ' + e);
            FailedLogin = true;
            reject();
        };
    });
};

function LoginResponseFailure(resp: any): Promise<void> {
    return new Promise( (resolve, reject) => {
        Logger.info('Login failure: ' + JSONstringify(resp));
        FailedLogin = true;
        resolve();
    });
}

// Login using XMLRPC raw request (no library or frameworks).
// I tried libraries and porting other JS code. It is easier to just do it myself.
function LoginXML2(firstname: string, lastname: string, password: string, startLocation: string,
                        loginURL: string,
                        successCallback: LoginResponseSuccessCallback,
                        failureCallback: LoginResponseFailureCallback) {
    let hashedPW = '$1$' + MD5(password);
    Logger.info('LoginXML2: Hashed password=' + hashedPW);
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
    Logger.info('LoginXML2: doing fetch from ' + loginURL);
    fetch(loginURL, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'text/xml',
            'Content-Length': xmlreq.length.toString()
        },
        body: xmlreq
    }) 
    .then( responseObject => {
        // Logger.info('LoginXML2: responded. status=' + responseObject.status + ', ok=' + responseObject.ok);
        return responseObject.ok ? responseObject.text() : undefined;
    })
    .then( data => {
        // Logger.info('LoginXML2: data =' + data);
        if (data) {
            var resp = undefined;
            try {
                resp = ParseOSDXML(data);
            }
            catch (e) {
                Logger.info('LoginXML2: parsing of response failed. Data=' + data);
                resp = undefined;
            }
            if (resp) {
                // Logger.info('LoginXML2: Login resp= ' + JSONstringify(resp));
                if (resp['login'] === 'true') {
                    if (typeof(successCallback) === 'function') {
                        successCallback(resp)
                        .then( () => { return; } )
                        .catch (err => {
                            Logger.info('LoginXML2: successCallback catch: ' + JSONstringify(err));
                        });
                    }
                }
                else {
                    // Logger.info('LoginXML2: Login failed: ' + resp.message);
                    if (typeof(failureCallback) === 'function') {
                        failureCallback(resp)
                        .then( () => { return; } )
                        .catch (err => {
                            Logger.info('LoginXML2: failureCallback catch: ' + JSONstringify(err));
                        });
                    }
                }
            }
        }
        else {
            Logger.info('No response body');
            failureCallback(undefined);
        }
    })
    .catch (err => {
        Logger.info('XMLRPC2: Exception from fetch. err=' + JSONstringify(err));
        console.log('XMLRPC2: Exception from fetch. err=' + JSONstringify(err));
        failureCallback(err);
    });
}


// Log into grid using the WebSocket interface
// This code should work but the OpenSimulator WebSocket implementation needs debugging
// NOTE: this is not debugged!! This does not work!! Here for possible future reference.
function LoginWS(firstname: string, lastname: string, password: string, startLocation: string,
                        loginURL: string,
                        successCallback: LoginResponseSuccessCallback,
                        failureCallback: LoginResponseFailureCallback) {
    let loginConnection: WebSocket;

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
    Logger.info('LoginWS: Hashed password=' + hashedPW);

    Logger.info('LoginWS: login url=' + wsURL);
    loginConnection = new WebSocket(wsURL);
    if (loginConnection) {
        loginConnection.addEventListener('message', (event) => {
            Logger.info('Received login response');
            try {
                console.log('Login response = ' + JSONstringify(event.data));
            }
            catch (e) {
                Logger.info('Exception getting data:' + e);
            }
        });
        loginConnection.addEventListener('open', (event) => {
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
            loginConnection.send(JSON.stringify(loginInfo));
            Logger.info('Login messsage sent to ' + wsURL);
        });
        loginConnection.addEventListener('close', (event) => {
            Logger.info('Connection closed: ' + event.reason);
            loginConnection = null;
        });
        loginConnection.addEventListener('error', (event) => {
            FailedLogin = true;
            Logger.info('WebSocket open to ' + wsURL + ' failed:' + event);
            loginConnection.close();
        });
    }
    else {
        FailedLogin = true;
        Logger.info('Login failed: could not make WebSocket connection to ' + wsURL);
    };
};