/*
 * Interface to Basil
 */

namespace cpp org.basilviewer.basil.server.protocol
namespace csharp org.basilviewer.basil.server.protocol
namespace js org.basilviewer.basil.server.protocol
namespace java org.basilviewer.basil.server.protocol

include "BasilType.thrift"

service BasilServer {
    // Describe an object to Basil for later display or manipulation
    // This associates an ID with a block of asset information that can be 
    //   later displayed or operated on.
    void IdentifyDisplayableObject (
        1: BasilType.objectIdentifier id,
        2: BasilType.assetInformation assetInfo,
        3: BasilType.accessAuthorization accessInfo,
        4: BasilType.aaBoundingBox aabb
    ),

    void CreateObjectInstance (
        1: BasilType.objectIdentifier id,
        2: BasilType.instanceIdentifier idc,
        3: BasilType.instancePositionInfo pos,
        4: BasilType.propertyList propertiesToSet
    ),

    // Update a property of an object. This could effect all instances.
    void UpdateObjectProperty (
        1: BasilType.objectIdentifier objectId,
        2: BasilType.propertyList props
    ),

    // Update a property of an object
    void UpdateInstanceProperty (
        1: BasilType.instanceIdentifier instanceId,
        2: BasilType.propertyList props
    ),

    void UpdateInstancePosition (
        1: BasilType.instanceIdentifier instanceId,
        2: BasilType.instancePositionInfo pos
    ),

    // CONNECTION MANAGEMENT ===============================================
    void OpenSession (
        1: BasilType.timeCode time,
        2: required BasilType.messageSequenceNumber sequenceNumber,
        3: BasilType.accessAuthorization auth,
        4: BasilType.propertyList features
    ),

    void CloseSession (
        1: BasilType.timeCode time,
        2: BasilType.messageSequenceNumber sequenceNumber,
        3: string reason
    ),

    void RequestProperties (
        1: i32 sequenceNumber,
        2: string propertyMatch   // wildcard used to match returned properties
    ),

    void AliveCheck (
        1: BasilType.timeCode time,
        2: i32 sequenceNumber
    ),

    void AliveResponse (
        1: BasilType.timeCode time,
        2: BasilType.timeCode timeReceived
        3: i32 sequenceNumberReceived
    ),
}



