/*
 * Interface to Pesto, the session manager
 */

namespace cpp org.basilviewer.pesto.server.protocol
namespace csharp org.basilviewer.pesto.server.protocol
namespace js org.basilviewer.pesto.server.protocol
namespace java org.basilviewer.pesto.server.protocol

include "BasilType.thrift"

service Pesto {

    // NOTIFICATIONS ======================================
    void Subscribe (
        1: required string topic
    ),

    void UnSubscribe (
        1: required string topic
    ),

    void Notify (
        1: required string topic,
        2: required string msg
    ),

}



