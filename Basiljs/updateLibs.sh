#! /bin/bash
# Script to update all the dependent libraries and copy the updates
#    into this project.
# This exists mostly so I'll remember the steps.

cd "$( cd "$(dirname "${BASH_SOURCE[0]}" )" && pwd )"
PLACE=$(pwd)

JSLIBS=${PLACE}/src/jslibs

UPDATEDATE=$(date +%Y%m%d)
echo "${UPDATEDATE}" > "${JSLIBS}/update.date"

DOUPDATETHREEJS="no"
DOUPDATEFLATBUFFERS="no"
DOUPDATEBASILPROTOCOL="no"
DOBUILDBASILPROTOCOL="yes"

THREEDIR=$PLACE/../../three.js
if [[ "$DOUPDATETHREEJS" == "yes" ]] ; then
    echo "=== Fetch ThreeJS"
    cd "$THREEDIR"
    git checkout master
    git pull --all
    git checkout dev
    git pull
    cp "$THREEDIR/build/three.min.js" "${JSLIBS}"
    cp "$THREEDIR/examples/js/loaders/GLTFLoader.js" "${JSLIBS}"
    cp "$THREEDIR/examples/js/loaders/DRACOLoader.js" "${JSLIBS}"
    cp "$THREEDIR/examples/js/loaders/FBXLoader.js" "${JSLIBS}"
    cp "$THREEDIR/examples/js/loaders/ColladaLoader.js" "${JSLIBS}"
    cp "$THREEDIR/examples/js/loaders/OBJLoader.js" "${JSLIBS}"
    cp "$THREEDIR/examples/js/loaders/BVHLoader.js" "${JSLIBS}"
    cp "$THREEDIR/examples/js/controls/OrbitControls.js" "${JSLIBS}"
    cp "$THREEDIR/examples/js/libs/stats.min.js" "${JSLIBS}"
else
    echo "=== Not updating ThreeJS"
fi

FLATBUFFERSJSDIR=$PLACE/../../flatbuffers
if [[ "$DOUPDATEFLATBUFFERS" == "yes" ]] ; then
    echo "=== Fetch flatbuffers.js"
    cd "$FLATBUFFERSJSDIR"
    git checkout master
    git pull --all
    make
    cp "${FLATBUFFERSJSDIR}/js/flatbuffers.js" "$JSLIBS"
else
    echo "=== Not updating flatbuffers"
fi

BASILPROTDIR=$PLACE/../../Basil-protocol
if [[ "$DOUPDATEBASILPROTOCOL" == "yes" ]] ; then
    echo "=== Fetch Basil-protocol"
    cd "$BASILPROTDIR"
    git checkout master
    git pull --all
else
    echo "=== Not fetching latest Basil-protocol"
fi

if [[ "$DOBUILDBASILPROTOCOL" == "yes" ]] ; then
    echo "=== Build JS code for Basil-protocol"
    cd "$BASILPROTDIR"
    ./makeStubs.sh
    cp gen-BasilTypes-js/*.js "$JSLIBS"
    cp gen-BasilServer-js/*.js "$JSLIBS"
    cp gen-BMessage-js/*.js "$JSLIBS"
else
    echo "=== Not building new stubs for Basil-protocol"
fi
