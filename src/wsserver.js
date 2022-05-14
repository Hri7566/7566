const WebSocket = require('ws');
const Logger = require('./Logger');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const EventEmitter = require('events');

const TLS = process.env.TLS == 'true';

class Crypto {
    static generateID(ip) {
        let hash = crypto.createHash('sha256');
        hash.update(ip + 'intermediaflatulencebuzzergiantroosterface');
        return hash.digest('hex');
    }

    static magicRando() {
        var result = "";
        for(var i = 0; i < 256; i++) {
            result = arr[Math.floor(Math.random() * arr.length)];
            if(result.indexOf("(") !== -1)
                    result = result.substr(0, result.indexOf("(") - 1);
            var md5 = crypto.createHash("md5");
            md5.update(result + "intermediaflatulencebuzzergiantroosterface");
            var hash = md5.digest();
            var random = hash.readUInt8(0) / 0xff + 0.5;
            if(new Date().getDay() === 4) random += 0.25;
            if(random > 1) random = 1;
            if(Math.random() < random) {
                break;
            }
        }
        return result;
    }
}

class WSClient extends EventEmitter {
    constructor(ws, req) {
        super();
        WSServer.logger.log("new wsclient");
        this.ws = ws;
        this.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        if (this.ip.startsWith('::ffff:')) {
            this.ip = this.ip.substr(7);
        }
        this.full_id = Crypto.generateID(this.ip);
        this.id = this.full_id.substring(0, 24);
    }
}

class WSServer {
    static started = false;
    
    static start(port) {
        if (TLS) {
            this.httpServer = https.createServer({
                key: fs.readFileSync(join(__dirname, '../certs/key.pem')),
                cert: fs.readFileSync(join(__dirname, '../certs/cert.pem'))
            });
        } else {
            this.httpServer = http.createServer();
        }

        this.server = new WebSocket.Server({
            server: this.httpServer
        });

        this.logger = new Logger('WSS');

        this.httpServer.listen(port);
        this.bindEventListeners();

        this.logger.log('WebSocket server started');
    }

    static bindEventListeners() {
        this.httpServer.on('upgrade', (req, socket, head) => {
            if (req.url == '/ws') {
                this.server.handleUpgrade(req, socket, head, (ws) => {
                    this.server.emit('connection', ws, req);
                });
            }
        });

        this.server.on('connection', (ws, req) => {
            let cl = new WSClient(ws, req);
            cl.ws.on('message', msg => {
                this.logger.log(`[${cl.id}] ${msg}`);
            });
        });
    }
}

module.exports = {
    WSServer
}
