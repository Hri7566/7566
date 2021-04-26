const WebSocket = require('ws');

module.exports = class WSServer {
    constructor (port) {
        this.server = new WebSocket.Server({
            port: port
        });
    }
}
