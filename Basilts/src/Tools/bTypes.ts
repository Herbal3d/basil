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

// An object that is used as a keyed collection of objects.
// The key is always a string
export interface BKeyedCollection {
  [ key: string]: unknown
};
export interface BKeyValue {
  [ key: string]: string
};
export interface BVector3 {
  x: number,
  y: number,
  z: number
};
export interface BVector4 {
  x: number,
  y: number,
  z: number,
  w: number
};
