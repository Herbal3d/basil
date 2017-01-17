Basiljs is a growing implementation of the eventual Basil viewer. In the short term,
it has loaders and controls embedded in it but these will be removed in time.

BUILDING

External libraries are in `jslibs` and their name and location is specified
in `js/Basil.js`. ThreeJS has separated controls from the core so some libraries
from ThreeJS must also be copies into `jslibs`:

cp $THREEJS/examples/js/loaders/GLTFLoader.js jslibs
cp $THREEJS/examples/js/controls/OrbitControls.js jslibs


