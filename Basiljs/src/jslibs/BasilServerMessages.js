/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const BasilMsgs = $root.BasilMsgs = (() => {

    const BasilMsgs = {};

    BasilMsgs.IdentifyDisplayableObjectReq = (function() {

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
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.assetInfo != null && message.hasOwnProperty("assetInfo"))
                $root.BasilType.AssetInformation.encode(message.assetInfo, writer.uint32(18).fork()).ldelim();
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                $root.BasilType.ObjectIdentifier.encode(message.objectId, writer.uint32(26).fork()).ldelim();
            if (message.aabb != null && message.hasOwnProperty("aabb"))
                $root.BasilType.AaBoundingBox.encode(message.aabb, writer.uint32(34).fork()).ldelim();
            return writer;
        };

        IdentifyDisplayableObjectReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        IdentifyDisplayableObjectReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.IdentifyDisplayableObjectReq();
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
            if (object instanceof $root.BasilMsgs.IdentifyDisplayableObjectReq)
                return object;
            let message = new $root.BasilMsgs.IdentifyDisplayableObjectReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilMsgs.IdentifyDisplayableObjectReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.assetInfo != null) {
                if (typeof object.assetInfo !== "object")
                    throw TypeError(".BasilMsgs.IdentifyDisplayableObjectReq.assetInfo: object expected");
                message.assetInfo = $root.BasilType.AssetInformation.fromObject(object.assetInfo);
            }
            if (object.objectId != null) {
                if (typeof object.objectId !== "object")
                    throw TypeError(".BasilMsgs.IdentifyDisplayableObjectReq.objectId: object expected");
                message.objectId = $root.BasilType.ObjectIdentifier.fromObject(object.objectId);
            }
            if (object.aabb != null) {
                if (typeof object.aabb !== "object")
                    throw TypeError(".BasilMsgs.IdentifyDisplayableObjectReq.aabb: object expected");
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

    BasilMsgs.IdentifyDisplayableObjectResp = (function() {

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
            if (message.exception != null && message.hasOwnProperty("exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                $root.BasilType.ObjectIdentifier.encode(message.objectId, writer.uint32(18).fork()).ldelim();
            return writer;
        };

        IdentifyDisplayableObjectResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        IdentifyDisplayableObjectResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.IdentifyDisplayableObjectResp();
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
            if (object instanceof $root.BasilMsgs.IdentifyDisplayableObjectResp)
                return object;
            let message = new $root.BasilMsgs.IdentifyDisplayableObjectResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilMsgs.IdentifyDisplayableObjectResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            if (object.objectId != null) {
                if (typeof object.objectId !== "object")
                    throw TypeError(".BasilMsgs.IdentifyDisplayableObjectResp.objectId: object expected");
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

    BasilMsgs.ForgetDisplayableObjectReq = (function() {

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
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                $root.BasilType.ObjectIdentifier.encode(message.objectId, writer.uint32(18).fork()).ldelim();
            return writer;
        };

        ForgetDisplayableObjectReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        ForgetDisplayableObjectReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.ForgetDisplayableObjectReq();
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
            if (object instanceof $root.BasilMsgs.ForgetDisplayableObjectReq)
                return object;
            let message = new $root.BasilMsgs.ForgetDisplayableObjectReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilMsgs.ForgetDisplayableObjectReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.objectId != null) {
                if (typeof object.objectId !== "object")
                    throw TypeError(".BasilMsgs.ForgetDisplayableObjectReq.objectId: object expected");
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

    BasilMsgs.ForgetDisplayableObjectResp = (function() {

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
            if (message.exception != null && message.hasOwnProperty("exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            return writer;
        };

        ForgetDisplayableObjectResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        ForgetDisplayableObjectResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.ForgetDisplayableObjectResp();
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
            if (object instanceof $root.BasilMsgs.ForgetDisplayableObjectResp)
                return object;
            let message = new $root.BasilMsgs.ForgetDisplayableObjectResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilMsgs.ForgetDisplayableObjectResp.exception: object expected");
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

    BasilMsgs.CreateObjectInstanceReq = (function() {

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
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                $root.BasilType.ObjectIdentifier.encode(message.objectId, writer.uint32(18).fork()).ldelim();
            if (message.instanceId != null && message.hasOwnProperty("instanceId"))
                $root.BasilType.InstanceIdentifier.encode(message.instanceId, writer.uint32(26).fork()).ldelim();
            if (message.pos != null && message.hasOwnProperty("pos"))
                $root.BasilType.InstancePositionInfo.encode(message.pos, writer.uint32(34).fork()).ldelim();
            if (message.propertiesToSet != null && message.hasOwnProperty("propertiesToSet"))
                for (let keys = Object.keys(message.propertiesToSet), i = 0; i < keys.length; ++i)
                    writer.uint32(42).fork().uint32(10).string(keys[i]).uint32(18).string(message.propertiesToSet[keys[i]]).ldelim();
            if (message.InstanceCountHint != null && message.hasOwnProperty("InstanceCountHint"))
                writer.uint32(48).int32(message.InstanceCountHint);
            return writer;
        };

        CreateObjectInstanceReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CreateObjectInstanceReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.CreateObjectInstanceReq(), key;
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
            if (object instanceof $root.BasilMsgs.CreateObjectInstanceReq)
                return object;
            let message = new $root.BasilMsgs.CreateObjectInstanceReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilMsgs.CreateObjectInstanceReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.objectId != null) {
                if (typeof object.objectId !== "object")
                    throw TypeError(".BasilMsgs.CreateObjectInstanceReq.objectId: object expected");
                message.objectId = $root.BasilType.ObjectIdentifier.fromObject(object.objectId);
            }
            if (object.instanceId != null) {
                if (typeof object.instanceId !== "object")
                    throw TypeError(".BasilMsgs.CreateObjectInstanceReq.instanceId: object expected");
                message.instanceId = $root.BasilType.InstanceIdentifier.fromObject(object.instanceId);
            }
            if (object.pos != null) {
                if (typeof object.pos !== "object")
                    throw TypeError(".BasilMsgs.CreateObjectInstanceReq.pos: object expected");
                message.pos = $root.BasilType.InstancePositionInfo.fromObject(object.pos);
            }
            if (object.propertiesToSet) {
                if (typeof object.propertiesToSet !== "object")
                    throw TypeError(".BasilMsgs.CreateObjectInstanceReq.propertiesToSet: object expected");
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

    BasilMsgs.CreateObjectInstanceResp = (function() {

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
            if (message.exception != null && message.hasOwnProperty("exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            if (message.instanceId != null && message.hasOwnProperty("instanceId"))
                $root.BasilType.InstanceIdentifier.encode(message.instanceId, writer.uint32(18).fork()).ldelim();
            return writer;
        };

        CreateObjectInstanceResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CreateObjectInstanceResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.CreateObjectInstanceResp();
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
            if (object instanceof $root.BasilMsgs.CreateObjectInstanceResp)
                return object;
            let message = new $root.BasilMsgs.CreateObjectInstanceResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilMsgs.CreateObjectInstanceResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            if (object.instanceId != null) {
                if (typeof object.instanceId !== "object")
                    throw TypeError(".BasilMsgs.CreateObjectInstanceResp.instanceId: object expected");
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

    BasilMsgs.DeleteObjectInstanceReq = (function() {

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
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.instanceId != null && message.hasOwnProperty("instanceId"))
                $root.BasilType.InstanceIdentifier.encode(message.instanceId, writer.uint32(18).fork()).ldelim();
            return writer;
        };

        DeleteObjectInstanceReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        DeleteObjectInstanceReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.DeleteObjectInstanceReq();
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
            if (object instanceof $root.BasilMsgs.DeleteObjectInstanceReq)
                return object;
            let message = new $root.BasilMsgs.DeleteObjectInstanceReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilMsgs.DeleteObjectInstanceReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.instanceId != null) {
                if (typeof object.instanceId !== "object")
                    throw TypeError(".BasilMsgs.DeleteObjectInstanceReq.instanceId: object expected");
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

    BasilMsgs.DeleteObjectInstanceResp = (function() {

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
            if (message.exception != null && message.hasOwnProperty("exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            return writer;
        };

        DeleteObjectInstanceResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        DeleteObjectInstanceResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.DeleteObjectInstanceResp();
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
            if (object instanceof $root.BasilMsgs.DeleteObjectInstanceResp)
                return object;
            let message = new $root.BasilMsgs.DeleteObjectInstanceResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilMsgs.DeleteObjectInstanceResp.exception: object expected");
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

    BasilMsgs.UpdateObjectPropertyReq = (function() {

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
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                $root.BasilType.ObjectIdentifier.encode(message.objectId, writer.uint32(18).fork()).ldelim();
            if (message.props != null && message.hasOwnProperty("props"))
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
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.UpdateObjectPropertyReq(), key;
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
            if (object instanceof $root.BasilMsgs.UpdateObjectPropertyReq)
                return object;
            let message = new $root.BasilMsgs.UpdateObjectPropertyReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilMsgs.UpdateObjectPropertyReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.objectId != null) {
                if (typeof object.objectId !== "object")
                    throw TypeError(".BasilMsgs.UpdateObjectPropertyReq.objectId: object expected");
                message.objectId = $root.BasilType.ObjectIdentifier.fromObject(object.objectId);
            }
            if (object.props) {
                if (typeof object.props !== "object")
                    throw TypeError(".BasilMsgs.UpdateObjectPropertyReq.props: object expected");
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

    BasilMsgs.UpdateObjectPropertyResp = (function() {

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
            if (message.exception != null && message.hasOwnProperty("exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            return writer;
        };

        UpdateObjectPropertyResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        UpdateObjectPropertyResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.UpdateObjectPropertyResp();
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
            if (object instanceof $root.BasilMsgs.UpdateObjectPropertyResp)
                return object;
            let message = new $root.BasilMsgs.UpdateObjectPropertyResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilMsgs.UpdateObjectPropertyResp.exception: object expected");
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

    BasilMsgs.UpdateInstancePropertyReq = (function() {

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
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.instanceId != null && message.hasOwnProperty("instanceId"))
                $root.BasilType.InstanceIdentifier.encode(message.instanceId, writer.uint32(18).fork()).ldelim();
            if (message.props != null && message.hasOwnProperty("props"))
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
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.UpdateInstancePropertyReq(), key;
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
            if (object instanceof $root.BasilMsgs.UpdateInstancePropertyReq)
                return object;
            let message = new $root.BasilMsgs.UpdateInstancePropertyReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilMsgs.UpdateInstancePropertyReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.instanceId != null) {
                if (typeof object.instanceId !== "object")
                    throw TypeError(".BasilMsgs.UpdateInstancePropertyReq.instanceId: object expected");
                message.instanceId = $root.BasilType.InstanceIdentifier.fromObject(object.instanceId);
            }
            if (object.props) {
                if (typeof object.props !== "object")
                    throw TypeError(".BasilMsgs.UpdateInstancePropertyReq.props: object expected");
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

    BasilMsgs.UpdateInstancePropertyResp = (function() {

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
            if (message.exception != null && message.hasOwnProperty("exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            return writer;
        };

        UpdateInstancePropertyResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        UpdateInstancePropertyResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.UpdateInstancePropertyResp();
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
            if (object instanceof $root.BasilMsgs.UpdateInstancePropertyResp)
                return object;
            let message = new $root.BasilMsgs.UpdateInstancePropertyResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilMsgs.UpdateInstancePropertyResp.exception: object expected");
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

    BasilMsgs.UpdateInstancePositionReq = (function() {

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
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.instanceId != null && message.hasOwnProperty("instanceId"))
                $root.BasilType.InstanceIdentifier.encode(message.instanceId, writer.uint32(18).fork()).ldelim();
            if (message.pos != null && message.hasOwnProperty("pos"))
                $root.BasilType.InstancePositionInfo.encode(message.pos, writer.uint32(26).fork()).ldelim();
            return writer;
        };

        UpdateInstancePositionReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        UpdateInstancePositionReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.UpdateInstancePositionReq();
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
            if (object instanceof $root.BasilMsgs.UpdateInstancePositionReq)
                return object;
            let message = new $root.BasilMsgs.UpdateInstancePositionReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilMsgs.UpdateInstancePositionReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.instanceId != null) {
                if (typeof object.instanceId !== "object")
                    throw TypeError(".BasilMsgs.UpdateInstancePositionReq.instanceId: object expected");
                message.instanceId = $root.BasilType.InstanceIdentifier.fromObject(object.instanceId);
            }
            if (object.pos != null) {
                if (typeof object.pos !== "object")
                    throw TypeError(".BasilMsgs.UpdateInstancePositionReq.pos: object expected");
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

    BasilMsgs.UpdateInstancePositionResp = (function() {

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
            if (message.exception != null && message.hasOwnProperty("exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            return writer;
        };

        UpdateInstancePositionResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        UpdateInstancePositionResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.UpdateInstancePositionResp();
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
            if (object instanceof $root.BasilMsgs.UpdateInstancePositionResp)
                return object;
            let message = new $root.BasilMsgs.UpdateInstancePositionResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilMsgs.UpdateInstancePositionResp.exception: object expected");
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

    BasilMsgs.RequestObjectPropertiesReq = (function() {

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
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                $root.BasilType.ObjectIdentifier.encode(message.objectId, writer.uint32(18).fork()).ldelim();
            if (message.propertyMatch != null && message.hasOwnProperty("propertyMatch"))
                writer.uint32(26).string(message.propertyMatch);
            return writer;
        };

        RequestObjectPropertiesReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        RequestObjectPropertiesReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.RequestObjectPropertiesReq();
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
            if (object instanceof $root.BasilMsgs.RequestObjectPropertiesReq)
                return object;
            let message = new $root.BasilMsgs.RequestObjectPropertiesReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilMsgs.RequestObjectPropertiesReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.objectId != null) {
                if (typeof object.objectId !== "object")
                    throw TypeError(".BasilMsgs.RequestObjectPropertiesReq.objectId: object expected");
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

    BasilMsgs.RequestObjectPropertiesResp = (function() {

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
            if (message.exception != null && message.hasOwnProperty("exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            if (message.properties != null && message.hasOwnProperty("properties"))
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
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.RequestObjectPropertiesResp(), key;
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
            if (object instanceof $root.BasilMsgs.RequestObjectPropertiesResp)
                return object;
            let message = new $root.BasilMsgs.RequestObjectPropertiesResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilMsgs.RequestObjectPropertiesResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            if (object.properties) {
                if (typeof object.properties !== "object")
                    throw TypeError(".BasilMsgs.RequestObjectPropertiesResp.properties: object expected");
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

    BasilMsgs.RequestInstancePropertiesReq = (function() {

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
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.instanceId != null && message.hasOwnProperty("instanceId"))
                $root.BasilType.InstanceIdentifier.encode(message.instanceId, writer.uint32(18).fork()).ldelim();
            if (message.propertyMatch != null && message.hasOwnProperty("propertyMatch"))
                writer.uint32(26).string(message.propertyMatch);
            return writer;
        };

        RequestInstancePropertiesReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        RequestInstancePropertiesReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.RequestInstancePropertiesReq();
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
            if (object instanceof $root.BasilMsgs.RequestInstancePropertiesReq)
                return object;
            let message = new $root.BasilMsgs.RequestInstancePropertiesReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilMsgs.RequestInstancePropertiesReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.instanceId != null) {
                if (typeof object.instanceId !== "object")
                    throw TypeError(".BasilMsgs.RequestInstancePropertiesReq.instanceId: object expected");
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

    BasilMsgs.RequestInstancePropertiesResp = (function() {

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
            if (message.exception != null && message.hasOwnProperty("exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            if (message.properties != null && message.hasOwnProperty("properties"))
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
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.RequestInstancePropertiesResp(), key;
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
            if (object instanceof $root.BasilMsgs.RequestInstancePropertiesResp)
                return object;
            let message = new $root.BasilMsgs.RequestInstancePropertiesResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilMsgs.RequestInstancePropertiesResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            if (object.properties) {
                if (typeof object.properties !== "object")
                    throw TypeError(".BasilMsgs.RequestInstancePropertiesResp.properties: object expected");
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

    BasilMsgs.OpenSessionReq = (function() {

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
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.features != null && message.hasOwnProperty("features"))
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
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.OpenSessionReq(), key;
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
            if (object instanceof $root.BasilMsgs.OpenSessionReq)
                return object;
            let message = new $root.BasilMsgs.OpenSessionReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilMsgs.OpenSessionReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.features) {
                if (typeof object.features !== "object")
                    throw TypeError(".BasilMsgs.OpenSessionReq.features: object expected");
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

    BasilMsgs.OpenSessionResp = (function() {

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
            if (message.exception != null && message.hasOwnProperty("exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            if (message.properties != null && message.hasOwnProperty("properties"))
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
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.OpenSessionResp(), key;
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
            if (object instanceof $root.BasilMsgs.OpenSessionResp)
                return object;
            let message = new $root.BasilMsgs.OpenSessionResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilMsgs.OpenSessionResp.exception: object expected");
                message.exception = $root.BasilType.BasilException.fromObject(object.exception);
            }
            if (object.properties) {
                if (typeof object.properties !== "object")
                    throw TypeError(".BasilMsgs.OpenSessionResp.properties: object expected");
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

    BasilMsgs.CloseSessionReq = (function() {

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
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.reason != null && message.hasOwnProperty("reason"))
                writer.uint32(18).string(message.reason);
            return writer;
        };

        CloseSessionReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CloseSessionReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.CloseSessionReq();
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
            if (object instanceof $root.BasilMsgs.CloseSessionReq)
                return object;
            let message = new $root.BasilMsgs.CloseSessionReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilMsgs.CloseSessionReq.auth: object expected");
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

    BasilMsgs.CloseSessionResp = (function() {

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
            if (message.exception != null && message.hasOwnProperty("exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            return writer;
        };

        CloseSessionResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CloseSessionResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.CloseSessionResp();
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
            if (object instanceof $root.BasilMsgs.CloseSessionResp)
                return object;
            let message = new $root.BasilMsgs.CloseSessionResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilMsgs.CloseSessionResp.exception: object expected");
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

    BasilMsgs.MakeConnectionReq = (function() {

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
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.connectionParams != null && message.hasOwnProperty("connectionParams"))
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
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.MakeConnectionReq(), key;
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
            if (object instanceof $root.BasilMsgs.MakeConnectionReq)
                return object;
            let message = new $root.BasilMsgs.MakeConnectionReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilMsgs.MakeConnectionReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.connectionParams) {
                if (typeof object.connectionParams !== "object")
                    throw TypeError(".BasilMsgs.MakeConnectionReq.connectionParams: object expected");
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

    BasilMsgs.MakeConnectionResp = (function() {

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
            if (message.exception != null && message.hasOwnProperty("exception"))
                $root.BasilType.BasilException.encode(message.exception, writer.uint32(10).fork()).ldelim();
            return writer;
        };

        MakeConnectionResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        MakeConnectionResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.MakeConnectionResp();
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
            if (object instanceof $root.BasilMsgs.MakeConnectionResp)
                return object;
            let message = new $root.BasilMsgs.MakeConnectionResp();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".BasilMsgs.MakeConnectionResp.exception: object expected");
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

    BasilMsgs.AliveCheckReq = (function() {

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
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.time != null && message.hasOwnProperty("time"))
                writer.uint32(16).uint64(message.time);
            if (message.sequenceNum != null && message.hasOwnProperty("sequenceNum"))
                writer.uint32(24).int32(message.sequenceNum);
            return writer;
        };

        AliveCheckReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        AliveCheckReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.AliveCheckReq();
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
            if (object instanceof $root.BasilMsgs.AliveCheckReq)
                return object;
            let message = new $root.BasilMsgs.AliveCheckReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilMsgs.AliveCheckReq.auth: object expected");
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

    BasilMsgs.AliveCheckResp = (function() {

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
            if (message.time != null && message.hasOwnProperty("time"))
                writer.uint32(8).uint64(message.time);
            if (message.sequenceNum != null && message.hasOwnProperty("sequenceNum"))
                writer.uint32(16).int32(message.sequenceNum);
            if (message.timeReceived != null && message.hasOwnProperty("timeReceived"))
                writer.uint32(24).uint64(message.timeReceived);
            if (message.sequenceNumReceived != null && message.hasOwnProperty("sequenceNumReceived"))
                writer.uint32(32).int32(message.sequenceNumReceived);
            return writer;
        };

        AliveCheckResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        AliveCheckResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.AliveCheckResp();
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
            if (object instanceof $root.BasilMsgs.AliveCheckResp)
                return object;
            let message = new $root.BasilMsgs.AliveCheckResp();
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

    BasilMsgs.ViewerStreamMessage = (function() {

        function ViewerStreamMessage(properties) {
            this.ViewerMessages = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        ViewerStreamMessage.prototype.ViewerMessages = $util.emptyArray;

        ViewerStreamMessage.create = function create(properties) {
            return new ViewerStreamMessage(properties);
        };

        ViewerStreamMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ViewerMessages != null && message.ViewerMessages.length)
                for (let i = 0; i < message.ViewerMessages.length; ++i)
                    $root.BasilMsgs.ViewerStreamMessage.ViewerMessage.encode(message.ViewerMessages[i], writer.uint32(10).fork()).ldelim();
            return writer;
        };

        ViewerStreamMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        ViewerStreamMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.ViewerStreamMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.ViewerMessages && message.ViewerMessages.length))
                        message.ViewerMessages = [];
                    message.ViewerMessages.push($root.BasilMsgs.ViewerStreamMessage.ViewerMessage.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        ViewerStreamMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        ViewerStreamMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ViewerMessages != null && message.hasOwnProperty("ViewerMessages")) {
                if (!Array.isArray(message.ViewerMessages))
                    return "ViewerMessages: array expected";
                for (let i = 0; i < message.ViewerMessages.length; ++i) {
                    let error = $root.BasilMsgs.ViewerStreamMessage.ViewerMessage.verify(message.ViewerMessages[i]);
                    if (error)
                        return "ViewerMessages." + error;
                }
            }
            return null;
        };

        ViewerStreamMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilMsgs.ViewerStreamMessage)
                return object;
            let message = new $root.BasilMsgs.ViewerStreamMessage();
            if (object.ViewerMessages) {
                if (!Array.isArray(object.ViewerMessages))
                    throw TypeError(".BasilMsgs.ViewerStreamMessage.ViewerMessages: array expected");
                message.ViewerMessages = [];
                for (let i = 0; i < object.ViewerMessages.length; ++i) {
                    if (typeof object.ViewerMessages[i] !== "object")
                        throw TypeError(".BasilMsgs.ViewerStreamMessage.ViewerMessages: object expected");
                    message.ViewerMessages[i] = $root.BasilMsgs.ViewerStreamMessage.ViewerMessage.fromObject(object.ViewerMessages[i]);
                }
            }
            return message;
        };

        ViewerStreamMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.ViewerMessages = [];
            if (message.ViewerMessages && message.ViewerMessages.length) {
                object.ViewerMessages = [];
                for (let j = 0; j < message.ViewerMessages.length; ++j)
                    object.ViewerMessages[j] = $root.BasilMsgs.ViewerStreamMessage.ViewerMessage.toObject(message.ViewerMessages[j], options);
            }
            return object;
        };

        ViewerStreamMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        ViewerStreamMessage.BResponseRequest = (function() {

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
                if (message.responseSession != null && message.hasOwnProperty("responseSession"))
                    writer.uint32(8).uint32(message.responseSession);
                if (message.responseSessionKey != null && message.hasOwnProperty("responseSessionKey"))
                    writer.uint32(18).string(message.responseSessionKey);
                return writer;
            };

            BResponseRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            BResponseRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.ViewerStreamMessage.BResponseRequest();
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
                if (object instanceof $root.BasilMsgs.ViewerStreamMessage.BResponseRequest)
                    return object;
                let message = new $root.BasilMsgs.ViewerStreamMessage.BResponseRequest();
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

        ViewerStreamMessage.ViewerMessage = (function() {

            function ViewerMessage(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            ViewerMessage.prototype.ResponseReq = null;
            ViewerMessage.prototype.IdentifyDisplayableObjectReqMsg = null;
            ViewerMessage.prototype.ForgetDisplayableObjectReqMsg = null;
            ViewerMessage.prototype.CreateObjectInstanceReqMsg = null;
            ViewerMessage.prototype.DeleteObjectInstanceReqMsg = null;
            ViewerMessage.prototype.UpdateObjectPropertyReqMsg = null;
            ViewerMessage.prototype.UpdateInstancePropertyReqMsg = null;
            ViewerMessage.prototype.UpdateInstancePositionReqMsg = null;
            ViewerMessage.prototype.RequestObjectPropertiesReqMsg = null;
            ViewerMessage.prototype.RequestInstancePropertiesReqMsg = null;
            ViewerMessage.prototype.OpenSessionReqMsg = null;
            ViewerMessage.prototype.CloseSessionReqMsg = null;
            ViewerMessage.prototype.AliveCheckReqMsg = null;
            ViewerMessage.prototype.MakeConnectionReqMsg = null;
            ViewerMessage.prototype.OpenSessionRespMsg = null;
            ViewerMessage.prototype.CloseSessionRespMsg = null;
            ViewerMessage.prototype.AliveCheckRespMsg = null;

            let $oneOfFields;

            Object.defineProperty(ViewerMessage.prototype, "ViewerMessage", {
                get: $util.oneOfGetter($oneOfFields = ["IdentifyDisplayableObjectReqMsg", "ForgetDisplayableObjectReqMsg", "CreateObjectInstanceReqMsg", "DeleteObjectInstanceReqMsg", "UpdateObjectPropertyReqMsg", "UpdateInstancePropertyReqMsg", "UpdateInstancePositionReqMsg", "RequestObjectPropertiesReqMsg", "RequestInstancePropertiesReqMsg", "OpenSessionReqMsg", "CloseSessionReqMsg", "AliveCheckReqMsg", "MakeConnectionReqMsg", "OpenSessionRespMsg", "CloseSessionRespMsg", "AliveCheckRespMsg"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            ViewerMessage.create = function create(properties) {
                return new ViewerMessage(properties);
            };

            ViewerMessage.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.ResponseReq != null && message.hasOwnProperty("ResponseReq"))
                    $root.BasilMsgs.ViewerStreamMessage.BResponseRequest.encode(message.ResponseReq, writer.uint32(10).fork()).ldelim();
                if (message.IdentifyDisplayableObjectReqMsg != null && message.hasOwnProperty("IdentifyDisplayableObjectReqMsg"))
                    $root.BasilMsgs.IdentifyDisplayableObjectReq.encode(message.IdentifyDisplayableObjectReqMsg, writer.uint32(18).fork()).ldelim();
                if (message.ForgetDisplayableObjectReqMsg != null && message.hasOwnProperty("ForgetDisplayableObjectReqMsg"))
                    $root.BasilMsgs.ForgetDisplayableObjectReq.encode(message.ForgetDisplayableObjectReqMsg, writer.uint32(26).fork()).ldelim();
                if (message.CreateObjectInstanceReqMsg != null && message.hasOwnProperty("CreateObjectInstanceReqMsg"))
                    $root.BasilMsgs.CreateObjectInstanceReq.encode(message.CreateObjectInstanceReqMsg, writer.uint32(34).fork()).ldelim();
                if (message.DeleteObjectInstanceReqMsg != null && message.hasOwnProperty("DeleteObjectInstanceReqMsg"))
                    $root.BasilMsgs.DeleteObjectInstanceReq.encode(message.DeleteObjectInstanceReqMsg, writer.uint32(42).fork()).ldelim();
                if (message.UpdateObjectPropertyReqMsg != null && message.hasOwnProperty("UpdateObjectPropertyReqMsg"))
                    $root.BasilMsgs.UpdateObjectPropertyReq.encode(message.UpdateObjectPropertyReqMsg, writer.uint32(50).fork()).ldelim();
                if (message.UpdateInstancePropertyReqMsg != null && message.hasOwnProperty("UpdateInstancePropertyReqMsg"))
                    $root.BasilMsgs.UpdateInstancePropertyReq.encode(message.UpdateInstancePropertyReqMsg, writer.uint32(58).fork()).ldelim();
                if (message.UpdateInstancePositionReqMsg != null && message.hasOwnProperty("UpdateInstancePositionReqMsg"))
                    $root.BasilMsgs.UpdateInstancePositionReq.encode(message.UpdateInstancePositionReqMsg, writer.uint32(66).fork()).ldelim();
                if (message.RequestObjectPropertiesReqMsg != null && message.hasOwnProperty("RequestObjectPropertiesReqMsg"))
                    $root.BasilMsgs.RequestObjectPropertiesReq.encode(message.RequestObjectPropertiesReqMsg, writer.uint32(74).fork()).ldelim();
                if (message.RequestInstancePropertiesReqMsg != null && message.hasOwnProperty("RequestInstancePropertiesReqMsg"))
                    $root.BasilMsgs.RequestInstancePropertiesReq.encode(message.RequestInstancePropertiesReqMsg, writer.uint32(82).fork()).ldelim();
                if (message.OpenSessionReqMsg != null && message.hasOwnProperty("OpenSessionReqMsg"))
                    $root.BasilMsgs.OpenSessionReq.encode(message.OpenSessionReqMsg, writer.uint32(90).fork()).ldelim();
                if (message.CloseSessionReqMsg != null && message.hasOwnProperty("CloseSessionReqMsg"))
                    $root.BasilMsgs.CloseSessionReq.encode(message.CloseSessionReqMsg, writer.uint32(98).fork()).ldelim();
                if (message.AliveCheckReqMsg != null && message.hasOwnProperty("AliveCheckReqMsg"))
                    $root.BasilMsgs.AliveCheckReq.encode(message.AliveCheckReqMsg, writer.uint32(106).fork()).ldelim();
                if (message.MakeConnectionReqMsg != null && message.hasOwnProperty("MakeConnectionReqMsg"))
                    $root.BasilMsgs.MakeConnectionReq.encode(message.MakeConnectionReqMsg, writer.uint32(114).fork()).ldelim();
                if (message.OpenSessionRespMsg != null && message.hasOwnProperty("OpenSessionRespMsg"))
                    $root.BasilMsgs.OpenSessionResp.encode(message.OpenSessionRespMsg, writer.uint32(122).fork()).ldelim();
                if (message.CloseSessionRespMsg != null && message.hasOwnProperty("CloseSessionRespMsg"))
                    $root.BasilMsgs.CloseSessionResp.encode(message.CloseSessionRespMsg, writer.uint32(130).fork()).ldelim();
                if (message.AliveCheckRespMsg != null && message.hasOwnProperty("AliveCheckRespMsg"))
                    $root.BasilMsgs.AliveCheckResp.encode(message.AliveCheckRespMsg, writer.uint32(138).fork()).ldelim();
                return writer;
            };

            ViewerMessage.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            ViewerMessage.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.ViewerStreamMessage.ViewerMessage();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.ResponseReq = $root.BasilMsgs.ViewerStreamMessage.BResponseRequest.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.IdentifyDisplayableObjectReqMsg = $root.BasilMsgs.IdentifyDisplayableObjectReq.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.ForgetDisplayableObjectReqMsg = $root.BasilMsgs.ForgetDisplayableObjectReq.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.CreateObjectInstanceReqMsg = $root.BasilMsgs.CreateObjectInstanceReq.decode(reader, reader.uint32());
                        break;
                    case 5:
                        message.DeleteObjectInstanceReqMsg = $root.BasilMsgs.DeleteObjectInstanceReq.decode(reader, reader.uint32());
                        break;
                    case 6:
                        message.UpdateObjectPropertyReqMsg = $root.BasilMsgs.UpdateObjectPropertyReq.decode(reader, reader.uint32());
                        break;
                    case 7:
                        message.UpdateInstancePropertyReqMsg = $root.BasilMsgs.UpdateInstancePropertyReq.decode(reader, reader.uint32());
                        break;
                    case 8:
                        message.UpdateInstancePositionReqMsg = $root.BasilMsgs.UpdateInstancePositionReq.decode(reader, reader.uint32());
                        break;
                    case 9:
                        message.RequestObjectPropertiesReqMsg = $root.BasilMsgs.RequestObjectPropertiesReq.decode(reader, reader.uint32());
                        break;
                    case 10:
                        message.RequestInstancePropertiesReqMsg = $root.BasilMsgs.RequestInstancePropertiesReq.decode(reader, reader.uint32());
                        break;
                    case 11:
                        message.OpenSessionReqMsg = $root.BasilMsgs.OpenSessionReq.decode(reader, reader.uint32());
                        break;
                    case 12:
                        message.CloseSessionReqMsg = $root.BasilMsgs.CloseSessionReq.decode(reader, reader.uint32());
                        break;
                    case 13:
                        message.AliveCheckReqMsg = $root.BasilMsgs.AliveCheckReq.decode(reader, reader.uint32());
                        break;
                    case 14:
                        message.MakeConnectionReqMsg = $root.BasilMsgs.MakeConnectionReq.decode(reader, reader.uint32());
                        break;
                    case 15:
                        message.OpenSessionRespMsg = $root.BasilMsgs.OpenSessionResp.decode(reader, reader.uint32());
                        break;
                    case 16:
                        message.CloseSessionRespMsg = $root.BasilMsgs.CloseSessionResp.decode(reader, reader.uint32());
                        break;
                    case 17:
                        message.AliveCheckRespMsg = $root.BasilMsgs.AliveCheckResp.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            ViewerMessage.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            ViewerMessage.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.ResponseReq != null && message.hasOwnProperty("ResponseReq")) {
                    let error = $root.BasilMsgs.ViewerStreamMessage.BResponseRequest.verify(message.ResponseReq);
                    if (error)
                        return "ResponseReq." + error;
                }
                if (message.IdentifyDisplayableObjectReqMsg != null && message.hasOwnProperty("IdentifyDisplayableObjectReqMsg")) {
                    properties.ViewerMessage = 1;
                    {
                        let error = $root.BasilMsgs.IdentifyDisplayableObjectReq.verify(message.IdentifyDisplayableObjectReqMsg);
                        if (error)
                            return "IdentifyDisplayableObjectReqMsg." + error;
                    }
                }
                if (message.ForgetDisplayableObjectReqMsg != null && message.hasOwnProperty("ForgetDisplayableObjectReqMsg")) {
                    if (properties.ViewerMessage === 1)
                        return "ViewerMessage: multiple values";
                    properties.ViewerMessage = 1;
                    {
                        let error = $root.BasilMsgs.ForgetDisplayableObjectReq.verify(message.ForgetDisplayableObjectReqMsg);
                        if (error)
                            return "ForgetDisplayableObjectReqMsg." + error;
                    }
                }
                if (message.CreateObjectInstanceReqMsg != null && message.hasOwnProperty("CreateObjectInstanceReqMsg")) {
                    if (properties.ViewerMessage === 1)
                        return "ViewerMessage: multiple values";
                    properties.ViewerMessage = 1;
                    {
                        let error = $root.BasilMsgs.CreateObjectInstanceReq.verify(message.CreateObjectInstanceReqMsg);
                        if (error)
                            return "CreateObjectInstanceReqMsg." + error;
                    }
                }
                if (message.DeleteObjectInstanceReqMsg != null && message.hasOwnProperty("DeleteObjectInstanceReqMsg")) {
                    if (properties.ViewerMessage === 1)
                        return "ViewerMessage: multiple values";
                    properties.ViewerMessage = 1;
                    {
                        let error = $root.BasilMsgs.DeleteObjectInstanceReq.verify(message.DeleteObjectInstanceReqMsg);
                        if (error)
                            return "DeleteObjectInstanceReqMsg." + error;
                    }
                }
                if (message.UpdateObjectPropertyReqMsg != null && message.hasOwnProperty("UpdateObjectPropertyReqMsg")) {
                    if (properties.ViewerMessage === 1)
                        return "ViewerMessage: multiple values";
                    properties.ViewerMessage = 1;
                    {
                        let error = $root.BasilMsgs.UpdateObjectPropertyReq.verify(message.UpdateObjectPropertyReqMsg);
                        if (error)
                            return "UpdateObjectPropertyReqMsg." + error;
                    }
                }
                if (message.UpdateInstancePropertyReqMsg != null && message.hasOwnProperty("UpdateInstancePropertyReqMsg")) {
                    if (properties.ViewerMessage === 1)
                        return "ViewerMessage: multiple values";
                    properties.ViewerMessage = 1;
                    {
                        let error = $root.BasilMsgs.UpdateInstancePropertyReq.verify(message.UpdateInstancePropertyReqMsg);
                        if (error)
                            return "UpdateInstancePropertyReqMsg." + error;
                    }
                }
                if (message.UpdateInstancePositionReqMsg != null && message.hasOwnProperty("UpdateInstancePositionReqMsg")) {
                    if (properties.ViewerMessage === 1)
                        return "ViewerMessage: multiple values";
                    properties.ViewerMessage = 1;
                    {
                        let error = $root.BasilMsgs.UpdateInstancePositionReq.verify(message.UpdateInstancePositionReqMsg);
                        if (error)
                            return "UpdateInstancePositionReqMsg." + error;
                    }
                }
                if (message.RequestObjectPropertiesReqMsg != null && message.hasOwnProperty("RequestObjectPropertiesReqMsg")) {
                    if (properties.ViewerMessage === 1)
                        return "ViewerMessage: multiple values";
                    properties.ViewerMessage = 1;
                    {
                        let error = $root.BasilMsgs.RequestObjectPropertiesReq.verify(message.RequestObjectPropertiesReqMsg);
                        if (error)
                            return "RequestObjectPropertiesReqMsg." + error;
                    }
                }
                if (message.RequestInstancePropertiesReqMsg != null && message.hasOwnProperty("RequestInstancePropertiesReqMsg")) {
                    if (properties.ViewerMessage === 1)
                        return "ViewerMessage: multiple values";
                    properties.ViewerMessage = 1;
                    {
                        let error = $root.BasilMsgs.RequestInstancePropertiesReq.verify(message.RequestInstancePropertiesReqMsg);
                        if (error)
                            return "RequestInstancePropertiesReqMsg." + error;
                    }
                }
                if (message.OpenSessionReqMsg != null && message.hasOwnProperty("OpenSessionReqMsg")) {
                    if (properties.ViewerMessage === 1)
                        return "ViewerMessage: multiple values";
                    properties.ViewerMessage = 1;
                    {
                        let error = $root.BasilMsgs.OpenSessionReq.verify(message.OpenSessionReqMsg);
                        if (error)
                            return "OpenSessionReqMsg." + error;
                    }
                }
                if (message.CloseSessionReqMsg != null && message.hasOwnProperty("CloseSessionReqMsg")) {
                    if (properties.ViewerMessage === 1)
                        return "ViewerMessage: multiple values";
                    properties.ViewerMessage = 1;
                    {
                        let error = $root.BasilMsgs.CloseSessionReq.verify(message.CloseSessionReqMsg);
                        if (error)
                            return "CloseSessionReqMsg." + error;
                    }
                }
                if (message.AliveCheckReqMsg != null && message.hasOwnProperty("AliveCheckReqMsg")) {
                    if (properties.ViewerMessage === 1)
                        return "ViewerMessage: multiple values";
                    properties.ViewerMessage = 1;
                    {
                        let error = $root.BasilMsgs.AliveCheckReq.verify(message.AliveCheckReqMsg);
                        if (error)
                            return "AliveCheckReqMsg." + error;
                    }
                }
                if (message.MakeConnectionReqMsg != null && message.hasOwnProperty("MakeConnectionReqMsg")) {
                    if (properties.ViewerMessage === 1)
                        return "ViewerMessage: multiple values";
                    properties.ViewerMessage = 1;
                    {
                        let error = $root.BasilMsgs.MakeConnectionReq.verify(message.MakeConnectionReqMsg);
                        if (error)
                            return "MakeConnectionReqMsg." + error;
                    }
                }
                if (message.OpenSessionRespMsg != null && message.hasOwnProperty("OpenSessionRespMsg")) {
                    if (properties.ViewerMessage === 1)
                        return "ViewerMessage: multiple values";
                    properties.ViewerMessage = 1;
                    {
                        let error = $root.BasilMsgs.OpenSessionResp.verify(message.OpenSessionRespMsg);
                        if (error)
                            return "OpenSessionRespMsg." + error;
                    }
                }
                if (message.CloseSessionRespMsg != null && message.hasOwnProperty("CloseSessionRespMsg")) {
                    if (properties.ViewerMessage === 1)
                        return "ViewerMessage: multiple values";
                    properties.ViewerMessage = 1;
                    {
                        let error = $root.BasilMsgs.CloseSessionResp.verify(message.CloseSessionRespMsg);
                        if (error)
                            return "CloseSessionRespMsg." + error;
                    }
                }
                if (message.AliveCheckRespMsg != null && message.hasOwnProperty("AliveCheckRespMsg")) {
                    if (properties.ViewerMessage === 1)
                        return "ViewerMessage: multiple values";
                    properties.ViewerMessage = 1;
                    {
                        let error = $root.BasilMsgs.AliveCheckResp.verify(message.AliveCheckRespMsg);
                        if (error)
                            return "AliveCheckRespMsg." + error;
                    }
                }
                return null;
            };

            ViewerMessage.fromObject = function fromObject(object) {
                if (object instanceof $root.BasilMsgs.ViewerStreamMessage.ViewerMessage)
                    return object;
                let message = new $root.BasilMsgs.ViewerStreamMessage.ViewerMessage();
                if (object.ResponseReq != null) {
                    if (typeof object.ResponseReq !== "object")
                        throw TypeError(".BasilMsgs.ViewerStreamMessage.ViewerMessage.ResponseReq: object expected");
                    message.ResponseReq = $root.BasilMsgs.ViewerStreamMessage.BResponseRequest.fromObject(object.ResponseReq);
                }
                if (object.IdentifyDisplayableObjectReqMsg != null) {
                    if (typeof object.IdentifyDisplayableObjectReqMsg !== "object")
                        throw TypeError(".BasilMsgs.ViewerStreamMessage.ViewerMessage.IdentifyDisplayableObjectReqMsg: object expected");
                    message.IdentifyDisplayableObjectReqMsg = $root.BasilMsgs.IdentifyDisplayableObjectReq.fromObject(object.IdentifyDisplayableObjectReqMsg);
                }
                if (object.ForgetDisplayableObjectReqMsg != null) {
                    if (typeof object.ForgetDisplayableObjectReqMsg !== "object")
                        throw TypeError(".BasilMsgs.ViewerStreamMessage.ViewerMessage.ForgetDisplayableObjectReqMsg: object expected");
                    message.ForgetDisplayableObjectReqMsg = $root.BasilMsgs.ForgetDisplayableObjectReq.fromObject(object.ForgetDisplayableObjectReqMsg);
                }
                if (object.CreateObjectInstanceReqMsg != null) {
                    if (typeof object.CreateObjectInstanceReqMsg !== "object")
                        throw TypeError(".BasilMsgs.ViewerStreamMessage.ViewerMessage.CreateObjectInstanceReqMsg: object expected");
                    message.CreateObjectInstanceReqMsg = $root.BasilMsgs.CreateObjectInstanceReq.fromObject(object.CreateObjectInstanceReqMsg);
                }
                if (object.DeleteObjectInstanceReqMsg != null) {
                    if (typeof object.DeleteObjectInstanceReqMsg !== "object")
                        throw TypeError(".BasilMsgs.ViewerStreamMessage.ViewerMessage.DeleteObjectInstanceReqMsg: object expected");
                    message.DeleteObjectInstanceReqMsg = $root.BasilMsgs.DeleteObjectInstanceReq.fromObject(object.DeleteObjectInstanceReqMsg);
                }
                if (object.UpdateObjectPropertyReqMsg != null) {
                    if (typeof object.UpdateObjectPropertyReqMsg !== "object")
                        throw TypeError(".BasilMsgs.ViewerStreamMessage.ViewerMessage.UpdateObjectPropertyReqMsg: object expected");
                    message.UpdateObjectPropertyReqMsg = $root.BasilMsgs.UpdateObjectPropertyReq.fromObject(object.UpdateObjectPropertyReqMsg);
                }
                if (object.UpdateInstancePropertyReqMsg != null) {
                    if (typeof object.UpdateInstancePropertyReqMsg !== "object")
                        throw TypeError(".BasilMsgs.ViewerStreamMessage.ViewerMessage.UpdateInstancePropertyReqMsg: object expected");
                    message.UpdateInstancePropertyReqMsg = $root.BasilMsgs.UpdateInstancePropertyReq.fromObject(object.UpdateInstancePropertyReqMsg);
                }
                if (object.UpdateInstancePositionReqMsg != null) {
                    if (typeof object.UpdateInstancePositionReqMsg !== "object")
                        throw TypeError(".BasilMsgs.ViewerStreamMessage.ViewerMessage.UpdateInstancePositionReqMsg: object expected");
                    message.UpdateInstancePositionReqMsg = $root.BasilMsgs.UpdateInstancePositionReq.fromObject(object.UpdateInstancePositionReqMsg);
                }
                if (object.RequestObjectPropertiesReqMsg != null) {
                    if (typeof object.RequestObjectPropertiesReqMsg !== "object")
                        throw TypeError(".BasilMsgs.ViewerStreamMessage.ViewerMessage.RequestObjectPropertiesReqMsg: object expected");
                    message.RequestObjectPropertiesReqMsg = $root.BasilMsgs.RequestObjectPropertiesReq.fromObject(object.RequestObjectPropertiesReqMsg);
                }
                if (object.RequestInstancePropertiesReqMsg != null) {
                    if (typeof object.RequestInstancePropertiesReqMsg !== "object")
                        throw TypeError(".BasilMsgs.ViewerStreamMessage.ViewerMessage.RequestInstancePropertiesReqMsg: object expected");
                    message.RequestInstancePropertiesReqMsg = $root.BasilMsgs.RequestInstancePropertiesReq.fromObject(object.RequestInstancePropertiesReqMsg);
                }
                if (object.OpenSessionReqMsg != null) {
                    if (typeof object.OpenSessionReqMsg !== "object")
                        throw TypeError(".BasilMsgs.ViewerStreamMessage.ViewerMessage.OpenSessionReqMsg: object expected");
                    message.OpenSessionReqMsg = $root.BasilMsgs.OpenSessionReq.fromObject(object.OpenSessionReqMsg);
                }
                if (object.CloseSessionReqMsg != null) {
                    if (typeof object.CloseSessionReqMsg !== "object")
                        throw TypeError(".BasilMsgs.ViewerStreamMessage.ViewerMessage.CloseSessionReqMsg: object expected");
                    message.CloseSessionReqMsg = $root.BasilMsgs.CloseSessionReq.fromObject(object.CloseSessionReqMsg);
                }
                if (object.AliveCheckReqMsg != null) {
                    if (typeof object.AliveCheckReqMsg !== "object")
                        throw TypeError(".BasilMsgs.ViewerStreamMessage.ViewerMessage.AliveCheckReqMsg: object expected");
                    message.AliveCheckReqMsg = $root.BasilMsgs.AliveCheckReq.fromObject(object.AliveCheckReqMsg);
                }
                if (object.MakeConnectionReqMsg != null) {
                    if (typeof object.MakeConnectionReqMsg !== "object")
                        throw TypeError(".BasilMsgs.ViewerStreamMessage.ViewerMessage.MakeConnectionReqMsg: object expected");
                    message.MakeConnectionReqMsg = $root.BasilMsgs.MakeConnectionReq.fromObject(object.MakeConnectionReqMsg);
                }
                if (object.OpenSessionRespMsg != null) {
                    if (typeof object.OpenSessionRespMsg !== "object")
                        throw TypeError(".BasilMsgs.ViewerStreamMessage.ViewerMessage.OpenSessionRespMsg: object expected");
                    message.OpenSessionRespMsg = $root.BasilMsgs.OpenSessionResp.fromObject(object.OpenSessionRespMsg);
                }
                if (object.CloseSessionRespMsg != null) {
                    if (typeof object.CloseSessionRespMsg !== "object")
                        throw TypeError(".BasilMsgs.ViewerStreamMessage.ViewerMessage.CloseSessionRespMsg: object expected");
                    message.CloseSessionRespMsg = $root.BasilMsgs.CloseSessionResp.fromObject(object.CloseSessionRespMsg);
                }
                if (object.AliveCheckRespMsg != null) {
                    if (typeof object.AliveCheckRespMsg !== "object")
                        throw TypeError(".BasilMsgs.ViewerStreamMessage.ViewerMessage.AliveCheckRespMsg: object expected");
                    message.AliveCheckRespMsg = $root.BasilMsgs.AliveCheckResp.fromObject(object.AliveCheckRespMsg);
                }
                return message;
            };

            ViewerMessage.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.ResponseReq = null;
                if (message.ResponseReq != null && message.hasOwnProperty("ResponseReq"))
                    object.ResponseReq = $root.BasilMsgs.ViewerStreamMessage.BResponseRequest.toObject(message.ResponseReq, options);
                if (message.IdentifyDisplayableObjectReqMsg != null && message.hasOwnProperty("IdentifyDisplayableObjectReqMsg")) {
                    object.IdentifyDisplayableObjectReqMsg = $root.BasilMsgs.IdentifyDisplayableObjectReq.toObject(message.IdentifyDisplayableObjectReqMsg, options);
                    if (options.oneofs)
                        object.ViewerMessage = "IdentifyDisplayableObjectReqMsg";
                }
                if (message.ForgetDisplayableObjectReqMsg != null && message.hasOwnProperty("ForgetDisplayableObjectReqMsg")) {
                    object.ForgetDisplayableObjectReqMsg = $root.BasilMsgs.ForgetDisplayableObjectReq.toObject(message.ForgetDisplayableObjectReqMsg, options);
                    if (options.oneofs)
                        object.ViewerMessage = "ForgetDisplayableObjectReqMsg";
                }
                if (message.CreateObjectInstanceReqMsg != null && message.hasOwnProperty("CreateObjectInstanceReqMsg")) {
                    object.CreateObjectInstanceReqMsg = $root.BasilMsgs.CreateObjectInstanceReq.toObject(message.CreateObjectInstanceReqMsg, options);
                    if (options.oneofs)
                        object.ViewerMessage = "CreateObjectInstanceReqMsg";
                }
                if (message.DeleteObjectInstanceReqMsg != null && message.hasOwnProperty("DeleteObjectInstanceReqMsg")) {
                    object.DeleteObjectInstanceReqMsg = $root.BasilMsgs.DeleteObjectInstanceReq.toObject(message.DeleteObjectInstanceReqMsg, options);
                    if (options.oneofs)
                        object.ViewerMessage = "DeleteObjectInstanceReqMsg";
                }
                if (message.UpdateObjectPropertyReqMsg != null && message.hasOwnProperty("UpdateObjectPropertyReqMsg")) {
                    object.UpdateObjectPropertyReqMsg = $root.BasilMsgs.UpdateObjectPropertyReq.toObject(message.UpdateObjectPropertyReqMsg, options);
                    if (options.oneofs)
                        object.ViewerMessage = "UpdateObjectPropertyReqMsg";
                }
                if (message.UpdateInstancePropertyReqMsg != null && message.hasOwnProperty("UpdateInstancePropertyReqMsg")) {
                    object.UpdateInstancePropertyReqMsg = $root.BasilMsgs.UpdateInstancePropertyReq.toObject(message.UpdateInstancePropertyReqMsg, options);
                    if (options.oneofs)
                        object.ViewerMessage = "UpdateInstancePropertyReqMsg";
                }
                if (message.UpdateInstancePositionReqMsg != null && message.hasOwnProperty("UpdateInstancePositionReqMsg")) {
                    object.UpdateInstancePositionReqMsg = $root.BasilMsgs.UpdateInstancePositionReq.toObject(message.UpdateInstancePositionReqMsg, options);
                    if (options.oneofs)
                        object.ViewerMessage = "UpdateInstancePositionReqMsg";
                }
                if (message.RequestObjectPropertiesReqMsg != null && message.hasOwnProperty("RequestObjectPropertiesReqMsg")) {
                    object.RequestObjectPropertiesReqMsg = $root.BasilMsgs.RequestObjectPropertiesReq.toObject(message.RequestObjectPropertiesReqMsg, options);
                    if (options.oneofs)
                        object.ViewerMessage = "RequestObjectPropertiesReqMsg";
                }
                if (message.RequestInstancePropertiesReqMsg != null && message.hasOwnProperty("RequestInstancePropertiesReqMsg")) {
                    object.RequestInstancePropertiesReqMsg = $root.BasilMsgs.RequestInstancePropertiesReq.toObject(message.RequestInstancePropertiesReqMsg, options);
                    if (options.oneofs)
                        object.ViewerMessage = "RequestInstancePropertiesReqMsg";
                }
                if (message.OpenSessionReqMsg != null && message.hasOwnProperty("OpenSessionReqMsg")) {
                    object.OpenSessionReqMsg = $root.BasilMsgs.OpenSessionReq.toObject(message.OpenSessionReqMsg, options);
                    if (options.oneofs)
                        object.ViewerMessage = "OpenSessionReqMsg";
                }
                if (message.CloseSessionReqMsg != null && message.hasOwnProperty("CloseSessionReqMsg")) {
                    object.CloseSessionReqMsg = $root.BasilMsgs.CloseSessionReq.toObject(message.CloseSessionReqMsg, options);
                    if (options.oneofs)
                        object.ViewerMessage = "CloseSessionReqMsg";
                }
                if (message.AliveCheckReqMsg != null && message.hasOwnProperty("AliveCheckReqMsg")) {
                    object.AliveCheckReqMsg = $root.BasilMsgs.AliveCheckReq.toObject(message.AliveCheckReqMsg, options);
                    if (options.oneofs)
                        object.ViewerMessage = "AliveCheckReqMsg";
                }
                if (message.MakeConnectionReqMsg != null && message.hasOwnProperty("MakeConnectionReqMsg")) {
                    object.MakeConnectionReqMsg = $root.BasilMsgs.MakeConnectionReq.toObject(message.MakeConnectionReqMsg, options);
                    if (options.oneofs)
                        object.ViewerMessage = "MakeConnectionReqMsg";
                }
                if (message.OpenSessionRespMsg != null && message.hasOwnProperty("OpenSessionRespMsg")) {
                    object.OpenSessionRespMsg = $root.BasilMsgs.OpenSessionResp.toObject(message.OpenSessionRespMsg, options);
                    if (options.oneofs)
                        object.ViewerMessage = "OpenSessionRespMsg";
                }
                if (message.CloseSessionRespMsg != null && message.hasOwnProperty("CloseSessionRespMsg")) {
                    object.CloseSessionRespMsg = $root.BasilMsgs.CloseSessionResp.toObject(message.CloseSessionRespMsg, options);
                    if (options.oneofs)
                        object.ViewerMessage = "CloseSessionRespMsg";
                }
                if (message.AliveCheckRespMsg != null && message.hasOwnProperty("AliveCheckRespMsg")) {
                    object.AliveCheckRespMsg = $root.BasilMsgs.AliveCheckResp.toObject(message.AliveCheckRespMsg, options);
                    if (options.oneofs)
                        object.ViewerMessage = "AliveCheckRespMsg";
                }
                return object;
            };

            ViewerMessage.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return ViewerMessage;
        })();

        return ViewerStreamMessage;
    })();

    BasilMsgs.SpaceStreamMessage = (function() {

        function SpaceStreamMessage(properties) {
            this.SpaceMessages = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        SpaceStreamMessage.prototype.SpaceMessages = $util.emptyArray;

        SpaceStreamMessage.create = function create(properties) {
            return new SpaceStreamMessage(properties);
        };

        SpaceStreamMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.SpaceMessages != null && message.SpaceMessages.length)
                for (let i = 0; i < message.SpaceMessages.length; ++i)
                    $root.BasilMsgs.SpaceStreamMessage.SpaceMessage.encode(message.SpaceMessages[i], writer.uint32(10).fork()).ldelim();
            return writer;
        };

        SpaceStreamMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        SpaceStreamMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.SpaceStreamMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.SpaceMessages && message.SpaceMessages.length))
                        message.SpaceMessages = [];
                    message.SpaceMessages.push($root.BasilMsgs.SpaceStreamMessage.SpaceMessage.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        SpaceStreamMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        SpaceStreamMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.SpaceMessages != null && message.hasOwnProperty("SpaceMessages")) {
                if (!Array.isArray(message.SpaceMessages))
                    return "SpaceMessages: array expected";
                for (let i = 0; i < message.SpaceMessages.length; ++i) {
                    let error = $root.BasilMsgs.SpaceStreamMessage.SpaceMessage.verify(message.SpaceMessages[i]);
                    if (error)
                        return "SpaceMessages." + error;
                }
            }
            return null;
        };

        SpaceStreamMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilMsgs.SpaceStreamMessage)
                return object;
            let message = new $root.BasilMsgs.SpaceStreamMessage();
            if (object.SpaceMessages) {
                if (!Array.isArray(object.SpaceMessages))
                    throw TypeError(".BasilMsgs.SpaceStreamMessage.SpaceMessages: array expected");
                message.SpaceMessages = [];
                for (let i = 0; i < object.SpaceMessages.length; ++i) {
                    if (typeof object.SpaceMessages[i] !== "object")
                        throw TypeError(".BasilMsgs.SpaceStreamMessage.SpaceMessages: object expected");
                    message.SpaceMessages[i] = $root.BasilMsgs.SpaceStreamMessage.SpaceMessage.fromObject(object.SpaceMessages[i]);
                }
            }
            return message;
        };

        SpaceStreamMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.SpaceMessages = [];
            if (message.SpaceMessages && message.SpaceMessages.length) {
                object.SpaceMessages = [];
                for (let j = 0; j < message.SpaceMessages.length; ++j)
                    object.SpaceMessages[j] = $root.BasilMsgs.SpaceStreamMessage.SpaceMessage.toObject(message.SpaceMessages[j], options);
            }
            return object;
        };

        SpaceStreamMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        SpaceStreamMessage.BResponseRequest = (function() {

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
                if (message.responseSession != null && message.hasOwnProperty("responseSession"))
                    writer.uint32(8).uint32(message.responseSession);
                if (message.responseSessionKey != null && message.hasOwnProperty("responseSessionKey"))
                    writer.uint32(18).string(message.responseSessionKey);
                return writer;
            };

            BResponseRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            BResponseRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.SpaceStreamMessage.BResponseRequest();
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
                if (object instanceof $root.BasilMsgs.SpaceStreamMessage.BResponseRequest)
                    return object;
                let message = new $root.BasilMsgs.SpaceStreamMessage.BResponseRequest();
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

        SpaceStreamMessage.SpaceMessage = (function() {

            function SpaceMessage(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            SpaceMessage.prototype.ResponseReq = null;
            SpaceMessage.prototype.IdentifyDisplayableObjectRespMsg = null;
            SpaceMessage.prototype.ForgetDisplayableObjectRespMsg = null;
            SpaceMessage.prototype.CreateObjectInstanceRespMsg = null;
            SpaceMessage.prototype.DeleteObjectInstanceRespMsg = null;
            SpaceMessage.prototype.UpdateObjectPropertyRespMsg = null;
            SpaceMessage.prototype.UpdateInstancePropertyRespMsg = null;
            SpaceMessage.prototype.UpdateInstancePositionRespMsg = null;
            SpaceMessage.prototype.RequestObjectPropertiesRespMsg = null;
            SpaceMessage.prototype.RequestInstancePropertiesRespMsg = null;
            SpaceMessage.prototype.OpenSessionRespMsg = null;
            SpaceMessage.prototype.CloseSessionRespMsg = null;
            SpaceMessage.prototype.AliveCheckRespMsg = null;
            SpaceMessage.prototype.MakeConnectionRespMsg = null;
            SpaceMessage.prototype.OpenSessionReqMsg = null;
            SpaceMessage.prototype.CloseSessionReqMsg = null;
            SpaceMessage.prototype.AliveCheckReqMsg = null;

            let $oneOfFields;

            Object.defineProperty(SpaceMessage.prototype, "SpaceMessage", {
                get: $util.oneOfGetter($oneOfFields = ["IdentifyDisplayableObjectRespMsg", "ForgetDisplayableObjectRespMsg", "CreateObjectInstanceRespMsg", "DeleteObjectInstanceRespMsg", "UpdateObjectPropertyRespMsg", "UpdateInstancePropertyRespMsg", "UpdateInstancePositionRespMsg", "RequestObjectPropertiesRespMsg", "RequestInstancePropertiesRespMsg", "OpenSessionRespMsg", "CloseSessionRespMsg", "AliveCheckRespMsg", "MakeConnectionRespMsg", "OpenSessionReqMsg", "CloseSessionReqMsg", "AliveCheckReqMsg"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            SpaceMessage.create = function create(properties) {
                return new SpaceMessage(properties);
            };

            SpaceMessage.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.ResponseReq != null && message.hasOwnProperty("ResponseReq"))
                    $root.BasilMsgs.SpaceStreamMessage.BResponseRequest.encode(message.ResponseReq, writer.uint32(10).fork()).ldelim();
                if (message.IdentifyDisplayableObjectRespMsg != null && message.hasOwnProperty("IdentifyDisplayableObjectRespMsg"))
                    $root.BasilMsgs.IdentifyDisplayableObjectResp.encode(message.IdentifyDisplayableObjectRespMsg, writer.uint32(18).fork()).ldelim();
                if (message.ForgetDisplayableObjectRespMsg != null && message.hasOwnProperty("ForgetDisplayableObjectRespMsg"))
                    $root.BasilMsgs.ForgetDisplayableObjectResp.encode(message.ForgetDisplayableObjectRespMsg, writer.uint32(26).fork()).ldelim();
                if (message.CreateObjectInstanceRespMsg != null && message.hasOwnProperty("CreateObjectInstanceRespMsg"))
                    $root.BasilMsgs.CreateObjectInstanceResp.encode(message.CreateObjectInstanceRespMsg, writer.uint32(34).fork()).ldelim();
                if (message.DeleteObjectInstanceRespMsg != null && message.hasOwnProperty("DeleteObjectInstanceRespMsg"))
                    $root.BasilMsgs.DeleteObjectInstanceResp.encode(message.DeleteObjectInstanceRespMsg, writer.uint32(42).fork()).ldelim();
                if (message.UpdateObjectPropertyRespMsg != null && message.hasOwnProperty("UpdateObjectPropertyRespMsg"))
                    $root.BasilMsgs.UpdateObjectPropertyResp.encode(message.UpdateObjectPropertyRespMsg, writer.uint32(50).fork()).ldelim();
                if (message.UpdateInstancePropertyRespMsg != null && message.hasOwnProperty("UpdateInstancePropertyRespMsg"))
                    $root.BasilMsgs.UpdateInstancePropertyResp.encode(message.UpdateInstancePropertyRespMsg, writer.uint32(58).fork()).ldelim();
                if (message.UpdateInstancePositionRespMsg != null && message.hasOwnProperty("UpdateInstancePositionRespMsg"))
                    $root.BasilMsgs.UpdateInstancePositionResp.encode(message.UpdateInstancePositionRespMsg, writer.uint32(66).fork()).ldelim();
                if (message.RequestObjectPropertiesRespMsg != null && message.hasOwnProperty("RequestObjectPropertiesRespMsg"))
                    $root.BasilMsgs.RequestObjectPropertiesResp.encode(message.RequestObjectPropertiesRespMsg, writer.uint32(74).fork()).ldelim();
                if (message.RequestInstancePropertiesRespMsg != null && message.hasOwnProperty("RequestInstancePropertiesRespMsg"))
                    $root.BasilMsgs.RequestInstancePropertiesResp.encode(message.RequestInstancePropertiesRespMsg, writer.uint32(82).fork()).ldelim();
                if (message.OpenSessionRespMsg != null && message.hasOwnProperty("OpenSessionRespMsg"))
                    $root.BasilMsgs.OpenSessionResp.encode(message.OpenSessionRespMsg, writer.uint32(90).fork()).ldelim();
                if (message.CloseSessionRespMsg != null && message.hasOwnProperty("CloseSessionRespMsg"))
                    $root.BasilMsgs.CloseSessionResp.encode(message.CloseSessionRespMsg, writer.uint32(98).fork()).ldelim();
                if (message.AliveCheckRespMsg != null && message.hasOwnProperty("AliveCheckRespMsg"))
                    $root.BasilMsgs.AliveCheckResp.encode(message.AliveCheckRespMsg, writer.uint32(106).fork()).ldelim();
                if (message.MakeConnectionRespMsg != null && message.hasOwnProperty("MakeConnectionRespMsg"))
                    $root.BasilMsgs.MakeConnectionResp.encode(message.MakeConnectionRespMsg, writer.uint32(114).fork()).ldelim();
                if (message.OpenSessionReqMsg != null && message.hasOwnProperty("OpenSessionReqMsg"))
                    $root.BasilMsgs.OpenSessionReq.encode(message.OpenSessionReqMsg, writer.uint32(122).fork()).ldelim();
                if (message.CloseSessionReqMsg != null && message.hasOwnProperty("CloseSessionReqMsg"))
                    $root.BasilMsgs.CloseSessionReq.encode(message.CloseSessionReqMsg, writer.uint32(130).fork()).ldelim();
                if (message.AliveCheckReqMsg != null && message.hasOwnProperty("AliveCheckReqMsg"))
                    $root.BasilMsgs.AliveCheckReq.encode(message.AliveCheckReqMsg, writer.uint32(138).fork()).ldelim();
                return writer;
            };

            SpaceMessage.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            SpaceMessage.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilMsgs.SpaceStreamMessage.SpaceMessage();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.ResponseReq = $root.BasilMsgs.SpaceStreamMessage.BResponseRequest.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.IdentifyDisplayableObjectRespMsg = $root.BasilMsgs.IdentifyDisplayableObjectResp.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.ForgetDisplayableObjectRespMsg = $root.BasilMsgs.ForgetDisplayableObjectResp.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.CreateObjectInstanceRespMsg = $root.BasilMsgs.CreateObjectInstanceResp.decode(reader, reader.uint32());
                        break;
                    case 5:
                        message.DeleteObjectInstanceRespMsg = $root.BasilMsgs.DeleteObjectInstanceResp.decode(reader, reader.uint32());
                        break;
                    case 6:
                        message.UpdateObjectPropertyRespMsg = $root.BasilMsgs.UpdateObjectPropertyResp.decode(reader, reader.uint32());
                        break;
                    case 7:
                        message.UpdateInstancePropertyRespMsg = $root.BasilMsgs.UpdateInstancePropertyResp.decode(reader, reader.uint32());
                        break;
                    case 8:
                        message.UpdateInstancePositionRespMsg = $root.BasilMsgs.UpdateInstancePositionResp.decode(reader, reader.uint32());
                        break;
                    case 9:
                        message.RequestObjectPropertiesRespMsg = $root.BasilMsgs.RequestObjectPropertiesResp.decode(reader, reader.uint32());
                        break;
                    case 10:
                        message.RequestInstancePropertiesRespMsg = $root.BasilMsgs.RequestInstancePropertiesResp.decode(reader, reader.uint32());
                        break;
                    case 11:
                        message.OpenSessionRespMsg = $root.BasilMsgs.OpenSessionResp.decode(reader, reader.uint32());
                        break;
                    case 12:
                        message.CloseSessionRespMsg = $root.BasilMsgs.CloseSessionResp.decode(reader, reader.uint32());
                        break;
                    case 13:
                        message.AliveCheckRespMsg = $root.BasilMsgs.AliveCheckResp.decode(reader, reader.uint32());
                        break;
                    case 14:
                        message.MakeConnectionRespMsg = $root.BasilMsgs.MakeConnectionResp.decode(reader, reader.uint32());
                        break;
                    case 15:
                        message.OpenSessionReqMsg = $root.BasilMsgs.OpenSessionReq.decode(reader, reader.uint32());
                        break;
                    case 16:
                        message.CloseSessionReqMsg = $root.BasilMsgs.CloseSessionReq.decode(reader, reader.uint32());
                        break;
                    case 17:
                        message.AliveCheckReqMsg = $root.BasilMsgs.AliveCheckReq.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            SpaceMessage.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            SpaceMessage.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.ResponseReq != null && message.hasOwnProperty("ResponseReq")) {
                    let error = $root.BasilMsgs.SpaceStreamMessage.BResponseRequest.verify(message.ResponseReq);
                    if (error)
                        return "ResponseReq." + error;
                }
                if (message.IdentifyDisplayableObjectRespMsg != null && message.hasOwnProperty("IdentifyDisplayableObjectRespMsg")) {
                    properties.SpaceMessage = 1;
                    {
                        let error = $root.BasilMsgs.IdentifyDisplayableObjectResp.verify(message.IdentifyDisplayableObjectRespMsg);
                        if (error)
                            return "IdentifyDisplayableObjectRespMsg." + error;
                    }
                }
                if (message.ForgetDisplayableObjectRespMsg != null && message.hasOwnProperty("ForgetDisplayableObjectRespMsg")) {
                    if (properties.SpaceMessage === 1)
                        return "SpaceMessage: multiple values";
                    properties.SpaceMessage = 1;
                    {
                        let error = $root.BasilMsgs.ForgetDisplayableObjectResp.verify(message.ForgetDisplayableObjectRespMsg);
                        if (error)
                            return "ForgetDisplayableObjectRespMsg." + error;
                    }
                }
                if (message.CreateObjectInstanceRespMsg != null && message.hasOwnProperty("CreateObjectInstanceRespMsg")) {
                    if (properties.SpaceMessage === 1)
                        return "SpaceMessage: multiple values";
                    properties.SpaceMessage = 1;
                    {
                        let error = $root.BasilMsgs.CreateObjectInstanceResp.verify(message.CreateObjectInstanceRespMsg);
                        if (error)
                            return "CreateObjectInstanceRespMsg." + error;
                    }
                }
                if (message.DeleteObjectInstanceRespMsg != null && message.hasOwnProperty("DeleteObjectInstanceRespMsg")) {
                    if (properties.SpaceMessage === 1)
                        return "SpaceMessage: multiple values";
                    properties.SpaceMessage = 1;
                    {
                        let error = $root.BasilMsgs.DeleteObjectInstanceResp.verify(message.DeleteObjectInstanceRespMsg);
                        if (error)
                            return "DeleteObjectInstanceRespMsg." + error;
                    }
                }
                if (message.UpdateObjectPropertyRespMsg != null && message.hasOwnProperty("UpdateObjectPropertyRespMsg")) {
                    if (properties.SpaceMessage === 1)
                        return "SpaceMessage: multiple values";
                    properties.SpaceMessage = 1;
                    {
                        let error = $root.BasilMsgs.UpdateObjectPropertyResp.verify(message.UpdateObjectPropertyRespMsg);
                        if (error)
                            return "UpdateObjectPropertyRespMsg." + error;
                    }
                }
                if (message.UpdateInstancePropertyRespMsg != null && message.hasOwnProperty("UpdateInstancePropertyRespMsg")) {
                    if (properties.SpaceMessage === 1)
                        return "SpaceMessage: multiple values";
                    properties.SpaceMessage = 1;
                    {
                        let error = $root.BasilMsgs.UpdateInstancePropertyResp.verify(message.UpdateInstancePropertyRespMsg);
                        if (error)
                            return "UpdateInstancePropertyRespMsg." + error;
                    }
                }
                if (message.UpdateInstancePositionRespMsg != null && message.hasOwnProperty("UpdateInstancePositionRespMsg")) {
                    if (properties.SpaceMessage === 1)
                        return "SpaceMessage: multiple values";
                    properties.SpaceMessage = 1;
                    {
                        let error = $root.BasilMsgs.UpdateInstancePositionResp.verify(message.UpdateInstancePositionRespMsg);
                        if (error)
                            return "UpdateInstancePositionRespMsg." + error;
                    }
                }
                if (message.RequestObjectPropertiesRespMsg != null && message.hasOwnProperty("RequestObjectPropertiesRespMsg")) {
                    if (properties.SpaceMessage === 1)
                        return "SpaceMessage: multiple values";
                    properties.SpaceMessage = 1;
                    {
                        let error = $root.BasilMsgs.RequestObjectPropertiesResp.verify(message.RequestObjectPropertiesRespMsg);
                        if (error)
                            return "RequestObjectPropertiesRespMsg." + error;
                    }
                }
                if (message.RequestInstancePropertiesRespMsg != null && message.hasOwnProperty("RequestInstancePropertiesRespMsg")) {
                    if (properties.SpaceMessage === 1)
                        return "SpaceMessage: multiple values";
                    properties.SpaceMessage = 1;
                    {
                        let error = $root.BasilMsgs.RequestInstancePropertiesResp.verify(message.RequestInstancePropertiesRespMsg);
                        if (error)
                            return "RequestInstancePropertiesRespMsg." + error;
                    }
                }
                if (message.OpenSessionRespMsg != null && message.hasOwnProperty("OpenSessionRespMsg")) {
                    if (properties.SpaceMessage === 1)
                        return "SpaceMessage: multiple values";
                    properties.SpaceMessage = 1;
                    {
                        let error = $root.BasilMsgs.OpenSessionResp.verify(message.OpenSessionRespMsg);
                        if (error)
                            return "OpenSessionRespMsg." + error;
                    }
                }
                if (message.CloseSessionRespMsg != null && message.hasOwnProperty("CloseSessionRespMsg")) {
                    if (properties.SpaceMessage === 1)
                        return "SpaceMessage: multiple values";
                    properties.SpaceMessage = 1;
                    {
                        let error = $root.BasilMsgs.CloseSessionResp.verify(message.CloseSessionRespMsg);
                        if (error)
                            return "CloseSessionRespMsg." + error;
                    }
                }
                if (message.AliveCheckRespMsg != null && message.hasOwnProperty("AliveCheckRespMsg")) {
                    if (properties.SpaceMessage === 1)
                        return "SpaceMessage: multiple values";
                    properties.SpaceMessage = 1;
                    {
                        let error = $root.BasilMsgs.AliveCheckResp.verify(message.AliveCheckRespMsg);
                        if (error)
                            return "AliveCheckRespMsg." + error;
                    }
                }
                if (message.MakeConnectionRespMsg != null && message.hasOwnProperty("MakeConnectionRespMsg")) {
                    if (properties.SpaceMessage === 1)
                        return "SpaceMessage: multiple values";
                    properties.SpaceMessage = 1;
                    {
                        let error = $root.BasilMsgs.MakeConnectionResp.verify(message.MakeConnectionRespMsg);
                        if (error)
                            return "MakeConnectionRespMsg." + error;
                    }
                }
                if (message.OpenSessionReqMsg != null && message.hasOwnProperty("OpenSessionReqMsg")) {
                    if (properties.SpaceMessage === 1)
                        return "SpaceMessage: multiple values";
                    properties.SpaceMessage = 1;
                    {
                        let error = $root.BasilMsgs.OpenSessionReq.verify(message.OpenSessionReqMsg);
                        if (error)
                            return "OpenSessionReqMsg." + error;
                    }
                }
                if (message.CloseSessionReqMsg != null && message.hasOwnProperty("CloseSessionReqMsg")) {
                    if (properties.SpaceMessage === 1)
                        return "SpaceMessage: multiple values";
                    properties.SpaceMessage = 1;
                    {
                        let error = $root.BasilMsgs.CloseSessionReq.verify(message.CloseSessionReqMsg);
                        if (error)
                            return "CloseSessionReqMsg." + error;
                    }
                }
                if (message.AliveCheckReqMsg != null && message.hasOwnProperty("AliveCheckReqMsg")) {
                    if (properties.SpaceMessage === 1)
                        return "SpaceMessage: multiple values";
                    properties.SpaceMessage = 1;
                    {
                        let error = $root.BasilMsgs.AliveCheckReq.verify(message.AliveCheckReqMsg);
                        if (error)
                            return "AliveCheckReqMsg." + error;
                    }
                }
                return null;
            };

            SpaceMessage.fromObject = function fromObject(object) {
                if (object instanceof $root.BasilMsgs.SpaceStreamMessage.SpaceMessage)
                    return object;
                let message = new $root.BasilMsgs.SpaceStreamMessage.SpaceMessage();
                if (object.ResponseReq != null) {
                    if (typeof object.ResponseReq !== "object")
                        throw TypeError(".BasilMsgs.SpaceStreamMessage.SpaceMessage.ResponseReq: object expected");
                    message.ResponseReq = $root.BasilMsgs.SpaceStreamMessage.BResponseRequest.fromObject(object.ResponseReq);
                }
                if (object.IdentifyDisplayableObjectRespMsg != null) {
                    if (typeof object.IdentifyDisplayableObjectRespMsg !== "object")
                        throw TypeError(".BasilMsgs.SpaceStreamMessage.SpaceMessage.IdentifyDisplayableObjectRespMsg: object expected");
                    message.IdentifyDisplayableObjectRespMsg = $root.BasilMsgs.IdentifyDisplayableObjectResp.fromObject(object.IdentifyDisplayableObjectRespMsg);
                }
                if (object.ForgetDisplayableObjectRespMsg != null) {
                    if (typeof object.ForgetDisplayableObjectRespMsg !== "object")
                        throw TypeError(".BasilMsgs.SpaceStreamMessage.SpaceMessage.ForgetDisplayableObjectRespMsg: object expected");
                    message.ForgetDisplayableObjectRespMsg = $root.BasilMsgs.ForgetDisplayableObjectResp.fromObject(object.ForgetDisplayableObjectRespMsg);
                }
                if (object.CreateObjectInstanceRespMsg != null) {
                    if (typeof object.CreateObjectInstanceRespMsg !== "object")
                        throw TypeError(".BasilMsgs.SpaceStreamMessage.SpaceMessage.CreateObjectInstanceRespMsg: object expected");
                    message.CreateObjectInstanceRespMsg = $root.BasilMsgs.CreateObjectInstanceResp.fromObject(object.CreateObjectInstanceRespMsg);
                }
                if (object.DeleteObjectInstanceRespMsg != null) {
                    if (typeof object.DeleteObjectInstanceRespMsg !== "object")
                        throw TypeError(".BasilMsgs.SpaceStreamMessage.SpaceMessage.DeleteObjectInstanceRespMsg: object expected");
                    message.DeleteObjectInstanceRespMsg = $root.BasilMsgs.DeleteObjectInstanceResp.fromObject(object.DeleteObjectInstanceRespMsg);
                }
                if (object.UpdateObjectPropertyRespMsg != null) {
                    if (typeof object.UpdateObjectPropertyRespMsg !== "object")
                        throw TypeError(".BasilMsgs.SpaceStreamMessage.SpaceMessage.UpdateObjectPropertyRespMsg: object expected");
                    message.UpdateObjectPropertyRespMsg = $root.BasilMsgs.UpdateObjectPropertyResp.fromObject(object.UpdateObjectPropertyRespMsg);
                }
                if (object.UpdateInstancePropertyRespMsg != null) {
                    if (typeof object.UpdateInstancePropertyRespMsg !== "object")
                        throw TypeError(".BasilMsgs.SpaceStreamMessage.SpaceMessage.UpdateInstancePropertyRespMsg: object expected");
                    message.UpdateInstancePropertyRespMsg = $root.BasilMsgs.UpdateInstancePropertyResp.fromObject(object.UpdateInstancePropertyRespMsg);
                }
                if (object.UpdateInstancePositionRespMsg != null) {
                    if (typeof object.UpdateInstancePositionRespMsg !== "object")
                        throw TypeError(".BasilMsgs.SpaceStreamMessage.SpaceMessage.UpdateInstancePositionRespMsg: object expected");
                    message.UpdateInstancePositionRespMsg = $root.BasilMsgs.UpdateInstancePositionResp.fromObject(object.UpdateInstancePositionRespMsg);
                }
                if (object.RequestObjectPropertiesRespMsg != null) {
                    if (typeof object.RequestObjectPropertiesRespMsg !== "object")
                        throw TypeError(".BasilMsgs.SpaceStreamMessage.SpaceMessage.RequestObjectPropertiesRespMsg: object expected");
                    message.RequestObjectPropertiesRespMsg = $root.BasilMsgs.RequestObjectPropertiesResp.fromObject(object.RequestObjectPropertiesRespMsg);
                }
                if (object.RequestInstancePropertiesRespMsg != null) {
                    if (typeof object.RequestInstancePropertiesRespMsg !== "object")
                        throw TypeError(".BasilMsgs.SpaceStreamMessage.SpaceMessage.RequestInstancePropertiesRespMsg: object expected");
                    message.RequestInstancePropertiesRespMsg = $root.BasilMsgs.RequestInstancePropertiesResp.fromObject(object.RequestInstancePropertiesRespMsg);
                }
                if (object.OpenSessionRespMsg != null) {
                    if (typeof object.OpenSessionRespMsg !== "object")
                        throw TypeError(".BasilMsgs.SpaceStreamMessage.SpaceMessage.OpenSessionRespMsg: object expected");
                    message.OpenSessionRespMsg = $root.BasilMsgs.OpenSessionResp.fromObject(object.OpenSessionRespMsg);
                }
                if (object.CloseSessionRespMsg != null) {
                    if (typeof object.CloseSessionRespMsg !== "object")
                        throw TypeError(".BasilMsgs.SpaceStreamMessage.SpaceMessage.CloseSessionRespMsg: object expected");
                    message.CloseSessionRespMsg = $root.BasilMsgs.CloseSessionResp.fromObject(object.CloseSessionRespMsg);
                }
                if (object.AliveCheckRespMsg != null) {
                    if (typeof object.AliveCheckRespMsg !== "object")
                        throw TypeError(".BasilMsgs.SpaceStreamMessage.SpaceMessage.AliveCheckRespMsg: object expected");
                    message.AliveCheckRespMsg = $root.BasilMsgs.AliveCheckResp.fromObject(object.AliveCheckRespMsg);
                }
                if (object.MakeConnectionRespMsg != null) {
                    if (typeof object.MakeConnectionRespMsg !== "object")
                        throw TypeError(".BasilMsgs.SpaceStreamMessage.SpaceMessage.MakeConnectionRespMsg: object expected");
                    message.MakeConnectionRespMsg = $root.BasilMsgs.MakeConnectionResp.fromObject(object.MakeConnectionRespMsg);
                }
                if (object.OpenSessionReqMsg != null) {
                    if (typeof object.OpenSessionReqMsg !== "object")
                        throw TypeError(".BasilMsgs.SpaceStreamMessage.SpaceMessage.OpenSessionReqMsg: object expected");
                    message.OpenSessionReqMsg = $root.BasilMsgs.OpenSessionReq.fromObject(object.OpenSessionReqMsg);
                }
                if (object.CloseSessionReqMsg != null) {
                    if (typeof object.CloseSessionReqMsg !== "object")
                        throw TypeError(".BasilMsgs.SpaceStreamMessage.SpaceMessage.CloseSessionReqMsg: object expected");
                    message.CloseSessionReqMsg = $root.BasilMsgs.CloseSessionReq.fromObject(object.CloseSessionReqMsg);
                }
                if (object.AliveCheckReqMsg != null) {
                    if (typeof object.AliveCheckReqMsg !== "object")
                        throw TypeError(".BasilMsgs.SpaceStreamMessage.SpaceMessage.AliveCheckReqMsg: object expected");
                    message.AliveCheckReqMsg = $root.BasilMsgs.AliveCheckReq.fromObject(object.AliveCheckReqMsg);
                }
                return message;
            };

            SpaceMessage.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.ResponseReq = null;
                if (message.ResponseReq != null && message.hasOwnProperty("ResponseReq"))
                    object.ResponseReq = $root.BasilMsgs.SpaceStreamMessage.BResponseRequest.toObject(message.ResponseReq, options);
                if (message.IdentifyDisplayableObjectRespMsg != null && message.hasOwnProperty("IdentifyDisplayableObjectRespMsg")) {
                    object.IdentifyDisplayableObjectRespMsg = $root.BasilMsgs.IdentifyDisplayableObjectResp.toObject(message.IdentifyDisplayableObjectRespMsg, options);
                    if (options.oneofs)
                        object.SpaceMessage = "IdentifyDisplayableObjectRespMsg";
                }
                if (message.ForgetDisplayableObjectRespMsg != null && message.hasOwnProperty("ForgetDisplayableObjectRespMsg")) {
                    object.ForgetDisplayableObjectRespMsg = $root.BasilMsgs.ForgetDisplayableObjectResp.toObject(message.ForgetDisplayableObjectRespMsg, options);
                    if (options.oneofs)
                        object.SpaceMessage = "ForgetDisplayableObjectRespMsg";
                }
                if (message.CreateObjectInstanceRespMsg != null && message.hasOwnProperty("CreateObjectInstanceRespMsg")) {
                    object.CreateObjectInstanceRespMsg = $root.BasilMsgs.CreateObjectInstanceResp.toObject(message.CreateObjectInstanceRespMsg, options);
                    if (options.oneofs)
                        object.SpaceMessage = "CreateObjectInstanceRespMsg";
                }
                if (message.DeleteObjectInstanceRespMsg != null && message.hasOwnProperty("DeleteObjectInstanceRespMsg")) {
                    object.DeleteObjectInstanceRespMsg = $root.BasilMsgs.DeleteObjectInstanceResp.toObject(message.DeleteObjectInstanceRespMsg, options);
                    if (options.oneofs)
                        object.SpaceMessage = "DeleteObjectInstanceRespMsg";
                }
                if (message.UpdateObjectPropertyRespMsg != null && message.hasOwnProperty("UpdateObjectPropertyRespMsg")) {
                    object.UpdateObjectPropertyRespMsg = $root.BasilMsgs.UpdateObjectPropertyResp.toObject(message.UpdateObjectPropertyRespMsg, options);
                    if (options.oneofs)
                        object.SpaceMessage = "UpdateObjectPropertyRespMsg";
                }
                if (message.UpdateInstancePropertyRespMsg != null && message.hasOwnProperty("UpdateInstancePropertyRespMsg")) {
                    object.UpdateInstancePropertyRespMsg = $root.BasilMsgs.UpdateInstancePropertyResp.toObject(message.UpdateInstancePropertyRespMsg, options);
                    if (options.oneofs)
                        object.SpaceMessage = "UpdateInstancePropertyRespMsg";
                }
                if (message.UpdateInstancePositionRespMsg != null && message.hasOwnProperty("UpdateInstancePositionRespMsg")) {
                    object.UpdateInstancePositionRespMsg = $root.BasilMsgs.UpdateInstancePositionResp.toObject(message.UpdateInstancePositionRespMsg, options);
                    if (options.oneofs)
                        object.SpaceMessage = "UpdateInstancePositionRespMsg";
                }
                if (message.RequestObjectPropertiesRespMsg != null && message.hasOwnProperty("RequestObjectPropertiesRespMsg")) {
                    object.RequestObjectPropertiesRespMsg = $root.BasilMsgs.RequestObjectPropertiesResp.toObject(message.RequestObjectPropertiesRespMsg, options);
                    if (options.oneofs)
                        object.SpaceMessage = "RequestObjectPropertiesRespMsg";
                }
                if (message.RequestInstancePropertiesRespMsg != null && message.hasOwnProperty("RequestInstancePropertiesRespMsg")) {
                    object.RequestInstancePropertiesRespMsg = $root.BasilMsgs.RequestInstancePropertiesResp.toObject(message.RequestInstancePropertiesRespMsg, options);
                    if (options.oneofs)
                        object.SpaceMessage = "RequestInstancePropertiesRespMsg";
                }
                if (message.OpenSessionRespMsg != null && message.hasOwnProperty("OpenSessionRespMsg")) {
                    object.OpenSessionRespMsg = $root.BasilMsgs.OpenSessionResp.toObject(message.OpenSessionRespMsg, options);
                    if (options.oneofs)
                        object.SpaceMessage = "OpenSessionRespMsg";
                }
                if (message.CloseSessionRespMsg != null && message.hasOwnProperty("CloseSessionRespMsg")) {
                    object.CloseSessionRespMsg = $root.BasilMsgs.CloseSessionResp.toObject(message.CloseSessionRespMsg, options);
                    if (options.oneofs)
                        object.SpaceMessage = "CloseSessionRespMsg";
                }
                if (message.AliveCheckRespMsg != null && message.hasOwnProperty("AliveCheckRespMsg")) {
                    object.AliveCheckRespMsg = $root.BasilMsgs.AliveCheckResp.toObject(message.AliveCheckRespMsg, options);
                    if (options.oneofs)
                        object.SpaceMessage = "AliveCheckRespMsg";
                }
                if (message.MakeConnectionRespMsg != null && message.hasOwnProperty("MakeConnectionRespMsg")) {
                    object.MakeConnectionRespMsg = $root.BasilMsgs.MakeConnectionResp.toObject(message.MakeConnectionRespMsg, options);
                    if (options.oneofs)
                        object.SpaceMessage = "MakeConnectionRespMsg";
                }
                if (message.OpenSessionReqMsg != null && message.hasOwnProperty("OpenSessionReqMsg")) {
                    object.OpenSessionReqMsg = $root.BasilMsgs.OpenSessionReq.toObject(message.OpenSessionReqMsg, options);
                    if (options.oneofs)
                        object.SpaceMessage = "OpenSessionReqMsg";
                }
                if (message.CloseSessionReqMsg != null && message.hasOwnProperty("CloseSessionReqMsg")) {
                    object.CloseSessionReqMsg = $root.BasilMsgs.CloseSessionReq.toObject(message.CloseSessionReqMsg, options);
                    if (options.oneofs)
                        object.SpaceMessage = "CloseSessionReqMsg";
                }
                if (message.AliveCheckReqMsg != null && message.hasOwnProperty("AliveCheckReqMsg")) {
                    object.AliveCheckReqMsg = $root.BasilMsgs.AliveCheckReq.toObject(message.AliveCheckReqMsg, options);
                    if (options.oneofs)
                        object.SpaceMessage = "AliveCheckReqMsg";
                }
                return object;
            };

            SpaceMessage.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return SpaceMessage;
        })();

        return SpaceStreamMessage;
    })();

    BasilMsgs.SpaceServer = (function() {

        function SpaceServer(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (SpaceServer.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = SpaceServer;

        SpaceServer.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };


        Object.defineProperty(SpaceServer.prototype.serverConnection = function serverConnection(request, callback) {
            return this.rpcCall(serverConnection, $root.BasilMsgs.SpaceStreamMessage, $root.BasilMsgs.ViewerStreamMessage, request, callback);
        }, "name", { value: "ServerConnection" });


        Object.defineProperty(SpaceServer.prototype.openSession = function openSession(request, callback) {
            return this.rpcCall(openSession, $root.BasilMsgs.OpenSessionReq, $root.BasilMsgs.OpenSessionResp, request, callback);
        }, "name", { value: "OpenSession" });


        Object.defineProperty(SpaceServer.prototype.closeSession = function closeSession(request, callback) {
            return this.rpcCall(closeSession, $root.BasilMsgs.CloseSessionReq, $root.BasilMsgs.CloseSessionResp, request, callback);
        }, "name", { value: "CloseSession" });

        return SpaceServer;
    })();

    BasilMsgs.ViewerServer = (function() {

        function ViewerServer(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (ViewerServer.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = ViewerServer;

        ViewerServer.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };


        Object.defineProperty(ViewerServer.prototype.identifyDisplayableObject = function identifyDisplayableObject(request, callback) {
            return this.rpcCall(identifyDisplayableObject, $root.BasilMsgs.IdentifyDisplayableObjectReq, $root.BasilMsgs.IdentifyDisplayableObjectResp, request, callback);
        }, "name", { value: "IdentifyDisplayableObject" });


        Object.defineProperty(ViewerServer.prototype.createObjectInstance = function createObjectInstance(request, callback) {
            return this.rpcCall(createObjectInstance, $root.BasilMsgs.CreateObjectInstanceReq, $root.BasilMsgs.CreateObjectInstanceResp, request, callback);
        }, "name", { value: "CreateObjectInstance" });


        Object.defineProperty(ViewerServer.prototype.updateObjectProperty = function updateObjectProperty(request, callback) {
            return this.rpcCall(updateObjectProperty, $root.BasilMsgs.UpdateObjectPropertyReq, $root.BasilMsgs.UpdateObjectPropertyResp, request, callback);
        }, "name", { value: "UpdateObjectProperty" });


        Object.defineProperty(ViewerServer.prototype.updateInstanceProperty = function updateInstanceProperty(request, callback) {
            return this.rpcCall(updateInstanceProperty, $root.BasilMsgs.UpdateInstancePropertyReq, $root.BasilMsgs.UpdateInstancePropertyResp, request, callback);
        }, "name", { value: "UpdateInstanceProperty" });


        Object.defineProperty(ViewerServer.prototype.updateInstancePosition = function updateInstancePosition(request, callback) {
            return this.rpcCall(updateInstancePosition, $root.BasilMsgs.UpdateInstancePositionReq, $root.BasilMsgs.UpdateInstancePositionResp, request, callback);
        }, "name", { value: "UpdateInstancePosition" });


        Object.defineProperty(ViewerServer.prototype.requestObjectProperties = function requestObjectProperties(request, callback) {
            return this.rpcCall(requestObjectProperties, $root.BasilMsgs.RequestObjectPropertiesReq, $root.BasilMsgs.RequestObjectPropertiesResp, request, callback);
        }, "name", { value: "RequestObjectProperties" });


        Object.defineProperty(ViewerServer.prototype.requestInstanceProperties = function requestInstanceProperties(request, callback) {
            return this.rpcCall(requestInstanceProperties, $root.BasilMsgs.RequestInstancePropertiesReq, $root.BasilMsgs.RequestInstancePropertiesResp, request, callback);
        }, "name", { value: "RequestInstanceProperties" });


        Object.defineProperty(ViewerServer.prototype.openSession = function openSession(request, callback) {
            return this.rpcCall(openSession, $root.BasilMsgs.OpenSessionReq, $root.BasilMsgs.OpenSessionResp, request, callback);
        }, "name", { value: "OpenSession" });


        Object.defineProperty(ViewerServer.prototype.closeSession = function closeSession(request, callback) {
            return this.rpcCall(closeSession, $root.BasilMsgs.CloseSessionReq, $root.BasilMsgs.CloseSessionResp, request, callback);
        }, "name", { value: "CloseSession" });


        Object.defineProperty(ViewerServer.prototype.makeConnection = function makeConnection(request, callback) {
            return this.rpcCall(makeConnection, $root.BasilMsgs.MakeConnectionReq, $root.BasilMsgs.MakeConnectionResp, request, callback);
        }, "name", { value: "MakeConnection" });


        Object.defineProperty(ViewerServer.prototype.aliveCheck = function aliveCheck(request, callback) {
            return this.rpcCall(aliveCheck, $root.BasilMsgs.AliveCheckReq, $root.BasilMsgs.AliveCheckResp, request, callback);
        }, "name", { value: "AliveCheck" });

        return ViewerServer;
    })();

    return BasilMsgs;
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
            if (message.x != null && message.hasOwnProperty("x"))
                writer.uint32(9).double(message.x);
            if (message.y != null && message.hasOwnProperty("y"))
                writer.uint32(17).double(message.y);
            if (message.z != null && message.hasOwnProperty("z"))
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
            if (message.x != null && message.hasOwnProperty("x"))
                writer.uint32(9).double(message.x);
            if (message.y != null && message.hasOwnProperty("y"))
                writer.uint32(17).double(message.y);
            if (message.z != null && message.hasOwnProperty("z"))
                writer.uint32(25).double(message.z);
            if (message.w != null && message.hasOwnProperty("w"))
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
            if (message.origin != null && message.hasOwnProperty("origin"))
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
            if (message.reason != null && message.hasOwnProperty("reason"))
                writer.uint32(10).string(message.reason);
            if (message.hints != null && message.hasOwnProperty("hints"))
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
            if (message.pos != null && message.hasOwnProperty("pos"))
                $root.BasilType.Vector3.encode(message.pos, writer.uint32(10).fork()).ldelim();
            if (message.rot != null && message.hasOwnProperty("rot"))
                $root.BasilType.Quaternion.encode(message.rot, writer.uint32(18).fork()).ldelim();
            if (message.posRef != null && message.hasOwnProperty("posRef"))
                writer.uint32(24).int32(message.posRef);
            if (message.rotRef != null && message.hasOwnProperty("rotRef"))
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
            if (message.id != null && message.hasOwnProperty("id"))
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
            if (message.id != null && message.hasOwnProperty("id"))
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
            if (message.upperFrontLeft != null && message.hasOwnProperty("upperFrontLeft"))
                $root.BasilType.Vector3.encode(message.upperFrontLeft, writer.uint32(10).fork()).ldelim();
            if (message.lowerBackRight != null && message.hasOwnProperty("lowerBackRight"))
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
            if (message.aabb != null && message.hasOwnProperty("aabb"))
                $root.BasilType.AaBoundingBox.encode(message.aabb, writer.uint32(10).fork()).ldelim();
            if (message.displayableType != null && message.hasOwnProperty("displayableType"))
                writer.uint32(18).string(message.displayableType);
            if (message.asset != null && message.hasOwnProperty("asset"))
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
            if (message.id != null && message.hasOwnProperty("id"))
                $root.BasilType.ObjectIdentifier.encode(message.id, writer.uint32(10).fork()).ldelim();
            if (message.displayInfo != null && message.hasOwnProperty("displayInfo"))
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
            if (message.pathType != null && message.hasOwnProperty("pathType"))
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
            if (message.id != null && message.hasOwnProperty("id"))
                $root.BasilType.InstanceIdentifier.encode(message.id, writer.uint32(10).fork()).ldelim();
            if (message.pos != null && message.hasOwnProperty("pos"))
                $root.BasilType.CoordPosition.encode(message.pos, writer.uint32(18).fork()).ldelim();
            if (message.vel != null && message.hasOwnProperty("vel"))
                $root.BasilType.Vector3.encode(message.vel, writer.uint32(26).fork()).ldelim();
            if (message.path != null && message.hasOwnProperty("path"))
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
            if (message.accessProperties != null && message.hasOwnProperty("accessProperties"))
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
            if (message.info != null && message.hasOwnProperty("info"))
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

    return BasilType;
})();

export { $root as default };
