# Basil
Modular 3D viewer for virtual worlds and augmented reality.

[Basil project site.](http://misterblue.github.io/basil)

Basil is a 3D object viewer. That sounds like a thousand other projects
doesn't it?
Well, Basil is different in that its architecture is like an X11 server.

Basil's archtecture is an attempt to build a virtual world and
augemented reality viewer where an [OpenSimulator] avatar can stand
next to a [High Fidelity] avatar. And even interact.

For a person to look into a virtual world, there needs to be some device and
software to render a view of that virtual world onto that device.
These days, the hot devices are head mounted, stereographic displays
(see [Oculus], [GearVR], and many many more) but 2D monitor screens and
tablets and phones do the job.

There are problems of the view (latency, rendering, frame-rate, ...)
which don't have a direct relationship with the actual content of
the world (indirect in that types of content will cause different
frame rates and such).
But this leads me to think of the 'viewer' as separate from the content
and even separate from the user interactions.

The [X Window System] was that for 2D windows -- it provided a display
server to which multiple window applications connected to.
One of the applications was a windows manager which created the window
decorations (title bar, scroll bars, ...) and handled the user interactions
(window movement, mouse control, ...).
In the [X Window System], both the content and management were outside the viewer.
This makes them distributable (could run on different computers, ...)
and modular (multiple window managers, ...).
The X Window System viewer focuses on efficiently displaying the 2D windows
and lets everything else happen in the external applications.

What if a 3D version of this was built?
Not just a version of the 2D windows viewer that draws 3D but a viewer
built to accept connections from multiple 3D object sources
and display them in a 3D space for some display.
The viewer would handle efficiently displaying the right thing for the particular
display.
There is no reason why there couldn't be completely different
viewers for different displays.

Behind the viewer would be all the applications that present the 3D objects
to the viewer as objects in a space to be displayed. Another application would
manage that space for the user -- whatever that management should be.
And there could easily be different space and interaction managers.

So, Basil is such a 3D viewer. It provides the features of a modern 3D
renderer with a external, remotable API and the framework for multiple
object sources to connect to it and display and interact with 3D objects.

Related projects are:
* [Pesto]: A session manager to control the many sources connected to Basil
* [Loc-Loc]: A universal space server registration and lookup service
* [Ragu]: [OpenSimulator] space server

[Basil]: http://misterblue.github.io/basil/
[OpenSimulator]: http://opensimulator.org/
[Oculus]: https://www.oculus.com/
[GearVR]: http://www.samsung.com/global/microsite/gearvr/
[High Fidelity]: http://highfidelity.io/
[X Window System]: http://en.wikipedia.org/wiki/X_Window_System
[Presto]:  http://misterblue.github.io/presto/
[Loc-Loc]: http://misterblue.github.io/loc-loc/
[Ragu]: http://misterblue.github.io/ragu/
