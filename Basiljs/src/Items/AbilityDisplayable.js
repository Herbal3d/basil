// Copyright 2020 Robert Adams
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

import { GP } from 'GLOBALS';
import Config from '../config.js';
import { BException } from '../BException.js';

import { JSONstringify } from '../Utilities.js';

import { BItemState } from '../Items/BItem.js';
import { AnAbility, InitializeProps, GenerateProps, SetViaProps } from './Abilities.js';

export class AbilityDisplayable extends AnAbility {
  
    static get NAME() { return 'DISP' };

    constructor() {
        super(AbilityDisplayable.NAME, AbilityDisplayable.PropsToVars);
    };

    // Connect me to a BItem and do initialization/loading
    // Returns a promise that resolves when the displayable is loaded
    Link(pParent) {
        this.parent = pParent;
        // A kludge that give all Displayables a handle to the Graphics instance.
        // In the future, there might be multiple graphics engines.
        this.graphics = GP.GR;

        this.parent.DefinePropertiesWithProps(AbilityDisplayable.PropsToVars);

        // This returns a promise that is resolved to the loaded AbilityDisplayable
        return this.LoadDisplayableAsset();
    };

    // Unlink this ability from the enclosing BItem. This is overloaded by actual Ability.
    Unlink(pParent) {
        this.ReleaseResources();
        this.parent.UndefinePropertiesWithProps(AbilityDisplayable.PropsToVars);
    };

    SetFromValues(pDisplayType, pProps, pAabb, pId) {
        SetViaProps(this, 'displaytype', pDisplayType, AbilityDisplayable.PropsToVars);
        SetViaProps(this, 'aabb', pAabb, AbilityDisplayable.PropsToVars);
        SetViaProps(this, 'id', pId, AbilityDisplayable.PropsToVars);
        InitializeProps(this, pProps, AbilityDisplayable.PropsToVars);
        return this;
    };
    // deserialized parameters from Map<string,string>()
    InitializeWithProperties(pParamBlock) {
        InitializeProps(this, pParamBlock, AbilityDisplayable.PropsToVars);
        return this;
    };
    // Return properties that define this ability instance as Map<string,string>()
    GetProperties() {
        return GenerateProps(this, AbilityDisplayable.PropsToVars);
    };

    // Do the loading of the underlying asset that is the displayable.
    // Loading progress is reported in this Ability's state.
    // Returns a Promise that is completed when the object is loaded.
    LoadDisplayableAsset() {
        let assetInfo = {
            'url': this.Url,
            'loaderType': this.LoaderType,
            'auth': this.DisplayAuth
        }
        this.SetLoading();
        return new Promise( function(resolve, reject) {
            // GP.DebugLog('DisplayableMeshSet.constructor: begining load of asset.State to LOADING');
            this.graphics.LoadSimpleAsset(assetInfo)
            .then(function(theAsset) {
                if (this.state == BItemState.LOADING) {
                    // GP.DebugLog('DisplayableMeshSet.constructor: asset load successful. State to READY');
                    // GP.DebugLog('DisplayableMeshSet.constructor:' + ' numAsset=' + theAsset.length);
                    // 'theAsset' is a list of ThreeJS nodes.
                    // 'representation' is whatever the graphics engine has for this asset
                    this.representation = theAsset;
                    this.SetReady();
                }
                else {
                    // The object went out of 'LOADING' while off in graphics.
                    // Leave the new state.
                    this.representation = theAsset; // so it can be freed.
                };
                resolve(this);
            }.bind(this) )
            .catch(function(err) {
                this.SetFailed();
                GP.ErrorLog('AbilityDisplayable: unable to load asset ' + JSONstringify(assetInfo)
                          + ', ERROR=' + JSONstringify(err));
                reject(new BException(err));
            }.bind(this) );
        }.bind(this) );
    };

    ReleaseResources() {
        if (this.representation) {
            // release the resources from the graphics engine
            if (this.graphics) {
                this.graphics.ReleaseSimpleAsset(this.representation);
            };
            this.representation = undefined;
        };
    };


};

// Mapping of property list names to properties on this instance.
// See Ability.InitializeProps() and Ability.GenerateProps() for usage.
// Property name definitions must be lower case.
// The 'obj' is the parent BItem.
// The entries for each property are:
//          'get', 'set': value get and set operations
//          'name': named used for the property when exported for the protocol
//          'propertyName': the name of the BItem property to register for this property
//          'ability': identifies this variable as tied to this ability (for lookup in BItem)
AbilityDisplayable.PropsToVars = {
    'id': {
        get: (obj) => { return obj.Id },
        set: (obj, val) => { obj.Id = val ;},
        name: 'Id',
        ability: AbilityDisplayable.NAME
    },
    'displaytype': {
        get: (obj) => { return obj.DisplayType },
        set: (obj, val) => { obj.DisplayType = val ;},
        name: 'DisplayType',
        propertyName: 'Displayable.Type',
        ability: AbilityDisplayable.NAME
    },
    'url' : {
        get: (obj) => { return obj.Url },
        set: (obj, val) => { obj.Url = val ;},
        name: 'Url',
        ability: AbilityDisplayable.NAME
    },
    'auth' : {
        get: (obj) => { return obj.DisplayAuth },
        set: (obj, val) => { obj.DisplayAuth = val ;},
        name: 'Displayable.Auth',
        ability: AbilityDisplayable.NAME
    },
    'loadertype' : {
        get: (obj) => { return obj.LoaderType },
        set: (obj, val) => { obj.LoaderType = val ;},
        name: 'LoaderType',
        ability: AbilityDisplayable.NAME
    },
    'aabb' : {
        get: (obj) => { return JSON.stringify(obj.Aabb) },
        set: (obj, val) => { obj.Aabb = JSON.parse(val) ;},
        name: 'Aabb',
        ability: AbilityDisplayable.NAME
    } 
};
