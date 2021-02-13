/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

const $root = $protobuf.roots.default || ($protobuf.roots.default = {});

export const BasilMessage = $root.BasilMessage = (() => {

    const BasilMessage = {};

    BasilMessage.BasilMessageOps = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UnknownReq"] = 0;
        values[valuesById[101] = "CreateItemReq"] = 101;
        values[valuesById[102] = "CreateItemResp"] = 102;
        values[valuesById[103] = "DeleteItemReq"] = 103;
        values[valuesById[104] = "DeleteItemResp"] = 104;
        values[valuesById[105] = "AddAbilityReq"] = 105;
        values[valuesById[106] = "AddAbilityResp"] = 106;
        values[valuesById[107] = "RemoveAbilityReq"] = 107;
        values[valuesById[108] = "RemoveAbilityResp"] = 108;
        values[valuesById[109] = "RequestPropertiesReq"] = 109;
        values[valuesById[110] = "RequestPropertiesResp"] = 110;
        values[valuesById[111] = "UpdatePropertiesReq"] = 111;
        values[valuesById[112] = "UpdatePropertiesResp"] = 112;
        values[valuesById[201] = "OpenSessionReq"] = 201;
        values[valuesById[202] = "OpenSessionResp"] = 202;
        values[valuesById[203] = "CloseSessionReq"] = 203;
        values[valuesById[204] = "CloseSessionResp"] = 204;
        values[valuesById[205] = "MakeConnectionReq"] = 205;
        values[valuesById[206] = "MakeConnectionResp"] = 206;
        values[valuesById[301] = "AliveCheckReq"] = 301;
        values[valuesById[302] = "AliveCheckResp"] = 302;
        return values;
    })();

    BasilMessage.CoordSystem = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "WGS86"] = 0;
        values[valuesById[1] = "CAMERA"] = 1;
        values[valuesById[2] = "CAMERAABS"] = 2;
        values[valuesById[3] = "VIRTUAL"] = 3;
        values[valuesById[4] = "MOON"] = 4;
        values[valuesById[5] = "MARS"] = 5;
        values[valuesById[6] = "REL1"] = 6;
        values[valuesById[7] = "REL2"] = 7;
        values[valuesById[8] = "REL3"] = 8;
        return values;
    })();

    BasilMessage.RotationSystem = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "WORLDR"] = 0;
        values[valuesById[1] = "LOCALR"] = 1;
        values[valuesById[2] = "FORR"] = 2;
        values[valuesById[3] = "CAMERAR"] = 3;
        return values;
    })();

    BasilMessage.PositionBlock = (function() {

        function PositionBlock(properties) {
            this.Pos = [];
            this.Rot = [];
            this.Vel = [];
            this.Path = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        PositionBlock.prototype.Pos = $util.emptyArray;
        PositionBlock.prototype.Rot = $util.emptyArray;
        PositionBlock.prototype.PosRef = 0;
        PositionBlock.prototype.RotRef = 0;
        PositionBlock.prototype.Vel = $util.emptyArray;
        PositionBlock.prototype.Path = $util.emptyArray;
        PositionBlock.prototype.ItemIdN = 0;
        PositionBlock.prototype.ItemId = "";
        PositionBlock.prototype.SessionAuth = "";
        PositionBlock.prototype.ItemAuth = "";

        PositionBlock.create = function create(properties) {
            return new PositionBlock(properties);
        };

        PositionBlock.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.Pos != null && message.Pos.length) {
                writer.uint32(10).fork();
                for (let i = 0; i < message.Pos.length; ++i)
                    writer.double(message.Pos[i]);
                writer.ldelim();
            }
            if (message.Rot != null && message.Rot.length) {
                writer.uint32(18).fork();
                for (let i = 0; i < message.Rot.length; ++i)
                    writer.double(message.Rot[i]);
                writer.ldelim();
            }
            if (message.PosRef != null && Object.hasOwnProperty.call(message, "PosRef"))
                writer.uint32(24).int32(message.PosRef);
            if (message.RotRef != null && Object.hasOwnProperty.call(message, "RotRef"))
                writer.uint32(32).int32(message.RotRef);
            if (message.Vel != null && message.Vel.length) {
                writer.uint32(42).fork();
                for (let i = 0; i < message.Vel.length; ++i)
                    writer.double(message.Vel[i]);
                writer.ldelim();
            }
            if (message.Path != null && message.Path.length) {
                writer.uint32(50).fork();
                for (let i = 0; i < message.Path.length; ++i)
                    writer.double(message.Path[i]);
                writer.ldelim();
            }
            if (message.ItemIdN != null && Object.hasOwnProperty.call(message, "ItemIdN"))
                writer.uint32(80).uint32(message.ItemIdN);
            if (message.ItemId != null && Object.hasOwnProperty.call(message, "ItemId"))
                writer.uint32(90).string(message.ItemId);
            if (message.SessionAuth != null && Object.hasOwnProperty.call(message, "SessionAuth"))
                writer.uint32(98).string(message.SessionAuth);
            if (message.ItemAuth != null && Object.hasOwnProperty.call(message, "ItemAuth"))
                writer.uint32(106).string(message.ItemAuth);
            return writer;
        };

        PositionBlock.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        PositionBlock.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMessage.PositionBlock();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.Pos && message.Pos.length))
                        message.Pos = [];
                    if ((tag & 7) === 2) {
                        let end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.Pos.push(reader.double());
                    } else
                        message.Pos.push(reader.double());
                    break;
                case 2:
                    if (!(message.Rot && message.Rot.length))
                        message.Rot = [];
                    if ((tag & 7) === 2) {
                        let end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.Rot.push(reader.double());
                    } else
                        message.Rot.push(reader.double());
                    break;
                case 3:
                    message.PosRef = reader.int32();
                    break;
                case 4:
                    message.RotRef = reader.int32();
                    break;
                case 5:
                    if (!(message.Vel && message.Vel.length))
                        message.Vel = [];
                    if ((tag & 7) === 2) {
                        let end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.Vel.push(reader.double());
                    } else
                        message.Vel.push(reader.double());
                    break;
                case 6:
                    if (!(message.Path && message.Path.length))
                        message.Path = [];
                    if ((tag & 7) === 2) {
                        let end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.Path.push(reader.double());
                    } else
                        message.Path.push(reader.double());
                    break;
                case 10:
                    message.ItemIdN = reader.uint32();
                    break;
                case 11:
                    message.ItemId = reader.string();
                    break;
                case 12:
                    message.SessionAuth = reader.string();
                    break;
                case 13:
                    message.ItemAuth = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        PositionBlock.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        PositionBlock.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.Pos != null && message.hasOwnProperty("Pos")) {
                if (!Array.isArray(message.Pos))
                    return "Pos: array expected";
                for (let i = 0; i < message.Pos.length; ++i)
                    if (typeof message.Pos[i] !== "number")
                        return "Pos: number[] expected";
            }
            if (message.Rot != null && message.hasOwnProperty("Rot")) {
                if (!Array.isArray(message.Rot))
                    return "Rot: array expected";
                for (let i = 0; i < message.Rot.length; ++i)
                    if (typeof message.Rot[i] !== "number")
                        return "Rot: number[] expected";
            }
            if (message.PosRef != null && message.hasOwnProperty("PosRef"))
                switch (message.PosRef) {
                default:
                    return "PosRef: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                    break;
                }
            if (message.RotRef != null && message.hasOwnProperty("RotRef"))
                switch (message.RotRef) {
                default:
                    return "RotRef: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.Vel != null && message.hasOwnProperty("Vel")) {
                if (!Array.isArray(message.Vel))
                    return "Vel: array expected";
                for (let i = 0; i < message.Vel.length; ++i)
                    if (typeof message.Vel[i] !== "number")
                        return "Vel: number[] expected";
            }
            if (message.Path != null && message.hasOwnProperty("Path")) {
                if (!Array.isArray(message.Path))
                    return "Path: array expected";
                for (let i = 0; i < message.Path.length; ++i)
                    if (typeof message.Path[i] !== "number")
                        return "Path: number[] expected";
            }
            if (message.ItemIdN != null && message.hasOwnProperty("ItemIdN"))
                if (!$util.isInteger(message.ItemIdN))
                    return "ItemIdN: integer expected";
            if (message.ItemId != null && message.hasOwnProperty("ItemId"))
                if (!$util.isString(message.ItemId))
                    return "ItemId: string expected";
            if (message.SessionAuth != null && message.hasOwnProperty("SessionAuth"))
                if (!$util.isString(message.SessionAuth))
                    return "SessionAuth: string expected";
            if (message.ItemAuth != null && message.hasOwnProperty("ItemAuth"))
                if (!$util.isString(message.ItemAuth))
                    return "ItemAuth: string expected";
            return null;
        };

        PositionBlock.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilMessage.PositionBlock)
                return object;
            let message = new $root.BasilMessage.PositionBlock();
            if (object.Pos) {
                if (!Array.isArray(object.Pos))
                    throw TypeError(".BasilMessage.PositionBlock.Pos: array expected");
                message.Pos = [];
                for (let i = 0; i < object.Pos.length; ++i)
                    message.Pos[i] = Number(object.Pos[i]);
            }
            if (object.Rot) {
                if (!Array.isArray(object.Rot))
                    throw TypeError(".BasilMessage.PositionBlock.Rot: array expected");
                message.Rot = [];
                for (let i = 0; i < object.Rot.length; ++i)
                    message.Rot[i] = Number(object.Rot[i]);
            }
            switch (object.PosRef) {
            case "WGS86":
            case 0:
                message.PosRef = 0;
                break;
            case "CAMERA":
            case 1:
                message.PosRef = 1;
                break;
            case "CAMERAABS":
            case 2:
                message.PosRef = 2;
                break;
            case "VIRTUAL":
            case 3:
                message.PosRef = 3;
                break;
            case "MOON":
            case 4:
                message.PosRef = 4;
                break;
            case "MARS":
            case 5:
                message.PosRef = 5;
                break;
            case "REL1":
            case 6:
                message.PosRef = 6;
                break;
            case "REL2":
            case 7:
                message.PosRef = 7;
                break;
            case "REL3":
            case 8:
                message.PosRef = 8;
                break;
            }
            switch (object.RotRef) {
            case "WORLDR":
            case 0:
                message.RotRef = 0;
                break;
            case "LOCALR":
            case 1:
                message.RotRef = 1;
                break;
            case "FORR":
            case 2:
                message.RotRef = 2;
                break;
            case "CAMERAR":
            case 3:
                message.RotRef = 3;
                break;
            }
            if (object.Vel) {
                if (!Array.isArray(object.Vel))
                    throw TypeError(".BasilMessage.PositionBlock.Vel: array expected");
                message.Vel = [];
                for (let i = 0; i < object.Vel.length; ++i)
                    message.Vel[i] = Number(object.Vel[i]);
            }
            if (object.Path) {
                if (!Array.isArray(object.Path))
                    throw TypeError(".BasilMessage.PositionBlock.Path: array expected");
                message.Path = [];
                for (let i = 0; i < object.Path.length; ++i)
                    message.Path[i] = Number(object.Path[i]);
            }
            if (object.ItemIdN != null)
                message.ItemIdN = object.ItemIdN >>> 0;
            if (object.ItemId != null)
                message.ItemId = String(object.ItemId);
            if (object.SessionAuth != null)
                message.SessionAuth = String(object.SessionAuth);
            if (object.ItemAuth != null)
                message.ItemAuth = String(object.ItemAuth);
            return message;
        };

        PositionBlock.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults) {
                object.Pos = [];
                object.Rot = [];
                object.Vel = [];
                object.Path = [];
            }
            if (options.defaults) {
                object.PosRef = options.enums === String ? "WGS86" : 0;
                object.RotRef = options.enums === String ? "WORLDR" : 0;
                object.ItemIdN = 0;
                object.ItemId = "";
                object.SessionAuth = "";
                object.ItemAuth = "";
            }
            if (message.Pos && message.Pos.length) {
                object.Pos = [];
                for (let j = 0; j < message.Pos.length; ++j)
                    object.Pos[j] = options.json && !isFinite(message.Pos[j]) ? String(message.Pos[j]) : message.Pos[j];
            }
            if (message.Rot && message.Rot.length) {
                object.Rot = [];
                for (let j = 0; j < message.Rot.length; ++j)
                    object.Rot[j] = options.json && !isFinite(message.Rot[j]) ? String(message.Rot[j]) : message.Rot[j];
            }
            if (message.PosRef != null && message.hasOwnProperty("PosRef"))
                object.PosRef = options.enums === String ? $root.BasilMessage.CoordSystem[message.PosRef] : message.PosRef;
            if (message.RotRef != null && message.hasOwnProperty("RotRef"))
                object.RotRef = options.enums === String ? $root.BasilMessage.RotationSystem[message.RotRef] : message.RotRef;
            if (message.Vel && message.Vel.length) {
                object.Vel = [];
                for (let j = 0; j < message.Vel.length; ++j)
                    object.Vel[j] = options.json && !isFinite(message.Vel[j]) ? String(message.Vel[j]) : message.Vel[j];
            }
            if (message.Path && message.Path.length) {
                object.Path = [];
                for (let j = 0; j < message.Path.length; ++j)
                    object.Path[j] = options.json && !isFinite(message.Path[j]) ? String(message.Path[j]) : message.Path[j];
            }
            if (message.ItemIdN != null && message.hasOwnProperty("ItemIdN"))
                object.ItemIdN = message.ItemIdN;
            if (message.ItemId != null && message.hasOwnProperty("ItemId"))
                object.ItemId = message.ItemId;
            if (message.SessionAuth != null && message.hasOwnProperty("SessionAuth"))
                object.SessionAuth = message.SessionAuth;
            if (message.ItemAuth != null && message.hasOwnProperty("ItemAuth"))
                object.ItemAuth = message.ItemAuth;
            return object;
        };

        PositionBlock.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PositionBlock;
    })();

    BasilMessage.ParamBlock = (function() {

        function ParamBlock(properties) {
            this.Props = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        ParamBlock.prototype.Ability = "";
        ParamBlock.prototype.Props = $util.emptyObject;

        ParamBlock.create = function create(properties) {
            return new ParamBlock(properties);
        };

        ParamBlock.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.Ability != null && Object.hasOwnProperty.call(message, "Ability"))
                writer.uint32(10).string(message.Ability);
            if (message.Props != null && Object.hasOwnProperty.call(message, "Props"))
                for (let keys = Object.keys(message.Props), i = 0; i < keys.length; ++i)
                    writer.uint32(18).fork().uint32(10).string(keys[i]).uint32(18).string(message.Props[keys[i]]).ldelim();
            return writer;
        };

        ParamBlock.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        ParamBlock.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMessage.ParamBlock(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.Ability = reader.string();
                    break;
                case 2:
                    reader.skip().pos++;
                    if (message.Props === $util.emptyObject)
                        message.Props = {};
                    key = reader.string();
                    reader.pos++;
                    message.Props[key] = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        ParamBlock.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        ParamBlock.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.Ability != null && message.hasOwnProperty("Ability"))
                if (!$util.isString(message.Ability))
                    return "Ability: string expected";
            if (message.Props != null && message.hasOwnProperty("Props")) {
                if (!$util.isObject(message.Props))
                    return "Props: object expected";
                let key = Object.keys(message.Props);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.Props[key[i]]))
                        return "Props: string{k:string} expected";
            }
            return null;
        };

        ParamBlock.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilMessage.ParamBlock)
                return object;
            let message = new $root.BasilMessage.ParamBlock();
            if (object.Ability != null)
                message.Ability = String(object.Ability);
            if (object.Props) {
                if (typeof object.Props !== "object")
                    throw TypeError(".BasilMessage.ParamBlock.Props: object expected");
                message.Props = {};
                for (let keys = Object.keys(object.Props), i = 0; i < keys.length; ++i)
                    message.Props[keys[i]] = String(object.Props[keys[i]]);
            }
            return message;
        };

        ParamBlock.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.Props = {};
            if (options.defaults)
                object.Ability = "";
            if (message.Ability != null && message.hasOwnProperty("Ability"))
                object.Ability = message.Ability;
            let keys2;
            if (message.Props && (keys2 = Object.keys(message.Props)).length) {
                object.Props = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.Props[keys2[j]] = message.Props[keys2[j]];
            }
            return object;
        };

        ParamBlock.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ParamBlock;
    })();

    BasilMessage.BasilMessage = (function() {

        function BasilMessage(properties) {
            this.IProps = {};
            this.AProps = [];
            this.Positions = [];
            this.ExceptionHints = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        BasilMessage.prototype.ResponseCode = 0;
        BasilMessage.prototype.ResponseKey = "";
        BasilMessage.prototype.StreamId = 0;
        BasilMessage.prototype.ProtocolVersion = 0;
        BasilMessage.prototype.ChangeSeq = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        BasilMessage.prototype.ChangeTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        BasilMessage.prototype.QueueTime = 0;
        BasilMessage.prototype.SendTime = 0;
        BasilMessage.prototype.TransportClass = 0;
        BasilMessage.prototype.Op = 0;
        BasilMessage.prototype.SessionAuth = "";
        BasilMessage.prototype.ItemIdN = 0;
        BasilMessage.prototype.ItemId = "";
        BasilMessage.prototype.ItemAuth = "";
        BasilMessage.prototype.IProps = $util.emptyObject;
        BasilMessage.prototype.AProps = $util.emptyArray;
        BasilMessage.prototype.Positions = $util.emptyArray;
        BasilMessage.prototype.Exception = "";
        BasilMessage.prototype.ExceptionHints = $util.emptyObject;

        BasilMessage.create = function create(properties) {
            return new BasilMessage(properties);
        };

        BasilMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ResponseCode != null && Object.hasOwnProperty.call(message, "ResponseCode"))
                writer.uint32(8).uint32(message.ResponseCode);
            if (message.StreamId != null && Object.hasOwnProperty.call(message, "StreamId"))
                writer.uint32(24).uint32(message.StreamId);
            if (message.ProtocolVersion != null && Object.hasOwnProperty.call(message, "ProtocolVersion"))
                writer.uint32(32).uint32(message.ProtocolVersion);
            if (message.Op != null && Object.hasOwnProperty.call(message, "Op"))
                writer.uint32(40).uint32(message.Op);
            if (message.SessionAuth != null && Object.hasOwnProperty.call(message, "SessionAuth"))
                writer.uint32(50).string(message.SessionAuth);
            if (message.ItemIdN != null && Object.hasOwnProperty.call(message, "ItemIdN"))
                writer.uint32(56).uint32(message.ItemIdN);
            if (message.ItemId != null && Object.hasOwnProperty.call(message, "ItemId"))
                writer.uint32(66).string(message.ItemId);
            if (message.IProps != null && Object.hasOwnProperty.call(message, "IProps"))
                for (let keys = Object.keys(message.IProps), i = 0; i < keys.length; ++i)
                    writer.uint32(74).fork().uint32(10).string(keys[i]).uint32(18).string(message.IProps[keys[i]]).ldelim();
            if (message.AProps != null && message.AProps.length)
                for (let i = 0; i < message.AProps.length; ++i)
                    $root.BasilMessage.ParamBlock.encode(message.AProps[i], writer.uint32(82).fork()).ldelim();
            if (message.Positions != null && message.Positions.length)
                for (let i = 0; i < message.Positions.length; ++i)
                    $root.BasilMessage.PositionBlock.encode(message.Positions[i], writer.uint32(90).fork()).ldelim();
            if (message.Exception != null && Object.hasOwnProperty.call(message, "Exception"))
                writer.uint32(98).string(message.Exception);
            if (message.ResponseKey != null && Object.hasOwnProperty.call(message, "ResponseKey"))
                writer.uint32(162).string(message.ResponseKey);
            if (message.ItemAuth != null && Object.hasOwnProperty.call(message, "ItemAuth"))
                writer.uint32(170).string(message.ItemAuth);
            if (message.ExceptionHints != null && Object.hasOwnProperty.call(message, "ExceptionHints"))
                for (let keys = Object.keys(message.ExceptionHints), i = 0; i < keys.length; ++i)
                    writer.uint32(178).fork().uint32(10).string(keys[i]).uint32(18).string(message.ExceptionHints[keys[i]]).ldelim();
            if (message.ChangeSeq != null && Object.hasOwnProperty.call(message, "ChangeSeq"))
                writer.uint32(240).uint64(message.ChangeSeq);
            if (message.ChangeTime != null && Object.hasOwnProperty.call(message, "ChangeTime"))
                writer.uint32(248).uint64(message.ChangeTime);
            if (message.QueueTime != null && Object.hasOwnProperty.call(message, "QueueTime"))
                writer.uint32(320).uint32(message.QueueTime);
            if (message.SendTime != null && Object.hasOwnProperty.call(message, "SendTime"))
                writer.uint32(328).uint32(message.SendTime);
            if (message.TransportClass != null && Object.hasOwnProperty.call(message, "TransportClass"))
                writer.uint32(336).uint32(message.TransportClass);
            return writer;
        };

        BasilMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        BasilMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMessage.BasilMessage(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.ResponseCode = reader.uint32();
                    break;
                case 20:
                    message.ResponseKey = reader.string();
                    break;
                case 3:
                    message.StreamId = reader.uint32();
                    break;
                case 4:
                    message.ProtocolVersion = reader.uint32();
                    break;
                case 30:
                    message.ChangeSeq = reader.uint64();
                    break;
                case 31:
                    message.ChangeTime = reader.uint64();
                    break;
                case 40:
                    message.QueueTime = reader.uint32();
                    break;
                case 41:
                    message.SendTime = reader.uint32();
                    break;
                case 42:
                    message.TransportClass = reader.uint32();
                    break;
                case 5:
                    message.Op = reader.uint32();
                    break;
                case 6:
                    message.SessionAuth = reader.string();
                    break;
                case 7:
                    message.ItemIdN = reader.uint32();
                    break;
                case 8:
                    message.ItemId = reader.string();
                    break;
                case 21:
                    message.ItemAuth = reader.string();
                    break;
                case 9:
                    reader.skip().pos++;
                    if (message.IProps === $util.emptyObject)
                        message.IProps = {};
                    key = reader.string();
                    reader.pos++;
                    message.IProps[key] = reader.string();
                    break;
                case 10:
                    if (!(message.AProps && message.AProps.length))
                        message.AProps = [];
                    message.AProps.push($root.BasilMessage.ParamBlock.decode(reader, reader.uint32()));
                    break;
                case 11:
                    if (!(message.Positions && message.Positions.length))
                        message.Positions = [];
                    message.Positions.push($root.BasilMessage.PositionBlock.decode(reader, reader.uint32()));
                    break;
                case 12:
                    message.Exception = reader.string();
                    break;
                case 22:
                    reader.skip().pos++;
                    if (message.ExceptionHints === $util.emptyObject)
                        message.ExceptionHints = {};
                    key = reader.string();
                    reader.pos++;
                    message.ExceptionHints[key] = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        BasilMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        BasilMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ResponseCode != null && message.hasOwnProperty("ResponseCode"))
                if (!$util.isInteger(message.ResponseCode))
                    return "ResponseCode: integer expected";
            if (message.ResponseKey != null && message.hasOwnProperty("ResponseKey"))
                if (!$util.isString(message.ResponseKey))
                    return "ResponseKey: string expected";
            if (message.StreamId != null && message.hasOwnProperty("StreamId"))
                if (!$util.isInteger(message.StreamId))
                    return "StreamId: integer expected";
            if (message.ProtocolVersion != null && message.hasOwnProperty("ProtocolVersion"))
                if (!$util.isInteger(message.ProtocolVersion))
                    return "ProtocolVersion: integer expected";
            if (message.ChangeSeq != null && message.hasOwnProperty("ChangeSeq"))
                if (!$util.isInteger(message.ChangeSeq) && !(message.ChangeSeq && $util.isInteger(message.ChangeSeq.low) && $util.isInteger(message.ChangeSeq.high)))
                    return "ChangeSeq: integer|Long expected";
            if (message.ChangeTime != null && message.hasOwnProperty("ChangeTime"))
                if (!$util.isInteger(message.ChangeTime) && !(message.ChangeTime && $util.isInteger(message.ChangeTime.low) && $util.isInteger(message.ChangeTime.high)))
                    return "ChangeTime: integer|Long expected";
            if (message.QueueTime != null && message.hasOwnProperty("QueueTime"))
                if (!$util.isInteger(message.QueueTime))
                    return "QueueTime: integer expected";
            if (message.SendTime != null && message.hasOwnProperty("SendTime"))
                if (!$util.isInteger(message.SendTime))
                    return "SendTime: integer expected";
            if (message.TransportClass != null && message.hasOwnProperty("TransportClass"))
                if (!$util.isInteger(message.TransportClass))
                    return "TransportClass: integer expected";
            if (message.Op != null && message.hasOwnProperty("Op"))
                if (!$util.isInteger(message.Op))
                    return "Op: integer expected";
            if (message.SessionAuth != null && message.hasOwnProperty("SessionAuth"))
                if (!$util.isString(message.SessionAuth))
                    return "SessionAuth: string expected";
            if (message.ItemIdN != null && message.hasOwnProperty("ItemIdN"))
                if (!$util.isInteger(message.ItemIdN))
                    return "ItemIdN: integer expected";
            if (message.ItemId != null && message.hasOwnProperty("ItemId"))
                if (!$util.isString(message.ItemId))
                    return "ItemId: string expected";
            if (message.ItemAuth != null && message.hasOwnProperty("ItemAuth"))
                if (!$util.isString(message.ItemAuth))
                    return "ItemAuth: string expected";
            if (message.IProps != null && message.hasOwnProperty("IProps")) {
                if (!$util.isObject(message.IProps))
                    return "IProps: object expected";
                let key = Object.keys(message.IProps);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.IProps[key[i]]))
                        return "IProps: string{k:string} expected";
            }
            if (message.AProps != null && message.hasOwnProperty("AProps")) {
                if (!Array.isArray(message.AProps))
                    return "AProps: array expected";
                for (let i = 0; i < message.AProps.length; ++i) {
                    let error = $root.BasilMessage.ParamBlock.verify(message.AProps[i]);
                    if (error)
                        return "AProps." + error;
                }
            }
            if (message.Positions != null && message.hasOwnProperty("Positions")) {
                if (!Array.isArray(message.Positions))
                    return "Positions: array expected";
                for (let i = 0; i < message.Positions.length; ++i) {
                    let error = $root.BasilMessage.PositionBlock.verify(message.Positions[i]);
                    if (error)
                        return "Positions." + error;
                }
            }
            if (message.Exception != null && message.hasOwnProperty("Exception"))
                if (!$util.isString(message.Exception))
                    return "Exception: string expected";
            if (message.ExceptionHints != null && message.hasOwnProperty("ExceptionHints")) {
                if (!$util.isObject(message.ExceptionHints))
                    return "ExceptionHints: object expected";
                let key = Object.keys(message.ExceptionHints);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.ExceptionHints[key[i]]))
                        return "ExceptionHints: string{k:string} expected";
            }
            return null;
        };

        BasilMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilMessage.BasilMessage)
                return object;
            let message = new $root.BasilMessage.BasilMessage();
            if (object.ResponseCode != null)
                message.ResponseCode = object.ResponseCode >>> 0;
            if (object.ResponseKey != null)
                message.ResponseKey = String(object.ResponseKey);
            if (object.StreamId != null)
                message.StreamId = object.StreamId >>> 0;
            if (object.ProtocolVersion != null)
                message.ProtocolVersion = object.ProtocolVersion >>> 0;
            if (object.ChangeSeq != null)
                if ($util.Long)
                    (message.ChangeSeq = $util.Long.fromValue(object.ChangeSeq)).unsigned = true;
                else if (typeof object.ChangeSeq === "string")
                    message.ChangeSeq = parseInt(object.ChangeSeq, 10);
                else if (typeof object.ChangeSeq === "number")
                    message.ChangeSeq = object.ChangeSeq;
                else if (typeof object.ChangeSeq === "object")
                    message.ChangeSeq = new $util.LongBits(object.ChangeSeq.low >>> 0, object.ChangeSeq.high >>> 0).toNumber(true);
            if (object.ChangeTime != null)
                if ($util.Long)
                    (message.ChangeTime = $util.Long.fromValue(object.ChangeTime)).unsigned = true;
                else if (typeof object.ChangeTime === "string")
                    message.ChangeTime = parseInt(object.ChangeTime, 10);
                else if (typeof object.ChangeTime === "number")
                    message.ChangeTime = object.ChangeTime;
                else if (typeof object.ChangeTime === "object")
                    message.ChangeTime = new $util.LongBits(object.ChangeTime.low >>> 0, object.ChangeTime.high >>> 0).toNumber(true);
            if (object.QueueTime != null)
                message.QueueTime = object.QueueTime >>> 0;
            if (object.SendTime != null)
                message.SendTime = object.SendTime >>> 0;
            if (object.TransportClass != null)
                message.TransportClass = object.TransportClass >>> 0;
            if (object.Op != null)
                message.Op = object.Op >>> 0;
            if (object.SessionAuth != null)
                message.SessionAuth = String(object.SessionAuth);
            if (object.ItemIdN != null)
                message.ItemIdN = object.ItemIdN >>> 0;
            if (object.ItemId != null)
                message.ItemId = String(object.ItemId);
            if (object.ItemAuth != null)
                message.ItemAuth = String(object.ItemAuth);
            if (object.IProps) {
                if (typeof object.IProps !== "object")
                    throw TypeError(".BasilMessage.BasilMessage.IProps: object expected");
                message.IProps = {};
                for (let keys = Object.keys(object.IProps), i = 0; i < keys.length; ++i)
                    message.IProps[keys[i]] = String(object.IProps[keys[i]]);
            }
            if (object.AProps) {
                if (!Array.isArray(object.AProps))
                    throw TypeError(".BasilMessage.BasilMessage.AProps: array expected");
                message.AProps = [];
                for (let i = 0; i < object.AProps.length; ++i) {
                    if (typeof object.AProps[i] !== "object")
                        throw TypeError(".BasilMessage.BasilMessage.AProps: object expected");
                    message.AProps[i] = $root.BasilMessage.ParamBlock.fromObject(object.AProps[i]);
                }
            }
            if (object.Positions) {
                if (!Array.isArray(object.Positions))
                    throw TypeError(".BasilMessage.BasilMessage.Positions: array expected");
                message.Positions = [];
                for (let i = 0; i < object.Positions.length; ++i) {
                    if (typeof object.Positions[i] !== "object")
                        throw TypeError(".BasilMessage.BasilMessage.Positions: object expected");
                    message.Positions[i] = $root.BasilMessage.PositionBlock.fromObject(object.Positions[i]);
                }
            }
            if (object.Exception != null)
                message.Exception = String(object.Exception);
            if (object.ExceptionHints) {
                if (typeof object.ExceptionHints !== "object")
                    throw TypeError(".BasilMessage.BasilMessage.ExceptionHints: object expected");
                message.ExceptionHints = {};
                for (let keys = Object.keys(object.ExceptionHints), i = 0; i < keys.length; ++i)
                    message.ExceptionHints[keys[i]] = String(object.ExceptionHints[keys[i]]);
            }
            return message;
        };

        BasilMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults) {
                object.AProps = [];
                object.Positions = [];
            }
            if (options.objects || options.defaults) {
                object.IProps = {};
                object.ExceptionHints = {};
            }
            if (options.defaults) {
                object.ResponseCode = 0;
                object.StreamId = 0;
                object.ProtocolVersion = 0;
                object.Op = 0;
                object.SessionAuth = "";
                object.ItemIdN = 0;
                object.ItemId = "";
                object.Exception = "";
                object.ResponseKey = "";
                object.ItemAuth = "";
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.ChangeSeq = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.ChangeSeq = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.ChangeTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.ChangeTime = options.longs === String ? "0" : 0;
                object.QueueTime = 0;
                object.SendTime = 0;
                object.TransportClass = 0;
            }
            if (message.ResponseCode != null && message.hasOwnProperty("ResponseCode"))
                object.ResponseCode = message.ResponseCode;
            if (message.StreamId != null && message.hasOwnProperty("StreamId"))
                object.StreamId = message.StreamId;
            if (message.ProtocolVersion != null && message.hasOwnProperty("ProtocolVersion"))
                object.ProtocolVersion = message.ProtocolVersion;
            if (message.Op != null && message.hasOwnProperty("Op"))
                object.Op = message.Op;
            if (message.SessionAuth != null && message.hasOwnProperty("SessionAuth"))
                object.SessionAuth = message.SessionAuth;
            if (message.ItemIdN != null && message.hasOwnProperty("ItemIdN"))
                object.ItemIdN = message.ItemIdN;
            if (message.ItemId != null && message.hasOwnProperty("ItemId"))
                object.ItemId = message.ItemId;
            let keys2;
            if (message.IProps && (keys2 = Object.keys(message.IProps)).length) {
                object.IProps = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.IProps[keys2[j]] = message.IProps[keys2[j]];
            }
            if (message.AProps && message.AProps.length) {
                object.AProps = [];
                for (let j = 0; j < message.AProps.length; ++j)
                    object.AProps[j] = $root.BasilMessage.ParamBlock.toObject(message.AProps[j], options);
            }
            if (message.Positions && message.Positions.length) {
                object.Positions = [];
                for (let j = 0; j < message.Positions.length; ++j)
                    object.Positions[j] = $root.BasilMessage.PositionBlock.toObject(message.Positions[j], options);
            }
            if (message.Exception != null && message.hasOwnProperty("Exception"))
                object.Exception = message.Exception;
            if (message.ResponseKey != null && message.hasOwnProperty("ResponseKey"))
                object.ResponseKey = message.ResponseKey;
            if (message.ItemAuth != null && message.hasOwnProperty("ItemAuth"))
                object.ItemAuth = message.ItemAuth;
            if (message.ExceptionHints && (keys2 = Object.keys(message.ExceptionHints)).length) {
                object.ExceptionHints = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.ExceptionHints[keys2[j]] = message.ExceptionHints[keys2[j]];
            }
            if (message.ChangeSeq != null && message.hasOwnProperty("ChangeSeq"))
                if (typeof message.ChangeSeq === "number")
                    object.ChangeSeq = options.longs === String ? String(message.ChangeSeq) : message.ChangeSeq;
                else
                    object.ChangeSeq = options.longs === String ? $util.Long.prototype.toString.call(message.ChangeSeq) : options.longs === Number ? new $util.LongBits(message.ChangeSeq.low >>> 0, message.ChangeSeq.high >>> 0).toNumber(true) : message.ChangeSeq;
            if (message.ChangeTime != null && message.hasOwnProperty("ChangeTime"))
                if (typeof message.ChangeTime === "number")
                    object.ChangeTime = options.longs === String ? String(message.ChangeTime) : message.ChangeTime;
                else
                    object.ChangeTime = options.longs === String ? $util.Long.prototype.toString.call(message.ChangeTime) : options.longs === Number ? new $util.LongBits(message.ChangeTime.low >>> 0, message.ChangeTime.high >>> 0).toNumber(true) : message.ChangeTime;
            if (message.QueueTime != null && message.hasOwnProperty("QueueTime"))
                object.QueueTime = message.QueueTime;
            if (message.SendTime != null && message.hasOwnProperty("SendTime"))
                object.SendTime = message.SendTime;
            if (message.TransportClass != null && message.hasOwnProperty("TransportClass"))
                object.TransportClass = message.TransportClass;
            return object;
        };

        BasilMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BasilMessage;
    })();

    return BasilMessage;
})();

export { $root as default };
