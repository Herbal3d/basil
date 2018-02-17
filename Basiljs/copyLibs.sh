#! /bin/bash
# Copy code from a ThreeJS source tree to the proper place for Basiljs
#
# This expects all the libraries to be GIT pulls into the directory
#   two above the one with this script. So, the process is usually:
#      cd SomeBuildDirectory
#      git clone git@github.com:mrdoob/three.js.git
#      git branch --track dev origin/dev
#      git checkout dev     # Using the development version of ThreeJS
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
JSLIBS=src/jslibs

# Copy ThreeJS and store a file for the date of the primary file
THREEDIR=${PLACE}/../../three.js
THREEJS="$THREEDIR/build/three.min.js"
cp "${THREEJS}" "${JSLIBS}"
STATTIME=$(stat -c '%Y' "${THREEJS}")
THREEJSMODIFYDATE=$(date -d @${STATTIME} +%Y%m%d)
echo ${THREEJSMODIFYDATE} > "${JSLIBS}/three.js.date"

cp $THREEDIR/examples/js/loaders/GLTFLoader.js "${JSLIBS}"
cp $THREEDIR/examples/js/controls/OrbitControls.js "${JSLIBS}"

# =====================================
# Debugging
exit    # comment this to print out where it's getting the libraries from
echo "THREEJS $THREEJS"
echo "THREEJSMODIFYDATE $THREEJSMODIFYDATE"
echo "FBGENBASILSERVER $FBGENBASILSERVER"
echo "FBGENBASILSERVERMODIFYDATE $FBGENBASILSERVERMODIFYDATE"

