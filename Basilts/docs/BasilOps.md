# Basil Operation Formats

The Basil message is a fixed form with fields that are used by the different
operations. Below, the operations are listed along with the fields and
properties they expect in a BMessage.

## General Notes

The operations are RPC'ish in that a request can include a "RCode"
that is returned with the response so the sender can tie the response with the
requesting code. If "RCode" is not supplied in a request, a response
message is not sent.

The "Auth" field contains a token string that authenticates the operation.
The initial parameters given to Basil include an auth token for the
OpenSession. The OpenSession sends a 'ClientAuth' token to the service
which will authorize future service to Basil messages.
Additionally, the OpenSession response returns a 'ServiceAuth' token
which authorizes future Basil to service messages.

## Initial Basil Parameters

When Basil is started, it is passed a set of parameters in the "c" query
parameter. The parameters are Base64 encoded JSON text.

```
{
    // Optional section. If supplied, Basil will do an OpenSession to the specified URL.
    'Init': {
        'Transport': 'WW' | 'WS',
        'TransportURL': 'URL',
        'Protocol': 'Basil-JSON' | 'Basil-PB' | 'Basil-FB',
        'Service': 'SpaceServer' | 'BasilServer',
        'ServiceAuth': 'authTokenForBasilSendingOpenConnection',
        // Optional section used for testing. Causes connected server to
        //     respond with a CreateItem() for a displayable using this info.
        'OpenParams': {
            'AssetURL': 'https://files.misterblue.com/BasilTest/testtest88/unoptimizes/testtest88.gltf',
            'LoaderType': 'GLTF',
            'AssetAuth': 'authTokenForAccessingAsset'
        }
    }

}
```

## CreateItemReq

```
{
    'Op': 101,          // BMessageOps.CreateItemReq
    'RCode': 'uniqueCodeForResponseToThisRequest',
}
```

## CreateItemResp
## DeleteItemReq
## DeleteItemResp
## AddAbilityReq
## AddAbilityResp
## RemoveAbilityReq
## RemoveAbilityResp
## RequestPropertiesReq
## RequestPropertiesResp
## UpdatePropertiesReq
## UpdatePropertiesResp

## OpenSessionReq

```
{
    'Op': 201,          // BMessageOps.OpenSessionReq,
    'RCode': 'uniqueCodeForResponseToThisRequest',
    'Auth': 'authTokenForBasilSendingOpenSession',
    'IProps': {
        'ClientAuth': 'authTokenForServerSendingToBasil',
        // Optional parameters which cause the service to create an Item with these parameters
        'AssetURL': 'assetURLForTesting',
        'LoaderType': 'loaderTypeForTestAsset',
        'AssetAuth': 'authTokenForAccessingAsset'
    }
}
```

## OpenSessionResp

```
{
    'Op': 202,          // BMessageOps.OpenSessionReq,
    'RCode': 'uniqueCodeForResponseToThisRequest',
    'Auth': 'authTokenForServerSendingToBasil',
    'IProps': {
    }
}
```

## CloseSessionReq
## CloseSessionResp
## MakeConnectionReq

```
{
    'Op': 205,          // BMessageOps.MakeConnectionReq,
    'RCode': 'uniqueCodeForResponseToThisRequest',
    'Auth': 'authTokenForServerSendingToBasil',
    'IProps': {
        'Transport': 'WW' | 'WS',
        'TransportURL': 'URL',
        'Protocol': 'Basil-JSON' | 'Basil-PB' | 'Basil-FB',
        'Service': 'SpaceServer',
        'ClientAuth': 'authTokenForBasilSendingOpenConnection',
    }
}
```

## MakeConnectionResp

## AliveCheckReq
## AliveCheckResp