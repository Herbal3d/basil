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
/* global GP */ // debugging global context (ESlint)

// Global parameters and variables. "GP.variable"
import GP from 'GP';

import Config from 'xConfig';
import * as BasilClient from 'xBasilClient';
import BTransportWW from 'xBTransportWW';
import { BException } from 'xBException';

GP.Config = Config;

// Debug function to mimic the non-WebWorker one
GP.DebugLog = function(msg) {};

GP.Ready = false;

let parms  = {};
GP.wwTransport = new BTransportWW(parms);
/*
GP.wwTransport.SetReceiveCallbackObject( {
    'procMessage': function(buff, tcontext) {
        let msg = BasilServerMsgs.BasilServerMessage.decode(buff);
        // Do something with the messsage
    }
})
*/
GP.Ready = true;

GP.client = BasilClient.NewBasilClient('client', GP.wwTransport, {} );

// Once client is created and connected, debug messsages can be sent to the
//    predefined debug instance.
if (Config.predefinedInstances && Config.predefinedInstances.debugObjectId) {
  GP.DebugObjectId = Config.predefinedInstances.debugObjectId;
  GP.DebugLog = function(msg) {
    let auth = undefined;
    let id = GP.DebugObjectId;
    let props = {
      'list': {
        'Msg': msg
      }
    };
    GP.client.UpdateInstanceProperty(auth, id, props);
  }
}

GP.client.OpenSession(undefined, {
    'originator': 'com.basil.b.tester'
})
.then( resp => {
    // Start alive polling
    GP.aliveIntervalID = setInterval(function() {
        GP.client.AliveCheck()
        .then( resp => {
        // Got it back!
        })
        .catch( e => {
        // Got it back!
        });
    }, Config.WWTester.AliveCheckPollMS);

    // Build an asset
    let anAsset = {
      displayInfo: {
        displayableType: 'meshset',
        asset: {
          list: {
            'URL': 'http://home.livingroomcam.us:14600/basil/convoar/testtest88.gltf',
            'loaderType': 'GLTF'
          }
        }
      }
    };
    let auth = undefined; // no authentication at the moment
    GP.client.IdentifyDisplayableObject(auth, anAsset)
    .then( resp => {
      if (resp.exception) {
        GP.DebugLog('failed creation of displayable:' + resp.exception.reason);
      }
      else {
        let displayableId = resp.identifier.id;
        GP.DebugLog('Created displayable ' + displayableId);
        let instancePositionInfo = {
          // 'id': instanceIdentifier,  // not needed for creation
          'pos': {
            'pos': { x: 10, y: 11, z: 12 },
            'rot': { x: 0, y: 0, z: 0, w: 1 },
            'posRef': 0,
            'rotRef': 0
          }
          // 'vel': '0',
          // 'path': pathDescription
        };
        GP.client.CreateObjectInstance(auth, displayableId, instancePositionInfo)
        .then( resp => {
          if (resp.exception) {
            GP.DebugLog('failed creation of instance:' + resp.exception.reason);
          }
          else {
            let instanceId = resp.instanceId.id;
            GP.DebugLog('Created instance ' + instanceId);
            GP.client.RequestInstanceProperties(auth, instanceId)
            .then( resp => {
              if (resp.exception) {
                GP.DebugLog('failed fetching of instance properties: ' + resp.exception.reason);
              }
              else {
                if (resp.properties && resp.properties.list) {
                  GP.DebugLog('Fetched properties for ' + instanceId + ':');
                  Object.keys(resp.properties.list).forEach(prop => {
                    GP.DebugLog('    ' + prop + ' => ' + resp.properties.list[prop]);
                  });
                }
              }
            })
          }
        });
      }
      // One asset is in the scene
    });
});
