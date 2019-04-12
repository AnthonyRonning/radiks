"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _wolfy87Eventemitter = _interopRequireDefault(require("wolfy87-eventemitter"));

var _config = require("./config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const EVENT_NAME = 'RADIKS_STREAM_MESSAGE';
const LN_EVENT_NAME = 'LN_STREAM_MESSAGE';

let Streamer =
/*#__PURE__*/
function () {
  function Streamer() {
    _classCallCheck(this, Streamer);
  }

  _createClass(Streamer, null, [{
    key: "init",
    value: function init() {
      if (this.initialized) {
        return this.socket;
      }

      const {
        apiServer
      } = (0, _config.getConfig)();
      const protocol = document.location.protocol === 'http:' ? 'ws' : 'wss';
      const socket = new WebSocket(`${protocol}://${apiServer.replace(/^https?:\/\//, '')}/radiks/stream/`);
      this.emitter = new _wolfy87Eventemitter.default();
      this.socket = socket;
      this.initialized = true;

      socket.onmessage = event => {
        this.emitter.emit(EVENT_NAME, [event]);
      };

      return socket;
    }
  }, {
    key: "addListener",
    value: function addListener(callback) {
      this.init();
      this.emitter.addListener(EVENT_NAME, callback);
    }
  }, {
    key: "removeListener",
    value: function removeListener(callback) {
      this.init();
      this.emitter.removeListener(EVENT_NAME, callback);
    } // ln invoice

  }, {
    key: "invoiceInit",
    value: function invoiceInit(id) {
      if (this.invoiceInitialized) {
        return this.invoiceSocket;
      }

      const {
        apiServer
      } = (0, _config.getConfig)();
      const protocol = document.location.protocol === 'http:' ? 'ws' : 'wss';
      const socket = new WebSocket(`${protocol}://${apiServer.replace(/^https?:\/\//, '')}/radiks/stream/ln/${id}`);
      this.invoiceEmitter = new _wolfy87Eventemitter.default();
      this.invoiceSocket = socket;
      this.invoiceInitialized = true;

      socket.onmessage = event => {
        this.invoiceEmitter.emit(LN_EVENT_NAME, [event]);
      };

      return socket;
    }
  }, {
    key: "addInvoiceListener",
    value: function addInvoiceListener(id, callback) {
      this.invoiceInit(id);
      this.invoiceEmitter.addListener(LN_EVENT_NAME, callback);
    }
  }, {
    key: "removeInvoiceListener",
    value: function removeInvoiceListener(id, callback) {
      this.invoiceInit(id);
      this.invoiceEmitter.removeListener(LN_EVENT_NAME, callback);
    }
  }]);

  return Streamer;
}();

exports.default = Streamer;

_defineProperty(Streamer, "initialized", void 0);

_defineProperty(Streamer, "socket", void 0);

_defineProperty(Streamer, "emitter", void 0);

_defineProperty(Streamer, "invoiceInitialized", void 0);

_defineProperty(Streamer, "invoiceSocket", void 0);

_defineProperty(Streamer, "invoiceEmitter", void 0);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW1lci50cyJdLCJuYW1lcyI6WyJFVkVOVF9OQU1FIiwiTE5fRVZFTlRfTkFNRSIsIlN0cmVhbWVyIiwiaW5pdGlhbGl6ZWQiLCJzb2NrZXQiLCJhcGlTZXJ2ZXIiLCJwcm90b2NvbCIsImRvY3VtZW50IiwibG9jYXRpb24iLCJXZWJTb2NrZXQiLCJyZXBsYWNlIiwiZW1pdHRlciIsIkV2ZW50RW1pdHRlciIsIm9ubWVzc2FnZSIsImV2ZW50IiwiZW1pdCIsImNhbGxiYWNrIiwiaW5pdCIsImFkZExpc3RlbmVyIiwicmVtb3ZlTGlzdGVuZXIiLCJpZCIsImludm9pY2VJbml0aWFsaXplZCIsImludm9pY2VTb2NrZXQiLCJpbnZvaWNlRW1pdHRlciIsImludm9pY2VJbml0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRUE7Ozs7Ozs7Ozs7OztBQUVBLE1BQU1BLFVBQVUsR0FBRyx1QkFBbkI7QUFDQSxNQUFNQyxhQUFhLEdBQUcsbUJBQXRCOztJQUVxQkMsUTs7Ozs7Ozs7OzJCQVFMO0FBQ1osVUFBSSxLQUFLQyxXQUFULEVBQXNCO0FBQ3BCLGVBQU8sS0FBS0MsTUFBWjtBQUNEOztBQUNELFlBQU07QUFBRUMsUUFBQUE7QUFBRixVQUFnQix3QkFBdEI7QUFDQSxZQUFNQyxRQUFRLEdBQUdDLFFBQVEsQ0FBQ0MsUUFBVCxDQUFrQkYsUUFBbEIsS0FBK0IsT0FBL0IsR0FBeUMsSUFBekMsR0FBZ0QsS0FBakU7QUFDQSxZQUFNRixNQUFNLEdBQUcsSUFBSUssU0FBSixDQUFlLEdBQUVILFFBQVMsTUFBS0QsU0FBUyxDQUFDSyxPQUFWLENBQWtCLGNBQWxCLEVBQWtDLEVBQWxDLENBQXNDLGlCQUFyRSxDQUFmO0FBQ0EsV0FBS0MsT0FBTCxHQUFlLElBQUlDLDRCQUFKLEVBQWY7QUFDQSxXQUFLUixNQUFMLEdBQWNBLE1BQWQ7QUFDQSxXQUFLRCxXQUFMLEdBQW1CLElBQW5COztBQUNBQyxNQUFBQSxNQUFNLENBQUNTLFNBQVAsR0FBb0JDLEtBQUQsSUFBVztBQUM1QixhQUFLSCxPQUFMLENBQWFJLElBQWIsQ0FBa0JmLFVBQWxCLEVBQThCLENBQUNjLEtBQUQsQ0FBOUI7QUFDRCxPQUZEOztBQUdBLGFBQU9WLE1BQVA7QUFDRDs7O2dDQUVrQlksUSxFQUFpQztBQUNsRCxXQUFLQyxJQUFMO0FBQ0EsV0FBS04sT0FBTCxDQUFhTyxXQUFiLENBQXlCbEIsVUFBekIsRUFBcUNnQixRQUFyQztBQUNEOzs7bUNBRXFCQSxRLEVBQW9CO0FBQ3hDLFdBQUtDLElBQUw7QUFDQSxXQUFLTixPQUFMLENBQWFRLGNBQWIsQ0FBNEJuQixVQUE1QixFQUF3Q2dCLFFBQXhDO0FBQ0QsSyxDQUVEOzs7O2dDQUNxQkksRSxFQUFJO0FBQ25CLFVBQUksS0FBS0Msa0JBQVQsRUFBNkI7QUFDekIsZUFBTyxLQUFLQyxhQUFaO0FBQ0g7O0FBQ0QsWUFBTTtBQUFFakIsUUFBQUE7QUFBRixVQUFnQix3QkFBdEI7QUFDQSxZQUFNQyxRQUFRLEdBQUdDLFFBQVEsQ0FBQ0MsUUFBVCxDQUFrQkYsUUFBbEIsS0FBK0IsT0FBL0IsR0FBeUMsSUFBekMsR0FBZ0QsS0FBakU7QUFDQSxZQUFNRixNQUFNLEdBQUcsSUFBSUssU0FBSixDQUFlLEdBQUVILFFBQVMsTUFBS0QsU0FBUyxDQUFDSyxPQUFWLENBQWtCLGNBQWxCLEVBQWtDLEVBQWxDLENBQXNDLHFCQUFvQlUsRUFBRyxFQUE1RixDQUFmO0FBQ0EsV0FBS0csY0FBTCxHQUFzQixJQUFJWCw0QkFBSixFQUF0QjtBQUNBLFdBQUtVLGFBQUwsR0FBcUJsQixNQUFyQjtBQUNBLFdBQUtpQixrQkFBTCxHQUEwQixJQUExQjs7QUFDQWpCLE1BQUFBLE1BQU0sQ0FBQ1MsU0FBUCxHQUFvQkMsS0FBRCxJQUFXO0FBQzFCLGFBQUtTLGNBQUwsQ0FBb0JSLElBQXBCLENBQXlCZCxhQUF6QixFQUF3QyxDQUFDYSxLQUFELENBQXhDO0FBQ0gsT0FGRDs7QUFHQSxhQUFPVixNQUFQO0FBQ0g7Ozt1Q0FFeUJnQixFLEVBQUlKLFEsRUFBaUM7QUFDM0QsV0FBS1EsV0FBTCxDQUFpQkosRUFBakI7QUFDQSxXQUFLRyxjQUFMLENBQW9CTCxXQUFwQixDQUFnQ2pCLGFBQWhDLEVBQStDZSxRQUEvQztBQUNIOzs7MENBRTRCSSxFLEVBQUlKLFEsRUFBb0I7QUFDakQsV0FBS1EsV0FBTCxDQUFpQkosRUFBakI7QUFDQSxXQUFLRyxjQUFMLENBQW9CSixjQUFwQixDQUFtQ2xCLGFBQW5DLEVBQWtEZSxRQUFsRDtBQUNIOzs7Ozs7OztnQkEzRGdCZCxROztnQkFBQUEsUTs7Z0JBQUFBLFE7O2dCQUFBQSxROztnQkFBQUEsUTs7Z0JBQUFBLFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ3dvbGZ5ODctZXZlbnRlbWl0dGVyJztcblxuaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuXG5jb25zdCBFVkVOVF9OQU1FID0gJ1JBRElLU19TVFJFQU1fTUVTU0FHRSc7XG5jb25zdCBMTl9FVkVOVF9OQU1FID0gJ0xOX1NUUkVBTV9NRVNTQUdFJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RyZWFtZXIge1xuICBzdGF0aWMgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XG4gIHN0YXRpYyBzb2NrZXQ6IFdlYlNvY2tldDtcbiAgc3RhdGljIGVtaXR0ZXI6IEV2ZW50RW1pdHRlcjtcbiAgICBzdGF0aWMgaW52b2ljZUluaXRpYWxpemVkOiBib29sZWFuO1xuICAgIHN0YXRpYyBpbnZvaWNlU29ja2V0OiBXZWJTb2NrZXQ7XG4gICAgc3RhdGljIGludm9pY2VFbWl0dGVyOiBFdmVudEVtaXR0ZXI7XG5cbiAgc3RhdGljIGluaXQoKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnNvY2tldDtcbiAgICB9XG4gICAgY29uc3QgeyBhcGlTZXJ2ZXIgfSA9IGdldENvbmZpZygpO1xuICAgIGNvbnN0IHByb3RvY29sID0gZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2wgPT09ICdodHRwOicgPyAnd3MnIDogJ3dzcyc7XG4gICAgY29uc3Qgc29ja2V0ID0gbmV3IFdlYlNvY2tldChgJHtwcm90b2NvbH06Ly8ke2FwaVNlcnZlci5yZXBsYWNlKC9eaHR0cHM/OlxcL1xcLy8sICcnKX0vcmFkaWtzL3N0cmVhbS9gKTtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQ7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgc29ja2V0Lm9ubWVzc2FnZSA9IChldmVudCkgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoRVZFTlRfTkFNRSwgW2V2ZW50XSk7XG4gICAgfTtcbiAgICByZXR1cm4gc29ja2V0O1xuICB9XG5cbiAgc3RhdGljIGFkZExpc3RlbmVyKGNhbGxiYWNrOiAoYXJnczogYW55W10pID0+IHZvaWQpIHtcbiAgICB0aGlzLmluaXQoKTtcbiAgICB0aGlzLmVtaXR0ZXIuYWRkTGlzdGVuZXIoRVZFTlRfTkFNRSwgY2FsbGJhY2spO1xuICB9XG5cbiAgc3RhdGljIHJlbW92ZUxpc3RlbmVyKGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgIHRoaXMuaW5pdCgpO1xuICAgIHRoaXMuZW1pdHRlci5yZW1vdmVMaXN0ZW5lcihFVkVOVF9OQU1FLCBjYWxsYmFjayk7XG4gIH1cblxuICAvLyBsbiBpbnZvaWNlXG4gICAgc3RhdGljIGludm9pY2VJbml0KGlkKSB7XG4gICAgICAgIGlmICh0aGlzLmludm9pY2VJbml0aWFsaXplZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW52b2ljZVNvY2tldDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7IGFwaVNlcnZlciB9ID0gZ2V0Q29uZmlnKCk7XG4gICAgICAgIGNvbnN0IHByb3RvY29sID0gZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2wgPT09ICdodHRwOicgPyAnd3MnIDogJ3dzcyc7XG4gICAgICAgIGNvbnN0IHNvY2tldCA9IG5ldyBXZWJTb2NrZXQoYCR7cHJvdG9jb2x9Oi8vJHthcGlTZXJ2ZXIucmVwbGFjZSgvXmh0dHBzPzpcXC9cXC8vLCAnJyl9L3JhZGlrcy9zdHJlYW0vbG4vJHtpZH1gKTtcbiAgICAgICAgdGhpcy5pbnZvaWNlRW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5pbnZvaWNlU29ja2V0ID0gc29ja2V0O1xuICAgICAgICB0aGlzLmludm9pY2VJbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgIHNvY2tldC5vbm1lc3NhZ2UgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaW52b2ljZUVtaXR0ZXIuZW1pdChMTl9FVkVOVF9OQU1FLCBbZXZlbnRdKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHNvY2tldDtcbiAgICB9XG5cbiAgICBzdGF0aWMgYWRkSW52b2ljZUxpc3RlbmVyKGlkLCBjYWxsYmFjazogKGFyZ3M6IGFueVtdKSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuaW52b2ljZUluaXQoaWQpO1xuICAgICAgICB0aGlzLmludm9pY2VFbWl0dGVyLmFkZExpc3RlbmVyKExOX0VWRU5UX05BTUUsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVtb3ZlSW52b2ljZUxpc3RlbmVyKGlkLCBjYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICAgICAgdGhpcy5pbnZvaWNlSW5pdChpZCk7XG4gICAgICAgIHRoaXMuaW52b2ljZUVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIoTE5fRVZFTlRfTkFNRSwgY2FsbGJhY2spO1xuICAgIH1cbn1cbiJdfQ==