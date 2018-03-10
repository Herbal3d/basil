/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
import * as $protobuf from "protobufjs/minimal";

const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const BasilServer = $root.BasilServer = (() => {

    const BasilServer = {};

    BasilServer.IdentifyDisplayableObjectReq = (function() {

        function IdentifyDisplayableObjectReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        IdentifyDisplayableObjectReq.prototype.auth = null;
        IdentifyDisplayableObjectReq.prototype.id = null;
        IdentifyDisplayableObjectReq.prototype.assetInfo = null;
        IdentifyDisplayableObjectReq.prototype.aabb = null;

        IdentifyDisplayableObjectReq.create = function create(properties) {
            return new IdentifyDisplayableObjectReq(properties);
        };

        IdentifyDisplayableObjectReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.id != null && message.hasOwnProperty("id"))
                $root.BasilType.ObjectIdentifier.encode(message.id, writer.uint32(18).fork()).ldelim();
            if (message.assetInfo != null && message.hasOwnProperty("assetInfo"))
                $root.BasilType.AssetInformation.encode(message.assetInfo, writer.uint32(26).fork()).ldelim();
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
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.IdentifyDisplayableObjectReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.id = $root.BasilType.ObjectIdentifier.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.assetInfo = $root.BasilType.AssetInformation.decode(reader, reader.uint32());
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
            if (message.id != null && message.hasOwnProperty("id")) {
                let error = $root.BasilType.ObjectIdentifier.verify(message.id);
                if (error)
                    return "id." + error;
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
            if (object.id != null) {
                if (typeof object.id !== "object")
                    throw TypeError(".BasilServer.IdentifyDisplayableObjectReq.id: object expected");
                message.id = $root.BasilType.ObjectIdentifier.fromObject(object.id);
            }
            if (object.assetInfo != null) {
                if (typeof object.assetInfo !== "object")
                    throw TypeError(".BasilServer.IdentifyDisplayableObjectReq.assetInfo: object expected");
                message.assetInfo = $root.BasilType.AssetInformation.fromObject(object.assetInfo);
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
                object.id = null;
                object.assetInfo = null;
                object.aabb = null;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = $root.BasilType.ObjectIdentifier.toObject(message.id, options);
            if (message.assetInfo != null && message.hasOwnProperty("assetInfo"))
                object.assetInfo = $root.BasilType.AssetInformation.toObject(message.assetInfo, options);
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

        IdentifyDisplayableObjectResp.prototype.success = null;

        IdentifyDisplayableObjectResp.create = function create(properties) {
            return new IdentifyDisplayableObjectResp(properties);
        };

        IdentifyDisplayableObjectResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                $root.BasilType.BasilException.encode(message.success, writer.uint32(10).fork()).ldelim();
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
                    message.success = $root.BasilType.BasilException.decode(reader, reader.uint32());
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
            if (message.success != null && message.hasOwnProperty("success")) {
                let error = $root.BasilType.BasilException.verify(message.success);
                if (error)
                    return "success." + error;
            }
            return null;
        };

        IdentifyDisplayableObjectResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.IdentifyDisplayableObjectResp)
                return object;
            let message = new $root.BasilServer.IdentifyDisplayableObjectResp();
            if (object.success != null) {
                if (typeof object.success !== "object")
                    throw TypeError(".BasilServer.IdentifyDisplayableObjectResp.success: object expected");
                message.success = $root.BasilType.BasilException.fromObject(object.success);
            }
            return message;
        };

        IdentifyDisplayableObjectResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.success = null;
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = $root.BasilType.BasilException.toObject(message.success, options);
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
        ForgetDisplayableObjectReq.prototype.id = null;

        ForgetDisplayableObjectReq.create = function create(properties) {
            return new ForgetDisplayableObjectReq(properties);
        };

        ForgetDisplayableObjectReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.id != null && message.hasOwnProperty("id"))
                $root.BasilType.ObjectIdentifier.encode(message.id, writer.uint32(18).fork()).ldelim();
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
                    message.id = $root.BasilType.ObjectIdentifier.decode(reader, reader.uint32());
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
            if (message.id != null && message.hasOwnProperty("id")) {
                let error = $root.BasilType.ObjectIdentifier.verify(message.id);
                if (error)
                    return "id." + error;
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
            if (object.id != null) {
                if (typeof object.id !== "object")
                    throw TypeError(".BasilServer.ForgetDisplayableObjectReq.id: object expected");
                message.id = $root.BasilType.ObjectIdentifier.fromObject(object.id);
            }
            return message;
        };

        ForgetDisplayableObjectReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.id = null;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = $root.BasilType.ObjectIdentifier.toObject(message.id, options);
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

        ForgetDisplayableObjectResp.prototype.success = null;

        ForgetDisplayableObjectResp.create = function create(properties) {
            return new ForgetDisplayableObjectResp(properties);
        };

        ForgetDisplayableObjectResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                $root.BasilType.BasilException.encode(message.success, writer.uint32(10).fork()).ldelim();
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
                    message.success = $root.BasilType.BasilException.decode(reader, reader.uint32());
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
            if (message.success != null && message.hasOwnProperty("success")) {
                let error = $root.BasilType.BasilException.verify(message.success);
                if (error)
                    return "success." + error;
            }
            return null;
        };

        ForgetDisplayableObjectResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.ForgetDisplayableObjectResp)
                return object;
            let message = new $root.BasilServer.ForgetDisplayableObjectResp();
            if (object.success != null) {
                if (typeof object.success !== "object")
                    throw TypeError(".BasilServer.ForgetDisplayableObjectResp.success: object expected");
                message.success = $root.BasilType.BasilException.fromObject(object.success);
            }
            return message;
        };

        ForgetDisplayableObjectResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.success = null;
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = $root.BasilType.BasilException.toObject(message.success, options);
            return object;
        };

        ForgetDisplayableObjectResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ForgetDisplayableObjectResp;
    })();

    BasilServer.CreateObjectInstanceReq = (function() {

        function CreateObjectInstanceReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        CreateObjectInstanceReq.prototype.auth = null;
        CreateObjectInstanceReq.prototype.id = null;
        CreateObjectInstanceReq.prototype.pos = null;
        CreateObjectInstanceReq.prototype.propertiesToSet = null;

        CreateObjectInstanceReq.create = function create(properties) {
            return new CreateObjectInstanceReq(properties);
        };

        CreateObjectInstanceReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.id != null && message.hasOwnProperty("id"))
                $root.BasilType.ObjectIdentifier.encode(message.id, writer.uint32(18).fork()).ldelim();
            if (message.pos != null && message.hasOwnProperty("pos"))
                $root.BasilType.InstancePositionInfo.encode(message.pos, writer.uint32(26).fork()).ldelim();
            if (message.propertiesToSet != null && message.hasOwnProperty("propertiesToSet"))
                $root.BasilType.PropertyList.encode(message.propertiesToSet, writer.uint32(34).fork()).ldelim();
            return writer;
        };

        CreateObjectInstanceReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CreateObjectInstanceReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.CreateObjectInstanceReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.id = $root.BasilType.ObjectIdentifier.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.pos = $root.BasilType.InstancePositionInfo.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.propertiesToSet = $root.BasilType.PropertyList.decode(reader, reader.uint32());
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
            if (message.id != null && message.hasOwnProperty("id")) {
                let error = $root.BasilType.ObjectIdentifier.verify(message.id);
                if (error)
                    return "id." + error;
            }
            if (message.pos != null && message.hasOwnProperty("pos")) {
                let error = $root.BasilType.InstancePositionInfo.verify(message.pos);
                if (error)
                    return "pos." + error;
            }
            if (message.propertiesToSet != null && message.hasOwnProperty("propertiesToSet")) {
                let error = $root.BasilType.PropertyList.verify(message.propertiesToSet);
                if (error)
                    return "propertiesToSet." + error;
            }
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
            if (object.id != null) {
                if (typeof object.id !== "object")
                    throw TypeError(".BasilServer.CreateObjectInstanceReq.id: object expected");
                message.id = $root.BasilType.ObjectIdentifier.fromObject(object.id);
            }
            if (object.pos != null) {
                if (typeof object.pos !== "object")
                    throw TypeError(".BasilServer.CreateObjectInstanceReq.pos: object expected");
                message.pos = $root.BasilType.InstancePositionInfo.fromObject(object.pos);
            }
            if (object.propertiesToSet != null) {
                if (typeof object.propertiesToSet !== "object")
                    throw TypeError(".BasilServer.CreateObjectInstanceReq.propertiesToSet: object expected");
                message.propertiesToSet = $root.BasilType.PropertyList.fromObject(object.propertiesToSet);
            }
            return message;
        };

        CreateObjectInstanceReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.id = null;
                object.pos = null;
                object.propertiesToSet = null;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = $root.BasilType.ObjectIdentifier.toObject(message.id, options);
            if (message.pos != null && message.hasOwnProperty("pos"))
                object.pos = $root.BasilType.InstancePositionInfo.toObject(message.pos, options);
            if (message.propertiesToSet != null && message.hasOwnProperty("propertiesToSet"))
                object.propertiesToSet = $root.BasilType.PropertyList.toObject(message.propertiesToSet, options);
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

        CreateObjectInstanceResp.prototype.success = null;
        CreateObjectInstanceResp.prototype.createInstanceId = null;

        CreateObjectInstanceResp.create = function create(properties) {
            return new CreateObjectInstanceResp(properties);
        };

        CreateObjectInstanceResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                $root.BasilType.BasilException.encode(message.success, writer.uint32(10).fork()).ldelim();
            if (message.createInstanceId != null && message.hasOwnProperty("createInstanceId"))
                $root.BasilType.InstanceIdentifier.encode(message.createInstanceId, writer.uint32(18).fork()).ldelim();
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
                    message.success = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.createInstanceId = $root.BasilType.InstanceIdentifier.decode(reader, reader.uint32());
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
            if (message.success != null && message.hasOwnProperty("success")) {
                let error = $root.BasilType.BasilException.verify(message.success);
                if (error)
                    return "success." + error;
            }
            if (message.createInstanceId != null && message.hasOwnProperty("createInstanceId")) {
                let error = $root.BasilType.InstanceIdentifier.verify(message.createInstanceId);
                if (error)
                    return "createInstanceId." + error;
            }
            return null;
        };

        CreateObjectInstanceResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.CreateObjectInstanceResp)
                return object;
            let message = new $root.BasilServer.CreateObjectInstanceResp();
            if (object.success != null) {
                if (typeof object.success !== "object")
                    throw TypeError(".BasilServer.CreateObjectInstanceResp.success: object expected");
                message.success = $root.BasilType.BasilException.fromObject(object.success);
            }
            if (object.createInstanceId != null) {
                if (typeof object.createInstanceId !== "object")
                    throw TypeError(".BasilServer.CreateObjectInstanceResp.createInstanceId: object expected");
                message.createInstanceId = $root.BasilType.InstanceIdentifier.fromObject(object.createInstanceId);
            }
            return message;
        };

        CreateObjectInstanceResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.success = null;
                object.createInstanceId = null;
            }
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = $root.BasilType.BasilException.toObject(message.success, options);
            if (message.createInstanceId != null && message.hasOwnProperty("createInstanceId"))
                object.createInstanceId = $root.BasilType.InstanceIdentifier.toObject(message.createInstanceId, options);
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
        DeleteObjectInstanceReq.prototype.id = null;

        DeleteObjectInstanceReq.create = function create(properties) {
            return new DeleteObjectInstanceReq(properties);
        };

        DeleteObjectInstanceReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.id != null && message.hasOwnProperty("id"))
                $root.BasilType.InstanceIdentifier.encode(message.id, writer.uint32(18).fork()).ldelim();
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
                    message.id = $root.BasilType.InstanceIdentifier.decode(reader, reader.uint32());
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
            if (message.id != null && message.hasOwnProperty("id")) {
                let error = $root.BasilType.InstanceIdentifier.verify(message.id);
                if (error)
                    return "id." + error;
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
            if (object.id != null) {
                if (typeof object.id !== "object")
                    throw TypeError(".BasilServer.DeleteObjectInstanceReq.id: object expected");
                message.id = $root.BasilType.InstanceIdentifier.fromObject(object.id);
            }
            return message;
        };

        DeleteObjectInstanceReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.id = null;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = $root.BasilType.InstanceIdentifier.toObject(message.id, options);
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

        DeleteObjectInstanceResp.prototype.success = null;

        DeleteObjectInstanceResp.create = function create(properties) {
            return new DeleteObjectInstanceResp(properties);
        };

        DeleteObjectInstanceResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                $root.BasilType.BasilException.encode(message.success, writer.uint32(10).fork()).ldelim();
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
                    message.success = $root.BasilType.BasilException.decode(reader, reader.uint32());
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
            if (message.success != null && message.hasOwnProperty("success")) {
                let error = $root.BasilType.BasilException.verify(message.success);
                if (error)
                    return "success." + error;
            }
            return null;
        };

        DeleteObjectInstanceResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.DeleteObjectInstanceResp)
                return object;
            let message = new $root.BasilServer.DeleteObjectInstanceResp();
            if (object.success != null) {
                if (typeof object.success !== "object")
                    throw TypeError(".BasilServer.DeleteObjectInstanceResp.success: object expected");
                message.success = $root.BasilType.BasilException.fromObject(object.success);
            }
            return message;
        };

        DeleteObjectInstanceResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.success = null;
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = $root.BasilType.BasilException.toObject(message.success, options);
            return object;
        };

        DeleteObjectInstanceResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DeleteObjectInstanceResp;
    })();

    BasilServer.UpdateObjectPropertyReq = (function() {

        function UpdateObjectPropertyReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        UpdateObjectPropertyReq.prototype.auth = null;
        UpdateObjectPropertyReq.prototype.objectId = null;
        UpdateObjectPropertyReq.prototype.props = null;

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
                $root.BasilType.PropertyList.encode(message.props, writer.uint32(26).fork()).ldelim();
            return writer;
        };

        UpdateObjectPropertyReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        UpdateObjectPropertyReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.UpdateObjectPropertyReq();
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
                    message.props = $root.BasilType.PropertyList.decode(reader, reader.uint32());
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
                let error = $root.BasilType.PropertyList.verify(message.props);
                if (error)
                    return "props." + error;
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
            if (object.props != null) {
                if (typeof object.props !== "object")
                    throw TypeError(".BasilServer.UpdateObjectPropertyReq.props: object expected");
                message.props = $root.BasilType.PropertyList.fromObject(object.props);
            }
            return message;
        };

        UpdateObjectPropertyReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.objectId = null;
                object.props = null;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                object.objectId = $root.BasilType.ObjectIdentifier.toObject(message.objectId, options);
            if (message.props != null && message.hasOwnProperty("props"))
                object.props = $root.BasilType.PropertyList.toObject(message.props, options);
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

        UpdateObjectPropertyResp.prototype.success = null;

        UpdateObjectPropertyResp.create = function create(properties) {
            return new UpdateObjectPropertyResp(properties);
        };

        UpdateObjectPropertyResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                $root.BasilType.BasilException.encode(message.success, writer.uint32(10).fork()).ldelim();
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
                    message.success = $root.BasilType.BasilException.decode(reader, reader.uint32());
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
            if (message.success != null && message.hasOwnProperty("success")) {
                let error = $root.BasilType.BasilException.verify(message.success);
                if (error)
                    return "success." + error;
            }
            return null;
        };

        UpdateObjectPropertyResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.UpdateObjectPropertyResp)
                return object;
            let message = new $root.BasilServer.UpdateObjectPropertyResp();
            if (object.success != null) {
                if (typeof object.success !== "object")
                    throw TypeError(".BasilServer.UpdateObjectPropertyResp.success: object expected");
                message.success = $root.BasilType.BasilException.fromObject(object.success);
            }
            return message;
        };

        UpdateObjectPropertyResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.success = null;
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = $root.BasilType.BasilException.toObject(message.success, options);
            return object;
        };

        UpdateObjectPropertyResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateObjectPropertyResp;
    })();

    BasilServer.UpdateInstancePropertyReq = (function() {

        function UpdateInstancePropertyReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        UpdateInstancePropertyReq.prototype.auth = null;
        UpdateInstancePropertyReq.prototype.instanceId = null;
        UpdateInstancePropertyReq.prototype.props = null;

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
                $root.BasilType.PropertyList.encode(message.props, writer.uint32(26).fork()).ldelim();
            return writer;
        };

        UpdateInstancePropertyReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        UpdateInstancePropertyReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.UpdateInstancePropertyReq();
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
                    message.props = $root.BasilType.PropertyList.decode(reader, reader.uint32());
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
                let error = $root.BasilType.PropertyList.verify(message.props);
                if (error)
                    return "props." + error;
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
            if (object.props != null) {
                if (typeof object.props !== "object")
                    throw TypeError(".BasilServer.UpdateInstancePropertyReq.props: object expected");
                message.props = $root.BasilType.PropertyList.fromObject(object.props);
            }
            return message;
        };

        UpdateInstancePropertyReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.instanceId = null;
                object.props = null;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.instanceId != null && message.hasOwnProperty("instanceId"))
                object.instanceId = $root.BasilType.InstanceIdentifier.toObject(message.instanceId, options);
            if (message.props != null && message.hasOwnProperty("props"))
                object.props = $root.BasilType.PropertyList.toObject(message.props, options);
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

        UpdateInstancePropertyResp.prototype.success = null;

        UpdateInstancePropertyResp.create = function create(properties) {
            return new UpdateInstancePropertyResp(properties);
        };

        UpdateInstancePropertyResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                $root.BasilType.BasilException.encode(message.success, writer.uint32(10).fork()).ldelim();
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
                    message.success = $root.BasilType.BasilException.decode(reader, reader.uint32());
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
            if (message.success != null && message.hasOwnProperty("success")) {
                let error = $root.BasilType.BasilException.verify(message.success);
                if (error)
                    return "success." + error;
            }
            return null;
        };

        UpdateInstancePropertyResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.UpdateInstancePropertyResp)
                return object;
            let message = new $root.BasilServer.UpdateInstancePropertyResp();
            if (object.success != null) {
                if (typeof object.success !== "object")
                    throw TypeError(".BasilServer.UpdateInstancePropertyResp.success: object expected");
                message.success = $root.BasilType.BasilException.fromObject(object.success);
            }
            return message;
        };

        UpdateInstancePropertyResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.success = null;
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = $root.BasilType.BasilException.toObject(message.success, options);
            return object;
        };

        UpdateInstancePropertyResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateInstancePropertyResp;
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

        UpdateInstancePositionResp.prototype.success = null;

        UpdateInstancePositionResp.create = function create(properties) {
            return new UpdateInstancePositionResp(properties);
        };

        UpdateInstancePositionResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                $root.BasilType.BasilException.encode(message.success, writer.uint32(10).fork()).ldelim();
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
                    message.success = $root.BasilType.BasilException.decode(reader, reader.uint32());
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
            if (message.success != null && message.hasOwnProperty("success")) {
                let error = $root.BasilType.BasilException.verify(message.success);
                if (error)
                    return "success." + error;
            }
            return null;
        };

        UpdateInstancePositionResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.UpdateInstancePositionResp)
                return object;
            let message = new $root.BasilServer.UpdateInstancePositionResp();
            if (object.success != null) {
                if (typeof object.success !== "object")
                    throw TypeError(".BasilServer.UpdateInstancePositionResp.success: object expected");
                message.success = $root.BasilType.BasilException.fromObject(object.success);
            }
            return message;
        };

        UpdateInstancePositionResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.success = null;
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = $root.BasilType.BasilException.toObject(message.success, options);
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
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        RequestObjectPropertiesResp.prototype.success = null;
        RequestObjectPropertiesResp.prototype.properties = null;

        RequestObjectPropertiesResp.create = function create(properties) {
            return new RequestObjectPropertiesResp(properties);
        };

        RequestObjectPropertiesResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                $root.BasilType.BasilException.encode(message.success, writer.uint32(10).fork()).ldelim();
            if (message.properties != null && message.hasOwnProperty("properties"))
                $root.BasilType.PropertyList.encode(message.properties, writer.uint32(18).fork()).ldelim();
            return writer;
        };

        RequestObjectPropertiesResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        RequestObjectPropertiesResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.RequestObjectPropertiesResp();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.success = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.properties = $root.BasilType.PropertyList.decode(reader, reader.uint32());
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
            if (message.success != null && message.hasOwnProperty("success")) {
                let error = $root.BasilType.BasilException.verify(message.success);
                if (error)
                    return "success." + error;
            }
            if (message.properties != null && message.hasOwnProperty("properties")) {
                let error = $root.BasilType.PropertyList.verify(message.properties);
                if (error)
                    return "properties." + error;
            }
            return null;
        };

        RequestObjectPropertiesResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.RequestObjectPropertiesResp)
                return object;
            let message = new $root.BasilServer.RequestObjectPropertiesResp();
            if (object.success != null) {
                if (typeof object.success !== "object")
                    throw TypeError(".BasilServer.RequestObjectPropertiesResp.success: object expected");
                message.success = $root.BasilType.BasilException.fromObject(object.success);
            }
            if (object.properties != null) {
                if (typeof object.properties !== "object")
                    throw TypeError(".BasilServer.RequestObjectPropertiesResp.properties: object expected");
                message.properties = $root.BasilType.PropertyList.fromObject(object.properties);
            }
            return message;
        };

        RequestObjectPropertiesResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.success = null;
                object.properties = null;
            }
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = $root.BasilType.BasilException.toObject(message.success, options);
            if (message.properties != null && message.hasOwnProperty("properties"))
                object.properties = $root.BasilType.PropertyList.toObject(message.properties, options);
            return object;
        };

        RequestObjectPropertiesResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RequestObjectPropertiesResp;
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
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        RequestInstancePropertiesResp.prototype.success = null;
        RequestInstancePropertiesResp.prototype.properties = null;

        RequestInstancePropertiesResp.create = function create(properties) {
            return new RequestInstancePropertiesResp(properties);
        };

        RequestInstancePropertiesResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                $root.BasilType.BasilException.encode(message.success, writer.uint32(10).fork()).ldelim();
            if (message.properties != null && message.hasOwnProperty("properties"))
                $root.BasilType.PropertyList.encode(message.properties, writer.uint32(18).fork()).ldelim();
            return writer;
        };

        RequestInstancePropertiesResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        RequestInstancePropertiesResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.RequestInstancePropertiesResp();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.success = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.properties = $root.BasilType.PropertyList.decode(reader, reader.uint32());
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
            if (message.success != null && message.hasOwnProperty("success")) {
                let error = $root.BasilType.BasilException.verify(message.success);
                if (error)
                    return "success." + error;
            }
            if (message.properties != null && message.hasOwnProperty("properties")) {
                let error = $root.BasilType.PropertyList.verify(message.properties);
                if (error)
                    return "properties." + error;
            }
            return null;
        };

        RequestInstancePropertiesResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.RequestInstancePropertiesResp)
                return object;
            let message = new $root.BasilServer.RequestInstancePropertiesResp();
            if (object.success != null) {
                if (typeof object.success !== "object")
                    throw TypeError(".BasilServer.RequestInstancePropertiesResp.success: object expected");
                message.success = $root.BasilType.BasilException.fromObject(object.success);
            }
            if (object.properties != null) {
                if (typeof object.properties !== "object")
                    throw TypeError(".BasilServer.RequestInstancePropertiesResp.properties: object expected");
                message.properties = $root.BasilType.PropertyList.fromObject(object.properties);
            }
            return message;
        };

        RequestInstancePropertiesResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.success = null;
                object.properties = null;
            }
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = $root.BasilType.BasilException.toObject(message.success, options);
            if (message.properties != null && message.hasOwnProperty("properties"))
                object.properties = $root.BasilType.PropertyList.toObject(message.properties, options);
            return object;
        };

        RequestInstancePropertiesResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RequestInstancePropertiesResp;
    })();

    BasilServer.OpenSessionReq = (function() {

        function OpenSessionReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        OpenSessionReq.prototype.auth = null;
        OpenSessionReq.prototype.features = null;

        OpenSessionReq.create = function create(properties) {
            return new OpenSessionReq(properties);
        };

        OpenSessionReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(10).fork()).ldelim();
            if (message.features != null && message.hasOwnProperty("features"))
                $root.BasilType.PropertyList.encode(message.features, writer.uint32(18).fork()).ldelim();
            return writer;
        };

        OpenSessionReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        OpenSessionReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.OpenSessionReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.features = $root.BasilType.PropertyList.decode(reader, reader.uint32());
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
                let error = $root.BasilType.PropertyList.verify(message.features);
                if (error)
                    return "features." + error;
            }
            return null;
        };

        OpenSessionReq.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.OpenSessionReq)
                return object;
            let message = new $root.BasilServer.OpenSessionReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".BasilServer.OpenSessionReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.features != null) {
                if (typeof object.features !== "object")
                    throw TypeError(".BasilServer.OpenSessionReq.features: object expected");
                message.features = $root.BasilType.PropertyList.fromObject(object.features);
            }
            return message;
        };

        OpenSessionReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.features = null;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.features != null && message.hasOwnProperty("features"))
                object.features = $root.BasilType.PropertyList.toObject(message.features, options);
            return object;
        };

        OpenSessionReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return OpenSessionReq;
    })();

    BasilServer.OpenSessionResp = (function() {

        function OpenSessionResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        OpenSessionResp.prototype.success = null;
        OpenSessionResp.prototype.properties = null;

        OpenSessionResp.create = function create(properties) {
            return new OpenSessionResp(properties);
        };

        OpenSessionResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                $root.BasilType.BasilException.encode(message.success, writer.uint32(10).fork()).ldelim();
            if (message.properties != null && message.hasOwnProperty("properties"))
                $root.BasilType.PropertyList.encode(message.properties, writer.uint32(18).fork()).ldelim();
            return writer;
        };

        OpenSessionResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        OpenSessionResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.OpenSessionResp();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.success = $root.BasilType.BasilException.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.properties = $root.BasilType.PropertyList.decode(reader, reader.uint32());
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
            if (message.success != null && message.hasOwnProperty("success")) {
                let error = $root.BasilType.BasilException.verify(message.success);
                if (error)
                    return "success." + error;
            }
            if (message.properties != null && message.hasOwnProperty("properties")) {
                let error = $root.BasilType.PropertyList.verify(message.properties);
                if (error)
                    return "properties." + error;
            }
            return null;
        };

        OpenSessionResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.OpenSessionResp)
                return object;
            let message = new $root.BasilServer.OpenSessionResp();
            if (object.success != null) {
                if (typeof object.success !== "object")
                    throw TypeError(".BasilServer.OpenSessionResp.success: object expected");
                message.success = $root.BasilType.BasilException.fromObject(object.success);
            }
            if (object.properties != null) {
                if (typeof object.properties !== "object")
                    throw TypeError(".BasilServer.OpenSessionResp.properties: object expected");
                message.properties = $root.BasilType.PropertyList.fromObject(object.properties);
            }
            return message;
        };

        OpenSessionResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.success = null;
                object.properties = null;
            }
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = $root.BasilType.BasilException.toObject(message.success, options);
            if (message.properties != null && message.hasOwnProperty("properties"))
                object.properties = $root.BasilType.PropertyList.toObject(message.properties, options);
            return object;
        };

        OpenSessionResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return OpenSessionResp;
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

        CloseSessionResp.prototype.success = null;

        CloseSessionResp.create = function create(properties) {
            return new CloseSessionResp(properties);
        };

        CloseSessionResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                $root.BasilType.BasilException.encode(message.success, writer.uint32(10).fork()).ldelim();
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
                    message.success = $root.BasilType.BasilException.decode(reader, reader.uint32());
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
            if (message.success != null && message.hasOwnProperty("success")) {
                let error = $root.BasilType.BasilException.verify(message.success);
                if (error)
                    return "success." + error;
            }
            return null;
        };

        CloseSessionResp.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.CloseSessionResp)
                return object;
            let message = new $root.BasilServer.CloseSessionResp();
            if (object.success != null) {
                if (typeof object.success !== "object")
                    throw TypeError(".BasilServer.CloseSessionResp.success: object expected");
                message.success = $root.BasilType.BasilException.fromObject(object.success);
            }
            return message;
        };

        CloseSessionResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.success = null;
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = $root.BasilType.BasilException.toObject(message.success, options);
            return object;
        };

        CloseSessionResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CloseSessionResp;
    })();

    BasilServer.AliveCheckReq = (function() {

        function AliveCheckReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        AliveCheckReq.prototype.auth = null;
        AliveCheckReq.prototype.time = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
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
                writer.uint32(16).sint64(message.time);
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
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.AliveCheckReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.time = reader.sint64();
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
                    (message.time = $util.Long.fromValue(object.time)).unsigned = false;
                else if (typeof object.time === "string")
                    message.time = parseInt(object.time, 10);
                else if (typeof object.time === "number")
                    message.time = object.time;
                else if (typeof object.time === "object")
                    message.time = new $util.LongBits(object.time.low >>> 0, object.time.high >>> 0).toNumber();
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
                    let long = new $util.Long(0, 0, false);
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
                    object.time = options.longs === String ? $util.Long.prototype.toString.call(message.time) : options.longs === Number ? new $util.LongBits(message.time.low >>> 0, message.time.high >>> 0).toNumber() : message.time;
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

        AliveCheckResp.prototype.time = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        AliveCheckResp.prototype.sequenceNum = 0;
        AliveCheckResp.prototype.timeReceived = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        AliveCheckResp.prototype.sequenceNumReceived = 0;

        AliveCheckResp.create = function create(properties) {
            return new AliveCheckResp(properties);
        };

        AliveCheckResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.time != null && message.hasOwnProperty("time"))
                writer.uint32(8).sint64(message.time);
            if (message.sequenceNum != null && message.hasOwnProperty("sequenceNum"))
                writer.uint32(16).int32(message.sequenceNum);
            if (message.timeReceived != null && message.hasOwnProperty("timeReceived"))
                writer.uint32(24).sint64(message.timeReceived);
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
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.AliveCheckResp();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.time = reader.sint64();
                    break;
                case 2:
                    message.sequenceNum = reader.int32();
                    break;
                case 3:
                    message.timeReceived = reader.sint64();
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
                    (message.time = $util.Long.fromValue(object.time)).unsigned = false;
                else if (typeof object.time === "string")
                    message.time = parseInt(object.time, 10);
                else if (typeof object.time === "number")
                    message.time = object.time;
                else if (typeof object.time === "object")
                    message.time = new $util.LongBits(object.time.low >>> 0, object.time.high >>> 0).toNumber();
            if (object.sequenceNum != null)
                message.sequenceNum = object.sequenceNum | 0;
            if (object.timeReceived != null)
                if ($util.Long)
                    (message.timeReceived = $util.Long.fromValue(object.timeReceived)).unsigned = false;
                else if (typeof object.timeReceived === "string")
                    message.timeReceived = parseInt(object.timeReceived, 10);
                else if (typeof object.timeReceived === "number")
                    message.timeReceived = object.timeReceived;
                else if (typeof object.timeReceived === "object")
                    message.timeReceived = new $util.LongBits(object.timeReceived.low >>> 0, object.timeReceived.high >>> 0).toNumber();
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
                    let long = new $util.Long(0, 0, false);
                    object.time = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.time = options.longs === String ? "0" : 0;
                object.sequenceNum = 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.timeReceived = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timeReceived = options.longs === String ? "0" : 0;
                object.sequenceNumReceived = 0;
            }
            if (message.time != null && message.hasOwnProperty("time"))
                if (typeof message.time === "number")
                    object.time = options.longs === String ? String(message.time) : message.time;
                else
                    object.time = options.longs === String ? $util.Long.prototype.toString.call(message.time) : options.longs === Number ? new $util.LongBits(message.time.low >>> 0, message.time.high >>> 0).toNumber() : message.time;
            if (message.sequenceNum != null && message.hasOwnProperty("sequenceNum"))
                object.sequenceNum = message.sequenceNum;
            if (message.timeReceived != null && message.hasOwnProperty("timeReceived"))
                if (typeof message.timeReceived === "number")
                    object.timeReceived = options.longs === String ? String(message.timeReceived) : message.timeReceived;
                else
                    object.timeReceived = options.longs === String ? $util.Long.prototype.toString.call(message.timeReceived) : options.longs === Number ? new $util.LongBits(message.timeReceived.low >>> 0, message.timeReceived.high >>> 0).toNumber() : message.timeReceived;
            if (message.sequenceNumReceived != null && message.hasOwnProperty("sequenceNumReceived"))
                object.sequenceNumReceived = message.sequenceNumReceived;
            return object;
        };

        AliveCheckResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AliveCheckResp;
    })();

    BasilServer.BasilServerMessage = (function() {

        function BasilServerMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        BasilServerMessage.prototype.IdentifyDisplayableObjectReqMsg = null;
        BasilServerMessage.prototype.IdentifyDisplayableObjectRespMsg = null;
        BasilServerMessage.prototype.ForgetDisplayableObjectReqMsg = null;
        BasilServerMessage.prototype.ForgetDisplayableObjectRespMsg = null;
        BasilServerMessage.prototype.CreateObjectInstanceReqMsg = null;
        BasilServerMessage.prototype.CreateObjectInstanceRespMsg = null;
        BasilServerMessage.prototype.DeleteObjectInstanceReqMsg = null;
        BasilServerMessage.prototype.DeleteObjectInstanceRespMsg = null;
        BasilServerMessage.prototype.UpdateObjectPropertyReqMsg = null;
        BasilServerMessage.prototype.UpdateObjectPropertyRespMsg = null;
        BasilServerMessage.prototype.UpdateInstancePropertyReqMsg = null;
        BasilServerMessage.prototype.UpdateInstancePropertyRespMsg = null;
        BasilServerMessage.prototype.UpdateInstancePositionReqMsg = null;
        BasilServerMessage.prototype.UpdateInstancePositionRespMsg = null;
        BasilServerMessage.prototype.RequestObjectPropertiesReqMsg = null;
        BasilServerMessage.prototype.RequestObjectPropertiesRespMsg = null;
        BasilServerMessage.prototype.RequestInstancePropertiesReqMsg = null;
        BasilServerMessage.prototype.RequestInstancePropertiesRespMsg = null;
        BasilServerMessage.prototype.OpenSessionReqMsg = null;
        BasilServerMessage.prototype.OpenSessionRespMsg = null;
        BasilServerMessage.prototype.CloseSessionReqMsg = null;
        BasilServerMessage.prototype.CloseSessionRespMsg = null;
        BasilServerMessage.prototype.AliveCheckReqMsg = null;
        BasilServerMessage.prototype.AliveCheckRespMsg = null;

        let $oneOfFields;

        Object.defineProperty(BasilServerMessage.prototype, "msg", {
            get: $util.oneOfGetter($oneOfFields = ["IdentifyDisplayableObjectReqMsg", "IdentifyDisplayableObjectRespMsg", "ForgetDisplayableObjectReqMsg", "ForgetDisplayableObjectRespMsg", "CreateObjectInstanceReqMsg", "CreateObjectInstanceRespMsg", "DeleteObjectInstanceReqMsg", "DeleteObjectInstanceRespMsg", "UpdateObjectPropertyReqMsg", "UpdateObjectPropertyRespMsg", "UpdateInstancePropertyReqMsg", "UpdateInstancePropertyRespMsg", "UpdateInstancePositionReqMsg", "UpdateInstancePositionRespMsg", "RequestObjectPropertiesReqMsg", "RequestObjectPropertiesRespMsg", "RequestInstancePropertiesReqMsg", "RequestInstancePropertiesRespMsg", "OpenSessionReqMsg", "OpenSessionRespMsg", "CloseSessionReqMsg", "CloseSessionRespMsg", "AliveCheckReqMsg", "AliveCheckRespMsg"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        BasilServerMessage.create = function create(properties) {
            return new BasilServerMessage(properties);
        };

        BasilServerMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.IdentifyDisplayableObjectReqMsg != null && message.hasOwnProperty("IdentifyDisplayableObjectReqMsg"))
                $root.BasilServer.IdentifyDisplayableObjectReq.encode(message.IdentifyDisplayableObjectReqMsg, writer.uint32(10).fork()).ldelim();
            if (message.IdentifyDisplayableObjectRespMsg != null && message.hasOwnProperty("IdentifyDisplayableObjectRespMsg"))
                $root.BasilServer.IdentifyDisplayableObjectResp.encode(message.IdentifyDisplayableObjectRespMsg, writer.uint32(18).fork()).ldelim();
            if (message.ForgetDisplayableObjectReqMsg != null && message.hasOwnProperty("ForgetDisplayableObjectReqMsg"))
                $root.BasilServer.ForgetDisplayableObjectReq.encode(message.ForgetDisplayableObjectReqMsg, writer.uint32(26).fork()).ldelim();
            if (message.ForgetDisplayableObjectRespMsg != null && message.hasOwnProperty("ForgetDisplayableObjectRespMsg"))
                $root.BasilServer.ForgetDisplayableObjectResp.encode(message.ForgetDisplayableObjectRespMsg, writer.uint32(34).fork()).ldelim();
            if (message.CreateObjectInstanceReqMsg != null && message.hasOwnProperty("CreateObjectInstanceReqMsg"))
                $root.BasilServer.CreateObjectInstanceReq.encode(message.CreateObjectInstanceReqMsg, writer.uint32(42).fork()).ldelim();
            if (message.CreateObjectInstanceRespMsg != null && message.hasOwnProperty("CreateObjectInstanceRespMsg"))
                $root.BasilServer.CreateObjectInstanceResp.encode(message.CreateObjectInstanceRespMsg, writer.uint32(50).fork()).ldelim();
            if (message.DeleteObjectInstanceReqMsg != null && message.hasOwnProperty("DeleteObjectInstanceReqMsg"))
                $root.BasilServer.DeleteObjectInstanceReq.encode(message.DeleteObjectInstanceReqMsg, writer.uint32(58).fork()).ldelim();
            if (message.DeleteObjectInstanceRespMsg != null && message.hasOwnProperty("DeleteObjectInstanceRespMsg"))
                $root.BasilServer.DeleteObjectInstanceResp.encode(message.DeleteObjectInstanceRespMsg, writer.uint32(66).fork()).ldelim();
            if (message.UpdateObjectPropertyReqMsg != null && message.hasOwnProperty("UpdateObjectPropertyReqMsg"))
                $root.BasilServer.UpdateObjectPropertyReq.encode(message.UpdateObjectPropertyReqMsg, writer.uint32(74).fork()).ldelim();
            if (message.UpdateObjectPropertyRespMsg != null && message.hasOwnProperty("UpdateObjectPropertyRespMsg"))
                $root.BasilServer.UpdateObjectPropertyResp.encode(message.UpdateObjectPropertyRespMsg, writer.uint32(82).fork()).ldelim();
            if (message.UpdateInstancePropertyReqMsg != null && message.hasOwnProperty("UpdateInstancePropertyReqMsg"))
                $root.BasilServer.UpdateInstancePropertyReq.encode(message.UpdateInstancePropertyReqMsg, writer.uint32(90).fork()).ldelim();
            if (message.UpdateInstancePropertyRespMsg != null && message.hasOwnProperty("UpdateInstancePropertyRespMsg"))
                $root.BasilServer.UpdateInstancePropertyResp.encode(message.UpdateInstancePropertyRespMsg, writer.uint32(98).fork()).ldelim();
            if (message.UpdateInstancePositionReqMsg != null && message.hasOwnProperty("UpdateInstancePositionReqMsg"))
                $root.BasilServer.UpdateInstancePositionReq.encode(message.UpdateInstancePositionReqMsg, writer.uint32(106).fork()).ldelim();
            if (message.UpdateInstancePositionRespMsg != null && message.hasOwnProperty("UpdateInstancePositionRespMsg"))
                $root.BasilServer.UpdateInstancePositionResp.encode(message.UpdateInstancePositionRespMsg, writer.uint32(114).fork()).ldelim();
            if (message.RequestObjectPropertiesReqMsg != null && message.hasOwnProperty("RequestObjectPropertiesReqMsg"))
                $root.BasilServer.RequestObjectPropertiesReq.encode(message.RequestObjectPropertiesReqMsg, writer.uint32(122).fork()).ldelim();
            if (message.RequestObjectPropertiesRespMsg != null && message.hasOwnProperty("RequestObjectPropertiesRespMsg"))
                $root.BasilServer.RequestObjectPropertiesResp.encode(message.RequestObjectPropertiesRespMsg, writer.uint32(130).fork()).ldelim();
            if (message.RequestInstancePropertiesReqMsg != null && message.hasOwnProperty("RequestInstancePropertiesReqMsg"))
                $root.BasilServer.RequestInstancePropertiesReq.encode(message.RequestInstancePropertiesReqMsg, writer.uint32(138).fork()).ldelim();
            if (message.RequestInstancePropertiesRespMsg != null && message.hasOwnProperty("RequestInstancePropertiesRespMsg"))
                $root.BasilServer.RequestInstancePropertiesResp.encode(message.RequestInstancePropertiesRespMsg, writer.uint32(146).fork()).ldelim();
            if (message.OpenSessionReqMsg != null && message.hasOwnProperty("OpenSessionReqMsg"))
                $root.BasilServer.OpenSessionReq.encode(message.OpenSessionReqMsg, writer.uint32(154).fork()).ldelim();
            if (message.OpenSessionRespMsg != null && message.hasOwnProperty("OpenSessionRespMsg"))
                $root.BasilServer.OpenSessionResp.encode(message.OpenSessionRespMsg, writer.uint32(162).fork()).ldelim();
            if (message.CloseSessionReqMsg != null && message.hasOwnProperty("CloseSessionReqMsg"))
                $root.BasilServer.CloseSessionReq.encode(message.CloseSessionReqMsg, writer.uint32(170).fork()).ldelim();
            if (message.CloseSessionRespMsg != null && message.hasOwnProperty("CloseSessionRespMsg"))
                $root.BasilServer.CloseSessionResp.encode(message.CloseSessionRespMsg, writer.uint32(178).fork()).ldelim();
            if (message.AliveCheckReqMsg != null && message.hasOwnProperty("AliveCheckReqMsg"))
                $root.BasilServer.AliveCheckReq.encode(message.AliveCheckReqMsg, writer.uint32(186).fork()).ldelim();
            if (message.AliveCheckRespMsg != null && message.hasOwnProperty("AliveCheckRespMsg"))
                $root.BasilServer.AliveCheckResp.encode(message.AliveCheckRespMsg, writer.uint32(194).fork()).ldelim();
            return writer;
        };

        BasilServerMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        BasilServerMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilServer.BasilServerMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.IdentifyDisplayableObjectReqMsg = $root.BasilServer.IdentifyDisplayableObjectReq.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.IdentifyDisplayableObjectRespMsg = $root.BasilServer.IdentifyDisplayableObjectResp.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.ForgetDisplayableObjectReqMsg = $root.BasilServer.ForgetDisplayableObjectReq.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.ForgetDisplayableObjectRespMsg = $root.BasilServer.ForgetDisplayableObjectResp.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.CreateObjectInstanceReqMsg = $root.BasilServer.CreateObjectInstanceReq.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.CreateObjectInstanceRespMsg = $root.BasilServer.CreateObjectInstanceResp.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.DeleteObjectInstanceReqMsg = $root.BasilServer.DeleteObjectInstanceReq.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.DeleteObjectInstanceRespMsg = $root.BasilServer.DeleteObjectInstanceResp.decode(reader, reader.uint32());
                    break;
                case 9:
                    message.UpdateObjectPropertyReqMsg = $root.BasilServer.UpdateObjectPropertyReq.decode(reader, reader.uint32());
                    break;
                case 10:
                    message.UpdateObjectPropertyRespMsg = $root.BasilServer.UpdateObjectPropertyResp.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.UpdateInstancePropertyReqMsg = $root.BasilServer.UpdateInstancePropertyReq.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.UpdateInstancePropertyRespMsg = $root.BasilServer.UpdateInstancePropertyResp.decode(reader, reader.uint32());
                    break;
                case 13:
                    message.UpdateInstancePositionReqMsg = $root.BasilServer.UpdateInstancePositionReq.decode(reader, reader.uint32());
                    break;
                case 14:
                    message.UpdateInstancePositionRespMsg = $root.BasilServer.UpdateInstancePositionResp.decode(reader, reader.uint32());
                    break;
                case 15:
                    message.RequestObjectPropertiesReqMsg = $root.BasilServer.RequestObjectPropertiesReq.decode(reader, reader.uint32());
                    break;
                case 16:
                    message.RequestObjectPropertiesRespMsg = $root.BasilServer.RequestObjectPropertiesResp.decode(reader, reader.uint32());
                    break;
                case 17:
                    message.RequestInstancePropertiesReqMsg = $root.BasilServer.RequestInstancePropertiesReq.decode(reader, reader.uint32());
                    break;
                case 18:
                    message.RequestInstancePropertiesRespMsg = $root.BasilServer.RequestInstancePropertiesResp.decode(reader, reader.uint32());
                    break;
                case 19:
                    message.OpenSessionReqMsg = $root.BasilServer.OpenSessionReq.decode(reader, reader.uint32());
                    break;
                case 20:
                    message.OpenSessionRespMsg = $root.BasilServer.OpenSessionResp.decode(reader, reader.uint32());
                    break;
                case 21:
                    message.CloseSessionReqMsg = $root.BasilServer.CloseSessionReq.decode(reader, reader.uint32());
                    break;
                case 22:
                    message.CloseSessionRespMsg = $root.BasilServer.CloseSessionResp.decode(reader, reader.uint32());
                    break;
                case 23:
                    message.AliveCheckReqMsg = $root.BasilServer.AliveCheckReq.decode(reader, reader.uint32());
                    break;
                case 24:
                    message.AliveCheckRespMsg = $root.BasilServer.AliveCheckResp.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        BasilServerMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        BasilServerMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.IdentifyDisplayableObjectReqMsg != null && message.hasOwnProperty("IdentifyDisplayableObjectReqMsg")) {
                properties.msg = 1;
                {
                    let error = $root.BasilServer.IdentifyDisplayableObjectReq.verify(message.IdentifyDisplayableObjectReqMsg);
                    if (error)
                        return "IdentifyDisplayableObjectReqMsg." + error;
                }
            }
            if (message.IdentifyDisplayableObjectRespMsg != null && message.hasOwnProperty("IdentifyDisplayableObjectRespMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.IdentifyDisplayableObjectResp.verify(message.IdentifyDisplayableObjectRespMsg);
                    if (error)
                        return "IdentifyDisplayableObjectRespMsg." + error;
                }
            }
            if (message.ForgetDisplayableObjectReqMsg != null && message.hasOwnProperty("ForgetDisplayableObjectReqMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.ForgetDisplayableObjectReq.verify(message.ForgetDisplayableObjectReqMsg);
                    if (error)
                        return "ForgetDisplayableObjectReqMsg." + error;
                }
            }
            if (message.ForgetDisplayableObjectRespMsg != null && message.hasOwnProperty("ForgetDisplayableObjectRespMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.ForgetDisplayableObjectResp.verify(message.ForgetDisplayableObjectRespMsg);
                    if (error)
                        return "ForgetDisplayableObjectRespMsg." + error;
                }
            }
            if (message.CreateObjectInstanceReqMsg != null && message.hasOwnProperty("CreateObjectInstanceReqMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.CreateObjectInstanceReq.verify(message.CreateObjectInstanceReqMsg);
                    if (error)
                        return "CreateObjectInstanceReqMsg." + error;
                }
            }
            if (message.CreateObjectInstanceRespMsg != null && message.hasOwnProperty("CreateObjectInstanceRespMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.CreateObjectInstanceResp.verify(message.CreateObjectInstanceRespMsg);
                    if (error)
                        return "CreateObjectInstanceRespMsg." + error;
                }
            }
            if (message.DeleteObjectInstanceReqMsg != null && message.hasOwnProperty("DeleteObjectInstanceReqMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.DeleteObjectInstanceReq.verify(message.DeleteObjectInstanceReqMsg);
                    if (error)
                        return "DeleteObjectInstanceReqMsg." + error;
                }
            }
            if (message.DeleteObjectInstanceRespMsg != null && message.hasOwnProperty("DeleteObjectInstanceRespMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.DeleteObjectInstanceResp.verify(message.DeleteObjectInstanceRespMsg);
                    if (error)
                        return "DeleteObjectInstanceRespMsg." + error;
                }
            }
            if (message.UpdateObjectPropertyReqMsg != null && message.hasOwnProperty("UpdateObjectPropertyReqMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.UpdateObjectPropertyReq.verify(message.UpdateObjectPropertyReqMsg);
                    if (error)
                        return "UpdateObjectPropertyReqMsg." + error;
                }
            }
            if (message.UpdateObjectPropertyRespMsg != null && message.hasOwnProperty("UpdateObjectPropertyRespMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.UpdateObjectPropertyResp.verify(message.UpdateObjectPropertyRespMsg);
                    if (error)
                        return "UpdateObjectPropertyRespMsg." + error;
                }
            }
            if (message.UpdateInstancePropertyReqMsg != null && message.hasOwnProperty("UpdateInstancePropertyReqMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.UpdateInstancePropertyReq.verify(message.UpdateInstancePropertyReqMsg);
                    if (error)
                        return "UpdateInstancePropertyReqMsg." + error;
                }
            }
            if (message.UpdateInstancePropertyRespMsg != null && message.hasOwnProperty("UpdateInstancePropertyRespMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.UpdateInstancePropertyResp.verify(message.UpdateInstancePropertyRespMsg);
                    if (error)
                        return "UpdateInstancePropertyRespMsg." + error;
                }
            }
            if (message.UpdateInstancePositionReqMsg != null && message.hasOwnProperty("UpdateInstancePositionReqMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.UpdateInstancePositionReq.verify(message.UpdateInstancePositionReqMsg);
                    if (error)
                        return "UpdateInstancePositionReqMsg." + error;
                }
            }
            if (message.UpdateInstancePositionRespMsg != null && message.hasOwnProperty("UpdateInstancePositionRespMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.UpdateInstancePositionResp.verify(message.UpdateInstancePositionRespMsg);
                    if (error)
                        return "UpdateInstancePositionRespMsg." + error;
                }
            }
            if (message.RequestObjectPropertiesReqMsg != null && message.hasOwnProperty("RequestObjectPropertiesReqMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.RequestObjectPropertiesReq.verify(message.RequestObjectPropertiesReqMsg);
                    if (error)
                        return "RequestObjectPropertiesReqMsg." + error;
                }
            }
            if (message.RequestObjectPropertiesRespMsg != null && message.hasOwnProperty("RequestObjectPropertiesRespMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.RequestObjectPropertiesResp.verify(message.RequestObjectPropertiesRespMsg);
                    if (error)
                        return "RequestObjectPropertiesRespMsg." + error;
                }
            }
            if (message.RequestInstancePropertiesReqMsg != null && message.hasOwnProperty("RequestInstancePropertiesReqMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.RequestInstancePropertiesReq.verify(message.RequestInstancePropertiesReqMsg);
                    if (error)
                        return "RequestInstancePropertiesReqMsg." + error;
                }
            }
            if (message.RequestInstancePropertiesRespMsg != null && message.hasOwnProperty("RequestInstancePropertiesRespMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.RequestInstancePropertiesResp.verify(message.RequestInstancePropertiesRespMsg);
                    if (error)
                        return "RequestInstancePropertiesRespMsg." + error;
                }
            }
            if (message.OpenSessionReqMsg != null && message.hasOwnProperty("OpenSessionReqMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.OpenSessionReq.verify(message.OpenSessionReqMsg);
                    if (error)
                        return "OpenSessionReqMsg." + error;
                }
            }
            if (message.OpenSessionRespMsg != null && message.hasOwnProperty("OpenSessionRespMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.OpenSessionResp.verify(message.OpenSessionRespMsg);
                    if (error)
                        return "OpenSessionRespMsg." + error;
                }
            }
            if (message.CloseSessionReqMsg != null && message.hasOwnProperty("CloseSessionReqMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.CloseSessionReq.verify(message.CloseSessionReqMsg);
                    if (error)
                        return "CloseSessionReqMsg." + error;
                }
            }
            if (message.CloseSessionRespMsg != null && message.hasOwnProperty("CloseSessionRespMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.CloseSessionResp.verify(message.CloseSessionRespMsg);
                    if (error)
                        return "CloseSessionRespMsg." + error;
                }
            }
            if (message.AliveCheckReqMsg != null && message.hasOwnProperty("AliveCheckReqMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.AliveCheckReq.verify(message.AliveCheckReqMsg);
                    if (error)
                        return "AliveCheckReqMsg." + error;
                }
            }
            if (message.AliveCheckRespMsg != null && message.hasOwnProperty("AliveCheckRespMsg")) {
                if (properties.msg === 1)
                    return "msg: multiple values";
                properties.msg = 1;
                {
                    let error = $root.BasilServer.AliveCheckResp.verify(message.AliveCheckRespMsg);
                    if (error)
                        return "AliveCheckRespMsg." + error;
                }
            }
            return null;
        };

        BasilServerMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilServer.BasilServerMessage)
                return object;
            let message = new $root.BasilServer.BasilServerMessage();
            if (object.IdentifyDisplayableObjectReqMsg != null) {
                if (typeof object.IdentifyDisplayableObjectReqMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.IdentifyDisplayableObjectReqMsg: object expected");
                message.IdentifyDisplayableObjectReqMsg = $root.BasilServer.IdentifyDisplayableObjectReq.fromObject(object.IdentifyDisplayableObjectReqMsg);
            }
            if (object.IdentifyDisplayableObjectRespMsg != null) {
                if (typeof object.IdentifyDisplayableObjectRespMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.IdentifyDisplayableObjectRespMsg: object expected");
                message.IdentifyDisplayableObjectRespMsg = $root.BasilServer.IdentifyDisplayableObjectResp.fromObject(object.IdentifyDisplayableObjectRespMsg);
            }
            if (object.ForgetDisplayableObjectReqMsg != null) {
                if (typeof object.ForgetDisplayableObjectReqMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.ForgetDisplayableObjectReqMsg: object expected");
                message.ForgetDisplayableObjectReqMsg = $root.BasilServer.ForgetDisplayableObjectReq.fromObject(object.ForgetDisplayableObjectReqMsg);
            }
            if (object.ForgetDisplayableObjectRespMsg != null) {
                if (typeof object.ForgetDisplayableObjectRespMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.ForgetDisplayableObjectRespMsg: object expected");
                message.ForgetDisplayableObjectRespMsg = $root.BasilServer.ForgetDisplayableObjectResp.fromObject(object.ForgetDisplayableObjectRespMsg);
            }
            if (object.CreateObjectInstanceReqMsg != null) {
                if (typeof object.CreateObjectInstanceReqMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.CreateObjectInstanceReqMsg: object expected");
                message.CreateObjectInstanceReqMsg = $root.BasilServer.CreateObjectInstanceReq.fromObject(object.CreateObjectInstanceReqMsg);
            }
            if (object.CreateObjectInstanceRespMsg != null) {
                if (typeof object.CreateObjectInstanceRespMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.CreateObjectInstanceRespMsg: object expected");
                message.CreateObjectInstanceRespMsg = $root.BasilServer.CreateObjectInstanceResp.fromObject(object.CreateObjectInstanceRespMsg);
            }
            if (object.DeleteObjectInstanceReqMsg != null) {
                if (typeof object.DeleteObjectInstanceReqMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.DeleteObjectInstanceReqMsg: object expected");
                message.DeleteObjectInstanceReqMsg = $root.BasilServer.DeleteObjectInstanceReq.fromObject(object.DeleteObjectInstanceReqMsg);
            }
            if (object.DeleteObjectInstanceRespMsg != null) {
                if (typeof object.DeleteObjectInstanceRespMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.DeleteObjectInstanceRespMsg: object expected");
                message.DeleteObjectInstanceRespMsg = $root.BasilServer.DeleteObjectInstanceResp.fromObject(object.DeleteObjectInstanceRespMsg);
            }
            if (object.UpdateObjectPropertyReqMsg != null) {
                if (typeof object.UpdateObjectPropertyReqMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.UpdateObjectPropertyReqMsg: object expected");
                message.UpdateObjectPropertyReqMsg = $root.BasilServer.UpdateObjectPropertyReq.fromObject(object.UpdateObjectPropertyReqMsg);
            }
            if (object.UpdateObjectPropertyRespMsg != null) {
                if (typeof object.UpdateObjectPropertyRespMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.UpdateObjectPropertyRespMsg: object expected");
                message.UpdateObjectPropertyRespMsg = $root.BasilServer.UpdateObjectPropertyResp.fromObject(object.UpdateObjectPropertyRespMsg);
            }
            if (object.UpdateInstancePropertyReqMsg != null) {
                if (typeof object.UpdateInstancePropertyReqMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.UpdateInstancePropertyReqMsg: object expected");
                message.UpdateInstancePropertyReqMsg = $root.BasilServer.UpdateInstancePropertyReq.fromObject(object.UpdateInstancePropertyReqMsg);
            }
            if (object.UpdateInstancePropertyRespMsg != null) {
                if (typeof object.UpdateInstancePropertyRespMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.UpdateInstancePropertyRespMsg: object expected");
                message.UpdateInstancePropertyRespMsg = $root.BasilServer.UpdateInstancePropertyResp.fromObject(object.UpdateInstancePropertyRespMsg);
            }
            if (object.UpdateInstancePositionReqMsg != null) {
                if (typeof object.UpdateInstancePositionReqMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.UpdateInstancePositionReqMsg: object expected");
                message.UpdateInstancePositionReqMsg = $root.BasilServer.UpdateInstancePositionReq.fromObject(object.UpdateInstancePositionReqMsg);
            }
            if (object.UpdateInstancePositionRespMsg != null) {
                if (typeof object.UpdateInstancePositionRespMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.UpdateInstancePositionRespMsg: object expected");
                message.UpdateInstancePositionRespMsg = $root.BasilServer.UpdateInstancePositionResp.fromObject(object.UpdateInstancePositionRespMsg);
            }
            if (object.RequestObjectPropertiesReqMsg != null) {
                if (typeof object.RequestObjectPropertiesReqMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.RequestObjectPropertiesReqMsg: object expected");
                message.RequestObjectPropertiesReqMsg = $root.BasilServer.RequestObjectPropertiesReq.fromObject(object.RequestObjectPropertiesReqMsg);
            }
            if (object.RequestObjectPropertiesRespMsg != null) {
                if (typeof object.RequestObjectPropertiesRespMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.RequestObjectPropertiesRespMsg: object expected");
                message.RequestObjectPropertiesRespMsg = $root.BasilServer.RequestObjectPropertiesResp.fromObject(object.RequestObjectPropertiesRespMsg);
            }
            if (object.RequestInstancePropertiesReqMsg != null) {
                if (typeof object.RequestInstancePropertiesReqMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.RequestInstancePropertiesReqMsg: object expected");
                message.RequestInstancePropertiesReqMsg = $root.BasilServer.RequestInstancePropertiesReq.fromObject(object.RequestInstancePropertiesReqMsg);
            }
            if (object.RequestInstancePropertiesRespMsg != null) {
                if (typeof object.RequestInstancePropertiesRespMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.RequestInstancePropertiesRespMsg: object expected");
                message.RequestInstancePropertiesRespMsg = $root.BasilServer.RequestInstancePropertiesResp.fromObject(object.RequestInstancePropertiesRespMsg);
            }
            if (object.OpenSessionReqMsg != null) {
                if (typeof object.OpenSessionReqMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.OpenSessionReqMsg: object expected");
                message.OpenSessionReqMsg = $root.BasilServer.OpenSessionReq.fromObject(object.OpenSessionReqMsg);
            }
            if (object.OpenSessionRespMsg != null) {
                if (typeof object.OpenSessionRespMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.OpenSessionRespMsg: object expected");
                message.OpenSessionRespMsg = $root.BasilServer.OpenSessionResp.fromObject(object.OpenSessionRespMsg);
            }
            if (object.CloseSessionReqMsg != null) {
                if (typeof object.CloseSessionReqMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.CloseSessionReqMsg: object expected");
                message.CloseSessionReqMsg = $root.BasilServer.CloseSessionReq.fromObject(object.CloseSessionReqMsg);
            }
            if (object.CloseSessionRespMsg != null) {
                if (typeof object.CloseSessionRespMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.CloseSessionRespMsg: object expected");
                message.CloseSessionRespMsg = $root.BasilServer.CloseSessionResp.fromObject(object.CloseSessionRespMsg);
            }
            if (object.AliveCheckReqMsg != null) {
                if (typeof object.AliveCheckReqMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.AliveCheckReqMsg: object expected");
                message.AliveCheckReqMsg = $root.BasilServer.AliveCheckReq.fromObject(object.AliveCheckReqMsg);
            }
            if (object.AliveCheckRespMsg != null) {
                if (typeof object.AliveCheckRespMsg !== "object")
                    throw TypeError(".BasilServer.BasilServerMessage.AliveCheckRespMsg: object expected");
                message.AliveCheckRespMsg = $root.BasilServer.AliveCheckResp.fromObject(object.AliveCheckRespMsg);
            }
            return message;
        };

        BasilServerMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (message.IdentifyDisplayableObjectReqMsg != null && message.hasOwnProperty("IdentifyDisplayableObjectReqMsg")) {
                object.IdentifyDisplayableObjectReqMsg = $root.BasilServer.IdentifyDisplayableObjectReq.toObject(message.IdentifyDisplayableObjectReqMsg, options);
                if (options.oneofs)
                    object.msg = "IdentifyDisplayableObjectReqMsg";
            }
            if (message.IdentifyDisplayableObjectRespMsg != null && message.hasOwnProperty("IdentifyDisplayableObjectRespMsg")) {
                object.IdentifyDisplayableObjectRespMsg = $root.BasilServer.IdentifyDisplayableObjectResp.toObject(message.IdentifyDisplayableObjectRespMsg, options);
                if (options.oneofs)
                    object.msg = "IdentifyDisplayableObjectRespMsg";
            }
            if (message.ForgetDisplayableObjectReqMsg != null && message.hasOwnProperty("ForgetDisplayableObjectReqMsg")) {
                object.ForgetDisplayableObjectReqMsg = $root.BasilServer.ForgetDisplayableObjectReq.toObject(message.ForgetDisplayableObjectReqMsg, options);
                if (options.oneofs)
                    object.msg = "ForgetDisplayableObjectReqMsg";
            }
            if (message.ForgetDisplayableObjectRespMsg != null && message.hasOwnProperty("ForgetDisplayableObjectRespMsg")) {
                object.ForgetDisplayableObjectRespMsg = $root.BasilServer.ForgetDisplayableObjectResp.toObject(message.ForgetDisplayableObjectRespMsg, options);
                if (options.oneofs)
                    object.msg = "ForgetDisplayableObjectRespMsg";
            }
            if (message.CreateObjectInstanceReqMsg != null && message.hasOwnProperty("CreateObjectInstanceReqMsg")) {
                object.CreateObjectInstanceReqMsg = $root.BasilServer.CreateObjectInstanceReq.toObject(message.CreateObjectInstanceReqMsg, options);
                if (options.oneofs)
                    object.msg = "CreateObjectInstanceReqMsg";
            }
            if (message.CreateObjectInstanceRespMsg != null && message.hasOwnProperty("CreateObjectInstanceRespMsg")) {
                object.CreateObjectInstanceRespMsg = $root.BasilServer.CreateObjectInstanceResp.toObject(message.CreateObjectInstanceRespMsg, options);
                if (options.oneofs)
                    object.msg = "CreateObjectInstanceRespMsg";
            }
            if (message.DeleteObjectInstanceReqMsg != null && message.hasOwnProperty("DeleteObjectInstanceReqMsg")) {
                object.DeleteObjectInstanceReqMsg = $root.BasilServer.DeleteObjectInstanceReq.toObject(message.DeleteObjectInstanceReqMsg, options);
                if (options.oneofs)
                    object.msg = "DeleteObjectInstanceReqMsg";
            }
            if (message.DeleteObjectInstanceRespMsg != null && message.hasOwnProperty("DeleteObjectInstanceRespMsg")) {
                object.DeleteObjectInstanceRespMsg = $root.BasilServer.DeleteObjectInstanceResp.toObject(message.DeleteObjectInstanceRespMsg, options);
                if (options.oneofs)
                    object.msg = "DeleteObjectInstanceRespMsg";
            }
            if (message.UpdateObjectPropertyReqMsg != null && message.hasOwnProperty("UpdateObjectPropertyReqMsg")) {
                object.UpdateObjectPropertyReqMsg = $root.BasilServer.UpdateObjectPropertyReq.toObject(message.UpdateObjectPropertyReqMsg, options);
                if (options.oneofs)
                    object.msg = "UpdateObjectPropertyReqMsg";
            }
            if (message.UpdateObjectPropertyRespMsg != null && message.hasOwnProperty("UpdateObjectPropertyRespMsg")) {
                object.UpdateObjectPropertyRespMsg = $root.BasilServer.UpdateObjectPropertyResp.toObject(message.UpdateObjectPropertyRespMsg, options);
                if (options.oneofs)
                    object.msg = "UpdateObjectPropertyRespMsg";
            }
            if (message.UpdateInstancePropertyReqMsg != null && message.hasOwnProperty("UpdateInstancePropertyReqMsg")) {
                object.UpdateInstancePropertyReqMsg = $root.BasilServer.UpdateInstancePropertyReq.toObject(message.UpdateInstancePropertyReqMsg, options);
                if (options.oneofs)
                    object.msg = "UpdateInstancePropertyReqMsg";
            }
            if (message.UpdateInstancePropertyRespMsg != null && message.hasOwnProperty("UpdateInstancePropertyRespMsg")) {
                object.UpdateInstancePropertyRespMsg = $root.BasilServer.UpdateInstancePropertyResp.toObject(message.UpdateInstancePropertyRespMsg, options);
                if (options.oneofs)
                    object.msg = "UpdateInstancePropertyRespMsg";
            }
            if (message.UpdateInstancePositionReqMsg != null && message.hasOwnProperty("UpdateInstancePositionReqMsg")) {
                object.UpdateInstancePositionReqMsg = $root.BasilServer.UpdateInstancePositionReq.toObject(message.UpdateInstancePositionReqMsg, options);
                if (options.oneofs)
                    object.msg = "UpdateInstancePositionReqMsg";
            }
            if (message.UpdateInstancePositionRespMsg != null && message.hasOwnProperty("UpdateInstancePositionRespMsg")) {
                object.UpdateInstancePositionRespMsg = $root.BasilServer.UpdateInstancePositionResp.toObject(message.UpdateInstancePositionRespMsg, options);
                if (options.oneofs)
                    object.msg = "UpdateInstancePositionRespMsg";
            }
            if (message.RequestObjectPropertiesReqMsg != null && message.hasOwnProperty("RequestObjectPropertiesReqMsg")) {
                object.RequestObjectPropertiesReqMsg = $root.BasilServer.RequestObjectPropertiesReq.toObject(message.RequestObjectPropertiesReqMsg, options);
                if (options.oneofs)
                    object.msg = "RequestObjectPropertiesReqMsg";
            }
            if (message.RequestObjectPropertiesRespMsg != null && message.hasOwnProperty("RequestObjectPropertiesRespMsg")) {
                object.RequestObjectPropertiesRespMsg = $root.BasilServer.RequestObjectPropertiesResp.toObject(message.RequestObjectPropertiesRespMsg, options);
                if (options.oneofs)
                    object.msg = "RequestObjectPropertiesRespMsg";
            }
            if (message.RequestInstancePropertiesReqMsg != null && message.hasOwnProperty("RequestInstancePropertiesReqMsg")) {
                object.RequestInstancePropertiesReqMsg = $root.BasilServer.RequestInstancePropertiesReq.toObject(message.RequestInstancePropertiesReqMsg, options);
                if (options.oneofs)
                    object.msg = "RequestInstancePropertiesReqMsg";
            }
            if (message.RequestInstancePropertiesRespMsg != null && message.hasOwnProperty("RequestInstancePropertiesRespMsg")) {
                object.RequestInstancePropertiesRespMsg = $root.BasilServer.RequestInstancePropertiesResp.toObject(message.RequestInstancePropertiesRespMsg, options);
                if (options.oneofs)
                    object.msg = "RequestInstancePropertiesRespMsg";
            }
            if (message.OpenSessionReqMsg != null && message.hasOwnProperty("OpenSessionReqMsg")) {
                object.OpenSessionReqMsg = $root.BasilServer.OpenSessionReq.toObject(message.OpenSessionReqMsg, options);
                if (options.oneofs)
                    object.msg = "OpenSessionReqMsg";
            }
            if (message.OpenSessionRespMsg != null && message.hasOwnProperty("OpenSessionRespMsg")) {
                object.OpenSessionRespMsg = $root.BasilServer.OpenSessionResp.toObject(message.OpenSessionRespMsg, options);
                if (options.oneofs)
                    object.msg = "OpenSessionRespMsg";
            }
            if (message.CloseSessionReqMsg != null && message.hasOwnProperty("CloseSessionReqMsg")) {
                object.CloseSessionReqMsg = $root.BasilServer.CloseSessionReq.toObject(message.CloseSessionReqMsg, options);
                if (options.oneofs)
                    object.msg = "CloseSessionReqMsg";
            }
            if (message.CloseSessionRespMsg != null && message.hasOwnProperty("CloseSessionRespMsg")) {
                object.CloseSessionRespMsg = $root.BasilServer.CloseSessionResp.toObject(message.CloseSessionRespMsg, options);
                if (options.oneofs)
                    object.msg = "CloseSessionRespMsg";
            }
            if (message.AliveCheckReqMsg != null && message.hasOwnProperty("AliveCheckReqMsg")) {
                object.AliveCheckReqMsg = $root.BasilServer.AliveCheckReq.toObject(message.AliveCheckReqMsg, options);
                if (options.oneofs)
                    object.msg = "AliveCheckReqMsg";
            }
            if (message.AliveCheckRespMsg != null && message.hasOwnProperty("AliveCheckRespMsg")) {
                object.AliveCheckRespMsg = $root.BasilServer.AliveCheckResp.toObject(message.AliveCheckRespMsg, options);
                if (options.oneofs)
                    object.msg = "AliveCheckRespMsg";
            }
            return object;
        };

        BasilServerMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BasilServerMessage;
    })();

    BasilServer.BasilServer = (function() {

        function BasilServer(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (BasilServer.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = BasilServer;

        BasilServer.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };


        BasilServer.prototype.identifyDisplayableObject = function identifyDisplayableObject(request, callback) {
            return this.rpcCall(identifyDisplayableObject, $root.BasilServer.IdentifyDisplayableObjectReq, $root.BasilServer.IdentifyDisplayableObjectResp, request, callback);
        };


        BasilServer.prototype.createObjectInstance = function createObjectInstance(request, callback) {
            return this.rpcCall(createObjectInstance, $root.BasilServer.CreateObjectInstanceReq, $root.BasilServer.CreateObjectInstanceResp, request, callback);
        };


        BasilServer.prototype.updateObjectProperty = function updateObjectProperty(request, callback) {
            return this.rpcCall(updateObjectProperty, $root.BasilServer.UpdateObjectPropertyReq, $root.BasilServer.UpdateObjectPropertyResp, request, callback);
        };


        BasilServer.prototype.updateInstanceProperty = function updateInstanceProperty(request, callback) {
            return this.rpcCall(updateInstanceProperty, $root.BasilServer.UpdateInstancePropertyReq, $root.BasilServer.UpdateInstancePropertyResp, request, callback);
        };


        BasilServer.prototype.updateInstancePosition = function updateInstancePosition(request, callback) {
            return this.rpcCall(updateInstancePosition, $root.BasilServer.UpdateInstancePositionReq, $root.BasilServer.UpdateInstancePositionResp, request, callback);
        };


        BasilServer.prototype.requestObjectProperties = function requestObjectProperties(request, callback) {
            return this.rpcCall(requestObjectProperties, $root.BasilServer.RequestObjectPropertiesReq, $root.BasilServer.RequestObjectPropertiesResp, request, callback);
        };


        BasilServer.prototype.requestInstanceProperties = function requestInstanceProperties(request, callback) {
            return this.rpcCall(requestInstanceProperties, $root.BasilServer.RequestInstancePropertiesReq, $root.BasilServer.RequestInstancePropertiesResp, request, callback);
        };


        BasilServer.prototype.openSession = function openSession(request, callback) {
            return this.rpcCall(openSession, $root.BasilServer.OpenSessionReq, $root.BasilServer.OpenSessionResp, request, callback);
        };


        BasilServer.prototype.closeSession = function closeSession(request, callback) {
            return this.rpcCall(closeSession, $root.BasilServer.CloseSessionReq, $root.BasilServer.CloseSessionResp, request, callback);
        };


        BasilServer.prototype.aliveCheck = function aliveCheck(request, callback) {
            return this.rpcCall(aliveCheck, $root.BasilServer.AliveCheckReq, $root.BasilServer.AliveCheckResp, request, callback);
        };

        return BasilServer;
    })();

    return BasilServer;
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

        Vector3.prototype.X = 0;
        Vector3.prototype.Y = 0;
        Vector3.prototype.Z = 0;

        Vector3.create = function create(properties) {
            return new Vector3(properties);
        };

        Vector3.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.X != null && message.hasOwnProperty("X"))
                writer.uint32(9).double(message.X);
            if (message.Y != null && message.hasOwnProperty("Y"))
                writer.uint32(17).double(message.Y);
            if (message.Z != null && message.hasOwnProperty("Z"))
                writer.uint32(25).double(message.Z);
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
                    message.X = reader.double();
                    break;
                case 2:
                    message.Y = reader.double();
                    break;
                case 3:
                    message.Z = reader.double();
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
            if (message.X != null && message.hasOwnProperty("X"))
                if (typeof message.X !== "number")
                    return "X: number expected";
            if (message.Y != null && message.hasOwnProperty("Y"))
                if (typeof message.Y !== "number")
                    return "Y: number expected";
            if (message.Z != null && message.hasOwnProperty("Z"))
                if (typeof message.Z !== "number")
                    return "Z: number expected";
            return null;
        };

        Vector3.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.Vector3)
                return object;
            let message = new $root.BasilType.Vector3();
            if (object.X != null)
                message.X = Number(object.X);
            if (object.Y != null)
                message.Y = Number(object.Y);
            if (object.Z != null)
                message.Z = Number(object.Z);
            return message;
        };

        Vector3.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.X = 0;
                object.Y = 0;
                object.Z = 0;
            }
            if (message.X != null && message.hasOwnProperty("X"))
                object.X = options.json && !isFinite(message.X) ? String(message.X) : message.X;
            if (message.Y != null && message.hasOwnProperty("Y"))
                object.Y = options.json && !isFinite(message.Y) ? String(message.Y) : message.Y;
            if (message.Z != null && message.hasOwnProperty("Z"))
                object.Z = options.json && !isFinite(message.Z) ? String(message.Z) : message.Z;
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

        Quaternion.prototype.X = 0;
        Quaternion.prototype.Y = 0;
        Quaternion.prototype.Z = 0;
        Quaternion.prototype.W = 0;

        Quaternion.create = function create(properties) {
            return new Quaternion(properties);
        };

        Quaternion.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.X != null && message.hasOwnProperty("X"))
                writer.uint32(9).double(message.X);
            if (message.Y != null && message.hasOwnProperty("Y"))
                writer.uint32(17).double(message.Y);
            if (message.Z != null && message.hasOwnProperty("Z"))
                writer.uint32(25).double(message.Z);
            if (message.W != null && message.hasOwnProperty("W"))
                writer.uint32(33).double(message.W);
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
                    message.X = reader.double();
                    break;
                case 2:
                    message.Y = reader.double();
                    break;
                case 3:
                    message.Z = reader.double();
                    break;
                case 4:
                    message.W = reader.double();
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
            if (message.X != null && message.hasOwnProperty("X"))
                if (typeof message.X !== "number")
                    return "X: number expected";
            if (message.Y != null && message.hasOwnProperty("Y"))
                if (typeof message.Y !== "number")
                    return "Y: number expected";
            if (message.Z != null && message.hasOwnProperty("Z"))
                if (typeof message.Z !== "number")
                    return "Z: number expected";
            if (message.W != null && message.hasOwnProperty("W"))
                if (typeof message.W !== "number")
                    return "W: number expected";
            return null;
        };

        Quaternion.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.Quaternion)
                return object;
            let message = new $root.BasilType.Quaternion();
            if (object.X != null)
                message.X = Number(object.X);
            if (object.Y != null)
                message.Y = Number(object.Y);
            if (object.Z != null)
                message.Z = Number(object.Z);
            if (object.W != null)
                message.W = Number(object.W);
            return message;
        };

        Quaternion.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.X = 0;
                object.Y = 0;
                object.Z = 0;
                object.W = 0;
            }
            if (message.X != null && message.hasOwnProperty("X"))
                object.X = options.json && !isFinite(message.X) ? String(message.X) : message.X;
            if (message.Y != null && message.hasOwnProperty("Y"))
                object.Y = options.json && !isFinite(message.Y) ? String(message.Y) : message.Y;
            if (message.Z != null && message.hasOwnProperty("Z"))
                object.Z = options.json && !isFinite(message.Z) ? String(message.Z) : message.Z;
            if (message.W != null && message.hasOwnProperty("W"))
                object.W = options.json && !isFinite(message.W) ? String(message.W) : message.W;
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

    BasilType.PropertyList = (function() {

        function PropertyList(properties) {
            this.list = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        PropertyList.prototype.list = $util.emptyObject;

        PropertyList.create = function create(properties) {
            return new PropertyList(properties);
        };

        PropertyList.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.list != null && message.hasOwnProperty("list"))
                for (let keys = Object.keys(message.list), i = 0; i < keys.length; ++i)
                    writer.uint32(10).fork().uint32(10).string(keys[i]).uint32(18).string(message.list[keys[i]]).ldelim();
            return writer;
        };

        PropertyList.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        PropertyList.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilType.PropertyList(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    reader.skip().pos++;
                    if (message.list === $util.emptyObject)
                        message.list = {};
                    key = reader.string();
                    reader.pos++;
                    message.list[key] = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        PropertyList.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        PropertyList.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.list != null && message.hasOwnProperty("list")) {
                if (!$util.isObject(message.list))
                    return "list: object expected";
                let key = Object.keys(message.list);
                for (let i = 0; i < key.length; ++i)
                    if (!$util.isString(message.list[key[i]]))
                        return "list: string{k:string} expected";
            }
            return null;
        };

        PropertyList.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.PropertyList)
                return object;
            let message = new $root.BasilType.PropertyList();
            if (object.list) {
                if (typeof object.list !== "object")
                    throw TypeError(".BasilType.PropertyList.list: object expected");
                message.list = {};
                for (let keys = Object.keys(object.list), i = 0; i < keys.length; ++i)
                    message.list[keys[i]] = String(object.list[keys[i]]);
            }
            return message;
        };

        PropertyList.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.list = {};
            let keys2;
            if (message.list && (keys2 = Object.keys(message.list)).length) {
                object.list = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.list[keys2[j]] = message.list[keys2[j]];
            }
            return object;
        };

        PropertyList.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PropertyList;
    })();

    BasilType.BasilException = (function() {

        function BasilException(properties) {
            this.hints = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        BasilException.prototype.reason = 0;
        BasilException.prototype.hints = $util.emptyObject;

        BasilException.create = function create(properties) {
            return new BasilException(properties);
        };

        BasilException.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.reason != null && message.hasOwnProperty("reason"))
                writer.uint32(8).int32(message.reason);
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
                    message.reason = reader.int32();
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
                if (!$util.isInteger(message.reason))
                    return "reason: integer expected";
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
                message.reason = object.reason | 0;
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
                object.reason = 0;
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

        InstanceIdentifier.prototype.id = 0;

        InstanceIdentifier.create = function create(properties) {
            return new InstanceIdentifier(properties);
        };

        InstanceIdentifier.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && message.hasOwnProperty("id"))
                writer.uint32(8).sint32(message.id);
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
                    message.id = reader.sint32();
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
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            return null;
        };

        InstanceIdentifier.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.InstanceIdentifier)
                return object;
            let message = new $root.BasilType.InstanceIdentifier();
            if (object.id != null)
                message.id = object.id | 0;
            return message;
        };

        InstanceIdentifier.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.id = 0;
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

    BasilType.ObjectDisplayInfo = (function() {

        function ObjectDisplayInfo(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        ObjectDisplayInfo.prototype.aabb = null;

        ObjectDisplayInfo.create = function create(properties) {
            return new ObjectDisplayInfo(properties);
        };

        ObjectDisplayInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.aabb != null && message.hasOwnProperty("aabb"))
                $root.BasilType.AaBoundingBox.encode(message.aabb, writer.uint32(10).fork()).ldelim();
            return writer;
        };

        ObjectDisplayInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        ObjectDisplayInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilType.ObjectDisplayInfo();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.aabb = $root.BasilType.AaBoundingBox.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        ObjectDisplayInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        ObjectDisplayInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.aabb != null && message.hasOwnProperty("aabb")) {
                let error = $root.BasilType.AaBoundingBox.verify(message.aabb);
                if (error)
                    return "aabb." + error;
            }
            return null;
        };

        ObjectDisplayInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.ObjectDisplayInfo)
                return object;
            let message = new $root.BasilType.ObjectDisplayInfo();
            if (object.aabb != null) {
                if (typeof object.aabb !== "object")
                    throw TypeError(".BasilType.ObjectDisplayInfo.aabb: object expected");
                message.aabb = $root.BasilType.AaBoundingBox.fromObject(object.aabb);
            }
            return message;
        };

        ObjectDisplayInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.aabb = null;
            if (message.aabb != null && message.hasOwnProperty("aabb"))
                object.aabb = $root.BasilType.AaBoundingBox.toObject(message.aabb, options);
            return object;
        };

        ObjectDisplayInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ObjectDisplayInfo;
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
                $root.BasilType.ObjectDisplayInfo.encode(message.displayInfo, writer.uint32(18).fork()).ldelim();
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
                    message.displayInfo = $root.BasilType.ObjectDisplayInfo.decode(reader, reader.uint32());
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
                let error = $root.BasilType.ObjectDisplayInfo.verify(message.displayInfo);
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
                message.displayInfo = $root.BasilType.ObjectDisplayInfo.fromObject(object.displayInfo);
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
                object.displayInfo = $root.BasilType.ObjectDisplayInfo.toObject(message.displayInfo, options);
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
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        AccessAuthorization.prototype.accessProperties = null;

        AccessAuthorization.create = function create(properties) {
            return new AccessAuthorization(properties);
        };

        AccessAuthorization.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.accessProperties != null && message.hasOwnProperty("accessProperties"))
                $root.BasilType.PropertyList.encode(message.accessProperties, writer.uint32(10).fork()).ldelim();
            return writer;
        };

        AccessAuthorization.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        AccessAuthorization.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BasilType.AccessAuthorization();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.accessProperties = $root.BasilType.PropertyList.decode(reader, reader.uint32());
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
                let error = $root.BasilType.PropertyList.verify(message.accessProperties);
                if (error)
                    return "accessProperties." + error;
            }
            return null;
        };

        AccessAuthorization.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.AccessAuthorization)
                return object;
            let message = new $root.BasilType.AccessAuthorization();
            if (object.accessProperties != null) {
                if (typeof object.accessProperties !== "object")
                    throw TypeError(".BasilType.AccessAuthorization.accessProperties: object expected");
                message.accessProperties = $root.BasilType.PropertyList.fromObject(object.accessProperties);
            }
            return message;
        };

        AccessAuthorization.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.accessProperties = null;
            if (message.accessProperties != null && message.hasOwnProperty("accessProperties"))
                object.accessProperties = $root.BasilType.PropertyList.toObject(message.accessProperties, options);
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

