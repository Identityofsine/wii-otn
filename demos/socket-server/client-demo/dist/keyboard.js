"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardListener = void 0;
var process = require("process");
var readline = require("readline");
var state_1 = require("./state");
var KeyboardListener;
(function (KeyboardListener_1) {
    var KeyboardListener = /** @class */ (function () {
        function KeyboardListener() {
            var _this = this;
            this.listeners = { keypress: [], keyup: [] };
            this.std_input = process.stdin;
            this.interval_id = null;
            this.current_key = (0, state_1.default)();
            readline.emitKeypressEvents(this.std_input);
            if (process.stdin.isTTY)
                this.std_input.setRawMode(true);
            //on any data into stdin
            this.std_input.on('data', function (key) {
                if (_this.interval_id)
                    clearTimeout(_this.interval_id);
                var buffer_int = key.readInt8();
                if (_this.listeners.keypress)
                    _this.listeners.keypress.forEach(function (listener) { return listener(buffer_int); });
                if (buffer_int === 3)
                    process.exit();
                _this.current_key.setState(buffer_int);
                //on keyup
                _this.interval_id = setTimeout(function () {
                    _this.current_key.setState(0);
                    if (_this.listeners.keyup)
                        _this.listeners.keyup.forEach(function (listener) { return listener(); });
                }, _this.interval_id ? 200 : 2000);
            });
        }
        KeyboardListener.prototype.addListener = function (event, listener) {
            this.listeners[event].push(listener);
        };
        return KeyboardListener;
    }());
    KeyboardListener_1.KeyboardListener = KeyboardListener;
})(KeyboardListener || (exports.KeyboardListener = KeyboardListener = {}));
//# sourceMappingURL=keyboard.js.map