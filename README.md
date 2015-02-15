# basil
Modular 3D viewer for virtual worlds and augmented reality.

[Basil project site.](http://misterblue.github.io/basil)

The Basil project is a system of 3D object discovery, manipulation, and display.
It contains many modules to accomplish this:
* Basil Renderer ("BR") displays 3D objects.  This is an X11-like render client specialized for 3D objects;
* Basil Basic User Interface ("BBUI") communicates with BR to display a basic virtual, world-centric user interface;
* Basil Basic World Manager" ("BBWM") manages connections to virtual worlds. It finds and instantiates connection modules to virtual world or augmented reality object sources;

Added to these base modules are connection modules to connect the viewer
components to object repositories. If the viewer is being used to inhabit a
virtual world, the repositories would hold the world to view.
If the viewer is being used for augmented reality, the repositories would
be locations of objects in the real world.

Architecturally, the interface between the modules is defined by their APIs
and associated protocols.
This way, the modules can have different implementations, can be distributed
(run in more than one process or computer), and can evolve independently.

The initial implementation of BR, BBUI, and BBWM is in JavaScript to use the
dynamic linking features and to make the initial viewer widely available.
BR initially uses WebGL although there is no reason it couldn't be implemented
in different languages and specialized for specific platforms.