export const BTransport = $root.BTransport = (() => {

    const BTransport = {};

    BTransport.BTransport = (function() {

        function BTransport(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        BTransport.prototype.sequenceNum = 0;
        BTransport.prototype.stream = 0;
        BTransport.prototype.queueTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        BTransport.prototype.sendTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        BTransport.prototype.requestSession = 0;
        BTransport.prototype.traceID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        BTransport.prototype.parentSpanID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        BTransport.prototype.spanID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        BTransport.prototype.sampled = false;
        BTransport.prototype.message = $util.newBuffer([]);

        BTransport.create = function create(properties) {
            return new BTransport(properties);
        };

        BTransport.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sequenceNum != null && message.hasOwnProperty("sequenceNum"))
                writer.uint32(8).uint32(message.sequenceNum);
            if (message.stream != null && message.hasOwnProperty("stream"))
                writer.uint32(16).uint32(message.stream);
            if (message.queueTime != null && message.hasOwnProperty("queueTime"))
                writer.uint32(24).uint64(message.queueTime);
            if (message.sendTime != null && message.hasOwnProperty("sendTime"))
                writer.uint32(32).uint64(message.sendTime);
            if (message.requestSession != null && message.hasOwnProperty("requestSession"))
                writer.uint32(40).uint32(message.requestSession);
            if (message.traceID != null && message.hasOwnProperty("traceID"))
                writer.uint32(64).uint64(message.traceID);
            if (message.parentSpanID != null && message.hasOwnProperty("parentSpanID"))
                writer.uint32(72).uint64(message.parentSpanID);
            if (message.spanID != null && message.hasOwnProperty("spanID"))
                writer.uint32(80).uint64(message.spanID);
            if (message.sampled != null && message.hasOwnProperty("sampled"))
                writer.uint32(88).bool(message.sampled);
            if (message.message != null && message.hasOwnProperty("message"))
                writer.uint32(122).bytes(message.message);
            return writer;
        };

        BTransport.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        BTransport.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.BTransport.BTransport();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.sequenceNum = reader.uint32();
                    break;
                case 2:
                    message.stream = reader.uint32();
                    break;
                case 3:
                    message.queueTime = reader.uint64();
                    break;
                case 4:
                    message.sendTime = reader.uint64();
                    break;
                case 5:
                    message.requestSession = reader.uint32();
                    break;
                case 8:
                    message.traceID = reader.uint64();
                    break;
                case 9:
                    message.parentSpanID = reader.uint64();
                    break;
                case 10:
                    message.spanID = reader.uint64();
                    break;
                case 11:
                    message.sampled = reader.bool();
                    break;
                case 15:
                    message.message = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        BTransport.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        BTransport.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.sequenceNum != null && message.hasOwnProperty("sequenceNum"))
                if (!$util.isInteger(message.sequenceNum))
                    return "sequenceNum: integer expected";
            if (message.stream != null && message.hasOwnProperty("stream"))
                if (!$util.isInteger(message.stream))
                    return "stream: integer expected";
            if (message.queueTime != null && message.hasOwnProperty("queueTime"))
                if (!$util.isInteger(message.queueTime) && !(message.queueTime && $util.isInteger(message.queueTime.low) && $util.isInteger(message.queueTime.high)))
                    return "queueTime: integer|Long expected";
            if (message.sendTime != null && message.hasOwnProperty("sendTime"))
                if (!$util.isInteger(message.sendTime) && !(message.sendTime && $util.isInteger(message.sendTime.low) && $util.isInteger(message.sendTime.high)))
                    return "sendTime: integer|Long expected";
            if (message.requestSession != null && message.hasOwnProperty("requestSession"))
                if (!$util.isInteger(message.requestSession))
                    return "requestSession: integer expected";
            if (message.traceID != null && message.hasOwnProperty("traceID"))
                if (!$util.isInteger(message.traceID) && !(message.traceID && $util.isInteger(message.traceID.low) && $util.isInteger(message.traceID.high)))
                    return "traceID: integer|Long expected";
            if (message.parentSpanID != null && message.hasOwnProperty("parentSpanID"))
                if (!$util.isInteger(message.parentSpanID) && !(message.parentSpanID && $util.isInteger(message.parentSpanID.low) && $util.isInteger(message.parentSpanID.high)))
                    return "parentSpanID: integer|Long expected";
            if (message.spanID != null && message.hasOwnProperty("spanID"))
                if (!$util.isInteger(message.spanID) && !(message.spanID && $util.isInteger(message.spanID.low) && $util.isInteger(message.spanID.high)))
                    return "spanID: integer|Long expected";
            if (message.sampled != null && message.hasOwnProperty("sampled"))
                if (typeof message.sampled !== "boolean")
                    return "sampled: boolean expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!(message.message && typeof message.message.length === "number" || $util.isString(message.message)))
                    return "message: buffer expected";
            return null;
        };

        BTransport.fromObject = function fromObject(object) {
            if (object instanceof $root.BTransport.BTransport)
                return object;
            let message = new $root.BTransport.BTransport();
            if (object.sequenceNum != null)
                message.sequenceNum = object.sequenceNum >>> 0;
            if (object.stream != null)
                message.stream = object.stream >>> 0;
            if (object.queueTime != null)
                if ($util.Long)
                    (message.queueTime = $util.Long.fromValue(object.queueTime)).unsigned = true;
                else if (typeof object.queueTime === "string")
                    message.queueTime = parseInt(object.queueTime, 10);
                else if (typeof object.queueTime === "number")
                    message.queueTime = object.queueTime;
                else if (typeof object.queueTime === "object")
                    message.queueTime = new $util.LongBits(object.queueTime.low >>> 0, object.queueTime.high >>> 0).toNumber(true);
            if (object.sendTime != null)
                if ($util.Long)
                    (message.sendTime = $util.Long.fromValue(object.sendTime)).unsigned = true;
                else if (typeof object.sendTime === "string")
                    message.sendTime = parseInt(object.sendTime, 10);
                else if (typeof object.sendTime === "number")
                    message.sendTime = object.sendTime;
                else if (typeof object.sendTime === "object")
                    message.sendTime = new $util.LongBits(object.sendTime.low >>> 0, object.sendTime.high >>> 0).toNumber(true);
            if (object.requestSession != null)
                message.requestSession = object.requestSession >>> 0;
            if (object.traceID != null)
                if ($util.Long)
                    (message.traceID = $util.Long.fromValue(object.traceID)).unsigned = true;
                else if (typeof object.traceID === "string")
                    message.traceID = parseInt(object.traceID, 10);
                else if (typeof object.traceID === "number")
                    message.traceID = object.traceID;
                else if (typeof object.traceID === "object")
                    message.traceID = new $util.LongBits(object.traceID.low >>> 0, object.traceID.high >>> 0).toNumber(true);
            if (object.parentSpanID != null)
                if ($util.Long)
                    (message.parentSpanID = $util.Long.fromValue(object.parentSpanID)).unsigned = true;
                else if (typeof object.parentSpanID === "string")
                    message.parentSpanID = parseInt(object.parentSpanID, 10);
                else if (typeof object.parentSpanID === "number")
                    message.parentSpanID = object.parentSpanID;
                else if (typeof object.parentSpanID === "object")
                    message.parentSpanID = new $util.LongBits(object.parentSpanID.low >>> 0, object.parentSpanID.high >>> 0).toNumber(true);
            if (object.spanID != null)
                if ($util.Long)
                    (message.spanID = $util.Long.fromValue(object.spanID)).unsigned = true;
                else if (typeof object.spanID === "string")
                    message.spanID = parseInt(object.spanID, 10);
                else if (typeof object.spanID === "number")
                    message.spanID = object.spanID;
                else if (typeof object.spanID === "object")
                    message.spanID = new $util.LongBits(object.spanID.low >>> 0, object.spanID.high >>> 0).toNumber(true);
            if (object.sampled != null)
                message.sampled = Boolean(object.sampled);
            if (object.message != null)
                if (typeof object.message === "string")
                    $util.base64.decode(object.message, message.message = $util.newBuffer($util.base64.length(object.message)), 0);
                else if (object.message.length)
                    message.message = object.message;
            return message;
        };

        BTransport.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.sequenceNum = 0;
                object.stream = 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.queueTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.queueTime = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.sendTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.sendTime = options.longs === String ? "0" : 0;
                object.requestSession = 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.traceID = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.traceID = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.parentSpanID = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.parentSpanID = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.spanID = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.spanID = options.longs === String ? "0" : 0;
                object.sampled = false;
                object.message = options.bytes === String ? "" : [];
            }
            if (message.sequenceNum != null && message.hasOwnProperty("sequenceNum"))
                object.sequenceNum = message.sequenceNum;
            if (message.stream != null && message.hasOwnProperty("stream"))
                object.stream = message.stream;
            if (message.queueTime != null && message.hasOwnProperty("queueTime"))
                if (typeof message.queueTime === "number")
                    object.queueTime = options.longs === String ? String(message.queueTime) : message.queueTime;
                else
                    object.queueTime = options.longs === String ? $util.Long.prototype.toString.call(message.queueTime) : options.longs === Number ? new $util.LongBits(message.queueTime.low >>> 0, message.queueTime.high >>> 0).toNumber(true) : message.queueTime;
            if (message.sendTime != null && message.hasOwnProperty("sendTime"))
                if (typeof message.sendTime === "number")
                    object.sendTime = options.longs === String ? String(message.sendTime) : message.sendTime;
                else
                    object.sendTime = options.longs === String ? $util.Long.prototype.toString.call(message.sendTime) : options.longs === Number ? new $util.LongBits(message.sendTime.low >>> 0, message.sendTime.high >>> 0).toNumber(true) : message.sendTime;
            if (message.requestSession != null && message.hasOwnProperty("requestSession"))
                object.requestSession = message.requestSession;
            if (message.traceID != null && message.hasOwnProperty("traceID"))
                if (typeof message.traceID === "number")
                    object.traceID = options.longs === String ? String(message.traceID) : message.traceID;
                else
                    object.traceID = options.longs === String ? $util.Long.prototype.toString.call(message.traceID) : options.longs === Number ? new $util.LongBits(message.traceID.low >>> 0, message.traceID.high >>> 0).toNumber(true) : message.traceID;
            if (message.parentSpanID != null && message.hasOwnProperty("parentSpanID"))
                if (typeof message.parentSpanID === "number")
                    object.parentSpanID = options.longs === String ? String(message.parentSpanID) : message.parentSpanID;
                else
                    object.parentSpanID = options.longs === String ? $util.Long.prototype.toString.call(message.parentSpanID) : options.longs === Number ? new $util.LongBits(message.parentSpanID.low >>> 0, message.parentSpanID.high >>> 0).toNumber(true) : message.parentSpanID;
            if (message.spanID != null && message.hasOwnProperty("spanID"))
                if (typeof message.spanID === "number")
                    object.spanID = options.longs === String ? String(message.spanID) : message.spanID;
                else
                    object.spanID = options.longs === String ? $util.Long.prototype.toString.call(message.spanID) : options.longs === Number ? new $util.LongBits(message.spanID.low >>> 0, message.spanID.high >>> 0).toNumber(true) : message.spanID;
            if (message.sampled != null && message.hasOwnProperty("sampled"))
                object.sampled = message.sampled;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = options.bytes === String ? $util.base64.encode(message.message, 0, message.message.length) : options.bytes === Array ? Array.prototype.slice.call(message.message) : message.message;
            return object;
        };

        BTransport.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BTransport;
    })();

    return BTransport;
})();

export { $root as default };
