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

import { Config } from '@Base/Config';
import { AddTestObject } from '@Graphics/GraphicOps';
import { Eventing } from '@Eventing/Eventing';

import { SubscriptionEntry } from '@Base/Eventing/SubscriptionEntry';
import { BVector3, BVector4 } from '@Tools/bTypes';
import { Logger } from '@Tools/Logging';
import { CameraInfoEventTopic, CameraInfoEventProps, RenderInfoEventTopic, RenderInfoEventProps } from '@Base/Graphics/Graphics';
import { JSONstringify } from './Utilities';

type ClickOperation = ( pTarget: EventTarget ) => void;
const ClickableOps: { [key: string]: ClickOperation } = {};

export const UI = {
    init() {
        // Make all 'class=b-clickable' page items create events
        Array.from(document.getElementsByClassName('b-clickable')).forEach( nn => {
            nn.addEventListener('click', (evnt: Event) => {
                const buttonOp = (evnt.target as HTMLElement).getAttribute('op');
                if (buttonOp && typeof(ClickableOps[buttonOp]) === 'function') {
                    ClickableOps[buttonOp](evnt.target);
                };
            });
        });
        renderStatsUpdate();
        cameraPositionUpdate();

        // Whether debug output window is initially displayed can be set in the configuration file
        UI.ShowDebug(Config.page.showDebug);
    },
    // Call to set debug window to specified state. Pass state that is should be in
    ShowDebug(pOnOff: boolean) {
        const debugElement = document.getElementById(Config.page.debugElementId);
        if (debugElement) {
            if (pOnOff) {   // want it on
                // const showMS = Config.page.DebugShowMS ? Config.page.DebugShowMS : 800;
                debugElement.style.visibility = 'visible';
            }
            else {
                // const hideMS = Config.page.DebugHideMS ? Config.page.DebugHideMS : 400;
                debugElement.style.visibility = 'hidden';
            }
        }
    },
};

ClickableOps['showDebug'] = function() {
    UI.ShowDebug(!(document.getElementById(Config.page.debugElementId).style.visibility !== 'hidden'));
};
ClickableOps['addTestObject'] = function() {
    AddTestObject();
};

// ======================================================
// UI structure for displaying XYZ coordinates
// Create instance with the '#ID' of the containing HTML element
// Call 'Update' to update the values.
export class UI_Coord {
    _areaID: string;
    _areaIDnode: HTMLElement;

    constructor(areaID: string) {
        this._areaID = areaID;
        this._areaIDnode = document.querySelector(areaID);
        if (this._areaIDnode) {
            EmptyNode(this._areaIDnode);
            // Logger.debug('Created UI_Coord element for ' + areaID);
        }
        else {
            Logger.debug('Did not create UI_Coord element because ' + areaID + ' not in document');
        };
    };

    // Update with three coordinates or one parameter that has a .x, .y, and .z
    Update(xx: number | number[] | BVector3, yy?: number, zz?: number) {
        let fxx = 0;
        let fyy = 0;
        let fzz = 0;
        if (this._areaIDnode) {
            if (xx.hasOwnProperty('x')) {
                const xxx = <BVector3>(xx as unknown);
                fxx = xxx.x; fyy = xxx.y; fzz = xxx.z;
            }
            else {
                if (Array.isArray(xx)) {
                    fxx = xx[0]; fyy = xx[1]; fzz = xx[2];
                }
                else {
                    fxx = (xx as number); fyy = yy; fzz = zz;
                };
            };
            SetNodeText(this._areaIDnode, `[${fxx.toFixed(2)},${fyy.toFixed(2)},${fzz.toFixed(2)}]`);
        }
        else {
            Logger.debug('Did not update UI_Coord element because no areaID');
        };
    };
};

// ======================================================
// UI structure for displaying a quaterion.
// Create instance with the '#ID' of the containing HTML element
// Call 'Update' to update the values.
export class UI_Quat {
    _areaID: string;
    _areaIDnode: HTMLElement;
    constructor(areaID: string) {
      this._areaID = areaID;
      this._areaIDnode = document.querySelector(areaID);
        if (this._areaIDnode) {
            EmptyNode(this._areaIDnode);
        }
        else {
            Logger.debug(`Did not create UI_Quat element because ${areaID} not in document`);
        }
    }

