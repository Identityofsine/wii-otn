"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dgram = require("dgram");
var Socket = /** @class */ (function () {
    function Socket(ip, port) {
        //construct socket
        this.socket = dgram.createSocket("udp4");
        this.ip = ip;
        this.port = port;
    }
    Socket.prototype.sendMessage = function (message) {
        this.socket.send(JSON.stringify(message), this.port, this.ip, function (err) {
            if (err) {
                console.log(err);
            }
        });
    };
    /**
    * events.EventEmitter
    * 1. close
    * 2. connect
    * 3. error
    * 4. listening
    * 5. message
    */
    Socket.prototype.addListener = function (event, listener) {
        this.socket.on(event, listener);
    };
    return Socket;
}());
exports.default = Socket;
//# sourceMappingURL=socket.js.map