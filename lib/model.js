"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("uuid/v4"));

var _keys = require("blockstack/lib/keys");

var _encryption = require("blockstack/lib/encryption");

var _wolfy87Eventemitter = _interopRequireDefault(require("wolfy87-eventemitter"));

var _helpers = require("./helpers");

var _api = require("./api");

var _streamer = _interopRequireDefault(require("./streamer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const EVENT_NAME = 'MODEL_STREAM_EVENT';
const INVOICE_NAME = 'INVOICE_STREAM_EVENT';

let Model =
/*#__PURE__*/
function () {
  _createClass(Model, null, [{
    key: "fromSchema",
    value: function fromSchema(schema) {
      this.schema = schema;
      return this;
    }
  }, {
    key: "fetchList",
    value: async function fetchList(_selector = {}, {
      decrypt = true
    } = {}) {
      const selector = _objectSpread({}, _selector, {
        radiksType: this.modelName()
      });

      const {
        results
      } = await (0, _api.find)(selector);
      const Clazz = this;
      const modelDecryptions = results.map(doc => {
        const model = new Clazz(doc);

        if (decrypt) {
          return model.decrypt();
        }

        return Promise.resolve(model);
      });
      const models = await Promise.all(modelDecryptions);
      return models;
    }
  }, {
    key: "findOne",
    value: async function findOne(_selector = {}, options = {
      decrypt: true
    }) {
      const selector = _objectSpread({}, _selector, {
        limit: 1
      });

      const results = await this.fetchList(selector, options);
      return results[0];
    }
  }, {
    key: "findById",
    value: async function findById(_id, fetchOptions) {
      const Clazz = this;
      const model = new Clazz({
        _id
      });
      return model.fetch(fetchOptions);
    }
    /**
     * Fetch all models that are owned by the current user.
     * This only includes 'personally' owned models, and not those created
     * as part of a UserGroup
     *
     * @param {Object} _selector - A query to include when fetching models
     */

  }, {
    key: "fetchOwnList",
    value: function fetchOwnList(_selector = {}) {
      const {
        _id
      } = (0, _helpers.userGroupKeys)().personal;

      const selector = _objectSpread({}, _selector, {
        signingKeyId: _id
      });

      return this.fetchList(selector);
    }
  }]);

  function Model(attrs = {}) {
    _classCallCheck(this, Model);

    _defineProperty(this, "schema", void 0);

    _defineProperty(this, "_id", void 0);

    _defineProperty(this, "attrs", void 0);

    const {
      schema,
      defaults
    } = this.constructor;
    const name = this.modelName();
    this.schema = schema;
    this._id = attrs._id || (0, _v.default)().replace('-', '');
    this.attrs = _objectSpread({}, defaults, attrs, {
      radiksType: name
    });
  }

  _createClass(Model, [{
    key: "save",
    value: async function save() {
      return new Promise(async (resolve, reject) => {
        try {
          if (this.beforeSave) {
            await this.beforeSave();
          }

          const now = new Date().getTime();
          this.attrs.createdAt = this.attrs.createdAt || now;
          this.attrs.updatedAt = now;
          await this.sign();
          const encrypted = await this.encrypted();
          const gaiaURL = await this.saveFile(encrypted);
          await (0, _api.sendNewGaiaUrl)(gaiaURL);
          resolve(this);
        } catch (error) {
          reject(error);
        }
      });
    }
  }, {
    key: "saveLN",
    value: async function saveLN() {
      return new Promise(async (resolve, reject) => {
        try {
          if (this.beforeSave) {
            await this.beforeSave();
          }

          const now = new Date().getTime();
          this.attrs.createdAt = this.attrs.createdAt || now;
          this.attrs.updatedAt = now;
          await this.sign();
          const encrypted = await this.encrypted();
          const gaiaURL = await this.saveFile(encrypted);
          const response = await (0, _api.sendNewGaiaUrlLN)(gaiaURL);
          console.log("Model saved: " + response);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    }
  }, {
    key: "checkPayReqPaid",
    value: async function checkPayReqPaid(id) {
      return new Promise(async (resolve, reject) => {
        try {
          const invoice = await (0, _api.checkPayReq)(id);
          console.log("Invoice info: " + invoice);
          resolve(invoice);
        } catch (error) {
          reject(error);
        }
      });
    }
  }, {
    key: "encrypted",
    value: function encrypted() {
      return (0, _helpers.encryptObject)(this);
    }
  }, {
    key: "saveFile",
    value: function saveFile(encrypted) {
      const userSession = (0, _helpers.requireUserSession)();
      return userSession.putFile(this.blockstackPath(), JSON.stringify(encrypted), {
        encrypt: false
      });
    }
  }, {
    key: "blockstackPath",
    value: function blockstackPath() {
      const path = `${this.modelName()}/${this._id}`;
      return path;
    }
  }, {
    key: "fetch",
    value: async function fetch({
      decrypt = true
    } = {}) {
      const query = {
        _id: this._id
      };
      const {
        results
      } = await (0, _api.find)(query);
      const [attrs] = results;
      this.attrs = _objectSpread({}, this.attrs, attrs);

      if (decrypt) {
        await this.decrypt();
      }

      await this.afterFetch();
      return this;
    }
  }, {
    key: "decrypt",
    value: async function decrypt() {
      this.attrs = await (0, _helpers.decryptObject)(this.attrs, this);
      return this;
    }
  }, {
    key: "update",
    value: function update(attrs) {
      this.attrs = _objectSpread({}, this.attrs, attrs);
    }
  }, {
    key: "sign",
    value: async function sign() {
      if (this.attrs.updatable === false) {
        return true;
      }

      const signingKey = this.getSigningKey();
      this.attrs.signingKeyId = this.attrs.signingKeyId || signingKey._id;
      const {
        privateKey
      } = signingKey;
      const contentToSign = [this._id];

      if (this.attrs.updatedAt) {
        contentToSign.push(this.attrs.updatedAt);
      }

      const {
        signature
      } = (0, _encryption.signECDSA)(privateKey, contentToSign.join('-'));
      this.attrs.radiksSignature = signature;
      return this;
    }
  }, {
    key: "getSigningKey",
    value: function getSigningKey() {
      if (this.attrs.userGroupId) {
        const {
          userGroups,
          signingKeys
        } = (0, _helpers.userGroupKeys)();
        const _id = userGroups[this.attrs.userGroupId];
        const privateKey = signingKeys[_id];
        return {
          _id,
          privateKey
        };
      }

      return (0, _helpers.userGroupKeys)().personal;
    }
  }, {
    key: "encryptionPublicKey",
    value: async function encryptionPublicKey() {
      return (0, _keys.getPublicKeyFromPrivate)(this.encryptionPrivateKey());
    }
  }, {
    key: "encryptionPrivateKey",
    value: function encryptionPrivateKey() {
      let privateKey;

      if (this.attrs.userGroupId) {
        const {
          userGroups,
          signingKeys
        } = (0, _helpers.userGroupKeys)();
        privateKey = signingKeys[userGroups[this.attrs.userGroupId]];
      } else {
        privateKey = (0, _helpers.requireUserSession)().loadUserData().appPrivateKey;
      }

      return privateKey;
    }
  }, {
    key: "modelName",
    value: function modelName() {
      const {
        modelName
      } = this.constructor;
      return modelName.apply(this.constructor);
    }
  }, {
    key: "isOwnedByUser",
    value: function isOwnedByUser() {
      const keys = (0, _helpers.userGroupKeys)();

      if (this.attrs.signingKeyId === keys.personal._id) {
        return true;
      }

      if (this.attrs.userGroupId) {
        let isOwned = false;
        Object.keys(keys.userGroups).forEach(groupId => {
          if (groupId === this.attrs.userGroupId) {
            isOwned = true;
          }
        });
        return isOwned;
      }

      return false;
    }
  }, {
    key: "destroy",
    value: async function destroy() {
      await this.sign();
      return (0, _api.destroyModel)(this);
    } // @abstract

  }, {
    key: "beforeSave",
    value: function beforeSave() {} // @abstract

  }, {
    key: "afterFetch",
    value: function afterFetch() {}
  }], [{
    key: "modelName",
    value: function modelName() {
      return this.className || this.name;
    }
  }, {
    key: "addStreamListener",
    value: function addStreamListener(callback) {
      if (!this.emitter) {
        this.emitter = new _wolfy87Eventemitter.default();
      }

      if (this.emitter.getListeners().length === 0) {
        _streamer.default.addListener(args => {
          this.onStreamEvent(this, args);
        });
      }

      this.emitter.addListener(EVENT_NAME, callback);
    }
  }, {
    key: "removeStreamListener",
    value: function removeStreamListener(callback) {
      this.emitter.removeListener(EVENT_NAME, callback);

      if (this.emitter.getListeners().length === 0) {
        _streamer.default.removeListener(this.onStreamEvent);
      }
    } // LN specific

  }, {
    key: "addInvoiceStreamListener",
    value: function addInvoiceStreamListener(id, callback) {
      if (!this.invoiceEmitter) {
        this.invoiceEmitter = new _wolfy87Eventemitter.default();
      }

      if (this.invoiceEmitter.getListeners().length === 0) {
        _streamer.default.addInvoiceListener(id, args => {
          this.onInvoiceStreamEvent(this, args);
        });
      }

      this.invoiceEmitter.addListener(id, callback);
    }
  }, {
    key: "removeInvoiceStreamListener",
    value: function removeInvoiceStreamListener(id, callback) {
      this.invoiceEmitter.removeListener(id, callback);

      if (this.invoiceEmitter.getListeners().length === 0) {
        _streamer.default.removeInvoiceListener(id, this.onInvoiceStreamEvent);
      }
    }
  }]);

  return Model;
}();

exports.default = Model;

_defineProperty(Model, "schema", void 0);

_defineProperty(Model, "defaults", {});

_defineProperty(Model, "className", void 0);

_defineProperty(Model, "emitter", void 0);

_defineProperty(Model, "invoiceEmitter", void 0);

_defineProperty(Model, "onStreamEvent", (_this, [event]) => {
  try {
    const {
      data
    } = event;
    const attrs = JSON.parse(data);

    if (attrs && attrs.radiksType === _this.modelName()) {
      const model = new _this(attrs);

      if (model.isOwnedByUser()) {
        model.decrypt().then(() => {
          _this.emitter.emit(EVENT_NAME, model);
        });
      } else {
        _this.emitter.emit(EVENT_NAME, model);
      }
    }
  } catch (error) {// console.error(error.message);
  }
});

_defineProperty(Model, "onInvoiceStreamEvent", (_this, [event]) => {
  try {
    console.log('event: ' + event);
    const {
      data
    } = event;
    const invoice = JSON.parse(data);

    if (invoice) {
      _this.invoiceEmitter.emit(invoice.id, invoice);
    }
  } catch (error) {
    console.error(error.message);
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbC50cyJdLCJuYW1lcyI6WyJFVkVOVF9OQU1FIiwiSU5WT0lDRV9OQU1FIiwiTW9kZWwiLCJzY2hlbWEiLCJfc2VsZWN0b3IiLCJkZWNyeXB0Iiwic2VsZWN0b3IiLCJyYWRpa3NUeXBlIiwibW9kZWxOYW1lIiwicmVzdWx0cyIsIkNsYXp6IiwibW9kZWxEZWNyeXB0aW9ucyIsIm1hcCIsImRvYyIsIm1vZGVsIiwiUHJvbWlzZSIsInJlc29sdmUiLCJtb2RlbHMiLCJhbGwiLCJvcHRpb25zIiwibGltaXQiLCJmZXRjaExpc3QiLCJfaWQiLCJmZXRjaE9wdGlvbnMiLCJmZXRjaCIsInBlcnNvbmFsIiwic2lnbmluZ0tleUlkIiwiYXR0cnMiLCJkZWZhdWx0cyIsImNvbnN0cnVjdG9yIiwibmFtZSIsInJlcGxhY2UiLCJyZWplY3QiLCJiZWZvcmVTYXZlIiwibm93IiwiRGF0ZSIsImdldFRpbWUiLCJjcmVhdGVkQXQiLCJ1cGRhdGVkQXQiLCJzaWduIiwiZW5jcnlwdGVkIiwiZ2FpYVVSTCIsInNhdmVGaWxlIiwiZXJyb3IiLCJyZXNwb25zZSIsImNvbnNvbGUiLCJsb2ciLCJpZCIsImludm9pY2UiLCJ1c2VyU2Vzc2lvbiIsInB1dEZpbGUiLCJibG9ja3N0YWNrUGF0aCIsIkpTT04iLCJzdHJpbmdpZnkiLCJlbmNyeXB0IiwicGF0aCIsInF1ZXJ5IiwiYWZ0ZXJGZXRjaCIsInVwZGF0YWJsZSIsInNpZ25pbmdLZXkiLCJnZXRTaWduaW5nS2V5IiwicHJpdmF0ZUtleSIsImNvbnRlbnRUb1NpZ24iLCJwdXNoIiwic2lnbmF0dXJlIiwiam9pbiIsInJhZGlrc1NpZ25hdHVyZSIsInVzZXJHcm91cElkIiwidXNlckdyb3VwcyIsInNpZ25pbmdLZXlzIiwiZW5jcnlwdGlvblByaXZhdGVLZXkiLCJsb2FkVXNlckRhdGEiLCJhcHBQcml2YXRlS2V5IiwiYXBwbHkiLCJrZXlzIiwiaXNPd25lZCIsIk9iamVjdCIsImZvckVhY2giLCJncm91cElkIiwiY2xhc3NOYW1lIiwiY2FsbGJhY2siLCJlbWl0dGVyIiwiRXZlbnRFbWl0dGVyIiwiZ2V0TGlzdGVuZXJzIiwibGVuZ3RoIiwiU3RyZWFtZXIiLCJhZGRMaXN0ZW5lciIsImFyZ3MiLCJvblN0cmVhbUV2ZW50IiwicmVtb3ZlTGlzdGVuZXIiLCJpbnZvaWNlRW1pdHRlciIsImFkZEludm9pY2VMaXN0ZW5lciIsIm9uSW52b2ljZVN0cmVhbUV2ZW50IiwicmVtb3ZlSW52b2ljZUxpc3RlbmVyIiwiX3RoaXMiLCJldmVudCIsImRhdGEiLCJwYXJzZSIsImlzT3duZWRCeVVzZXIiLCJ0aGVuIiwiZW1pdCIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFHQTs7QUFHQTs7Ozs7Ozs7Ozs7Ozs7QUFHQSxNQUFNQSxVQUFVLEdBQUcsb0JBQW5CO0FBQ0EsTUFBTUMsWUFBWSxHQUFHLHNCQUFyQjs7SUFVcUJDLEs7Ozs7OytCQVdEQyxNLEVBQWdCO0FBQ2hDLFdBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7b0NBR0NDLFNBQW9CLEdBQUcsRSxFQUN2QjtBQUFFQyxNQUFBQSxPQUFPLEdBQUc7QUFBWixRQUFtQyxFLEVBQ25DO0FBQ0EsWUFBTUMsUUFBbUIscUJBQ3BCRixTQURvQjtBQUV2QkcsUUFBQUEsVUFBVSxFQUFFLEtBQUtDLFNBQUw7QUFGVyxRQUF6Qjs7QUFJQSxZQUFNO0FBQUVDLFFBQUFBO0FBQUYsVUFBYyxNQUFNLGVBQUtILFFBQUwsQ0FBMUI7QUFDQSxZQUFNSSxLQUFLLEdBQUcsSUFBZDtBQUNBLFlBQU1DLGdCQUE4QixHQUFHRixPQUFPLENBQUNHLEdBQVIsQ0FBYUMsR0FBRCxJQUFjO0FBQy9ELGNBQU1DLEtBQUssR0FBRyxJQUFJSixLQUFKLENBQVVHLEdBQVYsQ0FBZDs7QUFDQSxZQUFJUixPQUFKLEVBQWE7QUFDWCxpQkFBT1MsS0FBSyxDQUFDVCxPQUFOLEVBQVA7QUFDRDs7QUFDRCxl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QXhCO0FBQ0UsVUFBTTtBQUFFQyxNQUFBQTtBQUFGLFFBQVdELEtBQWpCO0FBQ0EsVUFBTS9DLE9BQU8sR0FBR0ksSUFBSSxDQUFDNkMsS0FBTCxDQUFXRCxJQUFYLENBQWhCOztBQUNBLFFBQUloRCxPQUFKLEVBQWE7QUFDVDhDLE1BQUFBLEtBQUssQ0FBQ0osY0FBTixDQUFxQlUsSUFBckIsQ0FBMEJwRCxPQUFPLENBQUNELEVBQWxDLEVBQXNDQyxPQUF0QztBQUNIO0FBQ0osR0FQRCxDQU9FLE9BQU9MLEtBQVAsRUFBYztBQUNaRSxJQUFBQSxPQUFPLENBQUNGLEtBQVIsQ0FBY0EsS0FBSyxDQUFDMEQsT0FBcEI7QUFDSDtBQUNKLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdXVpZCBmcm9tICd1dWlkL3Y0JztcbmltcG9ydCB7IGdldFB1YmxpY0tleUZyb21Qcml2YXRlIH0gZnJvbSAnYmxvY2tzdGFjay9saWIva2V5cyc7XG5pbXBvcnQgeyBzaWduRUNEU0EgfSBmcm9tICdibG9ja3N0YWNrL2xpYi9lbmNyeXB0aW9uJztcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnd29sZnk4Ny1ldmVudGVtaXR0ZXInO1xuXG5pbXBvcnQge1xuICBlbmNyeXB0T2JqZWN0LCBkZWNyeXB0T2JqZWN0LCB1c2VyR3JvdXBLZXlzLCByZXF1aXJlVXNlclNlc3Npb24sXG59IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQge1xuICAgIHNlbmROZXdHYWlhVXJsLCBmaW5kLCBGaW5kUXVlcnksIGRlc3Ryb3lNb2RlbCwgY2hlY2tQYXlSZXEsIHNlbmROZXdHYWlhVXJsTE4sXG59IGZyb20gJy4vYXBpJztcbmltcG9ydCBTdHJlYW1lciBmcm9tICcuL3N0cmVhbWVyJztcbmltcG9ydCB7IFNjaGVtYSwgQXR0cnMgfSBmcm9tICcuL3R5cGVzL2luZGV4JztcblxuY29uc3QgRVZFTlRfTkFNRSA9ICdNT0RFTF9TVFJFQU1fRVZFTlQnO1xuY29uc3QgSU5WT0lDRV9OQU1FID0gJ0lOVk9JQ0VfU1RSRUFNX0VWRU5UJztcblxuaW50ZXJmYWNlIEZldGNoT3B0aW9ucyB7XG4gIGRlY3J5cHQ/OiBib29sZWFuXG59XG5cbmludGVyZmFjZSBFdmVudCB7XG4gIGRhdGE6IHN0cmluZ1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb2RlbCB7XG4gIHB1YmxpYyBzdGF0aWMgc2NoZW1hOiBTY2hlbWE7XG4gIHB1YmxpYyBzdGF0aWMgZGVmYXVsdHM6IGFueSA9IHt9O1xuICBwdWJsaWMgc3RhdGljIGNsYXNzTmFtZT86IHN0cmluZztcbiAgcHVibGljIHN0YXRpYyBlbWl0dGVyPzogRXZlbnRFbWl0dGVyO1xuICBwdWJsaWMgc3RhdGljIGludm9pY2VFbWl0dGVyPzogRXZlbnRFbWl0dGVyO1xuICBzY2hlbWE6IFNjaGVtYTtcbiAgX2lkOiBzdHJpbmc7XG4gIGF0dHJzOiBBdHRycztcblxuXG4gIHN0YXRpYyBmcm9tU2NoZW1hKHNjaGVtYTogU2NoZW1hKSB7XG4gICAgdGhpcy5zY2hlbWEgPSBzY2hlbWE7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZmV0Y2hMaXN0PFQgZXh0ZW5kcyBNb2RlbD4oXG4gICAgX3NlbGVjdG9yOiBGaW5kUXVlcnkgPSB7fSxcbiAgICB7IGRlY3J5cHQgPSB0cnVlIH06IEZldGNoT3B0aW9ucyA9IHt9LFxuICApIHtcbiAgICBjb25zdCBzZWxlY3RvcjogRmluZFF1ZXJ5ID0ge1xuICAgICAgLi4uX3NlbGVjdG9yLFxuICAgICAgcmFkaWtzVHlwZTogdGhpcy5tb2RlbE5hbWUoKSxcbiAgICB9O1xuICAgIGNvbnN0IHsgcmVzdWx0cyB9ID0gYXdhaXQgZmluZChzZWxlY3Rvcik7XG4gICAgY29uc3QgQ2xhenogPSB0aGlzO1xuICAgIGNvbnN0IG1vZGVsRGVjcnlwdGlvbnM6IFByb21pc2U8VD5bXSA9IHJlc3VsdHMubWFwKChkb2M6IGFueSkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBuZXcgQ2xhenooZG9jKTtcbiAgICAgIGlmIChkZWNyeXB0KSB7XG4gICAgICAgIHJldHVybiBtb2RlbC5kZWNyeXB0KCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG1vZGVsKTtcbiAgICB9KTtcbiAgICBjb25zdCBtb2RlbHM6IFRbXSA9IGF3YWl0IFByb21pc2UuYWxsKG1vZGVsRGVjcnlwdGlvbnMpO1xuICAgIHJldHVybiBtb2RlbHM7XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZmluZE9uZTxUIGV4dGVuZHMgTW9kZWw+KFxuICAgIF9zZWxlY3RvcjogRmluZFF1ZXJ5ID0ge30sXG4gICAgb3B0aW9uczogRmV0Y2hPcHRpb25zID0geyBkZWNyeXB0OiB0cnVlIH0sXG4gICkge1xuICAgIGNvbnN0IHNlbGVjdG9yOiBGaW5kUXVlcnkgPSB7XG4gICAgICAuLi5fc2VsZWN0b3IsXG4gICAgICBsaW1pdDogMSxcbiAgICB9O1xuICAgIGNvbnN0IHJlc3VsdHM6IFRbXSA9IGF3YWl0IHRoaXMuZmV0Y2hMaXN0KHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICByZXR1cm4gcmVzdWx0c1swXTtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBmaW5kQnlJZDxUIGV4dGVuZHMgTW9kZWw+KF9pZDogc3RyaW5nLCBmZXRjaE9wdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gICAgY29uc3QgQ2xhenogPSB0aGlzO1xuICAgIGNvbnN0IG1vZGVsOiBNb2RlbCA9IG5ldyBDbGF6eih7IF9pZCB9KTtcbiAgICByZXR1cm4gbW9kZWwuZmV0Y2goZmV0Y2hPcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGZXRjaCBhbGwgbW9kZWxzIHRoYXQgYXJlIG93bmVkIGJ5IHRoZSBjdXJyZW50IHVzZXIuXG4gICAqIFRoaXMgb25seSBpbmNsdWRlcyAncGVyc29uYWxseScgb3duZWQgbW9kZWxzLCBhbmQgbm90IHRob3NlIGNyZWF0ZWRcbiAgICogYXMgcGFydCBvZiBhIFVzZXJHcm91cFxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gX3NlbGVjdG9yIC0gQSBxdWVyeSB0byBpbmNsdWRlIHdoZW4gZmV0Y2hpbmcgbW9kZWxzXG4gICAqL1xuICBzdGF0aWMgZmV0Y2hPd25MaXN0KF9zZWxlY3RvcjogRmluZFF1ZXJ5ID0ge30pIHtcbiAgICBjb25zdCB7IF9pZCB9ID0gdXNlckdyb3VwS2V5cygpLnBlcnNvbmFsO1xuICAgIGNvbnN0IHNlbGVjdG9yID0ge1xuICAgICAgLi4uX3NlbGVjdG9yLFxuICAgICAgc2lnbmluZ0tleUlkOiBfaWQsXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5mZXRjaExpc3Qoc2VsZWN0b3IpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoYXR0cnM6IEF0dHJzID0ge30pIHtcbiAgICBjb25zdCB7IHNjaGVtYSwgZGVmYXVsdHMgfSA9IHRoaXMuY29uc3RydWN0b3IgYXMgdHlwZW9mIE1vZGVsO1xuICAgIGNvbnN0IG5hbWUgPSB0aGlzLm1vZGVsTmFtZSgpO1xuICAgIHRoaXMuc2NoZW1hID0gc2NoZW1hO1xuICAgIHRoaXMuX2lkID0gYXR0cnMuX2lkIHx8IHV1aWQoKS5yZXBsYWNlKCctJywgJycpO1xuICAgIHRoaXMuYXR0cnMgPSB7XG4gICAgICAuLi5kZWZhdWx0cyxcbiAgICAgIC4uLmF0dHJzLFxuICAgICAgcmFkaWtzVHlwZTogbmFtZSxcbiAgICB9O1xuICB9XG5cbiAgICBhc3luYyBzYXZlKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5iZWZvcmVTYXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuYmVmb3JlU2F2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHJzLmNyZWF0ZWRBdCA9IHRoaXMuYXR0cnMuY3JlYXRlZEF0IHx8IG5vdztcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHJzLnVwZGF0ZWRBdCA9IG5vdztcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnNpZ24oKTtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmNyeXB0ZWQgPSBhd2FpdCB0aGlzLmVuY3J5cHRlZCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGdhaWFVUkwgPSBhd2FpdCB0aGlzLnNhdmVGaWxlKGVuY3J5cHRlZCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgc2VuZE5ld0dhaWFVcmwoZ2FpYVVSTCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgc2F2ZUxOKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5iZWZvcmVTYXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuYmVmb3JlU2F2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHJzLmNyZWF0ZWRBdCA9IHRoaXMuYXR0cnMuY3JlYXRlZEF0IHx8IG5vdztcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHJzLnVwZGF0ZWRBdCA9IG5vdztcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnNpZ24oKTtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmNyeXB0ZWQgPSBhd2FpdCB0aGlzLmVuY3J5cHRlZCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGdhaWFVUkwgPSBhd2FpdCB0aGlzLnNhdmVGaWxlKGVuY3J5cHRlZCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZW5kTmV3R2FpYVVybExOKGdhaWFVUkwpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTW9kZWwgc2F2ZWQ6IFwiICsgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgYXN5bmMgY2hlY2tQYXlSZXFQYWlkKGlkKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGludm9pY2UgPSBhd2FpdCBjaGVja1BheVJlcShpZCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSW52b2ljZSBpbmZvOiBcIiArIGludm9pY2UpO1xuICAgICAgICByZXNvbHZlKGludm9pY2UpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBlbmNyeXB0ZWQoKSB7XG4gICAgcmV0dXJuIGVuY3J5cHRPYmplY3QodGhpcyk7XG4gIH1cblxuICBzYXZlRmlsZShlbmNyeXB0ZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgICBjb25zdCB1c2VyU2Vzc2lvbiA9IHJlcXVpcmVVc2VyU2Vzc2lvbigpO1xuICAgIHJldHVybiB1c2VyU2Vzc2lvbi5wdXRGaWxlKHRoaXMuYmxvY2tzdGFja1BhdGgoKSwgSlNPTi5zdHJpbmdpZnkoZW5jcnlwdGVkKSwge1xuICAgICAgZW5jcnlwdDogZmFsc2UsXG4gICAgfSk7XG4gIH1cblxuICBibG9ja3N0YWNrUGF0aCgpIHtcbiAgICBjb25zdCBwYXRoID0gYCR7dGhpcy5tb2RlbE5hbWUoKX0vJHt0aGlzLl9pZH1gO1xuICAgIHJldHVybiBwYXRoO1xuICB9XG5cbiAgYXN5bmMgZmV0Y2goeyBkZWNyeXB0ID0gdHJ1ZSB9ID0ge30pIHtcbiAgICBjb25zdCBxdWVyeSA9IHtcbiAgICAgIF9pZDogdGhpcy5faWQsXG4gICAgfTtcbiAgICBjb25zdCB7IHJlc3VsdHMgfSA9IGF3YWl0IGZpbmQocXVlcnkpO1xuICAgIGNvbnN0IFthdHRyc10gPSByZXN1bHRzO1xuICAgIHRoaXMuYXR0cnMgPSB7XG4gICAgICAuLi50aGlzLmF0dHJzLFxuICAgICAgLi4uYXR0cnMsXG4gICAgfTtcbiAgICBpZiAoZGVjcnlwdCkge1xuICAgICAgYXdhaXQgdGhpcy5kZWNyeXB0KCk7XG4gICAgfVxuICAgIGF3YWl0IHRoaXMuYWZ0ZXJGZXRjaCgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYXN5bmMgZGVjcnlwdCgpIHtcbiAgICB0aGlzLmF0dHJzID0gYXdhaXQgZGVjcnlwdE9iamVjdCh0aGlzLmF0dHJzLCB0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHVwZGF0ZShhdHRyczogQXR0cnMpIHtcbiAgICB0aGlzLmF0dHJzID0ge1xuICAgICAgLi4udGhpcy5hdHRycyxcbiAgICAgIC4uLmF0dHJzLFxuICAgIH07XG4gIH1cblxuICBhc3luYyBzaWduKCkge1xuICAgIGlmICh0aGlzLmF0dHJzLnVwZGF0YWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjb25zdCBzaWduaW5nS2V5ID0gdGhpcy5nZXRTaWduaW5nS2V5KCk7XG4gICAgdGhpcy5hdHRycy5zaWduaW5nS2V5SWQgPSB0aGlzLmF0dHJzLnNpZ25pbmdLZXlJZCB8fCBzaWduaW5nS2V5Ll9pZDtcbiAgICBjb25zdCB7IHByaXZhdGVLZXkgfSA9IHNpZ25pbmdLZXk7XG4gICAgY29uc3QgY29udGVudFRvU2lnbjogKHN0cmluZyB8IG51bWJlcilbXSA9IFt0aGlzLl9pZF07XG4gICAgaWYgKHRoaXMuYXR0cnMudXBkYXRlZEF0KSB7XG4gICAgICBjb250ZW50VG9TaWduLnB1c2godGhpcy5hdHRycy51cGRhdGVkQXQpO1xuICAgIH1cbiAgICBjb25zdCB7IHNpZ25hdHVyZSB9ID0gc2lnbkVDRFNBKHByaXZhdGVLZXksIGNvbnRlbnRUb1NpZ24uam9pbignLScpKTtcbiAgICB0aGlzLmF0dHJzLnJhZGlrc1NpZ25hdHVyZSA9IHNpZ25hdHVyZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGdldFNpZ25pbmdLZXkoKSB7XG4gICAgaWYgKHRoaXMuYXR0cnMudXNlckdyb3VwSWQpIHtcbiAgICAgIGNvbnN0IHsgdXNlckdyb3Vwcywgc2lnbmluZ0tleXMgfSA9IHVzZXJHcm91cEtleXMoKTtcblxuICAgICAgY29uc3QgX2lkID0gdXNlckdyb3Vwc1t0aGlzLmF0dHJzLnVzZXJHcm91cElkXTtcbiAgICAgIGNvbnN0IHByaXZhdGVLZXkgPSBzaWduaW5nS2V5c1tfaWRdO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkLFxuICAgICAgICBwcml2YXRlS2V5LFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHVzZXJHcm91cEtleXMoKS5wZXJzb25hbDtcbiAgfVxuXG4gIGFzeW5jIGVuY3J5cHRpb25QdWJsaWNLZXkoKSB7XG4gICAgcmV0dXJuIGdldFB1YmxpY0tleUZyb21Qcml2YXRlKHRoaXMuZW5jcnlwdGlvblByaXZhdGVLZXkoKSk7XG4gIH1cblxuICBlbmNyeXB0aW9uUHJpdmF0ZUtleSgpIHtcbiAgICBsZXQgcHJpdmF0ZUtleTogc3RyaW5nO1xuICAgIGlmICh0aGlzLmF0dHJzLnVzZXJHcm91cElkKSB7XG4gICAgICBjb25zdCB7IHVzZXJHcm91cHMsIHNpZ25pbmdLZXlzIH0gPSB1c2VyR3JvdXBLZXlzKCk7XG4gICAgICBwcml2YXRlS2V5ID0gc2lnbmluZ0tleXNbdXNlckdyb3Vwc1t0aGlzLmF0dHJzLnVzZXJHcm91cElkXV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHByaXZhdGVLZXkgPSByZXF1aXJlVXNlclNlc3Npb24oKS5sb2FkVXNlckRhdGEoKS5hcHBQcml2YXRlS2V5O1xuICAgIH1cbiAgICByZXR1cm4gcHJpdmF0ZUtleTtcbiAgfVxuXG4gIHN0YXRpYyBtb2RlbE5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5jbGFzc05hbWUgfHwgdGhpcy5uYW1lO1xuICB9XG5cbiAgbW9kZWxOYW1lKCk6IHN0cmluZyB7XG4gICAgY29uc3QgeyBtb2RlbE5hbWUgfSA9IHRoaXMuY29uc3RydWN0b3IgYXMgdHlwZW9mIE1vZGVsO1xuICAgIHJldHVybiBtb2RlbE5hbWUuYXBwbHkodGhpcy5jb25zdHJ1Y3Rvcik7XG4gIH1cblxuICBpc093bmVkQnlVc2VyKCkge1xuICAgIGNvbnN0IGtleXMgPSB1c2VyR3JvdXBLZXlzKCk7XG4gICAgaWYgKHRoaXMuYXR0cnMuc2lnbmluZ0tleUlkID09PSBrZXlzLnBlcnNvbmFsLl9pZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBpZiAodGhpcy5hdHRycy51c2VyR3JvdXBJZCkge1xuICAgICAgbGV0IGlzT3duZWQgPSBmYWxzZTtcbiAgICAgIE9iamVjdC5rZXlzKGtleXMudXNlckdyb3VwcykuZm9yRWFjaCgoZ3JvdXBJZCkgPT4ge1xuICAgICAgICBpZiAoZ3JvdXBJZCA9PT0gdGhpcy5hdHRycy51c2VyR3JvdXBJZCkge1xuICAgICAgICAgIGlzT3duZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBpc093bmVkO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuXG4gIHN0YXRpYyBvblN0cmVhbUV2ZW50ID0gKF90aGlzLCBbZXZlbnRdKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHsgZGF0YSB9ID0gZXZlbnQ7XG4gICAgICBjb25zdCBhdHRycyA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICBpZiAoYXR0cnMgJiYgYXR0cnMucmFkaWtzVHlwZSA9PT0gX3RoaXMubW9kZWxOYW1lKCkpIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBuZXcgX3RoaXMoYXR0cnMpO1xuICAgICAgICBpZiAobW9kZWwuaXNPd25lZEJ5VXNlcigpKSB7XG4gICAgICAgICAgbW9kZWwuZGVjcnlwdCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgX3RoaXMuZW1pdHRlci5lbWl0KEVWRU5UX05BTUUsIG1vZGVsKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfdGhpcy5lbWl0dGVyLmVtaXQoRVZFTlRfTkFNRSwgbW9kZWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vIGNvbnNvbGUuZXJyb3IoZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGFkZFN0cmVhbUxpc3RlbmVyKGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XG4gICAgaWYgKCF0aGlzLmVtaXR0ZXIpIHtcbiAgICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZW1pdHRlci5nZXRMaXN0ZW5lcnMoKS5sZW5ndGggPT09IDApIHtcbiAgICAgIFN0cmVhbWVyLmFkZExpc3RlbmVyKChhcmdzOiBhbnkpID0+IHtcbiAgICAgICAgdGhpcy5vblN0cmVhbUV2ZW50KHRoaXMsIGFyZ3MpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuZW1pdHRlci5hZGRMaXN0ZW5lcihFVkVOVF9OQU1FLCBjYWxsYmFjayk7XG4gIH1cblxuICBzdGF0aWMgcmVtb3ZlU3RyZWFtTGlzdGVuZXIoY2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcbiAgICB0aGlzLmVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIoRVZFTlRfTkFNRSwgY2FsbGJhY2spO1xuICAgIGlmICh0aGlzLmVtaXR0ZXIuZ2V0TGlzdGVuZXJzKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICBTdHJlYW1lci5yZW1vdmVMaXN0ZW5lcih0aGlzLm9uU3RyZWFtRXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIExOIHNwZWNpZmljXG4gICAgc3RhdGljIG9uSW52b2ljZVN0cmVhbUV2ZW50ID0gKF90aGlzLCBbZXZlbnRdKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2V2ZW50OiAnICsgZXZlbnQpO1xuICAgICAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBldmVudDtcbiAgICAgICAgICAgIGNvbnN0IGludm9pY2UgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgaWYgKGludm9pY2UpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5pbnZvaWNlRW1pdHRlci5lbWl0KGludm9pY2UuaWQsIGludm9pY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBhZGRJbnZvaWNlU3RyZWFtTGlzdGVuZXIoaWQsIGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIGlmICghdGhpcy5pbnZvaWNlRW1pdHRlcikge1xuICAgICAgICAgICAgdGhpcy5pbnZvaWNlRW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pbnZvaWNlRW1pdHRlci5nZXRMaXN0ZW5lcnMoKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIFN0cmVhbWVyLmFkZEludm9pY2VMaXN0ZW5lcihpZCwgKGFyZ3M6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub25JbnZvaWNlU3RyZWFtRXZlbnQodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmludm9pY2VFbWl0dGVyLmFkZExpc3RlbmVyKGlkLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlbW92ZUludm9pY2VTdHJlYW1MaXN0ZW5lcihpZCwgY2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy5pbnZvaWNlRW1pdHRlci5yZW1vdmVMaXN0ZW5lcihpZCwgY2FsbGJhY2spO1xuICAgICAgICBpZiAodGhpcy5pbnZvaWNlRW1pdHRlci5nZXRMaXN0ZW5lcnMoKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIFN0cmVhbWVyLnJlbW92ZUludm9pY2VMaXN0ZW5lcihpZCwgdGhpcy5vbkludm9pY2VTdHJlYW1FdmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgYXN5bmMgZGVzdHJveSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBhd2FpdCB0aGlzLnNpZ24oKTtcbiAgICByZXR1cm4gZGVzdHJveU1vZGVsKHRoaXMpO1xuICB9XG5cbiAgLy8gQGFic3RyYWN0XG4gIGJlZm9yZVNhdmUoKSB7IH1cblxuICAvLyBAYWJzdHJhY3RcbiAgYWZ0ZXJGZXRjaCgpIHsgfVxufVxuIl19