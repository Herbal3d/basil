---
layout: default
navigation: home
---

The Basil Project is a system of 3D object discovery, manipulation, and display.
Basil can be used to create virtual worlds, games, or augmented reality.
The display may be a computer screen, a tablet, head mounted goggles, or
a heads up display. 

Basil accomplishes this through a few base modules:

* Basil Renderer ("BR") displays 3D objects.
  This is an X11-like render client specialized for 3D objects;
* Basil Basic User Interface ("BBUI") communicates with BR providing a basic
  virtual, world-centric user interface;
* Basil Basic Session Manager" ("BBSM") manages connections to virtual worlds.
  It finds and instantiates connection modules to virtual world or augmented reality object sources;

Added to these modules are connection modules which connect the viewer
components to object repositories. If the viewer is being used to inhabit a
virtual world, the repositories hold the world to view.
If the viewer is being used for augmented reality, the repositories contain
locations and representations of objects in the real world.

Architecturally, the interface between the modules is defined by their APIs
and associated protocols.
This way, modules can have different implementations, can be distributed
(run in more than one process or computer), and can evolve independently.

BR, BBUI, and BBSM are initially implemented in in JavaScript to use the
dynamic linking features and to make the initial viewer widely available.
BR initially uses WebGL although there is no reason it couldn't be implemented
in different languages and specialized for specific platforms.

<ul class="post-list">
  {% for post in site.posts %}
    {% if post.status == "publish" %}
      {% include one-post.html thepost=post thecontent=post.content ownpage="no" %}
    {% endif %}
  {% endfor %}

<!-- vim: ts=2 sw=2 ai et spell
-->
