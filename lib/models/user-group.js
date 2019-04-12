"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keys = require("blockstack/lib/keys");

var _model = _interopRequireDefault(require("../model"));

var _groupMembership = _interopRequireDefault(require("./group-membership"));

var _groupInvitation = _interopRequireDefault(require("./group-invitation"));

var _signingKey = _interopRequireDefault(require("./signing-key"));

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

const defaultMembers = [];

let UserGroup =
/*#__PURE__*/
function (_Model) {
  _inherits(UserGroup, _Model);

  function UserGroup(...args) {
    var _this;

    _classCallCheck(this, UserGroup);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UserGroup).call(this, ...args));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "privateKey", void 0);

    return _this;
  }

  _createClass(UserGroup, [{
    key: "create",
    value: async function create() {
      const signingKey = await _signingKey.default.create({
        userGroupId: this._id
      });
      this.attrs.signingKeyId = signingKey._id;
      this.privateKey = signingKey.attrs.privateKey;
      (0, _helpers.addUserGroupKey)(this); // await this.makeGaiaConfig();

      const {
        username
      } = (0, _helpers.loadUserData)();
      const invitation = await this.makeGroupMembership(username);
      await invitation.activate();
      return this;
    }
  }, {
    key: "makeGroupMembership",
    value: async function makeGroupMembership(username) {
      let existingInviteId = null;
      this.attrs.members.forEach(member => {
        if (member.username === username) {
          existingInviteId = member.inviteId;
        }
      });

      if (existingInviteId) {
        const invitation = await _groupInvitation.default.findById(existingInviteId, {
          decrypt: false
        });
        return invitation;
      }

      const invitation = await _groupInvitation.default.makeInvitation(username, this);
      this.attrs.members.push({
        username,
        inviteId: invitation._id
      });
      await this.save();
      return invitation;
    }
  }, {
    key: "publicKey",
    value: function publicKey() {
      return (0, _keys.getPublicKeyFromPrivate)(this.privateKey);
    }
  }, {
    key: "encryptionPublicKey",
    value: async function encryptionPublicKey() {
      return this.publicKey();
    }
  }, {
    key: "encryptionPrivateKey",
    value: function encryptionPrivateKey() {
      if (this.privateKey) {
        return this.privateKey;
      }

      const {
        signingKeys
      } = (0, _helpers.userGroupKeys)();
      return signingKeys[this.attrs.signingKeyId];
    }
  }, {
    key: "makeGaiaConfig",
    value: async function makeGaiaConfig() {
      const userData = (0, _helpers.loadUserData)();
      const {
        appPrivateKey,
        hubUrl
      } = userData;
      const scopes = [{
        scope: 'putFilePrefix',
        domain: `UserGroups/${this._id}/`
      }];
      const userSession = (0, _helpers.requireUserSession)();
      const gaiaConfig = await userSession.connectToGaiaHub(hubUrl, appPrivateKey, scopes);
      this.attrs.gaiaConfig = gaiaConfig;
      return gaiaConfig;
    }
  }, {
    key: "getSigningKey",
    value: function getSigningKey() {
      const {
        userGroups,
        signingKeys
      } = (0, _helpers.userGroupKeys)();
      const id = userGroups[this._id];
      const privateKey = signingKeys[id];
      return {
        privateKey,
        id
      };
    }
  }], [{
    key: "find",
    value: async function find(id) {
      const {
        userGroups,
        signingKeys
      } = _groupMembership.default.userGroupKeys();

      if (!userGroups || !userGroups[id]) {
        throw new Error(`UserGroup not found with id: '${id}'. Have you called \`GroupMembership.cacheKeys()\`?`);
      }

      const signingKey = userGroups[id];
      const privateKey = signingKeys[signingKey];
      const userGroup = new this({
        _id: id
      });
      userGroup.privateKey = privateKey;
      await userGroup.fetch();
      return userGroup;
    }
  }, {
    key: "myGroups",
    value: function myGroups() {
      const {
        userGroups
      } = (0, _helpers.userGroupKeys)();
      const keys = Object.keys(userGroups);
      return this.fetchList({
        _id: keys.join(',')
      });
    }
  }]);

  return UserGroup;
}(_model.default);

