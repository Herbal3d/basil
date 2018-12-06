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

import {flatbuffers} from 'xFlatbuffers';
import {org.herbal3d.protocol.basil as BTypes} from 'xBasilTypes';
import {org.herbal3d.protocol.basil.server as BServer} from 'xBasilServer';

// Packing and unpacking routines for flatbuffer instance of BasilTypes and BasilServer
export class FBConv {
  constructor() {
  }

  // UTILITY FUNCTIONS.
  // In general, data comes into this in JavaScript structures and are converted
  //    to and from flatbuffers buffer formats.
  // Pack* does conversion from Javascript objects to offset into building buffer.

  // Wrap the passed 'data' into a transport message.
  // The message should be packed already while others are packed if needed.
  static PackMessage(fbb, xport, msgOffset, msgType, respSession, respSessionKey, auth) {
    let authOffset = auth;
    if (authOffset && (typeof authOffset != 'number')) {
      authOffset = FBConv.PackAuth(fbb, auth);
    }
    let keyOffset = respSessionKey;
    if (keyOffset && (typeof keyOffset != 'number')) {
      keyOffset = fbb.createString(respSessionKey);
    }
    BMessage.startBTransportMsg(fbb);
    BMessage.BTransportMsg.addSequenceNum(fbb, xport.sequenceNum++);
    // BTransport.BTransportMsg.addStream(fbb, 0);
    // BTransport.BTransportMsg.addQueueTime(fbb, 0);
    // BTransport.BTransportMsg.addSendTime(fbb, 0);
    if (authOffset) { BMessage.BTransportMsg.addAuth(fbb, authOffset); }
    if (respSession) { BMessage.BTransportMessage.addResponseSession(fbb, respSession); }
    if (keyOffset) { BMessage.BTransportMessage.addResponseSessionKey(fbb, keyOffset); }
    if (msgType) { BMessage.BTransportMsg.addMsgType(fbb, msgType); }
    BMessage.BTransportMsg.addMsg(fbb, msgOffset);
    return BMessage.BTransportMsg.endBTransportMsg(fbb);
  }

  static PackException(fbb, reason, hints) {

  }
  static UnpackException(expMsg) {

  }
  static PackAssetInfo(fbb, assetInfo) {
    let ret = undefined;
    if (assetInfo) {
      let id = undefined;
      if (assetInfo.id) { id = fbb.createString(assetInfo.id); }
      let displayableType = undefined;
      if (assetInfo.displayableType) {
        displayableType = fbb.createString(assetInfo.displayabbleType);
      }
      let attributes = undefined;
      if (assetInfo.attributes) {
        let attribList = BasilServer.PackPropertyValues(fbb, assetInfo.attributes);
        attributes = BTypes.DisplayableInfo.createAttributesVector(fbb, attribList);
      }
      let aabb = undefined;
      if (assetInfo.aabb) {
        let aabb = BasilServer.PackAabb(fbb, assetInfo.aabb);
      }
      BTypes.AssetInformation.startAssetInformation(fbb);
      if (id) { BTypes.AssetInformation.addId(fbb, id); }
      if (displayableType) { BTypes.AssetInformation.addDisplayInfo(fbb, displayableType); }
      if (aabb) { BTypes.AssetInformation.addAabb(fbb, aabb); }
      if (attributes) { BTypes.AssetInformation.addAttributes(fbb, attributes); }
      ret = BTypes.AssetInformation.endAssetInformation(fbb);
    }
    return ret;
  }
  static UnpackAssetInfo(assetInfoMsg) {
  }
  static PackAuth(fbb, auth) {
    let ret = undefined;
    if (auth && auth.accessProperties) {
      let accessPropertiesList = BuildServer.PackPropertyValues(fbb.auth.accessProperties);
      let accessProperties = BTypes.AccessAuthorization.createAccessPropertiesVector(accessPropertiesList);
      BTypes.AccessAuthorization.startAccessAuthroization(fbb);
      if (accessProperties) { BTypes.AccessAuthorization.addAccessProperties(fbb, accessProperties); }
      ret = BTypes.AccessAuthorization.endAccessAuthorization(fbb);
    }
    return ret;
  }
  static UnpackAuth(authMsg) {
  }
  static PackAabb(fbb, aabb) {
    let ret = undefined;
    if (aabb && aabb.upperFrontLeft && aabb.lowerBackRight) {
      let uFL = BasilServer.PackVector(fbb, aabb.upperFrontLeft);
      let lBR = BasilServer.PackVector(fbb, aabb.lowerBackRight);
      BTypes.AABoundingBox.startAABoundingBox(fbb);
      BTypes.AABoundingBox.addUpperFrontLeft(fbb, uFL);
      BTypes.AABoundingBox.addLowerBackRight(fbb, lBR);
      ret = BTypes.AABoundingBox.endAABoundingBox(fbb);
    }
    return ret;
  }
  static UnpackAabb(aabbMsg) {
  }
  // Pack a Vector3 into the buffer.
  // The passed vector can be either an array or a map of 'x','y','z' values.
  static PackVector3(fbb, vect) {
    let vectArr = undefined;
    if (Array.isArray(vect)) {
      vectArr = vect;
    else
      if (vect.x || vect.X) {
        vectArr = Object.values(vect);
      }
    }
    let ret = undefined;
    if (vectArr && length(vectArr) >= 3) {
      BTypes.Vector3.startVector3(fbb);
      BTypes.Vector3.addX(fbb, vectArr[0]):
      BTypes.Vector3.addY(fbb, vectArr[1]):
      BTypes.Vector3.addZ(fbb, vectArr[2]):
      ret = BTypes.Vector3.endVector3(fbb);
    }
    return ret;
  }
  static UnpackVector3(vectMsg) {
  }
  // Return a list of offsets for PropertyValue's.
  // Input 'props' is a javascript {string:string, string:string, ...} type structure.
  static PackPropertyValueList(fbb, props) {
    let ret = undefined;
    if (props) {
      ret = Object.keys(props).map(key => {
        let keyOffset = fbb.createString(key);
        let valOffset = fbb.createString(props[key]);
        BTypes.PropertyValue.startPropertyValue(fbb);
        BTypes.PropertyValue.addProperty(fbb, keyOffset);
        BTypes.PropertyValue.addValue(fbb, valOffset);
        return BTypes.PropertyValue.endPropertyValue(fbb);
      });
    }
    return ret;
  }
  static UnpackPropertyValueList(propsMsg) {
  }
}
