/*
 * Interface to Pesto client
 */

namespace cpp org.basilviewer.pesto.client.protocol
namespace csharp org.basilviewer.pesto.client.protocol
namespace js org.basilviewer.pesto.client.protocol
namespace java org.basilviewer.pesto.client.protocol

include "BasilType.thrift"

service PestoClient {

    // NOTIFICATIONS ======================================
    void Notify (
        1: required string topic,
        2: required string msg
    )
}