    // Update with four values or one value with a .x, .y, .z and .w
    Update(xx:number | number[] | BVector4, yy?:number, zz?:number, ww?:number) {
        let fxx = 0;
        let fyy = 0;
        let fzz = 0;
        let fww = 0;
        if (this._areaIDnode) {
            if (xx.hasOwnProperty('x')) {
                const xxx = <BVector4>(xx as unknown);
                fxx = xxx.x; fyy = xxx.y; fzz = xxx.z; fww = xxx.w;
            }
            else {
                if (Array.isArray(xx)) {
                    fxx = xx[0]; fyy = xx[1]; fzz = xx[2]; fww = xx[3];
                }
                else {
                    fxx = (xx as number); fyy = yy; fzz = zz; fww = ww;
                };
            };
            SetNodeText(this._areaIDnode, `[${fxx.toFixed(2)},${fyy.toFixed(2)},${fzz.toFixed(2)},${ww.toFixed(2)}]`);
        }
        else {
            Logger.debug('Did not update UI_Coord element because no areaID');
        }
    }
};

// ======================================================
// UI structure for displaying text.
// Create instance with the '#ID' of the containing HTML element
// Call 'Update' to update the values.
export class UI_Text {
    _areaID: string;
    _areaIDnode: HTMLElement;
    constructor(areaID: string) {
        this._areaID = areaID;
        this._areaIDnode = document.querySelector(areaID);
        if (this._areaIDnode) {
            EmptyNode(this._areaIDnode);
            // Logger.debug('Created UI_Text element for ' + areaID);
        }
        else {
            Logger.debug('Did not create UI_Text element because ' + areaID + ' not in document');
        };
    };

    Update(txt: string | number) {
        if (this._areaIDnode) {
          SetNodeText(this._areaIDnode, String(txt));
        }
        else {
            Logger.debug('Did not update UI_Text element because no areaID');
        }
    };
};

// ======================================================
// Given a DOM node, remove all its children.
export function EmptyNode(nn: HTMLElement) {
    while (nn.firstChild) {
        nn.removeChild(nn.firstChild);
    }
};

// Given a DOM node, empty the node and add the passed text as a text node.
export function SetNodeText(nn: HTMLElement, txt: string) {
    EmptyNode(nn);
    nn.appendChild(document.createTextNode(txt));
};

let _eventCameraInfo: SubscriptionEntry;
let _infoCameraCoord: UI_Coord;

// Update the camera position for debugging
function cameraPositionUpdate() {
    _infoCameraCoord = new UI_Coord('div[b-info=camPosition]');
    if (_infoCameraCoord) {
        // @ts-ignore
        _eventCameraInfo = Eventing.Subscribe(CameraInfoEventTopic, (camInfo: CameraInfoEventProps) => {
            if (camInfo && camInfo.position && _infoCameraCoord) {
                _infoCameraCoord.Update(camInfo.position);
            };
        });
    };
};

export let _eventDisplayInfo: SubscriptionEntry;
export let _infoFPS: UI_Text;
export let _infoDrawCalls: UI_Text;
export let _infoTriangles: UI_Text;
export let _infoLines: UI_Text;
export let _infoPoints: UI_Text;
export let _infoTextureMem: UI_Text;
export let _infoGeometryMem: UI_Text;

    // UPdate the renderer info
function renderStatsUpdate() {
    _infoFPS = new UI_Text('div[b-info=infoFPS]');
    _infoDrawCalls = new UI_Text('div[b-info=infoDrawCalls]');
    _infoTriangles = new UI_Text('div[b-info=infoTriangles]');
    _infoLines = new UI_Text('div[b-info=infoLines]');
    // _infoPoints = new UI_Text('div[b-info=infoPoints]');
    _infoTextureMem = new UI_Text('div[b-info=infoTextureMem]');
    _infoGeometryMem = new UI_Text('div[b-info=infoGeometryMem]');
    if (_infoDrawCalls) {
        // @ts-ignore
        _eventDisplayInfo = Eventing.Subscribe(RenderInfoEventTopic, (info: RenderInfoEventProps) => {
            if (info && info.render && _infoDrawCalls) {
                _infoFPS.Update(Math.round(info.fps));
                _infoDrawCalls.Update(info.render.calls);
                _infoTriangles.Update(info.render.triangles);
                _infoLines.Update(info.render.lines);
                // _infoPoints.Update(info.render.points);
            };
            if (info && info.memory && _infoTextureMem) {
                _infoTextureMem.Update(info.memory.textures);
                _infoGeometryMem.Update(info.memory.geometries);
            };
        });
    };
};