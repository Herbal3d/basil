
A short explanation of the architecture and design of the messaging system.

The use case is one client communicating with another. There are two communication
types: send with no response and send with a response. The first is called 'one-way'
and the other is called 'RPC'.

The formatting of the message and the actual sending of the message are split into
a 'message' layer,
a 'flow' layer,
and a 'transport' layer.
The 'message' layer creates the base message to be sent.
The 'flow' layer handles the flow of messages as well as RPC communication.
The 'transport' layer allows for
multiple local and remote communication methods (PostMessage, WebWorker events,
WebSocket) which are independent of the protocol.

FlatBuffers is being used for the record formatting. A message to be sent can be
in two forms: raw format or message format.

Raw format is just the FlatBuffer message itself. There must be something about the
message that can be decoded by the receiver (like the file extension field).

Message format is a FlatBuffer message that is defined as having two parts:
a 'BTransportHdr' struct and the 'message' struct. The latter is the message that would have
been sent in the raw format. 'BTransportHdr' is a struct that can optionally contain several
structs:

* responseRequested: this structure is present for RPC messages and includes a
  key that is used to match a response;
* seq: sequence and flow information for the message;
* trace: debugging and trace information (like, if using Zipkin) for the debugging.


The message source creates that message with a FlatBuffer.Builder. It then passes
that Builder to the flow layer. If the message contains a 'BTransportHdr' struct, the flow
layer fills that structure with the approriate stuff. If the 'BTransportHdr' struct contains
a 'responseRequested' struct, it also remembers the response key and callback
for handling the response.

If the Builder does not contain a 'BTransportHdr' struct, the message is not modified.

The Builder is then resolved and the resulting message is passed to the transport layer
for sending.

The receiving flow layer inspects the incoming message for a 'BtransportHdr' struct.
If not present, the message is placed in the receiving queue. If present and if it
includes a 'responseRequested' struct, the return information is saved for the
transmission of the response (which must include a 'BTransportHdr' with a 'response'
struct). Then the message is placed in the receiving queue.

Questions:

The receiving queue ends up with either raw or message format. How does the reader
know the difference? Only queuing the 'message' struct out of the message format
would cause a copy and/or problems with buffer freeing. Maybe the latter isn't a 
problem for JavaScript and C#? What about C++?


