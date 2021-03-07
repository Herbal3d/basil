/* eslint-disable */
/*
    This is an extremely modified version of a Javascript LLSD parser
    taken from https://github.com/CasperTech/llsd which was derived from
    https://bitbucket.org/lindenlab/llsd/src/default/.
    Only the parsing code remains. The formatting and binary serialization code
    has been removed.
*/

/* Original Linden Lab copyright/license:
$LicenseInfo:firstyear=2010&license=mit$

Copyright (c) 2010, Linden Research, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
$/LicenseInfo$
*/

/* Original CasperTech copyright/license:
MIT License

Copyright (c) 2017 CasperTech

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// modified version Copyright 2021 Robert Adams
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

// Parses an XML serialization of LLSD into the corresponding
// ECMAScript object data structure.
export function ParseLLSDXML(xmltext) {
    var xmldoc;

    xmldoc = (new DOMParser()).parseFromString(xmltext, "text/xml");

    if (xmldoc.documentElement.nodeName !== 'llsd') {
        throw new Error("Expected <llsd> as root element");
    }
    if (xmldoc.documentElement.childNodes.length !== 1) {
        throw new Error("Expected one child of root element");
    }

    function processElement(elem) {

        var child, map, key, encoding, array;

        switch (elem.nodeName) {
            case "undef":
                return null;
            case "boolean":
                return LLSD_asBoolean(NodeText(elem));
            case "integer":
                return LLSD_asInteger(NodeText(elem));
            case "real":
                return LLSD_asReal(NodeText(elem));
            case "uuid":
                // return new UUID(NodeText(elem)); // If invalid should raise error
                return LLSD_asUUID(NodeText(elem)); // If invalid should yield default
            case "string":
                return NodeText(elem);
            case "date":
                // return LLSD_parseISODate(text); // If invalid should raise error
                return LLSD_asDate(NodeText(elem)); // If invalid should yield default
            case "uri":
                // return new URI(NodeText(elem)); // If invalid should raise error
                return LLSD_asURI(NodeText(elem)); // If invalid should yield default
            case "binary":
                encoding = elem.getAttribute('encoding');
                if (encoding && encoding !== 'base64') {
                    throw new Error("Unexpected encoding on <binary>: " + encoding);
                }
                // return new Binary(NodeText(elem)); // If invalid should raise error
                return LLSD_asBinary(NodeText(elem)); // If invalid should yield default
            case "map":
                map = {};
                for (child = elem.firstChild; child; child = child.nextSibling) {
                    if (child.nodeName !== 'key') {
                        throw new Error("Expected <key> as child of <map>");
                    }
                    key   = NodeText(child);
                    child = child.nextSibling;
                    if (!child) {
                        throw new Error("Missing sibling of <key> in <map>");
                    }

                    map[key] = processElement(child);
                }
                return map;

            case "array":
                array = [];
                for (child = elem.firstChild; child; child = child.nextSibling) {
                    array.push(processElement(child));
                }
                return array;

            default:
                throw new Error("Unexpected element: " + elem.nodeName);
        }
    }
    return processElement(xmldoc.documentElement.firstChild);
};

function LLSD_type(value) {
    switch (typeof value) {
        case 'boolean':
            return 'boolean';
        case 'number':
            return LLSD_isInt32(value) && !LLSD_isNegativeZero(value) ? 'integer' : 'real';
        case 'string':
            return 'string';
        case 'object':
            if (value === null) {
                return 'undefined';
            }
            if (value instanceof UUID) {
                return 'uuid';
            }
            if (value instanceof Date) {
                return 'date';
            }
            if (value instanceof URI) {
                return 'uri';
            }
            if (value instanceof Binary) {
                return 'binary';
            }
            if (value instanceof Array) {
                return 'array';
            }
            return 'map';
        case 'undefined':
            return 'undefined';
        default:
            return 'undefined';
    }
};

// Parse ISO 8601 dates into ECMAScript Date objects
// Matches "YY-MM-DDThh:mm:ssZ" or "YY-MM-DDThh:mm:ss.fffZ".
// Throws an error if the string doesn't match.
function LLSD_parseISODate(str) {
    var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(str);
    if (m) {
        return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
    }
    else {
        throw new Error('Invalid UUID string format');
    }
};

var LLSD_MIN_INTEGER = -2147483648;
var LLSD_MAX_INTEGER = 2147483647;

function LLSD_isNegativeZero(a) {
    return (a === 0) && ((1 / a) === -Infinity);
};

function isInt32(a) {
    /*jslint bitwise: false*/
    return (a >> 0) === a;
};

