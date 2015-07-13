---
layout: default
navigation: architecture
---

# Discussions

The protocol between different modules can be described as a discussion.
Each module has its concerns.
For instance, a module could be concerned about its memory usage and thus
will need to limit the number of things it remembers.
Limiting what it remembers means it can't be told about everything and it
and that must sometimes forget about things.
How it handles this concern must be communicated with other modules that
are working with it.
To be more detailed, the [Renderer] cannot store and manage every mesh that
might be in the view. Some are behind the frustum. Some may be far away.
As the [Renderer] learns about more objects, it will need to forget some
others. When it forgets, it should communicate that to the module that
told it about the thing being forgotten as that module might care if the
object is being seen.

This is all a long winded way of saying that the protocol design is built
around communicating the module centric operations to the connected modules
so higher level decisions can be made in a decentralized fashion.
The decision requirements of one module do not need to be embedded in
another module.
And, what must be communicated between the modules is the information
required for each to make the decisions they need to make to fulfill
each modules concerns.

## The Renderer's Concerns

The [Renderer]s main concern is to minimize frame time while maximizing the
number and quality of objects displayed.
A secondary concern is minimizing user interaction latency.

Both of these concerns are handled by managing different optimizations of the
objects being displayed. For instance, a low level-of-detail version of an object
may be used if an object is far away from the view as opposed to a high level-of-detail
version if that object is up close.

[Renderer]: {{ "/architecture/Renderer.html" | prepend: site.baseurl }}

<!-- vim: ts=2 sw=2 ai et spell
-->
