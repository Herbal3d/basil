#! /bin/bash
# Script to update all the dependent libraries and copy the updates
#    into this project.
# This exists mostly so I'll remember the steps.

cd "$( cd "$(dirname "${BASH_SOURCE[0]}" )" && pwd )"
PLACE=$(pwd)

JSLIBS=${PLACE}/src/jslibs
JUSTVIEW=${PLACE}/justview

UPDATEDATE=$(date +%Y%m%d)
echo "${UPDATEDATE}" > "${JSLIBS}/update.date"

echo "=== Fetch ThreeJS"
THREEDIR=$PLACE/../../three.js
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
cp "$THREEDIR/examples/js/Detector.js" "${JSLIBS}"
cp "$THREEDIR/examples/js/libs/stats.min.js" "${JSLIBS}"

cp "$THREEDIR/build/three.min.js" "${JUSTVIEW}"
cp "$THREEDIR/examples/js/controls/OrbitControls.js" "${JUSTVIEW}"
cp "$THREEDIR/examples/js/loaders/GLTFLoader.js" "${JUSTVIEW}"
cp "$THREEDIR/examples/js/Detector.js" "${JUSTVIEW}"
cp "$THREEDIR/examples/js/libs/stats.min.js" "${JUSTVIEW}"

echo "=== Fetch Basil-protocol"
BASILPROTDIR=$PLACE/../../Basil-protocol
cd "$BASILPROTDIR"
git checkout master
git pull --all

echo "=== Fetch protobuf.js"
PROTOBUFJSDIR=$PLACE/../../protobuf.js
cd "${PROTOBUFJSDIR}"
chmod -x bin/*
git checkout master
git pull --all
# npm update
chmod +x bin/*
mkdir -p "$JSLIBS/protobufjs/minimal"
cp -r dist/protobuf*.js "$JSLIBS/protobufjs"
cp -r dist/minimal/protobuf*.js "$JSLIBS/protobufjs/minimal"

echo "=== Build JS code for Basil-protocol"
cd "${PROTOBUFJSDIR}"
./bin/pbjs -t static-module \
        --wrap es6 \
        --no-comments \
        $BASILPROTDIR/protocol/BasilServer.proto \
        $BASILPROTDIR/protocol/BasilTypes.proto \
        $BASILPROTDIR/protocol/BTransport.proto \
        > "$JSLIBS/BasilServerMessages.js"

cd "${PLACE}"

