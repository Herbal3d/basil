/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const BasilMessage = $root.BasilMessage = (() => {

    const BasilMessage = {};

    BasilMessage.BasilMessage = (function() {

        function BasilMessage(properties) {
            this.properties = {};
            this.opParameters = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        BasilMessage.prototype.op = 0;
        BasilMessage.prototype.auth = null;
        BasilMessage.prototype["class"] = 0;
        BasilMessage.prototype.objectId = null;
        BasilMessage.prototype.instanceId = null;
        BasilMessage.prototype.pos = null;
        BasilMessage.prototype.assetInfo = null;
        BasilMessage.prototype.aabb = null;
        BasilMessage.prototype.filter = "";
        BasilMessage.prototype.properties = $util.emptyObject;
        BasilMessage.prototype.opParameters = $util.emptyObject;
        BasilMessage.prototype.exception = null;
        BasilMessage.prototype.response = null;

        BasilMessage.create = function create(properties) {
            return new BasilMessage(properties);
        };

        BasilMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.op != null && Object.hasOwnProperty.call(message, "op"))
                writer.uint32(8).int32(message.op);
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(18).fork()).ldelim();
            if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                $root.BasilType.ObjectIdentifier.encode(message.objectId, writer.uint32(26).fork()).ldelim();
            if (message.instanceId != null && Object.hasOwnProperty.call(message, "instanceId"))
                $root.BasilType.InstanceIdentifier.encode(message.instanceId, writer.uint32(34).fork()).ldelim();
            if (message.pos != null && Object.hasOwnProperty.call(message, "pos"))
                $root.BasilType.InstancePositionInfo.encode(message.pos, writer.uint32(42).fork()).ldelim();
            if (message.assetInfo != null && Object.hasOwnProperty.call(message, "assetInfo"))
                $root.BasilType.AssetInformation.encode(message.assetInfo, writer.uint32(50).fork()).ldelim();
            if (message.aabb != null && Object.hasOwnProperty.call(message, "aabb"))
                $root.BasilType.AaBoundingBox.encode(message.aabb, writer.uint32(58).fork()).ldelim();
            if (message.filter != null && Object.hasOwnProperty.call(message, "filter"))
                writer.uint32(66).string(message.filter);
            if (message.properties != null && Object.hasOwnProperty.call(message, "properties"))
                for (let keys = Object.keys(message.properties), i = 0; i < keys.length; ++i)
                    writer.uint32(74).fork().uint32(10).string(keys[i]).uint32(18).string(message.properties[keys[i]]).ldelim();
            if (message.opParameters != null && Object.hasOwnProperty.call(message, "opParameters"))
                for (let keys = Object.keys(message.opParameters), i = 0; i < keys.length; ++i)
                    writer.uint32(82).fork().uint32(10).string(keys[i]).uint32(18).string(message.opParameters[keys[i]]).ldelim();
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(90).fork()).ldelim();
            if (message.response != null && Object.hasOwnProperty.call(message, "response"))
                $root.BasilType.BResponseRequest.encode(message.response, writer.uint32(106).fork()).ldelim();
            if (message["class"] != null && Object.hasOwnProperty.call(message, "class"))
                writer.uint32(112).int32(message["class"]);
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
                    message.op = reader.int32();
                    break;
                case 2:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 14:
                    message["class"] = reader.int32();
                    break;
                case 3:
                    message.objectId = $root.BasilType.ObjectIdentifier.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.instanceId = $root.BasilType.InstanceIdentifier.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.pos = $root.BasilType.InstancePositionInfo.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.assetInfo = $root.BasilType.AssetInformation.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.aabb = $root.BasilType.AaBoundingBox.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.filter = reader.string();
                    break;
                case 9:
                    reader.skip().pos++;
                    if (message.properties === $util.emptyObject)
                        message.properties = {};
                    key = reader.string();
                    reader.pos++;
                    message.properties[key] = reader.string();
                    break;
                case 10:
                    reader.skip().pos++;
                    if (message.opParameters === $util.emptyObject)
                        message.opParameters = {};
                    key = reader.string();
                    reader.pos++;
                    message.opParameters[key] = reader.string();
                    break;
                case 11:
                    message.exception = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                case 13:
                    message.response = $root.BasilType.BResponseRequest.decode(reader, reader.uint32());
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
            if (message.op != null && message.hasOwnProperty("op"))
                if (!$util.isInteger(message.op))
                    return "op: integer expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message["class"] != null && message.hasOwnProperty("class"))
                switch (message["class"]) {
                default:
                    return "class: enum value expected";
                case 0:
                case 10:
                case 20:
                case 30:
                case 40:
                    break;
                }
            if (message.objectId != null && message.hasOwnProperty("objectId")) {
                let error = $root.BasilType.ObjectIdentifier.verify(message.objectId);
                if (error)
                    return "objectId." + error;
            }
            if (message.instanceId != null && message.hasOwnProperty("instanceId")) {
                let error = $root.BasilType.InstanceIdentifier.verify(message.instanceId);
                if (error)
                    return "instanceId." + error;
            }
            if (message.pos != null && message.hasOwnProperty("pos")) {
                let error = $root.BasilType.InstancePositionInfo.verify(message.pos);
                if (error)
                    return "pos." + error;
            }
            if (message.assetInfo != null && message.hasOwnProperty("assetInfo")) {
                let error = $root.BasilType.AssetInformation.verify(message.assetInfo);
                if (error)
                    return "assetInfo." + error;
            }
            if (message.aabb != null && message.hasOwnProperty("aabb")) {
                let error = $root.BasilType.AaBoundingBox.verify(message.aabb);
                if (error)
                    return "aabb." + error;
            }
            if (message.filter != null && message.hasOwnProperty("filter"))
                if (!$util.isString(message.filter))
                    return "filter: string expected";
            if (message.properties != null && message.hasOwnProperty("properties")) {
                if (!$util.isObject(message.properties))
                    return "properties: object expected";
                let key = Object.keys(message.properties);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.properties[key[i]]))
                        return "properties: string{k:string} expected";
            }
            if (message.opParameters != null && message.hasOwnProperty("opParameters")) {
                if (!$util.isObject(message.opParameters))
                    return "opParameters: object expected";
                let key = Object.keys(message.opParameters);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.opParameters[key[i]]))
                        return "opParameters: string{k:string} expected";
            }
            if (message.exception != null && message.hasOwnProperty("exception")) {
                let error = $root.BasilType.BasilException.verify(message.exception);
                if (error)
                    return "exception." + error;
            }
            if (message.response != null && message.hasOwnProperty("response")) {
                let error = $root.BasilType.BResponseRequest.verify(message.response);
                if (error)
                    return "response." + error;
            }
            return null;
        };

        BasilMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilMessage.BasilMessage)
                return object;
            let message = new $root.BasilMessage.BasilMessage();
            if (object.op != null)
                message.op = object.op | 0;
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilMessage.BasilMessage.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            switch (object["class"]) {
            case "Default":
            case 0:
                message["class"] = 0;
                break;
            case "HighPriority":
            case 10:
                message["class"] = 10;
                break;
            case "MedPriority":
            case 20:
                message["class"] = 20;
                break;
            case "LowPriority":
            case 30:
                message["class"] = 30;
                break;
            case "BestCase":
            case 40:
                message["class"] = 40;
                break;
            }
            if (object.objectId != null) {
                if (typeof object.objectId !== "object")
                    throw TypeError(".BasilMessage.BasilMessage.objectId: object expected");
                message.objectId = $root.BasilType.ObjectIdentifier.fromObject(object.objectId);
            }
            if (object.instanceId != null) {
                if (typeof object.instanceId !== "object")
                    throw TypeError(".BasilMessage.BasilMessage.instanceId: object expected");
                message.instanceId = $root.BasilType.InstanceIdentifier.fromObject(object.instanceId);
            }
            if (object.pos != null) {
                if (typeof object.pos !== "object")
                    throw TypeError(".BasilMessage.BasilMessage.pos: object expected");
                message.pos = $root.BasilType.InstancePositionInfo.fromObject(object.pos);
            }
            if (object.assetInfo != null) {
                if (typeof object.assetInfo !== "object")
                    throw TypeError(".BasilMessage.BasilMessage.assetInfo: object expected");
                message.assetInfo = $root.BasilType.AssetInformation.fromObject(object.assetInfo);
            }
            if (object.aabb != null) {
                if (typeof object.aabb !== "object")
                    throw TypeError(".BasilMessage.BasilMessage.aabb: object expected");
                message.aabb = $root.BasilType.AaBoundingBox.fromObject(object.aabb);
            }
            if (object.filter != null)
                message.filter = String(object.filter);
            if (object.properties) {
                if (typeof object.properties !== "object")
                    throw TypeError(".BasilMessage.BasilMessage.properties: object expected");
                message.properties = {};
                for (let keys = Object.keys(object.properties), i = 0; i < keys.length; ++i)
                    message.properties[keys[i]] = String(object.properties[keys[i]]);
            }
            if (object.opParameters) {
                if (typeof object.opParameters !== "object")
                    throw TypeError(".BasilMessage.BasilMessage.opParameters: object expected");
                message.opParameters = {};
                for (let keys = Object.keys(object.opParameters), i = 0; i < keys.length; ++i)
                    message.opParameters[keys[i]] = String(object.opParameters[keys[i]]);
            }
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilMessage.BasilMessage.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            if (object.response != null) {
                if (typeof object.response !== "object")
                    throw TypeError(".BasilMessage.BasilMessage.response: object expected");
                message.response = $root.BasilType.BResponseRequest.fromObject(object.response);
            }
            return message;
        };

        BasilMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults) {
                object.properties = {};
                object.opParameters = {};
            }
            if (options.defaults) {
                object.op = 0;
                object.auth = null;
                object.objectId = null;
                object.instanceId = null;
                object.pos = null;
                object.assetInfo = null;
                object.aabb = null;
                object.filter = "";
                object.exception = null;
                object.response = null;
                object["class"] = options.enums === String ? "Default" : 0;
            }
            if (message.op != null && message.hasOwnProperty("op"))
                object.op = message.op;
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                object.objectId = $root.BasilType.ObjectIdentifier.toObject(message.objectId, options);
            if (message.instanceId != null && message.hasOwnProperty("instanceId"))
                object.instanceId = $root.BasilType.InstanceIdentifier.toObject(message.instanceId, options);
            if (message.pos != null && message.hasOwnProperty("pos"))
                object.pos = $root.BasilType.InstancePositionInfo.toObject(message.pos, options);
            if (message.assetInfo != null && message.hasOwnProperty("assetInfo"))
                object.assetInfo = $root.BasilType.AssetInformation.toObject(message.assetInfo, options);
            if (message.aabb != null && message.hasOwnProperty("aabb"))
                object.aabb = $root.BasilType.AaBoundingBox.toObject(message.aabb, options);
            if (message.filter != null && message.hasOwnProperty("filter"))
                object.filter = message.filter;
            let keys2;
            if (message.properties && (keys2 = Object.keys(message.properties)).length) {
                object.properties = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.properties[keys2[j]] = message.properties[keys2[j]];
            }
            if (message.opParameters && (keys2 = Object.keys(message.opParameters)).length) {
                object.opParameters = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.opParameters[keys2[j]] = message.opParameters[keys2[j]];
            }
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = $root.BasilType.BasilException.toObject(message.exception, options);
            if (message.response != null && message.hasOwnProperty("response"))
                object.response = $root.BasilType.BResponseRequest.toObject(message.response, options);
            if (message["class"] != null && message.hasOwnProperty("class"))
                object["class"] = options.enums === String ? $root.BasilMessage.TransportClass[message["class"]] : message["class"];
            return object;
        };

        BasilMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BasilMessage;
    })();

    BasilMessage.TransportClass = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "Default"] = 0;
        values[valuesById[10] = "HighPriority"] = 10;
        values[valuesById[20] = "MedPriority"] = 20;
        values[valuesById[30] = "LowPriority"] = 30;
        values[valuesById[40] = "BestCase"] = 40;
        return values;
    })();

    BasilMessage.BasilMessageOps = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UnknownReq"] = 0;
        values[valuesById[4097] = "IdentifyDisplayableObjectReq"] = 4097;
        values[valuesById[4098] = "IdentifyDisplayableObjectResp"] = 4098;
        values[valuesById[4099] = "ForgetDisplayableObjectReq"] = 4099;
        values[valuesById[4100] = "ForgetDisplayableObjectResp"] = 4100;
        values[valuesById[4101] = "CreateObjectInstanceReq"] = 4101;
        values[valuesById[4102] = "CreateObjectInstanceResp"] = 4102;
        values[valuesById[4103] = "DeleteObjectInstanceReq"] = 4103;
        values[valuesById[4104] = "DeleteObjectInstanceResp"] = 4104;
        values[valuesById[4105] = "UpdateObjectPropertyReq"] = 4105;
        values[valuesById[4106] = "UpdateObjectPropertyResp"] = 4106;
        values[valuesById[4107] = "UpdateInstancePropertyReq"] = 4107;
        values[valuesById[4108] = "UpdateInstancePropertyResp"] = 4108;
        values[valuesById[4109] = "UpdateInstancePositionReq"] = 4109;
        values[valuesById[4110] = "UpdateInstancePositionResp"] = 4110;
        values[valuesById[4111] = "RequestObjectPropertiesReq"] = 4111;
        values[valuesById[4112] = "RequestObjectPropertiesResp"] = 4112;
        values[valuesById[4113] = "RequestInstancePropertiesReq"] = 4113;
        values[valuesById[4114] = "RequestInstancePropertiesResp"] = 4114;
        values[valuesById[4115] = "CloseSessionReq"] = 4115;
        values[valuesById[4116] = "CloseSessionResp"] = 4116;
        values[valuesById[4117] = "MakeConnectionReq"] = 4117;
        values[valuesById[4118] = "MakeConnectionResp"] = 4118;
        values[valuesById[8193] = "AliveCheckReq"] = 8193;
        values[valuesById[8194] = "AliveCheckResp"] = 8194;
        values[valuesById[12289] = "OpenSessionReq"] = 12289;
        values[valuesById[12290] = "OpenSessionResp"] = 12290;
        values[valuesById[12291] = "CameraViewReq"] = 12291;
        values[valuesById[12292] = "CameraViewResp"] = 12292;
        values[valuesById[16385] = "RegisterTopicReq"] = 16385;
        values[valuesById[16386] = "RegisterTopicResp"] = 16386;
        values[valuesById[16387] = "DeregisterTopicReq"] = 16387;
        values[valuesById[16388] = "DeregisterTopicResp"] = 16388;
        values[valuesById[16389] = "SubscribeReq"] = 16389;
        values[valuesById[16390] = "SubscribeResp"] = 16390;
        values[valuesById[16391] = "UnsubscribeReq"] = 16391;
        values[valuesById[16392] = "UnsubscribeResp"] = 16392;
        values[valuesById[16393] = "SendEventReq"] = 16393;
        values[valuesById[16400] = "SendEventResp"] = 16400;
        values[valuesById[16401] = "EventReq"] = 16401;
        values[valuesById[16402] = "EventResp"] = 16402;
        values[valuesById[16403] = "SubscriptionMadeReq"] = 16403;
        values[valuesById[16404] = "SubscriptionMadeResp"] = 16404;
        values[valuesById[16405] = "SubscriptionClearReq"] = 16405;
        values[valuesById[16406] = "SubscriptionClearResp"] = 16406;
        return values;
    })();

    return BasilMessage;
})();