exports.default = UserGroup;

_defineProperty(UserGroup, "schema", {
  name: String,
  gaiaConfig: Object,
  members: {
    type: Array
  }
});

_defineProperty(UserGroup, "defaults", {
  members: defaultMembers
});

_defineProperty(UserGroup, "modelName", () => 'UserGroup');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvdXNlci1ncm91cC50cyJdLCJuYW1lcyI6WyJkZWZhdWx0TWVtYmVycyIsIlVzZXJHcm91cCIsInNpZ25pbmdLZXkiLCJTaWduaW5nS2V5IiwiY3JlYXRlIiwidXNlckdyb3VwSWQiLCJfaWQiLCJhdHRycyIsInNpZ25pbmdLZXlJZCIsInByaXZhdGVLZXkiLCJ1c2VybmFtZSIsImludml0YXRpb24iLCJtYWtlR3JvdXBNZW1iZXJzaGlwIiwiYWN0aXZhdGUiLCJleGlzdGluZ0ludml0ZUlkIiwibWVtYmVycyIsImZvckVhY2giLCJtZW1iZXIiLCJpbnZpdGVJZCIsIkdyb3VwSW52aXRhdGlvbiIsImZpbmRCeUlkIiwiZGVjcnlwdCIsIm1ha2VJbnZpdGF0aW9uIiwicHVzaCIsInNhdmUiLCJwdWJsaWNLZXkiLCJzaWduaW5nS2V5cyIsInVzZXJEYXRhIiwiYXBwUHJpdmF0ZUtleSIsImh1YlVybCIsInNjb3BlcyIsInNjb3BlIiwiZG9tYWluIiwidXNlclNlc3Npb24iLCJnYWlhQ29uZmlnIiwiY29ubmVjdFRvR2FpYUh1YiIsInVzZXJHcm91cHMiLCJpZCIsIkdyb3VwTWVtYmVyc2hpcCIsInVzZXJHcm91cEtleXMiLCJFcnJvciIsInVzZXJHcm91cCIsImZldGNoIiwia2V5cyIsIk9iamVjdCIsImZldGNoTGlzdCIsImpvaW4iLCJNb2RlbCIsIm5hbWUiLCJTdHJpbmciLCJ0eXBlIiwiQXJyYXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQSxNQUFNQSxjQUF3QixHQUFHLEVBQWpDOztJQUVxQkMsUzs7Ozs7Ozs7Ozs7Ozs7Ozs7OzttQ0E0Qko7QUFDYixZQUFNQyxVQUFVLEdBQUcsTUFBTUMsb0JBQVdDLE1BQVgsQ0FBa0I7QUFBRUMsUUFBQUEsV0FBVyxFQUFFLEtBQUtDO0FBQXBCLE9BQWxCLENBQXpCO0FBQ0EsV0FB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QUFwQzs7QUFDQSxVQUFJLENBQUNILFVBQUQsSUFBZSxDQUFDQSxVQUFVLENBQUNDLEVBQUQsQ0FBOUIsRUFBb0M7QUFDbEMsY0FBTSxJQUFJRyxLQUFKLENBQVcsaUNBQWdDSCxFQUFHLHFEQUE5QyxDQUFOO0FBQ0Q7O0FBQ0QsWUFBTW5DLFVBQVUsR0FBR2tDLFVBQVUsQ0FBQ0MsRUFBRCxDQUE3QjtBQUNBLFlBQU01QixVQUFVLEdBQUdpQixXQUFXLENBQUN4QixVQUFELENBQTlCO0FBQ0EsWUFBTXVDLFNBQVMsR0FBRyxJQUFJLElBQUosQ0FBUztBQUFFbkMsUUFBQUEsR0FBRyxFQUFFK0I7QUFBUCxPQUFULENBQWxCO0FBQ0FJLE1BQUFBLFNBQVMsQ0FBQ2hDLFVBQVYsR0FBdUJBLFVBQXZCO0FBQ0EsWUFBTWdDLFNBQVMsQ0FBQ0MsS0FBVixFQUFOO0FBQ0EsYUFBT0QsU0FBUDtBQUNEOzs7K0JBcUNpQjtBQUNoQixZQUFNO0FBQUVMLFFBQUFBO0FBQUYsVUFBaUIsNkJBQXZCO0FBQ0EsWUFBTU8sSUFBSSxHQUFHQyxNQUFNLENBQUNELElBQVAsQ0FBWVAsVUFBWixDQUFiO0FBQ0EsYUFBTyxLQUFLUyxTQUFMLENBQWU7QUFBRXZDLFFBQUFBLEdBQUcsRUFBRXFDLElBQUksQ0FBQ0csSUFBTCxDQUFVLEdBQVY7QUFBUCxPQUFmLENBQVA7QUFDRDs7OztFQW5Fb0NDLGM7Ozs7Z0JBQWxCOUMsUyxZQUdLO0FBQ3RCK0MsRUFBQUEsSUFBSSxFQUFFQyxNQURnQjtBQUV0QmYsRUFBQUEsVUFBVSxFQUFFVSxNQUZVO0FBR3RCN0IsRUFBQUEsT0FBTyxFQUFFO0FBQ1BtQyxJQUFBQSxJQUFJLEVBQUVDO0FBREM7QUFIYSxDOztnQkFITGxELFMsY0FXRDtBQUNoQmMsRUFBQUEsT0FBTyxFQUFFZjtBQURPLEM7O2dCQVhDQyxTLGVBb0dBLE1BQU0sVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldFB1YmxpY0tleUZyb21Qcml2YXRlIH0gZnJvbSAnYmxvY2tzdGFjay9saWIva2V5cyc7XG5cbmltcG9ydCBNb2RlbCBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQgR3JvdXBNZW1iZXJzaGlwIGZyb20gJy4vZ3JvdXAtbWVtYmVyc2hpcCc7XG5pbXBvcnQgR3JvdXBJbnZpdGF0aW9uIGZyb20gJy4vZ3JvdXAtaW52aXRhdGlvbic7XG5pbXBvcnQgU2lnbmluZ0tleSBmcm9tICcuL3NpZ25pbmcta2V5JztcbmltcG9ydCB7XG4gIHVzZXJHcm91cEtleXMsIGFkZFVzZXJHcm91cEtleSwgbG9hZFVzZXJEYXRhLCByZXF1aXJlVXNlclNlc3Npb24sXG59IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHsgU2NoZW1hLCBBdHRycyB9IGZyb20gJy4uL3R5cGVzL2luZGV4JztcblxuaW50ZXJmYWNlIE1lbWJlciB7XG4gIHVzZXJuYW1lOiBzdHJpbmcsXG4gIGludml0ZUlkOiBzdHJpbmdcbn1cblxuaW50ZXJmYWNlIFVzZXJHcm91cEF0dHJzIGV4dGVuZHMgQXR0cnMge1xuICBuYW1lPzogc3RyaW5nIHwgYW55LFxuICBnYWlhQ29uZmlnOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgYW55LFxuICBtZW1iZXJzOiBhbnlbXSB8IGFueSxcbn1cblxuY29uc3QgZGVmYXVsdE1lbWJlcnM6IE1lbWJlcltdID0gW107XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVzZXJHcm91cCBleHRlbmRzIE1vZGVsIHtcbiAgcHJpdmF0ZUtleT86IHN0cmluZztcblxuICBzdGF0aWMgc2NoZW1hOiBTY2hlbWEgPSB7XG4gICAgbmFtZTogU3RyaW5nLFxuICAgIGdhaWFDb25maWc6IE9iamVjdCxcbiAgICBtZW1iZXJzOiB7XG4gICAgICB0eXBlOiBBcnJheSxcbiAgICB9LFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRzID0ge1xuICAgIG1lbWJlcnM6IGRlZmF1bHRNZW1iZXJzLFxuICB9XG5cbiAgc3RhdGljIGFzeW5jIGZpbmQoaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IHsgdXNlckdyb3Vwcywgc2lnbmluZ0tleXMgfSA9IEdyb3VwTWVtYmVyc2hpcC51c2VyR3JvdXBLZXlzKCk7XG4gICAgaWYgKCF1c2VyR3JvdXBzIHx8ICF1c2VyR3JvdXBzW2lkXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVc2VyR3JvdXAgbm90IGZvdW5kIHdpdGggaWQ6ICcke2lkfScuIEhhdmUgeW91IGNhbGxlZCBcXGBHcm91cE1lbWJlcnNoaXAuY2FjaGVLZXlzKClcXGA/YCk7XG4gICAgfVxuICAgIGNvbnN0IHNpZ25pbmdLZXkgPSB1c2VyR3JvdXBzW2lkXTtcbiAgICBjb25zdCBwcml2YXRlS2V5ID0gc2lnbmluZ0tleXNbc2lnbmluZ0tleV07XG4gICAgY29uc3QgdXNlckdyb3VwID0gbmV3IHRoaXMoeyBfaWQ6IGlkIH0pO1xuICAgIHVzZXJHcm91cC5wcml2YXRlS2V5ID0gcHJpdmF0ZUtleTtcbiAgICBhd2FpdCB1c2VyR3JvdXAuZmV0Y2goKTtcbiAgICByZXR1cm4gdXNlckdyb3VwO1xuICB9XG5cbiAgYXN5bmMgY3JlYXRlKCkge1xuICAgIGNvbnN0IHNpZ25pbmdLZXkgPSBhd2FpdCBTaWduaW5nS2V5LmNyZWF0ZSh7IHVzZXJHcm91cElkOiB0aGlzLl9pZCB9KTtcbiAgICB0aGlzLmF0dHJzLnNpZ25pbmdLZXlJZCA9IHNpZ25pbmdLZXkuX2lkO1xuICAgIHRoaXMucHJpdmF0ZUtleSA9IHNpZ25pbmdLZXkuYXR0cnMucHJpdmF0ZUtleTtcbiAgICBhZGRVc2VyR3JvdXBLZXkodGhpcyk7XG4gICAgLy8gYXdhaXQgdGhpcy5tYWtlR2FpYUNvbmZpZygpO1xuICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGxvYWRVc2VyRGF0YSgpO1xuICAgIGNvbnN0IGludml0YXRpb24gPSBhd2FpdCB0aGlzLm1ha2VHcm91cE1lbWJlcnNoaXAodXNlcm5hbWUpO1xuICAgIGF3YWl0IGludml0YXRpb24uYWN0aXZhdGUoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFzeW5jIG1ha2VHcm91cE1lbWJlcnNoaXAodXNlcm5hbWU6IHN0cmluZyk6IFByb21pc2U8R3JvdXBJbnZpdGF0aW9uPiB7XG4gICAgbGV0IGV4aXN0aW5nSW52aXRlSWQgPSBudWxsO1xuICAgIHRoaXMuYXR0cnMubWVtYmVycy5mb3JFYWNoKChtZW1iZXI6IE1lbWJlcikgPT4ge1xuICAgICAgaWYgKG1lbWJlci51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcbiAgICAgICAgZXhpc3RpbmdJbnZpdGVJZCA9IG1lbWJlci5pbnZpdGVJZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoZXhpc3RpbmdJbnZpdGVJZCkge1xuICAgICAgY29uc3QgaW52aXRhdGlvbiA9IGF3YWl0IEdyb3VwSW52aXRhdGlvbi5maW5kQnlJZChcbiAgICAgICAgZXhpc3RpbmdJbnZpdGVJZCxcbiAgICAgICAgeyBkZWNyeXB0OiBmYWxzZSB9LFxuICAgICAgKTtcbiAgICAgIHJldHVybiBpbnZpdGF0aW9uIGFzIEdyb3VwSW52aXRhdGlvbjtcbiAgICB9XG4gICAgY29uc3QgaW52aXRhdGlvbiA9IGF3YWl0IEdyb3VwSW52aXRhdGlvbi5tYWtlSW52aXRhdGlvbih1c2VybmFtZSwgdGhpcyk7XG4gICAgdGhpcy5hdHRycy5tZW1iZXJzLnB1c2goe1xuICAgICAgdXNlcm5hbWUsXG4gICAgICBpbnZpdGVJZDogaW52aXRhdGlvbi5faWQsXG4gICAgfSk7XG4gICAgYXdhaXQgdGhpcy5zYXZlKCk7XG4gICAgcmV0dXJuIGludml0YXRpb247XG4gIH1cblxuICBzdGF0aWMgbXlHcm91cHMoKSB7XG4gICAgY29uc3QgeyB1c2VyR3JvdXBzIH0gPSB1c2VyR3JvdXBLZXlzKCk7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHVzZXJHcm91cHMpO1xuICAgIHJldHVybiB0aGlzLmZldGNoTGlzdCh7IF9pZDoga2V5cy5qb2luKCcsJykgfSk7XG4gIH1cblxuICBwdWJsaWNLZXkoKSB7XG4gICAgcmV0dXJuIGdldFB1YmxpY0tleUZyb21Qcml2YXRlKHRoaXMucHJpdmF0ZUtleSk7XG4gIH1cblxuICBhc3luYyBlbmNyeXB0aW9uUHVibGljS2V5KCkge1xuICAgIHJldHVybiB0aGlzLnB1YmxpY0tleSgpO1xuICB9XG5cbiAgZW5jcnlwdGlvblByaXZhdGVLZXkoKSB7XG4gICAgaWYgKHRoaXMucHJpdmF0ZUtleSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZUtleTtcbiAgICB9XG4gICAgY29uc3QgeyBzaWduaW5nS2V5cyB9ID0gdXNlckdyb3VwS2V5cygpO1xuICAgIHJldHVybiBzaWduaW5nS2V5c1t0aGlzLmF0dHJzLnNpZ25pbmdLZXlJZF07XG4gIH1cblxuICBhc3luYyBtYWtlR2FpYUNvbmZpZygpIHtcbiAgICBjb25zdCB1c2VyRGF0YSA9IGxvYWRVc2VyRGF0YSgpO1xuICAgIGNvbnN0IHsgYXBwUHJpdmF0ZUtleSwgaHViVXJsIH0gPSB1c2VyRGF0YTtcbiAgICBjb25zdCBzY29wZXMgPSBbXG4gICAgICB7XG4gICAgICAgIHNjb3BlOiAncHV0RmlsZVByZWZpeCcsXG4gICAgICAgIGRvbWFpbjogYFVzZXJHcm91cHMvJHt0aGlzLl9pZH0vYCxcbiAgICAgIH0sXG4gICAgXTtcbiAgICBjb25zdCB1c2VyU2Vzc2lvbiA9IHJlcXVpcmVVc2VyU2Vzc2lvbigpO1xuICAgIGNvbnN0IGdhaWFDb25maWcgPSBhd2FpdCB1c2VyU2Vzc2lvbi5jb25uZWN0VG9HYWlhSHViKGh1YlVybCwgYXBwUHJpdmF0ZUtleSwgc2NvcGVzKTtcbiAgICB0aGlzLmF0dHJzLmdhaWFDb25maWcgPSBnYWlhQ29uZmlnO1xuICAgIHJldHVybiBnYWlhQ29uZmlnO1xuICB9XG5cbiAgc3RhdGljIG1vZGVsTmFtZSA9ICgpID0+ICdVc2VyR3JvdXAnXG5cbiAgZ2V0U2lnbmluZ0tleSgpIHtcbiAgICBjb25zdCB7IHVzZXJHcm91cHMsIHNpZ25pbmdLZXlzIH0gPSB1c2VyR3JvdXBLZXlzKCk7XG4gICAgY29uc3QgaWQgPSB1c2VyR3JvdXBzW3RoaXMuX2lkXTtcbiAgICBjb25zdCBwcml2YXRlS2V5ID0gc2lnbmluZ0tleXNbaWRdO1xuICAgIHJldHVybiB7XG4gICAgICBwcml2YXRlS2V5LFxuICAgICAgaWQsXG4gICAgfTtcbiAgfVxufVxuIl19