// Copyright 2022 Robert Adams
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { SubscriptionEntry } from '@Base/Eventing/SubscriptionEntry';
import { RenderInfoEventProps } from '@Graphics/Graphics';
import { CameraInfoEventProps } from '@Graphics/Graphics';
import { BVector3, BVector4 } from '@Tools/bTypes';

const BItems = window.BItems;
const Eventing = window.Eventing;
const Logger = window.Logger;

Logger.debug(`status.js entered`);

window.onload = function() {
    _initilize();
};

// ======================================================
// Given a DOM node, remove all its children.
function EmptyNode(nn: HTMLElement) {
    while (nn.firstChild) {
        nn.removeChild(nn.firstChild);
    }
};

// Given a DOM node, empty the node and add the passed text as a text node.
function SetNodeText(nn: HTMLElement, txt: string) {
    EmptyNode(nn);
    nn.appendChild(document.createTextNode(txt));
};

// ======================================================
// UI structure for displaying XYZ coordinates
// Create instance with the '#ID' of the containing HTML element
// Call 'Update' to update the values.
class UI_Coord {
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

function DumpDocument(pChildren: HTMLCollection, pIndent?: string) {
    const indent = pIndent ?? '  ';
    for (let i = 0; i < pChildren.length; i++) {
        const pChild = pChildren[i];
        Logger.debug(`${indent}${i}: ${pChild.nodeName}`);
        if (pChild.hasChildNodes()) {
            DumpDocument(pChild.children, indent + '  ');
        }
    };
}

// ======================================================
// UI structure for displaying a quaterion.
// Create instance with the '#ID' of the containing HTML element
// Call 'Update' to update the values.
class UI_Quat {
    _areaID: string;
    _areaIDnode: HTMLElement;
    constructor(areaID: string) {
        this._areaID = areaID;
        this._areaIDnode = document.querySelector(areaID);
        if (this._areaIDnode) {
            EmptyNode(this._areaIDnode);
            // Logger.debug('Created UI_Quat element for ' + areaID);
        }
        else {
            Logger.debug(`Did not create UI_Quat element because ${areaID} not in document`);
            // DumpDocument(document.children);
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
class UI_Text {
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
            // DumpDocument(document.children);
        };
    };

    Update(txt: string | number) {
        if (this._areaIDnode) {
          SetNodeText(this._areaIDnode, String(txt));
        }
        else {
            Logger.debug(`Did not update UI_Text element because no areaID for ${this._areaID}`);
        }
    };
};

let _infoFPS: UI_Text;
let _infoDrawCalls: UI_Text;
let _infoTriangles: UI_Text;
let _infoLines: UI_Text;
// let _infoPoints: UI_Text;
// let _infoTextureMem: UI_Text;
// let _infoGeometryMem: UI_Text;

let _eventDisplayInfo: SubscriptionEntry = undefined;

let _infoCameraCoord: UI_Coord;
let _eventCameraInfo: SubscriptionEntry;

const _initilize = function() {
    _infoFPS = new UI_Text('div[b-info=infoFPS]');
    _infoDrawCalls = new UI_Text('div[b-info=infoDrawCalls]');
    _infoTriangles = new UI_Text('div[b-info=infoTriangles]');
    _infoLines = new UI_Text('div[b-info=infoLines]');
    // _infoPoints = new UI_Text('div[b-info=infoPoints]');
    // _infoTextureMem = new UI_Text('div[b-info=infoTextureMem]');
    // _infoGeometryMem = new UI_Text('div[b-info=infoGeometryMem]');

    // @ts-ignore
    _eventDisplayInfo = Eventing.Subscribe('Graphics.RenderInfo', _processRenderInfo);

    _infoCameraCoord = new UI_Coord('div[b-info=camPosition]');
    // @ts-ignore
    _eventCameraInfo = Eventing.Subscribe('Graphics.CameraInfo', _processCameraInfo);
}

const _processRenderInfo = function(info: RenderInfoEventProps) {
    if (info && info.render && _infoDrawCalls) {
        _infoFPS.Update(Math.round(info.fps));
        _infoDrawCalls.Update(info.render.calls);
        _infoTriangles.Update(info.render.triangles);
        _infoLines.Update(info.render.lines);
        // _infoPoints.Update(info.render.points);
    };
    /*
    if (info && info.memory && _infoTextureMem) {
        _infoTextureMem.Update(info.memory.textures);
        _infoGeometryMem.Update(info.memory.geometries);
    };
    */
};

const _processCameraInfo = function(camInfo: CameraInfoEventProps) {
    if (camInfo && camInfo.position && _infoCameraCoord) {
        _infoCameraCoord.Update(camInfo.position);
    };
};