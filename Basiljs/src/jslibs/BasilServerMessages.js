/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
import * as $protobuf from "protobufjs/minimal";

const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const BasilServer = $root.BasilServer = (() => {

    const BasilServer = {};

    BasilServer.IdentifyDisplayableObjectReq = (function() {

        undefined;
        }

        IdentifyDisplayableObjectReq.prototype.auth = null;
        IdentifyDisplayableObjectReq.prototype.assetInfo = null;
        IdentifyDisplayableObjectReq.prototype.aabb = null;

        IdentifyDisplayableObjectReq.create = function create(properties) {
            return new IdentifyDisplayableObjectReq(properties);
        };

        IdentifyDisplayableObjectReq.encode = undefined;
        };

        IdentifyDisplayableObjectReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        IdentifyDisplayableObjectReq.decode = undefined;
        };

        IdentifyDisplayableObjectReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        IdentifyDisplayableObjectReq.verify = undefined;
        };

        IdentifyDisplayableObjectReq.fromObject = undefined;
        };

        IdentifyDisplayableObjectReq.toObject = undefined;
        };

        IdentifyDisplayableObjectReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return IdentifyDisplayableObjectReq;
    })();

    BasilServer.IdentifyDisplayableObjectResp = (function() {

        undefined;
        }

        IdentifyDisplayableObjectResp.prototype.exception = null;
        IdentifyDisplayableObjectResp.prototype.identifier = null;

        IdentifyDisplayableObjectResp.create = function create(properties) {
            return new IdentifyDisplayableObjectResp(properties);
        };

        IdentifyDisplayableObjectResp.encode = undefined;
        };

        IdentifyDisplayableObjectResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        IdentifyDisplayableObjectResp.decode = undefined;
        };

        IdentifyDisplayableObjectResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        IdentifyDisplayableObjectResp.verify = undefined;
        };

        IdentifyDisplayableObjectResp.fromObject = undefined;
        };

        IdentifyDisplayableObjectResp.toObject = undefined;
        };

        IdentifyDisplayableObjectResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return IdentifyDisplayableObjectResp;
    })();

    BasilServer.ForgetDisplayableObjectReq = (function() {

        undefined;
        }

        ForgetDisplayableObjectReq.prototype.auth = null;
        ForgetDisplayableObjectReq.prototype.identifier = null;

        ForgetDisplayableObjectReq.create = function create(properties) {
            return new ForgetDisplayableObjectReq(properties);
        };

        ForgetDisplayableObjectReq.encode = undefined;
        };

        ForgetDisplayableObjectReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        ForgetDisplayableObjectReq.decode = undefined;
        };

        ForgetDisplayableObjectReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        ForgetDisplayableObjectReq.verify = undefined;
        };

        ForgetDisplayableObjectReq.fromObject = undefined;
        };

        ForgetDisplayableObjectReq.toObject = undefined;
        };

        ForgetDisplayableObjectReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ForgetDisplayableObjectReq;
    })();

    BasilServer.ForgetDisplayableObjectResp = (function() {

        undefined;
        }

        ForgetDisplayableObjectResp.prototype.exception = null;

        ForgetDisplayableObjectResp.create = function create(properties) {
            return new ForgetDisplayableObjectResp(properties);
        };

        ForgetDisplayableObjectResp.encode = undefined;
        };

        ForgetDisplayableObjectResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        ForgetDisplayableObjectResp.decode = undefined;
        };

        ForgetDisplayableObjectResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        ForgetDisplayableObjectResp.verify = undefined;
        };

        ForgetDisplayableObjectResp.fromObject = undefined;
        };

        ForgetDisplayableObjectResp.toObject = undefined;
        };

        ForgetDisplayableObjectResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ForgetDisplayableObjectResp;
    })();

    BasilServer.CreateObjectInstanceReq = (function() {

        undefined;
        }

        CreateObjectInstanceReq.prototype.auth = null;
        CreateObjectInstanceReq.prototype.identifier = null;
        CreateObjectInstanceReq.prototype.pos = null;
        CreateObjectInstanceReq.prototype.propertiesToSet = $util.emptyObject;
        CreateObjectInstanceReq.prototype.InstanceCountHint = 0;

        CreateObjectInstanceReq.create = function create(properties) {
            return new CreateObjectInstanceReq(properties);
        };

        CreateObjectInstanceReq.encode = undefined;
        };

        CreateObjectInstanceReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CreateObjectInstanceReq.decode = undefined;
        };

        CreateObjectInstanceReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        CreateObjectInstanceReq.verify = undefined;
        };

        CreateObjectInstanceReq.fromObject = undefined;
        };

        CreateObjectInstanceReq.toObject = undefined;
        };

        CreateObjectInstanceReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CreateObjectInstanceReq;
    })();

    BasilServer.CreateObjectInstanceResp = (function() {

        undefined;
        }

        CreateObjectInstanceResp.prototype.exception = null;
        CreateObjectInstanceResp.prototype.instanceId = null;

        CreateObjectInstanceResp.create = function create(properties) {
            return new CreateObjectInstanceResp(properties);
        };

        CreateObjectInstanceResp.encode = undefined;
        };

        CreateObjectInstanceResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CreateObjectInstanceResp.decode = undefined;
        };

        CreateObjectInstanceResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        CreateObjectInstanceResp.verify = undefined;
        };

        CreateObjectInstanceResp.fromObject = undefined;
        };

        CreateObjectInstanceResp.toObject = undefined;
        };

        CreateObjectInstanceResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CreateObjectInstanceResp;
    })();

    BasilServer.DeleteObjectInstanceReq = (function() {

        undefined;
        }

        DeleteObjectInstanceReq.prototype.auth = null;
        DeleteObjectInstanceReq.prototype.instanceId = null;

        DeleteObjectInstanceReq.create = function create(properties) {
            return new DeleteObjectInstanceReq(properties);
        };

        DeleteObjectInstanceReq.encode = undefined;
        };

        DeleteObjectInstanceReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        DeleteObjectInstanceReq.decode = undefined;
        };

        DeleteObjectInstanceReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        DeleteObjectInstanceReq.verify = undefined;
        };

        DeleteObjectInstanceReq.fromObject = undefined;
        };

        DeleteObjectInstanceReq.toObject = undefined;
        };

        DeleteObjectInstanceReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DeleteObjectInstanceReq;
    })();

    BasilServer.DeleteObjectInstanceResp = (function() {

        undefined;
        }

        DeleteObjectInstanceResp.prototype.exception = null;

        DeleteObjectInstanceResp.create = function create(properties) {
            return new DeleteObjectInstanceResp(properties);
        };

        DeleteObjectInstanceResp.encode = undefined;
        };

        DeleteObjectInstanceResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        DeleteObjectInstanceResp.decode = undefined;
        };

        DeleteObjectInstanceResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        DeleteObjectInstanceResp.verify = undefined;
        };

        DeleteObjectInstanceResp.fromObject = undefined;
        };

        DeleteObjectInstanceResp.toObject = undefined;
        };

        DeleteObjectInstanceResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DeleteObjectInstanceResp;
    })();

    BasilServer.UpdateObjectPropertyReq = (function() {

        undefined;
        }

        UpdateObjectPropertyReq.prototype.auth = null;
        UpdateObjectPropertyReq.prototype.identifier = null;
        UpdateObjectPropertyReq.prototype.props = $util.emptyObject;

        UpdateObjectPropertyReq.create = function create(properties) {
            return new UpdateObjectPropertyReq(properties);
        };

        UpdateObjectPropertyReq.encode = undefined;
        };

        UpdateObjectPropertyReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        UpdateObjectPropertyReq.decode = undefined;
        };

        UpdateObjectPropertyReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        UpdateObjectPropertyReq.verify = undefined;
        };

        UpdateObjectPropertyReq.fromObject = undefined;
        };

        UpdateObjectPropertyReq.toObject = undefined;
        };

        UpdateObjectPropertyReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateObjectPropertyReq;
    })();

    BasilServer.UpdateObjectPropertyResp = (function() {

        undefined;
        }

        UpdateObjectPropertyResp.prototype.exception = null;

        UpdateObjectPropertyResp.create = function create(properties) {
            return new UpdateObjectPropertyResp(properties);
        };

        UpdateObjectPropertyResp.encode = undefined;
        };

        UpdateObjectPropertyResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        UpdateObjectPropertyResp.decode = undefined;
        };

        UpdateObjectPropertyResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        UpdateObjectPropertyResp.verify = undefined;
        };

        UpdateObjectPropertyResp.fromObject = undefined;
        };

        UpdateObjectPropertyResp.toObject = undefined;
        };

        UpdateObjectPropertyResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateObjectPropertyResp;
    })();

    BasilServer.UpdateInstancePropertyReq = (function() {

        undefined;
        }

        UpdateInstancePropertyReq.prototype.auth = null;
        UpdateInstancePropertyReq.prototype.instanceId = null;
        UpdateInstancePropertyReq.prototype.props = $util.emptyObject;

        UpdateInstancePropertyReq.create = function create(properties) {
            return new UpdateInstancePropertyReq(properties);
        };

        UpdateInstancePropertyReq.encode = undefined;
        };

        UpdateInstancePropertyReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        UpdateInstancePropertyReq.decode = undefined;
        };

        UpdateInstancePropertyReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        UpdateInstancePropertyReq.verify = undefined;
        };

        UpdateInstancePropertyReq.fromObject = undefined;
        };

        UpdateInstancePropertyReq.toObject = undefined;
        };

        UpdateInstancePropertyReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateInstancePropertyReq;
    })();

    BasilServer.UpdateInstancePropertyResp = (function() {

        undefined;
        }

        UpdateInstancePropertyResp.prototype.exception = null;

        UpdateInstancePropertyResp.create = function create(properties) {
            return new UpdateInstancePropertyResp(properties);
        };

        UpdateInstancePropertyResp.encode = undefined;
        };

        UpdateInstancePropertyResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        UpdateInstancePropertyResp.decode = undefined;
        };

        UpdateInstancePropertyResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        UpdateInstancePropertyResp.verify = undefined;
        };

        UpdateInstancePropertyResp.fromObject = undefined;
        };

        UpdateInstancePropertyResp.toObject = undefined;
        };

        UpdateInstancePropertyResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateInstancePropertyResp;
    })();

    BasilServer.UpdateInstancePositionReq = (function() {

        undefined;
        }

        UpdateInstancePositionReq.prototype.auth = null;
        UpdateInstancePositionReq.prototype.instanceId = null;
        UpdateInstancePositionReq.prototype.pos = null;

        UpdateInstancePositionReq.create = function create(properties) {
            return new UpdateInstancePositionReq(properties);
        };

        UpdateInstancePositionReq.encode = undefined;
        };

        UpdateInstancePositionReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        UpdateInstancePositionReq.decode = undefined;
        };

        UpdateInstancePositionReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        UpdateInstancePositionReq.verify = undefined;
        };

        UpdateInstancePositionReq.fromObject = undefined;
        };

        UpdateInstancePositionReq.toObject = undefined;
        };

        UpdateInstancePositionReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateInstancePositionReq;
    })();

    BasilServer.UpdateInstancePositionResp = (function() {

        undefined;
        }

        UpdateInstancePositionResp.prototype.exception = null;

        UpdateInstancePositionResp.create = function create(properties) {
            return new UpdateInstancePositionResp(properties);
        };

        UpdateInstancePositionResp.encode = undefined;
        };

        UpdateInstancePositionResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        UpdateInstancePositionResp.decode = undefined;
        };

        UpdateInstancePositionResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        UpdateInstancePositionResp.verify = undefined;
        };

        UpdateInstancePositionResp.fromObject = undefined;
        };

        UpdateInstancePositionResp.toObject = undefined;
        };

        UpdateInstancePositionResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateInstancePositionResp;
    })();

    BasilServer.RequestObjectPropertiesReq = (function() {

        undefined;
        }

        RequestObjectPropertiesReq.prototype.auth = null;
        RequestObjectPropertiesReq.prototype.identifier = null;
        RequestObjectPropertiesReq.prototype.propertyMatch = "";

        RequestObjectPropertiesReq.create = function create(properties) {
            return new RequestObjectPropertiesReq(properties);
        };

        RequestObjectPropertiesReq.encode = undefined;
        };

        RequestObjectPropertiesReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        RequestObjectPropertiesReq.decode = undefined;
        };

        RequestObjectPropertiesReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        RequestObjectPropertiesReq.verify = undefined;
        };

        RequestObjectPropertiesReq.fromObject = undefined;
        };

        RequestObjectPropertiesReq.toObject = undefined;
        };

        RequestObjectPropertiesReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RequestObjectPropertiesReq;
    })();

    BasilServer.RequestObjectPropertiesResp = (function() {

        undefined;
        }

        RequestObjectPropertiesResp.prototype.exception = null;
        RequestObjectPropertiesResp.prototype.properties = $util.emptyObject;

        RequestObjectPropertiesResp.create = function create(properties) {
            return new RequestObjectPropertiesResp(properties);
        };

        RequestObjectPropertiesResp.encode = undefined;
        };

        RequestObjectPropertiesResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        RequestObjectPropertiesResp.decode = undefined;
        };

        RequestObjectPropertiesResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        RequestObjectPropertiesResp.verify = undefined;
        };

        RequestObjectPropertiesResp.fromObject = undefined;
        };

        RequestObjectPropertiesResp.toObject = undefined;
        };

        RequestObjectPropertiesResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RequestObjectPropertiesResp;
    })();

    BasilServer.RequestInstancePropertiesReq = (function() {

        undefined;
        }

        RequestInstancePropertiesReq.prototype.auth = null;
        RequestInstancePropertiesReq.prototype.instanceId = null;
        RequestInstancePropertiesReq.prototype.propertyMatch = "";

        RequestInstancePropertiesReq.create = function create(properties) {
            return new RequestInstancePropertiesReq(properties);
        };

        RequestInstancePropertiesReq.encode = undefined;
        };

        RequestInstancePropertiesReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        RequestInstancePropertiesReq.decode = undefined;
        };

        RequestInstancePropertiesReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        RequestInstancePropertiesReq.verify = undefined;
        };

        RequestInstancePropertiesReq.fromObject = undefined;
        };

        RequestInstancePropertiesReq.toObject = undefined;
        };

        RequestInstancePropertiesReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RequestInstancePropertiesReq;
    })();

    BasilServer.RequestInstancePropertiesResp = (function() {

        undefined;
        }

        RequestInstancePropertiesResp.prototype.exception = null;
        RequestInstancePropertiesResp.prototype.properties = $util.emptyObject;

        RequestInstancePropertiesResp.create = function create(properties) {
            return new RequestInstancePropertiesResp(properties);
        };

        RequestInstancePropertiesResp.encode = undefined;
        };

        RequestInstancePropertiesResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        RequestInstancePropertiesResp.decode = undefined;
        };

        RequestInstancePropertiesResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        RequestInstancePropertiesResp.verify = undefined;
        };

        RequestInstancePropertiesResp.fromObject = undefined;
        };

        RequestInstancePropertiesResp.toObject = undefined;
        };

        RequestInstancePropertiesResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RequestInstancePropertiesResp;
    })();

    BasilServer.OpenSessionReq = (function() {

        undefined;
        }

        OpenSessionReq.prototype.auth = null;
        OpenSessionReq.prototype.features = $util.emptyObject;

        OpenSessionReq.create = function create(properties) {
            return new OpenSessionReq(properties);
        };

        OpenSessionReq.encode = undefined;
        };

        OpenSessionReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        OpenSessionReq.decode = undefined;
        };

        OpenSessionReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        OpenSessionReq.verify = undefined;
        };

        OpenSessionReq.fromObject = undefined;
        };

        OpenSessionReq.toObject = undefined;
        };

        OpenSessionReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return OpenSessionReq;
    })();

    BasilServer.OpenSessionResp = (function() {

        undefined;
        }

        OpenSessionResp.prototype.exception = null;
        OpenSessionResp.prototype.properties = $util.emptyObject;

        OpenSessionResp.create = function create(properties) {
            return new OpenSessionResp(properties);
        };

        OpenSessionResp.encode = undefined;
        };

        OpenSessionResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        OpenSessionResp.decode = undefined;
        };

        OpenSessionResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        OpenSessionResp.verify = undefined;
        };

        OpenSessionResp.fromObject = undefined;
        };

        OpenSessionResp.toObject = undefined;
        };

        OpenSessionResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return OpenSessionResp;
    })();

    BasilServer.CloseSessionReq = (function() {

        undefined;
        }

        CloseSessionReq.prototype.auth = null;
        CloseSessionReq.prototype.reason = "";

        CloseSessionReq.create = function create(properties) {
            return new CloseSessionReq(properties);
        };

        CloseSessionReq.encode = undefined;
        };

        CloseSessionReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CloseSessionReq.decode = undefined;
        };

        CloseSessionReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        CloseSessionReq.verify = undefined;
        };

        CloseSessionReq.fromObject = undefined;
        };

        CloseSessionReq.toObject = undefined;
        };

        CloseSessionReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CloseSessionReq;
    })();

    BasilServer.CloseSessionResp = (function() {

        undefined;
        }

        CloseSessionResp.prototype.exception = null;

        CloseSessionResp.create = function create(properties) {
            return new CloseSessionResp(properties);
        };

        CloseSessionResp.encode = undefined;
        };

        CloseSessionResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CloseSessionResp.decode = undefined;
        };

        CloseSessionResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        CloseSessionResp.verify = undefined;
        };

        CloseSessionResp.fromObject = undefined;
        };

        CloseSessionResp.toObject = undefined;
        };

        CloseSessionResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CloseSessionResp;
    })();

    BasilServer.MakeConnectionReq = (function() {

        undefined;
        }

        MakeConnectionReq.prototype.auth = null;
        MakeConnectionReq.prototype.connectionParams = $util.emptyObject;

        MakeConnectionReq.create = function create(properties) {
            return new MakeConnectionReq(properties);
        };

        MakeConnectionReq.encode = undefined;
        };

        MakeConnectionReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        MakeConnectionReq.decode = undefined;
        };

        MakeConnectionReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        MakeConnectionReq.verify = undefined;
        };

        MakeConnectionReq.fromObject = undefined;
        };

        MakeConnectionReq.toObject = undefined;
        };

        MakeConnectionReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return MakeConnectionReq;
    })();

    BasilServer.MakeConnectionResp = (function() {

        undefined;
        }

        MakeConnectionResp.prototype.exception = null;

        MakeConnectionResp.create = function create(properties) {
            return new MakeConnectionResp(properties);
        };

        MakeConnectionResp.encode = undefined;
        };

        MakeConnectionResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        MakeConnectionResp.decode = undefined;
        };

        MakeConnectionResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        MakeConnectionResp.verify = undefined;
        };

        MakeConnectionResp.fromObject = undefined;
        };

        MakeConnectionResp.toObject = undefined;
        };

        MakeConnectionResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return MakeConnectionResp;
    })();

    BasilServer.AliveCheckReq = (function() {

        undefined;
        }

        AliveCheckReq.prototype.auth = null;
        AliveCheckReq.prototype.time = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        AliveCheckReq.prototype.sequenceNum = 0;

        AliveCheckReq.create = function create(properties) {
            return new AliveCheckReq(properties);
        };

        AliveCheckReq.encode = undefined;
        };

        AliveCheckReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        AliveCheckReq.decode = undefined;
        };

        AliveCheckReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        AliveCheckReq.verify = undefined;
        };

        AliveCheckReq.fromObject = undefined;
        };

        AliveCheckReq.toObject = undefined;
        };

        AliveCheckReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AliveCheckReq;
    })();

    BasilServer.AliveCheckResp = (function() {

        undefined;
        }

        AliveCheckResp.prototype.time = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        AliveCheckResp.prototype.sequenceNum = 0;
        AliveCheckResp.prototype.timeReceived = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        AliveCheckResp.prototype.sequenceNumReceived = 0;

        AliveCheckResp.create = function create(properties) {
            return new AliveCheckResp(properties);
        };

        AliveCheckResp.encode = undefined;
        };

        AliveCheckResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        AliveCheckResp.decode = undefined;
        };

        AliveCheckResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        AliveCheckResp.verify = undefined;
        };

        AliveCheckResp.fromObject = undefined;
        };

        AliveCheckResp.toObject = undefined;
        };

        AliveCheckResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AliveCheckResp;
    })();

    BasilServer.BasilServerMessage = (function() {

        undefined;
        }

        BasilServerMessage.prototype.BasilServerMessages = $util.emptyArray;

        BasilServerMessage.create = function create(properties) {
            return new BasilServerMessage(properties);
        };

        BasilServerMessage.encode = undefined;
        };

        BasilServerMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        BasilServerMessage.decode = undefined;
        };

        BasilServerMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        BasilServerMessage.verify = undefined;
        };

        BasilServerMessage.fromObject = undefined;
        };

        BasilServerMessage.toObject = undefined;
        };

        BasilServerMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        BasilServerMessage.BasilServerMessageBody = (function() {

            undefined;
            }

            BasilServerMessageBody.prototype.IdentifyDisplayableObjectReqMsg = null;
            BasilServerMessageBody.prototype.IdentifyDisplayableObjectRespMsg = null;
            BasilServerMessageBody.prototype.ForgetDisplayableObjectReqMsg = null;
            BasilServerMessageBody.prototype.ForgetDisplayableObjectRespMsg = null;
            BasilServerMessageBody.prototype.CreateObjectInstanceReqMsg = null;
            BasilServerMessageBody.prototype.CreateObjectInstanceRespMsg = null;
            BasilServerMessageBody.prototype.DeleteObjectInstanceReqMsg = null;
            BasilServerMessageBody.prototype.DeleteObjectInstanceRespMsg = null;
            BasilServerMessageBody.prototype.UpdateObjectPropertyReqMsg = null;
            BasilServerMessageBody.prototype.UpdateObjectPropertyRespMsg = null;
            BasilServerMessageBody.prototype.UpdateInstancePropertyReqMsg = null;
            BasilServerMessageBody.prototype.UpdateInstancePropertyRespMsg = null;
            BasilServerMessageBody.prototype.UpdateInstancePositionReqMsg = null;
            BasilServerMessageBody.prototype.UpdateInstancePositionRespMsg = null;
            BasilServerMessageBody.prototype.RequestObjectPropertiesReqMsg = null;
            BasilServerMessageBody.prototype.RequestObjectPropertiesRespMsg = null;
            BasilServerMessageBody.prototype.RequestInstancePropertiesReqMsg = null;
            BasilServerMessageBody.prototype.RequestInstancePropertiesRespMsg = null;
            BasilServerMessageBody.prototype.OpenSessionReqMsg = null;
            BasilServerMessageBody.prototype.OpenSessionRespMsg = null;
            BasilServerMessageBody.prototype.CloseSessionReqMsg = null;
            BasilServerMessageBody.prototype.CloseSessionRespMsg = null;
            BasilServerMessageBody.prototype.AliveCheckReqMsg = null;
            BasilServerMessageBody.prototype.AliveCheckRespMsg = null;
            BasilServerMessageBody.prototype.MakeConnectionReqMsg = null;
            BasilServerMessageBody.prototype.MakeConnectionRespMsg = null;
            BasilServerMessageBody.prototype.RPCRequestSession = 0;

            BasilServerMessageBody.create = function create(properties) {
                return new BasilServerMessageBody(properties);
            };

            BasilServerMessageBody.encode = undefined;
            };

            BasilServerMessageBody.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            BasilServerMessageBody.decode = undefined;
            };

            BasilServerMessageBody.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            BasilServerMessageBody.verify = undefined;
            };

            BasilServerMessageBody.fromObject = undefined;
            };

            BasilServerMessageBody.toObject = undefined;
            };

            BasilServerMessageBody.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return BasilServerMessageBody;
        })();

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


        BasilServer.prototype.makeConnection = function makeConnection(request, callback) {
            return this.rpcCall(makeConnection, $root.BasilServer.MakeConnectionReq, $root.BasilServer.MakeConnectionResp, request, callback);
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

        undefined;
        }

        Vector3.prototype.x = 0;
        Vector3.prototype.y = 0;
        Vector3.prototype.z = 0;

        Vector3.create = function create(properties) {
            return new Vector3(properties);
        };

        Vector3.encode = undefined;
        };

        Vector3.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        Vector3.decode = undefined;
        };

        Vector3.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        Vector3.verify = undefined;
        };

        Vector3.fromObject = undefined;
        };

        Vector3.toObject = undefined;
        };

        Vector3.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Vector3;
    })();

    BasilType.Quaternion = (function() {

        undefined;
        }

        Quaternion.prototype.x = 0;
        Quaternion.prototype.y = 0;
        Quaternion.prototype.z = 0;
        Quaternion.prototype.w = 0;

        Quaternion.create = function create(properties) {
            return new Quaternion(properties);
        };

        Quaternion.encode = undefined;
        };

        Quaternion.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        Quaternion.decode = undefined;
        };

        Quaternion.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        Quaternion.verify = undefined;
        };

        Quaternion.fromObject = undefined;
        };

        Quaternion.toObject = undefined;
        };

        Quaternion.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Quaternion;
    })();

    BasilType.Transform = (function() {

        undefined;
        }

        Transform.prototype.matrix = $util.emptyArray;
        Transform.prototype.origin = null;

        Transform.create = function create(properties) {
            return new Transform(properties);
        };

        Transform.encode = undefined;
        };

        Transform.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        Transform.decode = undefined;
        };

        Transform.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        Transform.verify = undefined;
        };

        Transform.fromObject = undefined;
        };

        Transform.toObject = undefined;
        };

        Transform.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Transform;
    })();

    BasilType.BasilException = (function() {

        undefined;
        }

        BasilException.prototype.reason = "";
        BasilException.prototype.hints = $util.emptyObject;

        BasilException.create = function create(properties) {
            return new BasilException(properties);
        };

        BasilException.encode = undefined;
        };

        BasilException.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        BasilException.decode = undefined;
        };

        BasilException.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        BasilException.verify = undefined;
        };

        BasilException.fromObject = undefined;
        };

        BasilException.toObject = undefined;
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

        undefined;
        }

        CoordPosition.prototype.pos = null;
        CoordPosition.prototype.rot = null;
        CoordPosition.prototype.posRef = 0;
        CoordPosition.prototype.rotRef = 0;

        CoordPosition.create = function create(properties) {
            return new CoordPosition(properties);
        };

        CoordPosition.encode = undefined;
        };

        CoordPosition.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        CoordPosition.decode = undefined;
        };

        CoordPosition.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        CoordPosition.verify = undefined;
        };

        CoordPosition.fromObject = undefined;
        };

        CoordPosition.toObject = undefined;
        };

        CoordPosition.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CoordPosition;
    })();

    BasilType.ObjectIdentifier = (function() {

        undefined;
        }

        ObjectIdentifier.prototype.id = "";

        ObjectIdentifier.create = function create(properties) {
            return new ObjectIdentifier(properties);
        };

        ObjectIdentifier.encode = undefined;
        };

        ObjectIdentifier.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        ObjectIdentifier.decode = undefined;
        };

        ObjectIdentifier.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        ObjectIdentifier.verify = undefined;
        };

        ObjectIdentifier.fromObject = undefined;
        };

        ObjectIdentifier.toObject = undefined;
        };

        ObjectIdentifier.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ObjectIdentifier;
    })();

    BasilType.InstanceIdentifier = (function() {

        undefined;
        }

        InstanceIdentifier.prototype.id = "";

        InstanceIdentifier.create = function create(properties) {
            return new InstanceIdentifier(properties);
        };

        InstanceIdentifier.encode = undefined;
        };

        InstanceIdentifier.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        InstanceIdentifier.decode = undefined;
        };

        InstanceIdentifier.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        InstanceIdentifier.verify = undefined;
        };

        InstanceIdentifier.fromObject = undefined;
        };

        InstanceIdentifier.toObject = undefined;
        };

        InstanceIdentifier.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return InstanceIdentifier;
    })();

    BasilType.AaBoundingBox = (function() {

        undefined;
        }

        AaBoundingBox.prototype.upperFrontLeft = null;
        AaBoundingBox.prototype.lowerBackRight = null;

        AaBoundingBox.create = function create(properties) {
            return new AaBoundingBox(properties);
        };

        AaBoundingBox.encode = undefined;
        };

        AaBoundingBox.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        AaBoundingBox.decode = undefined;
        };

        AaBoundingBox.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        AaBoundingBox.verify = undefined;
        };

        AaBoundingBox.fromObject = undefined;
        };

        AaBoundingBox.toObject = undefined;
        };

        AaBoundingBox.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AaBoundingBox;
    })();

    BasilType.DisplayableInfo = (function() {

        undefined;
        }

        DisplayableInfo.prototype.aabb = null;
        DisplayableInfo.prototype.displayableType = "";
        DisplayableInfo.prototype.asset = $util.emptyObject;

        DisplayableInfo.create = function create(properties) {
            return new DisplayableInfo(properties);
        };

        DisplayableInfo.encode = undefined;
        };

        DisplayableInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        DisplayableInfo.decode = undefined;
        };

        DisplayableInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        DisplayableInfo.verify = undefined;
        };

        DisplayableInfo.fromObject = undefined;
        };

        DisplayableInfo.toObject = undefined;
        };

        DisplayableInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DisplayableInfo;
    })();

    BasilType.AssetInformation = (function() {

        undefined;
        }

        AssetInformation.prototype.id = null;
        AssetInformation.prototype.displayInfo = null;

        AssetInformation.create = function create(properties) {
            return new AssetInformation(properties);
        };

        AssetInformation.encode = undefined;
        };

        AssetInformation.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        AssetInformation.decode = undefined;
        };

        AssetInformation.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        AssetInformation.verify = undefined;
        };

        AssetInformation.fromObject = undefined;
        };

        AssetInformation.toObject = undefined;
        };

        AssetInformation.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AssetInformation;
    })();

    BasilType.PathDescription = (function() {

        undefined;
        }

        PathDescription.prototype.pathType = "";

        PathDescription.create = function create(properties) {
            return new PathDescription(properties);
        };

        PathDescription.encode = undefined;
        };

        PathDescription.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        PathDescription.decode = undefined;
        };

        PathDescription.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        PathDescription.verify = undefined;
        };

        PathDescription.fromObject = undefined;
        };

        PathDescription.toObject = undefined;
        };

        PathDescription.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PathDescription;
    })();

    BasilType.InstancePositionInfo = (function() {

        undefined;
        }

        InstancePositionInfo.prototype.id = null;
        InstancePositionInfo.prototype.pos = null;
        InstancePositionInfo.prototype.vel = null;
        InstancePositionInfo.prototype.path = null;

        InstancePositionInfo.create = function create(properties) {
            return new InstancePositionInfo(properties);
        };

        InstancePositionInfo.encode = undefined;
        };

        InstancePositionInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        InstancePositionInfo.decode = undefined;
        };

        InstancePositionInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        InstancePositionInfo.verify = undefined;
        };

        InstancePositionInfo.fromObject = undefined;
        };

        InstancePositionInfo.toObject = undefined;
        };

        InstancePositionInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return InstancePositionInfo;
    })();

    BasilType.AccessAuthorization = (function() {

        undefined;
        }

        AccessAuthorization.prototype.accessProperties = $util.emptyObject;

        AccessAuthorization.create = function create(properties) {
            return new AccessAuthorization(properties);
        };

        AccessAuthorization.encode = undefined;
        };

        AccessAuthorization.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        AccessAuthorization.decode = undefined;
        };

        AccessAuthorization.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        AccessAuthorization.verify = undefined;
        };

        AccessAuthorization.fromObject = undefined;
        };

        AccessAuthorization.toObject = undefined;
        };

        AccessAuthorization.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AccessAuthorization;
    })();

    BasilType.TraceInfo = (function() {

        undefined;
        }

        TraceInfo.prototype.info = "";

        TraceInfo.create = function create(properties) {
            return new TraceInfo(properties);
        };

        TraceInfo.encode = undefined;
        };

        TraceInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        TraceInfo.decode = undefined;
        };

        TraceInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        TraceInfo.verify = undefined;
        };

        TraceInfo.fromObject = undefined;
        };

        TraceInfo.toObject = undefined;
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

        undefined;
        }

        BTransport.prototype.sequenceNum = 0;
        BTransport.prototype.stream = 0;
        BTransport.prototype.queueTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        BTransport.prototype.sendTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        BTransport.prototype.traceID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        BTransport.prototype.parentSpanID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        BTransport.prototype.spanID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        BTransport.prototype.sampled = false;
        BTransport.prototype.message = $util.newBuffer([]);

        BTransport.create = function create(properties) {
            return new BTransport(properties);
        };

        BTransport.encode = undefined;
        };

        BTransport.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        BTransport.decode = undefined;
        };

        BTransport.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        BTransport.verify = undefined;
        };

        BTransport.fromObject = undefined;
        };

        BTransport.toObject = undefined;
        };

        BTransport.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BTransport;
    })();

    return BTransport;
})();

export { $root as default };
