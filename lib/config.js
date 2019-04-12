"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfig = exports.configure = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let config = {
  apiServer: '',
  userSession: null
};

const configure = newConfig => {
  config = _objectSpread({}, config, newConfig);
};
/**
 * some info
 */


exports.configure = configure;

const getConfig = () => config;

exports.getConfig = getConfig;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25maWcudHMiXSwibmFtZXMiOlsiY29uZmlnIiwiYXBpU2VydmVyIiwidXNlclNlc3Npb24iLCJjb25maWd1cmUiLCJuZXdDb25maWciLCJnZXRDb25maWciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBT0EsSUFBSUEsTUFBYyxHQUFHO0FBQ25CQyxFQUFBQSxTQUFTLEVBQUUsRUFEUTtBQUVuQkMsRUFBQUEsV0FBVyxFQUFFO0FBRk0sQ0FBckI7O0FBS08sTUFBTUMsU0FBUyxHQUFJQyxTQUFELElBQTRCO0FBQ25ESixFQUFBQSxNQUFNLHFCQUNEQSxNQURDLEVBRURJLFNBRkMsQ0FBTjtBQUlELENBTE07QUFPUDs7Ozs7OztBQUdPLE1BQU1DLFNBQVMsR0FBRyxNQUFjTCxNQUFoQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVzZXJTZXNzaW9uIH0gZnJvbSAnLi90eXBlcy9pbmRleCc7XG5cbmludGVyZmFjZSBDb25maWcge1xuICBhcGlTZXJ2ZXI6IHN0cmluZyxcbiAgdXNlclNlc3Npb246IFVzZXJTZXNzaW9uLFxufVxuXG5sZXQgY29uZmlnOiBDb25maWcgPSB7XG4gIGFwaVNlcnZlcjogJycsXG4gIHVzZXJTZXNzaW9uOiBudWxsLFxufTtcblxuZXhwb3J0IGNvbnN0IGNvbmZpZ3VyZSA9IChuZXdDb25maWc6IFVzZXJTZXNzaW9uKSA9PiB7XG4gIGNvbmZpZyA9IHtcbiAgICAuLi5jb25maWcsXG4gICAgLi4ubmV3Q29uZmlnLFxuICB9O1xufTtcblxuLyoqXG4gKiBzb21lIGluZm9cbiAqL1xuZXhwb3J0IGNvbnN0IGdldENvbmZpZyA9ICgpOiBDb25maWcgPT4gY29uZmlnO1xuIl19