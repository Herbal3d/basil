---
layout: default
navigation: home
---
Basil is the viewer portion of a larger project to build a a system of
3D object discovery, manipulation, and display.
Basil can be used to view virtual worlds, games, or augmented reality.
The display may be a computer screen, a tablet, head mounted goggles, or
a heads up display. 

The Basil viewer is surrounded by several other components:

* Basil Viewer to display 3D objects.
  This is an X11-like render client specialized for 3D objects;
* [Pesto] session manager manages connections to virtual worlds.
  It finds and instantiates connection modules to virtual world or augmented reality object sources;
* [Loc-Loc] is a univeral space server registration and lookup service.
* [Ragu] connects the Basil viewer to an [OpenSimulator] world to display
  the objects and avatars from there.

Added to these modules are connection modules which connect the viewer
components to object repositories. If the viewer is being used to inhabit a
virtual world, the repositories hold the world to view.
If the viewer is being used for augmented reality, the repositories contain
locations and representations of objects in the real world.

Architecturally, the interface between the modules is defined by their APIs
and associated protocols.
This way, modules can have different implementations, can be distributed
(run in more than one process or computer), and can evolve independently.

<ul class="post-list">
  {% for post in site.posts %}
    {% if post.status == "publish" %}
      {% include one-post.html thepost=post thecontent=post.content ownpage="no" %}
    {% endif %}
  {% endfor %}

[OpenSimulator]: http://opensimulator.org/
[Pesto]:  http://misterblue.github.io/pesto/
[Loc-Loc]: http://misterblue.github.io/loc-loc/
[Ragu]: http://misterblue.github.io/ragu/
<!-- vim: ts=2 sw=2 ai et nospell
-->
