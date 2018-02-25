#! /bin/bash
# Script to update all the dependent libraries and copy the updates
#    into this project.
# This exists mostly so I'll remember the steps.

cd "$( cd "$(dirname "${BASH_SOURCE[0]}" )" && pwd )"
PLACE=$(pwd)

JSLIBS=${PLACE}/src/jslibs

UPDATEDATE=$(date +%Y%m%d)
echo "${UPDATEDATE}" > "${JSLIBS}/update.date"

echo "=== Fetch ThreeJS"
THREEDIR=$PLACE/../../three.js
cd "$THREEDIR"
git checkout master
git pull --all
git checkout dev
git pull
cp "$THREEDIR/build/three.min.js" "$JSLIBS"
cp "$THREEDIR/examples/js/loaders/GLTFLoader.js" "${JSLIBS}"
cp "$THREEDIR/examples/js/controls/OrbitControls.js" "${JSLIBS}"

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
        $BASILPROTDIR/protocol/Basil*.proto \
        > "$JSLIBS/BasilServerMessages.js"

# echo "=== Copy libraries into BasilJS"
# cd "${PLACE}"
# ./copyLibs.sh

cd "${PLACE}"



