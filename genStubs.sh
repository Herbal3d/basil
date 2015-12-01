#! /bin/bash

THRIFT="thrift-0.9.3.exe"
THRIFTINCLUDE="-I protocol"
THRIFTPARAM="--allow-64bit-consts"

THRIFTT="${THRIFT} ${THRIFTINCLUDE} ${THRIFTPARAM}"

for lang in cpp csharp:async js ; do 
    ${THRIFTT} --gen $lang protocol/Basil-client.thrift
    ${THRIFTT} --gen $lang protocol/Basil-server.thrift
    ${THRIFTT} --gen $lang protocol/BasilTypes.thrift
    ${THRIFTT} --gen $lang protocol/Presto-client.thrift
    ${THRIFTT} --gen $lang protocol/Presto-server.thrift
done
