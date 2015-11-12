/*
 * Interface to Basil
 */

namespace cpp org.basilviewer.basil.server.protocol
namespace csharp org.basilviewer.basil.server.protocol
namespace js org.basilviewer.basil.server.protocol
namespace java org.basilviewer.basil.server.protocol

include "BasilTypes.thrift"

service Basil {
    // Describe an object to Basil for later display or manipulation
    // This associates an ID with a block of asset information that can be 
    //   later displayed or operated on.
    void IdentifyDisplayableObject {
        1: required objectIdentifier id,
        2: required compactIdentifier idc,
        3: aaBoundingBox aabb,
        4: required assetInformation assetInfo
    },

    // Update a property of an object
    void UpdateObjectProperty {
        1: required compactIdentifier idc,
        2: required propertyName prop,
        3: required propertyValue propValue
    },

    void UpdateObjectPosition {
        1: required compactIdentifier idc,
        2: required objectPositionInfo pos
    }
}



