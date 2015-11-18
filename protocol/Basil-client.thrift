/*
 * Interface to a Basil client.
 * Since the Thrift communcation is asynchronous and bi-directional,
 *    messages can be sent from the server to the client and visa-versa.
 */

namespace cpp org.basilviewer.basil.client.protocol
namespace csharp org.basilviewer.basil.client.protocol
namespace js org.basilviewer.basil.client.protocol
namespace java org.basilviewer.basil.client.protocol

include "BasilType.thrift"

service BasilClient {
    // SESSION MANAGEMENT ===============================================
    void OpenSession (
        1: BasilType.timeCode time,
        2: i32 sequenceNumber,
        3: BasilType.authorizationBlock auth,
        4: BasilType.propertyList features
    ),

    void CloseSession (
        1: BasilType.timeCode time,
        2: i32 sequenceNumber,
        3: string reason
    ),

    void RequestPropertiesResp (
        1: i32 sequenceNumber,
        2: i32 sequenceNumberOfRequest,
        3: BasilType.propertyList requestedProperties,
        4: string propertyMatchOfRequest    // wildcard used to match returned properties
    ),

    void AliveCheck (
        1: BasilType.timeCode time,
        2: i32 sequenceNumber
    ),

    void AliveResponse (
        1: BasilType.timeCode time,
        2: BasilType.timeCode timeReceived,
        3: i32 sequenceNumberReceived
    ),
}
