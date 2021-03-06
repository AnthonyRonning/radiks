"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _model = _interopRequireDefault(require("../model"));

var _user = _interopRequireDefault(require("./user"));

var _userGroup = _interopRequireDefault(require("./user-group"));

var _helpers = require("../helpers");

var _signingKey = _interopRequireDefault(require("./signing-key"));

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

let GroupMembership =
/*#__PURE__*/
function (_Model) {
  _inherits(GroupMembership, _Model);

  function GroupMembership() {
    _classCallCheck(this, GroupMembership);

    return _possibleConstructorReturn(this, _getPrototypeOf(GroupMembership).apply(this, arguments));
  }

  _createClass(GroupMembership, [{
    key: "encryptionPublicKey",
    value: async function encryptionPublicKey() {
      const user = await _user.default.findById(this.attrs.username, {
        decrypt: false
      });
      const {
        publicKey
      } = user.attrs;
      return publicKey;
    }
  }, {
    key: "encryptionPrivateKey",
    value: function encryptionPrivateKey() {
      return (0, _helpers.loadUserData)().appPrivateKey;
    }
  }, {
    key: "getSigningKey",
    value: function getSigningKey() {
      const {
        signingKeyId,
        signingKeyPrivateKey
      } = this.attrs;
      return {
        _id: signingKeyId,
        privateKey: signingKeyPrivateKey
      };
    }
  }, {
    key: "fetchUserGroupSigningKey",
    value: async function fetchUserGroupSigningKey() {
      const _id = this.attrs.userGroupId;
      const userGroup = await _userGroup.default.findById(_id);
      const {
        signingKeyId
      } = userGroup.attrs;
      return {
        _id,
        signingKeyId
      };
    }
  }], [{
    key: "fetchUserGroups",
    value: async function fetchUserGroups() {
      const {
        username
      } = (0, _helpers.loadUserData)();
      const memberships = await GroupMembership.fetchList({
        username
      });
      const signingKeys = {};
      memberships.forEach(({
        attrs
      }) => {
        signingKeys[attrs.signingKeyId] = attrs.signingKeyPrivateKey;
      });
      const fetchAll = memberships.map(membership => membership.fetchUserGroupSigningKey());
      const userGroupList = await Promise.all(fetchAll);
      const userGroups = {};
      userGroupList.forEach(userGroup => {
        userGroups[userGroup._id] = userGroup.signingKeyId;
      });
      return {
        userGroups,
        signingKeys
      };
    }
  }, {
    key: "cacheKeys",
    value: async function cacheKeys() {
      const {
        userGroups,
        signingKeys
      } = await this.fetchUserGroups();
      const groupKeys = (0, _helpers.userGroupKeys)();
      const self = await _user.default.findById((0, _helpers.loadUserData)().username);
      const key = await _signingKey.default.findById(self.attrs.personalSigningKeyId);
      groupKeys.personal = key.attrs;
      groupKeys.signingKeys = signingKeys;
      groupKeys.userGroups = userGroups;
      localStorage.setItem(_helpers.GROUP_MEMBERSHIPS_STORAGE_KEY, JSON.stringify(groupKeys));
    }
  }, {
    key: "clearStorage",
    value: async function clearStorage() {
      (0, _helpers.clearStorage)();
    }
  }, {
    key: "userGroupKeys",
    value: function userGroupKeys() {
      return (0, _helpers.userGroupKeys)();
    }
  }]);

  return GroupMembership;
}(_model.default);

exports.default = GroupMembership;

_defineProperty(GroupMembership, "className", 'GroupMembership');

