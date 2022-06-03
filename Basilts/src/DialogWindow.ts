// Copyright 2022 Robert Adams
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

import { BItems } from '@BItem/BItems';
import { Eventing } from '@Eventing/Eventing';
import { Logger } from '@Tools/Logging';

// This adds items to the element "Window" which is what is passed to
//     the resizable dialogs IFrame.
declare global {
    interface Window {
        BItems?: typeof BItems;
        Eventing?: typeof Eventing;
        Logger?: typeof Logger;
    }
}