---
layout: default
navigation: architecture
---

# Renderer

The purpose of the renderer is rendering.

An X11 server takes connections from multiple clients and presents a
model of 2d windows that contain text or graphics.
There are different windows managers that connect to the service
and presents controls for the user to move and manage the
windows.

The Basil renderer follows this model for 3D. Multiple object sources
connect to the Renderer and instruct the Renderer on the coordinates
of objects that are defined as meshes, textures, and shaders. The Renderer
handles the job of efficiently displaying the objects in the view.

A [UserInterfaceManager] can connect to the Renderer and present controls
to the user and otherwise manage the appearance and management of
the 3D view.

The renderer has the concept of a camera and its view frustum which
defines the view that is displayed.
The camera is moved by external commands and can follow the user's
view of the world.
For augmented reality applications, for instance, the camera would be
moved to correspond to the user's head movements. The Renderer would
just display the objects in the current camera's view.

Objects locations are either relative to the current coordinate space
or are relative to the camera/frustum position.
By making objects relative to the camera, user interface objects can
be created that are always rendered in the same location in the user's view.

The Renderer tries to focus only on the tools needed for rendering the
3D scene.
Many 3D world renderers end up containing animation or interaction features
(like skeletal animation) but, this is not required for rendering.
These features exist either to create a complete scene rendering package
(all features in one package) or to allow the interaction between the
feature and the rendering pipeline. Animation, for instance, needs to
interact with the frame times to create real time continuous animations.
The Basil Renderer does include these features but, to provide the
rendering synchronization feature, it includes the ability to add
code that can be tied to the rendering times.
This feature is either presented as a high performance API or the
ability to dynamically load code into the Renderer.

[UserInterfaceManager]: {{ "/architecture/UserInterfaceManager.html" | prepend: site.baseurl }}

<!-- vim: ts=2 sw=2 ai et spell
-->