function LLSD_parseFloat(str) {
    switch (str) {
        case '-Infinity':
            return -Infinity;
        case '-Zero':
            return -0.0;
        case '0.0':
            return 0.0;
        case '+Zero':
            return 0.0;
        case 'Infinity': // *TODO: not in the spec; should it be?
        case '+Infinity':
            return Infinity;
        case 'NaNS':
            return NaN;
        case 'NaNQ':
            return NaN;
        default:
            // *TODO: Update when the incorrect ABNF in Appendix A ABNF is corrected
            //if (/^(([1-9][0-9]*(\.[0-9]*)?)|(0\.0*[1-9][0-9]*))E(0|-?[1-9][0-9]*)$/.test(str)) 
            if (/^[\-+]?([0-9]*\.?[0-9]+)([eE][\-+]?[0-9]+)?$/.test(str)) {
                return parseFloat(str);
            }
    }
    // otherwise no return value (undefined)
};

function LLSD_formatFload(f) {
    if (isNaN(f)) {
        return 'NaNS';
    }
    else if (f === Infinity) {
        return '+Infinity';
    }
    else if (f === -Infinity) {
        return '-Infinity';
    }
    //else if (f === 0 && 1 / f === Infinity) {
    //    return '+Zero'; // *TODO: Per spec, but is this desired?
    //}
    else if (LLSD_isNegativeZero(f)) {
        return '-Zero'; //return '-0.0'; // *TODO: Per spec, '-Zero', but is this desired?
    }
    else {
        return String(f);
    }
};

function LLSD_asUndefined(value) {
    return null;
};

function LLDS_asBoolean(value) {
    switch (LLSD_type(value)) {
        case 'boolean':
            return value;
        case 'integer':
            return value !== 0;
        case 'real':
            return value !== 0 && !isNaN(value);
        case 'string':
            return value.length > 0;
        default:
            return false;
    }
};

function LLSD_asInteger(value) {
    switch (LLSD_type(value)) {
        case 'boolean':
            return value ? 1 : 0;
        case 'integer':
            return value;
        case 'string':
            value = parseInt(value);
            break;
        case 'real':
            break;
        default:
            return 0;
    }

    value = isNaN(value) ? 0 : Math.round(value);

    if (value > LLSD_MAX_INTEGER) {
        return LLSD_MAX_INTEGER;
    }
    else if (value < LLSD_MIN_INTEGER) {
        return LLSD_MIN_INTEGER;
    }
    else {
        return value;
    }
};

function LLSD_asReal(value) {
    switch (LLSD_type(value)) {
        case 'integer':
            return value;
        case 'real':
            return value;
        case 'string':
            return LLSD_parseFloat(value);
        case 'boolean':
            return value ? 1.0 : 0.0;
        default:
            return 0.0;
    }
};

function LLSD_asString(value) {
    switch (LLSD_type(value)) {
        case 'string':
            return value;
        case 'boolean':
            return value ? 'true' : '';
        case 'integer':
            return String(value);
        case 'real':
            return LLSD_formatFloat(value);
        case 'uuid':
            return String(value);
        case 'date':
            return value.toJSON();
        case 'uri':
            return String(value);
        case 'binary':
            return value.toString('BASE64');
        default:
            return '';
    }
};

function LLSD_asUUID(value) {
    switch (LLSD_type(value)) {
        case 'uuid':
            return value;
        case 'string':
            try {
                return new UUID(value);
            }
            catch (e) {
            }
            break;
    }
    return new UUID();
};

function LLSD_asDate(value) {
    switch (LLSD_type(value)) {
        case 'date':
            return value;
        case 'string':
            try {
                return LLSD_parseISODate(value);
            }
            catch (e) {
            }
            break;
    }
    return new Date(0);
};

function LLSD_asURI(value) {
    switch (LLSD_type(value)) {
        case 'uri':
            return value;
        case 'string':
            return new URI(value);
    }
    return new URI();
};

function LLSD_asBinary(value) {
    switch (LLSD_type(value)) {
        case 'binary':
            return value;
        case 'string':
            return new Binary(value, 'BASE64');
    };
    // return new Binary();
};

// Return the text that is inside the passed element
function NodeText(node) {
    let NODE_TEXT = 3;
    if (!node.hasChildNodes()) {
        return '';
    }
    if (node.childNodes.length > 1) {
        throw new Error("Expected single child of: " + node.nodeName);
    }
    let child = node.firstChild;
    if (child.nodeType !== NODE_TEXT) {
        throw new Error("Expected text node child of: " + node.nodeName);
    }
    return child.data;
}

// Parser for OSD.
// Returns an ECMAScript object data structure.
export function ParseOSDXML(xmltext) {
    // Returns a 'member' element which contains a 'name' and 'value'
    function processMember(elem) {
        if (elem.nodeName != 'member') {
            throw new Error("In processMember: unexpected element: " + elem.nodeName);
        }
        let ret = {};
        for (let child of elem.childNodes) {
            if (child.nodeName == "name") {
                ret.name = NodeText(child).trim();
            }
            if (child.nodeName == "value") {
                ret.value = processValue(child)
            }
        };
        return ret;
    }
    // Returns an object representing the value. 'elem' must be a 'value' element.
    // 'value' elements can contain an 'array', 'struct' (map), or a primary type.
    // Returns the packed value as a Javascript object.
    function processValue(elem) {
        if (elem.nodeName != 'value') {
            throw new Error("In processValue: unexpected element: " + elem.nodeName);
        }
        if (elem.childNodes.length != 1) {
            throw new Error("In processValue: more than one child node");
        }
        let valueNode = elem.firstChild;
        switch (valueNode.nodeName) {
            case 'array':   // an array of 'values'
                let dataNode = valueNode.firstChild;
                if (dataNode.nodeName != 'data') {
                    throw new Error("In processValue.array: unexpected element: " + dataNode.nodeName);
                }
                let arr = [];
                for (let child of dataNode.childNodes) {
                    arr.push(processValue(child));
                };
                return arr;
            case 'struct':  // a map of 'members'
                let structVal = {};
                for (let child of valueNode.childNodes) {
                    let res = processMember(child);
                    structVal[res.name] = res.value;
                };
                return structVal;
            case 'string':
                return NodeText(valueNode).trim();
            case "i4":
                return LLSD_asInteger(NodeText(valueNode));
            // the following don't seem to appear in login responses
            case "boolean":
                return LLSD_asBoolean(NodeText(valueNode));
            case "integer":
                return LLSD_asInteger(NodeText(valueNode));
            case "real":
                return LLSD_asReal(NodeText(valueNode));
            case "uuid":
                return LLSD_asUUID(NodeText(valueNode)); // If invalid should yield default
            case "date":
                return LLSD_asDate(NodeText(valueNode)); // If invalid should yield default
            case "uri":
                return LLSD_asURI(NodeText(valueNode)); // If invalid should yield default
        }
    }

    // Convert XML text to DOM structure to search
    let xmldoc = (new DOMParser()).parseFromString(xmltext, "text/xml");
    // Look for the first 'value' to return
    let valElement = xmldoc;
    while (valElement && (valElement.nodeName !== 'value' ) ) {
        valElement = valElement.hasChildNodes ? valElement.firstChild : undefined;
    }
    // return the packed contents of the first 'value' element or 'undefined' if none
    return valElement ? processValue(valElement) : undefined;
};