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
      if (!this.emitter) {
        this.emitter = new _wolfy87Eventemitter.default();
      }

      if (this.emitter.getListeners().length === 0) {
        _streamer.default.addInvoiceListener(id, args => {
          this.onInvoiceStreamEvent(this, args);
        });
      }

      this.emitter.addListener(INVOICE_NAME, callback);
    }
  }, {
    key: "removeInvoiceStreamListener",
    value: function removeInvoiceStreamListener(id, callback) {
      this.emitter.removeListener(INVOICE_NAME, callback);

      if (this.emitter.getListeners().length === 0) {
        _streamer.default.removeInvoiceListener(id, this.onStreamEvent);
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
      _this.emitter.emit(INVOICE_NAME, invoice);
    }
  } catch (error) {
    console.error(error.message);
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbC50cyJdLCJuYW1lcyI6WyJFVkVOVF9OQU1FIiwiSU5WT0lDRV9OQU1FIiwiTW9kZWwiLCJzY2hlbWEiLCJfc2VsZWN0b3IiLCJkZWNyeXB0Iiwic2VsZWN0b3IiLCJyYWRpa3NUeXBlIiwibW9kZWxOYW1lIiwicmVzdWx0cyIsIkNsYXp6IiwibW9kZWxEZWNyeXB0aW9ucyIsIm1hcCIsImRvYyIsIm1vZGVsIiwiUHJvbWlzZSIsInJlc29sdmUiLCJtb2RlbHMiLCJhbGwiLCJvcHRpb25zIiwibGltaXQiLCJmZXRjaExpc3QiLCJfaWQiLCJmZXRjaE9wdGlvbnMiLCJmZXRjaCIsInBlcnNvbmFsIiwic2lnbmluZ0tleUlkIiwiYXR0cnMiLCJkZWZhdWx0cyIsImNvbnN0cnVjdG9yIiwibmFtZSIsInJlcGxhY2UiLCJyZWplY3QiLCJiZWZvcmVTYXZlIiwibm93IiwiRGF0ZSIsImdldFRpbWUiLCJjcmVhdGVkQXQiLCJ1cGRhdGVkQXQiLCJzaWduIiwiZW5jcnlwdGVkIiwiZ2FpYVVSTCIsInNhdmVGaWxlIiwiZXJyb3IiLCJyZXNwb25zZSIsImNvbnNvbGUiLCJsb2ciLCJpZCIsImludm9pY2UiLCJ1c2VyU2Vzc2lvbiIsInB1dEZpbGUiLCJibG9ja3N0YWNrUGF0aCIsIkpTT04iLCJzdHJpbmdpZnkiLCJlbmNyeXB0IiwicGF0aCIsInF1ZXJ5IiwiYWZ0ZXJGZXRjaCIsInVwZGF0YWJsZSIsInNpZ25pbmdLZXkiLCJnZXRTaWduaW5nS2V5IiwicHJpdmF0ZUtleSIsImNvbnRlbnRUb1NpZ24iLCJwdXNoIiwic2lnbmF0dXJlIiwiam9pbiIsInJhZGlrc1NpZ25hdHVyZSIsInVzZXJHcm91cElkIiwidXNlckdyb3VwcyIsInNpZ25pbmdLZXlzIiwiZW5jcnlwdGlvblByaXZhdGVLZXkiLCJsb2FkVXNlckRhdGEiLCJhcHBQcml2YXRlS2V5IiwiYXBwbHkiLCJrZXlzIiwiaXNPd25lZCIsIk9iamVjdCIsImZvckVhY2giLCJncm91cElkIiwiY2xhc3NOYW1lIiwiY2FsbGJhY2siLCJlbWl0dGVyIiwiRXZlbnRFbWl0dGVyIiwiZ2V0TGlzdGVuZXJzIiwibGVuZ3RoIiwiU3RyZWFtZXIiLCJhZGRMaXN0ZW5lciIsImFyZ3MiLCJvblN0cmVhbUV2ZW50IiwicmVtb3ZlTGlzdGVuZXIiLCJhZGRJbnZvaWNlTGlzdGVuZXIiLCJvbkludm9pY2VTdHJlYW1FdmVudCIsInJlbW92ZUludm9pY2VMaXN0ZW5lciIsIl90aGlzIiwiZXZlbnQiLCJkYXRhIiwicGFyc2UiLCJpc093bmVkQnlVc2VyIiwidGhlbiIsImVtaXQiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBR0E7O0FBR0E7Ozs7Ozs7Ozs7Ozs7O0FBR0EsTUFBTUEsVUFBVSxHQUFHLG9CQUFuQjtBQUNBLE1BQU1DLFlBQVksR0FBRyxzQkFBckI7O0lBVXFCQyxLOzs7OzsrQkFVREMsTSxFQUFnQjtBQUNoQyxXQUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxhQUFPLElBQVA7QUFDRDs7O29DQUdDQyxTQUFvQixHQUFHLEUsRUFDdkI7QUFBRUMsTUFBQUEsT0FBTyxHQUFHO0FBQVosUUFBbUMsRSxFQUNuQztBQUNBLFlBQU1DLFFBQW1CLHFCQUNwQkYsU0FEb0I7QUFFdkJHLFFBQUFBLFVBQVUsRUFBRSxLQUFLQyxTQUFMO0FBRlcsUUFBekI7O0FBSUEsWUFBTTtBQUFFQyxRQUFBQTtBQUFGLFVBQWMsTUFBTSxlQUFLSCxRQUFMLENBQTFCO0FBQ0EsWUFBTUksS0FBSyxHQUFHLElBQWQ7QUFDQSxZQUFNQyxnQkFBOEIsR0FBR0YsT0FBTyxDQUFDRyxHQUFSLENBQWFDLEdBQUQsSUFBYztBQUMvRCxjQUFNQyxLQUFLLEdBQUcsSUFBSUosS0FBSixDQUFVRyxHQUFWLENBQWQ7O0FBQ0EsWUFBSVIsT0FBSixFQUFhO0FBQ1gsaUJBQU9TLEtBQUssQ0FBQ1QsT0FBTixFQUFQO0FBQ0Q7O0FBQ0QsZUFBT1UsT0FBTyxDQUFDQyxP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QWpCO0FBQ0EsVUFBTTlDLE9BQU8sR0FBR0ksSUFBSSxDQUFDNEMsS0FBTCxDQUFXRCxJQUFYLENBQWhCOztBQUNBLFFBQUkvQyxPQUFKLEVBQWE7QUFDVDZDLE1BQUFBLEtBQUssQ0FBQ1osT0FBTixDQUFja0IsSUFBZCxDQUFtQmxHLFlBQW5CLEVBQWlDK0MsT0FBakM7QUFDSDtBQUNKLEdBUEQsQ0FPRSxPQUFPTCxLQUFQLEVBQWM7QUFDWkUsSUFBQUEsT0FBTyxDQUFDRixLQUFSLENBQWNBLEtBQUssQ0FBQ3lELE9BQXBCO0FBQ0g7QUFDSixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHV1aWQgZnJvbSAndXVpZC92NCc7XG5pbXBvcnQgeyBnZXRQdWJsaWNLZXlGcm9tUHJpdmF0ZSB9IGZyb20gJ2Jsb2Nrc3RhY2svbGliL2tleXMnO1xuaW1wb3J0IHsgc2lnbkVDRFNBIH0gZnJvbSAnYmxvY2tzdGFjay9saWIvZW5jcnlwdGlvbic7XG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ3dvbGZ5ODctZXZlbnRlbWl0dGVyJztcblxuaW1wb3J0IHtcbiAgZW5jcnlwdE9iamVjdCwgZGVjcnlwdE9iamVjdCwgdXNlckdyb3VwS2V5cywgcmVxdWlyZVVzZXJTZXNzaW9uLFxufSBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IHtcbiAgICBzZW5kTmV3R2FpYVVybCwgZmluZCwgRmluZFF1ZXJ5LCBkZXN0cm95TW9kZWwsIGNoZWNrUGF5UmVxLCBzZW5kTmV3R2FpYVVybExOLFxufSBmcm9tICcuL2FwaSc7XG5pbXBvcnQgU3RyZWFtZXIgZnJvbSAnLi9zdHJlYW1lcic7XG5pbXBvcnQgeyBTY2hlbWEsIEF0dHJzIH0gZnJvbSAnLi90eXBlcy9pbmRleCc7XG5cbmNvbnN0IEVWRU5UX05BTUUgPSAnTU9ERUxfU1RSRUFNX0VWRU5UJztcbmNvbnN0IElOVk9JQ0VfTkFNRSA9ICdJTlZPSUNFX1NUUkVBTV9FVkVOVCc7XG5cbmludGVyZmFjZSBGZXRjaE9wdGlvbnMge1xuICBkZWNyeXB0PzogYm9vbGVhblxufVxuXG5pbnRlcmZhY2UgRXZlbnQge1xuICBkYXRhOiBzdHJpbmdcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9kZWwge1xuICBwdWJsaWMgc3RhdGljIHNjaGVtYTogU2NoZW1hO1xuICBwdWJsaWMgc3RhdGljIGRlZmF1bHRzOiBhbnkgPSB7fTtcbiAgcHVibGljIHN0YXRpYyBjbGFzc05hbWU/OiBzdHJpbmc7XG4gIHB1YmxpYyBzdGF0aWMgZW1pdHRlcj86IEV2ZW50RW1pdHRlcjtcbiAgc2NoZW1hOiBTY2hlbWE7XG4gIF9pZDogc3RyaW5nO1xuICBhdHRyczogQXR0cnM7XG5cblxuICBzdGF0aWMgZnJvbVNjaGVtYShzY2hlbWE6IFNjaGVtYSkge1xuICAgIHRoaXMuc2NoZW1hID0gc2NoZW1hO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGZldGNoTGlzdDxUIGV4dGVuZHMgTW9kZWw+KFxuICAgIF9zZWxlY3RvcjogRmluZFF1ZXJ5ID0ge30sXG4gICAgeyBkZWNyeXB0ID0gdHJ1ZSB9OiBGZXRjaE9wdGlvbnMgPSB7fSxcbiAgKSB7XG4gICAgY29uc3Qgc2VsZWN0b3I6IEZpbmRRdWVyeSA9IHtcbiAgICAgIC4uLl9zZWxlY3RvcixcbiAgICAgIHJhZGlrc1R5cGU6IHRoaXMubW9kZWxOYW1lKCksXG4gICAgfTtcbiAgICBjb25zdCB7IHJlc3VsdHMgfSA9IGF3YWl0IGZpbmQoc2VsZWN0b3IpO1xuICAgIGNvbnN0IENsYXp6ID0gdGhpcztcbiAgICBjb25zdCBtb2RlbERlY3J5cHRpb25zOiBQcm9taXNlPFQ+W10gPSByZXN1bHRzLm1hcCgoZG9jOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gbmV3IENsYXp6KGRvYyk7XG4gICAgICBpZiAoZGVjcnlwdCkge1xuICAgICAgICByZXR1cm4gbW9kZWwuZGVjcnlwdCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShtb2RlbCk7XG4gICAgfSk7XG4gICAgY29uc3QgbW9kZWxzOiBUW10gPSBhd2FpdCBQcm9taXNlLmFsbChtb2RlbERlY3J5cHRpb25zKTtcbiAgICByZXR1cm4gbW9kZWxzO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGZpbmRPbmU8VCBleHRlbmRzIE1vZGVsPihcbiAgICBfc2VsZWN0b3I6IEZpbmRRdWVyeSA9IHt9LFxuICAgIG9wdGlvbnM6IEZldGNoT3B0aW9ucyA9IHsgZGVjcnlwdDogdHJ1ZSB9LFxuICApIHtcbiAgICBjb25zdCBzZWxlY3RvcjogRmluZFF1ZXJ5ID0ge1xuICAgICAgLi4uX3NlbGVjdG9yLFxuICAgICAgbGltaXQ6IDEsXG4gICAgfTtcbiAgICBjb25zdCByZXN1bHRzOiBUW10gPSBhd2FpdCB0aGlzLmZldGNoTGlzdChzZWxlY3Rvciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHJlc3VsdHNbMF07XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZmluZEJ5SWQ8VCBleHRlbmRzIE1vZGVsPihfaWQ6IHN0cmluZywgZmV0Y2hPcHRpb25zPzogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIGNvbnN0IENsYXp6ID0gdGhpcztcbiAgICBjb25zdCBtb2RlbDogTW9kZWwgPSBuZXcgQ2xhenooeyBfaWQgfSk7XG4gICAgcmV0dXJuIG1vZGVsLmZldGNoKGZldGNoT3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRmV0Y2ggYWxsIG1vZGVscyB0aGF0IGFyZSBvd25lZCBieSB0aGUgY3VycmVudCB1c2VyLlxuICAgKiBUaGlzIG9ubHkgaW5jbHVkZXMgJ3BlcnNvbmFsbHknIG93bmVkIG1vZGVscywgYW5kIG5vdCB0aG9zZSBjcmVhdGVkXG4gICAqIGFzIHBhcnQgb2YgYSBVc2VyR3JvdXBcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IF9zZWxlY3RvciAtIEEgcXVlcnkgdG8gaW5jbHVkZSB3aGVuIGZldGNoaW5nIG1vZGVsc1xuICAgKi9cbiAgc3RhdGljIGZldGNoT3duTGlzdChfc2VsZWN0b3I6IEZpbmRRdWVyeSA9IHt9KSB7XG4gICAgY29uc3QgeyBfaWQgfSA9IHVzZXJHcm91cEtleXMoKS5wZXJzb25hbDtcbiAgICBjb25zdCBzZWxlY3RvciA9IHtcbiAgICAgIC4uLl9zZWxlY3RvcixcbiAgICAgIHNpZ25pbmdLZXlJZDogX2lkLFxuICAgIH07XG4gICAgcmV0dXJuIHRoaXMuZmV0Y2hMaXN0KHNlbGVjdG9yKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGF0dHJzOiBBdHRycyA9IHt9KSB7XG4gICAgY29uc3QgeyBzY2hlbWEsIGRlZmF1bHRzIH0gPSB0aGlzLmNvbnN0cnVjdG9yIGFzIHR5cGVvZiBNb2RlbDtcbiAgICBjb25zdCBuYW1lID0gdGhpcy5tb2RlbE5hbWUoKTtcbiAgICB0aGlzLnNjaGVtYSA9IHNjaGVtYTtcbiAgICB0aGlzLl9pZCA9IGF0dHJzLl9pZCB8fCB1dWlkKCkucmVwbGFjZSgnLScsICcnKTtcbiAgICB0aGlzLmF0dHJzID0ge1xuICAgICAgLi4uZGVmYXVsdHMsXG4gICAgICAuLi5hdHRycyxcbiAgICAgIHJhZGlrc1R5cGU6IG5hbWUsXG4gICAgfTtcbiAgfVxuXG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmVmb3JlU2F2ZSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmJlZm9yZVNhdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRycy5jcmVhdGVkQXQgPSB0aGlzLmF0dHJzLmNyZWF0ZWRBdCB8fCBub3c7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRycy51cGRhdGVkQXQgPSBub3c7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zaWduKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5jcnlwdGVkID0gYXdhaXQgdGhpcy5lbmNyeXB0ZWQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBnYWlhVVJMID0gYXdhaXQgdGhpcy5zYXZlRmlsZShlbmNyeXB0ZWQpO1xuICAgICAgICAgICAgICAgIGF3YWl0IHNlbmROZXdHYWlhVXJsKGdhaWFVUkwpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIHNhdmVMTigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmVmb3JlU2F2ZSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmJlZm9yZVNhdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRycy5jcmVhdGVkQXQgPSB0aGlzLmF0dHJzLmNyZWF0ZWRBdCB8fCBub3c7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRycy51cGRhdGVkQXQgPSBub3c7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zaWduKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5jcnlwdGVkID0gYXdhaXQgdGhpcy5lbmNyeXB0ZWQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBnYWlhVVJMID0gYXdhaXQgdGhpcy5zYXZlRmlsZShlbmNyeXB0ZWQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VuZE5ld0dhaWFVcmxMTihnYWlhVVJMKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1vZGVsIHNhdmVkOiBcIiArIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gIGFzeW5jIGNoZWNrUGF5UmVxUGFpZChpZCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBpbnZvaWNlID0gYXdhaXQgY2hlY2tQYXlSZXEoaWQpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkludm9pY2UgaW5mbzogXCIgKyBpbnZvaWNlKTtcbiAgICAgICAgcmVzb2x2ZShpbnZvaWNlKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZW5jcnlwdGVkKCkge1xuICAgIHJldHVybiBlbmNyeXB0T2JqZWN0KHRoaXMpO1xuICB9XG5cbiAgc2F2ZUZpbGUoZW5jcnlwdGVkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gICAgY29uc3QgdXNlclNlc3Npb24gPSByZXF1aXJlVXNlclNlc3Npb24oKTtcbiAgICByZXR1cm4gdXNlclNlc3Npb24ucHV0RmlsZSh0aGlzLmJsb2Nrc3RhY2tQYXRoKCksIEpTT04uc3RyaW5naWZ5KGVuY3J5cHRlZCksIHtcbiAgICAgIGVuY3J5cHQ6IGZhbHNlLFxuICAgIH0pO1xuICB9XG5cbiAgYmxvY2tzdGFja1BhdGgoKSB7XG4gICAgY29uc3QgcGF0aCA9IGAke3RoaXMubW9kZWxOYW1lKCl9LyR7dGhpcy5faWR9YDtcbiAgICByZXR1cm4gcGF0aDtcbiAgfVxuXG4gIGFzeW5jIGZldGNoKHsgZGVjcnlwdCA9IHRydWUgfSA9IHt9KSB7XG4gICAgY29uc3QgcXVlcnkgPSB7XG4gICAgICBfaWQ6IHRoaXMuX2lkLFxuICAgIH07XG4gICAgY29uc3QgeyByZXN1bHRzIH0gPSBhd2FpdCBmaW5kKHF1ZXJ5KTtcbiAgICBjb25zdCBbYXR0cnNdID0gcmVzdWx0cztcbiAgICB0aGlzLmF0dHJzID0ge1xuICAgICAgLi4udGhpcy5hdHRycyxcbiAgICAgIC4uLmF0dHJzLFxuICAgIH07XG4gICAgaWYgKGRlY3J5cHQpIHtcbiAgICAgIGF3YWl0IHRoaXMuZGVjcnlwdCgpO1xuICAgIH1cbiAgICBhd2FpdCB0aGlzLmFmdGVyRmV0Y2goKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFzeW5jIGRlY3J5cHQoKSB7XG4gICAgdGhpcy5hdHRycyA9IGF3YWl0IGRlY3J5cHRPYmplY3QodGhpcy5hdHRycywgdGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1cGRhdGUoYXR0cnM6IEF0dHJzKSB7XG4gICAgdGhpcy5hdHRycyA9IHtcbiAgICAgIC4uLnRoaXMuYXR0cnMsXG4gICAgICAuLi5hdHRycyxcbiAgICB9O1xuICB9XG5cbiAgYXN5bmMgc2lnbigpIHtcbiAgICBpZiAodGhpcy5hdHRycy51cGRhdGFibGUgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgY29uc3Qgc2lnbmluZ0tleSA9IHRoaXMuZ2V0U2lnbmluZ0tleSgpO1xuICAgIHRoaXMuYXR0cnMuc2lnbmluZ0tleUlkID0gdGhpcy5hdHRycy5zaWduaW5nS2V5SWQgfHwgc2lnbmluZ0tleS5faWQ7XG4gICAgY29uc3QgeyBwcml2YXRlS2V5IH0gPSBzaWduaW5nS2V5O1xuICAgIGNvbnN0IGNvbnRlbnRUb1NpZ246IChzdHJpbmcgfCBudW1iZXIpW10gPSBbdGhpcy5faWRdO1xuICAgIGlmICh0aGlzLmF0dHJzLnVwZGF0ZWRBdCkge1xuICAgICAgY29udGVudFRvU2lnbi5wdXNoKHRoaXMuYXR0cnMudXBkYXRlZEF0KTtcbiAgICB9XG4gICAgY29uc3QgeyBzaWduYXR1cmUgfSA9IHNpZ25FQ0RTQShwcml2YXRlS2V5LCBjb250ZW50VG9TaWduLmpvaW4oJy0nKSk7XG4gICAgdGhpcy5hdHRycy5yYWRpa3NTaWduYXR1cmUgPSBzaWduYXR1cmU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBnZXRTaWduaW5nS2V5KCkge1xuICAgIGlmICh0aGlzLmF0dHJzLnVzZXJHcm91cElkKSB7XG4gICAgICBjb25zdCB7IHVzZXJHcm91cHMsIHNpZ25pbmdLZXlzIH0gPSB1c2VyR3JvdXBLZXlzKCk7XG5cbiAgICAgIGNvbnN0IF9pZCA9IHVzZXJHcm91cHNbdGhpcy5hdHRycy51c2VyR3JvdXBJZF07XG4gICAgICBjb25zdCBwcml2YXRlS2V5ID0gc2lnbmluZ0tleXNbX2lkXTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZCxcbiAgICAgICAgcHJpdmF0ZUtleSxcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB1c2VyR3JvdXBLZXlzKCkucGVyc29uYWw7XG4gIH1cblxuICBhc3luYyBlbmNyeXB0aW9uUHVibGljS2V5KCkge1xuICAgIHJldHVybiBnZXRQdWJsaWNLZXlGcm9tUHJpdmF0ZSh0aGlzLmVuY3J5cHRpb25Qcml2YXRlS2V5KCkpO1xuICB9XG5cbiAgZW5jcnlwdGlvblByaXZhdGVLZXkoKSB7XG4gICAgbGV0IHByaXZhdGVLZXk6IHN0cmluZztcbiAgICBpZiAodGhpcy5hdHRycy51c2VyR3JvdXBJZCkge1xuICAgICAgY29uc3QgeyB1c2VyR3JvdXBzLCBzaWduaW5nS2V5cyB9ID0gdXNlckdyb3VwS2V5cygpO1xuICAgICAgcHJpdmF0ZUtleSA9IHNpZ25pbmdLZXlzW3VzZXJHcm91cHNbdGhpcy5hdHRycy51c2VyR3JvdXBJZF1dO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcml2YXRlS2V5ID0gcmVxdWlyZVVzZXJTZXNzaW9uKCkubG9hZFVzZXJEYXRhKCkuYXBwUHJpdmF0ZUtleTtcbiAgICB9XG4gICAgcmV0dXJuIHByaXZhdGVLZXk7XG4gIH1cblxuICBzdGF0aWMgbW9kZWxOYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuY2xhc3NOYW1lIHx8IHRoaXMubmFtZTtcbiAgfVxuXG4gIG1vZGVsTmFtZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IHsgbW9kZWxOYW1lIH0gPSB0aGlzLmNvbnN0cnVjdG9yIGFzIHR5cGVvZiBNb2RlbDtcbiAgICByZXR1cm4gbW9kZWxOYW1lLmFwcGx5KHRoaXMuY29uc3RydWN0b3IpO1xuICB9XG5cbiAgaXNPd25lZEJ5VXNlcigpIHtcbiAgICBjb25zdCBrZXlzID0gdXNlckdyb3VwS2V5cygpO1xuICAgIGlmICh0aGlzLmF0dHJzLnNpZ25pbmdLZXlJZCA9PT0ga2V5cy5wZXJzb25hbC5faWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gaWYgKHRoaXMuYXR0cnMudXNlckdyb3VwSWQpIHtcbiAgICAgIGxldCBpc093bmVkID0gZmFsc2U7XG4gICAgICBPYmplY3Qua2V5cyhrZXlzLnVzZXJHcm91cHMpLmZvckVhY2goKGdyb3VwSWQpID0+IHtcbiAgICAgICAgaWYgKGdyb3VwSWQgPT09IHRoaXMuYXR0cnMudXNlckdyb3VwSWQpIHtcbiAgICAgICAgICBpc093bmVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gaXNPd25lZDtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cblxuICBzdGF0aWMgb25TdHJlYW1FdmVudCA9IChfdGhpcywgW2V2ZW50XSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IGRhdGEgfSA9IGV2ZW50O1xuICAgICAgY29uc3QgYXR0cnMgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgaWYgKGF0dHJzICYmIGF0dHJzLnJhZGlrc1R5cGUgPT09IF90aGlzLm1vZGVsTmFtZSgpKSB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gbmV3IF90aGlzKGF0dHJzKTtcbiAgICAgICAgaWYgKG1vZGVsLmlzT3duZWRCeVVzZXIoKSkge1xuICAgICAgICAgIG1vZGVsLmRlY3J5cHQoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIF90aGlzLmVtaXR0ZXIuZW1pdChFVkVOVF9OQU1FLCBtb2RlbCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3RoaXMuZW1pdHRlci5lbWl0KEVWRU5UX05BTUUsIG1vZGVsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBhZGRTdHJlYW1MaXN0ZW5lcihjYWxsYmFjazogKCkgPT4gdm9pZCkge1xuICAgIGlmICghdGhpcy5lbWl0dGVyKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmVtaXR0ZXIuZ2V0TGlzdGVuZXJzKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICBTdHJlYW1lci5hZGRMaXN0ZW5lcigoYXJnczogYW55KSA9PiB7XG4gICAgICAgIHRoaXMub25TdHJlYW1FdmVudCh0aGlzLCBhcmdzKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLmVtaXR0ZXIuYWRkTGlzdGVuZXIoRVZFTlRfTkFNRSwgY2FsbGJhY2spO1xuICB9XG5cbiAgc3RhdGljIHJlbW92ZVN0cmVhbUxpc3RlbmVyKGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5lbWl0dGVyLnJlbW92ZUxpc3RlbmVyKEVWRU5UX05BTUUsIGNhbGxiYWNrKTtcbiAgICBpZiAodGhpcy5lbWl0dGVyLmdldExpc3RlbmVycygpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgU3RyZWFtZXIucmVtb3ZlTGlzdGVuZXIodGhpcy5vblN0cmVhbUV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvLyBMTiBzcGVjaWZpY1xuICAgIHN0YXRpYyBvbkludm9pY2VTdHJlYW1FdmVudCA9IChfdGhpcywgW2V2ZW50XSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdldmVudDogJyArIGV2ZW50KTtcbiAgICAgICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gZXZlbnQ7XG4gICAgICAgICAgICBjb25zdCBpbnZvaWNlID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgIGlmIChpbnZvaWNlKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuZW1pdHRlci5lbWl0KElOVk9JQ0VfTkFNRSwgaW52b2ljZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGFkZEludm9pY2VTdHJlYW1MaXN0ZW5lcihpZCwgY2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVtaXR0ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5lbWl0dGVyLmdldExpc3RlbmVycygpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgU3RyZWFtZXIuYWRkSW52b2ljZUxpc3RlbmVyKGlkLCAoYXJnczogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkludm9pY2VTdHJlYW1FdmVudCh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdHRlci5hZGRMaXN0ZW5lcihJTlZPSUNFX05BTUUsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVtb3ZlSW52b2ljZVN0cmVhbUxpc3RlbmVyKGlkLCBjYWxsYmFjazogKCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLmVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIoSU5WT0lDRV9OQU1FLCBjYWxsYmFjayk7XG4gICAgICAgIGlmICh0aGlzLmVtaXR0ZXIuZ2V0TGlzdGVuZXJzKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBTdHJlYW1lci5yZW1vdmVJbnZvaWNlTGlzdGVuZXIoaWQsIHRoaXMub25TdHJlYW1FdmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgYXN5bmMgZGVzdHJveSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBhd2FpdCB0aGlzLnNpZ24oKTtcbiAgICByZXR1cm4gZGVzdHJveU1vZGVsKHRoaXMpO1xuICB9XG5cbiAgLy8gQGFic3RyYWN0XG4gIGJlZm9yZVNhdmUoKSB7IH1cblxuICAvLyBAYWJzdHJhY3RcbiAgYWZ0ZXJGZXRjaCgpIHsgfVxufVxuIl19