export const BasilType = $root.BasilType = (() => {

    const BasilType = {};

    BasilType.Vector3 = (function() {

        function Vector3(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        Vector3.prototype.x = 0;
        Vector3.prototype.y = 0;
        Vector3.prototype.z = 0;

        Vector3.create = function create(properties) {
            return new Vector3(properties);
        };

        Vector3.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                writer.uint32(9).double(message.x);
            if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                writer.uint32(17).double(message.y);
            if (message.z != null && Object.hasOwnProperty.call(message, "z"))
                writer.uint32(25).double(message.z);
            return writer;
        };

        Vector3.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        Vector3.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilType.Vector3();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.x = reader.double();
                    break;
                case 2:
                    message.y = reader.double();
                    break;
                case 3:
                    message.z = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        Vector3.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        Vector3.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.x != null && message.hasOwnProperty("x"))
                if (typeof message.x !== "number")
                    return "x: number expected";
            if (message.y != null && message.hasOwnProperty("y"))
                if (typeof message.y !== "number")
                    return "y: number expected";
            if (message.z != null && message.hasOwnProperty("z"))
                if (typeof message.z !== "number")
                    return "z: number expected";
            return null;
        };

        Vector3.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.Vector3)
                return object;
            let message = new $root.BasilType.Vector3();
            if (object.x != null)
                message.x = Number(object.x);
            if (object.y != null)
                message.y = Number(object.y);
            if (object.z != null)
                message.z = Number(object.z);
            return message;
        };

        Vector3.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.x = 0;
                object.y = 0;
                object.z = 0;
            }
            if (message.x != null && message.hasOwnProperty("x"))
                object.x = options.json && !isFinite(message.x) ? String(message.x) : message.x;
            if (message.y != null && message.hasOwnProperty("y"))
                object.y = options.json && !isFinite(message.y) ? String(message.y) : message.y;
            if (message.z != null && message.hasOwnProperty("z"))
                object.z = options.json && !isFinite(message.z) ? String(message.z) : message.z;
            return object;
        };

        Vector3.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Vector3;
    })();

    BasilType.Quaternion = (function() {

        function Quaternion(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        Quaternion.prototype.x = 0;
        Quaternion.prototype.y = 0;
        Quaternion.prototype.z = 0;
        Quaternion.prototype.w = 0;

        Quaternion.create = function create(properties) {
            return new Quaternion(properties);
        };

        Quaternion.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                writer.uint32(9).double(message.x);
            if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                writer.uint32(17).double(message.y);
            if (message.z != null && Object.hasOwnProperty.call(message, "z"))
                writer.uint32(25).double(message.z);
            if (message.w != null && Object.hasOwnProperty.call(message, "w"))
                writer.uint32(33).double(message.w);
            return writer;
        };

        Quaternion.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        Quaternion.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilType.Quaternion();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.x = reader.double();
                    break;
                case 2:
                    message.y = reader.double();
                    break;
                case 3:
                    message.z = reader.double();
                    break;
                case 4:
                    message.w = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        Quaternion.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        Quaternion.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.x != null && message.hasOwnProperty("x"))
                if (typeof message.x !== "number")
                    return "x: number expected";
            if (message.y != null && message.hasOwnProperty("y"))
                if (typeof message.y !== "number")
                    return "y: number expected";
            if (message.z != null && message.hasOwnProperty("z"))
                if (typeof message.z !== "number")
                    return "z: number expected";
            if (message.w != null && message.hasOwnProperty("w"))
                if (typeof message.w !== "number")
                    return "w: number expected";
            return null;
        };

        Quaternion.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.Quaternion)
                return object;
            let message = new $root.BasilType.Quaternion();
            if (object.x != null)
                message.x = Number(object.x);
            if (object.y != null)
                message.y = Number(object.y);
            if (object.z != null)
                message.z = Number(object.z);
            if (object.w != null)
                message.w = Number(object.w);
            return message;
        };

        Quaternion.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.x = 0;
                object.y = 0;
                object.z = 0;
                object.w = 0;
            }
            if (message.x != null && message.hasOwnProperty("x"))
                object.x = options.json && !isFinite(message.x) ? String(message.x) : message.x;
            if (message.y != null && message.hasOwnProperty("y"))
                object.y = options.json && !isFinite(message.y) ? String(message.y) : message.y;
            if (message.z != null && message.hasOwnProperty("z"))
                object.z = options.json && !isFinite(message.z) ? String(message.z) : message.z;
            if (message.w != null && message.hasOwnProperty("w"))
                object.w = options.json && !isFinite(message.w) ? String(message.w) : message.w;
            return object;
        };

        Quaternion.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Quaternion;
    })();

    BasilType.Transform = (function() {

        function Transform(properties) {
            this.matrix = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        Transform.prototype.matrix = $util.emptyArray;
        Transform.prototype.origin = null;

        Transform.create = function create(properties) {
            return new Transform(properties);
        };

        Transform.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.matrix != null && message.matrix.length) {
                writer.uint32(10).fork();
                for (let i = 0; i < message.matrix.length; ++i)
                    writer.double(message.matrix[i]);
                writer.ldelim();
            }
            if (message.origin != null && Object.hasOwnProperty.call(message, "origin"))
                $root.BasilType.Vector3.encode(message.origin, writer.uint32(18).fork()).ldelim();
            return writer;
        };

        Transform.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        Transform.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilType.Transform();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.matrix && message.matrix.length))
                        message.matrix = [];
                    if ((tag & 7) === 2) {
                        let end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.matrix.push(reader.double());
                    } else
                        message.matrix.push(reader.double());
                    break;
                case 2:
                    message.origin = $root.BasilType.Vector3.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        Transform.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        Transform.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.matrix != null && message.hasOwnProperty("matrix")) {
                if (!Array.isArray(message.matrix))
                    return "matrix: array expected";
                for (let i = 0; i < message.matrix.length; ++i)
                    if (typeof message.matrix[i] !== "number")
                        return "matrix: number[] expected";
            }
            if (message.origin != null && message.hasOwnProperty("origin")) {
                let error = $root.BasilType.Vector3.verify(message.origin);
                if (error)
                    return "origin." + error;
            }
            return null;
        };

        Transform.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.Transform)
                return object;
            let message = new $root.BasilType.Transform();
            if (object.matrix) {
                if (!Array.isArray(object.matrix))
                    throw TypeError(".BasilType.Transform.matrix: array expected");
                message.matrix = [];
                for (let i = 0; i < object.matrix.length; ++i)
                    message.matrix[i] = Number(object.matrix[i]);
            }
            if (object.origin != null) {
                if (typeof object.origin !== "object")
                    throw TypeError(".BasilType.Transform.origin: object expected");
                message.origin = $root.BasilType.Vector3.fromObject(object.origin);
            }
            return message;
        };

        Transform.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.matrix = [];
            if (options.defaults)
                object.origin = null;
            if (message.matrix && message.matrix.length) {
                object.matrix = [];
                for (let j = 0; j < message.matrix.length; ++j)
                    object.matrix[j] = options.json && !isFinite(message.matrix[j]) ? String(message.matrix[j]) : message.matrix[j];
            }
            if (message.origin != null && message.hasOwnProperty("origin"))
                object.origin = $root.BasilType.Vector3.toObject(message.origin, options);
            return object;
        };

        Transform.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Transform;
    })();

    BasilType.BasilException = (function() {

        function BasilException(properties) {
            this.hints = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        BasilException.prototype.reason = "";
        BasilException.prototype.hints = $util.emptyObject;

        BasilException.create = function create(properties) {
            return new BasilException(properties);
        };

        BasilException.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.reason != null && Object.hasOwnProperty.call(message, "reason"))
                writer.uint32(10).string(message.reason);
            if (message.hints != null && Object.hasOwnProperty.call(message, "hints"))
                for (let keys = Object.keys(message.hints), i = 0; i < keys.length; ++i)
                    writer.uint32(18).fork().uint32(10).string(keys[i]).uint32(18).string(message.hints[keys[i]]).ldelim();
            return writer;
        };

        BasilException.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        BasilException.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilType.BasilException(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.reason = reader.string();
                    break;
                case 2:
                    reader.skip().pos++;
                    if (message.hints === $util.emptyObject)
                        message.hints = {};
                    key = reader.string();
                    reader.pos++;
                    message.hints[key] = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        BasilException.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        BasilException.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.reason != null && message.hasOwnProperty("reason"))
                if (!$util.isString(message.reason))
                    return "reason: string expected";
            if (message.hints != null && message.hasOwnProperty("hints")) {
                if (!$util.isObject(message.hints))
                    return "hints: object expected";
                let key = Object.keys(message.hints);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.hints[key[i]]))
                        return "hints: string{k:string} expected";
            }
            return null;
        };

        BasilException.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.BasilException)
                return object;
            let message = new $root.BasilType.BasilException();
            if (object.reason != null)
                message.reason = String(object.reason);
            if (object.hints) {
                if (typeof object.hints !== "object")
                    throw TypeError(".BasilType.BasilException.hints: object expected");
                message.hints = {};
                for (let keys = Object.keys(object.hints), i = 0; i < keys.length; ++i)
                    message.hints[keys[i]] = String(object.hints[keys[i]]);
            }
            return message;
        };

        BasilException.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.hints = {};
            if (options.defaults)
                object.reason = "";
            if (message.reason != null && message.hasOwnProperty("reason"))
                object.reason = message.reason;
            let keys2;
            if (message.hints && (keys2 = Object.keys(message.hints)).length) {
                object.hints = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.hints[keys2[j]] = message.hints[keys2[j]];
            }
            return object;
        };

        BasilException.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BasilException;
    })();

    BasilType.CoordSystem = (function() {
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

    BasilType.RotationSystem = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "WORLDR"] = 0;
        values[valuesById[1] = "FORR"] = 1;
        values[valuesById[2] = "CAMERAR"] = 2;
        return values;
    })();

    BasilType.CoordPosition = (function() {

        function CoordPosition(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        CoordPosition.prototype.pos = null;
        CoordPosition.prototype.rot = null;
        CoordPosition.prototype.posRef = 0;
        CoordPosition.prototype.rotRef = 0;

        CoordPosition.create = function create(properties) {
            return new CoordPosition(properties);
        };

        CoordPosition.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.pos != null && Object.hasOwnProperty.call(message, "pos"))
                $root.BasilType.Vector3.encode(message.pos, writer.uint32(10).fork()).ldelim();
            if (message.rot != null && Object.hasOwnProperty.call(message, "rot"))
                $root.BasilType.Quaternion.encode(message.rot, writer.uint32(18).fork()).ldelim();
            if (message.posRef != null && Object.hasOwnProperty.call(message, "posRef"))
                writer.uint32(24).int32(message.posRef);
            if (message.rotRef != null && Object.hasOwnProperty.call(message, "rotRef"))
                writer.uint32(32).int32(message.rotRef);
            return writer;
        };

        CoordPosition.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CoordPosition.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilType.CoordPosition();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.pos = $root.BasilType.Vector3.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.rot = $root.BasilType.Quaternion.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.posRef = reader.int32();
                    break;
                case 4:
                    message.rotRef = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        CoordPosition.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        CoordPosition.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.pos != null && message.hasOwnProperty("pos")) {
                let error = $root.BasilType.Vector3.verify(message.pos);
                if (error)
                    return "pos." + error;
            }
            if (message.rot != null && message.hasOwnProperty("rot")) {
                let error = $root.BasilType.Quaternion.verify(message.rot);
                if (error)
                    return "rot." + error;
            }
            if (message.posRef != null && message.hasOwnProperty("posRef"))
                switch (message.posRef) {
                default:
                    return "posRef: enum value expected";
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
            if (message.rotRef != null && message.hasOwnProperty("rotRef"))
                switch (message.rotRef) {
                default:
                    return "rotRef: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            return null;
        };

        CoordPosition.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.CoordPosition)
                return object;
            let message = new $root.BasilType.CoordPosition();
            if (object.pos != null) {
                if (typeof object.pos !== "object")
                    throw TypeError(".BasilType.CoordPosition.pos: object expected");
                message.pos = $root.BasilType.Vector3.fromObject(object.pos);
            }
            if (object.rot != null) {
                if (typeof object.rot !== "object")
                    throw TypeError(".BasilType.CoordPosition.rot: object expected");
                message.rot = $root.BasilType.Quaternion.fromObject(object.rot);
            }
            switch (object.posRef) {
            case "WGS86":
            case 0:
                message.posRef = 0;
                break;
            case "CAMERA":
            case 1:
                message.posRef = 1;
                break;
            case "CAMERAABS":
            case 2:
                message.posRef = 2;
                break;
            case "VIRTUAL":
            case 3:
                message.posRef = 3;
                break;
            case "MOON":
            case 4:
                message.posRef = 4;
                break;
            case "MARS":
            case 5:
                message.posRef = 5;
                break;
            case "REL1":
            case 6:
                message.posRef = 6;
                break;
            case "REL2":
            case 7:
                message.posRef = 7;
                break;
            case "REL3":
            case 8:
                message.posRef = 8;
                break;
            }
            switch (object.rotRef) {
            case "WORLDR":
            case 0:
                message.rotRef = 0;
                break;
            case "FORR":
            case 1:
                message.rotRef = 1;
                break;
            case "CAMERAR":
            case 2:
                message.rotRef = 2;
                break;
            }
            return message;
        };

        CoordPosition.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.pos = null;
                object.rot = null;
                object.posRef = options.enums === String ? "WGS86" : 0;
                object.rotRef = options.enums === String ? "WORLDR" : 0;
            }
            if (message.pos != null && message.hasOwnProperty("pos"))
                object.pos = $root.BasilType.Vector3.toObject(message.pos, options);
            if (message.rot != null && message.hasOwnProperty("rot"))
                object.rot = $root.BasilType.Quaternion.toObject(message.rot, options);
            if (message.posRef != null && message.hasOwnProperty("posRef"))
                object.posRef = options.enums === String ? $root.BasilType.CoordSystem[message.posRef] : message.posRef;
            if (message.rotRef != null && message.hasOwnProperty("rotRef"))
                object.rotRef = options.enums === String ? $root.BasilType.RotationSystem[message.rotRef] : message.rotRef;
            return object;
        };

        CoordPosition.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CoordPosition;
    })();

    BasilType.ObjectIdentifier = (function() {

        function ObjectIdentifier(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        ObjectIdentifier.prototype.id = "";

        ObjectIdentifier.create = function create(properties) {
            return new ObjectIdentifier(properties);
        };

        ObjectIdentifier.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(10).string(message.id);
            return writer;
        };

        ObjectIdentifier.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        ObjectIdentifier.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilType.ObjectIdentifier();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        ObjectIdentifier.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        ObjectIdentifier.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            return null;
        };

        ObjectIdentifier.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.ObjectIdentifier)
                return object;
            let message = new $root.BasilType.ObjectIdentifier();
            if (object.id != null)
                message.id = String(object.id);
            return message;
        };

        ObjectIdentifier.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.id = "";
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            return object;
        };

        ObjectIdentifier.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ObjectIdentifier;
    })();

    BasilType.InstanceIdentifier = (function() {

        function InstanceIdentifier(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        InstanceIdentifier.prototype.id = "";

        InstanceIdentifier.create = function create(properties) {
            return new InstanceIdentifier(properties);
        };

        InstanceIdentifier.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(10).string(message.id);
            return writer;
        };

        InstanceIdentifier.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        InstanceIdentifier.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilType.InstanceIdentifier();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        InstanceIdentifier.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        InstanceIdentifier.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            return null;
        };

        InstanceIdentifier.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.InstanceIdentifier)
                return object;
            let message = new $root.BasilType.InstanceIdentifier();
            if (object.id != null)
                message.id = String(object.id);
            return message;
        };

        InstanceIdentifier.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.id = "";
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            return object;
        };

        InstanceIdentifier.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return InstanceIdentifier;
    })();

    BasilType.AaBoundingBox = (function() {

        function AaBoundingBox(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        AaBoundingBox.prototype.upperFrontLeft = null;
        AaBoundingBox.prototype.lowerBackRight = null;

        AaBoundingBox.create = function create(properties) {
            return new AaBoundingBox(properties);
        };

        AaBoundingBox.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.upperFrontLeft != null && Object.hasOwnProperty.call(message, "upperFrontLeft"))
                $root.BasilType.Vector3.encode(message.upperFrontLeft, writer.uint32(10).fork()).ldelim();
            if (message.lowerBackRight != null && Object.hasOwnProperty.call(message, "lowerBackRight"))
                $root.BasilType.Vector3.encode(message.lowerBackRight, writer.uint32(18).fork()).ldelim();
            return writer;
        };

        AaBoundingBox.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        AaBoundingBox.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilType.AaBoundingBox();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.upperFrontLeft = $root.BasilType.Vector3.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.lowerBackRight = $root.BasilType.Vector3.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        AaBoundingBox.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        AaBoundingBox.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.upperFrontLeft != null && message.hasOwnProperty("upperFrontLeft")) {
                let error = $root.BasilType.Vector3.verify(message.upperFrontLeft);
                if (error)
                    return "upperFrontLeft." + error;
            }
            if (message.lowerBackRight != null && message.hasOwnProperty("lowerBackRight")) {
                let error = $root.BasilType.Vector3.verify(message.lowerBackRight);
                if (error)
                    return "lowerBackRight." + error;
            }
            return null;
        };

        AaBoundingBox.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.AaBoundingBox)
                return object;
            let message = new $root.BasilType.AaBoundingBox();
            if (object.upperFrontLeft != null) {
                if (typeof object.upperFrontLeft !== "object")
                    throw TypeError(".BasilType.AaBoundingBox.upperFrontLeft: object expected");
                message.upperFrontLeft = $root.BasilType.Vector3.fromObject(object.upperFrontLeft);
            }
            if (object.lowerBackRight != null) {
                if (typeof object.lowerBackRight !== "object")
                    throw TypeError(".BasilType.AaBoundingBox.lowerBackRight: object expected");
                message.lowerBackRight = $root.BasilType.Vector3.fromObject(object.lowerBackRight);
            }
            return message;
        };

        AaBoundingBox.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.upperFrontLeft = null;
                object.lowerBackRight = null;
            }
            if (message.upperFrontLeft != null && message.hasOwnProperty("upperFrontLeft"))
                object.upperFrontLeft = $root.BasilType.Vector3.toObject(message.upperFrontLeft, options);
            if (message.lowerBackRight != null && message.hasOwnProperty("lowerBackRight"))
                object.lowerBackRight = $root.BasilType.Vector3.toObject(message.lowerBackRight, options);
            return object;
        };

        AaBoundingBox.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AaBoundingBox;
    })();

    BasilType.DisplayableInfo = (function() {

        function DisplayableInfo(properties) {
            this.asset = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        DisplayableInfo.prototype.aabb = null;
        DisplayableInfo.prototype.displayableType = "";
        DisplayableInfo.prototype.asset = $util.emptyObject;

        DisplayableInfo.create = function create(properties) {
            return new DisplayableInfo(properties);
        };

        DisplayableInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.aabb != null && Object.hasOwnProperty.call(message, "aabb"))
                $root.BasilType.AaBoundingBox.encode(message.aabb, writer.uint32(10).fork()).ldelim();
            if (message.displayableType != null && Object.hasOwnProperty.call(message, "displayableType"))
                writer.uint32(18).string(message.displayableType);
            if (message.asset != null && Object.hasOwnProperty.call(message, "asset"))
                for (let keys = Object.keys(message.asset), i = 0; i < keys.length; ++i)
                    writer.uint32(26).fork().uint32(10).string(keys[i]).uint32(18).string(message.asset[keys[i]]).ldelim();
            return writer;
        };

        DisplayableInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        DisplayableInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilType.DisplayableInfo(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.aabb = $root.BasilType.AaBoundingBox.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.displayableType = reader.string();
                    break;
                case 3:
                    reader.skip().pos++;
                    if (message.asset === $util.emptyObject)
                        message.asset = {};
                    key = reader.string();
                    reader.pos++;
                    message.asset[key] = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        DisplayableInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        DisplayableInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.aabb != null && message.hasOwnProperty("aabb")) {
                let error = $root.BasilType.AaBoundingBox.verify(message.aabb);
                if (error)
                    return "aabb." + error;
            }
            if (message.displayableType != null && message.hasOwnProperty("displayableType"))
                if (!$util.isString(message.displayableType))
                    return "displayableType: string expected";
            if (message.asset != null && message.hasOwnProperty("asset")) {
                if (!$util.isObject(message.asset))
                    return "asset: object expected";
                let key = Object.keys(message.asset);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.asset[key[i]]))
                        return "asset: string{k:string} expected";
            }
            return null;
        };

        DisplayableInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.DisplayableInfo)
                return object;
            let message = new $root.BasilType.DisplayableInfo();
            if (object.aabb != null) {
                if (typeof object.aabb !== "object")
                    throw TypeError(".BasilType.DisplayableInfo.aabb: object expected");
                message.aabb = $root.BasilType.AaBoundingBox.fromObject(object.aabb);
            }
            if (object.displayableType != null)
                message.displayableType = String(object.displayableType);
            if (object.asset) {
                if (typeof object.asset !== "object")
                    throw TypeError(".BasilType.DisplayableInfo.asset: object expected");
                message.asset = {};
                for (let keys = Object.keys(object.asset), i = 0; i < keys.length; ++i)
                    message.asset[keys[i]] = String(object.asset[keys[i]]);
            }
            return message;
        };

        DisplayableInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.asset = {};
            if (options.defaults) {
                object.aabb = null;
                object.displayableType = "";
            }
            if (message.aabb != null && message.hasOwnProperty("aabb"))
                object.aabb = $root.BasilType.AaBoundingBox.toObject(message.aabb, options);
            if (message.displayableType != null && message.hasOwnProperty("displayableType"))
                object.displayableType = message.displayableType;
            let keys2;
            if (message.asset && (keys2 = Object.keys(message.asset)).length) {
                object.asset = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.asset[keys2[j]] = message.asset[keys2[j]];
            }
            return object;
        };

        DisplayableInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DisplayableInfo;
    })();

    BasilType.AssetInformation = (function() {

        function AssetInformation(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        AssetInformation.prototype.id = null;
        AssetInformation.prototype.displayInfo = null;

        AssetInformation.create = function create(properties) {
            return new AssetInformation(properties);
        };

        AssetInformation.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                $root.BasilType.ObjectIdentifier.encode(message.id, writer.uint32(10).fork()).ldelim();
            if (message.displayInfo != null && Object.hasOwnProperty.call(message, "displayInfo"))
                $root.BasilType.DisplayableInfo.encode(message.displayInfo, writer.uint32(18).fork()).ldelim();
            return writer;
        };

        AssetInformation.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        AssetInformation.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilType.AssetInformation();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = $root.BasilType.ObjectIdentifier.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.displayInfo = $root.BasilType.DisplayableInfo.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        AssetInformation.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        AssetInformation.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id")) {
                let error = $root.BasilType.ObjectIdentifier.verify(message.id);
                if (error)
                    return "id." + error;
            }
            if (message.displayInfo != null && message.hasOwnProperty("displayInfo")) {
                let error = $root.BasilType.DisplayableInfo.verify(message.displayInfo);
                if (error)
                    return "displayInfo." + error;
            }
            return null;
        };

        AssetInformation.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.AssetInformation)
                return object;
            let message = new $root.BasilType.AssetInformation();
            if (object.id != null) {
                if (typeof object.id !== "object")
                    throw TypeError(".BasilType.AssetInformation.id: object expected");
                message.id = $root.BasilType.ObjectIdentifier.fromObject(object.id);
            }
            if (object.displayInfo != null) {
                if (typeof object.displayInfo !== "object")
                    throw TypeError(".BasilType.AssetInformation.displayInfo: object expected");
                message.displayInfo = $root.BasilType.DisplayableInfo.fromObject(object.displayInfo);
            }
            return message;
        };

        AssetInformation.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.id = null;
                object.displayInfo = null;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = $root.BasilType.ObjectIdentifier.toObject(message.id, options);
            if (message.displayInfo != null && message.hasOwnProperty("displayInfo"))
                object.displayInfo = $root.BasilType.DisplayableInfo.toObject(message.displayInfo, options);
            return object;
        };

        AssetInformation.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AssetInformation;
    })();

    BasilType.PathDescription = (function() {

        function PathDescription(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        PathDescription.prototype.pathType = "";

        PathDescription.create = function create(properties) {
            return new PathDescription(properties);
        };

        PathDescription.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.pathType != null && Object.hasOwnProperty.call(message, "pathType"))
                writer.uint32(10).string(message.pathType);
            return writer;
        };

        PathDescription.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        PathDescription.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilType.PathDescription();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.pathType = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        PathDescription.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        PathDescription.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.pathType != null && message.hasOwnProperty("pathType"))
                if (!$util.isString(message.pathType))
                    return "pathType: string expected";
            return null;
        };

        PathDescription.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.PathDescription)
                return object;
            let message = new $root.BasilType.PathDescription();
            if (object.pathType != null)
                message.pathType = String(object.pathType);
            return message;
        };

        PathDescription.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.pathType = "";
            if (message.pathType != null && message.hasOwnProperty("pathType"))
                object.pathType = message.pathType;
            return object;
        };

        PathDescription.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PathDescription;
    })();

    BasilType.InstancePositionInfo = (function() {

        function InstancePositionInfo(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        InstancePositionInfo.prototype.id = null;
        InstancePositionInfo.prototype.pos = null;
        InstancePositionInfo.prototype.vel = null;
        InstancePositionInfo.prototype.path = null;

        InstancePositionInfo.create = function create(properties) {
            return new InstancePositionInfo(properties);
        };

        InstancePositionInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                $root.BasilType.InstanceIdentifier.encode(message.id, writer.uint32(10).fork()).ldelim();
            if (message.pos != null && Object.hasOwnProperty.call(message, "pos"))
                $root.BasilType.CoordPosition.encode(message.pos, writer.uint32(18).fork()).ldelim();
            if (message.vel != null && Object.hasOwnProperty.call(message, "vel"))
                $root.BasilType.Vector3.encode(message.vel, writer.uint32(26).fork()).ldelim();
            if (message.path != null && Object.hasOwnProperty.call(message, "path"))
                $root.BasilType.PathDescription.encode(message.path, writer.uint32(34).fork()).ldelim();
            return writer;
        };

        InstancePositionInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        InstancePositionInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilType.InstancePositionInfo();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = $root.BasilType.InstanceIdentifier.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.pos = $root.BasilType.CoordPosition.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.vel = $root.BasilType.Vector3.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.path = $root.BasilType.PathDescription.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        InstancePositionInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        InstancePositionInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id")) {
                let error = $root.BasilType.InstanceIdentifier.verify(message.id);
                if (error)
                    return "id." + error;
            }
            if (message.pos != null && message.hasOwnProperty("pos")) {
                let error = $root.BasilType.CoordPosition.verify(message.pos);
                if (error)
                    return "pos." + error;
            }
            if (message.vel != null && message.hasOwnProperty("vel")) {
                let error = $root.BasilType.Vector3.verify(message.vel);
                if (error)
                    return "vel." + error;
            }
            if (message.path != null && message.hasOwnProperty("path")) {
                let error = $root.BasilType.PathDescription.verify(message.path);
                if (error)
                    return "path." + error;
            }
            return null;
        };

        InstancePositionInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.InstancePositionInfo)
                return object;
            let message = new $root.BasilType.InstancePositionInfo();
            if (object.id != null) {
                if (typeof object.id !== "object")
                    throw TypeError(".BasilType.InstancePositionInfo.id: object expected");
                message.id = $root.BasilType.InstanceIdentifier.fromObject(object.id);
            }
            if (object.pos != null) {
                if (typeof object.pos !== "object")
                    throw TypeError(".BasilType.InstancePositionInfo.pos: object expected");
                message.pos = $root.BasilType.CoordPosition.fromObject(object.pos);
            }
            if (object.vel != null) {
                if (typeof object.vel !== "object")
                    throw TypeError(".BasilType.InstancePositionInfo.vel: object expected");
                message.vel = $root.BasilType.Vector3.fromObject(object.vel);
            }
            if (object.path != null) {
                if (typeof object.path !== "object")
                    throw TypeError(".BasilType.InstancePositionInfo.path: object expected");
                message.path = $root.BasilType.PathDescription.fromObject(object.path);
            }
            return message;
        };

        InstancePositionInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.id = null;
                object.pos = null;
                object.vel = null;
                object.path = null;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = $root.BasilType.InstanceIdentifier.toObject(message.id, options);
            if (message.pos != null && message.hasOwnProperty("pos"))
                object.pos = $root.BasilType.CoordPosition.toObject(message.pos, options);
            if (message.vel != null && message.hasOwnProperty("vel"))
                object.vel = $root.BasilType.Vector3.toObject(message.vel, options);
            if (message.path != null && message.hasOwnProperty("path"))
                object.path = $root.BasilType.PathDescription.toObject(message.path, options);
            return object;
        };

        InstancePositionInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return InstancePositionInfo;
    })();

    BasilType.AccessAuthorization = (function() {

        function AccessAuthorization(properties) {
            this.accessProperties = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        AccessAuthorization.prototype.accessProperties = $util.emptyObject;

        AccessAuthorization.create = function create(properties) {
            return new AccessAuthorization(properties);
        };

        AccessAuthorization.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.accessProperties != null && Object.hasOwnProperty.call(message, "accessProperties"))
                for (let keys = Object.keys(message.accessProperties), i = 0; i < keys.length; ++i)
                    writer.uint32(10).fork().uint32(10).string(keys[i]).uint32(18).string(message.accessProperties[keys[i]]).ldelim();
            return writer;
        };

        AccessAuthorization.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        AccessAuthorization.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilType.AccessAuthorization(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    reader.skip().pos++;
                    if (message.accessProperties === $util.emptyObject)
                        message.accessProperties = {};
                    key = reader.string();
                    reader.pos++;
                    message.accessProperties[key] = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        AccessAuthorization.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        AccessAuthorization.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.accessProperties != null && message.hasOwnProperty("accessProperties")) {
                if (!$util.isObject(message.accessProperties))
                    return "accessProperties: object expected";
                let key = Object.keys(message.accessProperties);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.accessProperties[key[i]]))
                        return "accessProperties: string{k:string} expected";
            }
            return null;
        };

        AccessAuthorization.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.AccessAuthorization)
                return object;
            let message = new $root.BasilType.AccessAuthorization();
            if (object.accessProperties) {
                if (typeof object.accessProperties !== "object")
                    throw TypeError(".BasilType.AccessAuthorization.accessProperties: object expected");
                message.accessProperties = {};
                for (let keys = Object.keys(object.accessProperties), i = 0; i < keys.length; ++i)
                    message.accessProperties[keys[i]] = String(object.accessProperties[keys[i]]);
            }
            return message;
        };

        AccessAuthorization.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.accessProperties = {};
            let keys2;
            if (message.accessProperties && (keys2 = Object.keys(message.accessProperties)).length) {
                object.accessProperties = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.accessProperties[keys2[j]] = message.accessProperties[keys2[j]];
            }
            return object;
        };

        AccessAuthorization.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AccessAuthorization;
    })();

    BasilType.TraceInfo = (function() {

        function TraceInfo(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        TraceInfo.prototype.info = "";

        TraceInfo.create = function create(properties) {
            return new TraceInfo(properties);
        };

        TraceInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.info != null && Object.hasOwnProperty.call(message, "info"))
                writer.uint32(10).string(message.info);
            return writer;
        };

        TraceInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        TraceInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilType.TraceInfo();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.info = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        TraceInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        TraceInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.info != null && message.hasOwnProperty("info"))
                if (!$util.isString(message.info))
                    return "info: string expected";
            return null;
        };

        TraceInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.TraceInfo)
                return object;
            let message = new $root.BasilType.TraceInfo();
            if (object.info != null)
                message.info = String(object.info);
            return message;
        };

        TraceInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.info = "";
            if (message.info != null && message.hasOwnProperty("info"))
                object.info = message.info;
            return object;
        };

        TraceInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TraceInfo;
    })();

    BasilType.BResponseRequest = (function() {

        function BResponseRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        BResponseRequest.prototype.responseSession = 0;
        BResponseRequest.prototype.responseSessionKey = "";

        BResponseRequest.create = function create(properties) {
            return new BResponseRequest(properties);
        };

        BResponseRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.responseSession != null && Object.hasOwnProperty.call(message, "responseSession"))
                writer.uint32(8).uint32(message.responseSession);
            if (message.responseSessionKey != null && Object.hasOwnProperty.call(message, "responseSessionKey"))
                writer.uint32(18).string(message.responseSessionKey);
            return writer;
        };

        BResponseRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        BResponseRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilType.BResponseRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.responseSession = reader.uint32();
                    break;
                case 2:
                    message.responseSessionKey = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        BResponseRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        BResponseRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.responseSession != null && message.hasOwnProperty("responseSession"))
                if (!$util.isInteger(message.responseSession))
                    return "responseSession: integer expected";
            if (message.responseSessionKey != null && message.hasOwnProperty("responseSessionKey"))
                if (!$util.isString(message.responseSessionKey))
                    return "responseSessionKey: string expected";
            return null;
        };

        BResponseRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.BResponseRequest)
                return object;
            let message = new $root.BasilType.BResponseRequest();
            if (object.responseSession != null)
                message.responseSession = object.responseSession >>> 0;
            if (object.responseSessionKey != null)
                message.responseSessionKey = String(object.responseSessionKey);
            return message;
        };

        BResponseRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.responseSession = 0;
                object.responseSessionKey = "";
            }
            if (message.responseSession != null && message.hasOwnProperty("responseSession"))
                object.responseSession = message.responseSession;
            if (message.responseSessionKey != null && message.hasOwnProperty("responseSessionKey"))
                object.responseSessionKey = message.responseSessionKey;
            return object;
        };

        BResponseRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BResponseRequest;
    })();

    return BasilType;
})();

