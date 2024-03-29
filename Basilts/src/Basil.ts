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

// Global debugging parameters and variables. "GP.variable"
// Even though the IDE says this is not referenced, it is so don't delete it.
import { GlobalReady } from '@Base/Globals';

import { Config, initConfig, ConfigGetQueryVariable } from '@Base/Config';
import { VERSION } from '@Base/VERSION';

import { Comm } from '@Comm/Comm';
import { OpenSessionReqProps } from '@Comm/BMessageProps';
import { Eventing } from '@Eventing/Eventing';
import { Graphics } from '@Graphics/Graphics';
import { UI } from '@Tools/UI';
import { AuthToken } from '@Tools/Auth';
import { CreateInfrastructureBItems } from '@BItem/WellKnownBItems';
import { initAbilities } from '@Abilities/AbilityMgt';

import { Buffer } from 'buffer';
import { IsNullOrEmpty, IsNotNullOrEmpty } from '@Tools/Misc';
import { ExtractStringError, JSONstringify } from '@Tools/Utilities';
import { BKeyedCollection } from '@Tools/bTypes';
import { initLogging, Logger } from '@Tools/Logging';
import { BasilConnection } from './Comm/BasilConnection';

// Function to place the software version numbers at the bottom of the screen
function advertizeVersion(pExtra?: string): void {
    const versionTextNode = document.getElementById(Config.page.versionElementId);
    if (versionTextNode) {
        versionTextNode.innerText = 'Basil version ' + VERSION['version-tag'] + '     ' + (pExtra ?? '');
    }
}

initConfig();
initLogging();      // Setup logging so progress and errors will be seen
Eventing.init();
initAbilities(false);
UI.init();

// Names of display regions on web page.
const container = document.getElementById(Config.page.webGLcontainerId);
const canvas = document.getElementById(Config.page.webGLcanvasId) as HTMLCanvasElement;

// Get the graphics system running
Graphics.connectGraphics(container, canvas);
Graphics.Start();

// Put current Basil version info on the bottom of the window
advertizeVersion();

// Create BItems that coorespond to the input and output devices, etc
CreateInfrastructureBItems();

// Called with communication configuration parameters in the URL.
// The 'c' parameter is Base64 encoded JSON data which is merged into
//    'Config' thus it can specify any configuration parameter but
//    most commonly has a 'comm' section for setting up the
//    initial connections from this viewer to space servers.
let configParams = ConfigGetQueryVariable('c');
if (IsNullOrEmpty(configParams)) {
    // If no communication parameters are given, use testing parameters
    const testConfigParams: BKeyedCollection = {};
    // If there are parameters for testing, use them
    if (Config.WWTester && Config.WWTester.initialMakeConnection) {
        testConfigParams.Init = Config.WWTester.initialMakeConnection;
    }
    configParams = Buffer.from(JSON.stringify(testConfigParams)).toString('base64');
};

// Hack to cause the various iframes to get properly sized
setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
}, 3000);

// Parse the passed configuration parameters and add to Config
if (IsNotNullOrEmpty(configParams)) {
    try {
        const unpacked = Buffer.from(configParams, 'base64').toString();
        const newParams = (JSON.parse(unpacked) as BKeyedCollection);
        Logger.debug(`Basilts: newParams: ${unpacked}`);
        if (IsNotNullOrEmpty(newParams)) {
            // Could do this assign but then the caller could change any configuration param.
            // Only the 'initialMakeConnection' parameter is passed in for more security.
            // deepmerge(Config, newParams);    // property merge of unpacked into Config
            // @ts-ignore
            Config.initialMakeConnection = newParams['Init'];

            // There are additional sections that might be passed depending on system logging in
            //    For instance, "OpenSimulator" is passed with user info for that system.
            // Note that this only adds new sections so existing configuration can't be overlayed.
            for (const section of Config.basil.KnownConfigurationSections.split(',')) {
                if (newParams.hasOwnProperty(section)) {
                    if (!Config.hasOwnProperty(section)) {
                        (Config as BKeyedCollection)[section] = newParams[section];
                    }
                    else {
                        Logger.error(`Basilts: Cannot assign existing section with passed invocation parameters.`);
                        Logger.error(`Basilts:  Attempted section = ${section}`);
                    };
                };
            };
        };
    }
    catch(e) {
        const se = <SyntaxError>e;
        Logger.debug(`Basilts: failed parsing option config: ${se.message}`);
    };
};

// If the window gets closed, send a CloseSession to try and logout or whatever.
window.onbeforeunload = function() {
    if (firstConnection) {
        void firstConnection.CloseSession("User closed window");
    }
};

// DEBUG DEBUG: Add pointer to graphics stuff for debugging in the browser
// @ts-ignore
(globalThis as BKeyedCollection).GGP.Graphics = Graphics;

// TypeScript issue https://github.com/microsoft/TypeScript/issues/41628
// @ts-ignore
GlobalReady = true;

Logger.info(`Starting Basil version ${VERSION['version-tag']}`);

// Keep a handle on the first connection
let firstConnection: BasilConnection
;
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
    try {
        if (Config.initialMakeConnection) {
            Logger.debug('Basilts: starting transport and service: ' + JSONstringify(Config.initialMakeConnection));
            // Connect to the server
            const conn = await Comm.MakeConnection(Config.initialMakeConnection)
            firstConnection = conn;

            // Update in and out authorizations to use in the connection
            // This includes service login information
            conn.OutgoingAuth = new AuthToken(Config.initialMakeConnection.serviceAuth);
            conn.OutgoingAddr = Config.initialMakeConnection.serviceAddr;

            // Build OpenSession request
            const sessionParams: OpenSessionReqProps = {
                basilVersion: VERSION['version-tag'],
                clientAuth: conn.IncomingAuth.token
            };
            // Optionally add routing address for the client if transport needs it
            const clientAddr = conn.GetMyRoutingAddress();
            if (clientAddr) {
                sessionParams.clientAddr = clientAddr;
            };
            // The original caller can pass test URL and Loader parameters that
            //      this passed to the session. This is for testing using the WebWorker
            if (Config.initialMakeConnection.openParams) {
                sessionParams.testAssetURL = Config.initialMakeConnection.openParams.assetURL;
                sessionParams.testAssetLoader = Config.initialMakeConnection.openParams.loaderType;
                sessionParams.testAssetDisplay = Config.initialMakeConnection.openParams.display ?? 'none';
            }

            // Start the displayed session
            const resp2 = await conn.OpenSession(sessionParams)

            // The OpenSession response includes the authorization for us talking to the service
            conn.OutgoingAuth = new AuthToken(resp2.IProps['serverAuth'] as string);

            advertizeVersion(`Server version: ${resp2.IProps['serverVersion']}`);
            Logger.debug(`Basilts: session is opened. Server version: ${resp2.IProps['serverVersion']}`);
            // Logger.debug(`     in=${conn.IncomingAuth.token}, out=${conn.OutgoingAuth.token}`);
        }
    }
    catch ( e ) {
        // TODO: if this fails, there should be a popup dialog to report the error
        const err = ExtractStringError(e);
        Logger.debug(`Basilts: OpenSession failed: ${err}`);
    };
})();