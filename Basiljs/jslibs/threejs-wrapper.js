// Kludge that seems to allow RequireJS shim exports to work for ThreeJS
// ref: https://github.com/mrdoob/three.js/issues/9602

define(['real-threejs'], function (THREE) {
    window.THREE = THREE;
    return THREE;
});
