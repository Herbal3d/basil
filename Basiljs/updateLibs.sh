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
DOUPDATEBASILPROTO="yes"
DOUPDATEPROTOBUF="yes"
DOBUILDBASILPROTO="yes"

THREEDIR=$PLACE/../../../three.js
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

BASILPROTODIR=$PLACE/../../Basil-protocol
if [[ "$DOUPDATEBASILPROTO" == "yes" ]] ; then
    echo "=== Fetch Basil-protocol"
    cd "$BASILPROTODIR"
    git checkout master
    git pull --all
else
    echo "=== Not updating Basil-protocol"
fi

PROTOBUFJSDIR=$PLACE/../../../protobuf.js
if [[ "$DOUPDATEPROTOBUF" == "yes" ]] ; then
    echo "=== Updating protobuf.js"
    cd "${PROTOBUFJSDIR}"
    chmod -x bin/*
    git checkout master
    git pull --all
    # npm update
    chmod +x bin/*
    mkdir -p "$JSLIBS/protobufjs/minimal"
    cp -r dist/protobuf*.js "$JSLIBS/protobufjs"
    cp -r dist/minimal/protobuf*.js "$JSLIBS/protobufjs/minimal"
else
    echo "=== Not updating ProtoBufJS"
fi

if [[ "$DOBUILDBASILPROTO" == "yes" ]] ; then
    echo "=== Build JS code for Basil-protocol"
    cd "${PROTOBUFJSDIR}"
    ./bin/pbjs -t static-module \
        --wrap es6 \
        --no-comments \
        $BASILPROTODIR/protocol/BasilMessage.proto \
        $BASILPROTODIR/protocol/SpaceServer.proto \
        $BASILPROTODIR/protocol/BasilServer.proto \
        $BASILPROTODIR/protocol/BasilTypes.proto \
        > "$JSLIBS/BasilServerMessages.js"

else
    echo "=== Not building JS code for Basil-protocol"
fi

cd "${PLACE}"