_defineProperty(GroupMembership, "schema", {
  userGroupId: String,
  username: {
    type: String,
    decrypted: true
  },
  signingKeyPrivateKey: String,
  signingKeyId: String
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvZ3JvdXAtbWVtYmVyc2hpcC50cyJdLCJuYW1lcyI6WyJHcm91cE1lbWJlcnNoaXAiLCJ1c2VyIiwiVXNlciIsImZpbmRCeUlkIiwiYXR0cnMiLCJ1c2VybmFtZSIsImRlY3J5cHQiLCJwdWJsaWNLZXkiLCJhcHBQcml2YXRlS2V5Iiwic2lnbmluZ0tleUlkIiwic2lnbmluZ0tleVByaXZhdGVLZXkiLCJfaWQiLCJwcml2YXRlS2V5IiwidXNlckdyb3VwSWQiLCJ1c2VyR3JvdXAiLCJVc2VyR3JvdXAiLCJtZW1iZXJzaGlwcyIsImZldGNoTGlzdCIsInNpZ25pbmdLZXlzIiwiZm9yRWFjaCIsImZldGNoQWxsIiwibWFwIiwibWVtYmVyc2hpcCIsImZldGNoVXNlckdyb3VwU2lnbmluZ0tleSIsInVzZXJHcm91cExpc3QiLCJQcm9taXNlIiwiYWxsIiwidXNlckdyb3VwcyIsImZldGNoVXNlckdyb3VwcyIsImdyb3VwS2V5cyIsInNlbGYiLCJrZXkiLCJTaWduaW5nS2V5IiwicGVyc29uYWxTaWduaW5nS2V5SWQiLCJwZXJzb25hbCIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJHUk9VUF9NRU1CRVJTSElQU19TVE9SQUdFX0tFWSIsIkpTT04iLCJzdHJpbmdpZnkiLCJNb2RlbCIsIlN0cmluZyIsInR5cGUiLCJkZWNyeXB0ZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQVlxQkEsZTs7Ozs7Ozs7Ozs7OztnREFpRFM7QUFDMUIsWUFBTUMsSUFBSSxHQUFHLE1BQU1DLGNBQUtDLFFBQUwsQ0FBYyxLQUFLQyxLQUFMLENBQVdDLFFBQXpCLEVBQW1DO0FBQUVDLFFBQUFBLE9BQU8sRUFBRTtBQUFYLE9BQW5DLENBQW5CO0FBQ0EsWUFBTTtBQUFFQyxRQUFBQTtBQUFGLFVBQWdCTixJQUFJLENBQUNHLEtBQTNCO0FBQ0EsYUFBT0csU0FBUDtB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QUFBLFlBQVksRUFBRWdDO0FBUEEsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNb2RlbCBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQgVXNlciBmcm9tICcuL3VzZXInO1xuaW1wb3J0IFVzZXJHcm91cCBmcm9tICcuL3VzZXItZ3JvdXAnO1xuaW1wb3J0IHtcbiAgY2xlYXJTdG9yYWdlLCB1c2VyR3JvdXBLZXlzLCBHUk9VUF9NRU1CRVJTSElQU19TVE9SQUdFX0tFWSwgbG9hZFVzZXJEYXRhLFxufSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCBTaWduaW5nS2V5IGZyb20gJy4vc2lnbmluZy1rZXknO1xuaW1wb3J0IHsgQXR0cnMgfSBmcm9tICcuLi90eXBlcy9pbmRleCc7XG5cbmludGVyZmFjZSBVc2VyR3JvdXBLZXlzIHtcbiAgdXNlckdyb3Vwczoge1xuICAgIFt1c2VyR3JvdXBJZDogc3RyaW5nXTogc3RyaW5nLFxuICB9LFxuICBzaWduaW5nS2V5czoge1xuICAgIFtzaWduaW5nS2V5SWQ6IHN0cmluZ106IHN0cmluZ1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyb3VwTWVtYmVyc2hpcCBleHRlbmRzIE1vZGVsIHtcbiAgc3RhdGljIGNsYXNzTmFtZSA9ICdHcm91cE1lbWJlcnNoaXAnO1xuICBzdGF0aWMgc2NoZW1hID0ge1xuICAgIHVzZXJHcm91cElkOiBTdHJpbmcsXG4gICAgdXNlcm5hbWU6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlY3J5cHRlZDogdHJ1ZSxcbiAgICB9LFxuICAgIHNpZ25pbmdLZXlQcml2YXRlS2V5OiBTdHJpbmcsXG4gICAgc2lnbmluZ0tleUlkOiBTdHJpbmcsXG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZmV0Y2hVc2VyR3JvdXBzKCk6IFByb21pc2U8VXNlckdyb3VwS2V5cz4ge1xuICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGxvYWRVc2VyRGF0YSgpO1xuICAgIGNvbnN0IG1lbWJlcnNoaXBzOiBHcm91cE1lbWJlcnNoaXBbXSA9IGF3YWl0IEdyb3VwTWVtYmVyc2hpcC5mZXRjaExpc3Qoe1xuICAgICAgdXNlcm5hbWUsXG4gICAgfSk7XG4gICAgY29uc3Qgc2lnbmluZ0tleXM6IFVzZXJHcm91cEtleXNbJ3NpZ25pbmdLZXlzJ10gPSB7fTtcbiAgICBtZW1iZXJzaGlwcy5mb3JFYWNoKCh7IGF0dHJzIH0pID0+IHtcbiAgICAgIHNpZ25pbmdLZXlzW2F0dHJzLnNpZ25pbmdLZXlJZF0gPSBhdHRycy5zaWduaW5nS2V5UHJpdmF0ZUtleTtcbiAgICB9KTtcbiAgICBjb25zdCBmZXRjaEFsbCA9IG1lbWJlcnNoaXBzLm1hcChtZW1iZXJzaGlwID0+IG1lbWJlcnNoaXAuZmV0Y2hVc2VyR3JvdXBTaWduaW5nS2V5KCkpO1xuICAgIGNvbnN0IHVzZXJHcm91cExpc3QgPSBhd2FpdCBQcm9taXNlLmFsbChmZXRjaEFsbCk7XG4gICAgY29uc3QgdXNlckdyb3VwczogVXNlckdyb3VwS2V5c1sndXNlckdyb3VwcyddID0ge307XG4gICAgdXNlckdyb3VwTGlzdC5mb3JFYWNoKCh1c2VyR3JvdXApID0+IHtcbiAgICAgIHVzZXJHcm91cHNbdXNlckdyb3VwLl9pZF0gPSB1c2VyR3JvdXAuc2lnbmluZ0tleUlkO1xuICAgIH0pO1xuICAgIHJldHVybiB7IHVzZXJHcm91cHMsIHNpZ25pbmdLZXlzIH07XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgY2FjaGVLZXlzKCkge1xuICAgIGNvbnN0IHsgdXNlckdyb3Vwcywgc2lnbmluZ0tleXMgfSA9IGF3YWl0IHRoaXMuZmV0Y2hVc2VyR3JvdXBzKCk7XG4gICAgY29uc3QgZ3JvdXBLZXlzID0gdXNlckdyb3VwS2V5cygpO1xuICAgIGNvbnN0IHNlbGYgPSBhd2FpdCBVc2VyLmZpbmRCeUlkKGxvYWRVc2VyRGF0YSgpLnVzZXJuYW1lKTtcbiAgICBjb25zdCBrZXkgPSBhd2FpdCBTaWduaW5nS2V5LmZpbmRCeUlkKHNlbGYuYXR0cnMucGVyc29uYWxTaWduaW5nS2V5SWQpO1xuICAgIGdyb3VwS2V5cy5wZXJzb25hbCA9IGtleS5hdHRycztcbiAgICBncm91cEtleXMuc2lnbmluZ0tleXMgPSBzaWduaW5nS2V5cztcbiAgICBncm91cEtleXMudXNlckdyb3VwcyA9IHVzZXJHcm91cHM7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oR1JPVVBfTUVNQkVSU0hJUFNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGdyb3VwS2V5cykpO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGNsZWFyU3RvcmFnZSgpIHtcbiAgICBjbGVhclN0b3JhZ2UoKTtcbiAgfVxuXG4gIHN0YXRpYyB1c2VyR3JvdXBLZXlzKCkge1xuICAgIHJldHVybiB1c2VyR3JvdXBLZXlzKCk7XG4gIH1cblxuICBhc3luYyBlbmNyeXB0aW9uUHVibGljS2V5KCkge1xuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBVc2VyLmZpbmRCeUlkKHRoaXMuYXR0cnMudXNlcm5hbWUsIHsgZGVjcnlwdDogZmFsc2UgfSk7XG4gICAgY29uc3QgeyBwdWJsaWNLZXkgfSA9IHVzZXIuYXR0cnM7XG4gICAgcmV0dXJuIHB1YmxpY0tleTtcbiAgfVxuXG4gIGVuY3J5cHRpb25Qcml2YXRlS2V5KCkge1xuICAgIHJldHVybiBsb2FkVXNlckRhdGEoKS5hcHBQcml2YXRlS2V5O1xuICB9XG5cbiAgZ2V0U2lnbmluZ0tleSgpIHtcbiAgICBjb25zdCB7IHNpZ25pbmdLZXlJZCwgc2lnbmluZ0tleVByaXZhdGVLZXkgfToge1xuICAgICAgc2lnbmluZ0tleUlkPzogc3RyaW5nLFxuICAgICAgc2lnbmluZ0tleVByaXZhdGVLZXk/OiBzdHJpbmdcbiAgICB9ID0gdGhpcy5hdHRycztcbiAgICByZXR1cm4ge1xuICAgICAgX2lkOiBzaWduaW5nS2V5SWQsXG4gICAgICBwcml2YXRlS2V5OiBzaWduaW5nS2V5UHJpdmF0ZUtleSxcbiAgICB9O1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hVc2VyR3JvdXBTaWduaW5nS2V5KCkge1xuICAgIGNvbnN0IF9pZDogc3RyaW5nID0gdGhpcy5hdHRycy51c2VyR3JvdXBJZDtcbiAgICBjb25zdCB1c2VyR3JvdXAgPSBhd2FpdCBVc2VyR3JvdXAuZmluZEJ5SWQ8VXNlckdyb3VwPihfaWQpIGFzIFVzZXJHcm91cDtcbiAgICBjb25zdCB7IHNpZ25pbmdLZXlJZCB9OiB7XG4gICAgICBzaWduaW5nS2V5SWQ/OiBzdHJpbmdcbiAgICB9ID0gdXNlckdyb3VwLmF0dHJzO1xuICAgIHJldHVybiB7XG4gICAgICBfaWQsXG4gICAgICBzaWduaW5nS2V5SWQsXG4gICAgfTtcbiAgfVxufVxuIl19