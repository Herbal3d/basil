#! /bin/bash
# Copy code from a ThreeJS source tree to the proper place for Basiljs

# cd into the directory containing this copy script
cd "$( cd "$(dirname "${BASH_SOURCE[0]}" )" && pwd )"

THREE=$HOME/three.js
BABYLON=$HOME/Babylon.js

cp $THREE/build/three.min.js jslibs/
cp $THREE/examples/js/loaders/GLTFLoader.js jslibs/
cp $THREE/examples/js/loaders/GLTF2Loader.js jslibs/
cp $THREE/examples/js/controls/OrbitControls.js jslibs/

cp "$BABYLON/dist/preview release/babylon.js" jslibs/
cp "$BABYLON/dist/preview release/loaders/babylon.glTFFileLoader.js" jslibs/

# Since we're using development copies of the graphics libraries, rename the
#    base files to include the date they were captured.
#        cd jslibs
#        mv three.min.js three-20170305.min.js
#        mv babylon.core.js babylon.core-20170302.js
# AFTER DOING THE COPY AND MOVE, edit requireConfig.js to point to the correct filenames.

