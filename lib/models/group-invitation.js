"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _model = _interopRequireDefault(require("../model"));

var _user = _interopRequireDefault(require("./user"));

var _groupMembership = _interopRequireDefault(require("./group-membership"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let GroupInvitation =
/*#__PURE__*/
function (_Model) {
  _inherits(GroupInvitation, _Model);

  function GroupInvitation(...args) {
    var _this;

    _classCallCheck(this, GroupInvitation);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GroupInvitation).call(this, ...args));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "userPublicKey", void 0);

    return _this;
  }

  _createClass(GroupInvitation, [{
    key: "activate",
    value: async function activate() {
      const {
        userGroups
      } = (0, _helpers.userGroupKeys)();
      const groupId = this.attrs.userGroupId;

      if (userGroups[groupId]) {
        return true;
      }

      const groupMembership = new _groupMembership.default({
        userGroupId: this.attrs.userGroupId,
        username: (0, _helpers.loadUserData)().username,
        signingKeyPrivateKey: this.attrs.signingKeyPrivateKey,
        signingKeyId: this.attrs.signingKeyId
      });
      await groupMembership.save();
      await _groupMembership.default.cacheKeys();
      return groupMembership;
    }
  }, {
    key: "encryptionPublicKey",
    value: async function encryptionPublicKey() {
      return this.userPublicKey;
    }
  }, {
    key: "encryptionPrivateKey",
    value: function encryptionPrivateKey() {
      return (0, _helpers.loadUserData)().appPrivateKey;
    }
  }], [{
    key: "makeInvitation",
    value: async function makeInvitation(username, userGroup) {
      const user = new _user.default({
        _id: username
      });
      await user.fetch({
        decrypt: false
      });
      const {
        publicKey
      } = user.attrs;
      const invitation = new this({
        userGroupId: userGroup._id,
        signingKeyPrivateKey: userGroup.privateKey,
        signingKeyId: userGroup.attrs.signingKeyId
      });
      invitation.userPublicKey = publicKey;
      await invitation.save();
      return invitation;
    }
  }]);

  return GroupInvitation;
}(_model.default);

exports.default = GroupInvitation;

_defineProperty(GroupInvitation, "className", 'GroupInvitation');

_defineProperty(GroupInvitation, "schema", {
  userGroupId: String,
  signingKeyPrivateKey: String,
  signingKeyId: String
});

