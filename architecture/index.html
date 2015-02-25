---
layout: default
navigation: architecture
---

# Architecture

Basil is a rendering system for viewing 3d objects.
Its purpose is to organized accessors, converters, cachers, and rendering
hardware and software to present a view of the 3D objects.

The 'view' process is imagined to be:
* the observer is at a location and looking in a direction
  (a view camera has a location and a direction);
* the world is queried as to what can be seen from here in that direction;
* the response to this query is multiple handles to various information and
  3d object servers that will handle portions of the 3d space being viewed.
  This fills the view space with smaller 3d spaces and their associated
  servers who have the information to fill the spaces;
* the viewer then queries the servers for contents for the smaller view spaces;
* the viewer displays the received information and objects relative to
  the viewers camera location;
* as the viewers camera moves, the display of information and objects is
  adjusted and, potentially, additional world queries are made to find more
  information and object servers to fill the viewed space.

Within Basil, the process of querying the world and collecting the servers
is handled by the [World Manager](ref-worldManager).
The [World Manager](ref-worldManager) queries for object sources,
finds and loads the adaptors to convert the sources objects to the
[Basil Renderer](ref-renderer) APIs, and then manages this collection
of connections as the view camera moves in the world space.

If the view is being created for a person, the person interacts with
the view though a [User Interface Manager](ref-userInterfaceManager)
which, talking to the renderer, displays interaction objects in the view
and communicates those interactions to the [World Manager](ref-worldManager)
or, possibly to one of the object server connectors.

There is additionally the [Session Manager](ref-sessionManager) which handles
the communication and state between all the parts for a particular individual
session. The [Session Manager](ref-sessionManager) handles the configuration
parameters for the session and all the modules that make up the session.

Refer to the [Use Cases](ref-useCases) for descriptions of how this new model
works for different uses.
The use cases described include
[augmented reality goggles](ref-useCaseAugmentedReality),
[virtual world 3d goggles](ref-useCaseVWGoggles),
[3d views of virtual worlds in browsers](ref-useCaseVWBrowser),
and 
[a merged 3d view into multiple virtual worlds](ref-useCaseMultipleVW).

## Block Diagram

This block  diagram is an idealized view of a complete renderer.

# Philosophy

The Basil viewer system presents a rendered view of objects in a 3D space.
The objects can represent things in the real world or in a virtual world.
The viewer system is extensible and can accommodate new object spaces by the
addition of modules.

The modules are defined by their functionality, interface, and, optionally, by
the protocol to communicate with the module. The relationship between modules
and where they run (some computer, different computer, same address space, ...)
is not defined so many operational configurations are possible -- it depends on
what is best for the specific function provided by the module.

Basil tries to keep functionality separate preferring to defined single function
modules that communicate through an API rather than conflating functionality into
one module. Thought should always be given to where new functionality should be
added. For instance, animation functionality is often added to a renderer because
of needed interactions between the animation computation and the frame update
timing. Architecturally, though, it would be better to add to the renderer
the ability to add inter-frame computation modules and then add animation, bones,
etc as separate functional modules. This extended the renderer with its needed
functionality and doesn't embed specific additional functions into the renderer.

The initial implementation is in JavaScript but that is not required.
Future module implementations can be in any programming language as long as
the API interfaces are kept.

ref-worldManager: /architecture/WorldManager.html
ref-renderer: /architecture/Renderer.html
ref-userInterfaceManager: /architecture/UserInterfaceManager.html
ref-sessionManager: /architecture/SessionManager.html
ref-useCaseAugmentedReality): /architecture/UseCases.html#Augmented%20Reality
ref-useCaseVWGoggles): /architecture/UseCases.html#Virtual%20World%20Goggles
ref-useCaseVWBrowser): /architecture/UseCases.html#Virtual%20World%20Browser
ref-useCaseMultipleVW:  /architecture/UseCases.html#Multiple%20VIrtual%20Worlds

<!-- vim: ts=2 sw=2 ai et spell
-->
