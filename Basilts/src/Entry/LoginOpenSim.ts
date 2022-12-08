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
import { Buffer } from 'buffer';

import { VERSION } from '@Base/VERSION';

import { JSONstringify } from '@Tools/Utilities';
import { BKeyedCollection } from '@Tools/bTypes';
import { Logger } from '@Tools/Logging';

export let SentLoginMessage = false;
export let SuccessfulLogin = false;
export let FailedLogin = false;

let loginURL = '';
let spaceServerURL = '';

// Request to log into OpenSimulator
// Parameters come from the web page and are packaged into the XMLRCP login request
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
            LoginProgress('Login failed: name requires one or two pieces', 'b-errorMsg');
            return;
        }

        const password = (document.getElementById('gridLogin-userPassword') as HTMLTextAreaElement).value.trim();

        const startLocation = NormalizeStartLocation(
            (document.getElementById('gridLogin-region') as HTMLTextAreaElement).value.trim().toLowerCase());

        loginURL = (document.getElementById('gridLogin-gridURL') as HTMLTextAreaElement).value.trim();
        Logger.info('Start location = ' + startLocation + ', loginURL=' + loginURL);
        spaceServerURL = (document.getElementById('gridLogin-WSURL') as HTMLTextAreaElement).value.trim();
        Logger.info('SpaceServer URL=' + spaceServerURL);

        LoginXML2(firstname, lastname, password, startLocation, loginURL,
                                LoginResponseSuccess, LoginResponseFailure);
        LoginProgress(`Sending XMLRPC login for ${firstname} ${lastname}`);
        Logger.info('Waiting for login response');
        LoginProgress(`Waiting for login response`);
    }
    catch (e) {
        const err = <Error>e;
        Logger.error(`Login fail: exception: ${err.message}`);
        LoginProgress(`Login fail: exception: ${err.message}`, 'b-errorMsg');
        FailedLogin = true;
    }
};

type LoginResponseSuccessCallback = (pResp: BKeyedCollection) => void;
type LoginResponseFailureCallback = (pResp: BKeyedCollection) => void;
function LoginResponseSuccess(resp: BKeyedCollection): void {
    Logger.info('Login success');
    LoginProgress(`Login success`);
    // console.log('Login response = ' + JSONstringify(resp));
    try {
        /*
        const OSregion: BKeyValue = {};
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
        */

        // The URL for the region connection should really come from either the login
        //    response or a query to the grid service. For the moment, we construct
        //    it from a parameter and the returned IP address of the target region.
        let transportURL = spaceServerURL.replace('IP-ADDRESS', resp.sim_ip as string);
        transportURL = transportURL.replace('PORT-ADDRESS', resp.http_port as string);
        Logger.info('transport URL=' + transportURL);

        // Build the encoded auth string that is sent through Basil to the service.
        // Someday this will be a JWT token that comes from the login server.
        const userAuthInfo = {
            'aId': resp.agent_id,
            'sId': resp.session_id,
            // Extra stuff added to accomodate OpenSim login
            'SSID': resp.secure_session_id,
            'CC': resp.circuit_code,
            'FN': resp.first_name,
            'LN': resp.last_name
        };

        const regionConfigParams = {
            'Init': {
                'transport': 'WS',
                'transportURL': transportURL,
                'protocol': 'Basil-JSON',
                'service': 'SpaceServer',
                'clientAuth': resp.secure_session_id,
                'serviceAuth': Buffer.from(JSON.stringify(userAuthInfo)).toString('base64')
            },
            // Extra information added for OpenSimulator login.
            // This passes information to Basil who can use or not
            'OpenSimulator': {
                'FN': resp.first_name,
                'LN': resp.last_name,
                'aID': resp.agent_id,
                'WM': resp.message,
                'rX': resp.region_x,
                'rY': resp.region_y,
                'MSU': resp.mapServerUrl
            }
        };
        // Logger.info('gridLoginParams=' + JSONstringify(regionConfigParams));
        Logger.debug(`gridLogin. URL=${regionConfigParams.Init.transportURL}`);

        SuccessfulLogin = true;

        // NOTE: not using Utilities:JSONstringify because need to create a legal JSON string
        const configParams = Buffer.from(JSON.stringify(regionConfigParams));
        window.location.assign('Basil.html?c=' + configParams.toString('base64'));
    }
    catch (e) {
        const err = <Error>e;
        Logger.debug(`LoginResponseSuccess: exception doing login: ${err.message}`);
        FailedLogin = true;
    };
};

function LoginResponseFailure(resp: BKeyedCollection): void {
    Logger.error('Login failure: ' + JSONstringify(resp));
    LoginProgress(`Login failure: ${resp.message}`);
    FailedLogin = true;
}

