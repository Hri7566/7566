const WebSocket = require('ws');
const Logger = require('../lib/Logger');
const https = require('https');
const http = require('http');

module.exports = class WSServer {
    constructor (port) {
        this.httpsServer = https.createServer();
        this.httpServer = http.createServer();

        this.server = new WebSocket.Server({
            server: this.httpsServer
        });
        this.logger = new Logger('WSS');
        this.start(port);
    }
    
    start(port) {
        this.httpsServer.listen(port);
        this.logger.log('WebSocket server started');
    }
}
