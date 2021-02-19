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

// Highly modified from Vircadia sources. Original copyright:
//   Copyright 2020 Vircadia Contributors
//   Licensed under the Apache License, Version 2.0 (the "License")
'use strict'

import { Config } from '@Base/Config';

interface ALogger {
    info(pMsg: string ): void,
    warn(pMsg: string ): void,
    debug(pMsg: string ): void,
    cdebug(flag: string, pMsg: string ): void,
    error(pMsg: string ): void,
    setLogLevel(level: string ): void
};

export type LogIt = (pMsg:string, pClass?: string) => void;
let LogOutputters: LogIt[] = [];

// This is an initial logger that exists before configuration is complete.
// The later 'initializeLogger' will reset the logger to be to files or whatever.
export let TheLogger: ALogger;

function DoLog(pMsg: string, pClass?: string) {
    LogOutputters.forEach( logg => {
        logg(pMsg, pClass);
    });
};

// Initialize logging by adding the console and debug loggers
export function initLogging() {
    if (Config.Debug.DebugLogToConsole) {
        LogOutputters.push( (pMsg: string, pClass?: string) => {
            if (pClass) {
                /* tslint:disable-next-line */
                console.log(pClass + ": " + pMsg);
            }
            else {
                /* tslint:disable-next-line */
                console.log(pMsg);
            };
        });
    };
    if (Config.page.showDebug) {
        LogOutputters.push( (pMsg: string, pClass?: string) => {
            const debugg = document.querySelector(Config.page.debugElementId);
            if (debugg) {
                const newLine = document.createElement('div');
                newLine.appendChild(document.createTextNode(pMsg));
                if (pClass) {
                    newLine.setAttribute('class', pClass);
                };
                debugg.appendChild(newLine);
                if (debugg.childElementCount > Config.page.debugLogLines) {
                    debugg.removeChild(debugg.firstChild);
                };
            };
        });
    };
};

// Add an aditional log outputter. This is used by WWTester to add message sender.
export function AddLogOutputter(pOutputter: LogIt) {
    LogOutputters.push(pOutputter);
};

let _logLevel = Config.Debug.LogLevel;
export const Logger : ALogger = {
    info: (pMsg: string) => {
        if (_logLevel === 'info') {
            DoLog(pMsg);
        };
    },
    warn: (pMsg: string) => {
        DoLog(pMsg, Config.page.debugErrorClass);
    },
    debug: (pMsg: string) => {
        if (_logLevel === 'debug') {
            DoLog(pMsg);
        };
    },
    // Conditional debug. Looks for "Config.Debug.flag" in configuration.
    cdebug: (pFlag: string, pMsg: string) => {
        if (_logLevel === 'debug') {
            if ((Config.Debug as any)[pFlag]) {
                DoLog(pMsg);
            };
        };
    },
    error: (pMsg: string) => {
        DoLog(pMsg, Config.page.debugErrorClass);
    },
    setLogLevel: (pLevel: string) => {
        const aLevel = pLevel.toLowerCase();
        if ([ 'info', 'warn', 'debug', 'error'].includes(aLevel)) {
            _logLevel = aLevel;
        }
        else {
            Logger.error(`Logger.setLogLevel: unknown level name: ${_logLevel}`);
            Logger.setLogLevel('info');
        };
    }
};
