#! /bin/bash
# Script to update all the dependent libraries and copy the updates
#    into this project.
# This exists mostly so I'll remember the steps.

cd "$( cd "$(dirname "${BASH_SOURCE[0]}" )" && pwd )"
PLACE=$(pwd)

cd $PLACE/../../three.js
git checkout master
git pull --all
git checkout dev
git pull

cd $PLACE/../../Babylon.js
git checkout master
git pull --all

cd $PLACE/../../Basil-protocol
# checkout master
# git pull --all
# checkout flatbuffers
# git pull
./makeStubs.sh

cd $PLACE
./copyLibs.sh



