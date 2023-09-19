"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a state object
 */
function createState(default_value) {
    if (default_value === void 0) { default_value = undefined; }
    var state = default_value;
    var listeners = [];
    var getState = function () { return state; };
    var setState = function (newState) {
        if (typeof newState === 'function')
            state = newState(state);
        else
            state = newState;
        listeners.forEach(function (listener) { return listener(state); });
    };
    var addListener = function (listener) {
        listeners.push(listener);
    };
    return {
        getState: getState,
        setState: setState,
        addListener: addListener
    };
}
exports.default = createState;
//# sourceMappingURL=state.js.map