export const SpaceServer = $root.SpaceServer = (() => {

    const SpaceServer = {};

    SpaceServer.CameraViewReq = (function() {

        function CameraViewReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        CameraViewReq.prototype.auth = null;

        CameraViewReq.create = function create(properties) {
            return new CameraViewReq(properties);
        };

        CameraViewReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            return writer;
        };

        CameraViewReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CameraViewReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.SpaceServer.CameraViewReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        CameraViewReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        CameraViewReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            return null;
        };

        CameraViewReq.fromObject = function fromObject(object) {
            if (object instanceof $root.SpaceServer.CameraViewReq)
                return object;
            let message = new $root.SpaceServer.CameraViewReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".SpaceServer.CameraViewReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            return message;
        };

        CameraViewReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.auth = null;
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            return object;
        };

        CameraViewReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CameraViewReq;
    })();

    SpaceServer.CameraViewResp = (function() {

        function CameraViewResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        CameraViewResp.prototype.exception = null;

        CameraViewResp.create = function create(properties) {
            return new CameraViewResp(properties);
        };

        CameraViewResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            return writer;
        };

        CameraViewResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CameraViewResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.SpaceServer.CameraViewResp();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.exception = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        CameraViewResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        CameraViewResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.exception != null && message.hasOwnProperty("exception")) {
                let error = $root.BasilType.BasilException.verify(message.exception);
                if (error)
                    return "exception." + error;
            }
            return null;
        };

        CameraViewResp.fromObject = function fromObject(object) {
            if (object instanceof $root.SpaceServer.CameraViewResp)
                return object;
            let message = new $root.SpaceServer.CameraViewResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".SpaceServer.CameraViewResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            return message;
        };

        CameraViewResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.exception = null;
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = $root.BasilType.BasilException.toObject(message.exception, options);
            return object;
        };

        CameraViewResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CameraViewResp;
    })();

    SpaceServer.OpenSessionReq = (function() {

        function OpenSessionReq(properties) {
            this.features = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        OpenSessionReq.prototype.auth = null;
        OpenSessionReq.prototype.features = $util.emptyObject;

        OpenSessionReq.create = function create(properties) {
            return new OpenSessionReq(properties);
        };

        OpenSessionReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.features != null && Object.hasOwnProperty.call(message, "features"))
                for (let keys = Object.keys(message.features), i = 0; i < keys.length; ++i)
                    writer.uint32(18).fork().uint32(10).string(keys[i]).uint32(18).string(message.features[keys[i]]).ldelim();
            return writer;
        };

        OpenSessionReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        OpenSessionReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.SpaceServer.OpenSessionReq(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    reader.skip().pos++;
                    if (message.features === $util.emptyObject)
                        message.features = {};
                    key = reader.string();
                    reader.pos++;
                    message.features[key] = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        OpenSessionReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        OpenSessionReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.features != null && message.hasOwnProperty("features")) {
                if (!$util.isObject(message.features))
                    return "features: object expected";
                let key = Object.keys(message.features);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.features[key[i]]))
                        return "features: string{k:string} expected";
            }
            return null;
        };

        OpenSessionReq.fromObject = function fromObject(object) {
            if (object instanceof $root.SpaceServer.OpenSessionReq)
                return object;
            let message = new $root.SpaceServer.OpenSessionReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".SpaceServer.OpenSessionReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.features) {
                if (typeof object.features !== "object")
                    throw TypeError(".SpaceServer.OpenSessionReq.features: object expected");
                message.features = {};
                for (let keys = Object.keys(object.features), i = 0; i < keys.length; ++i)
                    message.features[keys[i]] = String(object.features[keys[i]]);
            }
            return message;
        };

        OpenSessionReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.features = {};
            if (options.defaults)
                object.auth = null;
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            let keys2;
            if (message.features && (keys2 = Object.keys(message.features)).length) {
                object.features = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.features[keys2[j]] = message.features[keys2[j]];
            }
            return object;
        };

        OpenSessionReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return OpenSessionReq;
    })();

    SpaceServer.OpenSessionResp = (function() {

        function OpenSessionResp(properties) {
            this.properties = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        OpenSessionResp.prototype.exception = null;
        OpenSessionResp.prototype.properties = $util.emptyObject;

        OpenSessionResp.create = function create(properties) {
            return new OpenSessionResp(properties);
        };

        OpenSessionResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            if (message.properties != null && Object.hasOwnProperty.call(message, "properties"))
                for (let keys = Object.keys(message.properties), i = 0; i < keys.length; ++i)
                    writer.uint32(18).fork().uint32(10).string(keys[i]).uint32(18).string(message.properties[keys[i]]).ldelim();
            return writer;
        };

        OpenSessionResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        OpenSessionResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.SpaceServer.OpenSessionResp(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.exception = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                case 2:
                    reader.skip().pos++;
                    if (message.properties === $util.emptyObject)
                        message.properties = {};
                    key = reader.string();
                    reader.pos++;
                    message.properties[key] = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        OpenSessionResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        OpenSessionResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.exception != null && message.hasOwnProperty("exception")) {
                let error = $root.BasilType.BasilException.verify(message.exception);
                if (error)
                    return "exception." + error;
            }
            if (message.properties != null && message.hasOwnProperty("properties")) {
                if (!$util.isObject(message.properties))
                    return "properties: object expected";
                let key = Object.keys(message.properties);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.properties[key[i]]))
                        return "properties: string{k:string} expected";
            }
            return null;
        };

        OpenSessionResp.fromObject = function fromObject(object) {
            if (object instanceof $root.SpaceServer.OpenSessionResp)
                return object;
            let message = new $root.SpaceServer.OpenSessionResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".SpaceServer.OpenSessionResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            if (object.properties) {
                if (typeof object.properties !== "object")
                    throw TypeError(".SpaceServer.OpenSessionResp.properties: object expected");
                message.properties = {};
                for (let keys = Object.keys(object.properties), i = 0; i < keys.length; ++i)
                    message.properties[keys[i]] = String(object.properties[keys[i]]);
            }
            return message;
        };

        OpenSessionResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.properties = {};
            if (options.defaults)
                object.exception = null;
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = $root.BasilType.BasilException.toObject(message.exception, options);
            let keys2;
            if (message.properties && (keys2 = Object.keys(message.properties)).length) {
                object.properties = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.properties[keys2[j]] = message.properties[keys2[j]];
            }
            return object;
        };

        OpenSessionResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return OpenSessionResp;
    })();

    SpaceServer.RenewSessionReq = (function() {

        function RenewSessionReq(properties) {
            this.properties = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        RenewSessionReq.prototype.auth = null;
        RenewSessionReq.prototype.properties = $util.emptyObject;

        RenewSessionReq.create = function create(properties) {
            return new RenewSessionReq(properties);
        };

        RenewSessionReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.properties != null && Object.hasOwnProperty.call(message, "properties"))
                for (let keys = Object.keys(message.properties), i = 0; i < keys.length; ++i)
                    writer.uint32(18).fork().uint32(10).string(keys[i]).uint32(18).string(message.properties[keys[i]]).ldelim();
            return writer;
        };

        RenewSessionReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        RenewSessionReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.SpaceServer.RenewSessionReq(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    reader.skip().pos++;
                    if (message.properties === $util.emptyObject)
                        message.properties = {};
                    key = reader.string();
                    reader.pos++;
                    message.properties[key] = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        RenewSessionReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        RenewSessionReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.properties != null && message.hasOwnProperty("properties")) {
                if (!$util.isObject(message.properties))
                    return "properties: object expected";
                let key = Object.keys(message.properties);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.properties[key[i]]))
                        return "properties: string{k:string} expected";
            }
            return null;
        };

        RenewSessionReq.fromObject = function fromObject(object) {
            if (object instanceof $root.SpaceServer.RenewSessionReq)
                return object;
            let message = new $root.SpaceServer.RenewSessionReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".SpaceServer.RenewSessionReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.properties) {
                if (typeof object.properties !== "object")
                    throw TypeError(".SpaceServer.RenewSessionReq.properties: object expected");
                message.properties = {};
                for (let keys = Object.keys(object.properties), i = 0; i < keys.length; ++i)
                    message.properties[keys[i]] = String(object.properties[keys[i]]);
            }
            return message;
        };

        RenewSessionReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.properties = {};
            if (options.defaults)
                object.auth = null;
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            let keys2;
            if (message.properties && (keys2 = Object.keys(message.properties)).length) {
                object.properties = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.properties[keys2[j]] = message.properties[keys2[j]];
            }
            return object;
        };

        RenewSessionReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RenewSessionReq;
    })();

    SpaceServer.RenewSessionResp = (function() {

        function RenewSessionResp(properties) {
            this.properties = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        RenewSessionResp.prototype.exception = null;
        RenewSessionResp.prototype.properties = $util.emptyObject;

        RenewSessionResp.create = function create(properties) {
            return new RenewSessionResp(properties);
        };

        RenewSessionResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            if (message.properties != null && Object.hasOwnProperty.call(message, "properties"))
                for (let keys = Object.keys(message.properties), i = 0; i < keys.length; ++i)
                    writer.uint32(18).fork().uint32(10).string(keys[i]).uint32(18).string(message.properties[keys[i]]).ldelim();
            return writer;
        };

        RenewSessionResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        RenewSessionResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.SpaceServer.RenewSessionResp(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.exception = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                case 2:
                    reader.skip().pos++;
                    if (message.properties === $util.emptyObject)
                        message.properties = {};
                    key = reader.string();
                    reader.pos++;
                    message.properties[key] = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        RenewSessionResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        RenewSessionResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.exception != null && message.hasOwnProperty("exception")) {
                let error = $root.BasilType.BasilException.verify(message.exception);
                if (error)
                    return "exception." + error;
            }
            if (message.properties != null && message.hasOwnProperty("properties")) {
                if (!$util.isObject(message.properties))
                    return "properties: object expected";
                let key = Object.keys(message.properties);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.properties[key[i]]))
                        return "properties: string{k:string} expected";
            }
            return null;
        };

        RenewSessionResp.fromObject = function fromObject(object) {
            if (object instanceof $root.SpaceServer.RenewSessionResp)
                return object;
            let message = new $root.SpaceServer.RenewSessionResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".SpaceServer.RenewSessionResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            if (object.properties) {
                if (typeof object.properties !== "object")
                    throw TypeError(".SpaceServer.RenewSessionResp.properties: object expected");
                message.properties = {};
                for (let keys = Object.keys(object.properties), i = 0; i < keys.length; ++i)
                    message.properties[keys[i]] = String(object.properties[keys[i]]);
            }
            return message;
        };

        RenewSessionResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.properties = {};
            if (options.defaults)
                object.exception = null;
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = $root.BasilType.BasilException.toObject(message.exception, options);
            let keys2;
            if (message.properties && (keys2 = Object.keys(message.properties)).length) {
                object.properties = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.properties[keys2[j]] = message.properties[keys2[j]];
            }
            return object;
        };

        RenewSessionResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RenewSessionResp;
    })();

    SpaceServer.CloseSessionReq = (function() {

        function CloseSessionReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        CloseSessionReq.prototype.auth = null;
        CloseSessionReq.prototype.reason = "";

        CloseSessionReq.create = function create(properties) {
            return new CloseSessionReq(properties);
        };

        CloseSessionReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.reason != null && Object.hasOwnProperty.call(message, "reason"))
                writer.uint32(18).string(message.reason);
            return writer;
        };

        CloseSessionReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CloseSessionReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.SpaceServer.CloseSessionReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.reason = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        CloseSessionReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        CloseSessionReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.reason != null && message.hasOwnProperty("reason"))
                if (!$util.isString(message.reason))
                    return "reason: string expected";
            return null;
        };

        CloseSessionReq.fromObject = function fromObject(object) {
            if (object instanceof $root.SpaceServer.CloseSessionReq)
                return object;
            let message = new $root.SpaceServer.CloseSessionReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".SpaceServer.CloseSessionReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.reason != null)
                message.reason = String(object.reason);
            return message;
        };

        CloseSessionReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.reason = "";
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.reason != null && message.hasOwnProperty("reason"))
                object.reason = message.reason;
            return object;
        };

        CloseSessionReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CloseSessionReq;
    })();

    SpaceServer.CloseSessionResp = (function() {

        function CloseSessionResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        CloseSessionResp.prototype.exception = null;

        CloseSessionResp.create = function create(properties) {
            return new CloseSessionResp(properties);
        };

        CloseSessionResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            return writer;
        };

        CloseSessionResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CloseSessionResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.SpaceServer.CloseSessionResp();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.exception = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        CloseSessionResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        CloseSessionResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.exception != null && message.hasOwnProperty("exception")) {
                let error = $root.BasilType.BasilException.verify(message.exception);
                if (error)
                    return "exception." + error;
            }
            return null;
        };

        CloseSessionResp.fromObject = function fromObject(object) {
            if (object instanceof $root.SpaceServer.CloseSessionResp)
                return object;
            let message = new $root.SpaceServer.CloseSessionResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".SpaceServer.CloseSessionResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            return message;
        };

        CloseSessionResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.exception = null;
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = $root.BasilType.BasilException.toObject(message.exception, options);
            return object;
        };

        CloseSessionResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CloseSessionResp;
    })();

    SpaceServer.SpaceServer = (function() {

        function SpaceServer(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (SpaceServer.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = SpaceServer;

        SpaceServer.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };


        Object.defineProperty(SpaceServer.prototype.openSession = function openSession(request, callback) {
            return this.rpcCall(openSession, $root.SpaceServer.OpenSessionReq, $root.SpaceServer.OpenSessionResp, request, callback);
        }, "name", { value: "OpenSession" });


        Object.defineProperty(SpaceServer.prototype.closeSession = function closeSession(request, callback) {
            return this.rpcCall(closeSession, $root.SpaceServer.CloseSessionReq, $root.SpaceServer.CloseSessionResp, request, callback);
        }, "name", { value: "CloseSession" });

        return SpaceServer;
    })();

    return SpaceServer;
})();

