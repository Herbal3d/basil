/*
    Modified version of cleanDist.js from the Vircadia project.

    Original Copyright:

    Created by Kalila L. on Dec 20 2020.
    Copyright 2020 Vircadia contributors.

    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

const fs = require('fs');

const directory = './dist';

fs.rmdirSync(directory, { recursive: true, force: true });

console.log('Dist folder cleared!');
  
