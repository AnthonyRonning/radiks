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
      // commenting out to allow multiple invoices
      // if (this.invoiceInitialized) {
      //     return this.invoiceSocket;
      // }
      console.log('creating invoice socket for id: ' + id);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW1lci50cyJdLCJuYW1lcyI6WyJFVkVOVF9OQU1FIiwiTE5fRVZFTlRfTkFNRSIsIlN0cmVhbWVyIiwiaW5pdGlhbGl6ZWQiLCJzb2NrZXQiLCJhcGlTZXJ2ZXIiLCJwcm90b2NvbCIsImRvY3VtZW50IiwibG9jYXRpb24iLCJXZWJTb2NrZXQiLCJyZXBsYWNlIiwiZW1pdHRlciIsIkV2ZW50RW1pdHRlciIsIm9ubWVzc2FnZSIsImV2ZW50IiwiZW1pdCIsImNhbGxiYWNrIiwiaW5pdCIsImFkZExpc3RlbmVyIiwicmVtb3ZlTGlzdGVuZXIiLCJpZCIsImNvbnNvbGUiLCJsb2ciLCJpbnZvaWNlRW1pdHRlciIsImludm9pY2VTb2NrZXQiLCJpbnZvaWNlSW5pdGlhbGl6ZWQiLCJpbnZvaWNlSW5pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVBOzs7Ozs7Ozs7Ozs7QUFFQSxNQUFNQSxVQUFVLEdBQUcsdUJBQW5CO0FBQ0EsTUFBTUMsYUFBYSxHQUFHLG1CQUF0Qjs7SUFFcUJDLFE7Ozs7Ozs7OzsyQkFRTDtBQUNaLFVBQUksS0FBS0MsV0FBVCxFQUFzQjtBQUNwQixlQUFPLEtBQUtDLE1BQVo7QUFDRDs7QUFDRCxZQUFNO0FBQUVDLFFBQUFBO0FBQUYsVUFBZ0Isd0JBQXRCO0FBQ0EsWUFBTUMsUUFBUSxHQUFHQyxRQUFRLENBQUNDLFFBQVQsQ0FBa0JGLFFBQWxCLEtBQStCLE9BQS9CLEdBQXlDLElBQXpDLEdBQWdELEtBQWpFO0FBQ0EsWUFBTUYsTUFBTSxHQUFHLElBQUlLLFNBQUosQ0FBZSxHQUFFSCxRQUFTLE1BQUtELFNBQVMsQ0FBQ0ssT0FBVixDQUFrQixjQUFsQixFQUFrQyxFQUFsQyxDQUFzQyxpQkFBckUsQ0FBZjtBQUNBLFdBQUtDLE9BQUwsR0FBZSxJQUFJQyw0QkFBSixFQUFmO0FBQ0EsV0FBS1IsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsV0FBS0QsV0FBTCxHQUFtQixJQUFuQjs7QUFDQUMsTUFBQUEsTUFBTSxDQUFDUyxTQUFQLEdBQW9CQyxLQUFELElBQVc7QUFDNUIsYUFBS0gsT0FBTCxDQUFhSSxJQUFiLENBQWtCZixVQUFsQixFQUE4QixDQUFDYyxLQUFELENBQTlCO0FBQ0QsT0FGRDs7QUFHQSxhQUFPVixNQUFQO0FBQ0Q7OztnQ0FFa0JZLFEsRUFBaUM7QUFDbEQsV0FBS0MsSUFBTDtBQUNBLFdBQUtOLE9BQUwsQ0FBYU8sV0FBYixDQUF5QmxCLFVBQXpCLEVBQXFDZ0IsUUFBckM7QUFDRDs7O21DQUVxQkEsUSxFQUFvQjtBQUN4QyxXQUFLQyxJQUFMO0FBQ0EsV0FBS04sT0FBTCxDQUFhUSxjQUFiLENBQTRCbkIsVUFBNUIsRUFBd0NnQixRQUF4QztBQUNELEssQ0FFRDs7OztnQ0FDcUJJLEUsRUFBSTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBQyxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxxQ0FBcUNGLEVBQWpEO0FBQ0EsWUFBTTtBQUFFZixRQUFBQTtBQUFGLFVBQWdCLHdCQUF0QjtBQUNBLFlBQU1DLFFBQVEsR0FBR0MsUUFBUSxDQUFDQyxRQUFULENBQWtCRixRQUFsQixLQUErQixPQUEvQixHQUF5QyxJQUF6QyxHQUFnRCxLQUFqRTtBQUNBLFlBQU1GLE1BQU0sR0FBRyxJQUFJSyxTQUFKLENBQWUsR0FBRUgsUUFBUyxNQUFLRCxTQUFTLENBQUNLLE9BQVYsQ0FBa0IsY0FBbEIsRUFBa0MsRUFBbEMsQ0FBc0MscUJBQW9CVSxFQUFHLEVBQTVGLENBQWY7QUFDQSxXQUFLRyxjQUFMLEdBQXNCLElBQUlYLDRCQUFKLEVBQXRCO0FBQ0EsV0FBS1ksYUFBTCxHQUFxQnBCLE1BQXJCO0FBQ0EsV0FBS3FCLGtCQUFMLEdBQTBCLElBQTFCOztBQUNBckIsTUFBQUEsTUFBTSxDQUFDUyxTQUFQLEdBQW9CQyxLQUFELElBQVc7QUFDMUIsYUFBS1MsY0FBTCxDQUFvQlIsSUFBcEIsQ0FBeUJkLGFBQXpCLEVBQXdDLENBQUNhLEtBQUQsQ0FBeEM7QUFDSCxPQUZEOztBQUdBLGFBQU9WLE1BQVA7QUFDSDs7O3VDQUV5QmdCLEUsRUFBSUosUSxFQUFpQztBQUMzRCxXQUFLVSxXQUFMLENBQWlCTixFQUFqQjtBQUNBLFdBQUtHLGNBQUwsQ0FBb0JMLFdBQXBCLENBQWdDakIsYUFBaEMsRUFBK0NlLFFBQS9DO0FBQ0g7OzswQ0FFNEJJLEUsRUFBSUosUSxFQUFvQjtBQUNqRCxXQUFLVSxXQUFMLENBQWlCTixFQUFqQjtBQUNBLFdBQUtHLGNBQUwsQ0FBb0JKLGNBQXBCLENBQW1DbEIsYUFBbkMsRUFBa0RlLFFBQWxEO0FBQ0g7Ozs7Ozs7O2dCQTdEZ0JkLFE7O2dCQUFBQSxROztnQkFBQUEsUTs7Z0JBQUFBLFE7O2dCQUFBQSxROztnQkFBQUEsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnd29sZnk4Ny1ldmVudGVtaXR0ZXInO1xuXG5pbXBvcnQgeyBnZXRDb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5cbmNvbnN0IEVWRU5UX05BTUUgPSAnUkFESUtTX1NUUkVBTV9NRVNTQUdFJztcbmNvbnN0IExOX0VWRU5UX05BTUUgPSAnTE5fU1RSRUFNX01FU1NBR0UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJlYW1lciB7XG4gIHN0YXRpYyBpbml0aWFsaXplZDogYm9vbGVhbjtcbiAgc3RhdGljIHNvY2tldDogV2ViU29ja2V0O1xuICBzdGF0aWMgZW1pdHRlcjogRXZlbnRFbWl0dGVyO1xuICAgIHN0YXRpYyBpbnZvaWNlSW5pdGlhbGl6ZWQ6IGJvb2xlYW47XG4gICAgc3RhdGljIGludm9pY2VTb2NrZXQ6IFdlYlNvY2tldDtcbiAgICBzdGF0aWMgaW52b2ljZUVtaXR0ZXI6IEV2ZW50RW1pdHRlcjtcblxuICBzdGF0aWMgaW5pdCgpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgcmV0dXJuIHRoaXMuc29ja2V0O1xuICAgIH1cbiAgICBjb25zdCB7IGFwaVNlcnZlciB9ID0gZ2V0Q29uZmlnKCk7XG4gICAgY29uc3QgcHJvdG9jb2wgPSBkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHA6JyA/ICd3cycgOiAnd3NzJztcbiAgICBjb25zdCBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KGAke3Byb3RvY29sfTovLyR7YXBpU2VydmVyLnJlcGxhY2UoL15odHRwcz86XFwvXFwvLywgJycpfS9yYWRpa3Mvc3RyZWFtL2ApO1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICBzb2NrZXQub25tZXNzYWdlID0gKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdChFVkVOVF9OQU1FLCBbZXZlbnRdKTtcbiAgICB9O1xuICAgIHJldHVybiBzb2NrZXQ7XG4gIH1cblxuICBzdGF0aWMgYWRkTGlzdGVuZXIoY2FsbGJhY2s6IChhcmdzOiBhbnlbXSkgPT4gdm9pZCkge1xuICAgIHRoaXMuaW5pdCgpO1xuICAgIHRoaXMuZW1pdHRlci5hZGRMaXN0ZW5lcihFVkVOVF9OQU1FLCBjYWxsYmFjayk7XG4gIH1cblxuICBzdGF0aWMgcmVtb3ZlTGlzdGVuZXIoY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgdGhpcy5pbml0KCk7XG4gICAgdGhpcy5lbWl0dGVyLnJlbW92ZUxpc3RlbmVyKEVWRU5UX05BTUUsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8vIGxuIGludm9pY2VcbiAgICBzdGF0aWMgaW52b2ljZUluaXQoaWQpIHtcbiAgICAgICAgLy8gY29tbWVudGluZyBvdXQgdG8gYWxsb3cgbXVsdGlwbGUgaW52b2ljZXNcbiAgICAgICAgLy8gaWYgKHRoaXMuaW52b2ljZUluaXRpYWxpemVkKSB7XG4gICAgICAgIC8vICAgICByZXR1cm4gdGhpcy5pbnZvaWNlU29ja2V0O1xuICAgICAgICAvLyB9XG4gICAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGluZyBpbnZvaWNlIHNvY2tldCBmb3IgaWQ6ICcgKyBpZClcbiAgICAgICAgY29uc3QgeyBhcGlTZXJ2ZXIgfSA9IGdldENvbmZpZygpO1xuICAgICAgICBjb25zdCBwcm90b2NvbCA9IGRvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sID09PSAnaHR0cDonID8gJ3dzJyA6ICd3c3MnO1xuICAgICAgICBjb25zdCBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KGAke3Byb3RvY29sfTovLyR7YXBpU2VydmVyLnJlcGxhY2UoL15odHRwcz86XFwvXFwvLywgJycpfS9yYWRpa3Mvc3RyZWFtL2xuLyR7aWR9YCk7XG4gICAgICAgIHRoaXMuaW52b2ljZUVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMuaW52b2ljZVNvY2tldCA9IHNvY2tldDtcbiAgICAgICAgdGhpcy5pbnZvaWNlSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICBzb2NrZXQub25tZXNzYWdlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmludm9pY2VFbWl0dGVyLmVtaXQoTE5fRVZFTlRfTkFNRSwgW2V2ZW50XSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBzb2NrZXQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGFkZEludm9pY2VMaXN0ZW5lcihpZCwgY2FsbGJhY2s6IChhcmdzOiBhbnlbXSkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLmludm9pY2VJbml0KGlkKTtcbiAgICAgICAgdGhpcy5pbnZvaWNlRW1pdHRlci5hZGRMaXN0ZW5lcihMTl9FVkVOVF9OQU1FLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlbW92ZUludm9pY2VMaXN0ZW5lcihpZCwgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgICAgIHRoaXMuaW52b2ljZUluaXQoaWQpO1xuICAgICAgICB0aGlzLmludm9pY2VFbWl0dGVyLnJlbW92ZUxpc3RlbmVyKExOX0VWRU5UX05BTUUsIGNhbGxiYWNrKTtcbiAgICB9XG59XG4iXX0=