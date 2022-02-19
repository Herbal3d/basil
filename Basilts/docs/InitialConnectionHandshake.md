
```
Entry => Basil
    Invoke Basil with c=
        {
            'init': {
                'transport': 'WW' | 'WS',
                'transportURL': 'URL',
                'protocol': 'Basil-JSON' | 'Basil-PB' | 'Basil-FB',
                'service': 'SpaceServer',
                'serviceAuth': 'authInformationForServerAccess',
                'serviceAddr': 'routingAddressToServer',
                // Following is optional and used to specify a testing asset
                'openParams': {
                    'assetURL': 'https://files.misterblue.com/BasilTest/testtest88/unoptimizes/testtest88.gltf',
                    'loaderType': 'GLTF',
                    'assetAuth': 'authTokenForAccessingAsset'
                }
            }
        }
OR
SpaceServer => Basil
    Send a MakeConnection to Basil
        {
            'Op': BMessageOps.MakeConnection,
            'SCode': 'uniqueCodeForResponseToThisRequest',
            'Auth': 'authForThisSpaceServerToTalkToThisClient',
            'iProps': {
                'transport': 'WW' | 'WS',
                'transportURL': 'URL',
                'protocol': 'Basil-JSON' | 'Basil-PB' | 'Basil-FB',
                'service': 'SpaceServer',
                'serviceAuth': 'authInformationForServerAccess',
                'serviceAddr': 'routingAddressToServer'
            }
        }

The requestor sends to Basil:
* which URL/transport/protocol to use
* an auth to use in the OpenSession (serviceAuth)

Basil's response to the above is an OpenSession to the URL:

Basil => SpaceServer (at 'transportURL' using tranport 'transport' and protocol 'protocol')
        {
            'Op': BMessageOps.OpenSessionReq,
            'Addr': 'routingAddressToServer',
            'SCode': 'uniqueCodeForResponseToThisRequest',
            'Auth': 'authToSendWithOpenSession',    (from 'serviceAuth' in MakeConnection)
            'IProps': {
                'basilVersion': 'versionString',
                'clientAuth': 'authTokenForServerSendingToBasil',
                'clientAddr': 'routineAddressToClient',
                // optional return values used for testing
                'assetURL': 'assetURLForTesting',
                'loaderType': 'loaderTypeForTestAsset',
                'assetAuth': 'authTokenForAccessingAsset'
            }
        }

SpaceServer => Basil (response to OpenConnection)
        {
            'Op': BMessageOps.OpenSessionResp,
            'Addr': 'routingAddressToClient',
            'RCode': 'uniqueCodeForResponseToThisRequest',
            'Auth': 'authTokenForServerSendingToBasil',
            'IProps': {
                'serverAuth': 'authTokenForBasilSendingToServer',
                'serviceAddr': 'routingAddressToServer'
            }
        }

Once the OpenSession is complete, the Basil has an auth to send
in requests to the service (IProps.serverAuth) and the service
has an auth to send with requests to Basil (IProps.clientAuth).

```
