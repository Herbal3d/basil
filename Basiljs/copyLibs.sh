#! /bin/bash
# Copy code from a ThreeJS source tree to the proper place for Basiljs
# Also copies FlatBuffer support files.
#
# This expects all the libraries to be GIT pulls into the directory
#   two above the one with this script. So, the process is usually:
#      cd SomeBuildDirectory
#      git clone git@github.com:mrdoob/three.js.git
#      git branch --track dev origin/dev
#      git checkout dev     # Using the development version of ThreeJS
#      git clone git@github.com:BabylonJS/Babylon.js.git
#      git clone https://github.com/AnalyticalGraphicsInc/cesium.git
#      git clone git@github.com:google/flatbuffers.git
#      git clone git@github.com:Misterblue/Basil-protocol.git
#      git clone git@github.com:Misterblue/basil.git
#      cd basil/Basiljs
#      ./updateLibs.sh      # fetch and build latest versions of libraries
#      ./copyLibs.sh        # Finally copy all the libraries to be used

# cd into the directory containing this copy script
cd "$( cd "$(dirname "${BASH_SOURCE[0]}" )" && pwd )"
PLACE=$(pwd)

# Copy ThreeJS and store a file for the date of the primary file
THREEDIR=${PLACE}/../../three.js
THREEJS="$THREEDIR/build/three.min.js"
cp "${THREEJS}" jslibs/
STATTIME=$(stat -c '%Y' "${THREEJS}")
THREEJSMODIFYDATE=$(date -d @${STATTIME} +%Y%m%d)
echo ${THREEJSMODIFYDATE} > jslibs/three.js.date

cp $THREEDIR/examples/js/loaders/GLTFLoader.js jslibs/
# cp $THREEDIR/examples/js/loaders/GLTF2Loader.js jslibs/
cp $THREEDIR/examples/js/controls/OrbitControls.js jslibs/

# =====================================
# Copy BabylonJS and store a file for the date of the primary file
BABYLONDIR=${PLACE}/../../Babylon.js
BABYLONJS="$BABYLONDIR/dist/preview release/babylon.js"
cp "${BABYLONJS}" jslibs/
STATTIME=$(stat -c '%Y' "${BABYLONJS}")
BABYLONJSMODIFYDATE=$(date -d @${STATTIME} +%Y%m%d)
echo ${BABYLONJSMODIFYDATE} > jslibs/babylon.js.date

cp "$BABYLONDIR/dist/preview release/loaders/babylon.glTFFileLoader.js" jslibs/

# =====================================
# Copy Cesium and store a file for the date of the primary file
CESIUMDIR=${PLACE}/../../cesium
CESIUM="$CESIUMDIR/Build/Cesium"
cp -r "${CESIUM}" jslibs/
STATTIME=$(stat -c '%Y' "${CESIUM}")
CESIUMMODIFYDATE=$(date -d @${STATTIME} +%Y%m%d)
echo ${CESIUMMODIFYDATE} > jslibs/cesium.date

# =====================================
# Copy the FlatBuffer code
FLATBUFFERDIR=${PLACE}/../../flatbuffers
FLATBUFFERJS=${FLATBUFFERDIR}/js/flatbuffers.js
cp "${FLATBUFFERJS}" jslibs/

STATTIME=$(stat -c '%Y' "${FLATBUFFERJS}")
FLATBUFFERSMODIFYDATE=$(date -d @${STATTIME} +%Y%m%d)
echo ${FLATBUFFERJSMODIFYDATE} > jslibs/flatbuffers.js.date

# =====================================
# Copy the generated FlatBuffer interface code
FBGENDIR=${PLACE}/../../Basil-protocol
FBGENBASILTYPES=${FBGENDIR}/gen-BasilTypes-js/BasilTypes_generated.js
FBGENBFLOW=${FBGENDIR}/gen-BFlow-js/BFlow_generated.js
FBGENBASILSERVER=${FBGENDIR}/gen-BasilServer-js/BasilServer_generated.js
cp "$FBGENBASILTYPES" jslibs/
cp "$FBGENBFLOW" jslibs/
cp "$FBGENBASILSERVER" jslibs/

STATTIME=$(stat -c '%Y' "${FBGENBASILSERVER}")
FBGENBASILSERVERMODIFYDATE=$(date -d @${STATTIME} +%Y%m%d)
echo ${FBGENBASILSERVERMODIFYDATE} > jslibs/BasilServer_generated.js.date

# =====================================
# Debugging
exit    # comment this to print out where it's getting the libraries from
echo "THREEJS $THREEJS"
echo "THREEJSMODIFYDATE $THREEJSMODIFYDATE"
echo "BABYLONJS $BABYLONJS"
echo "BABYLONJSMODIFYDATE $BABYLONJSMODIFYDATE"
echo "FLATBUFFERJS $FLATBUFFERJS"
echo "FLATBUFFERJSMODIFYDATE $FLATBUFFERJSMODIFYDATE"
echo "FBGENBASILSERVER $FBGENBASILSERVER"
echo "FBGENBASILSERVERMODIFYDATE $FBGENBASILSERVERMODIFYDATE"

