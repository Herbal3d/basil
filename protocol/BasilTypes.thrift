/*
 * Types that are used in the communications with Basil
 */

struct Vector3 {
    1: required double X;
    2: required double Y;
    3: required double Z
}

struct Vector3F {
    1: required float X;
    2: required float Y;
    3: required float Z
}

struct Quaternion {
    1: required double X;
    2: required double Y;
    3: required double Z;
    4: required double W
}

struct QuaternionF {
    1: required float X;
    2: required float Y;
    3: required float Z;
    4: required float W
}

struct Transform {
    1: required list<double> matrix;    // 3x3 matrix
    2: required Vector3 origin
}

struct TransformF {
    1: required list<float> matrix;    // 3x3 matrix
    2: required Vector3f origin
}

