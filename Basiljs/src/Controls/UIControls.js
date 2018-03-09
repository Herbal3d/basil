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

var UC = UC || {};

import GP from 'GP';
// ('controls' does not reference ThreeJS. All graphics go through the graphics routine.)
import * as $ from 'jquery';

// ======================================================
// UI structure for displaying XYZ coordinates
// Create instance with the '#ID' of the containing HTML element
// Call 'Update' to update the values.
export class UI_Coord {
    constructor(areaID) {
        if ($(areaID)) {
            $(areaID).empty();
            var Xdiv = document.createElement('div');
            Xdiv.setAttribute('class', 'coordEntry X');
            var Ydiv = document.createElement('div');
            Ydiv.setAttribute('class', 'coordEntry Y');
            var Zdiv = document.createElement('div');
            Zdiv.setAttribute('class', 'coordEntry Z');
            $(areaID).append(Xdiv);
            $(areaID).append(Ydiv);
            $(areaID).append(Zdiv);
            this.areaID = areaID;
            // GP.DebugLog('Created UI_Coord element for ' + areaID);
        }
        else {
            GP.DebugLog('Did not create UI_Coord element because ' + areaID + ' not in document');
        }
    }

    // Update with three coordinates or one parameter that has a .x, .y, and .z
    Update(xx, yy, zz) {
        if (this.areaID) {
            var areaID = this.areaID;
            if (xx.hasOwnProperty('x')) {
                $(areaID + ' div[class~=X]').text(xx.x.toFixed(2));
                $(areaID + ' div[class~=Y]').text(xx.y.toFixed(2));
                $(areaID + ' div[class~=Z]').text(xx.z.toFixed(2));
            }
            else {
                $(areaID + ' div[class~=X]').text(this.FormatCoord(xx.toFixed(2)));
                $(areaID + ' div[class~=Y]').text(this.FormatCoord(yy.toFixed(2)));
                $(areaID + ' div[class~=Z]').text(this.FormatCoord(zz.toFixed(2)));
            }
        }
        else {
            GP.DebugLog('Did not update UI_Coord element because no areaID');
        }
    }
};

// ======================================================
// UI structure for displaying a quaterion.
// Create instance with the '#ID' of the containing HTML element
// Call 'Update' to update the values.
export class UI_Quat {
    constructor(areaID) {
        if ($(areaID)) {
            $(areaID).empty();
            var Xdiv = document.createElement('div');
            Xdiv.setAttribute('class', 'coordEntry X');
            var Ydiv = document.createElement('div');
            Ydiv.setAttribute('class', 'coordEntry Y');
            var Zdiv = document.createElement('div');
            Zdiv.setAttribute('class', 'coordEntry Z');
            var Wdiv = document.createElement('div');
            Zdiv.setAttribute('class', 'coordEntry W');
            $(areaID).append(Xdiv);
            $(areaID).append(Ydiv);
            $(areaID).append(Zdiv);
            $(areaID).append(Wdiv);
            this.areaID = areaID;
        }
        else {
            GP.DebugLog('Did not create UI_Quat element because ' + areaID + ' not in document');
        }
    }

    // Update with four values or one value with a .x, .y, .z and .w
    Update(xx, yy, zz, ww) {
        if (this.areaID) {
            var areaID = this.areaID;
            if (xx.hasOwnProperty('x')) {
                $(areaID + ' div[class~=X]').text(xx.x.toFixed(2));
                $(areaID + ' div[class~=Y]').text(xx.y.toFixed(2));
                $(areaID + ' div[class~=Z]').text(xx.z.toFixed(2));
                $(areaID + ' div[class~=W]').text(xx.w.toFixed(2));
            }
            else {
                $(areaID + ' div[class~=X]').text(this.FormatCoord(xx.toFixed(2)));
                $(areaID + ' div[class~=Y]').text(this.FormatCoord(yy.toFixed(2)));
                $(areaID + ' div[class~=Z]').text(this.FormatCoord(zz.toFixed(2)));
                $(areaID + ' div[class~=W]').text(this.FormatCoord(ww.toFixed(2)));
            }
        }
        else {
            GP.DebugLog('Did not update UI_Coord element because no areaID');
        }
    }
};

// ======================================================
// UI structure for displaying text.
// Create instance with the '#ID' of the containing HTML element
// Call 'Update' to update the values.
export class UI_Text {
    constructor(areaID) {
        if ($(areaID)) {
            $(areaID).empty();
            this.areaID = areaID;
            // GP.DebugLog('Created UI_Text element for ' + areaID);
        }
        else {
            GP.DebugLog('Did not create UI_Text element because ' + areaID + ' not in document');
        }
    }

    Update(txt) {
        if (this.areaID) {
            var areaID = this.areaID;
            $(areaID).text(txt);
        }
        else {
            GP.DebugLog('Did not update UI_Text element because no areaID');
        }
    }
};

// ======================================================


GP.UC = UC;
