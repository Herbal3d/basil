
A short explanation of the architecture and design of the messaging system.

The use case is one client communicating with another. There are two communication
types: send with no response and send with a response. The first is called 'one-way'
and the other is called 'RPC'.

After researching the many, many, many different messaging systems that are suitable
for browsers (NodeJS, ZeroMQ, nanomsg, ...), I decided that, in the short term,
Basil would role its own simple messaging system. Someday, this will be replaced
with a "real" messaging system but, for now, the requirements of simple and
multiple transport requirements (TCP, UDP, ...), lead to this design.

The formatting of the message and the actual sending of the message are split into
a 'message' layer,
a 'flow' layer,
and a 'transport' layer.
The 'message' layer creates the base message to be sent.
The 'flow' layer handles the flow of messages as well as RPC communication.
The 'transport' layer allows for
multiple local and remote communication methods (PostMessage, WebWorker events,
WebSocket) which are independent of the protocol.

Protobuf is being used for the record formatting.

Message format is a Protobuf message that includes a BTransport entry (usually
named 'transport'). This entry includes:

* requestSession: this variable is present for RPC messages and includes a
  key that is used to match a response;
* seq: sequence and flow information for the message;
* trace information: debugging and trace information (like, if using Zipkin)
    for the debugging.

The message source creates a message using the built ProtobufJS code. It then passes
the message to the flow layer. If the request is an RPC style call, the requestSession
variable is set and the callback is saved for the eventual response.

The receiving flow layer will either queue the incoming message or, if the
requestSession value is set, execute the callback for the response.
