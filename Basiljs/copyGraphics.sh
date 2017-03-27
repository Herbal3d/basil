#! /bin/bash
# Copy code from a ThreeJS source tree to the proper place for Basiljs

# cd into the directory containing this copy script
cd "$( cd "$(dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Copy ThreeJS and store a file for the date of the primary file
THREEDIR=$HOME/three.js
THREEJS="$THREEDIR/build/three.min.js"
cp "${THREEJS}" jslibs/
STATTIME=$(stat -c '%Y' "${THREEJS}")
THREEJSMODIFYDATE=$(date -d @${STATTIME} +%Y%m%d)
echo ${THREEJSMODIFYDATE} > jslibs/three.js.date

cp $THREEDIR/examples/js/loaders/GLTFLoader.js jslibs/
cp $THREEDIR/examples/js/loaders/GLTF2Loader.js jslibs/
cp $THREEDIR/examples/js/controls/OrbitControls.js jslibs/

# =====================================
# Copy BabylonJS and store a file for the date of the primary file
BABYLONDIR=$HOME/Babylon.js
BABYLONJS="$BABYLONDIR/dist/preview release/babylon.js"
cp "${BABYLONJS}" jslibs/
STATTIME=$(stat -c '%Y' "${BABYLONJS}")
BABYLONJSMODIFYDATE=$(date -d @${STATTIME} +%Y%m%d)
echo ${BABYLONJSMODIFYDATE} > jslibs/babylon.js.date

cp "$BABYLONDIR/dist/preview release/loaders/babylon.glTFFileLoader.js" jslibs/

echo "THREEJS $THREEJS"
echo "THREEJSMODIFYDATE $THREEJSMODIFYDATE"
echo "BABYLONJS $BABYLONJS"
echo "BABYLONJSMODIFYDATE $BABYLONJSMODIFYDATE"
