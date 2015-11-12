/*
 * Types that are used in the communications with Basil
 */

// GEOMETRY ==================================
struct Vector3 {
    1: required double X;
    2: required double Y;
    3: required double Z;
}

struct Vector3F {
    1: required float X;
    2: required float Y;
    3: required float Z;
}

struct Quaternion {
    1: required double X;
    2: required double Y;
    3: required double Z;
    4: required double W;
}

struct QuaternionF {
    1: required float X;
    2: required float Y;
    3: required float Z;
    4: required float W;
}

struct Transform {
    1: required list<double> matrix;    // 3x3 matrix
    2: required Vector3 origin;
}

struct TransformF {
    1: required list<float> matrix;    // 3x3 matrix
    2: required Vector3f origin;
}

// OBJECT INFORMATION ==================================

// The globally unique identifier of an object is a string (text GUID or URI)
typedef string objectIdentifier
// Sessions can arrange to identify an object by a short-hand alias
//    which is defined only for the lenght of the session.
typedef int32 compactIdentifier

// An axis aligned area that contains an object
struct aaBoundingBox {
    1: required Vector3 upperFrontLeft;
    2: required Vector3 lowerBackRight;
}

struct objectDisplayInfo {
    1: require aaBoundingBox aabb;
}

// Description of the asset information for a displayable object
struct assetInformation {
    1: required objectIdentifier id;
    2: objectDisplayInfo displayInfo;
}

// A specification of object motion/position
struct objectPositionInfo {
    1: required objectIdentifier id;
    2: required Vector3 pos;
    3: required Quaterion rot;
    4: Vector3 vel;
    5: pathDescription path;
}

// MISC ==================================

// Objects can have properties that can be read and updated independently
typedef string propertyName
typedef string propertyValue
typedef map<string,string> propertyList