_defineProperty(GroupInvitation, "defaults", {
  updatable: false
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvZ3JvdXAtaW52aXRhdGlvbi50cyJdLCJuYW1lcyI6WyJHcm91cEludml0YXRpb24iLCJ1c2VyR3JvdXBzIiwiZ3JvdXBJZCIsImF0dHJzIiwidXNlckdyb3VwSWQiLCJncm91cE1lbWJlcnNoaXAiLCJHcm91cE1lbWJlcnNoaXAiLCJ1c2VybmFtZSIsInNpZ25pbmdLZXlQcml2YXRlS2V5Iiwic2lnbmluZ0tleUlkIiwic2F2ZSIsImNhY2hlS2V5cyIsInVzZXJQdWJsaWNLZXkiLCJhcHBQcml2YXRlS2V5IiwidXNlckdyb3VwIiwidXNlciIsIlVzZXIiLCJfaWQiLCJmZXRjaCIsImRlY3J5cHQiLCJwdWJsaWNLZXkiLCJpbnZpdGF0aW9uIiwicHJpdmF0ZUtleSIsIk1vZGVsIiwiU3RyaW5nIiwidXBkYXRhYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFRcUJBLGU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUNBNEJGO0FBQ2YsWUFBTTtBQUFFQyxRQUFBQTtBQUFGLFVBQWlCLDZCQUF2QjtBQUNBLFlBQU1DLE9BQWUsR0FBRyxLQUFLQyxLQUFMLENBQVdDLFdBQW5DOztBQUNBLFVBQUlILFVBQVUsQ0FBQ0MsT0FBRCxDQUFkLEVBQXlCO0FBQ3ZCLGVBQU8sSUFBUDtBQUNEOztBQUNELFlBQU1HLGVBQWUsR0FBRyxJQUFJQyx3QkFBSixDQUFvQjtBQUMxQ0YsUUFBQUEsV0FBVyxFQUFFLEtBQUtELEtBQUwsQ0FBV0MsV0FEa0I7QUFFMUNHLFFBQUFBLFFBQVEsRUFBRSw2QkFBZUEsUUFGaUI7QUFHMUNDLFFBQUFBLG9CQUFvQixFQUFFLEtBQUtMLEtBQUwsQ0FBV0ssb0JBSFM7QUFJMUNDLFFBQUFBLFlBQVksRUFBRSxLQUFLTixLQUFMLENBQVdNO0FBSmlCLE9BQXBCLENBQXhCO0FBTUEsWUFBTUosZUFBZSxDQUFDSyxJQUFoQixFQUFOO0FBQ0EsWUFBTUoseUJBQWdCSyxTQUFoQixFQUFOO0FBQ0EsYUFBT04sZUFBUDtBQUNEOzs7Z0RBRTJCO0FBQzFCLGFBQU8sS0FBS08sYUFBWjtBQUNEOzs7MkNBRXNCO0FBQ3JCLGFBQU8sNkJBQWVDLGFBQXRCO0FBQ0Q7Ozt5Q0FyQzJCTixRLEVBQWtCTyxTLEVBQXNCO0FBQ2xFLFlBQU1DLElBQUksR0FBRyxJQUFJQyxhQUFKLENBQVM7QUFBRUMsUUFBQUEsR0FBRyxFQUFFVjtBQUFQLE9BQVQsQ0FBYjtBQUNBLFlBQU1RLElBQUksQ0FBQ0csS0FBTCxDQUFXO0FBQUVDLFFBQUFBLE9BQU8sRUFBRTtBQUFYLE9BQVgsQ0FBTjtBQUNBLFlBQU07QUFBRUMsUUFBQUE7QUFBRixVQUFnQkwsSUFBSSxDQUFDWixLQUEzQjtBQUNBLFlBQU1rQixVQUFVLEdBQUcsSUFBSSxJQUFKLENBQVM7QUFDMUJqQixRQUFBQSxXQUFXLEVBQUVVLFNBQVMsQ0FBQ0csR0FERztBQUUxQlQsUUFBQUEsb0JBQW9CLEVBQUVNLFNBQVMsQ0FBQ1EsVUFGTjtBQUcxQmIsUUFBQUEsWUFBWSxFQUFFSyxTQUFTLENBQUNYLEtBQVYsQ0FBZ0JNO0FBSEosT0FBVCxDQUFuQjtBQUtBWSxNQUFBQSxVQUFVLENBQUNULGFBQVgsR0FBMkJRLFNBQTNCO0FBQ0EsWUFBTUMsVUFBVSxDQUFDWCxJQUFYLEVBQU47QUFDQSxhQUFPVyxVQUFQO0FBQ0Q7Ozs7RUExQjBDRSxjOzs7O2dCQUF4QnZCLGUsZUFDQSxpQjs7Z0JBREFBLGUsWUFJSztBQUN0QkksRUFBQUEsV0FBVyxFQUFFb0IsTUFEUztBQUV0QmhCLEVBQUFBLG9CQUFvQixFQUFFZ0IsTUFGQTtBQUd0QmYsRUFBQUEsWUFBWSxFQUFFZTtBQUhRLEM7O2dCQUpMeEIsZSxjQVVEO0FBQ2hCeUIsRUFBQUEsU0FBUyxFQUFFO0FBREssQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNb2RlbCBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQgVXNlciBmcm9tICcuL3VzZXInO1xuaW1wb3J0IEdyb3VwTWVtYmVyc2hpcCBmcm9tICcuL2dyb3VwLW1lbWJlcnNoaXAnO1xuaW1wb3J0IFVzZXJHcm91cCBmcm9tICcuL3VzZXItZ3JvdXAnO1xuaW1wb3J0IHsgdXNlckdyb3VwS2V5cywgbG9hZFVzZXJEYXRhIH0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQgeyBTY2hlbWEsIEF0dHJzIH0gZnJvbSAnLi4vdHlwZXMvaW5kZXgnO1xuXG5pbnRlcmZhY2UgR3JvdXBJbnZpdGF0aW9uQXR0cnMgZXh0ZW5kcyBBdHRycyB7XG4gIHVzZXJHcm91cElkPzogc3RyaW5nIHwgUmVjb3JkPHN0cmluZywgYW55PixcbiAgc2lnbmluZ0tleVByaXZhdGVLZXk/OiBzdHJpbmcgfCBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcm91cEludml0YXRpb24gZXh0ZW5kcyBNb2RlbCB7XG4gIHN0YXRpYyBjbGFzc05hbWUgPSAnR3JvdXBJbnZpdGF0aW9uJztcbiAgdXNlclB1YmxpY0tleTogc3RyaW5nO1xuXG4gIHN0YXRpYyBzY2hlbWE6IFNjaGVtYSA9IHtcbiAgICB1c2VyR3JvdXBJZDogU3RyaW5nLFxuICAgIHNpZ25pbmdLZXlQcml2YXRlS2V5OiBTdHJpbmcsXG4gICAgc2lnbmluZ0tleUlkOiBTdHJpbmcsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdHMgPSB7XG4gICAgdXBkYXRhYmxlOiBmYWxzZSxcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBtYWtlSW52aXRhdGlvbih1c2VybmFtZTogc3RyaW5nLCB1c2VyR3JvdXA6IFVzZXJHcm91cCkge1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgVXNlcih7IF9pZDogdXNlcm5hbWUgfSk7XG4gICAgYXdhaXQgdXNlci5mZXRjaCh7IGRlY3J5cHQ6IGZhbHNlIH0pO1xuICAgIGNvbnN0IHsgcHVibGljS2V5IH0gPSB1c2VyLmF0dHJzO1xuICAgIGNvbnN0IGludml0YXRpb24gPSBuZXcgdGhpcyh7XG4gICAgICB1c2VyR3JvdXBJZDogdXNlckdyb3VwLl9pZCxcbiAgICAgIHNpZ25pbmdLZXlQcml2YXRlS2V5OiB1c2VyR3JvdXAucHJpdmF0ZUtleSxcbiAgICAgIHNpZ25pbmdLZXlJZDogdXNlckdyb3VwLmF0dHJzLnNpZ25pbmdLZXlJZCxcbiAgICB9KTtcbiAgICBpbnZpdGF0aW9uLnVzZXJQdWJsaWNLZXkgPSBwdWJsaWNLZXk7XG4gICAgYXdhaXQgaW52aXRhdGlvbi5zYXZlKCk7XG4gICAgcmV0dXJuIGludml0YXRpb247XG4gIH1cblxuICBhc3luYyBhY3RpdmF0ZSgpIHtcbiAgICBjb25zdCB7IHVzZXJHcm91cHMgfSA9IHVzZXJHcm91cEtleXMoKTtcbiAgICBjb25zdCBncm91cElkOiBzdHJpbmcgPSB0aGlzLmF0dHJzLnVzZXJHcm91cElkIGFzIHN0cmluZztcbiAgICBpZiAodXNlckdyb3Vwc1tncm91cElkXSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNvbnN0IGdyb3VwTWVtYmVyc2hpcCA9IG5ldyBHcm91cE1lbWJlcnNoaXAoe1xuICAgICAgdXNlckdyb3VwSWQ6IHRoaXMuYXR0cnMudXNlckdyb3VwSWQsXG4gICAgICB1c2VybmFtZTogbG9hZFVzZXJEYXRhKCkudXNlcm5hbWUsXG4gICAgICBzaWduaW5nS2V5UHJpdmF0ZUtleTogdGhpcy5hdHRycy5zaWduaW5nS2V5UHJpdmF0ZUtleSxcbiAgICAgIHNpZ25pbmdLZXlJZDogdGhpcy5hdHRycy5zaWduaW5nS2V5SWQsXG4gICAgfSk7XG4gICAgYXdhaXQgZ3JvdXBNZW1iZXJzaGlwLnNhdmUoKTtcbiAgICBhd2FpdCBHcm91cE1lbWJlcnNoaXAuY2FjaGVLZXlzKCk7XG4gICAgcmV0dXJuIGdyb3VwTWVtYmVyc2hpcDtcbiAgfVxuXG4gIGFzeW5jIGVuY3J5cHRpb25QdWJsaWNLZXkoKSB7XG4gICAgcmV0dXJuIHRoaXMudXNlclB1YmxpY0tleTtcbiAgfVxuXG4gIGVuY3J5cHRpb25Qcml2YXRlS2V5KCkge1xuICAgIHJldHVybiBsb2FkVXNlckRhdGEoKS5hcHBQcml2YXRlS2V5O1xuICB9XG59XG4iXX0=