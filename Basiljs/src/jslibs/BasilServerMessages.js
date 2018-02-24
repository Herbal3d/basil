/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const Basil = $root.Basil = (() => {

    /**
     * Namespace Basil.
     * @exports Basil
     * @namespace
     */
    const Basil = {};

    Basil.IdentifyDisplayableObjectReq = (function() {

        /**
         * Properties of an IdentifyDisplayableObjectReq.
         * @memberof Basil
         * @interface IIdentifyDisplayableObjectReq
         * @property {BasilType.IAccessAuthorization|null} [auth] IdentifyDisplayableObjectReq auth
         * @property {BasilType.ITraceInfo|null} [trace] IdentifyDisplayableObjectReq trace
         * @property {BasilType.IObjectIdentifier|null} [id] IdentifyDisplayableObjectReq id
         * @property {BasilType.IAssetInformation|null} [assetInfo] IdentifyDisplayableObjectReq assetInfo
         * @property {BasilType.IAaBoundingBox|null} [aabb] IdentifyDisplayableObjectReq aabb
         */

        /**
         * Constructs a new IdentifyDisplayableObjectReq.
         * @memberof Basil
         * @classdesc Represents an IdentifyDisplayableObjectReq.
         * @implements IIdentifyDisplayableObjectReq
         * @constructor
         * @param {Basil.IIdentifyDisplayableObjectReq=} [properties] Properties to set
         */
        function IdentifyDisplayableObjectReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * IdentifyDisplayableObjectReq auth.
         * @member {BasilType.IAccessAuthorization|null|undefined} auth
         * @memberof Basil.IdentifyDisplayableObjectReq
         * @instance
         */
        IdentifyDisplayableObjectReq.prototype.auth = null;

        /**
         * IdentifyDisplayableObjectReq trace.
         * @member {BasilType.ITraceInfo|null|undefined} trace
         * @memberof Basil.IdentifyDisplayableObjectReq
         * @instance
         */
        IdentifyDisplayableObjectReq.prototype.trace = null;

        /**
         * IdentifyDisplayableObjectReq id.
         * @member {BasilType.IObjectIdentifier|null|undefined} id
         * @memberof Basil.IdentifyDisplayableObjectReq
         * @instance
         */
        IdentifyDisplayableObjectReq.prototype.id = null;

        /**
         * IdentifyDisplayableObjectReq assetInfo.
         * @member {BasilType.IAssetInformation|null|undefined} assetInfo
         * @memberof Basil.IdentifyDisplayableObjectReq
         * @instance
         */
        IdentifyDisplayableObjectReq.prototype.assetInfo = null;

        /**
         * IdentifyDisplayableObjectReq aabb.
         * @member {BasilType.IAaBoundingBox|null|undefined} aabb
         * @memberof Basil.IdentifyDisplayableObjectReq
         * @instance
         */
        IdentifyDisplayableObjectReq.prototype.aabb = null;

        /**
         * Creates a new IdentifyDisplayableObjectReq instance using the specified properties.
         * @function create
         * @memberof Basil.IdentifyDisplayableObjectReq
         * @static
         * @param {Basil.IIdentifyDisplayableObjectReq=} [properties] Properties to set
         * @returns {Basil.IdentifyDisplayableObjectReq} IdentifyDisplayableObjectReq instance
         */
        IdentifyDisplayableObjectReq.create = function create(properties) {
            return new IdentifyDisplayableObjectReq(properties);
        };

        /**
         * Encodes the specified IdentifyDisplayableObjectReq message. Does not implicitly {@link Basil.IdentifyDisplayableObjectReq.verify|verify} messages.
         * @function encode
         * @memberof Basil.IdentifyDisplayableObjectReq
         * @static
         * @param {Basil.IIdentifyDisplayableObjectReq} message IdentifyDisplayableObjectReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        IdentifyDisplayableObjectReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.trace != null && message.hasOwnProperty("trace"))
                $root.BasilType.TraceInfo.encode(message.trace, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.id != null && message.hasOwnProperty("id"))
                $root.BasilType.ObjectIdentifier.encode(message.id, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.assetInfo != null && message.hasOwnProperty("assetInfo"))
                $root.BasilType.AssetInformation.encode(message.assetInfo, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.aabb != null && message.hasOwnProperty("aabb"))
                $root.BasilType.AaBoundingBox.encode(message.aabb, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified IdentifyDisplayableObjectReq message, length delimited. Does not implicitly {@link Basil.IdentifyDisplayableObjectReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Basil.IdentifyDisplayableObjectReq
         * @static
         * @param {Basil.IIdentifyDisplayableObjectReq} message IdentifyDisplayableObjectReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        IdentifyDisplayableObjectReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an IdentifyDisplayableObjectReq message from the specified reader or buffer.
         * @function decode
         * @memberof Basil.IdentifyDisplayableObjectReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Basil.IdentifyDisplayableObjectReq} IdentifyDisplayableObjectReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        IdentifyDisplayableObjectReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Basil.IdentifyDisplayableObjectReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.trace = $root.BasilType.TraceInfo.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.id = $root.BasilType.ObjectIdentifier.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.assetInfo = $root.BasilType.AssetInformation.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.aabb = $root.BasilType.AaBoundingBox.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an IdentifyDisplayableObjectReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Basil.IdentifyDisplayableObjectReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Basil.IdentifyDisplayableObjectReq} IdentifyDisplayableObjectReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        IdentifyDisplayableObjectReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an IdentifyDisplayableObjectReq message.
         * @function verify
         * @memberof Basil.IdentifyDisplayableObjectReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        IdentifyDisplayableObjectReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.trace != null && message.hasOwnProperty("trace")) {
                let error = $root.BasilType.TraceInfo.verify(message.trace);
                if (error)
                    return "trace." + error;
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

        /**
         * Creates an IdentifyDisplayableObjectReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Basil.IdentifyDisplayableObjectReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Basil.IdentifyDisplayableObjectReq} IdentifyDisplayableObjectReq
         */
        IdentifyDisplayableObjectReq.fromObject = function fromObject(object) {
            if (object instanceof $root.Basil.IdentifyDisplayableObjectReq)
                return object;
            let message = new $root.Basil.IdentifyDisplayableObjectReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".Basil.IdentifyDisplayableObjectReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.trace != null) {
                if (typeof object.trace !== "object")
                    throw TypeError(".Basil.IdentifyDisplayableObjectReq.trace: object expected");
                message.trace = $root.BasilType.TraceInfo.fromObject(object.trace);
            }
            if (object.id != null) {
                if (typeof object.id !== "object")
                    throw TypeError(".Basil.IdentifyDisplayableObjectReq.id: object expected");
                message.id = $root.BasilType.ObjectIdentifier.fromObject(object.id);
            }
            if (object.assetInfo != null) {
                if (typeof object.assetInfo !== "object")
                    throw TypeError(".Basil.IdentifyDisplayableObjectReq.assetInfo: object expected");
                message.assetInfo = $root.BasilType.AssetInformation.fromObject(object.assetInfo);
            }
            if (object.aabb != null) {
                if (typeof object.aabb !== "object")
                    throw TypeError(".Basil.IdentifyDisplayableObjectReq.aabb: object expected");
                message.aabb = $root.BasilType.AaBoundingBox.fromObject(object.aabb);
            }
            return message;
        };

        /**
         * Creates a plain object from an IdentifyDisplayableObjectReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Basil.IdentifyDisplayableObjectReq
         * @static
         * @param {Basil.IdentifyDisplayableObjectReq} message IdentifyDisplayableObjectReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        IdentifyDisplayableObjectReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.trace = null;
                object.id = null;
                object.assetInfo = null;
                object.aabb = null;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.trace != null && message.hasOwnProperty("trace"))
                object.trace = $root.BasilType.TraceInfo.toObject(message.trace, options);
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = $root.BasilType.ObjectIdentifier.toObject(message.id, options);
            if (message.assetInfo != null && message.hasOwnProperty("assetInfo"))
                object.assetInfo = $root.BasilType.AssetInformation.toObject(message.assetInfo, options);
            if (message.aabb != null && message.hasOwnProperty("aabb"))
                object.aabb = $root.BasilType.AaBoundingBox.toObject(message.aabb, options);
            return object;
        };

        /**
         * Converts this IdentifyDisplayableObjectReq to JSON.
         * @function toJSON
         * @memberof Basil.IdentifyDisplayableObjectReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        IdentifyDisplayableObjectReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return IdentifyDisplayableObjectReq;
    })();

    Basil.IdentifyDisplayableObjectResp = (function() {

        /**
         * Properties of an IdentifyDisplayableObjectResp.
         * @memberof Basil
         * @interface IIdentifyDisplayableObjectResp
         * @property {BasilType.IBasilException|null} [success] IdentifyDisplayableObjectResp success
         */

        /**
         * Constructs a new IdentifyDisplayableObjectResp.
         * @memberof Basil
         * @classdesc Represents an IdentifyDisplayableObjectResp.
         * @implements IIdentifyDisplayableObjectResp
         * @constructor
         * @param {Basil.IIdentifyDisplayableObjectResp=} [properties] Properties to set
         */
        function IdentifyDisplayableObjectResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * IdentifyDisplayableObjectResp success.
         * @member {BasilType.IBasilException|null|undefined} success
         * @memberof Basil.IdentifyDisplayableObjectResp
         * @instance
         */
        IdentifyDisplayableObjectResp.prototype.success = null;

        /**
         * Creates a new IdentifyDisplayableObjectResp instance using the specified properties.
         * @function create
         * @memberof Basil.IdentifyDisplayableObjectResp
         * @static
         * @param {Basil.IIdentifyDisplayableObjectResp=} [properties] Properties to set
         * @returns {Basil.IdentifyDisplayableObjectResp} IdentifyDisplayableObjectResp instance
         */
        IdentifyDisplayableObjectResp.create = function create(properties) {
            return new IdentifyDisplayableObjectResp(properties);
        };

        /**
         * Encodes the specified IdentifyDisplayableObjectResp message. Does not implicitly {@link Basil.IdentifyDisplayableObjectResp.verify|verify} messages.
         * @function encode
         * @memberof Basil.IdentifyDisplayableObjectResp
         * @static
         * @param {Basil.IIdentifyDisplayableObjectResp} message IdentifyDisplayableObjectResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        IdentifyDisplayableObjectResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                $root.BasilType.BasilException.encode(message.success, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified IdentifyDisplayableObjectResp message, length delimited. Does not implicitly {@link Basil.IdentifyDisplayableObjectResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Basil.IdentifyDisplayableObjectResp
         * @static
         * @param {Basil.IIdentifyDisplayableObjectResp} message IdentifyDisplayableObjectResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        IdentifyDisplayableObjectResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an IdentifyDisplayableObjectResp message from the specified reader or buffer.
         * @function decode
         * @memberof Basil.IdentifyDisplayableObjectResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Basil.IdentifyDisplayableObjectResp} IdentifyDisplayableObjectResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        IdentifyDisplayableObjectResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Basil.IdentifyDisplayableObjectResp();
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

        /**
         * Decodes an IdentifyDisplayableObjectResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Basil.IdentifyDisplayableObjectResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Basil.IdentifyDisplayableObjectResp} IdentifyDisplayableObjectResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        IdentifyDisplayableObjectResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an IdentifyDisplayableObjectResp message.
         * @function verify
         * @memberof Basil.IdentifyDisplayableObjectResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
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

        /**
         * Creates an IdentifyDisplayableObjectResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Basil.IdentifyDisplayableObjectResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Basil.IdentifyDisplayableObjectResp} IdentifyDisplayableObjectResp
         */
        IdentifyDisplayableObjectResp.fromObject = function fromObject(object) {
            if (object instanceof $root.Basil.IdentifyDisplayableObjectResp)
                return object;
            let message = new $root.Basil.IdentifyDisplayableObjectResp();
            if (object.success != null) {
                if (typeof object.success !== "object")
                    throw TypeError(".Basil.IdentifyDisplayableObjectResp.success: object expected");
                message.success = $root.BasilType.BasilException.fromObject(object.success);
            }
            return message;
        };

        /**
         * Creates a plain object from an IdentifyDisplayableObjectResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Basil.IdentifyDisplayableObjectResp
         * @static
         * @param {Basil.IdentifyDisplayableObjectResp} message IdentifyDisplayableObjectResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this IdentifyDisplayableObjectResp to JSON.
         * @function toJSON
         * @memberof Basil.IdentifyDisplayableObjectResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        IdentifyDisplayableObjectResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return IdentifyDisplayableObjectResp;
    })();

    Basil.CreateObjectInstanceReq = (function() {

        /**
         * Properties of a CreateObjectInstanceReq.
         * @memberof Basil
         * @interface ICreateObjectInstanceReq
         * @property {BasilType.IAccessAuthorization|null} [auth] CreateObjectInstanceReq auth
         * @property {BasilType.ITraceInfo|null} [trace] CreateObjectInstanceReq trace
         * @property {BasilType.IObjectIdentifier|null} [id] CreateObjectInstanceReq id
         * @property {BasilType.IInstancePositionInfo|null} [pos] CreateObjectInstanceReq pos
         * @property {BasilType.IPropertyList|null} [propertiesToSet] CreateObjectInstanceReq propertiesToSet
         */

        /**
         * Constructs a new CreateObjectInstanceReq.
         * @memberof Basil
         * @classdesc Represents a CreateObjectInstanceReq.
         * @implements ICreateObjectInstanceReq
         * @constructor
         * @param {Basil.ICreateObjectInstanceReq=} [properties] Properties to set
         */
        function CreateObjectInstanceReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CreateObjectInstanceReq auth.
         * @member {BasilType.IAccessAuthorization|null|undefined} auth
         * @memberof Basil.CreateObjectInstanceReq
         * @instance
         */
        CreateObjectInstanceReq.prototype.auth = null;

        /**
         * CreateObjectInstanceReq trace.
         * @member {BasilType.ITraceInfo|null|undefined} trace
         * @memberof Basil.CreateObjectInstanceReq
         * @instance
         */
        CreateObjectInstanceReq.prototype.trace = null;

        /**
         * CreateObjectInstanceReq id.
         * @member {BasilType.IObjectIdentifier|null|undefined} id
         * @memberof Basil.CreateObjectInstanceReq
         * @instance
         */
        CreateObjectInstanceReq.prototype.id = null;

        /**
         * CreateObjectInstanceReq pos.
         * @member {BasilType.IInstancePositionInfo|null|undefined} pos
         * @memberof Basil.CreateObjectInstanceReq
         * @instance
         */
        CreateObjectInstanceReq.prototype.pos = null;

        /**
         * CreateObjectInstanceReq propertiesToSet.
         * @member {BasilType.IPropertyList|null|undefined} propertiesToSet
         * @memberof Basil.CreateObjectInstanceReq
         * @instance
         */
        CreateObjectInstanceReq.prototype.propertiesToSet = null;

        /**
         * Creates a new CreateObjectInstanceReq instance using the specified properties.
         * @function create
         * @memberof Basil.CreateObjectInstanceReq
         * @static
         * @param {Basil.ICreateObjectInstanceReq=} [properties] Properties to set
         * @returns {Basil.CreateObjectInstanceReq} CreateObjectInstanceReq instance
         */
        CreateObjectInstanceReq.create = function create(properties) {
            return new CreateObjectInstanceReq(properties);
        };

        /**
         * Encodes the specified CreateObjectInstanceReq message. Does not implicitly {@link Basil.CreateObjectInstanceReq.verify|verify} messages.
         * @function encode
         * @memberof Basil.CreateObjectInstanceReq
         * @static
         * @param {Basil.ICreateObjectInstanceReq} message CreateObjectInstanceReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateObjectInstanceReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.trace != null && message.hasOwnProperty("trace"))
                $root.BasilType.TraceInfo.encode(message.trace, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.id != null && message.hasOwnProperty("id"))
                $root.BasilType.ObjectIdentifier.encode(message.id, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.pos != null && message.hasOwnProperty("pos"))
                $root.BasilType.InstancePositionInfo.encode(message.pos, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.propertiesToSet != null && message.hasOwnProperty("propertiesToSet"))
                $root.BasilType.PropertyList.encode(message.propertiesToSet, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified CreateObjectInstanceReq message, length delimited. Does not implicitly {@link Basil.CreateObjectInstanceReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Basil.CreateObjectInstanceReq
         * @static
         * @param {Basil.ICreateObjectInstanceReq} message CreateObjectInstanceReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateObjectInstanceReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CreateObjectInstanceReq message from the specified reader or buffer.
         * @function decode
         * @memberof Basil.CreateObjectInstanceReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Basil.CreateObjectInstanceReq} CreateObjectInstanceReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateObjectInstanceReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Basil.CreateObjectInstanceReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.trace = $root.BasilType.TraceInfo.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.id = $root.BasilType.ObjectIdentifier.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.pos = $root.BasilType.InstancePositionInfo.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.propertiesToSet = $root.BasilType.PropertyList.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CreateObjectInstanceReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Basil.CreateObjectInstanceReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Basil.CreateObjectInstanceReq} CreateObjectInstanceReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateObjectInstanceReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateObjectInstanceReq message.
         * @function verify
         * @memberof Basil.CreateObjectInstanceReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CreateObjectInstanceReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.trace != null && message.hasOwnProperty("trace")) {
                let error = $root.BasilType.TraceInfo.verify(message.trace);
                if (error)
                    return "trace." + error;
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

        /**
         * Creates a CreateObjectInstanceReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Basil.CreateObjectInstanceReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Basil.CreateObjectInstanceReq} CreateObjectInstanceReq
         */
        CreateObjectInstanceReq.fromObject = function fromObject(object) {
            if (object instanceof $root.Basil.CreateObjectInstanceReq)
                return object;
            let message = new $root.Basil.CreateObjectInstanceReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".Basil.CreateObjectInstanceReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.trace != null) {
                if (typeof object.trace !== "object")
                    throw TypeError(".Basil.CreateObjectInstanceReq.trace: object expected");
                message.trace = $root.BasilType.TraceInfo.fromObject(object.trace);
            }
            if (object.id != null) {
                if (typeof object.id !== "object")
                    throw TypeError(".Basil.CreateObjectInstanceReq.id: object expected");
                message.id = $root.BasilType.ObjectIdentifier.fromObject(object.id);
            }
            if (object.pos != null) {
                if (typeof object.pos !== "object")
                    throw TypeError(".Basil.CreateObjectInstanceReq.pos: object expected");
                message.pos = $root.BasilType.InstancePositionInfo.fromObject(object.pos);
            }
            if (object.propertiesToSet != null) {
                if (typeof object.propertiesToSet !== "object")
                    throw TypeError(".Basil.CreateObjectInstanceReq.propertiesToSet: object expected");
                message.propertiesToSet = $root.BasilType.PropertyList.fromObject(object.propertiesToSet);
            }
            return message;
        };

        /**
         * Creates a plain object from a CreateObjectInstanceReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Basil.CreateObjectInstanceReq
         * @static
         * @param {Basil.CreateObjectInstanceReq} message CreateObjectInstanceReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CreateObjectInstanceReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.trace = null;
                object.id = null;
                object.pos = null;
                object.propertiesToSet = null;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.trace != null && message.hasOwnProperty("trace"))
                object.trace = $root.BasilType.TraceInfo.toObject(message.trace, options);
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = $root.BasilType.ObjectIdentifier.toObject(message.id, options);
            if (message.pos != null && message.hasOwnProperty("pos"))
                object.pos = $root.BasilType.InstancePositionInfo.toObject(message.pos, options);
            if (message.propertiesToSet != null && message.hasOwnProperty("propertiesToSet"))
                object.propertiesToSet = $root.BasilType.PropertyList.toObject(message.propertiesToSet, options);
            return object;
        };

        /**
         * Converts this CreateObjectInstanceReq to JSON.
         * @function toJSON
         * @memberof Basil.CreateObjectInstanceReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateObjectInstanceReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CreateObjectInstanceReq;
    })();

    Basil.CreateObjectInstanceResp = (function() {

        /**
         * Properties of a CreateObjectInstanceResp.
         * @memberof Basil
         * @interface ICreateObjectInstanceResp
         * @property {BasilType.IBasilException|null} [success] CreateObjectInstanceResp success
         * @property {BasilType.IInstanceIdentifier|null} [createInstanceId] CreateObjectInstanceResp createInstanceId
         */

        /**
         * Constructs a new CreateObjectInstanceResp.
         * @memberof Basil
         * @classdesc Represents a CreateObjectInstanceResp.
         * @implements ICreateObjectInstanceResp
         * @constructor
         * @param {Basil.ICreateObjectInstanceResp=} [properties] Properties to set
         */
        function CreateObjectInstanceResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CreateObjectInstanceResp success.
         * @member {BasilType.IBasilException|null|undefined} success
         * @memberof Basil.CreateObjectInstanceResp
         * @instance
         */
        CreateObjectInstanceResp.prototype.success = null;

        /**
         * CreateObjectInstanceResp createInstanceId.
         * @member {BasilType.IInstanceIdentifier|null|undefined} createInstanceId
         * @memberof Basil.CreateObjectInstanceResp
         * @instance
         */
        CreateObjectInstanceResp.prototype.createInstanceId = null;

        /**
         * Creates a new CreateObjectInstanceResp instance using the specified properties.
         * @function create
         * @memberof Basil.CreateObjectInstanceResp
         * @static
         * @param {Basil.ICreateObjectInstanceResp=} [properties] Properties to set
         * @returns {Basil.CreateObjectInstanceResp} CreateObjectInstanceResp instance
         */
        CreateObjectInstanceResp.create = function create(properties) {
            return new CreateObjectInstanceResp(properties);
        };

        /**
         * Encodes the specified CreateObjectInstanceResp message. Does not implicitly {@link Basil.CreateObjectInstanceResp.verify|verify} messages.
         * @function encode
         * @memberof Basil.CreateObjectInstanceResp
         * @static
         * @param {Basil.ICreateObjectInstanceResp} message CreateObjectInstanceResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateObjectInstanceResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                $root.BasilType.BasilException.encode(message.success, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.createInstanceId != null && message.hasOwnProperty("createInstanceId"))
                $root.BasilType.InstanceIdentifier.encode(message.createInstanceId, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified CreateObjectInstanceResp message, length delimited. Does not implicitly {@link Basil.CreateObjectInstanceResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Basil.CreateObjectInstanceResp
         * @static
         * @param {Basil.ICreateObjectInstanceResp} message CreateObjectInstanceResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateObjectInstanceResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CreateObjectInstanceResp message from the specified reader or buffer.
         * @function decode
         * @memberof Basil.CreateObjectInstanceResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Basil.CreateObjectInstanceResp} CreateObjectInstanceResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateObjectInstanceResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Basil.CreateObjectInstanceResp();
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

        /**
         * Decodes a CreateObjectInstanceResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Basil.CreateObjectInstanceResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Basil.CreateObjectInstanceResp} CreateObjectInstanceResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateObjectInstanceResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateObjectInstanceResp message.
         * @function verify
         * @memberof Basil.CreateObjectInstanceResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
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

        /**
         * Creates a CreateObjectInstanceResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Basil.CreateObjectInstanceResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Basil.CreateObjectInstanceResp} CreateObjectInstanceResp
         */
        CreateObjectInstanceResp.fromObject = function fromObject(object) {
            if (object instanceof $root.Basil.CreateObjectInstanceResp)
                return object;
            let message = new $root.Basil.CreateObjectInstanceResp();
            if (object.success != null) {
                if (typeof object.success !== "object")
                    throw TypeError(".Basil.CreateObjectInstanceResp.success: object expected");
                message.success = $root.BasilType.BasilException.fromObject(object.success);
            }
            if (object.createInstanceId != null) {
                if (typeof object.createInstanceId !== "object")
                    throw TypeError(".Basil.CreateObjectInstanceResp.createInstanceId: object expected");
                message.createInstanceId = $root.BasilType.InstanceIdentifier.fromObject(object.createInstanceId);
            }
            return message;
        };

        /**
         * Creates a plain object from a CreateObjectInstanceResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Basil.CreateObjectInstanceResp
         * @static
         * @param {Basil.CreateObjectInstanceResp} message CreateObjectInstanceResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this CreateObjectInstanceResp to JSON.
         * @function toJSON
         * @memberof Basil.CreateObjectInstanceResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateObjectInstanceResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CreateObjectInstanceResp;
    })();

    Basil.UpdateObjectPropertyReq = (function() {

        /**
         * Properties of an UpdateObjectPropertyReq.
         * @memberof Basil
         * @interface IUpdateObjectPropertyReq
         * @property {BasilType.IAccessAuthorization|null} [auth] UpdateObjectPropertyReq auth
         * @property {BasilType.ITraceInfo|null} [trace] UpdateObjectPropertyReq trace
         * @property {BasilType.IObjectIdentifier|null} [objectId] UpdateObjectPropertyReq objectId
         * @property {BasilType.IPropertyList|null} [props] UpdateObjectPropertyReq props
         */

        /**
         * Constructs a new UpdateObjectPropertyReq.
         * @memberof Basil
         * @classdesc Represents an UpdateObjectPropertyReq.
         * @implements IUpdateObjectPropertyReq
         * @constructor
         * @param {Basil.IUpdateObjectPropertyReq=} [properties] Properties to set
         */
        function UpdateObjectPropertyReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UpdateObjectPropertyReq auth.
         * @member {BasilType.IAccessAuthorization|null|undefined} auth
         * @memberof Basil.UpdateObjectPropertyReq
         * @instance
         */
        UpdateObjectPropertyReq.prototype.auth = null;

        /**
         * UpdateObjectPropertyReq trace.
         * @member {BasilType.ITraceInfo|null|undefined} trace
         * @memberof Basil.UpdateObjectPropertyReq
         * @instance
         */
        UpdateObjectPropertyReq.prototype.trace = null;

        /**
         * UpdateObjectPropertyReq objectId.
         * @member {BasilType.IObjectIdentifier|null|undefined} objectId
         * @memberof Basil.UpdateObjectPropertyReq
         * @instance
         */
        UpdateObjectPropertyReq.prototype.objectId = null;

        /**
         * UpdateObjectPropertyReq props.
         * @member {BasilType.IPropertyList|null|undefined} props
         * @memberof Basil.UpdateObjectPropertyReq
         * @instance
         */
        UpdateObjectPropertyReq.prototype.props = null;

        /**
         * Creates a new UpdateObjectPropertyReq instance using the specified properties.
         * @function create
         * @memberof Basil.UpdateObjectPropertyReq
         * @static
         * @param {Basil.IUpdateObjectPropertyReq=} [properties] Properties to set
         * @returns {Basil.UpdateObjectPropertyReq} UpdateObjectPropertyReq instance
         */
        UpdateObjectPropertyReq.create = function create(properties) {
            return new UpdateObjectPropertyReq(properties);
        };

        /**
         * Encodes the specified UpdateObjectPropertyReq message. Does not implicitly {@link Basil.UpdateObjectPropertyReq.verify|verify} messages.
         * @function encode
         * @memberof Basil.UpdateObjectPropertyReq
         * @static
         * @param {Basil.IUpdateObjectPropertyReq} message UpdateObjectPropertyReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateObjectPropertyReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.trace != null && message.hasOwnProperty("trace"))
                $root.BasilType.TraceInfo.encode(message.trace, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                $root.BasilType.ObjectIdentifier.encode(message.objectId, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.props != null && message.hasOwnProperty("props"))
                $root.BasilType.PropertyList.encode(message.props, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified UpdateObjectPropertyReq message, length delimited. Does not implicitly {@link Basil.UpdateObjectPropertyReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Basil.UpdateObjectPropertyReq
         * @static
         * @param {Basil.IUpdateObjectPropertyReq} message UpdateObjectPropertyReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateObjectPropertyReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an UpdateObjectPropertyReq message from the specified reader or buffer.
         * @function decode
         * @memberof Basil.UpdateObjectPropertyReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Basil.UpdateObjectPropertyReq} UpdateObjectPropertyReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateObjectPropertyReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Basil.UpdateObjectPropertyReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.trace = $root.BasilType.TraceInfo.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.objectId = $root.BasilType.ObjectIdentifier.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.props = $root.BasilType.PropertyList.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an UpdateObjectPropertyReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Basil.UpdateObjectPropertyReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Basil.UpdateObjectPropertyReq} UpdateObjectPropertyReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateObjectPropertyReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an UpdateObjectPropertyReq message.
         * @function verify
         * @memberof Basil.UpdateObjectPropertyReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateObjectPropertyReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.trace != null && message.hasOwnProperty("trace")) {
                let error = $root.BasilType.TraceInfo.verify(message.trace);
                if (error)
                    return "trace." + error;
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

        /**
         * Creates an UpdateObjectPropertyReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Basil.UpdateObjectPropertyReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Basil.UpdateObjectPropertyReq} UpdateObjectPropertyReq
         */
        UpdateObjectPropertyReq.fromObject = function fromObject(object) {
            if (object instanceof $root.Basil.UpdateObjectPropertyReq)
                return object;
            let message = new $root.Basil.UpdateObjectPropertyReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".Basil.UpdateObjectPropertyReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.trace != null) {
                if (typeof object.trace !== "object")
                    throw TypeError(".Basil.UpdateObjectPropertyReq.trace: object expected");
                message.trace = $root.BasilType.TraceInfo.fromObject(object.trace);
            }
            if (object.objectId != null) {
                if (typeof object.objectId !== "object")
                    throw TypeError(".Basil.UpdateObjectPropertyReq.objectId: object expected");
                message.objectId = $root.BasilType.ObjectIdentifier.fromObject(object.objectId);
            }
            if (object.props != null) {
                if (typeof object.props !== "object")
                    throw TypeError(".Basil.UpdateObjectPropertyReq.props: object expected");
                message.props = $root.BasilType.PropertyList.fromObject(object.props);
            }
            return message;
        };

        /**
         * Creates a plain object from an UpdateObjectPropertyReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Basil.UpdateObjectPropertyReq
         * @static
         * @param {Basil.UpdateObjectPropertyReq} message UpdateObjectPropertyReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateObjectPropertyReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.trace = null;
                object.objectId = null;
                object.props = null;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.trace != null && message.hasOwnProperty("trace"))
                object.trace = $root.BasilType.TraceInfo.toObject(message.trace, options);
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                object.objectId = $root.BasilType.ObjectIdentifier.toObject(message.objectId, options);
            if (message.props != null && message.hasOwnProperty("props"))
                object.props = $root.BasilType.PropertyList.toObject(message.props, options);
            return object;
        };

        /**
         * Converts this UpdateObjectPropertyReq to JSON.
         * @function toJSON
         * @memberof Basil.UpdateObjectPropertyReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateObjectPropertyReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateObjectPropertyReq;
    })();

    Basil.UpdateObjectPropertyResp = (function() {

        /**
         * Properties of an UpdateObjectPropertyResp.
         * @memberof Basil
         * @interface IUpdateObjectPropertyResp
         * @property {BasilType.IBasilException|null} [success] UpdateObjectPropertyResp success
         */

        /**
         * Constructs a new UpdateObjectPropertyResp.
         * @memberof Basil
         * @classdesc Represents an UpdateObjectPropertyResp.
         * @implements IUpdateObjectPropertyResp
         * @constructor
         * @param {Basil.IUpdateObjectPropertyResp=} [properties] Properties to set
         */
        function UpdateObjectPropertyResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UpdateObjectPropertyResp success.
         * @member {BasilType.IBasilException|null|undefined} success
         * @memberof Basil.UpdateObjectPropertyResp
         * @instance
         */
        UpdateObjectPropertyResp.prototype.success = null;

        /**
         * Creates a new UpdateObjectPropertyResp instance using the specified properties.
         * @function create
         * @memberof Basil.UpdateObjectPropertyResp
         * @static
         * @param {Basil.IUpdateObjectPropertyResp=} [properties] Properties to set
         * @returns {Basil.UpdateObjectPropertyResp} UpdateObjectPropertyResp instance
         */
        UpdateObjectPropertyResp.create = function create(properties) {
            return new UpdateObjectPropertyResp(properties);
        };

        /**
         * Encodes the specified UpdateObjectPropertyResp message. Does not implicitly {@link Basil.UpdateObjectPropertyResp.verify|verify} messages.
         * @function encode
         * @memberof Basil.UpdateObjectPropertyResp
         * @static
         * @param {Basil.IUpdateObjectPropertyResp} message UpdateObjectPropertyResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateObjectPropertyResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                $root.BasilType.BasilException.encode(message.success, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified UpdateObjectPropertyResp message, length delimited. Does not implicitly {@link Basil.UpdateObjectPropertyResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Basil.UpdateObjectPropertyResp
         * @static
         * @param {Basil.IUpdateObjectPropertyResp} message UpdateObjectPropertyResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateObjectPropertyResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an UpdateObjectPropertyResp message from the specified reader or buffer.
         * @function decode
         * @memberof Basil.UpdateObjectPropertyResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Basil.UpdateObjectPropertyResp} UpdateObjectPropertyResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateObjectPropertyResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Basil.UpdateObjectPropertyResp();
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

        /**
         * Decodes an UpdateObjectPropertyResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Basil.UpdateObjectPropertyResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Basil.UpdateObjectPropertyResp} UpdateObjectPropertyResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateObjectPropertyResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an UpdateObjectPropertyResp message.
         * @function verify
         * @memberof Basil.UpdateObjectPropertyResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
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

        /**
         * Creates an UpdateObjectPropertyResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Basil.UpdateObjectPropertyResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Basil.UpdateObjectPropertyResp} UpdateObjectPropertyResp
         */
        UpdateObjectPropertyResp.fromObject = function fromObject(object) {
            if (object instanceof $root.Basil.UpdateObjectPropertyResp)
                return object;
            let message = new $root.Basil.UpdateObjectPropertyResp();
            if (object.success != null) {
                if (typeof object.success !== "object")
                    throw TypeError(".Basil.UpdateObjectPropertyResp.success: object expected");
                message.success = $root.BasilType.BasilException.fromObject(object.success);
            }
            return message;
        };

        /**
         * Creates a plain object from an UpdateObjectPropertyResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Basil.UpdateObjectPropertyResp
         * @static
         * @param {Basil.UpdateObjectPropertyResp} message UpdateObjectPropertyResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this UpdateObjectPropertyResp to JSON.
         * @function toJSON
         * @memberof Basil.UpdateObjectPropertyResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateObjectPropertyResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateObjectPropertyResp;
    })();

    Basil.UpdateInstancePropertyReq = (function() {

        /**
         * Properties of an UpdateInstancePropertyReq.
         * @memberof Basil
         * @interface IUpdateInstancePropertyReq
         * @property {BasilType.IAccessAuthorization|null} [auth] UpdateInstancePropertyReq auth
         * @property {BasilType.ITraceInfo|null} [trace] UpdateInstancePropertyReq trace
         * @property {BasilType.IInstanceIdentifier|null} [instanceId] UpdateInstancePropertyReq instanceId
         * @property {BasilType.IPropertyList|null} [props] UpdateInstancePropertyReq props
         */

        /**
         * Constructs a new UpdateInstancePropertyReq.
         * @memberof Basil
         * @classdesc Represents an UpdateInstancePropertyReq.
         * @implements IUpdateInstancePropertyReq
         * @constructor
         * @param {Basil.IUpdateInstancePropertyReq=} [properties] Properties to set
         */
        function UpdateInstancePropertyReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UpdateInstancePropertyReq auth.
         * @member {BasilType.IAccessAuthorization|null|undefined} auth
         * @memberof Basil.UpdateInstancePropertyReq
         * @instance
         */
        UpdateInstancePropertyReq.prototype.auth = null;

        /**
         * UpdateInstancePropertyReq trace.
         * @member {BasilType.ITraceInfo|null|undefined} trace
         * @memberof Basil.UpdateInstancePropertyReq
         * @instance
         */
        UpdateInstancePropertyReq.prototype.trace = null;

        /**
         * UpdateInstancePropertyReq instanceId.
         * @member {BasilType.IInstanceIdentifier|null|undefined} instanceId
         * @memberof Basil.UpdateInstancePropertyReq
         * @instance
         */
        UpdateInstancePropertyReq.prototype.instanceId = null;

        /**
         * UpdateInstancePropertyReq props.
         * @member {BasilType.IPropertyList|null|undefined} props
         * @memberof Basil.UpdateInstancePropertyReq
         * @instance
         */
        UpdateInstancePropertyReq.prototype.props = null;

        /**
         * Creates a new UpdateInstancePropertyReq instance using the specified properties.
         * @function create
         * @memberof Basil.UpdateInstancePropertyReq
         * @static
         * @param {Basil.IUpdateInstancePropertyReq=} [properties] Properties to set
         * @returns {Basil.UpdateInstancePropertyReq} UpdateInstancePropertyReq instance
         */
        UpdateInstancePropertyReq.create = function create(properties) {
            return new UpdateInstancePropertyReq(properties);
        };

        /**
         * Encodes the specified UpdateInstancePropertyReq message. Does not implicitly {@link Basil.UpdateInstancePropertyReq.verify|verify} messages.
         * @function encode
         * @memberof Basil.UpdateInstancePropertyReq
         * @static
         * @param {Basil.IUpdateInstancePropertyReq} message UpdateInstancePropertyReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateInstancePropertyReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.trace != null && message.hasOwnProperty("trace"))
                $root.BasilType.TraceInfo.encode(message.trace, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.instanceId != null && message.hasOwnProperty("instanceId"))
                $root.BasilType.InstanceIdentifier.encode(message.instanceId, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.props != null && message.hasOwnProperty("props"))
                $root.BasilType.PropertyList.encode(message.props, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified UpdateInstancePropertyReq message, length delimited. Does not implicitly {@link Basil.UpdateInstancePropertyReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Basil.UpdateInstancePropertyReq
         * @static
         * @param {Basil.IUpdateInstancePropertyReq} message UpdateInstancePropertyReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateInstancePropertyReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an UpdateInstancePropertyReq message from the specified reader or buffer.
         * @function decode
         * @memberof Basil.UpdateInstancePropertyReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Basil.UpdateInstancePropertyReq} UpdateInstancePropertyReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateInstancePropertyReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Basil.UpdateInstancePropertyReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.trace = $root.BasilType.TraceInfo.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.instanceId = $root.BasilType.InstanceIdentifier.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.props = $root.BasilType.PropertyList.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an UpdateInstancePropertyReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Basil.UpdateInstancePropertyReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Basil.UpdateInstancePropertyReq} UpdateInstancePropertyReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateInstancePropertyReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an UpdateInstancePropertyReq message.
         * @function verify
         * @memberof Basil.UpdateInstancePropertyReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateInstancePropertyReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.trace != null && message.hasOwnProperty("trace")) {
                let error = $root.BasilType.TraceInfo.verify(message.trace);
                if (error)
                    return "trace." + error;
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

        /**
         * Creates an UpdateInstancePropertyReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Basil.UpdateInstancePropertyReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Basil.UpdateInstancePropertyReq} UpdateInstancePropertyReq
         */
        UpdateInstancePropertyReq.fromObject = function fromObject(object) {
            if (object instanceof $root.Basil.UpdateInstancePropertyReq)
                return object;
            let message = new $root.Basil.UpdateInstancePropertyReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".Basil.UpdateInstancePropertyReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.trace != null) {
                if (typeof object.trace !== "object")
                    throw TypeError(".Basil.UpdateInstancePropertyReq.trace: object expected");
                message.trace = $root.BasilType.TraceInfo.fromObject(object.trace);
            }
            if (object.instanceId != null) {
                if (typeof object.instanceId !== "object")
                    throw TypeError(".Basil.UpdateInstancePropertyReq.instanceId: object expected");
                message.instanceId = $root.BasilType.InstanceIdentifier.fromObject(object.instanceId);
            }
            if (object.props != null) {
                if (typeof object.props !== "object")
                    throw TypeError(".Basil.UpdateInstancePropertyReq.props: object expected");
                message.props = $root.BasilType.PropertyList.fromObject(object.props);
            }
            return message;
        };

        /**
         * Creates a plain object from an UpdateInstancePropertyReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Basil.UpdateInstancePropertyReq
         * @static
         * @param {Basil.UpdateInstancePropertyReq} message UpdateInstancePropertyReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateInstancePropertyReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.trace = null;
                object.instanceId = null;
                object.props = null;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.trace != null && message.hasOwnProperty("trace"))
                object.trace = $root.BasilType.TraceInfo.toObject(message.trace, options);
            if (message.instanceId != null && message.hasOwnProperty("instanceId"))
                object.instanceId = $root.BasilType.InstanceIdentifier.toObject(message.instanceId, options);
            if (message.props != null && message.hasOwnProperty("props"))
                object.props = $root.BasilType.PropertyList.toObject(message.props, options);
            return object;
        };

        /**
         * Converts this UpdateInstancePropertyReq to JSON.
         * @function toJSON
         * @memberof Basil.UpdateInstancePropertyReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateInstancePropertyReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateInstancePropertyReq;
    })();

    Basil.UpdateInstancePropertyResp = (function() {

        /**
         * Properties of an UpdateInstancePropertyResp.
         * @memberof Basil
         * @interface IUpdateInstancePropertyResp
         * @property {BasilType.IBasilException|null} [success] UpdateInstancePropertyResp success
         */

        /**
         * Constructs a new UpdateInstancePropertyResp.
         * @memberof Basil
         * @classdesc Represents an UpdateInstancePropertyResp.
         * @implements IUpdateInstancePropertyResp
         * @constructor
         * @param {Basil.IUpdateInstancePropertyResp=} [properties] Properties to set
         */
        function UpdateInstancePropertyResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UpdateInstancePropertyResp success.
         * @member {BasilType.IBasilException|null|undefined} success
         * @memberof Basil.UpdateInstancePropertyResp
         * @instance
         */
        UpdateInstancePropertyResp.prototype.success = null;

        /**
         * Creates a new UpdateInstancePropertyResp instance using the specified properties.
         * @function create
         * @memberof Basil.UpdateInstancePropertyResp
         * @static
         * @param {Basil.IUpdateInstancePropertyResp=} [properties] Properties to set
         * @returns {Basil.UpdateInstancePropertyResp} UpdateInstancePropertyResp instance
         */
        UpdateInstancePropertyResp.create = function create(properties) {
            return new UpdateInstancePropertyResp(properties);
        };

        /**
         * Encodes the specified UpdateInstancePropertyResp message. Does not implicitly {@link Basil.UpdateInstancePropertyResp.verify|verify} messages.
         * @function encode
         * @memberof Basil.UpdateInstancePropertyResp
         * @static
         * @param {Basil.IUpdateInstancePropertyResp} message UpdateInstancePropertyResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateInstancePropertyResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                $root.BasilType.BasilException.encode(message.success, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified UpdateInstancePropertyResp message, length delimited. Does not implicitly {@link Basil.UpdateInstancePropertyResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Basil.UpdateInstancePropertyResp
         * @static
         * @param {Basil.IUpdateInstancePropertyResp} message UpdateInstancePropertyResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateInstancePropertyResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an UpdateInstancePropertyResp message from the specified reader or buffer.
         * @function decode
         * @memberof Basil.UpdateInstancePropertyResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Basil.UpdateInstancePropertyResp} UpdateInstancePropertyResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateInstancePropertyResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Basil.UpdateInstancePropertyResp();
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

        /**
         * Decodes an UpdateInstancePropertyResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Basil.UpdateInstancePropertyResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Basil.UpdateInstancePropertyResp} UpdateInstancePropertyResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateInstancePropertyResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an UpdateInstancePropertyResp message.
         * @function verify
         * @memberof Basil.UpdateInstancePropertyResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
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

        /**
         * Creates an UpdateInstancePropertyResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Basil.UpdateInstancePropertyResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Basil.UpdateInstancePropertyResp} UpdateInstancePropertyResp
         */
        UpdateInstancePropertyResp.fromObject = function fromObject(object) {
            if (object instanceof $root.Basil.UpdateInstancePropertyResp)
                return object;
            let message = new $root.Basil.UpdateInstancePropertyResp();
            if (object.success != null) {
                if (typeof object.success !== "object")
                    throw TypeError(".Basil.UpdateInstancePropertyResp.success: object expected");
                message.success = $root.BasilType.BasilException.fromObject(object.success);
            }
            return message;
        };

        /**
         * Creates a plain object from an UpdateInstancePropertyResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Basil.UpdateInstancePropertyResp
         * @static
         * @param {Basil.UpdateInstancePropertyResp} message UpdateInstancePropertyResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this UpdateInstancePropertyResp to JSON.
         * @function toJSON
         * @memberof Basil.UpdateInstancePropertyResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateInstancePropertyResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateInstancePropertyResp;
    })();

    Basil.UpdateInstancePositionReq = (function() {

        /**
         * Properties of an UpdateInstancePositionReq.
         * @memberof Basil
         * @interface IUpdateInstancePositionReq
         * @property {BasilType.IAccessAuthorization|null} [auth] UpdateInstancePositionReq auth
         * @property {BasilType.ITraceInfo|null} [trace] UpdateInstancePositionReq trace
         * @property {BasilType.IInstanceIdentifier|null} [instanceId] UpdateInstancePositionReq instanceId
         * @property {BasilType.IInstancePositionInfo|null} [pos] UpdateInstancePositionReq pos
         */

        /**
         * Constructs a new UpdateInstancePositionReq.
         * @memberof Basil
         * @classdesc Represents an UpdateInstancePositionReq.
         * @implements IUpdateInstancePositionReq
         * @constructor
         * @param {Basil.IUpdateInstancePositionReq=} [properties] Properties to set
         */
        function UpdateInstancePositionReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UpdateInstancePositionReq auth.
         * @member {BasilType.IAccessAuthorization|null|undefined} auth
         * @memberof Basil.UpdateInstancePositionReq
         * @instance
         */
        UpdateInstancePositionReq.prototype.auth = null;

        /**
         * UpdateInstancePositionReq trace.
         * @member {BasilType.ITraceInfo|null|undefined} trace
         * @memberof Basil.UpdateInstancePositionReq
         * @instance
         */
        UpdateInstancePositionReq.prototype.trace = null;

        /**
         * UpdateInstancePositionReq instanceId.
         * @member {BasilType.IInstanceIdentifier|null|undefined} instanceId
         * @memberof Basil.UpdateInstancePositionReq
         * @instance
         */
        UpdateInstancePositionReq.prototype.instanceId = null;

        /**
         * UpdateInstancePositionReq pos.
         * @member {BasilType.IInstancePositionInfo|null|undefined} pos
         * @memberof Basil.UpdateInstancePositionReq
         * @instance
         */
        UpdateInstancePositionReq.prototype.pos = null;

        /**
         * Creates a new UpdateInstancePositionReq instance using the specified properties.
         * @function create
         * @memberof Basil.UpdateInstancePositionReq
         * @static
         * @param {Basil.IUpdateInstancePositionReq=} [properties] Properties to set
         * @returns {Basil.UpdateInstancePositionReq} UpdateInstancePositionReq instance
         */
        UpdateInstancePositionReq.create = function create(properties) {
            return new UpdateInstancePositionReq(properties);
        };

        /**
         * Encodes the specified UpdateInstancePositionReq message. Does not implicitly {@link Basil.UpdateInstancePositionReq.verify|verify} messages.
         * @function encode
         * @memberof Basil.UpdateInstancePositionReq
         * @static
         * @param {Basil.IUpdateInstancePositionReq} message UpdateInstancePositionReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateInstancePositionReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.trace != null && message.hasOwnProperty("trace"))
                $root.BasilType.TraceInfo.encode(message.trace, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.instanceId != null && message.hasOwnProperty("instanceId"))
                $root.BasilType.InstanceIdentifier.encode(message.instanceId, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.pos != null && message.hasOwnProperty("pos"))
                $root.BasilType.InstancePositionInfo.encode(message.pos, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified UpdateInstancePositionReq message, length delimited. Does not implicitly {@link Basil.UpdateInstancePositionReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Basil.UpdateInstancePositionReq
         * @static
         * @param {Basil.IUpdateInstancePositionReq} message UpdateInstancePositionReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateInstancePositionReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an UpdateInstancePositionReq message from the specified reader or buffer.
         * @function decode
         * @memberof Basil.UpdateInstancePositionReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Basil.UpdateInstancePositionReq} UpdateInstancePositionReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateInstancePositionReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Basil.UpdateInstancePositionReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.trace = $root.BasilType.TraceInfo.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.instanceId = $root.BasilType.InstanceIdentifier.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.pos = $root.BasilType.InstancePositionInfo.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an UpdateInstancePositionReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Basil.UpdateInstancePositionReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Basil.UpdateInstancePositionReq} UpdateInstancePositionReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateInstancePositionReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an UpdateInstancePositionReq message.
         * @function verify
         * @memberof Basil.UpdateInstancePositionReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateInstancePositionReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.trace != null && message.hasOwnProperty("trace")) {
                let error = $root.BasilType.TraceInfo.verify(message.trace);
                if (error)
                    return "trace." + error;
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

        /**
         * Creates an UpdateInstancePositionReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Basil.UpdateInstancePositionReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Basil.UpdateInstancePositionReq} UpdateInstancePositionReq
         */
        UpdateInstancePositionReq.fromObject = function fromObject(object) {
            if (object instanceof $root.Basil.UpdateInstancePositionReq)
                return object;
            let message = new $root.Basil.UpdateInstancePositionReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".Basil.UpdateInstancePositionReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.trace != null) {
                if (typeof object.trace !== "object")
                    throw TypeError(".Basil.UpdateInstancePositionReq.trace: object expected");
                message.trace = $root.BasilType.TraceInfo.fromObject(object.trace);
            }
            if (object.instanceId != null) {
                if (typeof object.instanceId !== "object")
                    throw TypeError(".Basil.UpdateInstancePositionReq.instanceId: object expected");
                message.instanceId = $root.BasilType.InstanceIdentifier.fromObject(object.instanceId);
            }
            if (object.pos != null) {
                if (typeof object.pos !== "object")
                    throw TypeError(".Basil.UpdateInstancePositionReq.pos: object expected");
                message.pos = $root.BasilType.InstancePositionInfo.fromObject(object.pos);
            }
            return message;
        };

        /**
         * Creates a plain object from an UpdateInstancePositionReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Basil.UpdateInstancePositionReq
         * @static
         * @param {Basil.UpdateInstancePositionReq} message UpdateInstancePositionReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateInstancePositionReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.trace = null;
                object.instanceId = null;
                object.pos = null;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.trace != null && message.hasOwnProperty("trace"))
                object.trace = $root.BasilType.TraceInfo.toObject(message.trace, options);
            if (message.instanceId != null && message.hasOwnProperty("instanceId"))
                object.instanceId = $root.BasilType.InstanceIdentifier.toObject(message.instanceId, options);
            if (message.pos != null && message.hasOwnProperty("pos"))
                object.pos = $root.BasilType.InstancePositionInfo.toObject(message.pos, options);
            return object;
        };

        /**
         * Converts this UpdateInstancePositionReq to JSON.
         * @function toJSON
         * @memberof Basil.UpdateInstancePositionReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateInstancePositionReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateInstancePositionReq;
    })();

    Basil.UpdateInstancePositionResp = (function() {

        /**
         * Properties of an UpdateInstancePositionResp.
         * @memberof Basil
         * @interface IUpdateInstancePositionResp
         * @property {BasilType.IBasilException|null} [success] UpdateInstancePositionResp success
         */

        /**
         * Constructs a new UpdateInstancePositionResp.
         * @memberof Basil
         * @classdesc Represents an UpdateInstancePositionResp.
         * @implements IUpdateInstancePositionResp
         * @constructor
         * @param {Basil.IUpdateInstancePositionResp=} [properties] Properties to set
         */
        function UpdateInstancePositionResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UpdateInstancePositionResp success.
         * @member {BasilType.IBasilException|null|undefined} success
         * @memberof Basil.UpdateInstancePositionResp
         * @instance
         */
        UpdateInstancePositionResp.prototype.success = null;

        /**
         * Creates a new UpdateInstancePositionResp instance using the specified properties.
         * @function create
         * @memberof Basil.UpdateInstancePositionResp
         * @static
         * @param {Basil.IUpdateInstancePositionResp=} [properties] Properties to set
         * @returns {Basil.UpdateInstancePositionResp} UpdateInstancePositionResp instance
         */
        UpdateInstancePositionResp.create = function create(properties) {
            return new UpdateInstancePositionResp(properties);
        };

        /**
         * Encodes the specified UpdateInstancePositionResp message. Does not implicitly {@link Basil.UpdateInstancePositionResp.verify|verify} messages.
         * @function encode
         * @memberof Basil.UpdateInstancePositionResp
         * @static
         * @param {Basil.IUpdateInstancePositionResp} message UpdateInstancePositionResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateInstancePositionResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                $root.BasilType.BasilException.encode(message.success, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified UpdateInstancePositionResp message, length delimited. Does not implicitly {@link Basil.UpdateInstancePositionResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Basil.UpdateInstancePositionResp
         * @static
         * @param {Basil.IUpdateInstancePositionResp} message UpdateInstancePositionResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateInstancePositionResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an UpdateInstancePositionResp message from the specified reader or buffer.
         * @function decode
         * @memberof Basil.UpdateInstancePositionResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Basil.UpdateInstancePositionResp} UpdateInstancePositionResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateInstancePositionResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Basil.UpdateInstancePositionResp();
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

        /**
         * Decodes an UpdateInstancePositionResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Basil.UpdateInstancePositionResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Basil.UpdateInstancePositionResp} UpdateInstancePositionResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateInstancePositionResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an UpdateInstancePositionResp message.
         * @function verify
         * @memberof Basil.UpdateInstancePositionResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
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

        /**
         * Creates an UpdateInstancePositionResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Basil.UpdateInstancePositionResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Basil.UpdateInstancePositionResp} UpdateInstancePositionResp
         */
        UpdateInstancePositionResp.fromObject = function fromObject(object) {
            if (object instanceof $root.Basil.UpdateInstancePositionResp)
                return object;
            let message = new $root.Basil.UpdateInstancePositionResp();
            if (object.success != null) {
                if (typeof object.success !== "object")
                    throw TypeError(".Basil.UpdateInstancePositionResp.success: object expected");
                message.success = $root.BasilType.BasilException.fromObject(object.success);
            }
            return message;
        };

        /**
         * Creates a plain object from an UpdateInstancePositionResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Basil.UpdateInstancePositionResp
         * @static
         * @param {Basil.UpdateInstancePositionResp} message UpdateInstancePositionResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this UpdateInstancePositionResp to JSON.
         * @function toJSON
         * @memberof Basil.UpdateInstancePositionResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateInstancePositionResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateInstancePositionResp;
    })();

    Basil.RequestObjectPropertiesReq = (function() {

        /**
         * Properties of a RequestObjectPropertiesReq.
         * @memberof Basil
         * @interface IRequestObjectPropertiesReq
         * @property {BasilType.IAccessAuthorization|null} [auth] RequestObjectPropertiesReq auth
         * @property {BasilType.ITraceInfo|null} [trace] RequestObjectPropertiesReq trace
         * @property {number|null} [sequenceNumber] RequestObjectPropertiesReq sequenceNumber
         * @property {BasilType.IObjectIdentifier|null} [objectId] RequestObjectPropertiesReq objectId
         * @property {string|null} [propertyMatch] RequestObjectPropertiesReq propertyMatch
         */

        /**
         * Constructs a new RequestObjectPropertiesReq.
         * @memberof Basil
         * @classdesc Represents a RequestObjectPropertiesReq.
         * @implements IRequestObjectPropertiesReq
         * @constructor
         * @param {Basil.IRequestObjectPropertiesReq=} [properties] Properties to set
         */
        function RequestObjectPropertiesReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RequestObjectPropertiesReq auth.
         * @member {BasilType.IAccessAuthorization|null|undefined} auth
         * @memberof Basil.RequestObjectPropertiesReq
         * @instance
         */
        RequestObjectPropertiesReq.prototype.auth = null;

        /**
         * RequestObjectPropertiesReq trace.
         * @member {BasilType.ITraceInfo|null|undefined} trace
         * @memberof Basil.RequestObjectPropertiesReq
         * @instance
         */
        RequestObjectPropertiesReq.prototype.trace = null;

        /**
         * RequestObjectPropertiesReq sequenceNumber.
         * @member {number} sequenceNumber
         * @memberof Basil.RequestObjectPropertiesReq
         * @instance
         */
        RequestObjectPropertiesReq.prototype.sequenceNumber = 0;

        /**
         * RequestObjectPropertiesReq objectId.
         * @member {BasilType.IObjectIdentifier|null|undefined} objectId
         * @memberof Basil.RequestObjectPropertiesReq
         * @instance
         */
        RequestObjectPropertiesReq.prototype.objectId = null;

        /**
         * RequestObjectPropertiesReq propertyMatch.
         * @member {string} propertyMatch
         * @memberof Basil.RequestObjectPropertiesReq
         * @instance
         */
        RequestObjectPropertiesReq.prototype.propertyMatch = "";

        /**
         * Creates a new RequestObjectPropertiesReq instance using the specified properties.
         * @function create
         * @memberof Basil.RequestObjectPropertiesReq
         * @static
         * @param {Basil.IRequestObjectPropertiesReq=} [properties] Properties to set
         * @returns {Basil.RequestObjectPropertiesReq} RequestObjectPropertiesReq instance
         */
        RequestObjectPropertiesReq.create = function create(properties) {
            return new RequestObjectPropertiesReq(properties);
        };

        /**
         * Encodes the specified RequestObjectPropertiesReq message. Does not implicitly {@link Basil.RequestObjectPropertiesReq.verify|verify} messages.
         * @function encode
         * @memberof Basil.RequestObjectPropertiesReq
         * @static
         * @param {Basil.IRequestObjectPropertiesReq} message RequestObjectPropertiesReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RequestObjectPropertiesReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.trace != null && message.hasOwnProperty("trace"))
                $root.BasilType.TraceInfo.encode(message.trace, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.sequenceNumber);
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                $root.BasilType.ObjectIdentifier.encode(message.objectId, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.propertyMatch != null && message.hasOwnProperty("propertyMatch"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.propertyMatch);
            return writer;
        };

        /**
         * Encodes the specified RequestObjectPropertiesReq message, length delimited. Does not implicitly {@link Basil.RequestObjectPropertiesReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Basil.RequestObjectPropertiesReq
         * @static
         * @param {Basil.IRequestObjectPropertiesReq} message RequestObjectPropertiesReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RequestObjectPropertiesReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RequestObjectPropertiesReq message from the specified reader or buffer.
         * @function decode
         * @memberof Basil.RequestObjectPropertiesReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Basil.RequestObjectPropertiesReq} RequestObjectPropertiesReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RequestObjectPropertiesReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Basil.RequestObjectPropertiesReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.trace = $root.BasilType.TraceInfo.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.sequenceNumber = reader.int32();
                    break;
                case 4:
                    message.objectId = $root.BasilType.ObjectIdentifier.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.propertyMatch = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RequestObjectPropertiesReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Basil.RequestObjectPropertiesReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Basil.RequestObjectPropertiesReq} RequestObjectPropertiesReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RequestObjectPropertiesReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RequestObjectPropertiesReq message.
         * @function verify
         * @memberof Basil.RequestObjectPropertiesReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RequestObjectPropertiesReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.trace != null && message.hasOwnProperty("trace")) {
                let error = $root.BasilType.TraceInfo.verify(message.trace);
                if (error)
                    return "trace." + error;
            }
            if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                if (!$util.isInteger(message.sequenceNumber))
                    return "sequenceNumber: integer expected";
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

        /**
         * Creates a RequestObjectPropertiesReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Basil.RequestObjectPropertiesReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Basil.RequestObjectPropertiesReq} RequestObjectPropertiesReq
         */
        RequestObjectPropertiesReq.fromObject = function fromObject(object) {
            if (object instanceof $root.Basil.RequestObjectPropertiesReq)
                return object;
            let message = new $root.Basil.RequestObjectPropertiesReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".Basil.RequestObjectPropertiesReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.trace != null) {
                if (typeof object.trace !== "object")
                    throw TypeError(".Basil.RequestObjectPropertiesReq.trace: object expected");
                message.trace = $root.BasilType.TraceInfo.fromObject(object.trace);
            }
            if (object.sequenceNumber != null)
                message.sequenceNumber = object.sequenceNumber | 0;
            if (object.objectId != null) {
                if (typeof object.objectId !== "object")
                    throw TypeError(".Basil.RequestObjectPropertiesReq.objectId: object expected");
                message.objectId = $root.BasilType.ObjectIdentifier.fromObject(object.objectId);
            }
            if (object.propertyMatch != null)
                message.propertyMatch = String(object.propertyMatch);
            return message;
        };

        /**
         * Creates a plain object from a RequestObjectPropertiesReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Basil.RequestObjectPropertiesReq
         * @static
         * @param {Basil.RequestObjectPropertiesReq} message RequestObjectPropertiesReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RequestObjectPropertiesReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.trace = null;
                object.sequenceNumber = 0;
                object.objectId = null;
                object.propertyMatch = "";
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.trace != null && message.hasOwnProperty("trace"))
                object.trace = $root.BasilType.TraceInfo.toObject(message.trace, options);
            if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                object.sequenceNumber = message.sequenceNumber;
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                object.objectId = $root.BasilType.ObjectIdentifier.toObject(message.objectId, options);
            if (message.propertyMatch != null && message.hasOwnProperty("propertyMatch"))
                object.propertyMatch = message.propertyMatch;
            return object;
        };

        /**
         * Converts this RequestObjectPropertiesReq to JSON.
         * @function toJSON
         * @memberof Basil.RequestObjectPropertiesReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RequestObjectPropertiesReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RequestObjectPropertiesReq;
    })();

    Basil.RequestObjectPropertiesResp = (function() {

        /**
         * Properties of a RequestObjectPropertiesResp.
         * @memberof Basil
         * @interface IRequestObjectPropertiesResp
         * @property {BasilType.IBasilException|null} [success] RequestObjectPropertiesResp success
         * @property {BasilType.IPropertyList|null} [properties] RequestObjectPropertiesResp properties
         */

        /**
         * Constructs a new RequestObjectPropertiesResp.
         * @memberof Basil
         * @classdesc Represents a RequestObjectPropertiesResp.
         * @implements IRequestObjectPropertiesResp
         * @constructor
         * @param {Basil.IRequestObjectPropertiesResp=} [properties] Properties to set
         */
        function RequestObjectPropertiesResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RequestObjectPropertiesResp success.
         * @member {BasilType.IBasilException|null|undefined} success
         * @memberof Basil.RequestObjectPropertiesResp
         * @instance
         */
        RequestObjectPropertiesResp.prototype.success = null;

        /**
         * RequestObjectPropertiesResp properties.
         * @member {BasilType.IPropertyList|null|undefined} properties
         * @memberof Basil.RequestObjectPropertiesResp
         * @instance
         */
        RequestObjectPropertiesResp.prototype.properties = null;

        /**
         * Creates a new RequestObjectPropertiesResp instance using the specified properties.
         * @function create
         * @memberof Basil.RequestObjectPropertiesResp
         * @static
         * @param {Basil.IRequestObjectPropertiesResp=} [properties] Properties to set
         * @returns {Basil.RequestObjectPropertiesResp} RequestObjectPropertiesResp instance
         */
        RequestObjectPropertiesResp.create = function create(properties) {
            return new RequestObjectPropertiesResp(properties);
        };

        /**
         * Encodes the specified RequestObjectPropertiesResp message. Does not implicitly {@link Basil.RequestObjectPropertiesResp.verify|verify} messages.
         * @function encode
         * @memberof Basil.RequestObjectPropertiesResp
         * @static
         * @param {Basil.IRequestObjectPropertiesResp} message RequestObjectPropertiesResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RequestObjectPropertiesResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                $root.BasilType.BasilException.encode(message.success, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.properties != null && message.hasOwnProperty("properties"))
                $root.BasilType.PropertyList.encode(message.properties, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified RequestObjectPropertiesResp message, length delimited. Does not implicitly {@link Basil.RequestObjectPropertiesResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Basil.RequestObjectPropertiesResp
         * @static
         * @param {Basil.IRequestObjectPropertiesResp} message RequestObjectPropertiesResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RequestObjectPropertiesResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RequestObjectPropertiesResp message from the specified reader or buffer.
         * @function decode
         * @memberof Basil.RequestObjectPropertiesResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Basil.RequestObjectPropertiesResp} RequestObjectPropertiesResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RequestObjectPropertiesResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Basil.RequestObjectPropertiesResp();
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

        /**
         * Decodes a RequestObjectPropertiesResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Basil.RequestObjectPropertiesResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Basil.RequestObjectPropertiesResp} RequestObjectPropertiesResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RequestObjectPropertiesResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RequestObjectPropertiesResp message.
         * @function verify
         * @memberof Basil.RequestObjectPropertiesResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
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

        /**
         * Creates a RequestObjectPropertiesResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Basil.RequestObjectPropertiesResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Basil.RequestObjectPropertiesResp} RequestObjectPropertiesResp
         */
        RequestObjectPropertiesResp.fromObject = function fromObject(object) {
            if (object instanceof $root.Basil.RequestObjectPropertiesResp)
                return object;
            let message = new $root.Basil.RequestObjectPropertiesResp();
            if (object.success != null) {
                if (typeof object.success !== "object")
                    throw TypeError(".Basil.RequestObjectPropertiesResp.success: object expected");
                message.success = $root.BasilType.BasilException.fromObject(object.success);
            }
            if (object.properties != null) {
                if (typeof object.properties !== "object")
                    throw TypeError(".Basil.RequestObjectPropertiesResp.properties: object expected");
                message.properties = $root.BasilType.PropertyList.fromObject(object.properties);
            }
            return message;
        };

        /**
         * Creates a plain object from a RequestObjectPropertiesResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Basil.RequestObjectPropertiesResp
         * @static
         * @param {Basil.RequestObjectPropertiesResp} message RequestObjectPropertiesResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this RequestObjectPropertiesResp to JSON.
         * @function toJSON
         * @memberof Basil.RequestObjectPropertiesResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RequestObjectPropertiesResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RequestObjectPropertiesResp;
    })();

    Basil.RequestInstancePropertiesReq = (function() {

        /**
         * Properties of a RequestInstancePropertiesReq.
         * @memberof Basil
         * @interface IRequestInstancePropertiesReq
         * @property {BasilType.IAccessAuthorization|null} [auth] RequestInstancePropertiesReq auth
         * @property {BasilType.ITraceInfo|null} [trace] RequestInstancePropertiesReq trace
         * @property {number|null} [sequenceNumber] RequestInstancePropertiesReq sequenceNumber
         * @property {BasilType.IInstanceIdentifier|null} [instanceId] RequestInstancePropertiesReq instanceId
         * @property {string|null} [propertyMatch] RequestInstancePropertiesReq propertyMatch
         */

        /**
         * Constructs a new RequestInstancePropertiesReq.
         * @memberof Basil
         * @classdesc Represents a RequestInstancePropertiesReq.
         * @implements IRequestInstancePropertiesReq
         * @constructor
         * @param {Basil.IRequestInstancePropertiesReq=} [properties] Properties to set
         */
        function RequestInstancePropertiesReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RequestInstancePropertiesReq auth.
         * @member {BasilType.IAccessAuthorization|null|undefined} auth
         * @memberof Basil.RequestInstancePropertiesReq
         * @instance
         */
        RequestInstancePropertiesReq.prototype.auth = null;

        /**
         * RequestInstancePropertiesReq trace.
         * @member {BasilType.ITraceInfo|null|undefined} trace
         * @memberof Basil.RequestInstancePropertiesReq
         * @instance
         */
        RequestInstancePropertiesReq.prototype.trace = null;

        /**
         * RequestInstancePropertiesReq sequenceNumber.
         * @member {number} sequenceNumber
         * @memberof Basil.RequestInstancePropertiesReq
         * @instance
         */
        RequestInstancePropertiesReq.prototype.sequenceNumber = 0;

        /**
         * RequestInstancePropertiesReq instanceId.
         * @member {BasilType.IInstanceIdentifier|null|undefined} instanceId
         * @memberof Basil.RequestInstancePropertiesReq
         * @instance
         */
        RequestInstancePropertiesReq.prototype.instanceId = null;

        /**
         * RequestInstancePropertiesReq propertyMatch.
         * @member {string} propertyMatch
         * @memberof Basil.RequestInstancePropertiesReq
         * @instance
         */
        RequestInstancePropertiesReq.prototype.propertyMatch = "";

        /**
         * Creates a new RequestInstancePropertiesReq instance using the specified properties.
         * @function create
         * @memberof Basil.RequestInstancePropertiesReq
         * @static
         * @param {Basil.IRequestInstancePropertiesReq=} [properties] Properties to set
         * @returns {Basil.RequestInstancePropertiesReq} RequestInstancePropertiesReq instance
         */
        RequestInstancePropertiesReq.create = function create(properties) {
            return new RequestInstancePropertiesReq(properties);
        };

        /**
         * Encodes the specified RequestInstancePropertiesReq message. Does not implicitly {@link Basil.RequestInstancePropertiesReq.verify|verify} messages.
         * @function encode
         * @memberof Basil.RequestInstancePropertiesReq
         * @static
         * @param {Basil.IRequestInstancePropertiesReq} message RequestInstancePropertiesReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RequestInstancePropertiesReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.trace != null && message.hasOwnProperty("trace"))
                $root.BasilType.TraceInfo.encode(message.trace, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.sequenceNumber);
            if (message.instanceId != null && message.hasOwnProperty("instanceId"))
                $root.BasilType.InstanceIdentifier.encode(message.instanceId, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.propertyMatch != null && message.hasOwnProperty("propertyMatch"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.propertyMatch);
            return writer;
        };

        /**
         * Encodes the specified RequestInstancePropertiesReq message, length delimited. Does not implicitly {@link Basil.RequestInstancePropertiesReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Basil.RequestInstancePropertiesReq
         * @static
         * @param {Basil.IRequestInstancePropertiesReq} message RequestInstancePropertiesReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RequestInstancePropertiesReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RequestInstancePropertiesReq message from the specified reader or buffer.
         * @function decode
         * @memberof Basil.RequestInstancePropertiesReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Basil.RequestInstancePropertiesReq} RequestInstancePropertiesReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RequestInstancePropertiesReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Basil.RequestInstancePropertiesReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.trace = $root.BasilType.TraceInfo.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.sequenceNumber = reader.int32();
                    break;
                case 4:
                    message.instanceId = $root.BasilType.InstanceIdentifier.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.propertyMatch = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RequestInstancePropertiesReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Basil.RequestInstancePropertiesReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Basil.RequestInstancePropertiesReq} RequestInstancePropertiesReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RequestInstancePropertiesReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RequestInstancePropertiesReq message.
         * @function verify
         * @memberof Basil.RequestInstancePropertiesReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RequestInstancePropertiesReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.trace != null && message.hasOwnProperty("trace")) {
                let error = $root.BasilType.TraceInfo.verify(message.trace);
                if (error)
                    return "trace." + error;
            }
            if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                if (!$util.isInteger(message.sequenceNumber))
                    return "sequenceNumber: integer expected";
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

        /**
         * Creates a RequestInstancePropertiesReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Basil.RequestInstancePropertiesReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Basil.RequestInstancePropertiesReq} RequestInstancePropertiesReq
         */
        RequestInstancePropertiesReq.fromObject = function fromObject(object) {
            if (object instanceof $root.Basil.RequestInstancePropertiesReq)
                return object;
            let message = new $root.Basil.RequestInstancePropertiesReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".Basil.RequestInstancePropertiesReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.trace != null) {
                if (typeof object.trace !== "object")
                    throw TypeError(".Basil.RequestInstancePropertiesReq.trace: object expected");
                message.trace = $root.BasilType.TraceInfo.fromObject(object.trace);
            }
            if (object.sequenceNumber != null)
                message.sequenceNumber = object.sequenceNumber | 0;
            if (object.instanceId != null) {
                if (typeof object.instanceId !== "object")
                    throw TypeError(".Basil.RequestInstancePropertiesReq.instanceId: object expected");
                message.instanceId = $root.BasilType.InstanceIdentifier.fromObject(object.instanceId);
            }
            if (object.propertyMatch != null)
                message.propertyMatch = String(object.propertyMatch);
            return message;
        };

        /**
         * Creates a plain object from a RequestInstancePropertiesReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Basil.RequestInstancePropertiesReq
         * @static
         * @param {Basil.RequestInstancePropertiesReq} message RequestInstancePropertiesReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RequestInstancePropertiesReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.trace = null;
                object.sequenceNumber = 0;
                object.instanceId = null;
                object.propertyMatch = "";
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.trace != null && message.hasOwnProperty("trace"))
                object.trace = $root.BasilType.TraceInfo.toObject(message.trace, options);
            if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                object.sequenceNumber = message.sequenceNumber;
            if (message.instanceId != null && message.hasOwnProperty("instanceId"))
                object.instanceId = $root.BasilType.InstanceIdentifier.toObject(message.instanceId, options);
            if (message.propertyMatch != null && message.hasOwnProperty("propertyMatch"))
                object.propertyMatch = message.propertyMatch;
            return object;
        };

        /**
         * Converts this RequestInstancePropertiesReq to JSON.
         * @function toJSON
         * @memberof Basil.RequestInstancePropertiesReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RequestInstancePropertiesReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RequestInstancePropertiesReq;
    })();

    Basil.RequestInstancePropertiesResp = (function() {

        /**
         * Properties of a RequestInstancePropertiesResp.
         * @memberof Basil
         * @interface IRequestInstancePropertiesResp
         * @property {BasilType.IBasilException|null} [success] RequestInstancePropertiesResp success
         * @property {BasilType.IPropertyList|null} [properties] RequestInstancePropertiesResp properties
         */

        /**
         * Constructs a new RequestInstancePropertiesResp.
         * @memberof Basil
         * @classdesc Represents a RequestInstancePropertiesResp.
         * @implements IRequestInstancePropertiesResp
         * @constructor
         * @param {Basil.IRequestInstancePropertiesResp=} [properties] Properties to set
         */
        function RequestInstancePropertiesResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RequestInstancePropertiesResp success.
         * @member {BasilType.IBasilException|null|undefined} success
         * @memberof Basil.RequestInstancePropertiesResp
         * @instance
         */
        RequestInstancePropertiesResp.prototype.success = null;

        /**
         * RequestInstancePropertiesResp properties.
         * @member {BasilType.IPropertyList|null|undefined} properties
         * @memberof Basil.RequestInstancePropertiesResp
         * @instance
         */
        RequestInstancePropertiesResp.prototype.properties = null;

        /**
         * Creates a new RequestInstancePropertiesResp instance using the specified properties.
         * @function create
         * @memberof Basil.RequestInstancePropertiesResp
         * @static
         * @param {Basil.IRequestInstancePropertiesResp=} [properties] Properties to set
         * @returns {Basil.RequestInstancePropertiesResp} RequestInstancePropertiesResp instance
         */
        RequestInstancePropertiesResp.create = function create(properties) {
            return new RequestInstancePropertiesResp(properties);
        };

        /**
         * Encodes the specified RequestInstancePropertiesResp message. Does not implicitly {@link Basil.RequestInstancePropertiesResp.verify|verify} messages.
         * @function encode
         * @memberof Basil.RequestInstancePropertiesResp
         * @static
         * @param {Basil.IRequestInstancePropertiesResp} message RequestInstancePropertiesResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RequestInstancePropertiesResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                $root.BasilType.BasilException.encode(message.success, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.properties != null && message.hasOwnProperty("properties"))
                $root.BasilType.PropertyList.encode(message.properties, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified RequestInstancePropertiesResp message, length delimited. Does not implicitly {@link Basil.RequestInstancePropertiesResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Basil.RequestInstancePropertiesResp
         * @static
         * @param {Basil.IRequestInstancePropertiesResp} message RequestInstancePropertiesResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RequestInstancePropertiesResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RequestInstancePropertiesResp message from the specified reader or buffer.
         * @function decode
         * @memberof Basil.RequestInstancePropertiesResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Basil.RequestInstancePropertiesResp} RequestInstancePropertiesResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RequestInstancePropertiesResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Basil.RequestInstancePropertiesResp();
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

        /**
         * Decodes a RequestInstancePropertiesResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Basil.RequestInstancePropertiesResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Basil.RequestInstancePropertiesResp} RequestInstancePropertiesResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RequestInstancePropertiesResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RequestInstancePropertiesResp message.
         * @function verify
         * @memberof Basil.RequestInstancePropertiesResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
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

        /**
         * Creates a RequestInstancePropertiesResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Basil.RequestInstancePropertiesResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Basil.RequestInstancePropertiesResp} RequestInstancePropertiesResp
         */
        RequestInstancePropertiesResp.fromObject = function fromObject(object) {
            if (object instanceof $root.Basil.RequestInstancePropertiesResp)
                return object;
            let message = new $root.Basil.RequestInstancePropertiesResp();
            if (object.success != null) {
                if (typeof object.success !== "object")
                    throw TypeError(".Basil.RequestInstancePropertiesResp.success: object expected");
                message.success = $root.BasilType.BasilException.fromObject(object.success);
            }
            if (object.properties != null) {
                if (typeof object.properties !== "object")
                    throw TypeError(".Basil.RequestInstancePropertiesResp.properties: object expected");
                message.properties = $root.BasilType.PropertyList.fromObject(object.properties);
            }
            return message;
        };

        /**
         * Creates a plain object from a RequestInstancePropertiesResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Basil.RequestInstancePropertiesResp
         * @static
         * @param {Basil.RequestInstancePropertiesResp} message RequestInstancePropertiesResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this RequestInstancePropertiesResp to JSON.
         * @function toJSON
         * @memberof Basil.RequestInstancePropertiesResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RequestInstancePropertiesResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RequestInstancePropertiesResp;
    })();

    Basil.OpenSessionReq = (function() {

        /**
         * Properties of an OpenSessionReq.
         * @memberof Basil
         * @interface IOpenSessionReq
         * @property {BasilType.IAccessAuthorization|null} [auth] OpenSessionReq auth
         * @property {BasilType.ITraceInfo|null} [trace] OpenSessionReq trace
         * @property {BasilType.IPropertyList|null} [features] OpenSessionReq features
         */

        /**
         * Constructs a new OpenSessionReq.
         * @memberof Basil
         * @classdesc Represents an OpenSessionReq.
         * @implements IOpenSessionReq
         * @constructor
         * @param {Basil.IOpenSessionReq=} [properties] Properties to set
         */
        function OpenSessionReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * OpenSessionReq auth.
         * @member {BasilType.IAccessAuthorization|null|undefined} auth
         * @memberof Basil.OpenSessionReq
         * @instance
         */
        OpenSessionReq.prototype.auth = null;

        /**
         * OpenSessionReq trace.
         * @member {BasilType.ITraceInfo|null|undefined} trace
         * @memberof Basil.OpenSessionReq
         * @instance
         */
        OpenSessionReq.prototype.trace = null;

        /**
         * OpenSessionReq features.
         * @member {BasilType.IPropertyList|null|undefined} features
         * @memberof Basil.OpenSessionReq
         * @instance
         */
        OpenSessionReq.prototype.features = null;

        /**
         * Creates a new OpenSessionReq instance using the specified properties.
         * @function create
         * @memberof Basil.OpenSessionReq
         * @static
         * @param {Basil.IOpenSessionReq=} [properties] Properties to set
         * @returns {Basil.OpenSessionReq} OpenSessionReq instance
         */
        OpenSessionReq.create = function create(properties) {
            return new OpenSessionReq(properties);
        };

        /**
         * Encodes the specified OpenSessionReq message. Does not implicitly {@link Basil.OpenSessionReq.verify|verify} messages.
         * @function encode
         * @memberof Basil.OpenSessionReq
         * @static
         * @param {Basil.IOpenSessionReq} message OpenSessionReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OpenSessionReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.trace != null && message.hasOwnProperty("trace"))
                $root.BasilType.TraceInfo.encode(message.trace, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.features != null && message.hasOwnProperty("features"))
                $root.BasilType.PropertyList.encode(message.features, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified OpenSessionReq message, length delimited. Does not implicitly {@link Basil.OpenSessionReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Basil.OpenSessionReq
         * @static
         * @param {Basil.IOpenSessionReq} message OpenSessionReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OpenSessionReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an OpenSessionReq message from the specified reader or buffer.
         * @function decode
         * @memberof Basil.OpenSessionReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Basil.OpenSessionReq} OpenSessionReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OpenSessionReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Basil.OpenSessionReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.trace = $root.BasilType.TraceInfo.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.features = $root.BasilType.PropertyList.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an OpenSessionReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Basil.OpenSessionReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Basil.OpenSessionReq} OpenSessionReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OpenSessionReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an OpenSessionReq message.
         * @function verify
         * @memberof Basil.OpenSessionReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        OpenSessionReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.trace != null && message.hasOwnProperty("trace")) {
                let error = $root.BasilType.TraceInfo.verify(message.trace);
                if (error)
                    return "trace." + error;
            }
            if (message.features != null && message.hasOwnProperty("features")) {
                let error = $root.BasilType.PropertyList.verify(message.features);
                if (error)
                    return "features." + error;
            }
            return null;
        };

        /**
         * Creates an OpenSessionReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Basil.OpenSessionReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Basil.OpenSessionReq} OpenSessionReq
         */
        OpenSessionReq.fromObject = function fromObject(object) {
            if (object instanceof $root.Basil.OpenSessionReq)
                return object;
            let message = new $root.Basil.OpenSessionReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".Basil.OpenSessionReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.trace != null) {
                if (typeof object.trace !== "object")
                    throw TypeError(".Basil.OpenSessionReq.trace: object expected");
                message.trace = $root.BasilType.TraceInfo.fromObject(object.trace);
            }
            if (object.features != null) {
                if (typeof object.features !== "object")
                    throw TypeError(".Basil.OpenSessionReq.features: object expected");
                message.features = $root.BasilType.PropertyList.fromObject(object.features);
            }
            return message;
        };

        /**
         * Creates a plain object from an OpenSessionReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Basil.OpenSessionReq
         * @static
         * @param {Basil.OpenSessionReq} message OpenSessionReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        OpenSessionReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.trace = null;
                object.features = null;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.trace != null && message.hasOwnProperty("trace"))
                object.trace = $root.BasilType.TraceInfo.toObject(message.trace, options);
            if (message.features != null && message.hasOwnProperty("features"))
                object.features = $root.BasilType.PropertyList.toObject(message.features, options);
            return object;
        };

        /**
         * Converts this OpenSessionReq to JSON.
         * @function toJSON
         * @memberof Basil.OpenSessionReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        OpenSessionReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return OpenSessionReq;
    })();

    Basil.OpenSessionResp = (function() {

        /**
         * Properties of an OpenSessionResp.
         * @memberof Basil
         * @interface IOpenSessionResp
         * @property {BasilType.IBasilException|null} [success] OpenSessionResp success
         * @property {BasilType.IPropertyList|null} [properties] OpenSessionResp properties
         */

        /**
         * Constructs a new OpenSessionResp.
         * @memberof Basil
         * @classdesc Represents an OpenSessionResp.
         * @implements IOpenSessionResp
         * @constructor
         * @param {Basil.IOpenSessionResp=} [properties] Properties to set
         */
        function OpenSessionResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * OpenSessionResp success.
         * @member {BasilType.IBasilException|null|undefined} success
         * @memberof Basil.OpenSessionResp
         * @instance
         */
        OpenSessionResp.prototype.success = null;

        /**
         * OpenSessionResp properties.
         * @member {BasilType.IPropertyList|null|undefined} properties
         * @memberof Basil.OpenSessionResp
         * @instance
         */
        OpenSessionResp.prototype.properties = null;

        /**
         * Creates a new OpenSessionResp instance using the specified properties.
         * @function create
         * @memberof Basil.OpenSessionResp
         * @static
         * @param {Basil.IOpenSessionResp=} [properties] Properties to set
         * @returns {Basil.OpenSessionResp} OpenSessionResp instance
         */
        OpenSessionResp.create = function create(properties) {
            return new OpenSessionResp(properties);
        };

        /**
         * Encodes the specified OpenSessionResp message. Does not implicitly {@link Basil.OpenSessionResp.verify|verify} messages.
         * @function encode
         * @memberof Basil.OpenSessionResp
         * @static
         * @param {Basil.IOpenSessionResp} message OpenSessionResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OpenSessionResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                $root.BasilType.BasilException.encode(message.success, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.properties != null && message.hasOwnProperty("properties"))
                $root.BasilType.PropertyList.encode(message.properties, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified OpenSessionResp message, length delimited. Does not implicitly {@link Basil.OpenSessionResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Basil.OpenSessionResp
         * @static
         * @param {Basil.IOpenSessionResp} message OpenSessionResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OpenSessionResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an OpenSessionResp message from the specified reader or buffer.
         * @function decode
         * @memberof Basil.OpenSessionResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Basil.OpenSessionResp} OpenSessionResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OpenSessionResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Basil.OpenSessionResp();
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

        /**
         * Decodes an OpenSessionResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Basil.OpenSessionResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Basil.OpenSessionResp} OpenSessionResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OpenSessionResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an OpenSessionResp message.
         * @function verify
         * @memberof Basil.OpenSessionResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
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

        /**
         * Creates an OpenSessionResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Basil.OpenSessionResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Basil.OpenSessionResp} OpenSessionResp
         */
        OpenSessionResp.fromObject = function fromObject(object) {
            if (object instanceof $root.Basil.OpenSessionResp)
                return object;
            let message = new $root.Basil.OpenSessionResp();
            if (object.success != null) {
                if (typeof object.success !== "object")
                    throw TypeError(".Basil.OpenSessionResp.success: object expected");
                message.success = $root.BasilType.BasilException.fromObject(object.success);
            }
            if (object.properties != null) {
                if (typeof object.properties !== "object")
                    throw TypeError(".Basil.OpenSessionResp.properties: object expected");
                message.properties = $root.BasilType.PropertyList.fromObject(object.properties);
            }
            return message;
        };

        /**
         * Creates a plain object from an OpenSessionResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Basil.OpenSessionResp
         * @static
         * @param {Basil.OpenSessionResp} message OpenSessionResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this OpenSessionResp to JSON.
         * @function toJSON
         * @memberof Basil.OpenSessionResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        OpenSessionResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return OpenSessionResp;
    })();

    Basil.CloseSessionReq = (function() {

        /**
         * Properties of a CloseSessionReq.
         * @memberof Basil
         * @interface ICloseSessionReq
         * @property {BasilType.IAccessAuthorization|null} [auth] CloseSessionReq auth
         * @property {BasilType.ITraceInfo|null} [trace] CloseSessionReq trace
         * @property {string|null} [reason] CloseSessionReq reason
         */

        /**
         * Constructs a new CloseSessionReq.
         * @memberof Basil
         * @classdesc Represents a CloseSessionReq.
         * @implements ICloseSessionReq
         * @constructor
         * @param {Basil.ICloseSessionReq=} [properties] Properties to set
         */
        function CloseSessionReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CloseSessionReq auth.
         * @member {BasilType.IAccessAuthorization|null|undefined} auth
         * @memberof Basil.CloseSessionReq
         * @instance
         */
        CloseSessionReq.prototype.auth = null;

        /**
         * CloseSessionReq trace.
         * @member {BasilType.ITraceInfo|null|undefined} trace
         * @memberof Basil.CloseSessionReq
         * @instance
         */
        CloseSessionReq.prototype.trace = null;

        /**
         * CloseSessionReq reason.
         * @member {string} reason
         * @memberof Basil.CloseSessionReq
         * @instance
         */
        CloseSessionReq.prototype.reason = "";

        /**
         * Creates a new CloseSessionReq instance using the specified properties.
         * @function create
         * @memberof Basil.CloseSessionReq
         * @static
         * @param {Basil.ICloseSessionReq=} [properties] Properties to set
         * @returns {Basil.CloseSessionReq} CloseSessionReq instance
         */
        CloseSessionReq.create = function create(properties) {
            return new CloseSessionReq(properties);
        };

        /**
         * Encodes the specified CloseSessionReq message. Does not implicitly {@link Basil.CloseSessionReq.verify|verify} messages.
         * @function encode
         * @memberof Basil.CloseSessionReq
         * @static
         * @param {Basil.ICloseSessionReq} message CloseSessionReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CloseSessionReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.trace != null && message.hasOwnProperty("trace"))
                $root.BasilType.TraceInfo.encode(message.trace, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.reason != null && message.hasOwnProperty("reason"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.reason);
            return writer;
        };

        /**
         * Encodes the specified CloseSessionReq message, length delimited. Does not implicitly {@link Basil.CloseSessionReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Basil.CloseSessionReq
         * @static
         * @param {Basil.ICloseSessionReq} message CloseSessionReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CloseSessionReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CloseSessionReq message from the specified reader or buffer.
         * @function decode
         * @memberof Basil.CloseSessionReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Basil.CloseSessionReq} CloseSessionReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CloseSessionReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Basil.CloseSessionReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.trace = $root.BasilType.TraceInfo.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.reason = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CloseSessionReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Basil.CloseSessionReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Basil.CloseSessionReq} CloseSessionReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CloseSessionReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CloseSessionReq message.
         * @function verify
         * @memberof Basil.CloseSessionReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CloseSessionReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.trace != null && message.hasOwnProperty("trace")) {
                let error = $root.BasilType.TraceInfo.verify(message.trace);
                if (error)
                    return "trace." + error;
            }
            if (message.reason != null && message.hasOwnProperty("reason"))
                if (!$util.isString(message.reason))
                    return "reason: string expected";
            return null;
        };

        /**
         * Creates a CloseSessionReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Basil.CloseSessionReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Basil.CloseSessionReq} CloseSessionReq
         */
        CloseSessionReq.fromObject = function fromObject(object) {
            if (object instanceof $root.Basil.CloseSessionReq)
                return object;
            let message = new $root.Basil.CloseSessionReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".Basil.CloseSessionReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.trace != null) {
                if (typeof object.trace !== "object")
                    throw TypeError(".Basil.CloseSessionReq.trace: object expected");
                message.trace = $root.BasilType.TraceInfo.fromObject(object.trace);
            }
            if (object.reason != null)
                message.reason = String(object.reason);
            return message;
        };

        /**
         * Creates a plain object from a CloseSessionReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Basil.CloseSessionReq
         * @static
         * @param {Basil.CloseSessionReq} message CloseSessionReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CloseSessionReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.trace = null;
                object.reason = "";
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.trace != null && message.hasOwnProperty("trace"))
                object.trace = $root.BasilType.TraceInfo.toObject(message.trace, options);
            if (message.reason != null && message.hasOwnProperty("reason"))
                object.reason = message.reason;
            return object;
        };

        /**
         * Converts this CloseSessionReq to JSON.
         * @function toJSON
         * @memberof Basil.CloseSessionReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CloseSessionReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CloseSessionReq;
    })();

    Basil.CloseSessionResp = (function() {

        /**
         * Properties of a CloseSessionResp.
         * @memberof Basil
         * @interface ICloseSessionResp
         * @property {BasilType.IBasilException|null} [success] CloseSessionResp success
         */

        /**
         * Constructs a new CloseSessionResp.
         * @memberof Basil
         * @classdesc Represents a CloseSessionResp.
         * @implements ICloseSessionResp
         * @constructor
         * @param {Basil.ICloseSessionResp=} [properties] Properties to set
         */
        function CloseSessionResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CloseSessionResp success.
         * @member {BasilType.IBasilException|null|undefined} success
         * @memberof Basil.CloseSessionResp
         * @instance
         */
        CloseSessionResp.prototype.success = null;

        /**
         * Creates a new CloseSessionResp instance using the specified properties.
         * @function create
         * @memberof Basil.CloseSessionResp
         * @static
         * @param {Basil.ICloseSessionResp=} [properties] Properties to set
         * @returns {Basil.CloseSessionResp} CloseSessionResp instance
         */
        CloseSessionResp.create = function create(properties) {
            return new CloseSessionResp(properties);
        };

        /**
         * Encodes the specified CloseSessionResp message. Does not implicitly {@link Basil.CloseSessionResp.verify|verify} messages.
         * @function encode
         * @memberof Basil.CloseSessionResp
         * @static
         * @param {Basil.ICloseSessionResp} message CloseSessionResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CloseSessionResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                $root.BasilType.BasilException.encode(message.success, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified CloseSessionResp message, length delimited. Does not implicitly {@link Basil.CloseSessionResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Basil.CloseSessionResp
         * @static
         * @param {Basil.ICloseSessionResp} message CloseSessionResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CloseSessionResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CloseSessionResp message from the specified reader or buffer.
         * @function decode
         * @memberof Basil.CloseSessionResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Basil.CloseSessionResp} CloseSessionResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CloseSessionResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Basil.CloseSessionResp();
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

        /**
         * Decodes a CloseSessionResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Basil.CloseSessionResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Basil.CloseSessionResp} CloseSessionResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CloseSessionResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CloseSessionResp message.
         * @function verify
         * @memberof Basil.CloseSessionResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
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

        /**
         * Creates a CloseSessionResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Basil.CloseSessionResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Basil.CloseSessionResp} CloseSessionResp
         */
        CloseSessionResp.fromObject = function fromObject(object) {
            if (object instanceof $root.Basil.CloseSessionResp)
                return object;
            let message = new $root.Basil.CloseSessionResp();
            if (object.success != null) {
                if (typeof object.success !== "object")
                    throw TypeError(".Basil.CloseSessionResp.success: object expected");
                message.success = $root.BasilType.BasilException.fromObject(object.success);
            }
            return message;
        };

        /**
         * Creates a plain object from a CloseSessionResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Basil.CloseSessionResp
         * @static
         * @param {Basil.CloseSessionResp} message CloseSessionResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this CloseSessionResp to JSON.
         * @function toJSON
         * @memberof Basil.CloseSessionResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CloseSessionResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CloseSessionResp;
    })();

    Basil.AliveCheckReq = (function() {

        /**
         * Properties of an AliveCheckReq.
         * @memberof Basil
         * @interface IAliveCheckReq
         * @property {BasilType.IAccessAuthorization|null} [auth] AliveCheckReq auth
         * @property {BasilType.ITraceInfo|null} [trace] AliveCheckReq trace
         * @property {number|Long|null} [time] AliveCheckReq time
         * @property {number|null} [sequenceNumber] AliveCheckReq sequenceNumber
         */

        /**
         * Constructs a new AliveCheckReq.
         * @memberof Basil
         * @classdesc Represents an AliveCheckReq.
         * @implements IAliveCheckReq
         * @constructor
         * @param {Basil.IAliveCheckReq=} [properties] Properties to set
         */
        function AliveCheckReq(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AliveCheckReq auth.
         * @member {BasilType.IAccessAuthorization|null|undefined} auth
         * @memberof Basil.AliveCheckReq
         * @instance
         */
        AliveCheckReq.prototype.auth = null;

        /**
         * AliveCheckReq trace.
         * @member {BasilType.ITraceInfo|null|undefined} trace
         * @memberof Basil.AliveCheckReq
         * @instance
         */
        AliveCheckReq.prototype.trace = null;

        /**
         * AliveCheckReq time.
         * @member {number|Long} time
         * @memberof Basil.AliveCheckReq
         * @instance
         */
        AliveCheckReq.prototype.time = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * AliveCheckReq sequenceNumber.
         * @member {number} sequenceNumber
         * @memberof Basil.AliveCheckReq
         * @instance
         */
        AliveCheckReq.prototype.sequenceNumber = 0;

        /**
         * Creates a new AliveCheckReq instance using the specified properties.
         * @function create
         * @memberof Basil.AliveCheckReq
         * @static
         * @param {Basil.IAliveCheckReq=} [properties] Properties to set
         * @returns {Basil.AliveCheckReq} AliveCheckReq instance
         */
        AliveCheckReq.create = function create(properties) {
            return new AliveCheckReq(properties);
        };

        /**
         * Encodes the specified AliveCheckReq message. Does not implicitly {@link Basil.AliveCheckReq.verify|verify} messages.
         * @function encode
         * @memberof Basil.AliveCheckReq
         * @static
         * @param {Basil.IAliveCheckReq} message AliveCheckReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AliveCheckReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.trace != null && message.hasOwnProperty("trace"))
                $root.BasilType.TraceInfo.encode(message.trace, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.time != null && message.hasOwnProperty("time"))
                writer.uint32(/* id 3, wireType 0 =*/24).sint64(message.time);
            if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.sequenceNumber);
            return writer;
        };

        /**
         * Encodes the specified AliveCheckReq message, length delimited. Does not implicitly {@link Basil.AliveCheckReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Basil.AliveCheckReq
         * @static
         * @param {Basil.IAliveCheckReq} message AliveCheckReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AliveCheckReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AliveCheckReq message from the specified reader or buffer.
         * @function decode
         * @memberof Basil.AliveCheckReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Basil.AliveCheckReq} AliveCheckReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AliveCheckReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Basil.AliveCheckReq();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.trace = $root.BasilType.TraceInfo.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.time = reader.sint64();
                    break;
                case 4:
                    message.sequenceNumber = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AliveCheckReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Basil.AliveCheckReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Basil.AliveCheckReq} AliveCheckReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AliveCheckReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AliveCheckReq message.
         * @function verify
         * @memberof Basil.AliveCheckReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AliveCheckReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.trace != null && message.hasOwnProperty("trace")) {
                let error = $root.BasilType.TraceInfo.verify(message.trace);
                if (error)
                    return "trace." + error;
            }
            if (message.time != null && message.hasOwnProperty("time"))
                if (!$util.isInteger(message.time) && !(message.time && $util.isInteger(message.time.low) && $util.isInteger(message.time.high)))
                    return "time: integer|Long expected";
            if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                if (!$util.isInteger(message.sequenceNumber))
                    return "sequenceNumber: integer expected";
            return null;
        };

        /**
         * Creates an AliveCheckReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Basil.AliveCheckReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Basil.AliveCheckReq} AliveCheckReq
         */
        AliveCheckReq.fromObject = function fromObject(object) {
            if (object instanceof $root.Basil.AliveCheckReq)
                return object;
            let message = new $root.Basil.AliveCheckReq();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".Basil.AliveCheckReq.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.trace != null) {
                if (typeof object.trace !== "object")
                    throw TypeError(".Basil.AliveCheckReq.trace: object expected");
                message.trace = $root.BasilType.TraceInfo.fromObject(object.trace);
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
            if (object.sequenceNumber != null)
                message.sequenceNumber = object.sequenceNumber | 0;
            return message;
        };

        /**
         * Creates a plain object from an AliveCheckReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Basil.AliveCheckReq
         * @static
         * @param {Basil.AliveCheckReq} message AliveCheckReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AliveCheckReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.trace = null;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.time = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.time = options.longs === String ? "0" : 0;
                object.sequenceNumber = 0;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.trace != null && message.hasOwnProperty("trace"))
                object.trace = $root.BasilType.TraceInfo.toObject(message.trace, options);
            if (message.time != null && message.hasOwnProperty("time"))
                if (typeof message.time === "number")
                    object.time = options.longs === String ? String(message.time) : message.time;
                else
                    object.time = options.longs === String ? $util.Long.prototype.toString.call(message.time) : options.longs === Number ? new $util.LongBits(message.time.low >>> 0, message.time.high >>> 0).toNumber() : message.time;
            if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                object.sequenceNumber = message.sequenceNumber;
            return object;
        };

        /**
         * Converts this AliveCheckReq to JSON.
         * @function toJSON
         * @memberof Basil.AliveCheckReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AliveCheckReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AliveCheckReq;
    })();

    Basil.AliveCheckResp = (function() {

        /**
         * Properties of an AliveCheckResp.
         * @memberof Basil
         * @interface IAliveCheckResp
         * @property {BasilType.IAccessAuthorization|null} [auth] AliveCheckResp auth
         * @property {BasilType.ITraceInfo|null} [trace] AliveCheckResp trace
         * @property {number|Long|null} [time] AliveCheckResp time
         * @property {number|null} [sequenceNumber] AliveCheckResp sequenceNumber
         * @property {number|Long|null} [timeReceived] AliveCheckResp timeReceived
         * @property {number|null} [sequenceNumberReceived] AliveCheckResp sequenceNumberReceived
         */

        /**
         * Constructs a new AliveCheckResp.
         * @memberof Basil
         * @classdesc Represents an AliveCheckResp.
         * @implements IAliveCheckResp
         * @constructor
         * @param {Basil.IAliveCheckResp=} [properties] Properties to set
         */
        function AliveCheckResp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AliveCheckResp auth.
         * @member {BasilType.IAccessAuthorization|null|undefined} auth
         * @memberof Basil.AliveCheckResp
         * @instance
         */
        AliveCheckResp.prototype.auth = null;

        /**
         * AliveCheckResp trace.
         * @member {BasilType.ITraceInfo|null|undefined} trace
         * @memberof Basil.AliveCheckResp
         * @instance
         */
        AliveCheckResp.prototype.trace = null;

        /**
         * AliveCheckResp time.
         * @member {number|Long} time
         * @memberof Basil.AliveCheckResp
         * @instance
         */
        AliveCheckResp.prototype.time = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * AliveCheckResp sequenceNumber.
         * @member {number} sequenceNumber
         * @memberof Basil.AliveCheckResp
         * @instance
         */
        AliveCheckResp.prototype.sequenceNumber = 0;

        /**
         * AliveCheckResp timeReceived.
         * @member {number|Long} timeReceived
         * @memberof Basil.AliveCheckResp
         * @instance
         */
        AliveCheckResp.prototype.timeReceived = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * AliveCheckResp sequenceNumberReceived.
         * @member {number} sequenceNumberReceived
         * @memberof Basil.AliveCheckResp
         * @instance
         */
        AliveCheckResp.prototype.sequenceNumberReceived = 0;

        /**
         * Creates a new AliveCheckResp instance using the specified properties.
         * @function create
         * @memberof Basil.AliveCheckResp
         * @static
         * @param {Basil.IAliveCheckResp=} [properties] Properties to set
         * @returns {Basil.AliveCheckResp} AliveCheckResp instance
         */
        AliveCheckResp.create = function create(properties) {
            return new AliveCheckResp(properties);
        };

        /**
         * Encodes the specified AliveCheckResp message. Does not implicitly {@link Basil.AliveCheckResp.verify|verify} messages.
         * @function encode
         * @memberof Basil.AliveCheckResp
         * @static
         * @param {Basil.IAliveCheckResp} message AliveCheckResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AliveCheckResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.auth != null && message.hasOwnProperty("auth"))
                $root.BasilType.AccessAuthorization.encode(message.auth, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.trace != null && message.hasOwnProperty("trace"))
                $root.BasilType.TraceInfo.encode(message.trace, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.time != null && message.hasOwnProperty("time"))
                writer.uint32(/* id 3, wireType 0 =*/24).sint64(message.time);
            if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.sequenceNumber);
            if (message.timeReceived != null && message.hasOwnProperty("timeReceived"))
                writer.uint32(/* id 5, wireType 0 =*/40).sint64(message.timeReceived);
            if (message.sequenceNumberReceived != null && message.hasOwnProperty("sequenceNumberReceived"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.sequenceNumberReceived);
            return writer;
        };

        /**
         * Encodes the specified AliveCheckResp message, length delimited. Does not implicitly {@link Basil.AliveCheckResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Basil.AliveCheckResp
         * @static
         * @param {Basil.IAliveCheckResp} message AliveCheckResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AliveCheckResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AliveCheckResp message from the specified reader or buffer.
         * @function decode
         * @memberof Basil.AliveCheckResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Basil.AliveCheckResp} AliveCheckResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AliveCheckResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Basil.AliveCheckResp();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.auth = $root.BasilType.AccessAuthorization.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.trace = $root.BasilType.TraceInfo.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.time = reader.sint64();
                    break;
                case 4:
                    message.sequenceNumber = reader.int32();
                    break;
                case 5:
                    message.timeReceived = reader.sint64();
                    break;
                case 6:
                    message.sequenceNumberReceived = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AliveCheckResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Basil.AliveCheckResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Basil.AliveCheckResp} AliveCheckResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AliveCheckResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AliveCheckResp message.
         * @function verify
         * @memberof Basil.AliveCheckResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AliveCheckResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.BasilType.AccessAuthorization.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.trace != null && message.hasOwnProperty("trace")) {
                let error = $root.BasilType.TraceInfo.verify(message.trace);
                if (error)
                    return "trace." + error;
            }
            if (message.time != null && message.hasOwnProperty("time"))
                if (!$util.isInteger(message.time) && !(message.time && $util.isInteger(message.time.low) && $util.isInteger(message.time.high)))
                    return "time: integer|Long expected";
            if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                if (!$util.isInteger(message.sequenceNumber))
                    return "sequenceNumber: integer expected";
            if (message.timeReceived != null && message.hasOwnProperty("timeReceived"))
                if (!$util.isInteger(message.timeReceived) && !(message.timeReceived && $util.isInteger(message.timeReceived.low) && $util.isInteger(message.timeReceived.high)))
                    return "timeReceived: integer|Long expected";
            if (message.sequenceNumberReceived != null && message.hasOwnProperty("sequenceNumberReceived"))
                if (!$util.isInteger(message.sequenceNumberReceived))
                    return "sequenceNumberReceived: integer expected";
            return null;
        };

        /**
         * Creates an AliveCheckResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Basil.AliveCheckResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Basil.AliveCheckResp} AliveCheckResp
         */
        AliveCheckResp.fromObject = function fromObject(object) {
            if (object instanceof $root.Basil.AliveCheckResp)
                return object;
            let message = new $root.Basil.AliveCheckResp();
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".Basil.AliveCheckResp.auth: object expected");
                message.auth = $root.BasilType.AccessAuthorization.fromObject(object.auth);
            }
            if (object.trace != null) {
                if (typeof object.trace !== "object")
                    throw TypeError(".Basil.AliveCheckResp.trace: object expected");
                message.trace = $root.BasilType.TraceInfo.fromObject(object.trace);
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
            if (object.sequenceNumber != null)
                message.sequenceNumber = object.sequenceNumber | 0;
            if (object.timeReceived != null)
                if ($util.Long)
                    (message.timeReceived = $util.Long.fromValue(object.timeReceived)).unsigned = false;
                else if (typeof object.timeReceived === "string")
                    message.timeReceived = parseInt(object.timeReceived, 10);
                else if (typeof object.timeReceived === "number")
                    message.timeReceived = object.timeReceived;
                else if (typeof object.timeReceived === "object")
                    message.timeReceived = new $util.LongBits(object.timeReceived.low >>> 0, object.timeReceived.high >>> 0).toNumber();
            if (object.sequenceNumberReceived != null)
                message.sequenceNumberReceived = object.sequenceNumberReceived | 0;
            return message;
        };

        /**
         * Creates a plain object from an AliveCheckResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Basil.AliveCheckResp
         * @static
         * @param {Basil.AliveCheckResp} message AliveCheckResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AliveCheckResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.auth = null;
                object.trace = null;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.time = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.time = options.longs === String ? "0" : 0;
                object.sequenceNumber = 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.timeReceived = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timeReceived = options.longs === String ? "0" : 0;
                object.sequenceNumberReceived = 0;
            }
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.BasilType.AccessAuthorization.toObject(message.auth, options);
            if (message.trace != null && message.hasOwnProperty("trace"))
                object.trace = $root.BasilType.TraceInfo.toObject(message.trace, options);
            if (message.time != null && message.hasOwnProperty("time"))
                if (typeof message.time === "number")
                    object.time = options.longs === String ? String(message.time) : message.time;
                else
                    object.time = options.longs === String ? $util.Long.prototype.toString.call(message.time) : options.longs === Number ? new $util.LongBits(message.time.low >>> 0, message.time.high >>> 0).toNumber() : message.time;
            if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                object.sequenceNumber = message.sequenceNumber;
            if (message.timeReceived != null && message.hasOwnProperty("timeReceived"))
                if (typeof message.timeReceived === "number")
                    object.timeReceived = options.longs === String ? String(message.timeReceived) : message.timeReceived;
                else
                    object.timeReceived = options.longs === String ? $util.Long.prototype.toString.call(message.timeReceived) : options.longs === Number ? new $util.LongBits(message.timeReceived.low >>> 0, message.timeReceived.high >>> 0).toNumber() : message.timeReceived;
            if (message.sequenceNumberReceived != null && message.hasOwnProperty("sequenceNumberReceived"))
                object.sequenceNumberReceived = message.sequenceNumberReceived;
            return object;
        };

        /**
         * Converts this AliveCheckResp to JSON.
         * @function toJSON
         * @memberof Basil.AliveCheckResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AliveCheckResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AliveCheckResp;
    })();

    Basil.BasilServer = (function() {

        /**
         * Constructs a new BasilServer service.
         * @memberof Basil
         * @classdesc Represents a BasilServer
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function BasilServer(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (BasilServer.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = BasilServer;

        /**
         * Creates new BasilServer service using the specified rpc implementation.
         * @function create
         * @memberof Basil.BasilServer
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {BasilServer} RPC service. Useful where requests and/or responses are streamed.
         */
        BasilServer.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link Basil.BasilServer#identifyDisplayableObject}.
         * @memberof Basil.BasilServer
         * @typedef IdentifyDisplayableObjectCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {Basil.IdentifyDisplayableObjectResp} [response] IdentifyDisplayableObjectResp
         */

        /**
         * Calls IdentifyDisplayableObject.
         * @function identifyDisplayableObject
         * @memberof Basil.BasilServer
         * @instance
         * @param {Basil.IIdentifyDisplayableObjectReq} request IdentifyDisplayableObjectReq message or plain object
         * @param {Basil.BasilServer.IdentifyDisplayableObjectCallback} callback Node-style callback called with the error, if any, and IdentifyDisplayableObjectResp
         * @returns {undefined}
         * @variation 1
         */
        BasilServer.prototype.identifyDisplayableObject = function identifyDisplayableObject(request, callback) {
            return this.rpcCall(identifyDisplayableObject, $root.Basil.IdentifyDisplayableObjectReq, $root.Basil.IdentifyDisplayableObjectResp, request, callback);
        };

        /**
         * Calls IdentifyDisplayableObject.
         * @function identifyDisplayableObject
         * @memberof Basil.BasilServer
         * @instance
         * @param {Basil.IIdentifyDisplayableObjectReq} request IdentifyDisplayableObjectReq message or plain object
         * @returns {Promise<Basil.IdentifyDisplayableObjectResp>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link Basil.BasilServer#createObjectInstance}.
         * @memberof Basil.BasilServer
         * @typedef CreateObjectInstanceCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {Basil.CreateObjectInstanceResp} [response] CreateObjectInstanceResp
         */

        /**
         * Calls CreateObjectInstance.
         * @function createObjectInstance
         * @memberof Basil.BasilServer
         * @instance
         * @param {Basil.ICreateObjectInstanceReq} request CreateObjectInstanceReq message or plain object
         * @param {Basil.BasilServer.CreateObjectInstanceCallback} callback Node-style callback called with the error, if any, and CreateObjectInstanceResp
         * @returns {undefined}
         * @variation 1
         */
        BasilServer.prototype.createObjectInstance = function createObjectInstance(request, callback) {
            return this.rpcCall(createObjectInstance, $root.Basil.CreateObjectInstanceReq, $root.Basil.CreateObjectInstanceResp, request, callback);
        };

        /**
         * Calls CreateObjectInstance.
         * @function createObjectInstance
         * @memberof Basil.BasilServer
         * @instance
         * @param {Basil.ICreateObjectInstanceReq} request CreateObjectInstanceReq message or plain object
         * @returns {Promise<Basil.CreateObjectInstanceResp>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link Basil.BasilServer#updateObjectProperty}.
         * @memberof Basil.BasilServer
         * @typedef UpdateObjectPropertyCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {Basil.UpdateObjectPropertyResp} [response] UpdateObjectPropertyResp
         */

        /**
         * Calls UpdateObjectProperty.
         * @function updateObjectProperty
         * @memberof Basil.BasilServer
         * @instance
         * @param {Basil.IUpdateObjectPropertyReq} request UpdateObjectPropertyReq message or plain object
         * @param {Basil.BasilServer.UpdateObjectPropertyCallback} callback Node-style callback called with the error, if any, and UpdateObjectPropertyResp
         * @returns {undefined}
         * @variation 1
         */
        BasilServer.prototype.updateObjectProperty = function updateObjectProperty(request, callback) {
            return this.rpcCall(updateObjectProperty, $root.Basil.UpdateObjectPropertyReq, $root.Basil.UpdateObjectPropertyResp, request, callback);
        };

        /**
         * Calls UpdateObjectProperty.
         * @function updateObjectProperty
         * @memberof Basil.BasilServer
         * @instance
         * @param {Basil.IUpdateObjectPropertyReq} request UpdateObjectPropertyReq message or plain object
         * @returns {Promise<Basil.UpdateObjectPropertyResp>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link Basil.BasilServer#updateInstanceProperty}.
         * @memberof Basil.BasilServer
         * @typedef UpdateInstancePropertyCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {Basil.UpdateInstancePropertyResp} [response] UpdateInstancePropertyResp
         */

        /**
         * Calls UpdateInstanceProperty.
         * @function updateInstanceProperty
         * @memberof Basil.BasilServer
         * @instance
         * @param {Basil.IUpdateInstancePropertyReq} request UpdateInstancePropertyReq message or plain object
         * @param {Basil.BasilServer.UpdateInstancePropertyCallback} callback Node-style callback called with the error, if any, and UpdateInstancePropertyResp
         * @returns {undefined}
         * @variation 1
         */
        BasilServer.prototype.updateInstanceProperty = function updateInstanceProperty(request, callback) {
            return this.rpcCall(updateInstanceProperty, $root.Basil.UpdateInstancePropertyReq, $root.Basil.UpdateInstancePropertyResp, request, callback);
        };

        /**
         * Calls UpdateInstanceProperty.
         * @function updateInstanceProperty
         * @memberof Basil.BasilServer
         * @instance
         * @param {Basil.IUpdateInstancePropertyReq} request UpdateInstancePropertyReq message or plain object
         * @returns {Promise<Basil.UpdateInstancePropertyResp>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link Basil.BasilServer#updateInstancePosition}.
         * @memberof Basil.BasilServer
         * @typedef UpdateInstancePositionCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {Basil.UpdateInstancePositionResp} [response] UpdateInstancePositionResp
         */

        /**
         * Calls UpdateInstancePosition.
         * @function updateInstancePosition
         * @memberof Basil.BasilServer
         * @instance
         * @param {Basil.IUpdateInstancePositionReq} request UpdateInstancePositionReq message or plain object
         * @param {Basil.BasilServer.UpdateInstancePositionCallback} callback Node-style callback called with the error, if any, and UpdateInstancePositionResp
         * @returns {undefined}
         * @variation 1
         */
        BasilServer.prototype.updateInstancePosition = function updateInstancePosition(request, callback) {
            return this.rpcCall(updateInstancePosition, $root.Basil.UpdateInstancePositionReq, $root.Basil.UpdateInstancePositionResp, request, callback);
        };

        /**
         * Calls UpdateInstancePosition.
         * @function updateInstancePosition
         * @memberof Basil.BasilServer
         * @instance
         * @param {Basil.IUpdateInstancePositionReq} request UpdateInstancePositionReq message or plain object
         * @returns {Promise<Basil.UpdateInstancePositionResp>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link Basil.BasilServer#requestObjectProperties}.
         * @memberof Basil.BasilServer
         * @typedef RequestObjectPropertiesCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {Basil.RequestObjectPropertiesResp} [response] RequestObjectPropertiesResp
         */

        /**
         * Calls RequestObjectProperties.
         * @function requestObjectProperties
         * @memberof Basil.BasilServer
         * @instance
         * @param {Basil.IRequestObjectPropertiesReq} request RequestObjectPropertiesReq message or plain object
         * @param {Basil.BasilServer.RequestObjectPropertiesCallback} callback Node-style callback called with the error, if any, and RequestObjectPropertiesResp
         * @returns {undefined}
         * @variation 1
         */
        BasilServer.prototype.requestObjectProperties = function requestObjectProperties(request, callback) {
            return this.rpcCall(requestObjectProperties, $root.Basil.RequestObjectPropertiesReq, $root.Basil.RequestObjectPropertiesResp, request, callback);
        };

        /**
         * Calls RequestObjectProperties.
         * @function requestObjectProperties
         * @memberof Basil.BasilServer
         * @instance
         * @param {Basil.IRequestObjectPropertiesReq} request RequestObjectPropertiesReq message or plain object
         * @returns {Promise<Basil.RequestObjectPropertiesResp>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link Basil.BasilServer#requestInstanceProperties}.
         * @memberof Basil.BasilServer
         * @typedef RequestInstancePropertiesCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {Basil.RequestInstancePropertiesResp} [response] RequestInstancePropertiesResp
         */

        /**
         * Calls RequestInstanceProperties.
         * @function requestInstanceProperties
         * @memberof Basil.BasilServer
         * @instance
         * @param {Basil.IRequestInstancePropertiesReq} request RequestInstancePropertiesReq message or plain object
         * @param {Basil.BasilServer.RequestInstancePropertiesCallback} callback Node-style callback called with the error, if any, and RequestInstancePropertiesResp
         * @returns {undefined}
         * @variation 1
         */
        BasilServer.prototype.requestInstanceProperties = function requestInstanceProperties(request, callback) {
            return this.rpcCall(requestInstanceProperties, $root.Basil.RequestInstancePropertiesReq, $root.Basil.RequestInstancePropertiesResp, request, callback);
        };

        /**
         * Calls RequestInstanceProperties.
         * @function requestInstanceProperties
         * @memberof Basil.BasilServer
         * @instance
         * @param {Basil.IRequestInstancePropertiesReq} request RequestInstancePropertiesReq message or plain object
         * @returns {Promise<Basil.RequestInstancePropertiesResp>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link Basil.BasilServer#openSession}.
         * @memberof Basil.BasilServer
         * @typedef OpenSessionCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {Basil.OpenSessionResp} [response] OpenSessionResp
         */

        /**
         * Calls OpenSession.
         * @function openSession
         * @memberof Basil.BasilServer
         * @instance
         * @param {Basil.IOpenSessionReq} request OpenSessionReq message or plain object
         * @param {Basil.BasilServer.OpenSessionCallback} callback Node-style callback called with the error, if any, and OpenSessionResp
         * @returns {undefined}
         * @variation 1
         */
        BasilServer.prototype.openSession = function openSession(request, callback) {
            return this.rpcCall(openSession, $root.Basil.OpenSessionReq, $root.Basil.OpenSessionResp, request, callback);
        };

        /**
         * Calls OpenSession.
         * @function openSession
         * @memberof Basil.BasilServer
         * @instance
         * @param {Basil.IOpenSessionReq} request OpenSessionReq message or plain object
         * @returns {Promise<Basil.OpenSessionResp>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link Basil.BasilServer#closeSession}.
         * @memberof Basil.BasilServer
         * @typedef CloseSessionCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {Basil.CloseSessionResp} [response] CloseSessionResp
         */

        /**
         * Calls CloseSession.
         * @function closeSession
         * @memberof Basil.BasilServer
         * @instance
         * @param {Basil.ICloseSessionReq} request CloseSessionReq message or plain object
         * @param {Basil.BasilServer.CloseSessionCallback} callback Node-style callback called with the error, if any, and CloseSessionResp
         * @returns {undefined}
         * @variation 1
         */
        BasilServer.prototype.closeSession = function closeSession(request, callback) {
            return this.rpcCall(closeSession, $root.Basil.CloseSessionReq, $root.Basil.CloseSessionResp, request, callback);
        };

        /**
         * Calls CloseSession.
         * @function closeSession
         * @memberof Basil.BasilServer
         * @instance
         * @param {Basil.ICloseSessionReq} request CloseSessionReq message or plain object
         * @returns {Promise<Basil.CloseSessionResp>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link Basil.BasilServer#aliveCheck}.
         * @memberof Basil.BasilServer
         * @typedef AliveCheckCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {Basil.AliveCheckResp} [response] AliveCheckResp
         */

        /**
         * Calls AliveCheck.
         * @function aliveCheck
         * @memberof Basil.BasilServer
         * @instance
         * @param {Basil.IAliveCheckReq} request AliveCheckReq message or plain object
         * @param {Basil.BasilServer.AliveCheckCallback} callback Node-style callback called with the error, if any, and AliveCheckResp
         * @returns {undefined}
         * @variation 1
         */
        BasilServer.prototype.aliveCheck = function aliveCheck(request, callback) {
            return this.rpcCall(aliveCheck, $root.Basil.AliveCheckReq, $root.Basil.AliveCheckResp, request, callback);
        };

        /**
         * Calls AliveCheck.
         * @function aliveCheck
         * @memberof Basil.BasilServer
         * @instance
         * @param {Basil.IAliveCheckReq} request AliveCheckReq message or plain object
         * @returns {Promise<Basil.AliveCheckResp>} Promise
         * @variation 2
         */

        return BasilServer;
    })();

    return Basil;
})();

