"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keys = require("blockstack/lib/keys");

var _encryption = require("blockstack/lib/encryption");

var _model = _interopRequireDefault(require("../model"));

var _signingKey = _interopRequireDefault(require("./signing-key"));

var _groupMembership = _interopRequireDefault(require("./group-membership"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const decrypted = true;

let BlockstackUser =
/*#__PURE__*/
function (_Model) {
  _inherits(BlockstackUser, _Model);

  function BlockstackUser() {
    _classCallCheck(this, BlockstackUser);

    return _possibleConstructorReturn(this, _getPrototypeOf(BlockstackUser).apply(this, arguments));
  }

  _createClass(BlockstackUser, [{
    key: "createSigningKey",
    value: async function createSigningKey() {
      const key = await _signingKey.default.create();
      this.attrs.personalSigningKeyId = key._id;
      return key;
    }
  }, {
    key: "sign",
    value: async function sign() {
      this.attrs.signingKeyId = 'personal';
      const {
        appPrivateKey
      } = (0, _helpers.loadUserData)();
      const contentToSign = [this._id];

      if (this.attrs.updatedAt) {
        contentToSign.push(this.attrs.updatedAt);
      }

      const {
        signature
      } = (0, _encryption.signECDSA)(appPrivateKey, contentToSign.join('-'));
      this.attrs.radiksSignature = signature;
      return this;
    }
  }], [{
    key: "currentUser",
    value: function currentUser() {
      if (typeof window === 'undefined') {
        return null;
      }

      const userData = (0, _helpers.loadUserData)();

      if (!userData) {
        return null;
      }

      const {
        username,
        profile,
        appPrivateKey
      } = userData;
      const publicKey = (0, _keys.getPublicKeyFromPrivate)(appPrivateKey);
      const Clazz = this;
      const user = new Clazz({
        _id: username,
        username,
        publicKey,
        profile
      });
      return user;
    }
  }, {
    key: "createWithCurrentUser",
    value: function createWithCurrentUser() {
      return new Promise((resolve, reject) => {
        const resolveUser = (user, _resolve) => {
          user.save().then(() => {
            _groupMembership.default.cacheKeys().then(() => {
              _resolve(user);
            });
          });
        };

        try {
          const user = this.currentUser();
          user.fetch().catch(() => {// console.error('caught error', e);
          }).finally(() => {
            // console.log(user.attrs);
            const userData = (0, _helpers.loadUserData)();
            const {
              username,
              profile,
              appPrivateKey
            } = userData;
            const publicKey = (0, _keys.getPublicKeyFromPrivate)(appPrivateKey);
            user.update({
              username,
              profile,
              publicKey
            });

            if (!user.attrs.personalSigningKeyId) {
              user.createSigningKey().then(key => {
                (0, _helpers.addPersonalSigningKey)(key);
                resolveUser(user, resolve);
              });
            } else {
              _signingKey.default.findById(user.attrs.personalSigningKeyId).then(key => {
                (0, _helpers.addPersonalSigningKey)(key);
                resolveUser(user, resolve);
              });
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    }
  }]);

  return BlockstackUser;
}(_model.default);

exports.default = BlockstackUser;

_defineProperty(BlockstackUser, "className", 'BlockstackUser');

_defineProperty(BlockstackUser, "schema", {
  username: {
    type: String,
    decrypted
  },
  publicKey: {
    type: String,
    decrypted
  },
  profile: {
    type: String,
    decrypted
  },
  personalSigningKeyId: String
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvdXNlci50cyJdLCJuYW1lcyI6WyJkZWNyeXB0ZWQiLCJCbG9ja3N0YWNrVXNlciIsImtleSIsIlNpZ25pbmdLZXkiLCJjcmVhdGUiLCJhdHRycyIsInBlcnNvbmFsU2lnbmluZ0tleUlkIiwiX2lkIiwic2lnbmluZ0tleUlkIiwiYXBwUHJpdmF0ZUtleSIsImNvbnRlbnRUb1NpZ24iLCJ1cGRhdGVkQXQiLCJwdXNoIiwic2lnbmF0dXJlIiwiam9pbiIsInJhZGlrc1NpZ25hdHVyZSIsIndpbmRvdyIsInVzZXJEYXRhIiwidXNlcm5hbWUiLCJwcm9maWxlIiwicHVibGljS2V5IiwiQ2xhenoiLCJ1c2VyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXNvbHZlVXNlciIsIl9yZXNvbHZlIiwic2F2ZSIsInRoZW4iLCJHcm91cE1lbWJlcnNoaXAiLCJjYWNoZUtleXMiLCJjdXJyZW50VXNlciIsImZldGNoIiwiY2F0Y2giLCJmaW5hbGx5IiwidXBkYXRlIiwiY3JlYXRlU2lnbmluZ0tleSIsImZpbmRCeUlkIiwiZXJyb3IiLCJNb2RlbCIsInR5cGUiLCJTdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLE1BQU1BLFNBQVMsR0FBRyxJQUFsQjs7SUFFcUJDLGM7Ozs7Ozs7Ozs7Ozs7NkNBMENNO0FBQ3ZCLFlBQU1DLEdBQUcsR0FBRyxNQUFNQyxvQkFBV0MsTUFBWCxFQUFsQjtBQUNBLFdBQUtDLEtBQUwsQ0FBV0Msb0JBQVgsR0FBa0NKLEdBQUcsQ0FBQ0ssR0FBdEM7QUFDQSxhQUFPTCxHQUFQO0FBQ0Q7OztpQ0E0Q1k7QUFDWCxXQUFLRyxLQUFMLENBQVdHLFlBQVgsR0FBMEIsVUFBMUI7QUFDQSxZQUFNO0FBQUVDLFFBQUFBO0FBQUYsVUFBb0IsNEJBQTFCO0FBQ0EsWUFBTUMsYUFBa0MsR0FBRyxDQUFD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Q2RkLFVBQUFBLE1BQU0sQ0FBQ2MsS0FBRCxDQUFOO0FBQ0Q7QUFDRixPQXRDTSxDQUFQO0FBdUNEOzs7O0VBeEZ5Q0MsYzs7OztnQkFBdkJ2QyxjLGVBQ0EsZ0I7O2dCQURBQSxjLFlBR0s7QUFDdEJpQixFQUFBQSxRQUFRLEVBQUU7QUFDUnVCLElBQUFBLElBQUksRUFBRUMsTUFERTtBQUVSMUMsSUFBQUE7QUFGUSxHQURZO0FBS3RCb0IsRUFBQUEsU0FBUyxFQUFFO0FBQ1RxQixJQUFBQSxJQUFJLEVBQUVDLE1BREc7QUFFVDFDLElBQUFBO0FBRlMsR0FMVztBQVN0Qm1CLEVBQUFBLE9BQU8sRUFBRTtBQUNQc0IsSUFBQUEsSUFBSSxFQUFFQyxNQURDO0FBRVAxQyxJQUFBQTtBQUZPLEdBVGE7QUFhdEJNLEVBQUFBLG9CQUFvQixFQUFFb0M7QUFiQSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0UHVibGljS2V5RnJvbVByaXZhdGUgfSBmcm9tICdibG9ja3N0YWNrL2xpYi9rZXlzJztcbmltcG9ydCB7IHNpZ25FQ0RTQSB9IGZyb20gJ2Jsb2Nrc3RhY2svbGliL2VuY3J5cHRpb24nO1xuXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IFNpZ25pbmdLZXkgZnJvbSAnLi9zaWduaW5nLWtleSc7XG5pbXBvcnQgR3JvdXBNZW1iZXJzaGlwIGZyb20gJy4vZ3JvdXAtbWVtYmVyc2hpcCc7XG5pbXBvcnQgeyBhZGRQZXJzb25hbFNpZ25pbmdLZXksIGxvYWRVc2VyRGF0YSB9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSAnLi4vdHlwZXMvaW5kZXgnO1xuXG5jb25zdCBkZWNyeXB0ZWQgPSB0cnVlO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCbG9ja3N0YWNrVXNlciBleHRlbmRzIE1vZGVsIHtcbiAgc3RhdGljIGNsYXNzTmFtZSA9ICdCbG9ja3N0YWNrVXNlcic7XG5cbiAgc3RhdGljIHNjaGVtYTogU2NoZW1hID0ge1xuICAgIHVzZXJuYW1lOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWNyeXB0ZWQsXG4gICAgfSxcbiAgICBwdWJsaWNLZXk6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlY3J5cHRlZCxcbiAgICB9LFxuICAgIHByb2ZpbGU6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlY3J5cHRlZCxcbiAgICB9LFxuICAgIHBlcnNvbmFsU2lnbmluZ0tleUlkOiBTdHJpbmcsXG4gIH1cblxuICBzdGF0aWMgY3VycmVudFVzZXIoKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB1c2VyRGF0YSA9IGxvYWRVc2VyRGF0YSgpO1xuICAgIGlmICghdXNlckRhdGEpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHsgdXNlcm5hbWUsIHByb2ZpbGUsIGFwcFByaXZhdGVLZXkgfSA9IHVzZXJEYXRhO1xuICAgIGNvbnN0IHB1YmxpY0tleSA9IGdldFB1YmxpY0tleUZyb21Qcml2YXRlKGFwcFByaXZhdGVLZXkpO1xuICAgIGNvbnN0IENsYXp6ID0gdGhpcztcbiAgICBjb25zdCB1c2VyID0gbmV3IENsYXp6KHtcbiAgICAgIF9pZDogdXNlcm5hbWUsXG4gICAgICB1c2VybmFtZSxcbiAgICAgIHB1YmxpY0tleSxcbiAgICAgIHByb2ZpbGUsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdXNlcjtcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZVNpZ25pbmdLZXkoKSB7XG4gICAgY29uc3Qga2V5ID0gYXdhaXQgU2lnbmluZ0tleS5jcmVhdGUoKTtcbiAgICB0aGlzLmF0dHJzLnBlcnNvbmFsU2lnbmluZ0tleUlkID0ga2V5Ll9pZDtcbiAgICByZXR1cm4ga2V5O1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZVdpdGhDdXJyZW50VXNlcigpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgcmVzb2x2ZVVzZXIgPSAodXNlcjogQmxvY2tzdGFja1VzZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVzb2x2ZTogKHZhbHVlPzoge30gfCBQcm9taXNlTGlrZTx7fT4pID0+IHZvaWQpID0+IHtcbiAgICAgICAgdXNlci5zYXZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgR3JvdXBNZW1iZXJzaGlwLmNhY2hlS2V5cygpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgX3Jlc29sdmUodXNlcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHVzZXIgPSB0aGlzLmN1cnJlbnRVc2VyKCk7XG4gICAgICAgIHVzZXIuZmV0Y2goKS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgLy8gY29uc29sZS5lcnJvcignY2F1Z2h0IGVycm9yJywgZSk7XG4gICAgICAgIH0pLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHVzZXIuYXR0cnMpO1xuICAgICAgICAgIGNvbnN0IHVzZXJEYXRhID0gbG9hZFVzZXJEYXRhKCk7XG4gICAgICAgICAgY29uc3QgeyB1c2VybmFtZSwgcHJvZmlsZSwgYXBwUHJpdmF0ZUtleSB9ID0gdXNlckRhdGE7XG4gICAgICAgICAgY29uc3QgcHVibGljS2V5ID0gZ2V0UHVibGljS2V5RnJvbVByaXZhdGUoYXBwUHJpdmF0ZUtleSk7XG4gICAgICAgICAgdXNlci51cGRhdGUoe1xuICAgICAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgICAgICBwcm9maWxlLFxuICAgICAgICAgICAgcHVibGljS2V5LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICghdXNlci5hdHRycy5wZXJzb25hbFNpZ25pbmdLZXlJZCkge1xuICAgICAgICAgICAgdXNlci5jcmVhdGVTaWduaW5nS2V5KCkudGhlbigoa2V5KSA9PiB7XG4gICAgICAgICAgICAgIGFkZFBlcnNvbmFsU2lnbmluZ0tleShrZXkpO1xuICAgICAgICAgICAgICByZXNvbHZlVXNlcih1c2VyLCByZXNvbHZlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBTaWduaW5nS2V5LmZpbmRCeUlkKHVzZXIuYXR0cnMucGVyc29uYWxTaWduaW5nS2V5SWQpLnRoZW4oKGtleTogU2lnbmluZ0tleSkgPT4ge1xuICAgICAgICAgICAgICBhZGRQZXJzb25hbFNpZ25pbmdLZXkoa2V5KTtcbiAgICAgICAgICAgICAgcmVzb2x2ZVVzZXIodXNlciwgcmVzb2x2ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHNpZ24oKSB7XG4gICAgdGhpcy5hdHRycy5zaWduaW5nS2V5SWQgPSAncGVyc29uYWwnO1xuICAgIGNvbnN0IHsgYXBwUHJpdmF0ZUtleSB9ID0gbG9hZFVzZXJEYXRhKCk7XG4gICAgY29uc3QgY29udGVudFRvU2lnbjogKHN0cmluZyB8IG51bWJlcilbXSA9IFt0aGlzLl9pZF07XG4gICAgaWYgKHRoaXMuYXR0cnMudXBkYXRlZEF0KSB7XG4gICAgICBjb250ZW50VG9TaWduLnB1c2godGhpcy5hdHRycy51cGRhdGVkQXQpO1xuICAgIH1cbiAgICBjb25zdCB7IHNpZ25hdHVyZSB9ID0gc2lnbkVDRFNBKGFwcFByaXZhdGVLZXksIGNvbnRlbnRUb1NpZ24uam9pbignLScpKTtcbiAgICB0aGlzLmF0dHJzLnJhZGlrc1NpZ25hdHVyZSA9IHNpZ25hdHVyZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuIl19