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

import { GP, GetNextUniqueNum, UniqueIdBasename } from 'GLOBALS';
import Config from './config.js';

// Create a globally unique Id based on the service and type passed.
// If 'type' is undefined, it is not included in the name.
export function CreateUniqueId(service, type) {
    return String(GetNextUniqueNum())
        + (type ? ( '.' + type ) : '')
        + '.'
        + service
        + UniqueIdBasename;
    /* Original form that put number at the end
    return GP.UniqueIdBasename
                + service
                + (type ? ( '.' + type ) : '')
                + '.'
                + String(UniqueIdCount++);
    */
};

// Create a locally unique instance identifier.
export function CreateUniqueInstanceId() {
    return CreateUniqueId('instance');
};

// Create a random string for use as identifier or whatever.
// For the moment, 30 bits of randomeness are enough. Add more if needed.
export function RandomIdentifier() {
    // crypto.GetRandomValues could be slow. Maybe replace with Math.random.
    //   let randomness = new Uint32Array(1);
    //   crypto.getRandomValues(randomness);
    //   let randomIdentifier = randomness[0];
    // let randomIdentifier = (new Uint32Array((new Float32Array( [ Math.random() ] )).buffer))[0];
    return (String)(Math.floor( Math.random() * 536870912 ));   // 2^30
}

// Configuration comes from the configuration file (Config), parameters at
//    may be set in the context, and parameters that may be required.
//    This takes those three inputs and creates one parameter block with
//    the proper merge of those three sources.
// Passed context parameters take highest priority, then config file, then
//    default/required values.
// NOTE: a lower case version of the parameter is always created just
//    for uniformity. Case usually matters so passing in a parameter with
//    the wrong case will usually confuse things.
export function CombineParameters(configParams, passedParams, requiredParams) {
    let parms = configParams ? Object.assign({}, configParams) : {};
    // Make sure there is a canonical lower case version of configParams
    Object.keys(parms).forEach( key => {
        parms[key.toLowerCase()] = parms[key];
    });
    if (passedParams) {
        // passed parameters overwrite configuration file parameters
        Object.keys(passedParams).forEach( key => {
            parms[key] = passedParams[key];
            parms[key.toLowerCase()] = passedParams[key];
        });
    }
    if (requiredParams) {
        Object.keys(requiredParams).forEach( key => {
            // If a required parameter has not been set, add the required param and default value.
            // Check to see if the lower case version is here.
            if (typeof(parms[key.toLowerCase()]) === 'undefined') {
                parms[key] = requiredParams[key];
                parms[key.toLowerCase()] = requiredParams[key];
            }
        });
    }
    // Sanity check. Make sure all keys have a lower case version with the same value.
    Object.keys(parms).forEach( key => {
        if (parms[key] != parms[key.toLowerCase()]) {
            console.log('CombineParameters: sanity check bad match:'
                + ' key=' + key
                + ', val=' + parms[key]
                + ', valLC=' + parms[key.toLowerCase()]
            );
        }
    });
    return parms;
}

// A function that does a 'JSON.stringify' on the passed object but replaces
//    any 'undefined' values with 'null'.
// The JSON specification does not define the 'undefined' value so the
//    JSON.stringify library operation drops them from the output. Since this
//    operation is not being used to create a legal JSON string output
//    but is usually used for debugging, we do the conversion.
// So, note that this DOES NOT RETURN A LEGAL JSON STRING.
//    USE THIS FUNCTION FOR DEBUG OUTPUT ONLY!
export function JSONstringify(obj) {
    return JSON.stringify(obj, (k,v) => { return typeof(v) === 'undefined' ? 'undefined' : v; })
}

// Parse and return three-tuple.
// Used for 3 term vector.
// Accepts a JSON string array: "[ xValue, yValue, zValue ]"
//         a JSON value map: "{ "x": xValue, "y": yValue, "z": zValue }"
//         a three value JavaScript array: [ xValue, yValue, zValue ]
//         a three value JavaScript map: [ x: xValue, y: yValue, z: zValue ]
// Returns a three valued JavaScript array.
// NOTE: since protobuf doesn't send zero values, it's possible to get "{ y: 10 }"
export function ParseThreeTuple(tuple) {
    let val = tuple
    if (typeof tuple == 'String') {
        val = JSON.Parse(tuple);
    }
    if (!Array.isArray(val)) {
        let ret = [ 0, 0, 0 ];
        if (val.x) ret[0] = val.x;
        if (val.y) ret[1] = val.y;
        if (val.z) ret[2] = val.z;
        val = ret;
    }
    // consider doing some validity checking (length, type, ...)
    return val
}

// Parse and return four-tuple.
// Used for 4 term vector (like rotation).
// Accepts a JSON string array: "[ wValue, xValue, yValue, zValue ]"
//         a JSON value map: "{ "w": wValue, "x": xValue, "y": yValue, "z": zValue }"
//         a four value JavaScript array: [ wValue, xValue, yValue, zValue ]
//         a four value JavaScript map: [ w: wValue, x: xValue, y: yValue, z: zValue ]
// Returns a four valued JavaScript array.
export function ParseFourTuple(tuple) {
    let val = tuple
    if (typeof tuple == 'String') {
        val = JSON.Parse(tuple);
    }
    if (!Array.isArray(val)) {
        let ret = [ 0, 0, 0, 0 ];
        if (val.x) ret[0] = val.x;
        if (val.y) ret[1] = val.y;
        if (val.z) ret[2] = val.z;
        if (val.w) ret[3] = val.w;
        val = ret;
    }
    // consider doing some validity checking (length, type, ...)
    return val
}

// Figure out what is being passed and turn it into an array of three numbers.
// Usually used to create a Vector3.
export function MakeArray3(pVal) {
    if (Array.isArray(pVal)) {
        if (pVal.length > 2) {
            return [ Number(pVal[0]), Number(pVal[1]), Number(pVal[2]) ];
        };
    };
    console.log('MakeArray3: typeof(pVal)=' + typeof(pVal) + ', contents=' + JSONstringify(pVal));
    if (typeof(pVal) === 'object') {
        return [ Number(pVal.x), Number(pVal.y), Number(pVal.z) ];
    }
    // This shouldn't happen but return a value that is distinctive
    return [ -1, -2, -3 ];
}
// Figure out what is being passed and turn it into an array of four numbers.
// Usually used to create a Vector4 or a Quaternion.
export function MakeArray4(pVal) {
    if (Array.isArray(pVal)) {
        if (pVal.length > 3) {
            return [ Number(pVal[0]), Number(pVal[1]), Number(pVal[2]), Number(pVal[3]) ];
        };
    };
    if (typeof(pVal) === 'object') {
        return [ Number(pVal.x), Number(pVal.y), Number(pVal.z), Number(pVal.w) ];
    }
    // This shouldn't happen but return a value that is distinctive
    return [ -1, -2, -3, -4 ];
}
