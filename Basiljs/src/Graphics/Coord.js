// Copyright 2018 Robert Adams
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

import GP from 'GP';
import Config from 'xConfig';

var CO = CO || {};
GP.CO = CO; // for debugging. Don't use for cross package access.

// The coordinate system transforms are handled by several top level nodes
//   in the THREE scene tree. At the top, there are two nodes which age the
//   camera relative nodes and the other is the world relative nodes.
