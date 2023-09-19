"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var interface_1 = require("./interface");
var keyboard_1 = require("./keyboard");
var socket_1 = require("./socket");
var state_1 = require("./state");
var keyboard_listener = new keyboard_1.KeyboardListener.KeyboardListener();
var wii_message_state = (0, state_1.default)(__assign(__assign({}, interface_1.empty_wii_controller), { name: 'test', new: true }));
var socket_object = new socket_1.default("192.168.1.3", 1337);
socket_object.sendMessage(wii_message_state.getState());
wii_message_state.setState(function (old_state) { return __assign(__assign({}, old_state), { new: false }); });
wii_message_state.addListener(function (new_state) {
    socket_object.sendMessage(new_state);
});
keyboard_listener.addListener('keypress', function (key) {
    if (key === 3) {
        process.exit();
    }
    //check if key is in key_map
    if (!interface_1.key_map[key])
        return;
    var buttons_pressed = interface_1.key_map[key] | wii_message_state.getState().buttons_pressed;
    if (buttons_pressed === wii_message_state.getState().buttons_pressed)
        return;
    wii_message_state.setState(function (old_state) { return __assign(__assign({}, old_state), { buttons_pressed: buttons_pressed, new: false }); });
});
keyboard_listener.addListener('keyup', function () {
    console.log('key up');
    wii_message_state.setState(function (old_state) { return __assign(__assign({}, old_state), { buttons_pressed: 0, new: false }); });
});
//do not terminate program unless user does
setInterval(function () { }, 1000);
//# sourceMappingURL=old.index.js.map