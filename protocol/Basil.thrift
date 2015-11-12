/*
 * Interface to Basil
 */

namespace cpp org.basilviewer.basil.protocol
namespace csharp org.basilviewer.basil.protocol
namespace js org.basilviewer.basil.protocol
namespace java org.basilviewer.basil.protocol

include "BasilTypes.thrift"

typedef string objectIdentifier
typedef int32 compactIdentifier

struct aaBoundingBox {
}

struct objectDisplayInfo {
    aaBoundingBox aabb,
}

struct objectDescription {
    1: required objectIdentifier id,
    2: objectDisplayInfo displayInfo,
}

struct objectPositionInfo {
    1: required objectIdentifier id,
    2: required Vector3 pos,
    3: required Quaterion rot,
    4: Vector3 vel,
    5: pathDescription path
}

service Basil {
    // Describe an object to Basil for later display or manipulation
    // This associates an ID with a block of asset information that can be 
    //   later displayed or operated on.
    void IdentifyDisplayableObject {
        1: required objectIdentifier id,
        1: required compactIdentifier idc,
        2: aaBoundingBox aabb,
        3: assetInformation assetInfo
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