export const BasilType = $root.BasilType = (() => {

    /**
     * Namespace BasilType.
     * @exports BasilType
     * @namespace
     */
    const BasilType = {};

    BasilType.Vector3 = (function() {

        /**
         * Properties of a Vector3.
         * @memberof BasilType
         * @interface IVector3
         * @property {number|null} [X] Vector3 X
         * @property {number|null} [Y] Vector3 Y
         * @property {number|null} [Z] Vector3 Z
         */

        /**
         * Constructs a new Vector3.
         * @memberof BasilType
         * @classdesc Represents a Vector3.
         * @implements IVector3
         * @constructor
         * @param {BasilType.IVector3=} [properties] Properties to set
         */
        function Vector3(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Vector3 X.
         * @member {number} X
         * @memberof BasilType.Vector3
         * @instance
         */
        Vector3.prototype.X = 0;

        /**
         * Vector3 Y.
         * @member {number} Y
         * @memberof BasilType.Vector3
         * @instance
         */
        Vector3.prototype.Y = 0;

        /**
         * Vector3 Z.
         * @member {number} Z
         * @memberof BasilType.Vector3
         * @instance
         */
        Vector3.prototype.Z = 0;

        /**
         * Creates a new Vector3 instance using the specified properties.
         * @function create
         * @memberof BasilType.Vector3
         * @static
         * @param {BasilType.IVector3=} [properties] Properties to set
         * @returns {BasilType.Vector3} Vector3 instance
         */
        Vector3.create = function create(properties) {
            return new Vector3(properties);
        };

        /**
         * Encodes the specified Vector3 message. Does not implicitly {@link BasilType.Vector3.verify|verify} messages.
         * @function encode
         * @memberof BasilType.Vector3
         * @static
         * @param {BasilType.IVector3} message Vector3 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Vector3.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.X != null && message.hasOwnProperty("X"))
                writer.uint32(/* id 1, wireType 1 =*/9).double(message.X);
            if (message.Y != null && message.hasOwnProperty("Y"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.Y);
            if (message.Z != null && message.hasOwnProperty("Z"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.Z);
            return writer;
        };

        /**
         * Encodes the specified Vector3 message, length delimited. Does not implicitly {@link BasilType.Vector3.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BasilType.Vector3
         * @static
         * @param {BasilType.IVector3} message Vector3 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Vector3.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Vector3 message from the specified reader or buffer.
         * @function decode
         * @memberof BasilType.Vector3
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BasilType.Vector3} Vector3
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
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

        /**
         * Decodes a Vector3 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BasilType.Vector3
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BasilType.Vector3} Vector3
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Vector3.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Vector3 message.
         * @function verify
         * @memberof BasilType.Vector3
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
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

        /**
         * Creates a Vector3 message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BasilType.Vector3
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BasilType.Vector3} Vector3
         */
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

        /**
         * Creates a plain object from a Vector3 message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BasilType.Vector3
         * @static
         * @param {BasilType.Vector3} message Vector3
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this Vector3 to JSON.
         * @function toJSON
         * @memberof BasilType.Vector3
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Vector3.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Vector3;
    })();

    BasilType.Quaternion = (function() {

        /**
         * Properties of a Quaternion.
         * @memberof BasilType
         * @interface IQuaternion
         * @property {number|null} [X] Quaternion X
         * @property {number|null} [Y] Quaternion Y
         * @property {number|null} [Z] Quaternion Z
         * @property {number|null} [W] Quaternion W
         */

        /**
         * Constructs a new Quaternion.
         * @memberof BasilType
         * @classdesc Represents a Quaternion.
         * @implements IQuaternion
         * @constructor
         * @param {BasilType.IQuaternion=} [properties] Properties to set
         */
        function Quaternion(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Quaternion X.
         * @member {number} X
         * @memberof BasilType.Quaternion
         * @instance
         */
        Quaternion.prototype.X = 0;

        /**
         * Quaternion Y.
         * @member {number} Y
         * @memberof BasilType.Quaternion
         * @instance
         */
        Quaternion.prototype.Y = 0;

        /**
         * Quaternion Z.
         * @member {number} Z
         * @memberof BasilType.Quaternion
         * @instance
         */
        Quaternion.prototype.Z = 0;

        /**
         * Quaternion W.
         * @member {number} W
         * @memberof BasilType.Quaternion
         * @instance
         */
        Quaternion.prototype.W = 0;

        /**
         * Creates a new Quaternion instance using the specified properties.
         * @function create
         * @memberof BasilType.Quaternion
         * @static
         * @param {BasilType.IQuaternion=} [properties] Properties to set
         * @returns {BasilType.Quaternion} Quaternion instance
         */
        Quaternion.create = function create(properties) {
            return new Quaternion(properties);
        };

        /**
         * Encodes the specified Quaternion message. Does not implicitly {@link BasilType.Quaternion.verify|verify} messages.
         * @function encode
         * @memberof BasilType.Quaternion
         * @static
         * @param {BasilType.IQuaternion} message Quaternion message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Quaternion.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.X != null && message.hasOwnProperty("X"))
                writer.uint32(/* id 1, wireType 1 =*/9).double(message.X);
            if (message.Y != null && message.hasOwnProperty("Y"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.Y);
            if (message.Z != null && message.hasOwnProperty("Z"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.Z);
            if (message.W != null && message.hasOwnProperty("W"))
                writer.uint32(/* id 4, wireType 1 =*/33).double(message.W);
            return writer;
        };

        /**
         * Encodes the specified Quaternion message, length delimited. Does not implicitly {@link BasilType.Quaternion.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BasilType.Quaternion
         * @static
         * @param {BasilType.IQuaternion} message Quaternion message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Quaternion.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Quaternion message from the specified reader or buffer.
         * @function decode
         * @memberof BasilType.Quaternion
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BasilType.Quaternion} Quaternion
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
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

        /**
         * Decodes a Quaternion message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BasilType.Quaternion
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BasilType.Quaternion} Quaternion
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Quaternion.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Quaternion message.
         * @function verify
         * @memberof BasilType.Quaternion
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
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

        /**
         * Creates a Quaternion message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BasilType.Quaternion
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BasilType.Quaternion} Quaternion
         */
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

        /**
         * Creates a plain object from a Quaternion message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BasilType.Quaternion
         * @static
         * @param {BasilType.Quaternion} message Quaternion
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this Quaternion to JSON.
         * @function toJSON
         * @memberof BasilType.Quaternion
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Quaternion.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Quaternion;
    })();

    BasilType.Transform = (function() {

        /**
         * Properties of a Transform.
         * @memberof BasilType
         * @interface ITransform
         * @property {Array.<number>|null} [matrix] Transform matrix
         * @property {BasilType.IVector3|null} [origin] Transform origin
         */

        /**
         * Constructs a new Transform.
         * @memberof BasilType
         * @classdesc Represents a Transform.
         * @implements ITransform
         * @constructor
         * @param {BasilType.ITransform=} [properties] Properties to set
         */
        function Transform(properties) {
            this.matrix = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Transform matrix.
         * @member {Array.<number>} matrix
         * @memberof BasilType.Transform
         * @instance
         */
        Transform.prototype.matrix = $util.emptyArray;

        /**
         * Transform origin.
         * @member {BasilType.IVector3|null|undefined} origin
         * @memberof BasilType.Transform
         * @instance
         */
        Transform.prototype.origin = null;

        /**
         * Creates a new Transform instance using the specified properties.
         * @function create
         * @memberof BasilType.Transform
         * @static
         * @param {BasilType.ITransform=} [properties] Properties to set
         * @returns {BasilType.Transform} Transform instance
         */
        Transform.create = function create(properties) {
            return new Transform(properties);
        };

        /**
         * Encodes the specified Transform message. Does not implicitly {@link BasilType.Transform.verify|verify} messages.
         * @function encode
         * @memberof BasilType.Transform
         * @static
         * @param {BasilType.ITransform} message Transform message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Transform.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.matrix != null && message.matrix.length) {
                writer.uint32(/* id 1, wireType 2 =*/10).fork();
                for (let i = 0; i < message.matrix.length; ++i)
                    writer.double(message.matrix[i]);
                writer.ldelim();
            }
            if (message.origin != null && message.hasOwnProperty("origin"))
                $root.BasilType.Vector3.encode(message.origin, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Transform message, length delimited. Does not implicitly {@link BasilType.Transform.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BasilType.Transform
         * @static
         * @param {BasilType.ITransform} message Transform message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Transform.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Transform message from the specified reader or buffer.
         * @function decode
         * @memberof BasilType.Transform
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BasilType.Transform} Transform
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
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

        /**
         * Decodes a Transform message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BasilType.Transform
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BasilType.Transform} Transform
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Transform.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Transform message.
         * @function verify
         * @memberof BasilType.Transform
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
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

        /**
         * Creates a Transform message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BasilType.Transform
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BasilType.Transform} Transform
         */
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

        /**
         * Creates a plain object from a Transform message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BasilType.Transform
         * @static
         * @param {BasilType.Transform} message Transform
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this Transform to JSON.
         * @function toJSON
         * @memberof BasilType.Transform
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Transform.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Transform;
    })();

    BasilType.PropertyList = (function() {

        /**
         * Properties of a PropertyList.
         * @memberof BasilType
         * @interface IPropertyList
         * @property {Object.<string,string>|null} [list] PropertyList list
         */

        /**
         * Constructs a new PropertyList.
         * @memberof BasilType
         * @classdesc Represents a PropertyList.
         * @implements IPropertyList
         * @constructor
         * @param {BasilType.IPropertyList=} [properties] Properties to set
         */
        function PropertyList(properties) {
            this.list = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PropertyList list.
         * @member {Object.<string,string>} list
         * @memberof BasilType.PropertyList
         * @instance
         */
        PropertyList.prototype.list = $util.emptyObject;

        /**
         * Creates a new PropertyList instance using the specified properties.
         * @function create
         * @memberof BasilType.PropertyList
         * @static
         * @param {BasilType.IPropertyList=} [properties] Properties to set
         * @returns {BasilType.PropertyList} PropertyList instance
         */
        PropertyList.create = function create(properties) {
            return new PropertyList(properties);
        };

        /**
         * Encodes the specified PropertyList message. Does not implicitly {@link BasilType.PropertyList.verify|verify} messages.
         * @function encode
         * @memberof BasilType.PropertyList
         * @static
         * @param {BasilType.IPropertyList} message PropertyList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PropertyList.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.list != null && message.hasOwnProperty("list"))
                for (let keys = Object.keys(message.list), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.list[keys[i]]).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PropertyList message, length delimited. Does not implicitly {@link BasilType.PropertyList.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BasilType.PropertyList
         * @static
         * @param {BasilType.IPropertyList} message PropertyList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PropertyList.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PropertyList message from the specified reader or buffer.
         * @function decode
         * @memberof BasilType.PropertyList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BasilType.PropertyList} PropertyList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
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

        /**
         * Decodes a PropertyList message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BasilType.PropertyList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BasilType.PropertyList} PropertyList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PropertyList.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PropertyList message.
         * @function verify
         * @memberof BasilType.PropertyList
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
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

        /**
         * Creates a PropertyList message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BasilType.PropertyList
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BasilType.PropertyList} PropertyList
         */
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

        /**
         * Creates a plain object from a PropertyList message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BasilType.PropertyList
         * @static
         * @param {BasilType.PropertyList} message PropertyList
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this PropertyList to JSON.
         * @function toJSON
         * @memberof BasilType.PropertyList
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PropertyList.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PropertyList;
    })();

    BasilType.BasilException = (function() {

        /**
         * Properties of a BasilException.
         * @memberof BasilType
         * @interface IBasilException
         * @property {number|null} [reason] BasilException reason
         * @property {Object.<string,string>|null} [hints] BasilException hints
         */

        /**
         * Constructs a new BasilException.
         * @memberof BasilType
         * @classdesc Represents a BasilException.
         * @implements IBasilException
         * @constructor
         * @param {BasilType.IBasilException=} [properties] Properties to set
         */
        function BasilException(properties) {
            this.hints = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BasilException reason.
         * @member {number} reason
         * @memberof BasilType.BasilException
         * @instance
         */
        BasilException.prototype.reason = 0;

        /**
         * BasilException hints.
         * @member {Object.<string,string>} hints
         * @memberof BasilType.BasilException
         * @instance
         */
        BasilException.prototype.hints = $util.emptyObject;

        /**
         * Creates a new BasilException instance using the specified properties.
         * @function create
         * @memberof BasilType.BasilException
         * @static
         * @param {BasilType.IBasilException=} [properties] Properties to set
         * @returns {BasilType.BasilException} BasilException instance
         */
        BasilException.create = function create(properties) {
            return new BasilException(properties);
        };

        /**
         * Encodes the specified BasilException message. Does not implicitly {@link BasilType.BasilException.verify|verify} messages.
         * @function encode
         * @memberof BasilType.BasilException
         * @static
         * @param {BasilType.IBasilException} message BasilException message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BasilException.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.reason != null && message.hasOwnProperty("reason"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.reason);
            if (message.hints != null && message.hasOwnProperty("hints"))
                for (let keys = Object.keys(message.hints), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.hints[keys[i]]).ldelim();
            return writer;
        };

        /**
         * Encodes the specified BasilException message, length delimited. Does not implicitly {@link BasilType.BasilException.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BasilType.BasilException
         * @static
         * @param {BasilType.IBasilException} message BasilException message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BasilException.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BasilException message from the specified reader or buffer.
         * @function decode
         * @memberof BasilType.BasilException
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BasilType.BasilException} BasilException
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
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

        /**
         * Decodes a BasilException message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BasilType.BasilException
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BasilType.BasilException} BasilException
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BasilException.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BasilException message.
         * @function verify
         * @memberof BasilType.BasilException
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
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

        /**
         * Creates a BasilException message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BasilType.BasilException
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BasilType.BasilException} BasilException
         */
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

        /**
         * Creates a plain object from a BasilException message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BasilType.BasilException
         * @static
         * @param {BasilType.BasilException} message BasilException
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this BasilException to JSON.
         * @function toJSON
         * @memberof BasilType.BasilException
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BasilException.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BasilException;
    })();

    /**
     * CoordSystem enum.
     * @name BasilType.CoordSystem
     * @enum {string}
     * @property {number} WGS86=0 WGS86 value
     * @property {number} CAMERA=1 CAMERA value
     * @property {number} CAMERAABS=2 CAMERAABS value
     * @property {number} VIRTUAL=3 VIRTUAL value
     * @property {number} MOON=4 MOON value
     * @property {number} MARS=5 MARS value
     * @property {number} REL1=6 REL1 value
     * @property {number} REL2=7 REL2 value
     * @property {number} REL3=8 REL3 value
     */
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

    /**
     * RotationSystem enum.
     * @name BasilType.RotationSystem
     * @enum {string}
     * @property {number} WORLDR=0 WORLDR value
     * @property {number} FORR=1 FORR value
     * @property {number} CAMERAR=2 CAMERAR value
     */
    BasilType.RotationSystem = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "WORLDR"] = 0;
        values[valuesById[1] = "FORR"] = 1;
        values[valuesById[2] = "CAMERAR"] = 2;
        return values;
    })();

    BasilType.CoordPosition = (function() {

        /**
         * Properties of a CoordPosition.
         * @memberof BasilType
         * @interface ICoordPosition
         * @property {BasilType.IVector3|null} [pos] CoordPosition pos
         * @property {BasilType.IQuaternion|null} [rot] CoordPosition rot
         * @property {BasilType.CoordSystem|null} [posRef] CoordPosition posRef
         * @property {BasilType.RotationSystem|null} [rotRef] CoordPosition rotRef
         */

        /**
         * Constructs a new CoordPosition.
         * @memberof BasilType
         * @classdesc Represents a CoordPosition.
         * @implements ICoordPosition
         * @constructor
         * @param {BasilType.ICoordPosition=} [properties] Properties to set
         */
        function CoordPosition(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CoordPosition pos.
         * @member {BasilType.IVector3|null|undefined} pos
         * @memberof BasilType.CoordPosition
         * @instance
         */
        CoordPosition.prototype.pos = null;

        /**
         * CoordPosition rot.
         * @member {BasilType.IQuaternion|null|undefined} rot
         * @memberof BasilType.CoordPosition
         * @instance
         */
        CoordPosition.prototype.rot = null;

        /**
         * CoordPosition posRef.
         * @member {BasilType.CoordSystem} posRef
         * @memberof BasilType.CoordPosition
         * @instance
         */
        CoordPosition.prototype.posRef = 0;

        /**
         * CoordPosition rotRef.
         * @member {BasilType.RotationSystem} rotRef
         * @memberof BasilType.CoordPosition
         * @instance
         */
        CoordPosition.prototype.rotRef = 0;

        /**
         * Creates a new CoordPosition instance using the specified properties.
         * @function create
         * @memberof BasilType.CoordPosition
         * @static
         * @param {BasilType.ICoordPosition=} [properties] Properties to set
         * @returns {BasilType.CoordPosition} CoordPosition instance
         */
        CoordPosition.create = function create(properties) {
            return new CoordPosition(properties);
        };

        /**
         * Encodes the specified CoordPosition message. Does not implicitly {@link BasilType.CoordPosition.verify|verify} messages.
         * @function encode
         * @memberof BasilType.CoordPosition
         * @static
         * @param {BasilType.ICoordPosition} message CoordPosition message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CoordPosition.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.pos != null && message.hasOwnProperty("pos"))
                $root.BasilType.Vector3.encode(message.pos, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.rot != null && message.hasOwnProperty("rot"))
                $root.BasilType.Quaternion.encode(message.rot, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.posRef != null && message.hasOwnProperty("posRef"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.posRef);
            if (message.rotRef != null && message.hasOwnProperty("rotRef"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.rotRef);
            return writer;
        };

        /**
         * Encodes the specified CoordPosition message, length delimited. Does not implicitly {@link BasilType.CoordPosition.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BasilType.CoordPosition
         * @static
         * @param {BasilType.ICoordPosition} message CoordPosition message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CoordPosition.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CoordPosition message from the specified reader or buffer.
         * @function decode
         * @memberof BasilType.CoordPosition
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BasilType.CoordPosition} CoordPosition
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
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

        /**
         * Decodes a CoordPosition message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BasilType.CoordPosition
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BasilType.CoordPosition} CoordPosition
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CoordPosition.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CoordPosition message.
         * @function verify
         * @memberof BasilType.CoordPosition
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
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

        /**
         * Creates a CoordPosition message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BasilType.CoordPosition
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BasilType.CoordPosition} CoordPosition
         */
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

        /**
         * Creates a plain object from a CoordPosition message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BasilType.CoordPosition
         * @static
         * @param {BasilType.CoordPosition} message CoordPosition
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this CoordPosition to JSON.
         * @function toJSON
         * @memberof BasilType.CoordPosition
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CoordPosition.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CoordPosition;
    })();

    BasilType.ObjectIdentifier = (function() {

        /**
         * Properties of an ObjectIdentifier.
         * @memberof BasilType
         * @interface IObjectIdentifier
         * @property {string|null} [id] ObjectIdentifier id
         */

        /**
         * Constructs a new ObjectIdentifier.
         * @memberof BasilType
         * @classdesc Represents an ObjectIdentifier.
         * @implements IObjectIdentifier
         * @constructor
         * @param {BasilType.IObjectIdentifier=} [properties] Properties to set
         */
        function ObjectIdentifier(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ObjectIdentifier id.
         * @member {string} id
         * @memberof BasilType.ObjectIdentifier
         * @instance
         */
        ObjectIdentifier.prototype.id = "";

        /**
         * Creates a new ObjectIdentifier instance using the specified properties.
         * @function create
         * @memberof BasilType.ObjectIdentifier
         * @static
         * @param {BasilType.IObjectIdentifier=} [properties] Properties to set
         * @returns {BasilType.ObjectIdentifier} ObjectIdentifier instance
         */
        ObjectIdentifier.create = function create(properties) {
            return new ObjectIdentifier(properties);
        };

        /**
         * Encodes the specified ObjectIdentifier message. Does not implicitly {@link BasilType.ObjectIdentifier.verify|verify} messages.
         * @function encode
         * @memberof BasilType.ObjectIdentifier
         * @static
         * @param {BasilType.IObjectIdentifier} message ObjectIdentifier message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ObjectIdentifier.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && message.hasOwnProperty("id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            return writer;
        };

        /**
         * Encodes the specified ObjectIdentifier message, length delimited. Does not implicitly {@link BasilType.ObjectIdentifier.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BasilType.ObjectIdentifier
         * @static
         * @param {BasilType.IObjectIdentifier} message ObjectIdentifier message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ObjectIdentifier.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ObjectIdentifier message from the specified reader or buffer.
         * @function decode
         * @memberof BasilType.ObjectIdentifier
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BasilType.ObjectIdentifier} ObjectIdentifier
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
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

        /**
         * Decodes an ObjectIdentifier message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BasilType.ObjectIdentifier
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BasilType.ObjectIdentifier} ObjectIdentifier
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ObjectIdentifier.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ObjectIdentifier message.
         * @function verify
         * @memberof BasilType.ObjectIdentifier
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ObjectIdentifier.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            return null;
        };

        /**
         * Creates an ObjectIdentifier message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BasilType.ObjectIdentifier
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BasilType.ObjectIdentifier} ObjectIdentifier
         */
        ObjectIdentifier.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.ObjectIdentifier)
                return object;
            let message = new $root.BasilType.ObjectIdentifier();
            if (object.id != null)
                message.id = String(object.id);
            return message;
        };

        /**
         * Creates a plain object from an ObjectIdentifier message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BasilType.ObjectIdentifier
         * @static
         * @param {BasilType.ObjectIdentifier} message ObjectIdentifier
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this ObjectIdentifier to JSON.
         * @function toJSON
         * @memberof BasilType.ObjectIdentifier
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ObjectIdentifier.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ObjectIdentifier;
    })();

    BasilType.InstanceIdentifier = (function() {

        /**
         * Properties of an InstanceIdentifier.
         * @memberof BasilType
         * @interface IInstanceIdentifier
         * @property {number|null} [id] InstanceIdentifier id
         */

        /**
         * Constructs a new InstanceIdentifier.
         * @memberof BasilType
         * @classdesc Represents an InstanceIdentifier.
         * @implements IInstanceIdentifier
         * @constructor
         * @param {BasilType.IInstanceIdentifier=} [properties] Properties to set
         */
        function InstanceIdentifier(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * InstanceIdentifier id.
         * @member {number} id
         * @memberof BasilType.InstanceIdentifier
         * @instance
         */
        InstanceIdentifier.prototype.id = 0;

        /**
         * Creates a new InstanceIdentifier instance using the specified properties.
         * @function create
         * @memberof BasilType.InstanceIdentifier
         * @static
         * @param {BasilType.IInstanceIdentifier=} [properties] Properties to set
         * @returns {BasilType.InstanceIdentifier} InstanceIdentifier instance
         */
        InstanceIdentifier.create = function create(properties) {
            return new InstanceIdentifier(properties);
        };

        /**
         * Encodes the specified InstanceIdentifier message. Does not implicitly {@link BasilType.InstanceIdentifier.verify|verify} messages.
         * @function encode
         * @memberof BasilType.InstanceIdentifier
         * @static
         * @param {BasilType.IInstanceIdentifier} message InstanceIdentifier message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InstanceIdentifier.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && message.hasOwnProperty("id"))
                writer.uint32(/* id 1, wireType 0 =*/8).sint32(message.id);
            return writer;
        };

        /**
         * Encodes the specified InstanceIdentifier message, length delimited. Does not implicitly {@link BasilType.InstanceIdentifier.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BasilType.InstanceIdentifier
         * @static
         * @param {BasilType.IInstanceIdentifier} message InstanceIdentifier message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InstanceIdentifier.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an InstanceIdentifier message from the specified reader or buffer.
         * @function decode
         * @memberof BasilType.InstanceIdentifier
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BasilType.InstanceIdentifier} InstanceIdentifier
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
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

        /**
         * Decodes an InstanceIdentifier message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BasilType.InstanceIdentifier
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BasilType.InstanceIdentifier} InstanceIdentifier
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InstanceIdentifier.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an InstanceIdentifier message.
         * @function verify
         * @memberof BasilType.InstanceIdentifier
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        InstanceIdentifier.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            return null;
        };

        /**
         * Creates an InstanceIdentifier message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BasilType.InstanceIdentifier
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BasilType.InstanceIdentifier} InstanceIdentifier
         */
        InstanceIdentifier.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.InstanceIdentifier)
                return object;
            let message = new $root.BasilType.InstanceIdentifier();
            if (object.id != null)
                message.id = object.id | 0;
            return message;
        };

        /**
         * Creates a plain object from an InstanceIdentifier message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BasilType.InstanceIdentifier
         * @static
         * @param {BasilType.InstanceIdentifier} message InstanceIdentifier
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this InstanceIdentifier to JSON.
         * @function toJSON
         * @memberof BasilType.InstanceIdentifier
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        InstanceIdentifier.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return InstanceIdentifier;
    })();

    BasilType.AaBoundingBox = (function() {

        /**
         * Properties of an AaBoundingBox.
         * @memberof BasilType
         * @interface IAaBoundingBox
         * @property {BasilType.IVector3|null} [upperFrontLeft] AaBoundingBox upperFrontLeft
         * @property {BasilType.IVector3|null} [lowerBackRight] AaBoundingBox lowerBackRight
         */

        /**
         * Constructs a new AaBoundingBox.
         * @memberof BasilType
         * @classdesc Represents an AaBoundingBox.
         * @implements IAaBoundingBox
         * @constructor
         * @param {BasilType.IAaBoundingBox=} [properties] Properties to set
         */
        function AaBoundingBox(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AaBoundingBox upperFrontLeft.
         * @member {BasilType.IVector3|null|undefined} upperFrontLeft
         * @memberof BasilType.AaBoundingBox
         * @instance
         */
        AaBoundingBox.prototype.upperFrontLeft = null;

        /**
         * AaBoundingBox lowerBackRight.
         * @member {BasilType.IVector3|null|undefined} lowerBackRight
         * @memberof BasilType.AaBoundingBox
         * @instance
         */
        AaBoundingBox.prototype.lowerBackRight = null;

        /**
         * Creates a new AaBoundingBox instance using the specified properties.
         * @function create
         * @memberof BasilType.AaBoundingBox
         * @static
         * @param {BasilType.IAaBoundingBox=} [properties] Properties to set
         * @returns {BasilType.AaBoundingBox} AaBoundingBox instance
         */
        AaBoundingBox.create = function create(properties) {
            return new AaBoundingBox(properties);
        };

        /**
         * Encodes the specified AaBoundingBox message. Does not implicitly {@link BasilType.AaBoundingBox.verify|verify} messages.
         * @function encode
         * @memberof BasilType.AaBoundingBox
         * @static
         * @param {BasilType.IAaBoundingBox} message AaBoundingBox message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AaBoundingBox.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.upperFrontLeft != null && message.hasOwnProperty("upperFrontLeft"))
                $root.BasilType.Vector3.encode(message.upperFrontLeft, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.lowerBackRight != null && message.hasOwnProperty("lowerBackRight"))
                $root.BasilType.Vector3.encode(message.lowerBackRight, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified AaBoundingBox message, length delimited. Does not implicitly {@link BasilType.AaBoundingBox.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BasilType.AaBoundingBox
         * @static
         * @param {BasilType.IAaBoundingBox} message AaBoundingBox message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AaBoundingBox.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AaBoundingBox message from the specified reader or buffer.
         * @function decode
         * @memberof BasilType.AaBoundingBox
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BasilType.AaBoundingBox} AaBoundingBox
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
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

        /**
         * Decodes an AaBoundingBox message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BasilType.AaBoundingBox
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BasilType.AaBoundingBox} AaBoundingBox
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AaBoundingBox.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AaBoundingBox message.
         * @function verify
         * @memberof BasilType.AaBoundingBox
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
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

        /**
         * Creates an AaBoundingBox message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BasilType.AaBoundingBox
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BasilType.AaBoundingBox} AaBoundingBox
         */
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

        /**
         * Creates a plain object from an AaBoundingBox message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BasilType.AaBoundingBox
         * @static
         * @param {BasilType.AaBoundingBox} message AaBoundingBox
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this AaBoundingBox to JSON.
         * @function toJSON
         * @memberof BasilType.AaBoundingBox
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AaBoundingBox.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AaBoundingBox;
    })();

    BasilType.ObjectDisplayInfo = (function() {

        /**
         * Properties of an ObjectDisplayInfo.
         * @memberof BasilType
         * @interface IObjectDisplayInfo
         * @property {BasilType.IAaBoundingBox|null} [aabb] ObjectDisplayInfo aabb
         */

        /**
         * Constructs a new ObjectDisplayInfo.
         * @memberof BasilType
         * @classdesc Represents an ObjectDisplayInfo.
         * @implements IObjectDisplayInfo
         * @constructor
         * @param {BasilType.IObjectDisplayInfo=} [properties] Properties to set
         */
        function ObjectDisplayInfo(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ObjectDisplayInfo aabb.
         * @member {BasilType.IAaBoundingBox|null|undefined} aabb
         * @memberof BasilType.ObjectDisplayInfo
         * @instance
         */
        ObjectDisplayInfo.prototype.aabb = null;

        /**
         * Creates a new ObjectDisplayInfo instance using the specified properties.
         * @function create
         * @memberof BasilType.ObjectDisplayInfo
         * @static
         * @param {BasilType.IObjectDisplayInfo=} [properties] Properties to set
         * @returns {BasilType.ObjectDisplayInfo} ObjectDisplayInfo instance
         */
        ObjectDisplayInfo.create = function create(properties) {
            return new ObjectDisplayInfo(properties);
        };

        /**
         * Encodes the specified ObjectDisplayInfo message. Does not implicitly {@link BasilType.ObjectDisplayInfo.verify|verify} messages.
         * @function encode
         * @memberof BasilType.ObjectDisplayInfo
         * @static
         * @param {BasilType.IObjectDisplayInfo} message ObjectDisplayInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ObjectDisplayInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.aabb != null && message.hasOwnProperty("aabb"))
                $root.BasilType.AaBoundingBox.encode(message.aabb, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ObjectDisplayInfo message, length delimited. Does not implicitly {@link BasilType.ObjectDisplayInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BasilType.ObjectDisplayInfo
         * @static
         * @param {BasilType.IObjectDisplayInfo} message ObjectDisplayInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ObjectDisplayInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ObjectDisplayInfo message from the specified reader or buffer.
         * @function decode
         * @memberof BasilType.ObjectDisplayInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BasilType.ObjectDisplayInfo} ObjectDisplayInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
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

        /**
         * Decodes an ObjectDisplayInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BasilType.ObjectDisplayInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BasilType.ObjectDisplayInfo} ObjectDisplayInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ObjectDisplayInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ObjectDisplayInfo message.
         * @function verify
         * @memberof BasilType.ObjectDisplayInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
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

        /**
         * Creates an ObjectDisplayInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BasilType.ObjectDisplayInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BasilType.ObjectDisplayInfo} ObjectDisplayInfo
         */
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

        /**
         * Creates a plain object from an ObjectDisplayInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BasilType.ObjectDisplayInfo
         * @static
         * @param {BasilType.ObjectDisplayInfo} message ObjectDisplayInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this ObjectDisplayInfo to JSON.
         * @function toJSON
         * @memberof BasilType.ObjectDisplayInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ObjectDisplayInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ObjectDisplayInfo;
    })();

    BasilType.AssetInformation = (function() {

        /**
         * Properties of an AssetInformation.
         * @memberof BasilType
         * @interface IAssetInformation
         * @property {BasilType.IObjectIdentifier|null} [id] AssetInformation id
         * @property {BasilType.IObjectDisplayInfo|null} [displayInfo] AssetInformation displayInfo
         */

        /**
         * Constructs a new AssetInformation.
         * @memberof BasilType
         * @classdesc Represents an AssetInformation.
         * @implements IAssetInformation
         * @constructor
         * @param {BasilType.IAssetInformation=} [properties] Properties to set
         */
        function AssetInformation(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AssetInformation id.
         * @member {BasilType.IObjectIdentifier|null|undefined} id
         * @memberof BasilType.AssetInformation
         * @instance
         */
        AssetInformation.prototype.id = null;

        /**
         * AssetInformation displayInfo.
         * @member {BasilType.IObjectDisplayInfo|null|undefined} displayInfo
         * @memberof BasilType.AssetInformation
         * @instance
         */
        AssetInformation.prototype.displayInfo = null;

        /**
         * Creates a new AssetInformation instance using the specified properties.
         * @function create
         * @memberof BasilType.AssetInformation
         * @static
         * @param {BasilType.IAssetInformation=} [properties] Properties to set
         * @returns {BasilType.AssetInformation} AssetInformation instance
         */
        AssetInformation.create = function create(properties) {
            return new AssetInformation(properties);
        };

        /**
         * Encodes the specified AssetInformation message. Does not implicitly {@link BasilType.AssetInformation.verify|verify} messages.
         * @function encode
         * @memberof BasilType.AssetInformation
         * @static
         * @param {BasilType.IAssetInformation} message AssetInformation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AssetInformation.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && message.hasOwnProperty("id"))
                $root.BasilType.ObjectIdentifier.encode(message.id, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.displayInfo != null && message.hasOwnProperty("displayInfo"))
                $root.BasilType.ObjectDisplayInfo.encode(message.displayInfo, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified AssetInformation message, length delimited. Does not implicitly {@link BasilType.AssetInformation.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BasilType.AssetInformation
         * @static
         * @param {BasilType.IAssetInformation} message AssetInformation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AssetInformation.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AssetInformation message from the specified reader or buffer.
         * @function decode
         * @memberof BasilType.AssetInformation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BasilType.AssetInformation} AssetInformation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
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

        /**
         * Decodes an AssetInformation message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BasilType.AssetInformation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BasilType.AssetInformation} AssetInformation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AssetInformation.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AssetInformation message.
         * @function verify
         * @memberof BasilType.AssetInformation
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
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

        /**
         * Creates an AssetInformation message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BasilType.AssetInformation
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BasilType.AssetInformation} AssetInformation
         */
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

        /**
         * Creates a plain object from an AssetInformation message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BasilType.AssetInformation
         * @static
         * @param {BasilType.AssetInformation} message AssetInformation
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this AssetInformation to JSON.
         * @function toJSON
         * @memberof BasilType.AssetInformation
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AssetInformation.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AssetInformation;
    })();

    BasilType.PathDescription = (function() {

        /**
         * Properties of a PathDescription.
         * @memberof BasilType
         * @interface IPathDescription
         * @property {string|null} [pathType] PathDescription pathType
         */

        /**
         * Constructs a new PathDescription.
         * @memberof BasilType
         * @classdesc Represents a PathDescription.
         * @implements IPathDescription
         * @constructor
         * @param {BasilType.IPathDescription=} [properties] Properties to set
         */
        function PathDescription(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PathDescription pathType.
         * @member {string} pathType
         * @memberof BasilType.PathDescription
         * @instance
         */
        PathDescription.prototype.pathType = "";

        /**
         * Creates a new PathDescription instance using the specified properties.
         * @function create
         * @memberof BasilType.PathDescription
         * @static
         * @param {BasilType.IPathDescription=} [properties] Properties to set
         * @returns {BasilType.PathDescription} PathDescription instance
         */
        PathDescription.create = function create(properties) {
            return new PathDescription(properties);
        };

        /**
         * Encodes the specified PathDescription message. Does not implicitly {@link BasilType.PathDescription.verify|verify} messages.
         * @function encode
         * @memberof BasilType.PathDescription
         * @static
         * @param {BasilType.IPathDescription} message PathDescription message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PathDescription.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.pathType != null && message.hasOwnProperty("pathType"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.pathType);
            return writer;
        };

        /**
         * Encodes the specified PathDescription message, length delimited. Does not implicitly {@link BasilType.PathDescription.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BasilType.PathDescription
         * @static
         * @param {BasilType.IPathDescription} message PathDescription message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PathDescription.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PathDescription message from the specified reader or buffer.
         * @function decode
         * @memberof BasilType.PathDescription
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BasilType.PathDescription} PathDescription
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
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

        /**
         * Decodes a PathDescription message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BasilType.PathDescription
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BasilType.PathDescription} PathDescription
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PathDescription.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PathDescription message.
         * @function verify
         * @memberof BasilType.PathDescription
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PathDescription.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.pathType != null && message.hasOwnProperty("pathType"))
                if (!$util.isString(message.pathType))
                    return "pathType: string expected";
            return null;
        };

        /**
         * Creates a PathDescription message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BasilType.PathDescription
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BasilType.PathDescription} PathDescription
         */
        PathDescription.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.PathDescription)
                return object;
            let message = new $root.BasilType.PathDescription();
            if (object.pathType != null)
                message.pathType = String(object.pathType);
            return message;
        };

        /**
         * Creates a plain object from a PathDescription message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BasilType.PathDescription
         * @static
         * @param {BasilType.PathDescription} message PathDescription
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this PathDescription to JSON.
         * @function toJSON
         * @memberof BasilType.PathDescription
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PathDescription.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PathDescription;
    })();

    BasilType.InstancePositionInfo = (function() {

        /**
         * Properties of an InstancePositionInfo.
         * @memberof BasilType
         * @interface IInstancePositionInfo
         * @property {BasilType.IInstanceIdentifier|null} [id] InstancePositionInfo id
         * @property {BasilType.ICoordPosition|null} [pos] InstancePositionInfo pos
         * @property {BasilType.IVector3|null} [vel] InstancePositionInfo vel
         * @property {BasilType.IPathDescription|null} [path] InstancePositionInfo path
         */

        /**
         * Constructs a new InstancePositionInfo.
         * @memberof BasilType
         * @classdesc Represents an InstancePositionInfo.
         * @implements IInstancePositionInfo
         * @constructor
         * @param {BasilType.IInstancePositionInfo=} [properties] Properties to set
         */
        function InstancePositionInfo(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * InstancePositionInfo id.
         * @member {BasilType.IInstanceIdentifier|null|undefined} id
         * @memberof BasilType.InstancePositionInfo
         * @instance
         */
        InstancePositionInfo.prototype.id = null;

        /**
         * InstancePositionInfo pos.
         * @member {BasilType.ICoordPosition|null|undefined} pos
         * @memberof BasilType.InstancePositionInfo
         * @instance
         */
        InstancePositionInfo.prototype.pos = null;

        /**
         * InstancePositionInfo vel.
         * @member {BasilType.IVector3|null|undefined} vel
         * @memberof BasilType.InstancePositionInfo
         * @instance
         */
        InstancePositionInfo.prototype.vel = null;

        /**
         * InstancePositionInfo path.
         * @member {BasilType.IPathDescription|null|undefined} path
         * @memberof BasilType.InstancePositionInfo
         * @instance
         */
        InstancePositionInfo.prototype.path = null;

        /**
         * Creates a new InstancePositionInfo instance using the specified properties.
         * @function create
         * @memberof BasilType.InstancePositionInfo
         * @static
         * @param {BasilType.IInstancePositionInfo=} [properties] Properties to set
         * @returns {BasilType.InstancePositionInfo} InstancePositionInfo instance
         */
        InstancePositionInfo.create = function create(properties) {
            return new InstancePositionInfo(properties);
        };

        /**
         * Encodes the specified InstancePositionInfo message. Does not implicitly {@link BasilType.InstancePositionInfo.verify|verify} messages.
         * @function encode
         * @memberof BasilType.InstancePositionInfo
         * @static
         * @param {BasilType.IInstancePositionInfo} message InstancePositionInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InstancePositionInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && message.hasOwnProperty("id"))
                $root.BasilType.InstanceIdentifier.encode(message.id, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.pos != null && message.hasOwnProperty("pos"))
                $root.BasilType.CoordPosition.encode(message.pos, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.vel != null && message.hasOwnProperty("vel"))
                $root.BasilType.Vector3.encode(message.vel, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.path != null && message.hasOwnProperty("path"))
                $root.BasilType.PathDescription.encode(message.path, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified InstancePositionInfo message, length delimited. Does not implicitly {@link BasilType.InstancePositionInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BasilType.InstancePositionInfo
         * @static
         * @param {BasilType.IInstancePositionInfo} message InstancePositionInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InstancePositionInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an InstancePositionInfo message from the specified reader or buffer.
         * @function decode
         * @memberof BasilType.InstancePositionInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BasilType.InstancePositionInfo} InstancePositionInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
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

        /**
         * Decodes an InstancePositionInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BasilType.InstancePositionInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BasilType.InstancePositionInfo} InstancePositionInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InstancePositionInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an InstancePositionInfo message.
         * @function verify
         * @memberof BasilType.InstancePositionInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
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

        /**
         * Creates an InstancePositionInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BasilType.InstancePositionInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BasilType.InstancePositionInfo} InstancePositionInfo
         */
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

        /**
         * Creates a plain object from an InstancePositionInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BasilType.InstancePositionInfo
         * @static
         * @param {BasilType.InstancePositionInfo} message InstancePositionInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this InstancePositionInfo to JSON.
         * @function toJSON
         * @memberof BasilType.InstancePositionInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        InstancePositionInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return InstancePositionInfo;
    })();

    BasilType.AccessAuthorization = (function() {

        /**
         * Properties of an AccessAuthorization.
         * @memberof BasilType
         * @interface IAccessAuthorization
         * @property {BasilType.IPropertyList|null} [accessProperties] AccessAuthorization accessProperties
         */

        /**
         * Constructs a new AccessAuthorization.
         * @memberof BasilType
         * @classdesc Represents an AccessAuthorization.
         * @implements IAccessAuthorization
         * @constructor
         * @param {BasilType.IAccessAuthorization=} [properties] Properties to set
         */
        function AccessAuthorization(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AccessAuthorization accessProperties.
         * @member {BasilType.IPropertyList|null|undefined} accessProperties
         * @memberof BasilType.AccessAuthorization
         * @instance
         */
        AccessAuthorization.prototype.accessProperties = null;

        /**
         * Creates a new AccessAuthorization instance using the specified properties.
         * @function create
         * @memberof BasilType.AccessAuthorization
         * @static
         * @param {BasilType.IAccessAuthorization=} [properties] Properties to set
         * @returns {BasilType.AccessAuthorization} AccessAuthorization instance
         */
        AccessAuthorization.create = function create(properties) {
            return new AccessAuthorization(properties);
        };

        /**
         * Encodes the specified AccessAuthorization message. Does not implicitly {@link BasilType.AccessAuthorization.verify|verify} messages.
         * @function encode
         * @memberof BasilType.AccessAuthorization
         * @static
         * @param {BasilType.IAccessAuthorization} message AccessAuthorization message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AccessAuthorization.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.accessProperties != null && message.hasOwnProperty("accessProperties"))
                $root.BasilType.PropertyList.encode(message.accessProperties, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified AccessAuthorization message, length delimited. Does not implicitly {@link BasilType.AccessAuthorization.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BasilType.AccessAuthorization
         * @static
         * @param {BasilType.IAccessAuthorization} message AccessAuthorization message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AccessAuthorization.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AccessAuthorization message from the specified reader or buffer.
         * @function decode
         * @memberof BasilType.AccessAuthorization
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BasilType.AccessAuthorization} AccessAuthorization
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
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

        /**
         * Decodes an AccessAuthorization message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BasilType.AccessAuthorization
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BasilType.AccessAuthorization} AccessAuthorization
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AccessAuthorization.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AccessAuthorization message.
         * @function verify
         * @memberof BasilType.AccessAuthorization
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
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

        /**
         * Creates an AccessAuthorization message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BasilType.AccessAuthorization
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BasilType.AccessAuthorization} AccessAuthorization
         */
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

        /**
         * Creates a plain object from an AccessAuthorization message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BasilType.AccessAuthorization
         * @static
         * @param {BasilType.AccessAuthorization} message AccessAuthorization
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this AccessAuthorization to JSON.
         * @function toJSON
         * @memberof BasilType.AccessAuthorization
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AccessAuthorization.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AccessAuthorization;
    })();

    BasilType.TraceInfo = (function() {

        /**
         * Properties of a TraceInfo.
         * @memberof BasilType
         * @interface ITraceInfo
         * @property {string|null} [info] TraceInfo info
         */

        /**
         * Constructs a new TraceInfo.
         * @memberof BasilType
         * @classdesc Represents a TraceInfo.
         * @implements ITraceInfo
         * @constructor
         * @param {BasilType.ITraceInfo=} [properties] Properties to set
         */
        function TraceInfo(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TraceInfo info.
         * @member {string} info
         * @memberof BasilType.TraceInfo
         * @instance
         */
        TraceInfo.prototype.info = "";

        /**
         * Creates a new TraceInfo instance using the specified properties.
         * @function create
         * @memberof BasilType.TraceInfo
         * @static
         * @param {BasilType.ITraceInfo=} [properties] Properties to set
         * @returns {BasilType.TraceInfo} TraceInfo instance
         */
        TraceInfo.create = function create(properties) {
            return new TraceInfo(properties);
        };

        /**
         * Encodes the specified TraceInfo message. Does not implicitly {@link BasilType.TraceInfo.verify|verify} messages.
         * @function encode
         * @memberof BasilType.TraceInfo
         * @static
         * @param {BasilType.ITraceInfo} message TraceInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TraceInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.info != null && message.hasOwnProperty("info"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.info);
            return writer;
        };

        /**
         * Encodes the specified TraceInfo message, length delimited. Does not implicitly {@link BasilType.TraceInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BasilType.TraceInfo
         * @static
         * @param {BasilType.ITraceInfo} message TraceInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TraceInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TraceInfo message from the specified reader or buffer.
         * @function decode
         * @memberof BasilType.TraceInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BasilType.TraceInfo} TraceInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
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

        /**
         * Decodes a TraceInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BasilType.TraceInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BasilType.TraceInfo} TraceInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TraceInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TraceInfo message.
         * @function verify
         * @memberof BasilType.TraceInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TraceInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.info != null && message.hasOwnProperty("info"))
                if (!$util.isString(message.info))
                    return "info: string expected";
            return null;
        };

        /**
         * Creates a TraceInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BasilType.TraceInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BasilType.TraceInfo} TraceInfo
         */
        TraceInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.BasilType.TraceInfo)
                return object;
            let message = new $root.BasilType.TraceInfo();
            if (object.info != null)
                message.info = String(object.info);
            return message;
        };

        /**
         * Creates a plain object from a TraceInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BasilType.TraceInfo
         * @static
         * @param {BasilType.TraceInfo} message TraceInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
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

        /**
         * Converts this TraceInfo to JSON.
         * @function toJSON
         * @memberof BasilType.TraceInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TraceInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TraceInfo;
    })();

    return BasilType;
})();

export { $root as default };
