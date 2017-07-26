#! /bin/bash
# Script to update all the dependent libraries and copy the updates
#    into this project.
# This exists mostly so I'll remember the steps.

cd "$( cd "$(dirname "${BASH_SOURCE[0]}" )" && pwd )"
PLACE=$(pwd)

echo "=== Fetch ThreeJS"
cd $PLACE/../../three.js
git checkout master
git pull --all
git checkout dev
git pull

echo "=== Fetch BabylonJS"
cd $PLACE/../../Babylon.js
git checkout master
git pull --all

echo "=== Fetch flatbuffers"
cd $PLACE/../../flatbuffers
git checkout master
git pull --all

echo "=== Fetch Basil-protocol"
cd $PLACE/../../Basil-protocol
git checkout master
git pull --all

echo "=== Build stubs for Basil-protocol"
./makeStubs.sh

echo "=== Copy libraries into BasilJS"
cd $PLACE
./copyLibs.sh