export const BasilServer = $root.BasilServer = (() => {

    const BasilServer = {};

    BasilServer.CreateItemReq = (function() {

        function CreateItemReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        CreateItemReq.prototype.auth = null;
        CreateItemReq.prototype.objectId = null;

        CreateItemReq.create = function create(properties) {
            return new CreateItemReq(properties);
        };

        CreateItemReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                $root.BasilType.ObjectIdentifier.encode(message.objectId, writer.uint32(18).fork()).ldelim();
            return writer;
        };

        CreateItemReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CreateItemReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.CreateItemReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.objectId = $root.BasilType.ObjectIdentifier.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        CreateItemReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        CreateItemReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.objectId != null && message.hasOwnProperty("objectId")) {
                let error = $root.BasilType.ObjectIdentifier.verify(message.objectId);
                if (error)
                    return "objectId." + error;
            }
            return null;
        };

        CreateItemReq.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.CreateItemReq)
                return object;
            let message = new $root.BasilServer.CreateItemReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilServer.CreateItemReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.objectId != null) {
                if (typeof object.objectId !== "object")
                    throw TypeError(".BasilServer.CreateItemReq.objectId: object expected");
                message.objectId = $root.BasilType.ObjectIdentifier.fromObject(object.objectId);
            }
            return message;
        };

        CreateItemReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.objectId = null;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                object.objectId = $root.BasilType.ObjectIdentifier.toObject(message.objectId, options);
            return object;
        };

        CreateItemReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CreateItemReq;
    })();

    BasilServer.CreateItemResp = (function() {

        function CreateItemResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        CreateItemResp.prototype.exception = null;

        CreateItemResp.create = function create(properties) {
            return new CreateItemResp(properties);
        };

        CreateItemResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            return writer;
        };

        CreateItemResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CreateItemResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.CreateItemResp();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.exception = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        CreateItemResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        CreateItemResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.exception != null && message.hasOwnProperty("exception")) {
                let error = $root.BasilType.BasilException.verify(message.exception);
                if (error)
                    return "exception." + error;
            }
            return null;
        };

        CreateItemResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.CreateItemResp)
                return object;
            let message = new $root.BasilServer.CreateItemResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilServer.CreateItemResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            return message;
        };

        CreateItemResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.exception = null;
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = $root.BasilType.BasilException.toObject(message.exception, options);
            return object;
        };

        CreateItemResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CreateItemResp;
    })();

    BasilServer.CreateItemWithAbilityReq = (function() {

        function CreateItemWithAbilityReq(properties) {
            this.propertiesToSet = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        CreateItemWithAbilityReq.prototype.auth = "";
        CreateItemWithAbilityReq.prototype.itemId = "";
        CreateItemWithAbilityReq.prototype.AbilityName = "";
        CreateItemWithAbilityReq.prototype.propertiesToSet = $util.emptyObject;

        CreateItemWithAbilityReq.create = function create(properties) {
            return new CreateItemWithAbilityReq(properties);
        };

        CreateItemWithAbilityReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                writer.uint32(10).string(message.auth);
            if (message.itemId != null && Object.hasOwnProperty.call(message, "itemId"))
                writer.uint32(18).string(message.itemId);
            if (message.AbilityName != null && Object.hasOwnProperty.call(message, "AbilityName"))
                writer.uint32(26).string(message.AbilityName);
            if (message.propertiesToSet != null && Object.hasOwnProperty.call(message, "propertiesToSet"))
                for (let keys = Object.keys(message.propertiesToSet), i = 0; i < keys.length; ++i)
                    writer.uint32(34).fork().uint32(10).string(keys[i]).uint32(18).string(message.propertiesToSet[keys[i]]).ldelim();
            return writer;
        };

        CreateItemWithAbilityReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CreateItemWithAbilityReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.CreateItemWithAbilityReq(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = reader.string();
                    break;
                case 2:
                    message.itemId = reader.string();
                    break;
                case 3:
                    message.AbilityName = reader.string();
                    break;
                case 4:
                    reader.skip().pos++;
                    if (message.propertiesToSet === $util.emptyObject)
                        message.propertiesToSet = {};
                    key = reader.string();
                    reader.pos++;
                    message.propertiesToSet[key] = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        CreateItemWithAbilityReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        CreateItemWithAbilityReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth"))
                if (!$util.isString(message.auth))
                    return "auth: string expected";
            if (message.itemId != null && message.hasOwnProperty("itemId"))
                if (!$util.isString(message.itemId))
                    return "itemId: string expected";
            if (message.AbilityName != null && message.hasOwnProperty("AbilityName"))
                if (!$util.isString(message.AbilityName))
                    return "AbilityName: string expected";
            if (message.propertiesToSet != null && message.hasOwnProperty("propertiesToSet")) {
                if (!$util.isObject(message.propertiesToSet))
                    return "propertiesToSet: object expected";
                let key = Object.keys(message.propertiesToSet);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.propertiesToSet[key[i]]))
                        return "propertiesToSet: string{k:string} expected";
            }
            return null;
        };

        CreateItemWithAbilityReq.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.CreateItemWithAbilityReq)
                return object;
            let message = new $root.BasilServer.CreateItemWithAbilityReq();
            if (object.auth != null)
                message.auth = String(object.auth);
            if (object.itemId != null)
                message.itemId = String(object.itemId);
            if (object.AbilityName != null)
                message.AbilityName = String(object.AbilityName);
            if (object.propertiesToSet) {
                if (typeof object.propertiesToSet !== "object")
                    throw TypeError(".BasilServer.CreateItemWithAbilityReq.propertiesToSet: object expected");
                message.propertiesToSet = {};
                for (let keys = Object.keys(object.propertiesToSet), i = 0; i < keys.length; ++i)
                    message.propertiesToSet[keys[i]] = String(object.propertiesToSet[keys[i]]);
            }
            return message;
        };

        CreateItemWithAbilityReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.propertiesToSet = {};
            if (options.defaults) {
                object.auth = "";
                object.itemId = "";
                object.AbilityName = "";
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = message.auth;
            if (message.itemId != null && message.hasOwnProperty("itemId"))
                object.itemId = message.itemId;
            if (message.AbilityName != null && message.hasOwnProperty("AbilityName"))
                object.AbilityName = message.AbilityName;
            let keys2;
            if (message.propertiesToSet && (keys2 = Object.keys(message.propertiesToSet)).length) {
                object.propertiesToSet = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.propertiesToSet[keys2[j]] = message.propertiesToSet[keys2[j]];
            }
            return object;
        };

        CreateItemWithAbilityReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CreateItemWithAbilityReq;
    })();

    BasilServer.CreateItemWithAbilityResp = (function() {

        function CreateItemWithAbilityResp(properties) {
            this.exceptionHints = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        CreateItemWithAbilityResp.prototype.exception = "";
        CreateItemWithAbilityResp.prototype.exceptionHints = $util.emptyObject;

        CreateItemWithAbilityResp.create = function create(properties) {
            return new CreateItemWithAbilityResp(properties);
        };

        CreateItemWithAbilityResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                writer.uint32(10).string(message.exception);
            if (message.exceptionHints != null && Object.hasOwnProperty.call(message, "exceptionHints"))
                for (let keys = Object.keys(message.exceptionHints), i = 0; i < keys.length; ++i)
                    writer.uint32(18).fork().uint32(10).string(keys[i]).uint32(18).string(message.exceptionHints[keys[i]]).ldelim();
            return writer;
        };

        CreateItemWithAbilityResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CreateItemWithAbilityResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.CreateItemWithAbilityResp(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.exception = reader.string();
                    break;
                case 2:
                    reader.skip().pos++;
                    if (message.exceptionHints === $util.emptyObject)
                        message.exceptionHints = {};
                    key = reader.string();
                    reader.pos++;
                    message.exceptionHints[key] = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        CreateItemWithAbilityResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        CreateItemWithAbilityResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.exception != null && message.hasOwnProperty("exception"))
                if (!$util.isString(message.exception))
                    return "exception: string expected";
            if (message.exceptionHints != null && message.hasOwnProperty("exceptionHints")) {
                if (!$util.isObject(message.exceptionHints))
                    return "exceptionHints: object expected";
                let key = Object.keys(message.exceptionHints);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.exceptionHints[key[i]]))
                        return "exceptionHints: string{k:string} expected";
            }
            return null;
        };

        CreateItemWithAbilityResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.CreateItemWithAbilityResp)
                return object;
            let message = new $root.BasilServer.CreateItemWithAbilityResp();
            if (object.exception != null)
                message.exception = String(object.exception);
            if (object.exceptionHints) {
                if (typeof object.exceptionHints !== "object")
                    throw TypeError(".BasilServer.CreateItemWithAbilityResp.exceptionHints: object expected");
                message.exceptionHints = {};
                for (let keys = Object.keys(object.exceptionHints), i = 0; i < keys.length; ++i)
                    message.exceptionHints[keys[i]] = String(object.exceptionHints[keys[i]]);
            }
            return message;
        };

        CreateItemWithAbilityResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.exceptionHints = {};
            if (options.defaults)
                object.exception = "";
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = message.exception;
            let keys2;
            if (message.exceptionHints && (keys2 = Object.keys(message.exceptionHints)).length) {
                object.exceptionHints = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.exceptionHints[keys2[j]] = message.exceptionHints[keys2[j]];
            }
            return object;
        };

        CreateItemWithAbilityResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CreateItemWithAbilityResp;
    })();

    BasilServer.AddAbilityReq = (function() {

        function AddAbilityReq(properties) {
            this.propertiesToSet = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        AddAbilityReq.prototype.auth = "";
        AddAbilityReq.prototype.itemId = "";
        AddAbilityReq.prototype.AbilityName = "";
        AddAbilityReq.prototype.propertiesToSet = $util.emptyObject;

        AddAbilityReq.create = function create(properties) {
            return new AddAbilityReq(properties);
        };

        AddAbilityReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                writer.uint32(10).string(message.auth);
            if (message.itemId != null && Object.hasOwnProperty.call(message, "itemId"))
                writer.uint32(18).string(message.itemId);
            if (message.AbilityName != null && Object.hasOwnProperty.call(message, "AbilityName"))
                writer.uint32(26).string(message.AbilityName);
            if (message.propertiesToSet != null && Object.hasOwnProperty.call(message, "propertiesToSet"))
                for (let keys = Object.keys(message.propertiesToSet), i = 0; i < keys.length; ++i)
                    writer.uint32(34).fork().uint32(10).string(keys[i]).uint32(18).string(message.propertiesToSet[keys[i]]).ldelim();
            return writer;
        };

        AddAbilityReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        AddAbilityReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.AddAbilityReq(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = reader.string();
                    break;
                case 2:
                    message.itemId = reader.string();
                    break;
                case 3:
                    message.AbilityName = reader.string();
                    break;
                case 4:
                    reader.skip().pos++;
                    if (message.propertiesToSet === $util.emptyObject)
                        message.propertiesToSet = {};
                    key = reader.string();
                    reader.pos++;
                    message.propertiesToSet[key] = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        AddAbilityReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        AddAbilityReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth"))
                if (!$util.isString(message.auth))
                    return "auth: string expected";
            if (message.itemId != null && message.hasOwnProperty("itemId"))
                if (!$util.isString(message.itemId))
                    return "itemId: string expected";
            if (message.AbilityName != null && message.hasOwnProperty("AbilityName"))
                if (!$util.isString(message.AbilityName))
                    return "AbilityName: string expected";
            if (message.propertiesToSet != null && message.hasOwnProperty("propertiesToSet")) {
                if (!$util.isObject(message.propertiesToSet))
                    return "propertiesToSet: object expected";
                let key = Object.keys(message.propertiesToSet);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.propertiesToSet[key[i]]))
                        return "propertiesToSet: string{k:string} expected";
            }
            return null;
        };

        AddAbilityReq.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.AddAbilityReq)
                return object;
            let message = new $root.BasilServer.AddAbilityReq();
            if (object.auth != null)
                message.auth = String(object.auth);
            if (object.itemId != null)
                message.itemId = String(object.itemId);
            if (object.AbilityName != null)
                message.AbilityName = String(object.AbilityName);
            if (object.propertiesToSet) {
                if (typeof object.propertiesToSet !== "object")
                    throw TypeError(".BasilServer.AddAbilityReq.propertiesToSet: object expected");
                message.propertiesToSet = {};
                for (let keys = Object.keys(object.propertiesToSet), i = 0; i < keys.length; ++i)
                    message.propertiesToSet[keys[i]] = String(object.propertiesToSet[keys[i]]);
            }
            return message;
        };

        AddAbilityReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.propertiesToSet = {};
            if (options.defaults) {
                object.auth = "";
                object.itemId = "";
                object.AbilityName = "";
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = message.auth;
            if (message.itemId != null && message.hasOwnProperty("itemId"))
                object.itemId = message.itemId;
            if (message.AbilityName != null && message.hasOwnProperty("AbilityName"))
                object.AbilityName = message.AbilityName;
            let keys2;
            if (message.propertiesToSet && (keys2 = Object.keys(message.propertiesToSet)).length) {
                object.propertiesToSet = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.propertiesToSet[keys2[j]] = message.propertiesToSet[keys2[j]];
            }
            return object;
        };

        AddAbilityReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AddAbilityReq;
    })();

    BasilServer.AddAbilityResp = (function() {

        function AddAbilityResp(properties) {
            this.exceptionHints = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        AddAbilityResp.prototype.exception = "";
        AddAbilityResp.prototype.exceptionHints = $util.emptyObject;

        AddAbilityResp.create = function create(properties) {
            return new AddAbilityResp(properties);
        };

        AddAbilityResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                writer.uint32(10).string(message.exception);
            if (message.exceptionHints != null && Object.hasOwnProperty.call(message, "exceptionHints"))
                for (let keys = Object.keys(message.exceptionHints), i = 0; i < keys.length; ++i)
                    writer.uint32(18).fork().uint32(10).string(keys[i]).uint32(18).string(message.exceptionHints[keys[i]]).ldelim();
            return writer;
        };

        AddAbilityResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        AddAbilityResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.AddAbilityResp(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.exception = reader.string();
                    break;
                case 2:
                    reader.skip().pos++;
                    if (message.exceptionHints === $util.emptyObject)
                        message.exceptionHints = {};
                    key = reader.string();
                    reader.pos++;
                    message.exceptionHints[key] = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        AddAbilityResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        AddAbilityResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.exception != null && message.hasOwnProperty("exception"))
                if (!$util.isString(message.exception))
                    return "exception: string expected";
            if (message.exceptionHints != null && message.hasOwnProperty("exceptionHints")) {
                if (!$util.isObject(message.exceptionHints))
                    return "exceptionHints: object expected";
                let key = Object.keys(message.exceptionHints);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.exceptionHints[key[i]]))
                        return "exceptionHints: string{k:string} expected";
            }
            return null;
        };

        AddAbilityResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.AddAbilityResp)
                return object;
            let message = new $root.BasilServer.AddAbilityResp();
            if (object.exception != null)
                message.exception = String(object.exception);
            if (object.exceptionHints) {
                if (typeof object.exceptionHints !== "object")
                    throw TypeError(".BasilServer.AddAbilityResp.exceptionHints: object expected");
                message.exceptionHints = {};
                for (let keys = Object.keys(object.exceptionHints), i = 0; i < keys.length; ++i)
                    message.exceptionHints[keys[i]] = String(object.exceptionHints[keys[i]]);
            }
            return message;
        };

        AddAbilityResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.exceptionHints = {};
            if (options.defaults)
                object.exception = "";
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = message.exception;
            let keys2;
            if (message.exceptionHints && (keys2 = Object.keys(message.exceptionHints)).length) {
                object.exceptionHints = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.exceptionHints[keys2[j]] = message.exceptionHints[keys2[j]];
            }
            return object;
        };

        AddAbilityResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AddAbilityResp;
    })();

    BasilServer.RemoveAbilityReq = (function() {

        function RemoveAbilityReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        RemoveAbilityReq.prototype.auth = "";
        RemoveAbilityReq.prototype.itemId = "";
        RemoveAbilityReq.prototype.AbilityName = "";

        RemoveAbilityReq.create = function create(properties) {
            return new RemoveAbilityReq(properties);
        };

        RemoveAbilityReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                writer.uint32(10).string(message.auth);
            if (message.itemId != null && Object.hasOwnProperty.call(message, "itemId"))
                writer.uint32(18).string(message.itemId);
            if (message.AbilityName != null && Object.hasOwnProperty.call(message, "AbilityName"))
                writer.uint32(26).string(message.AbilityName);
            return writer;
        };

        RemoveAbilityReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        RemoveAbilityReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.RemoveAbilityReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = reader.string();
                    break;
                case 2:
                    message.itemId = reader.string();
                    break;
                case 3:
                    message.AbilityName = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        RemoveAbilityReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        RemoveAbilityReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth"))
                if (!$util.isString(message.auth))
                    return "auth: string expected";
            if (message.itemId != null && message.hasOwnProperty("itemId"))
                if (!$util.isString(message.itemId))
                    return "itemId: string expected";
            if (message.AbilityName != null && message.hasOwnProperty("AbilityName"))
                if (!$util.isString(message.AbilityName))
                    return "AbilityName: string expected";
            return null;
        };

        RemoveAbilityReq.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.RemoveAbilityReq)
                return object;
            let message = new $root.BasilServer.RemoveAbilityReq();
            if (object.auth != null)
                message.auth = String(object.auth);
            if (object.itemId != null)
                message.itemId = String(object.itemId);
            if (object.AbilityName != null)
                message.AbilityName = String(object.AbilityName);
            return message;
        };

        RemoveAbilityReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = "";
                object.itemId = "";
                object.AbilityName = "";
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = message.auth;
            if (message.itemId != null && message.hasOwnProperty("itemId"))
                object.itemId = message.itemId;
            if (message.AbilityName != null && message.hasOwnProperty("AbilityName"))
                object.AbilityName = message.AbilityName;
            return object;
        };

        RemoveAbilityReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RemoveAbilityReq;
    })();

    BasilServer.RemoveAbilityResp = (function() {

        function RemoveAbilityResp(properties) {
            this.exceptionHints = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        RemoveAbilityResp.prototype.exception = "";
        RemoveAbilityResp.prototype.exceptionHints = $util.emptyObject;

        RemoveAbilityResp.create = function create(properties) {
            return new RemoveAbilityResp(properties);
        };

        RemoveAbilityResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                writer.uint32(10).string(message.exception);
            if (message.exceptionHints != null && Object.hasOwnProperty.call(message, "exceptionHints"))
                for (let keys = Object.keys(message.exceptionHints), i = 0; i < keys.length; ++i)
                    writer.uint32(18).fork().uint32(10).string(keys[i]).uint32(18).string(message.exceptionHints[keys[i]]).ldelim();
            return writer;
        };

        RemoveAbilityResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        RemoveAbilityResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.RemoveAbilityResp(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.exception = reader.string();
                    break;
                case 2:
                    reader.skip().pos++;
                    if (message.exceptionHints === $util.emptyObject)
                        message.exceptionHints = {};
                    key = reader.string();
                    reader.pos++;
                    message.exceptionHints[key] = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        RemoveAbilityResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        RemoveAbilityResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.exception != null && message.hasOwnProperty("exception"))
                if (!$util.isString(message.exception))
                    return "exception: string expected";
            if (message.exceptionHints != null && message.hasOwnProperty("exceptionHints")) {
                if (!$util.isObject(message.exceptionHints))
                    return "exceptionHints: object expected";
                let key = Object.keys(message.exceptionHints);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.exceptionHints[key[i]]))
                        return "exceptionHints: string{k:string} expected";
            }
            return null;
        };

        RemoveAbilityResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.RemoveAbilityResp)
                return object;
            let message = new $root.BasilServer.RemoveAbilityResp();
            if (object.exception != null)
                message.exception = String(object.exception);
            if (object.exceptionHints) {
                if (typeof object.exceptionHints !== "object")
                    throw TypeError(".BasilServer.RemoveAbilityResp.exceptionHints: object expected");
                message.exceptionHints = {};
                for (let keys = Object.keys(object.exceptionHints), i = 0; i < keys.length; ++i)
                    message.exceptionHints[keys[i]] = String(object.exceptionHints[keys[i]]);
            }
            return message;
        };

        RemoveAbilityResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.exceptionHints = {};
            if (options.defaults)
                object.exception = "";
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = message.exception;
            let keys2;
            if (message.exceptionHints && (keys2 = Object.keys(message.exceptionHints)).length) {
                object.exceptionHints = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.exceptionHints[keys2[j]] = message.exceptionHints[keys2[j]];
            }
            return object;
        };

        RemoveAbilityResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RemoveAbilityResp;
    })();

    BasilServer.IdentifyDisplayableObjectReq = (function() {

        function IdentifyDisplayableObjectReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        IdentifyDisplayableObjectReq.prototype.auth = null;
        IdentifyDisplayableObjectReq.prototype.assetInfo = null;
        IdentifyDisplayableObjectReq.prototype.objectId = null;
        IdentifyDisplayableObjectReq.prototype.aabb = null;

        IdentifyDisplayableObjectReq.create = function create(properties) {
            return new IdentifyDisplayableObjectReq(properties);
        };

        IdentifyDisplayableObjectReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.assetInfo != null && Object.hasOwnProperty.call(message, "assetInfo"))
                $root.BasilType.AssetInformation.encode(message.assetInfo, writer.uint32(18).fork()).ldelim();
            if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                $root.BasilType.ObjectIdentifier.encode(message.objectId, writer.uint32(26).fork()).ldelim();
            if (message.aabb != null && Object.hasOwnProperty.call(message, "aabb"))
                $root.BasilType.AaBoundingBox.encode(message.aabb, writer.uint32(34).fork()).ldelim();
            return writer;
        };

        IdentifyDisplayableObjectReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        IdentifyDisplayableObjectReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.IdentifyDisplayableObjectReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.assetInfo = $root.BasilType.AssetInformation.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.objectId = $root.BasilType.ObjectIdentifier.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.aabb = $root.BasilType.AaBoundingBox.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        IdentifyDisplayableObjectReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        IdentifyDisplayableObjectReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.assetInfo != null && message.hasOwnProperty("assetInfo")) {
                let error = $root.BasilType.AssetInformation.verify(message.assetInfo);
                if (error)
                    return "assetInfo." + error;
            }
            if (message.objectId != null && message.hasOwnProperty("objectId")) {
                let error = $root.BasilType.ObjectIdentifier.verify(message.objectId);
                if (error)
                    return "objectId." + error;
            }
            if (message.aabb != null && message.hasOwnProperty("aabb")) {
                let error = $root.BasilType.AaBoundingBox.verify(message.aabb);
                if (error)
                    return "aabb." + error;
            }
            return null;
        };

        IdentifyDisplayableObjectReq.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.IdentifyDisplayableObjectReq)
                return object;
            let message = new $root.BasilServer.IdentifyDisplayableObjectReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilServer.IdentifyDisplayableObjectReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.assetInfo != null) {
                if (typeof object.assetInfo !== "object")
                    throw TypeError(".BasilServer.IdentifyDisplayableObjectReq.assetInfo: object expected");
                message.assetInfo = $root.BasilType.AssetInformation.fromObject(object.assetInfo);
            }
            if (object.objectId != null) {
                if (typeof object.objectId !== "object")
                    throw TypeError(".BasilServer.IdentifyDisplayableObjectReq.objectId: object expected");
                message.objectId = $root.BasilType.ObjectIdentifier.fromObject(object.objectId);
            }
            if (object.aabb != null) {
                if (typeof object.aabb !== "object")
                    throw TypeError(".BasilServer.IdentifyDisplayableObjectReq.aabb: object expected");
                message.aabb = $root.BasilType.AaBoundingBox.fromObject(object.aabb);
            }
            return message;
        };

        IdentifyDisplayableObjectReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.assetInfo = null;
                object.objectId = null;
                object.aabb = null;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.assetInfo != null && message.hasOwnProperty("assetInfo"))
                object.assetInfo = $root.BasilType.AssetInformation.toObject(message.assetInfo, options);
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                object.objectId = $root.BasilType.ObjectIdentifier.toObject(message.objectId, options);
            if (message.aabb != null && message.hasOwnProperty("aabb"))
                object.aabb = $root.BasilType.AaBoundingBox.toObject(message.aabb, options);
            return object;
        };

        IdentifyDisplayableObjectReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return IdentifyDisplayableObjectReq;
    })();

    BasilServer.IdentifyDisplayableObjectResp = (function() {

        function IdentifyDisplayableObjectResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        IdentifyDisplayableObjectResp.prototype.exception = null;
        IdentifyDisplayableObjectResp.prototype.objectId = null;

        IdentifyDisplayableObjectResp.create = function create(properties) {
            return new IdentifyDisplayableObjectResp(properties);
        };

        IdentifyDisplayableObjectResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                $root.BasilType.ObjectIdentifier.encode(message.objectId, writer.uint32(18).fork()).ldelim();
            return writer;
        };

        IdentifyDisplayableObjectResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        IdentifyDisplayableObjectResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.IdentifyDisplayableObjectResp();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.exception = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.objectId = $root.BasilType.ObjectIdentifier.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        IdentifyDisplayableObjectResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        IdentifyDisplayableObjectResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.exception != null && message.hasOwnProperty("exception")) {
                let error = $root.BasilType.BasilException.verify(message.exception);
                if (error)
                    return "exception." + error;
            }
            if (message.objectId != null && message.hasOwnProperty("objectId")) {
                let error = $root.BasilType.ObjectIdentifier.verify(message.objectId);
                if (error)
                    return "objectId." + error;
            }
            return null;
        };

        IdentifyDisplayableObjectResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.IdentifyDisplayableObjectResp)
                return object;
            let message = new $root.BasilServer.IdentifyDisplayableObjectResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilServer.IdentifyDisplayableObjectResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            if (object.objectId != null) {
                if (typeof object.objectId !== "object")
                    throw TypeError(".BasilServer.IdentifyDisplayableObjectResp.objectId: object expected");
                message.objectId = $root.BasilType.ObjectIdentifier.fromObject(object.objectId);
            }
            return message;
        };

        IdentifyDisplayableObjectResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.exception = null;
                object.objectId = null;
            }
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = $root.BasilType.BasilException.toObject(message.exception, options);
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                object.objectId = $root.BasilType.ObjectIdentifier.toObject(message.objectId, options);
            return object;
        };

        IdentifyDisplayableObjectResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return IdentifyDisplayableObjectResp;
    })();

    BasilServer.ForgetDisplayableObjectReq = (function() {

        function ForgetDisplayableObjectReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        ForgetDisplayableObjectReq.prototype.auth = null;
        ForgetDisplayableObjectReq.prototype.objectId = null;

        ForgetDisplayableObjectReq.create = function create(properties) {
            return new ForgetDisplayableObjectReq(properties);
        };

        ForgetDisplayableObjectReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                $root.BasilType.ObjectIdentifier.encode(message.objectId, writer.uint32(18).fork()).ldelim();
            return writer;
        };

        ForgetDisplayableObjectReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        ForgetDisplayableObjectReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.ForgetDisplayableObjectReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.objectId = $root.BasilType.ObjectIdentifier.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        ForgetDisplayableObjectReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        ForgetDisplayableObjectReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.objectId != null && message.hasOwnProperty("objectId")) {
                let error = $root.BasilType.ObjectIdentifier.verify(message.objectId);
                if (error)
                    return "objectId." + error;
            }
            return null;
        };

        ForgetDisplayableObjectReq.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.ForgetDisplayableObjectReq)
                return object;
            let message = new $root.BasilServer.ForgetDisplayableObjectReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilServer.ForgetDisplayableObjectReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.objectId != null) {
                if (typeof object.objectId !== "object")
                    throw TypeError(".BasilServer.ForgetDisplayableObjectReq.objectId: object expected");
                message.objectId = $root.BasilType.ObjectIdentifier.fromObject(object.objectId);
            }
            return message;
        };

        ForgetDisplayableObjectReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.objectId = null;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                object.objectId = $root.BasilType.ObjectIdentifier.toObject(message.objectId, options);
            return object;
        };

        ForgetDisplayableObjectReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ForgetDisplayableObjectReq;
    })();

    BasilServer.ForgetDisplayableObjectResp = (function() {

        function ForgetDisplayableObjectResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        ForgetDisplayableObjectResp.prototype.exception = null;

        ForgetDisplayableObjectResp.create = function create(properties) {
            return new ForgetDisplayableObjectResp(properties);
        };

        ForgetDisplayableObjectResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            return writer;
        };

        ForgetDisplayableObjectResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        ForgetDisplayableObjectResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.ForgetDisplayableObjectResp();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.exception = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        ForgetDisplayableObjectResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        ForgetDisplayableObjectResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.exception != null && message.hasOwnProperty("exception")) {
                let error = $root.BasilType.BasilException.verify(message.exception);
                if (error)
                    return "exception." + error;
            }
            return null;
        };

        ForgetDisplayableObjectResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.ForgetDisplayableObjectResp)
                return object;
            let message = new $root.BasilServer.ForgetDisplayableObjectResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilServer.ForgetDisplayableObjectResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            return message;
        };

        ForgetDisplayableObjectResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.exception = null;
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = $root.BasilType.BasilException.toObject(message.exception, options);
            return object;
        };

        ForgetDisplayableObjectResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ForgetDisplayableObjectResp;
    })();

    BasilServer.CreateObjectInstanceReq = (function() {

        function CreateObjectInstanceReq(properties) {
            this.propertiesToSet = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        CreateObjectInstanceReq.prototype.auth = null;
        CreateObjectInstanceReq.prototype.objectId = null;
        CreateObjectInstanceReq.prototype.instanceId = null;
        CreateObjectInstanceReq.prototype.pos = null;
        CreateObjectInstanceReq.prototype.propertiesToSet = $util.emptyObject;
        CreateObjectInstanceReq.prototype.InstanceCountHint = 0;

        CreateObjectInstanceReq.create = function create(properties) {
            return new CreateObjectInstanceReq(properties);
        };

        CreateObjectInstanceReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                $root.BasilType.ObjectIdentifier.encode(message.objectId, writer.uint32(18).fork()).ldelim();
            if (message.instanceId != null && Object.hasOwnProperty.call(message, "instanceId"))
                $root.BasilType.InstanceIdentifier.encode(message.instanceId, writer.uint32(26).fork()).ldelim();
            if (message.pos != null && Object.hasOwnProperty.call(message, "pos"))
                $root.BasilType.InstancePositionInfo.encode(message.pos, writer.uint32(34).fork()).ldelim();
            if (message.propertiesToSet != null && Object.hasOwnProperty.call(message, "propertiesToSet"))
                for (let keys = Object.keys(message.propertiesToSet), i = 0; i < keys.length; ++i)
                    writer.uint32(42).fork().uint32(10).string(keys[i]).uint32(18).string(message.propertiesToSet[keys[i]]).ldelim();
            if (message.InstanceCountHint != null && Object.hasOwnProperty.call(message, "InstanceCountHint"))
                writer.uint32(48).int32(message.InstanceCountHint);
            return writer;
        };

        CreateObjectInstanceReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CreateObjectInstanceReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.CreateObjectInstanceReq(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.objectId = $root.BasilType.ObjectIdentifier.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.instanceId = $root.BasilType.InstanceIdentifier.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.pos = $root.BasilType.InstancePositionInfo.decode(reader, reader.uint32());
                    break;
                case 5:
                    reader.skip().pos++;
                    if (message.propertiesToSet === $util.emptyObject)
                        message.propertiesToSet = {};
                    key = reader.string();
                    reader.pos++;
                    message.propertiesToSet[key] = reader.string();
                    break;
                case 6:
                    message.InstanceCountHint = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        CreateObjectInstanceReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        CreateObjectInstanceReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.objectId != null && message.hasOwnProperty("objectId")) {
                let error = $root.BasilType.ObjectIdentifier.verify(message.objectId);
                if (error)
                    return "objectId." + error;
            }
            if (message.instanceId != null && message.hasOwnProperty("instanceId")) {
                let error = $root.BasilType.InstanceIdentifier.verify(message.instanceId);
                if (error)
                    return "instanceId." + error;
            }
            if (message.pos != null && message.hasOwnProperty("pos")) {
                let error = $root.BasilType.InstancePositionInfo.verify(message.pos);
                if (error)
                    return "pos." + error;
            }
            if (message.propertiesToSet != null && message.hasOwnProperty("propertiesToSet")) {
                if (!$util.isObject(message.propertiesToSet))
                    return "propertiesToSet: object expected";
                let key = Object.keys(message.propertiesToSet);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.propertiesToSet[key[i]]))
                        return "propertiesToSet: string{k:string} expected";
            }
            if (message.InstanceCountHint != null && message.hasOwnProperty("InstanceCountHint"))
                if (!$util.isInteger(message.InstanceCountHint))
                    return "InstanceCountHint: integer expected";
            return null;
        };

        CreateObjectInstanceReq.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.CreateObjectInstanceReq)
                return object;
            let message = new $root.BasilServer.CreateObjectInstanceReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilServer.CreateObjectInstanceReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.objectId != null) {
                if (typeof object.objectId !== "object")
                    throw TypeError(".BasilServer.CreateObjectInstanceReq.objectId: object expected");
                message.objectId = $root.BasilType.ObjectIdentifier.fromObject(object.objectId);
            }
            if (object.instanceId != null) {
                if (typeof object.instanceId !== "object")
                    throw TypeError(".BasilServer.CreateObjectInstanceReq.instanceId: object expected");
                message.instanceId = $root.BasilType.InstanceIdentifier.fromObject(object.instanceId);
            }
            if (object.pos != null) {
                if (typeof object.pos !== "object")
                    throw TypeError(".BasilServer.CreateObjectInstanceReq.pos: object expected");
                message.pos = $root.BasilType.InstancePositionInfo.fromObject(object.pos);
            }
            if (object.propertiesToSet) {
                if (typeof object.propertiesToSet !== "object")
                    throw TypeError(".BasilServer.CreateObjectInstanceReq.propertiesToSet: object expected");
                message.propertiesToSet = {};
                for (let keys = Object.keys(object.propertiesToSet), i = 0; i < keys.length; ++i)
                    message.propertiesToSet[keys[i]] = String(object.propertiesToSet[keys[i]]);
            }
            if (object.InstanceCountHint != null)
                message.InstanceCountHint = object.InstanceCountHint | 0;
            return message;
        };

        CreateObjectInstanceReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.propertiesToSet = {};
            if (options.defaults) {
                object.auth = null;
                object.objectId = null;
                object.instanceId = null;
                object.pos = null;
                object.InstanceCountHint = 0;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                object.objectId = $root.BasilType.ObjectIdentifier.toObject(message.objectId, options);
            if (message.instanceId != null && message.hasOwnProperty("instanceId"))
                object.instanceId = $root.BasilType.InstanceIdentifier.toObject(message.instanceId, options);
            if (message.pos != null && message.hasOwnProperty("pos"))
                object.pos = $root.BasilType.InstancePositionInfo.toObject(message.pos, options);
            let keys2;
            if (message.propertiesToSet && (keys2 = Object.keys(message.propertiesToSet)).length) {
                object.propertiesToSet = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.propertiesToSet[keys2[j]] = message.propertiesToSet[keys2[j]];
            }
            if (message.InstanceCountHint != null && message.hasOwnProperty("InstanceCountHint"))
                object.InstanceCountHint = message.InstanceCountHint;
            return object;
        };

        CreateObjectInstanceReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CreateObjectInstanceReq;
    })();

    BasilServer.CreateObjectInstanceResp = (function() {

        function CreateObjectInstanceResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        CreateObjectInstanceResp.prototype.exception = null;
        CreateObjectInstanceResp.prototype.instanceId = null;

        CreateObjectInstanceResp.create = function create(properties) {
            return new CreateObjectInstanceResp(properties);
        };

        CreateObjectInstanceResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            if (message.instanceId != null && Object.hasOwnProperty.call(message, "instanceId"))
                $root.BasilType.InstanceIdentifier.encode(message.instanceId, writer.uint32(18).fork()).ldelim();
            return writer;
        };

        CreateObjectInstanceResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CreateObjectInstanceResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.CreateObjectInstanceResp();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.exception = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.instanceId = $root.BasilType.InstanceIdentifier.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        CreateObjectInstanceResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        CreateObjectInstanceResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.exception != null && message.hasOwnProperty("exception")) {
                let error = $root.BasilType.BasilException.verify(message.exception);
                if (error)
                    return "exception." + error;
            }
            if (message.instanceId != null && message.hasOwnProperty("instanceId")) {
                let error = $root.BasilType.InstanceIdentifier.verify(message.instanceId);
                if (error)
                    return "instanceId." + error;
            }
            return null;
        };

        CreateObjectInstanceResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.CreateObjectInstanceResp)
                return object;
            let message = new $root.BasilServer.CreateObjectInstanceResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilServer.CreateObjectInstanceResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            if (object.instanceId != null) {
                if (typeof object.instanceId !== "object")
                    throw TypeError(".BasilServer.CreateObjectInstanceResp.instanceId: object expected");
                message.instanceId = $root.BasilType.InstanceIdentifier.fromObject(object.instanceId);
            }
            return message;
        };

        CreateObjectInstanceResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.exception = null;
                object.instanceId = null;
            }
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = $root.BasilType.BasilException.toObject(message.exception, options);
            if (message.instanceId != null && message.hasOwnProperty("instanceId"))
                object.instanceId = $root.BasilType.InstanceIdentifier.toObject(message.instanceId, options);
            return object;
        };

        CreateObjectInstanceResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CreateObjectInstanceResp;
    })();

    BasilServer.DeleteObjectInstanceReq = (function() {

        function DeleteObjectInstanceReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        DeleteObjectInstanceReq.prototype.auth = null;
        DeleteObjectInstanceReq.prototype.instanceId = null;

        DeleteObjectInstanceReq.create = function create(properties) {
            return new DeleteObjectInstanceReq(properties);
        };

        DeleteObjectInstanceReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.instanceId != null && Object.hasOwnProperty.call(message, "instanceId"))
                $root.BasilType.InstanceIdentifier.encode(message.instanceId, writer.uint32(18).fork()).ldelim();
            return writer;
        };

        DeleteObjectInstanceReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        DeleteObjectInstanceReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.DeleteObjectInstanceReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.instanceId = $root.BasilType.InstanceIdentifier.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        DeleteObjectInstanceReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        DeleteObjectInstanceReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.instanceId != null && message.hasOwnProperty("instanceId")) {
                let error = $root.BasilType.InstanceIdentifier.verify(message.instanceId);
                if (error)
                    return "instanceId." + error;
            }
            return null;
        };

        DeleteObjectInstanceReq.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.DeleteObjectInstanceReq)
                return object;
            let message = new $root.BasilServer.DeleteObjectInstanceReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilServer.DeleteObjectInstanceReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.instanceId != null) {
                if (typeof object.instanceId !== "object")
                    throw TypeError(".BasilServer.DeleteObjectInstanceReq.instanceId: object expected");
                message.instanceId = $root.BasilType.InstanceIdentifier.fromObject(object.instanceId);
            }
            return message;
        };

        DeleteObjectInstanceReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.instanceId = null;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.instanceId != null && message.hasOwnProperty("instanceId"))
                object.instanceId = $root.BasilType.InstanceIdentifier.toObject(message.instanceId, options);
            return object;
        };

        DeleteObjectInstanceReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DeleteObjectInstanceReq;
    })();

    BasilServer.DeleteObjectInstanceResp = (function() {

        function DeleteObjectInstanceResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        DeleteObjectInstanceResp.prototype.exception = null;

        DeleteObjectInstanceResp.create = function create(properties) {
            return new DeleteObjectInstanceResp(properties);
        };

        DeleteObjectInstanceResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            return writer;
        };

        DeleteObjectInstanceResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        DeleteObjectInstanceResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.DeleteObjectInstanceResp();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.exception = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        DeleteObjectInstanceResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        DeleteObjectInstanceResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.exception != null && message.hasOwnProperty("exception")) {
                let error = $root.BasilType.BasilException.verify(message.exception);
                if (error)
                    return "exception." + error;
            }
            return null;
        };

        DeleteObjectInstanceResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.DeleteObjectInstanceResp)
                return object;
            let message = new $root.BasilServer.DeleteObjectInstanceResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilServer.DeleteObjectInstanceResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            return message;
        };

        DeleteObjectInstanceResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.exception = null;
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = $root.BasilType.BasilException.toObject(message.exception, options);
            return object;
        };

        DeleteObjectInstanceResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DeleteObjectInstanceResp;
    })();

    BasilServer.UpdateInstancePropertyReq = (function() {

        function UpdateInstancePropertyReq(properties) {
            this.props = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        UpdateInstancePropertyReq.prototype.auth = null;
        UpdateInstancePropertyReq.prototype.instanceId = null;
        UpdateInstancePropertyReq.prototype.props = $util.emptyObject;

        UpdateInstancePropertyReq.create = function create(properties) {
            return new UpdateInstancePropertyReq(properties);
        };

        UpdateInstancePropertyReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.instanceId != null && Object.hasOwnProperty.call(message, "instanceId"))
                $root.BasilType.InstanceIdentifier.encode(message.instanceId, writer.uint32(18).fork()).ldelim();
            if (message.props != null && Object.hasOwnProperty.call(message, "props"))
                for (let keys = Object.keys(message.props), i = 0; i < keys.length; ++i)
                    writer.uint32(26).fork().uint32(10).string(keys[i]).uint32(18).string(message.props[keys[i]]).ldelim();
            return writer;
        };

        UpdateInstancePropertyReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        UpdateInstancePropertyReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.UpdateInstancePropertyReq(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.instanceId = $root.BasilType.InstanceIdentifier.decode(reader, reader.uint32());
                    break;
                case 3:
                    reader.skip().pos++;
                    if (message.props === $util.emptyObject)
                        message.props = {};
                    key = reader.string();
                    reader.pos++;
                    message.props[key] = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        UpdateInstancePropertyReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        UpdateInstancePropertyReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.instanceId != null && message.hasOwnProperty("instanceId")) {
                let error = $root.BasilType.InstanceIdentifier.verify(message.instanceId);
                if (error)
                    return "instanceId." + error;
            }
            if (message.props != null && message.hasOwnProperty("props")) {
                if (!$util.isObject(message.props))
                    return "props: object expected";
                let key = Object.keys(message.props);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.props[key[i]]))
                        return "props: string{k:string} expected";
            }
            return null;
        };

        UpdateInstancePropertyReq.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.UpdateInstancePropertyReq)
                return object;
            let message = new $root.BasilServer.UpdateInstancePropertyReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilServer.UpdateInstancePropertyReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.instanceId != null) {
                if (typeof object.instanceId !== "object")
                    throw TypeError(".BasilServer.UpdateInstancePropertyReq.instanceId: object expected");
                message.instanceId = $root.BasilType.InstanceIdentifier.fromObject(object.instanceId);
            }
            if (object.props) {
                if (typeof object.props !== "object")
                    throw TypeError(".BasilServer.UpdateInstancePropertyReq.props: object expected");
                message.props = {};
                for (let keys = Object.keys(object.props), i = 0; i < keys.length; ++i)
                    message.props[keys[i]] = String(object.props[keys[i]]);
            }
            return message;
        };

        UpdateInstancePropertyReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.props = {};
            if (options.defaults) {
                object.auth = null;
                object.instanceId = null;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.instanceId != null && message.hasOwnProperty("instanceId"))
                object.instanceId = $root.BasilType.InstanceIdentifier.toObject(message.instanceId, options);
            let keys2;
            if (message.props && (keys2 = Object.keys(message.props)).length) {
                object.props = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.props[keys2[j]] = message.props[keys2[j]];
            }
            return object;
        };

        UpdateInstancePropertyReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateInstancePropertyReq;
    })();

    BasilServer.UpdateInstancePropertyResp = (function() {

        function UpdateInstancePropertyResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        UpdateInstancePropertyResp.prototype.exception = null;

        UpdateInstancePropertyResp.create = function create(properties) {
            return new UpdateInstancePropertyResp(properties);
        };

        UpdateInstancePropertyResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            return writer;
        };

        UpdateInstancePropertyResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        UpdateInstancePropertyResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.UpdateInstancePropertyResp();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.exception = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        UpdateInstancePropertyResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        UpdateInstancePropertyResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.exception != null && message.hasOwnProperty("exception")) {
                let error = $root.BasilType.BasilException.verify(message.exception);
                if (error)
                    return "exception." + error;
            }
            return null;
        };

        UpdateInstancePropertyResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.UpdateInstancePropertyResp)
                return object;
            let message = new $root.BasilServer.UpdateInstancePropertyResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilServer.UpdateInstancePropertyResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            return message;
        };

        UpdateInstancePropertyResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.exception = null;
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = $root.BasilType.BasilException.toObject(message.exception, options);
            return object;
        };

        UpdateInstancePropertyResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateInstancePropertyResp;
    })();

    BasilServer.RequestInstancePropertiesReq = (function() {

        function RequestInstancePropertiesReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        RequestInstancePropertiesReq.prototype.auth = null;
        RequestInstancePropertiesReq.prototype.instanceId = null;
        RequestInstancePropertiesReq.prototype.propertyMatch = "";

        RequestInstancePropertiesReq.create = function create(properties) {
            return new RequestInstancePropertiesReq(properties);
        };

        RequestInstancePropertiesReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.instanceId != null && Object.hasOwnProperty.call(message, "instanceId"))
                $root.BasilType.InstanceIdentifier.encode(message.instanceId, writer.uint32(18).fork()).ldelim();
            if (message.propertyMatch != null && Object.hasOwnProperty.call(message, "propertyMatch"))
                writer.uint32(26).string(message.propertyMatch);
            return writer;
        };

        RequestInstancePropertiesReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        RequestInstancePropertiesReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.RequestInstancePropertiesReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.instanceId = $root.BasilType.InstanceIdentifier.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.propertyMatch = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        RequestInstancePropertiesReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        RequestInstancePropertiesReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.instanceId != null && message.hasOwnProperty("instanceId")) {
                let error = $root.BasilType.InstanceIdentifier.verify(message.instanceId);
                if (error)
                    return "instanceId." + error;
            }
            if (message.propertyMatch != null && message.hasOwnProperty("propertyMatch"))
                if (!$util.isString(message.propertyMatch))
                    return "propertyMatch: string expected";
            return null;
        };

        RequestInstancePropertiesReq.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.RequestInstancePropertiesReq)
                return object;
            let message = new $root.BasilServer.RequestInstancePropertiesReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilServer.RequestInstancePropertiesReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.instanceId != null) {
                if (typeof object.instanceId !== "object")
                    throw TypeError(".BasilServer.RequestInstancePropertiesReq.instanceId: object expected");
                message.instanceId = $root.BasilType.InstanceIdentifier.fromObject(object.instanceId);
            }
            if (object.propertyMatch != null)
                message.propertyMatch = String(object.propertyMatch);
            return message;
        };

        RequestInstancePropertiesReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.instanceId = null;
                object.propertyMatch = "";
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.instanceId != null && message.hasOwnProperty("instanceId"))
                object.instanceId = $root.BasilType.InstanceIdentifier.toObject(message.instanceId, options);
            if (message.propertyMatch != null && message.hasOwnProperty("propertyMatch"))
                object.propertyMatch = message.propertyMatch;
            return object;
        };

        RequestInstancePropertiesReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RequestInstancePropertiesReq;
    })();

    BasilServer.RequestInstancePropertiesResp = (function() {

        function RequestInstancePropertiesResp(properties) {
            this.properties = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        RequestInstancePropertiesResp.prototype.exception = null;
        RequestInstancePropertiesResp.prototype.properties = $util.emptyObject;

        RequestInstancePropertiesResp.create = function create(properties) {
            return new RequestInstancePropertiesResp(properties);
        };

        RequestInstancePropertiesResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            if (message.properties != null && Object.hasOwnProperty.call(message, "properties"))
                for (let keys = Object.keys(message.properties), i = 0; i < keys.length; ++i)
                    writer.uint32(18).fork().uint32(10).string(keys[i]).uint32(18).string(message.properties[keys[i]]).ldelim();
            return writer;
        };

        RequestInstancePropertiesResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        RequestInstancePropertiesResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.RequestInstancePropertiesResp(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.exception = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                case 2:
                    reader.skip().pos++;
                    if (message.properties === $util.emptyObject)
                        message.properties = {};
                    key = reader.string();
                    reader.pos++;
                    message.properties[key] = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        RequestInstancePropertiesResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        RequestInstancePropertiesResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.exception != null && message.hasOwnProperty("exception")) {
                let error = $root.BasilType.BasilException.verify(message.exception);
                if (error)
                    return "exception." + error;
            }
            if (message.properties != null && message.hasOwnProperty("properties")) {
                if (!$util.isObject(message.properties))
                    return "properties: object expected";
                let key = Object.keys(message.properties);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.properties[key[i]]))
                        return "properties: string{k:string} expected";
            }
            return null;
        };

        RequestInstancePropertiesResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.RequestInstancePropertiesResp)
                return object;
            let message = new $root.BasilServer.RequestInstancePropertiesResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilServer.RequestInstancePropertiesResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            if (object.properties) {
                if (typeof object.properties !== "object")
                    throw TypeError(".BasilServer.RequestInstancePropertiesResp.properties: object expected");
                message.properties = {};
                for (let keys = Object.keys(object.properties), i = 0; i < keys.length; ++i)
                    message.properties[keys[i]] = String(object.properties[keys[i]]);
            }
            return message;
        };

        RequestInstancePropertiesResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.properties = {};
            if (options.defaults)
                object.exception = null;
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = $root.BasilType.BasilException.toObject(message.exception, options);
            let keys2;
            if (message.properties && (keys2 = Object.keys(message.properties)).length) {
                object.properties = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.properties[keys2[j]] = message.properties[keys2[j]];
            }
            return object;
        };

        RequestInstancePropertiesResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RequestInstancePropertiesResp;
    })();

    BasilServer.UpdateObjectPropertyReq = (function() {

        function UpdateObjectPropertyReq(properties) {
            this.props = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        UpdateObjectPropertyReq.prototype.auth = null;
        UpdateObjectPropertyReq.prototype.objectId = null;
        UpdateObjectPropertyReq.prototype.props = $util.emptyObject;

        UpdateObjectPropertyReq.create = function create(properties) {
            return new UpdateObjectPropertyReq(properties);
        };

        UpdateObjectPropertyReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                $root.BasilType.ObjectIdentifier.encode(message.objectId, writer.uint32(18).fork()).ldelim();
            if (message.props != null && Object.hasOwnProperty.call(message, "props"))
                for (let keys = Object.keys(message.props), i = 0; i < keys.length; ++i)
                    writer.uint32(26).fork().uint32(10).string(keys[i]).uint32(18).string(message.props[keys[i]]).ldelim();
            return writer;
        };

        UpdateObjectPropertyReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        UpdateObjectPropertyReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.UpdateObjectPropertyReq(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.objectId = $root.BasilType.ObjectIdentifier.decode(reader, reader.uint32());
                    break;
                case 3:
                    reader.skip().pos++;
                    if (message.props === $util.emptyObject)
                        message.props = {};
                    key = reader.string();
                    reader.pos++;
                    message.props[key] = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        UpdateObjectPropertyReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        UpdateObjectPropertyReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.objectId != null && message.hasOwnProperty("objectId")) {
                let error = $root.BasilType.ObjectIdentifier.verify(message.objectId);
                if (error)
                    return "objectId." + error;
            }
            if (message.props != null && message.hasOwnProperty("props")) {
                if (!$util.isObject(message.props))
                    return "props: object expected";
                let key = Object.keys(message.props);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.props[key[i]]))
                        return "props: string{k:string} expected";
            }
            return null;
        };

        UpdateObjectPropertyReq.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.UpdateObjectPropertyReq)
                return object;
            let message = new $root.BasilServer.UpdateObjectPropertyReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilServer.UpdateObjectPropertyReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.objectId != null) {
                if (typeof object.objectId !== "object")
                    throw TypeError(".BasilServer.UpdateObjectPropertyReq.objectId: object expected");
                message.objectId = $root.BasilType.ObjectIdentifier.fromObject(object.objectId);
            }
            if (object.props) {
                if (typeof object.props !== "object")
                    throw TypeError(".BasilServer.UpdateObjectPropertyReq.props: object expected");
                message.props = {};
                for (let keys = Object.keys(object.props), i = 0; i < keys.length; ++i)
                    message.props[keys[i]] = String(object.props[keys[i]]);
            }
            return message;
        };

        UpdateObjectPropertyReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.props = {};
            if (options.defaults) {
                object.auth = null;
                object.objectId = null;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                object.objectId = $root.BasilType.ObjectIdentifier.toObject(message.objectId, options);
            let keys2;
            if (message.props && (keys2 = Object.keys(message.props)).length) {
                object.props = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.props[keys2[j]] = message.props[keys2[j]];
            }
            return object;
        };

        UpdateObjectPropertyReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateObjectPropertyReq;
    })();

    BasilServer.UpdateObjectPropertyResp = (function() {

        function UpdateObjectPropertyResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        UpdateObjectPropertyResp.prototype.exception = null;

        UpdateObjectPropertyResp.create = function create(properties) {
            return new UpdateObjectPropertyResp(properties);
        };

        UpdateObjectPropertyResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            return writer;
        };

        UpdateObjectPropertyResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        UpdateObjectPropertyResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.UpdateObjectPropertyResp();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.exception = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        UpdateObjectPropertyResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        UpdateObjectPropertyResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.exception != null && message.hasOwnProperty("exception")) {
                let error = $root.BasilType.BasilException.verify(message.exception);
                if (error)
                    return "exception." + error;
            }
            return null;
        };

        UpdateObjectPropertyResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.UpdateObjectPropertyResp)
                return object;
            let message = new $root.BasilServer.UpdateObjectPropertyResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilServer.UpdateObjectPropertyResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            return message;
        };

        UpdateObjectPropertyResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.exception = null;
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = $root.BasilType.BasilException.toObject(message.exception, options);
            return object;
        };

        UpdateObjectPropertyResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateObjectPropertyResp;
    })();

    BasilServer.UpdateInstancePositionReq = (function() {

        function UpdateInstancePositionReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        UpdateInstancePositionReq.prototype.auth = null;
        UpdateInstancePositionReq.prototype.instanceId = null;
        UpdateInstancePositionReq.prototype.pos = null;

        UpdateInstancePositionReq.create = function create(properties) {
            return new UpdateInstancePositionReq(properties);
        };

        UpdateInstancePositionReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.instanceId != null && Object.hasOwnProperty.call(message, "instanceId"))
                $root.BasilType.InstanceIdentifier.encode(message.instanceId, writer.uint32(18).fork()).ldelim();
            if (message.pos != null && Object.hasOwnProperty.call(message, "pos"))
                $root.BasilType.InstancePositionInfo.encode(message.pos, writer.uint32(26).fork()).ldelim();
            return writer;
        };

        UpdateInstancePositionReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        UpdateInstancePositionReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.UpdateInstancePositionReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.instanceId = $root.BasilType.InstanceIdentifier.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.pos = $root.BasilType.InstancePositionInfo.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        UpdateInstancePositionReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        UpdateInstancePositionReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.instanceId != null && message.hasOwnProperty("instanceId")) {
                let error = $root.BasilType.InstanceIdentifier.verify(message.instanceId);
                if (error)
                    return "instanceId." + error;
            }
            if (message.pos != null && message.hasOwnProperty("pos")) {
                let error = $root.BasilType.InstancePositionInfo.verify(message.pos);
                if (error)
                    return "pos." + error;
            }
            return null;
        };

        UpdateInstancePositionReq.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.UpdateInstancePositionReq)
                return object;
            let message = new $root.BasilServer.UpdateInstancePositionReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilServer.UpdateInstancePositionReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.instanceId != null) {
                if (typeof object.instanceId !== "object")
                    throw TypeError(".BasilServer.UpdateInstancePositionReq.instanceId: object expected");
                message.instanceId = $root.BasilType.InstanceIdentifier.fromObject(object.instanceId);
            }
            if (object.pos != null) {
                if (typeof object.pos !== "object")
                    throw TypeError(".BasilServer.UpdateInstancePositionReq.pos: object expected");
                message.pos = $root.BasilType.InstancePositionInfo.fromObject(object.pos);
            }
            return message;
        };

        UpdateInstancePositionReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.instanceId = null;
                object.pos = null;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.instanceId != null && message.hasOwnProperty("instanceId"))
                object.instanceId = $root.BasilType.InstanceIdentifier.toObject(message.instanceId, options);
            if (message.pos != null && message.hasOwnProperty("pos"))
                object.pos = $root.BasilType.InstancePositionInfo.toObject(message.pos, options);
            return object;
        };

        UpdateInstancePositionReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateInstancePositionReq;
    })();

    BasilServer.UpdateInstancePositionResp = (function() {

        function UpdateInstancePositionResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        UpdateInstancePositionResp.prototype.exception = null;

        UpdateInstancePositionResp.create = function create(properties) {
            return new UpdateInstancePositionResp(properties);
        };

        UpdateInstancePositionResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            return writer;
        };

        UpdateInstancePositionResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        UpdateInstancePositionResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.UpdateInstancePositionResp();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.exception = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        UpdateInstancePositionResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        UpdateInstancePositionResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.exception != null && message.hasOwnProperty("exception")) {
                let error = $root.BasilType.BasilException.verify(message.exception);
                if (error)
                    return "exception." + error;
            }
            return null;
        };

        UpdateInstancePositionResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.UpdateInstancePositionResp)
                return object;
            let message = new $root.BasilServer.UpdateInstancePositionResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilServer.UpdateInstancePositionResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            return message;
        };

        UpdateInstancePositionResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.exception = null;
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = $root.BasilType.BasilException.toObject(message.exception, options);
            return object;
        };

        UpdateInstancePositionResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateInstancePositionResp;
    })();

    BasilServer.RequestObjectPropertiesReq = (function() {

        function RequestObjectPropertiesReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        RequestObjectPropertiesReq.prototype.auth = null;
        RequestObjectPropertiesReq.prototype.objectId = null;
        RequestObjectPropertiesReq.prototype.propertyMatch = "";

        RequestObjectPropertiesReq.create = function create(properties) {
            return new RequestObjectPropertiesReq(properties);
        };

        RequestObjectPropertiesReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                $root.BasilType.ObjectIdentifier.encode(message.objectId, writer.uint32(18).fork()).ldelim();
            if (message.propertyMatch != null && Object.hasOwnProperty.call(message, "propertyMatch"))
                writer.uint32(26).string(message.propertyMatch);
            return writer;
        };

        RequestObjectPropertiesReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        RequestObjectPropertiesReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.RequestObjectPropertiesReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.objectId = $root.BasilType.ObjectIdentifier.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.propertyMatch = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        RequestObjectPropertiesReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        RequestObjectPropertiesReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.objectId != null && message.hasOwnProperty("objectId")) {
                let error = $root.BasilType.ObjectIdentifier.verify(message.objectId);
                if (error)
                    return "objectId." + error;
            }
            if (message.propertyMatch != null && message.hasOwnProperty("propertyMatch"))
                if (!$util.isString(message.propertyMatch))
                    return "propertyMatch: string expected";
            return null;
        };

        RequestObjectPropertiesReq.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.RequestObjectPropertiesReq)
                return object;
            let message = new $root.BasilServer.RequestObjectPropertiesReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilServer.RequestObjectPropertiesReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.objectId != null) {
                if (typeof object.objectId !== "object")
                    throw TypeError(".BasilServer.RequestObjectPropertiesReq.objectId: object expected");
                message.objectId = $root.BasilType.ObjectIdentifier.fromObject(object.objectId);
            }
            if (object.propertyMatch != null)
                message.propertyMatch = String(object.propertyMatch);
            return message;
        };

        RequestObjectPropertiesReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.objectId = null;
                object.propertyMatch = "";
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                object.objectId = $root.BasilType.ObjectIdentifier.toObject(message.objectId, options);
            if (message.propertyMatch != null && message.hasOwnProperty("propertyMatch"))
                object.propertyMatch = message.propertyMatch;
            return object;
        };

        RequestObjectPropertiesReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RequestObjectPropertiesReq;
    })();

    BasilServer.RequestObjectPropertiesResp = (function() {

        function RequestObjectPropertiesResp(properties) {
            this.properties = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        RequestObjectPropertiesResp.prototype.exception = null;
        RequestObjectPropertiesResp.prototype.properties = $util.emptyObject;

        RequestObjectPropertiesResp.create = function create(properties) {
            return new RequestObjectPropertiesResp(properties);
        };

        RequestObjectPropertiesResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            if (message.properties != null && Object.hasOwnProperty.call(message, "properties"))
                for (let keys = Object.keys(message.properties), i = 0; i < keys.length; ++i)
                    writer.uint32(18).fork().uint32(10).string(keys[i]).uint32(18).string(message.properties[keys[i]]).ldelim();
            return writer;
        };

        RequestObjectPropertiesResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        RequestObjectPropertiesResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.RequestObjectPropertiesResp(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.exception = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                case 2:
                    reader.skip().pos++;
                    if (message.properties === $util.emptyObject)
                        message.properties = {};
                    key = reader.string();
                    reader.pos++;
                    message.properties[key] = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        RequestObjectPropertiesResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        RequestObjectPropertiesResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.exception != null && message.hasOwnProperty("exception")) {
                let error = $root.BasilType.BasilException.verify(message.exception);
                if (error)
                    return "exception." + error;
            }
            if (message.properties != null && message.hasOwnProperty("properties")) {
                if (!$util.isObject(message.properties))
                    return "properties: object expected";
                let key = Object.keys(message.properties);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.properties[key[i]]))
                        return "properties: string{k:string} expected";
            }
            return null;
        };

        RequestObjectPropertiesResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.RequestObjectPropertiesResp)
                return object;
            let message = new $root.BasilServer.RequestObjectPropertiesResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilServer.RequestObjectPropertiesResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            if (object.properties) {
                if (typeof object.properties !== "object")
                    throw TypeError(".BasilServer.RequestObjectPropertiesResp.properties: object expected");
                message.properties = {};
                for (let keys = Object.keys(object.properties), i = 0; i < keys.length; ++i)
                    message.properties[keys[i]] = String(object.properties[keys[i]]);
            }
            return message;
        };

        RequestObjectPropertiesResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.properties = {};
            if (options.defaults)
                object.exception = null;
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = $root.BasilType.BasilException.toObject(message.exception, options);
            let keys2;
            if (message.properties && (keys2 = Object.keys(message.properties)).length) {
                object.properties = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.properties[keys2[j]] = message.properties[keys2[j]];
            }
            return object;
        };

        RequestObjectPropertiesResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RequestObjectPropertiesResp;
    })();

    BasilServer.CloseSessionReq = (function() {

        function CloseSessionReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        CloseSessionReq.prototype.auth = null;
        CloseSessionReq.prototype.reason = "";

        CloseSessionReq.create = function create(properties) {
            return new CloseSessionReq(properties);
        };

        CloseSessionReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.reason != null && Object.hasOwnProperty.call(message, "reason"))
                writer.uint32(18).string(message.reason);
            return writer;
        };

        CloseSessionReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CloseSessionReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.CloseSessionReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.reason = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        CloseSessionReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        CloseSessionReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.reason != null && message.hasOwnProperty("reason"))
                if (!$util.isString(message.reason))
                    return "reason: string expected";
            return null;
        };

        CloseSessionReq.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.CloseSessionReq)
                return object;
            let message = new $root.BasilServer.CloseSessionReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilServer.CloseSessionReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.reason != null)
                message.reason = String(object.reason);
            return message;
        };

        CloseSessionReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.reason = "";
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.reason != null && message.hasOwnProperty("reason"))
                object.reason = message.reason;
            return object;
        };

        CloseSessionReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CloseSessionReq;
    })();

    BasilServer.CloseSessionResp = (function() {

        function CloseSessionResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        CloseSessionResp.prototype.exception = null;

        CloseSessionResp.create = function create(properties) {
            return new CloseSessionResp(properties);
        };

        CloseSessionResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            return writer;
        };

        CloseSessionResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CloseSessionResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.CloseSessionResp();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.exception = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        CloseSessionResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        CloseSessionResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.exception != null && message.hasOwnProperty("exception")) {
                let error = $root.BasilType.BasilException.verify(message.exception);
                if (error)
                    return "exception." + error;
            }
            return null;
        };

        CloseSessionResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.CloseSessionResp)
                return object;
            let message = new $root.BasilServer.CloseSessionResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilServer.CloseSessionResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            return message;
        };

        CloseSessionResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.exception = null;
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = $root.BasilType.BasilException.toObject(message.exception, options);
            return object;
        };

        CloseSessionResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CloseSessionResp;
    })();

    BasilServer.MakeConnectionReq = (function() {

        function MakeConnectionReq(properties) {
            this.connectionParams = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        MakeConnectionReq.prototype.auth = null;
        MakeConnectionReq.prototype.connectionParams = $util.emptyObject;

        MakeConnectionReq.create = function create(properties) {
            return new MakeConnectionReq(properties);
        };

        MakeConnectionReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.connectionParams != null && Object.hasOwnProperty.call(message, "connectionParams"))
                for (let keys = Object.keys(message.connectionParams), i = 0; i < keys.length; ++i)
                    writer.uint32(18).fork().uint32(10).string(keys[i]).uint32(18).string(message.connectionParams[keys[i]]).ldelim();
            return writer;
        };

        MakeConnectionReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        MakeConnectionReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.MakeConnectionReq(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    reader.skip().pos++;
                    if (message.connectionParams === $util.emptyObject)
                        message.connectionParams = {};
                    key = reader.string();
                    reader.pos++;
                    message.connectionParams[key] = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        MakeConnectionReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        MakeConnectionReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.connectionParams != null && message.hasOwnProperty("connectionParams")) {
                if (!$util.isObject(message.connectionParams))
                    return "connectionParams: object expected";
                let key = Object.keys(message.connectionParams);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.connectionParams[key[i]]))
                        return "connectionParams: string{k:string} expected";
            }
            return null;
        };

        MakeConnectionReq.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.MakeConnectionReq)
                return object;
            let message = new $root.BasilServer.MakeConnectionReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilServer.MakeConnectionReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.connectionParams) {
                if (typeof object.connectionParams !== "object")
                    throw TypeError(".BasilServer.MakeConnectionReq.connectionParams: object expected");
                message.connectionParams = {};
                for (let keys = Object.keys(object.connectionParams), i = 0; i < keys.length; ++i)
                    message.connectionParams[keys[i]] = String(object.connectionParams[keys[i]]);
            }
            return message;
        };

        MakeConnectionReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.connectionParams = {};
            if (options.defaults)
                object.auth = null;
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            let keys2;
            if (message.connectionParams && (keys2 = Object.keys(message.connectionParams)).length) {
                object.connectionParams = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.connectionParams[keys2[j]] = message.connectionParams[keys2[j]];
            }
            return object;
        };

        MakeConnectionReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return MakeConnectionReq;
    })();

    BasilServer.MakeConnectionResp = (function() {

        function MakeConnectionResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        MakeConnectionResp.prototype.exception = null;

        MakeConnectionResp.create = function create(properties) {
            return new MakeConnectionResp(properties);
        };

        MakeConnectionResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            return writer;
        };

        MakeConnectionResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        MakeConnectionResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.MakeConnectionResp();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.exception = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        MakeConnectionResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        MakeConnectionResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.exception != null && message.hasOwnProperty("exception")) {
                let error = $root.BasilType.BasilException.verify(message.exception);
                if (error)
                    return "exception." + error;
            }
            return null;
        };

        MakeConnectionResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.MakeConnectionResp)
                return object;
            let message = new $root.BasilServer.MakeConnectionResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilServer.MakeConnectionResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            return message;
        };

        MakeConnectionResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.exception = null;
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = $root.BasilType.BasilException.toObject(message.exception, options);
            return object;
        };

        MakeConnectionResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return MakeConnectionResp;
    })();

    BasilServer.AliveCheckReq = (function() {

        function AliveCheckReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        AliveCheckReq.prototype.auth = null;
        AliveCheckReq.prototype.time = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        AliveCheckReq.prototype.sequenceNum = 0;

        AliveCheckReq.create = function create(properties) {
            return new AliveCheckReq(properties);
        };

        AliveCheckReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                writer.uint32(16).uint64(message.time);
            if (message.sequenceNum != null && Object.hasOwnProperty.call(message, "sequenceNum"))
                writer.uint32(24).int32(message.sequenceNum);
            return writer;
        };

        AliveCheckReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        AliveCheckReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.AliveCheckReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.time = reader.uint64();
                    break;
                case 3:
                    message.sequenceNum = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        AliveCheckReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        AliveCheckReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.time != null && message.hasOwnProperty("time"))
                if (!$util.isInteger(message.time) && !(message.time && $util.isInteger(message.time.low) && $util.isInteger(message.time.high)))
                    return "time: integer|Long expected";
            if (message.sequenceNum != null && message.hasOwnProperty("sequenceNum"))
                if (!$util.isInteger(message.sequenceNum))
                    return "sequenceNum: integer expected";
            return null;
        };

        AliveCheckReq.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.AliveCheckReq)
                return object;
            let message = new $root.BasilServer.AliveCheckReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilServer.AliveCheckReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.time != null)
                if ($util.Long)
                    (message.time = $util.Long.fromValue(object.time)).unsigned = true;
                else if (typeof object.time === "string")
                    message.time = parseInt(object.time, 10);
                else if (typeof object.time === "number")
                    message.time = object.time;
                else if (typeof object.time === "object")
                    message.time = new $util.LongBits(object.time.low >>> 0, object.time.high >>> 0).toNumber(true);
            if (object.sequenceNum != null)
                message.sequenceNum = object.sequenceNum | 0;
            return message;
        };

        AliveCheckReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.time = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.time = options.longs === String ? "0" : 0;
                object.sequenceNum = 0;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.time != null && message.hasOwnProperty("time"))
                if (typeof message.time === "number")
                    object.time = options.longs === String ? String(message.time) : message.time;
                else
                    object.time = options.longs === String ? $util.Long.prototype.toString.call(message.time) : options.longs === Number ? new $util.LongBits(message.time.low >>> 0, message.time.high >>> 0).toNumber(true) : message.time;
            if (message.sequenceNum != null && message.hasOwnProperty("sequenceNum"))
                object.sequenceNum = message.sequenceNum;
            return object;
        };

        AliveCheckReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AliveCheckReq;
    })();

    BasilServer.AliveCheckResp = (function() {

        function AliveCheckResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        AliveCheckResp.prototype.time = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        AliveCheckResp.prototype.sequenceNum = 0;
        AliveCheckResp.prototype.timeReceived = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        AliveCheckResp.prototype.sequenceNumReceived = 0;

        AliveCheckResp.create = function create(properties) {
            return new AliveCheckResp(properties);
        };

        AliveCheckResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                writer.uint32(8).uint64(message.time);
            if (message.sequenceNum != null && Object.hasOwnProperty.call(message, "sequenceNum"))
                writer.uint32(16).int32(message.sequenceNum);
            if (message.timeReceived != null && Object.hasOwnProperty.call(message, "timeReceived"))
                writer.uint32(24).uint64(message.timeReceived);
            if (message.sequenceNumReceived != null && Object.hasOwnProperty.call(message, "sequenceNumReceived"))
                writer.uint32(32).int32(message.sequenceNumReceived);
            return writer;
        };

        AliveCheckResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        AliveCheckResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.AliveCheckResp();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.time = reader.uint64();
                    break;
                case 2:
                    message.sequenceNum = reader.int32();
                    break;
                case 3:
                    message.timeReceived = reader.uint64();
                    break;
                case 4:
                    message.sequenceNumReceived = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        AliveCheckResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        AliveCheckResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.time != null && message.hasOwnProperty("time"))
                if (!$util.isInteger(message.time) && !(message.time && $util.isInteger(message.time.low) && $util.isInteger(message.time.high)))
                    return "time: integer|Long expected";
            if (message.sequenceNum != null && message.hasOwnProperty("sequenceNum"))
                if (!$util.isInteger(message.sequenceNum))
                    return "sequenceNum: integer expected";
            if (message.timeReceived != null && message.hasOwnProperty("timeReceived"))
                if (!$util.isInteger(message.timeReceived) && !(message.timeReceived && $util.isInteger(message.timeReceived.low) && $util.isInteger(message.timeReceived.high)))
                    return "timeReceived: integer|Long expected";
            if (message.sequenceNumReceived != null && message.hasOwnProperty("sequenceNumReceived"))
                if (!$util.isInteger(message.sequenceNumReceived))
                    return "sequenceNumReceived: integer expected";
            return null;
        };

        AliveCheckResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.AliveCheckResp)
                return object;
            let message = new $root.BasilServer.AliveCheckResp();
            if (object.time != null)
                if ($util.Long)
                    (message.time = $util.Long.fromValue(object.time)).unsigned = true;
                else if (typeof object.time === "string")
                    message.time = parseInt(object.time, 10);
                else if (typeof object.time === "number")
                    message.time = object.time;
                else if (typeof object.time === "object")
                    message.time = new $util.LongBits(object.time.low >>> 0, object.time.high >>> 0).toNumber(true);
            if (object.sequenceNum != null)
                message.sequenceNum = object.sequenceNum | 0;
            if (object.timeReceived != null)
                if ($util.Long)
                    (message.timeReceived = $util.Long.fromValue(object.timeReceived)).unsigned = true;
                else if (typeof object.timeReceived === "string")
                    message.timeReceived = parseInt(object.timeReceived, 10);
                else if (typeof object.timeReceived === "number")
                    message.timeReceived = object.timeReceived;
                else if (typeof object.timeReceived === "object")
                    message.timeReceived = new $util.LongBits(object.timeReceived.low >>> 0, object.timeReceived.high >>> 0).toNumber(true);
            if (object.sequenceNumReceived != null)
                message.sequenceNumReceived = object.sequenceNumReceived | 0;
            return message;
        };

        AliveCheckResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.time = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.time = options.longs === String ? "0" : 0;
                object.sequenceNum = 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.timeReceived = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timeReceived = options.longs === String ? "0" : 0;
                object.sequenceNumReceived = 0;
            }
            if (message.time != null && message.hasOwnProperty("time"))
                if (typeof message.time === "number")
                    object.time = options.longs === String ? String(message.time) : message.time;
                else
                    object.time = options.longs === String ? $util.Long.prototype.toString.call(message.time) : options.longs === Number ? new $util.LongBits(message.time.low >>> 0, message.time.high >>> 0).toNumber(true) : message.time;
            if (message.sequenceNum != null && message.hasOwnProperty("sequenceNum"))
                object.sequenceNum = message.sequenceNum;
            if (message.timeReceived != null && message.hasOwnProperty("timeReceived"))
                if (typeof message.timeReceived === "number")
                    object.timeReceived = options.longs === String ? String(message.timeReceived) : message.timeReceived;
                else
                    object.timeReceived = options.longs === String ? $util.Long.prototype.toString.call(message.timeReceived) : options.longs === Number ? new $util.LongBits(message.timeReceived.low >>> 0, message.timeReceived.high >>> 0).toNumber(true) : message.timeReceived;
            if (message.sequenceNumReceived != null && message.hasOwnProperty("sequenceNumReceived"))
                object.sequenceNumReceived = message.sequenceNumReceived;
            return object;
        };

        AliveCheckResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AliveCheckResp;
    })();

    BasilServer.BasilServer = (function() {

        function BasilServer(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (BasilServer.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = BasilServer;

        BasilServer.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };


        Object.defineProperty(BasilServer.prototype.identifyDisplayableObject = function identifyDisplayableObject(request, callback) {
            return this.rpcCall(identifyDisplayableObject, $root.BasilServer.IdentifyDisplayableObjectReq, $root.BasilServer.IdentifyDisplayableObjectResp, request, callback);
        }, "name", { value: "IdentifyDisplayableObject" });


        Object.defineProperty(BasilServer.prototype.createObjectInstance = function createObjectInstance(request, callback) {
            return this.rpcCall(createObjectInstance, $root.BasilServer.CreateObjectInstanceReq, $root.BasilServer.CreateObjectInstanceResp, request, callback);
        }, "name", { value: "CreateObjectInstance" });


        Object.defineProperty(BasilServer.prototype.updateObjectProperty = function updateObjectProperty(request, callback) {
            return this.rpcCall(updateObjectProperty, $root.BasilServer.UpdateObjectPropertyReq, $root.BasilServer.UpdateObjectPropertyResp, request, callback);
        }, "name", { value: "UpdateObjectProperty" });


        Object.defineProperty(BasilServer.prototype.updateInstanceProperty = function updateInstanceProperty(request, callback) {
            return this.rpcCall(updateInstanceProperty, $root.BasilServer.UpdateInstancePropertyReq, $root.BasilServer.UpdateInstancePropertyResp, request, callback);
        }, "name", { value: "UpdateInstanceProperty" });


        Object.defineProperty(BasilServer.prototype.updateInstancePosition = function updateInstancePosition(request, callback) {
            return this.rpcCall(updateInstancePosition, $root.BasilServer.UpdateInstancePositionReq, $root.BasilServer.UpdateInstancePositionResp, request, callback);
        }, "name", { value: "UpdateInstancePosition" });


        Object.defineProperty(BasilServer.prototype.requestObjectProperties = function requestObjectProperties(request, callback) {
            return this.rpcCall(requestObjectProperties, $root.BasilServer.RequestObjectPropertiesReq, $root.BasilServer.RequestObjectPropertiesResp, request, callback);
        }, "name", { value: "RequestObjectProperties" });


        Object.defineProperty(BasilServer.prototype.requestInstanceProperties = function requestInstanceProperties(request, callback) {
            return this.rpcCall(requestInstanceProperties, $root.BasilServer.RequestInstancePropertiesReq, $root.BasilServer.RequestInstancePropertiesResp, request, callback);
        }, "name", { value: "RequestInstanceProperties" });


        Object.defineProperty(BasilServer.prototype.closeSession = function closeSession(request, callback) {
            return this.rpcCall(closeSession, $root.BasilServer.CloseSessionReq, $root.BasilServer.CloseSessionResp, request, callback);
        }, "name", { value: "CloseSession" });


        Object.defineProperty(BasilServer.prototype.makeConnection = function makeConnection(request, callback) {
            return this.rpcCall(makeConnection, $root.BasilServer.MakeConnectionReq, $root.BasilServer.MakeConnectionResp, request, callback);
        }, "name", { value: "MakeConnection" });


        Object.defineProperty(BasilServer.prototype.aliveCheck = function aliveCheck(request, callback) {
            return this.rpcCall(aliveCheck, $root.BasilServer.AliveCheckReq, $root.BasilServer.AliveCheckResp, request, callback);
        }, "name", { value: "AliveCheck" });

        return BasilServer;
    })();

    return BasilServer;
})();

export { $root as default };
