#! /bin/bash
# Script to update all the dependent libraries and copy the updates
#    into this project.
# This exists mostly so I'll remember the steps.

cd "$( cd "$(dirname "${BASH_SOURCE[0]}" )" && pwd )"
PLACE=$(pwd)

JSLIBS=${PLACE}/src/jslibs

UPDATEDATE=$(date +%Y%m%d)
echo "${UPDATEDATE}" > "${JSLIBS}/update.date"

DOUPDATETHREEJS="yes"

THREEDIR=$PLACE/../../../three.js
if [[ "$DOUPDATETHREEJS" == "yes" ]] ; then
    echo "=== Fetch ThreeJS"
    TMPDIR=/tmp/three$$
    THREEZIP=https://github.com/mrdoob/three.js/archive/master.zip
    THREEDIR=three.js-master
    mkdir -p "$TMPDIR"
    cd "$TMPDIR"
    echo "=== Fetching ThreeJS from ${THREEZIP}"
    curl -OL "$THREEZIP"
    unzip "$(basename $THREEZIP)"

    cp "$THREEDIR/build/three.min.js" "${JSLIBS}"
    cp "$THREEDIR/examples/jsm/loaders/GLTFLoader.js" "${JSLIBS}"
    cp "$THREEDIR/examples/jsm/loaders/DRACOLoader.js" "${JSLIBS}"
    cp "$THREEDIR/examples/jsm/loaders/FBXLoader.js" "${JSLIBS}"
    cp "$THREEDIR/examples/jsm/loaders/ColladaLoader.js" "${JSLIBS}"
    cp "$THREEDIR/examples/jsm/loaders/OBJLoader.js" "${JSLIBS}"
    cp "$THREEDIR/examples/jsm/loaders/BVHLoader.js" "${JSLIBS}"
    cp "$THREEDIR/examples/jsm/controls/OrbitControls.js" "${JSLIBS}"
    # cp "$THREEDIR/examples/js/libs/stats.min.js" "${JSLIBS}"

    cd "$PLACE"
    rm -rf "$TMPDIR"
else
    echo "=== Not updating ThreeJS"
fi


cd "${PLACE}"

