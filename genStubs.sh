#! /bin/bash

THRIFT=thrift-0.9.3.exe
THRIFTINCLUDE=-I protocol
THRIFTPARAM=--allow-64bit-consts

THRIFTT=${THRIFT} ${THRIFTINCLUDE} ${THRIFTPARAM}

for lang in cpp csharp:async js ; do 
    ${THRIFTT} --gen $lang Basil-client.thrift
    ${THRIFTT} --gen $lang Basil-server.thrift
    ${THRIFTT} --gen $lang BasilTypes.thrift
    ${THRIFTT} --gen $lang Presto-client.thrift
    ${THRIFTT} --gen $lang Presto-server.thrift
done
