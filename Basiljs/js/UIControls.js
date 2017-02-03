/**
 * Copyright (c) 2017, Robert Adams
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in
 * the documentation and/or other materials provided with the distribution.
 * 
 * 3. Neither the name of the copyright holder nor the names of its
 * contributors may be used to endorse or promote products derived
 * from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var UC = UC || {};

// ('controls' does not reference ThreeJS. All graphics go through the graphics routine.)
define(['jquery'], function( $ ) {

    // ======================================================
    // UI structure for displaying XYZ coordinates
    // Create instance with the '#ID' of the containing HTML element
    // Call 'Update' to update the values.
    var UI_CoordF = function (areaID) {
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
            // DebugLog('Created UI_Coord element for ' + areaID);
        }
        else {
            DebugLog('Did not create UI_Coord element because ' + areaID + ' not in document');
        }
    };
    UI_CoordF.prototype.Update = function(xx, yy, zz) {
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
            DebugLog('Did not update UI_Coord element because no areaID');
        }
    };

    // ======================================================
    // UI structure for displaying a quaterion.
    // Create instance with the '#ID' of the containing HTML element
    // Call 'Update' to update the values.
    var UI_QuatF = function (areaID) {
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
            DebugLog('Did not create UI_Quat element because ' + areaID + ' not in document');
        }
    };
    UI_QuatF.prototype.Update = function(xx, yy, zz, ww) {
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
            DebugLog('Did not update UI_Coord element because no areaID');
        }
    };

    // ======================================================
    // UI structure for displaying text.
    // Create instance with the '#ID' of the containing HTML element
    // Call 'Update' to update the values.
    var UI_TextF = function (areaID) {
        if ($(areaID)) {
            $(areaID).empty();
            this.areaID = areaID;
            // DebugLog('Created UI_Text element for ' + areaID);
        }
        else {
            DebugLog('Did not create UI_Text element because ' + areaID + ' not in document');
        }
    };
    UI_TextF.prototype.Update = function(txt) {
        if (this.areaID) {
            var areaID = this.areaID;
            $(areaID).text(txt);
        }
        else {
            DebugLog('Did not update UI_Text element because no areaID');
        }
    };

    // ======================================================

    // The objects returned by this package are designed to be 'new'ed for UI
    // instances rather than called. Example usage:
    //      var oneUiInterfaceControl = new UIControls.UI_Coord('#selectionID');
    //      ...
    //      oneUiInterfaceControl.Update(newValue);
    //      ...
    var op = {
        'UI_Coord': UI_CoordF,
        'UI_Quat': UI_QuatF,
        'UI_Text': UI_TextF,
        'noComma': 0
    };

    GR.UC = UC;
    UC.op = op;

    return op;

});


