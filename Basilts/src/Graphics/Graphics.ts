// Copyright 2021 Robert Adams
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use static';

import { Config } from '@Base/Config';

import { BasilConnection,  BasilConnectionEventParams } from '@Comm/BasilConnection';

export const Graphics = {

    async connectGraphics(pConn: BasilConnection): Promise<void> {
        void pConn.SubscribeToMessageOp('CreateItem', ProcCreateItem);
        return undefined;
    },
    procCreateItem(pProps: BasilConnectionEventParams, pTopic: string): void {
        const x = 5;    // make ESLint leave use along for the moment
    },
    procDeleteItem(pProps: BasilConnectionEventParams, pTopic: string): void {
        const x = 5;    // make ESLint leave use along for the moment
    },
    procAddAbility(pProps: BasilConnectionEventParams, pTopic: string): void {
        const x = 5;    // make ESLint leave use along for the moment
    },
    procRemoveAbility(pProps: BasilConnectionEventParams, pTopic: string): void {
        const x = 5;    // make ESLint leave use along for the moment
    },
    procRequestProperties(pProps: BasilConnectionEventParams, pTopic: string): void {
        const x = 5;    // make ESLint leave use along for the moment
    },
    procUpdateProperties(pProps: BasilConnectionEventParams, pTopic: string): void {
        const x = 5;    // make ESLint leave use along for the moment
    }
};

function ProcCreateItem(pProps: BasilConnectionEventParams, pTopic: string): void {
    const x = 5;    // make ESLint leave use along for the moment
};
