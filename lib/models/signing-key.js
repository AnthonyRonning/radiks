"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keys = require("blockstack/lib/keys");

var _model = _interopRequireDefault(require("../model"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let SigningKey =
/*#__PURE__*/
function (_Model) {
  _inherits(SigningKey, _Model);

  function SigningKey(...args) {
    var _this;

    _classCallCheck(this, SigningKey);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SigningKey).call(this, ...args));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "encryptionPrivateKey", () => (0, _helpers.loadUserData)().appPrivateKey);

    return _this;
  }

  _createClass(SigningKey, null, [{
    key: "create",
    value: async function create(attrs = {}) {
      const privateKey = (0, _keys.makeECPrivateKey)();
      const publicKey = (0, _keys.getPublicKeyFromPrivate)(privateKey);
      const signingKey = new SigningKey(_objectSpread({}, attrs, {
        publicKey,
        privateKey
      }));
      await signingKey.save.apply(signingKey);
      return signingKey;
    }
  }]);

  return SigningKey;
}(_model.default);

exports.default = SigningKey;

_defineProperty(SigningKey, "className", 'SigningKey');

_defineProperty(SigningKey, "schema", {
  publicKey: {
    type: String,
    decrypted: true
  },
  privateKey: String,
  userGroupId: {
    type: String,
    decrypted: true
  }
});

_defineProperty(SigningKey, "defaults", {
  updatable: false
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvc2lnbmluZy1rZXkudHMiXSwibmFtZXMiOlsiU2lnbmluZ0tleSIsImFwcFByaXZhdGVLZXkiLCJhdHRycyIsInByaXZhdGVLZXkiLCJwdWJsaWNLZXkiLCJzaWduaW5nS2V5Iiwic2F2ZSIsImFwcGx5IiwiTW9kZWwiLCJ0eXBlIiwiU3RyaW5nIiwiZGVjcnlwdGVkIiwidXNlckdyb3VwSWQiLCJ1cGRhdGFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBU3FCQSxVOzs7Ozs7Ozs7Ozs7bUdBK0JJLE1BQU0sNkJBQWVDLGE7Ozs7Ozs7aUNBWnhCQyxLQUFLLEdBQUcsRSxFQUFJO0FBQzlCLFlBQU1DLFVBQVUsR0FBRyw2QkFBbkI7QUFDQSxZQUFNQyxTQUFTLEdBQUcsbUNBQXdCRCxVQUF4QixDQUFsQjtBQUNBLFlBQU1FLFVBQVUsR0FBRyxJQUFJTCxVQUFKLG1CQUNkRSxLQURjO0FBRWpCRSxRQUFBQSxTQUZpQjtBQUdqQkQsUUFBQUE7QUFIaUIsU0FBbkI7QUFLQSxZQUFNRSxVQUFVLENBQUNDLElBQVgsQ0FBZ0JDLEtBQWhCLENBQXNCRixVQUF0QixDQUFOO0FBQ0EsYUFBT0EsVUFBUDtBQUNEOzs7O0VBN0JxQ0csYzs7OztnQkFBbkJSLFUsZUFDQSxZOztnQkFEQUEsVSxZQUdIO0FBQ2RJLEVBQUFBLFNBQVMsRUFBRTtBQUNUSyxJQUFBQSxJQUFJLEVBQUVDLE1BREc7QUFFVEMsSUFBQUEsU0FBUyxFQUFFO0FBRkYsR0FERztBQUtkUixFQUFBQSxVQUFVLEVBQUVPLE1BTEU7QUFNZEUsRUFBQUEsV0FBVyxFQUFFO0FBQ1hILElBQUFBLElBQUksRUFBRUMsTUFESztBQUVYQyxJQUFBQSxTQUFTLEVBQUU7QUFGQTtBQU5DLEM7O2dCQUhHWCxVLGNBZUQ7QUFDaEJhLEVBQUFBLFNBQVMsRUFBRTtBQURLLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtYWtlRUNQcml2YXRlS2V5LCBnZXRQdWJsaWNLZXlGcm9tUHJpdmF0ZSB9IGZyb20gJ2Jsb2Nrc3RhY2svbGliL2tleXMnO1xuXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHsgbG9hZFVzZXJEYXRhIH0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQgeyBBdHRycyB9IGZyb20gJy4uL3R5cGVzL2luZGV4JztcblxuaW50ZXJmYWNlIFNpZ25pbmdLZXlBdHRycyBleHRlbmRzIEF0dHJzIHtcbiAgcHVibGljS2V5Pzogc3RyaW5nLFxuICBwcml2YXRlS2V5Pzogc3RyaW5nIHwgYW55LFxuICB1c2VyR3JvdXBJZD86IHN0cmluZyxcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2lnbmluZ0tleSBleHRlbmRzIE1vZGVsIHtcbiAgc3RhdGljIGNsYXNzTmFtZSA9ICdTaWduaW5nS2V5JztcblxuICBzdGF0aWMgc2NoZW1hID0ge1xuICAgIHB1YmxpY0tleToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVjcnlwdGVkOiB0cnVlLFxuICAgIH0sXG4gICAgcHJpdmF0ZUtleTogU3RyaW5nLFxuICAgIHVzZXJHcm91cElkOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWNyeXB0ZWQ6IHRydWUsXG4gICAgfSxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0cyA9IHtcbiAgICB1cGRhdGFibGU6IGZhbHNlLFxuICB9XG5cbiAgc3RhdGljIGFzeW5jIGNyZWF0ZShhdHRycyA9IHt9KSB7XG4gICAgY29uc3QgcHJpdmF0ZUtleSA9IG1ha2VFQ1ByaXZhdGVLZXkoKTtcbiAgICBjb25zdCBwdWJsaWNLZXkgPSBnZXRQdWJsaWNLZXlGcm9tUHJpdmF0ZShwcml2YXRlS2V5KTtcbiAgICBjb25zdCBzaWduaW5nS2V5ID0gbmV3IFNpZ25pbmdLZXkoe1xuICAgICAgLi4uYXR0cnMsXG4gICAgICBwdWJsaWNLZXksXG4gICAgICBwcml2YXRlS2V5LFxuICAgIH0pO1xuICAgIGF3YWl0IHNpZ25pbmdLZXkuc2F2ZS5hcHBseShzaWduaW5nS2V5KTtcbiAgICByZXR1cm4gc2lnbmluZ0tleTtcbiAgfVxuXG4gIGVuY3J5cHRpb25Qcml2YXRlS2V5ID0gKCkgPT4gbG9hZFVzZXJEYXRhKCkuYXBwUHJpdmF0ZUtleVxufVxuIl19