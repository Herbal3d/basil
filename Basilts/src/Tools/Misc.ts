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

// Highly modified from Vircadia sources. Original copyright:
//   Copyright 2020 Vircadia Contributors
//   Licensed under the Apache License, Version 2.0 (the "License")
'use strict'

import { v4 as uuidv4 } from 'uuid';

import { BKeyedCollection } from '@Tools/bTypes';

// Clamp the passed value between a high and low
export function Clamp(pVal: number, pLow: number, pHigh: number): number {
  let ret = pVal;
  if (ret > pHigh) ret = pHigh;
  if (ret < pLow) ret = pLow;
  return ret;
}

// Return 'true' if the passed value is null or empty
export function IsNullOrEmpty(pVal: any): boolean {
  return     (typeof(pVal) === 'undefined')
          || (pVal === null)
          || (typeof(pVal) === 'string' && String(pVal).length === 0);
};
// Return 'true' if the passed value is not null or empty
export function IsNotNullOrEmpty(pVal: any): boolean {
  return !IsNullOrEmpty(pVal);
};

// Create an object with the passed property value.
// This is often used to make queries where the property name is a value string.
export function SimpleObject(pProperty: string, pValue: any): BKeyedCollection {
  const ret:BKeyedCollection = {};
  ret[pProperty] = pValue;
  return ret;
};

export function GenUUID(): string {
  return uuidv4();
};