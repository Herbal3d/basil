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

export let SentLoginMessage = false;
export let SuccessfulLogin = false;
export let FailedLogin = false;
export const ClickOpLoginOpenSim = function() {
    Logger.info('Login button pressed');
    SentLoginMessage = false;
    SuccessfulLogin = false;
    FailedLogin = false;

    try {
        const userName = (document.getElementById('gridLogin-userName') as HTMLTextAreaElement).value.trim();
        let firstname = 'Hippo';
        let lastname = 'Hippo';
        const namePieces = userName.split(' ');
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

        const password = (document.getElementById('gridLogin-userPassword') as HTMLTextAreaElement).value.trim();

        let startLocation = (document.getElementById('gridLogin-region') as HTMLTextAreaElement).value.trim().toLowerCase();
        if (startLocation.length == 0) {
            startLocation = 'last';
        }

        const loginURL = (document.getElementById('gridLogin-gridURL') as HTMLTextAreaElement).value.trim();
        Logger.info('Start location = ' + startLocation + ', loginURL=' + loginURL);

        LoginXML2(firstname, lastname, password, startLocation, loginURL,
                                LoginResponseSuccess, LoginResponseFailure);
        Logger.info('Waiting for login response');
    }
    catch (e) {
        const err = <Error>e;
        Logger.info(`Login fail: exception: ${err.message}`);
        FailedLogin = true;
    }
};

type LoginResponseSuccessCallback = (pResp: BKeyedCollection) => void;
type LoginResponseFailureCallback = (pResp: BKeyedCollection) => void;
function LoginResponseSuccess(resp: BKeyedCollection): void {
    Logger.info('Login success');
    // console.log('Login response = ' + JSONstringify(resp));
    try {
        const OSregion: BKeyedCollection = {};
        // resp.look_at = looking at location (as string of LLSD numbers ("[r-0.681,r-0.732,r0]"))
        OSregion['firstName'] = resp.first_name;
        OSregion['lastName'] = resp.last_name;
        OSregion['agentId'] = resp.agent_id;                // agentID as a string UUID
        OSregion['sessionID'] = resp.session_id;            // Session ID as a string UUID
        OSregion['welcomeMessage'] = resp.message;          // Welcome message from grid
        // resp.global-textures[0].sun_texture_id = UUID
        // resp.global-textures[0].cloud_texture_id = UUID
        // resp.global-textures[0].moon_texture_id = UUID

        OSregion['regionX'] = resp.region_X;                // integer of region X (ie, 284416)
        OSregion['regionY'] = resp.region_y;                // integer of region Y (ie, 284416)
        OSregion['regionSizeX'] = resp.region_size_x;       // integer region size in meters (ie, 256)
        OSregion['regionSizeY'] = resp.region_size_y;       // integer region size in meters (ie, 256)
        
        OSregion['simIP'] = resp.sim_ip;                    // IP address of simulator
        OSregion['simPort'] = resp.sim_port;
        OSregion['httpPort'] = resp.http_port;
        OSregion['circuitCode'] = resp.circuit_code;

        OSregion['seedCapability'] = resp.seed_capability;  // URI of initial CAPS entry
        OSregion['secureSessionId'] = resp.secure_session_id;   // UUID string
        OSregion['seconds_since_epoch'] = resp.seconds_since_epoch; // integer region time
        OSregion['mapServerUrl'] = resp['map-server-url'];     // URL to map server
        Logger.info('regionResponse=' + JSONstringify(OSregion));

        // Build the encoded auth string that is sent through Basil to the service.
        // Someday this will be a JWT token that comes from the login server.
        const userAuthInfo = {
            'AgentId': OSregion.agentId,
            'SessionID': OSregion.sessionID,
            // Extra stuff added to accomodate OpenSim login
            'SSID': OSregion.secureSessionId,
            'CC': OSregion.circuitCode,
            'FN': OSregion.firstName,
            'LN': OSregion.lastName
        };

        const regionConfigParams = {
            'Init': {
                'Transport': 'WW',
                'TransportURL': './wwtester.js',
                'Protocol': 'Basil-JSON',
                'Service': 'SpaceServer',
                'ServiceAuth': Base64.encode(JSON.stringify(userAuthInfo))
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
        Logger.info(`gridLogin. URL=${regionConfigParams.Init.TransportURL}`);

        // NOTE: not using Utilities:JSONstringify because need to create a legal JSON string
        const configParams = Base64.encode(JSON.stringify(regionConfigParams));
        SuccessfulLogin = true;

        window.location.assign('Basil.html?c=' + configParams);
    }
    catch (e) {
        const err = <Error>e;
        Logger.info(`LoginResponseSuccess: exception doing login: ${err.message}`);
        FailedLogin = true;
    };
};

function LoginResponseFailure(resp: BKeyedCollection): void {
    Logger.info('Login failure: ' + JSONstringify(resp));
    FailedLogin = true;
}

// Login using XMLRPC raw request (no library or frameworks).
// I tried libraries and porting other JS code. It is easier to just do it myself.
function LoginXML2(firstname: string, lastname: string, password: string, startLocation: string,
                        loginURL: string,
                        successCallback: LoginResponseSuccessCallback,
                        failureCallback: LoginResponseFailureCallback) {
    const hashedPW = '$1$' + MD5(password);
    Logger.info('LoginXML2: Hashed password=' + hashedPW);
    const xmlreq = [
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
            let resp: BKeyedCollection = undefined;
            try {
                resp = <BKeyedCollection>ParseOSDXML(data);
            }
            catch (e) {
                Logger.info(`LoginXML2: parsing of response failed. Data=${data}`);
                resp = undefined;
            }
            if (resp) {
                // Logger.info('LoginXML2: Login resp= ' + JSONstringify(resp));
                if (resp['login'] === 'true') {
                    if (typeof(successCallback) === 'function') {
                        successCallback(resp)
                    };
                }
                else {
                    // Logger.info('LoginXML2: Login failed: ' + resp.message);
                    if (typeof(failureCallback) === 'function') {
                        failureCallback(resp)
                    };
                };
            };
        }
        else {
            Logger.info('No response body');
            failureCallback(undefined);
        };
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

    const hashedPW = '$1$' + MD5(password);
    Logger.info('LoginWS: Hashed password=' + hashedPW);

    Logger.info('LoginWS: login url=' + wsURL);
    loginConnection = new WebSocket(wsURL);
    if (loginConnection) {
        loginConnection.addEventListener('message', (event: MessageEvent) => {
            Logger.info('Received login response');
            try {
                console.log('Login response = ' + JSONstringify(event.data));
            }
            catch (e) {
                const err = <Error>e;
                Logger.info(`Exception getting data: ${err.message}`);
            }
        });
        // When connection opened, send the login packet
        loginConnection.addEventListener('open', (event: Event) => {
            const loginInfo = {
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
            Logger.info(`Login messsage sent to ${wsURL}`);
        });
        // TODO: should anything be done when this login connection closes?
        loginConnection.addEventListener('close', (event: CloseEvent) => {
            Logger.info(`Connection closed: ${event.reason}`);
            loginConnection = null;
        });
        loginConnection.addEventListener('error', (event: ErrorEvent) => {
            FailedLogin = true;
            Logger.info(`WebSocket open to ${wsURL} failed: ${event.message}`);
            loginConnection.close();
        });
    }
    else {
        FailedLogin = true;
        Logger.info('Login failed: could not make WebSocket connection to ' + wsURL);
    };
};