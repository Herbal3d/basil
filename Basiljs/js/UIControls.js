// Copyright (c) 2017, Robert Adams
// All rights reserved.
// Licensed for use under BSD License 2.0 (https://opensource.org/licenses/BSD-3-Clause).

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


