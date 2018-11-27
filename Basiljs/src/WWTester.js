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
import { BasilClientConnection } from 'xBasilClient';
import { BTransportWW } from 'xBTransportWW';
import { BException } from 'xBException';

import { BasilType } from "xBasilServerMessages"

GP.Config = Config;

// Debug function to mimic the non-WebWorker one
GP.DebugLog = function(msg) {};

GP.Ready = false;

let parms  = {};
GP.wwTransport = new BTransportWW(parms);

GP.Ready = true;

GP.client = new BasilClientConnection('client', GP.wwTransport, {} );

// Once client is created and connected, debug messsages can be sent to the
//    predefined debug instance.
if (Config.predefinedInstances && Config.predefinedInstances.debugObjectId) {
  GP.DebugObjectId = Config.predefinedInstances.debugObjectId;
  GP.DebugLog = function(msg) {
    let auth = undefined;
    let id = GP.DebugObjectId;
    let props = {
      'Msg': msg
    };
    GP.client.UpdateInstanceProperty(auth, id, props);
    // console.log('WW.DebugLog: ' + msg);
  }
}

GP.client.OpenSession(undefined, {
    'originator': 'com.basil.b.tester'
})
.then( resp => {
    if (Config.WWTester && Config.WWTester.GenerateAliveCheck) {
      // Start alive polling
      GP.aliveIntervalID = setInterval(function() {
          GP.client.AliveCheck()
          .then( resp => {
            if (Config.WWTester.PrintDebugOnAliveResponse) {
              GP.DebugLog('Keep alive response: ' + JSON.stringify(resp));
            }
          })
          .catch( e => {
          // Got it back!
          });
      }, Config.WWTester.AliveCheckPollMS);
    }

    let auth = undefined; // no authentication at the moment
    let anAsset = {
      // 'id': { 'id': someID }, // not needed for creation
      'displayInfo': {
        'displayableType': 'meshset',
        'asset': {
          'url': 'http://files.misterblue.com/BasilTest/convoar/testtest88/unoptimized/testtest88.gltf',
          'loaderType': 'GLTF'
        }
      }
    };
    if (Config.WWTester && Config.WWTester.TestAsset) {
      anAsset.displayInfo.asset = Config.WWTester.TestAsset;
    }
    GP.client.IdentifyDisplayableObject(auth, anAsset)
    .then( resp => {
      if (resp.exception) {
        GP.DebugLog('failed creation of displayable:' + resp.exception.reason);
      }
      else {
        let displayableId = resp.identifier.id;
        GP.DebugLog('Created displayable ' + displayableId);
        let instancePositionInfo = {
          // 'id': { 'id': someID },  // not needed for creation
          'pos': {
            'pos': { x: 100, y: 101, z: 102 },
            // 'rot': { x: 0, y: 0, z: 0, w: 1 },
            'posRef': BasilType.CoordSystem.WGS86,
            'rotRef': BasilType.RotationSystem.WORLDR
          }
        };
        /*
        let instancePositionInfo = BasilType.InstancePositionInfo( {
          // 'id': BasilType.InstanceIdentifier( { 'id': someID }),  // not needed for creation
          'pos': BasilType.CoordPosition( {
            'pos': BasilType.Vector3( { x: 10, y: 11, z: 12 } ),
            'rot': BasilType.Quaternion( { x: 10, y: 11, z: 12 } ),
            'posRef': BasilType.CoordSystem.WGS86,
            'rotRef': BasilType.RotationSystem.WORLDR
          })
        });
        */
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
                if (resp.properties) {
                  GP.DebugLog('Fetched properties for ' + instanceId + ':');
                  Object.keys(resp.properties).forEach(prop => {
                    GP.DebugLog('    ' + prop + ' => ' + resp.properties[prop]);
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
