
```
Entry => Basil
    Invoke Basil with c=
        {
            'init': {
                'transport': 'WW' | 'WS',
                'transportURL': 'URL',
                'protocol': 'Basil-JSON' | 'Basil-PB' | 'Basil-FB',
                'sendAuth': 'authTokenForBasilSendingOpenConnection',
                'openParams': {
                    'assetURL': 'https://files.misterblue.com/BasilTest/testtest88/unoptimizes/testtest88.gltf',
                    'loaderType': 'GLTF',
                    'assetAuth': 'authTokenForAccessingAsset'
                }
            }
        }

Basil => SpaceServer (at 'transportURL' using tranport 'transport' and protocol 'protocol')
        {
            'Op': BMessageOps.OpenSessionReq,
            'ResponseCode': 'uniqueCodeForResponseToThisRequest',
            'Auth': 'authTokenForBasilSendingOpenSession',
            'ItemProps': {
                'clientAuth': 'authTokenForServerSendingToBasil',
                'assetURL': 'assetURLForTesting',
                'loaderType': 'loaderTypeForTestAsset',
                'assetAuth': 'authTokenForAccessingAsset'
                
            }
        }

SpaceServer => Basil (response to OpenConnection)
        {
            'Op': BMessageOps.OpenSessionResp,
            'ResponseCode': 'uniqueCodeForResponseToThisRequest',
            'Auth': 'authTokenForServerSendingToBasil',
            'IProps': {
                'serverAuth': 'authTokenForBasilSendingToServer'
            }
        }

If test asset information was included in OpenConnection

```
