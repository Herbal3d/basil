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

// Template for transport implmentations.
// Using 'functional pattern' from http://davidshariff.com/blog/javascript-inheritance-patterns/
//     mostly because it isolates all the children and fixes closure overlaps.

// open(transportSpecificParameters)
// close()
// write(data)
// data = read()
// dataAvailable(callBack)
// isOpen()

define(['Config'],
            function( Config ) {

    return function() {
        var that = {};

        that.open = function(connectionString) {},
        that.close = function() {},
        that.send = function(data) {},
        // Read a message and call the callback when received. Will hang if no input yet.
        that.receive = function(completionCallback) {},
        // Call callback when there is data in put input queue.
        //    A way of getting called when data is available.
        //    Pass 'undefined' to turn off the callbacks.
        that.dataAvailable = function(callBack) {},
        that.isOpen = function() {}

        return that;
    }
});
