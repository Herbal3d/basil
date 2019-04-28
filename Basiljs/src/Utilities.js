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

import GP from 'GP';
import Config from './config.js';

// Create a globally unique Id based on the service and type passed.
// If 'type' is undefined, it is not included in the name.
export function CreateUniqueId(service, type) {
    if (GP.UniqueIdCount === undefined) {
        GP.UniqueIdCount = 1;
        GP.UniqueIdBasename = '.b.basil.org';
        // Note that basename begins with a dot
    }
    return String(GP.UniqueIdCount++)
        + (type ? ( '.' + type ) : '')
        + '.'
        + service
        + GP.UniqueIdBasename
  /* Original form that put number at the end
    return GP.UniqueIdBasename
                + service
                + (type ? ( '.' + type ) : '')
                + '.'
                + String(GP.UniqueIdCount++);
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
// NOTE: everything is forced to all lowercase thus the resulting value
//    lookup MUST be looking for a lowercase only value.
export function CombineParameters(configParams, passedParams, requiredParams) {
    let parms = configParams ? configParams : {};
    Object.getOwnPropertyNames(parms).forEach( key => {
        parms[key.toLowerCase()] = parms[key];
    })
    if (passedParams) {
        // passed parameters overwrite configuration file parameters
        Object.keys(passedParams).forEach( key => {
            parms[key.toLowerCase()] = passedParams[key];
        });
    }
    if (requiredParams) {
        Object.keys(requiredParams).forEach( key => {
            // If a required parameter has not been set, add the required param and default value
            if (typeof(parms[key.toLowerCase()]) === 'undefined') {
                parms[key.toLowerCase()] = requiredParams[key];
            }
        })
    }
    return parms;
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
