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

echo "=== Fetch Cesium"
cd $PLACE/../../cesium
git checkout master
git pull --all
npm install
npm run build
npm run minifyRelease

echo "=== Fetch Basil-protocol"
cd $PLACE/../../Basil-protocol
git checkout master
git pull --all

echo "=== Build stubs for Basil-protocol"
# ./makeStubs.sh

echo "=== Copy libraries into BasilJS"
cd $PLACE
./copyLibs.sh



