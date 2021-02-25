/*
    Modified version of copyStatic.js from the Vircadia project.

    Original Copyright:

    Created by Kalila L. on Dec 20 2020.
    Copyright 2020 Vircadia contributors.

    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

const fs = require('fs');

const srcDir = `./src/static`;
const destDir = `./dist/static`;

try {
    fs.mkdirSync(destDir);
    fs.copySync(srcDir, destDir, { overwrite: true });
    console.log(`Successfully copied ${srcDir} to ${destDir}!`);
}
catch (err) {
    console.log(`Failed to copy copied ${srcDir} to ${destDir}!: ${err}`);
};
