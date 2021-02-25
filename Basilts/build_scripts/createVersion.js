/*
    Modified version of createVersion.js from the Vircadia project.

    Original Copyright:

    Created by Kalila L. on Dec 20 2020.
    Copyright 2020 Vircadia contributors.

    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

const fs = require('fs');

const gitVer = require('child_process').execSync('git rev-parse --short HEAD').toString().trim();
const gitVerFull = require('child_process').execSync('git rev-parse HEAD').toString().trim();
const packageVersion = process.env.npm_package_version;
const filePath = './src/VERSION.ts';

console.log('Found package version', packageVersion);
console.log('Found Git commit short hash', gitVer);
console.log('Found Git commit long hash', gitVerFull);

function yyyymmdd() {
    const x = new Date();
    const y = x.getFullYear().toString();
    let m = (x.getMonth() + 1).toString();
    let d = x.getDate().toString();
    if (d.length === 1) d = '0' + d;
    if (m.length === 1) m = '0' + m;
    const yyyymmdd = y + m + d;
    return yyyymmdd;
};

const dateString = yyyymmdd();

const tsToWrite = `export const VERSION = {
    "npm-package-version": "${packageVersion}",
    "git-commit": "${gitVerFull}",
    "version-tag": "${packageVersion}-${dateString}-${gitVer}"
}
`;

const attemptFileWrite = fs.writeFileSync(filePath, tsToWrite);
