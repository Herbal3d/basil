Basiljs is a growing implementation of the eventual Basil viewer. In the short term,
it has loaders and controls embedded in it but these will be removed in time.

The development goal is to experiment with WebGL and its display capabilities
as well as try out libraries and frameworks. Internally, developing the interface
between the 3D content fetchers and the renderer portion is an important goal.
To that end, this viewer uses either [ThreeJS] or [BabylonJS] for rendering
engines.

The rendering engine can be changed by adding a query to the end of the URL:
"?engine=ThreeJS" or "?engine=BabylongJS". Default is [ThreeJS].

BUILDING

External libraries are in `jslibs` and their name and location is specified
in `js/Basil.js`. The build environment is to have a directory that has
repositories for the third party components as well as this repository.
Check out the script 'updateLib.sh' which pulls the latest version of
the other repositories and copies the library files into 'jslibs'.

[ThreeJS]: https://threejs.org/
[BabylonJS]: http://www.babylonjs.com/

