const { Server: WebSocketServer } = require('ws');
const StaticEventEmitter = require('../StaticEventEmitter');
const https = require('https');
const http = require('http');
const { Client } = require('./Client');
const DeferredRegister = require('../DeferredRegister');

const PORT = process.env.PORT;
const USE_HTTPS = process.env.USE_HTTPS;

class Server extends StaticEventEmitter {
    static httpsServer;

    static wss;
    static clients = new DeferredRegister('client');

    static start(config) {
        // console.log(`----[ \x1b[32mSTART\x1b[0m ]----`);

        if (USE_HTTPS == "true") {
            console.log("Using HTTPS");
            this.httpsServer = https.createServer({
                // TODO add certs
            });
        } else {
            console.log("Using HTTP");
            this.httpsServer = http.createServer({

            });
        }

        this.wss = new WebSocketServer({
            // server: this.httpsServer
            noServer: true
        });

        this.httpsServer.on('upgrade', (request, socket, head) => {
            let banned = [ // TODO real banned using db

            ];

            if (!banned.includes((request.connection.remoteAddress).replace("::ffff:", ""))) {
                this.wss.handleUpgrade(request, socket, head, (ws) => {
                    this.wss.emit('connection', ws, request);
                });
            } else {
                socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
                socket.destroy();
            }
        });

        this.httpsServer.listen(PORT, () => {
            console.log(`Server started on :${PORT}`);
        });

        this.config = config;
        this.bind();
    }

    static bind() {
        this.wss.on('connection', (ws, req) => {
            let cl = new Client(ws, req, this.config);
        });
    }
}

module.exports = {
    Server
}
