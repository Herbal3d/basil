#! /bin/bash
# script to get the current sources and links for the Basiljs dependencies

BASE=/home/basil

cd $BASE/basil-git/Basiljs

rm -f jslibs/thrift.js
cp /home/master/thrift-git/lib/js/src/thrift.js jslibs

rm -rf gen-Basil-server-js
cp -r $BASE/Basil-protocol-git/gen-Basil-server-js .