// Login using XMLRPC raw request (no library or frameworks).
// I tried libraries and porting other JS code. It is easier to just do it myself.
function LoginXML2(firstname: string, lastname: string, password: string, startLocation: string,
                        loginURL: string,
                        successCallback: LoginResponseSuccessCallback,
                        failureCallback: LoginResponseFailureCallback) {
    const hashedPW = '$1$' + MD5(password);
    // StartLocation is defined to have "&" but XML needs that fixed up
    const fixedStartLocation = startLocation.replace(/&/g, '&amp;');
    // Logger.debug('LoginXML2: Hashed password=' + hashedPW);
    const xmlreq = [
        '<?xml version="1.0"?>',
        '<methodCall><methodName>login_to_simulator</methodName>',
        '<params>',
        '<param><value>',
        '<struct>',
          '<member><name>first</name><value><string>' + firstname + '</string></value></member>',
          '<member><name>last</name><value><string>' + lastname + '</string></value></member>',
          '<member><name>passwd</name><value><string>' + hashedPW + '</string></value></member>',
          '<member><name>start</name><value><string>' + fixedStartLocation + '</string></value></member>',
          '<member><name>channel</name><value><string>Herbal3d</string></value></member>',
          '<member><name>version</name><value><string>' + VERSION['version-tag'] + '</string></value></member>',
          '<member><name>platform</name><value><string>Linux</string></value></member>',
          '<member><name>mac</name><value><string>11:22:33:44:55:66</string></value></member>',
          '<member><name>id0</name><value><string>11:22:33:44:55:66</string></value></member>',
          '<member><name>options</name>',
            '<value>',
              '<array>',
                '<data><value><string>login-flags</string></value></data>',
              '</array>',
            '</value>',
          '</member>',
        '</struct>',
        '</value>',
        '</param>',
        '</params>',
        '</methodCall>'
    ].join('');
    Logger.debug('LoginXML2: doing fetch from ' + loginURL);
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
        Logger.debug(`LoginXML2: responded. status=${responseObject.status}, ok=${responseObject.ok}`);
        return responseObject.ok ? responseObject.text() : undefined;
    })
    .then( data => {
        // Logger.debug(`LoginXML2: data =${data}`);
        if (data) {
            let resp: BKeyedCollection = undefined;
            try {
                resp = <BKeyedCollection>ParseOSDXML(data);
            }
            catch (e) {
                Logger.error(`LoginXML2: parsing of response failed. Data=${data}`);
                resp = undefined;
            }
            if (resp) {
                // Logger.debug('LoginXML2: Login resp= ' + JSONstringify(resp));
                if (resp['login'] === 'true') {
                    if (typeof(successCallback) === 'function') {
                        successCallback(resp)
                    };
                }
                else {
                    // Logger.error('LoginXML2: Login failed: ' + resp.message);
                    if (typeof(failureCallback) === 'function') {
                        failureCallback(resp)
                    };
                };
            };
        }
        else {
            Logger.error('No response body');
            failureCallback(undefined);
        };
    })
    .catch (err => {
        Logger.error('XMLRPC2: Exception from fetch. err=' + JSONstringify(err));
        // console.log('XMLRPC2: Exception from fetch. err=' + JSONstringify(err));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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

// Start location can have may formats:
//      home
//      last
//      regionName/x/y/z
// They all must be normalized into: "home" | "last" | "uri:regionName&x&y&z"
function NormalizeStartLocation(pStart: string): string {
    if (pStart === "home") return pStart;
    if (pStart === "last") return pStart;
    if (pStart.length > 0) {
        const sp = pStart.split('/');
        switch (sp.length) {
            case 1: {   // just region name
                return `uri:${sp[0]}&128&128&0`;
            }
            case 2: {
                return `uri:${sp[0]}&${sp[1]}&128&0`;
            }
            case 3: {
                return `uri:${sp[0]}&${sp[1]}&${sp[2]}&0`;
            }
            case 4: {
                return `uri:${sp[0]}&${sp[1]}&${sp[2]}&${sp[3]}`;
            }
            default: {
                Logger.error(`Start string "${pStart}" did not normalize. Starting in "last"`);
                break;
            }
        }
    }
    return "last";
}

function LoginProgress(pMsg: string, pClass?: string): void {
    const progress = document.getElementById('gridLogin-progress');
    if (progress) {
        const newLine = document.createElement('div');
        newLine.appendChild(document.createTextNode(pMsg));
        if (pClass) {
            newLine.setAttribute('class', pClass);
        };
        progress.appendChild(newLine);
        if (progress.childElementCount > 10) {
            progress.removeChild(progress.firstChild);
        };
    };
}