
A short explanation of the architecture and design of the messaging system.

The use case is one client communicating with another. There are two communication
types: send with no response and send with a response. The first is called 'one-way'
and the other is called 'RPC'.

After researching the many, many, many different messaging systems that are suitable
for browsers (NodeJS, ZeroMQ, nanomsg, ...), I decided that, in the short term,
Basil would role its own simple messaging system. Someday, this will be replaced
with a "real" messaging system but, for now, the requirements of simple and
multiple transport requirements (TCP, UDP, ...), lead to this design.

Protobuf is being used for the record formatting.
