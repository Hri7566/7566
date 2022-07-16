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

    static magicRando(arr) {
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

    static generateParticipantID() {
        let d = Date.now().toString();
        let hash = crypto.createHash('sha3-256');

        hash.update(d).update('intermediaflatulencebuzzergiantroosterface');

        return hash.digest('hex');
    }
}

class WSClient extends EventEmitter {
    /**
     * WSClient
     * @param {WebSocket} ws WebSocket Client Connection
     * @param {*} req WebSocket Request
     */
    constructor(ws, req) {
        super();
        WSServer.logger.log("new wsclient");
        this.ws = ws;
        this.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        
        if (this.ip.startsWith('::ffff:')) {
            this.ip = this.ip.substr(7);
        }

        this._id = Crypto.generateID(this.ip);

        this.user = {
            full_id: this._id,
            id: this._id.substring(0, 24),
            participantId: Crypto.generateParticipantID()
        }

        this.loggedIn = false;

        this.bindEventListeners();
    }

    bindEventListeners() {
        this.ws.on('message', data => {
            try {
                const jmsgs = data.toString();
                const msgs = JSON.parse(jmsgs);
                
                for (const msg of msgs) {
                    if (!'m' in msg) return;
                    if (msg.m !== 'hi' && !this.loggedIn) return;
                    this.emit(msg.m, msg);
                }
            } catch (err) {}
        });

        this.on('hi', msg => {
            if (msg.password !== '7566') return;
            this.loggedIn = true;
        });

        this.on('bye', msg => {
            this.ws.close();
        });

        this.on('subscribe to admin stream', msg => {
            let interval = msg.interval_ms;
            this.adminStreamInterval = setInterval(() => {
                this.send([{
                    m: 'data',
                    data: WSServer.getData()
                }]);
            }, interval || 10000);
        });
    }

    send(msgs) {
        this.ws.send(JSON.stringify(msgs));
    }
}

class WSServer {
    static started = false;
    static clients = new Map();
    
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

            while (cl.user.participantId in this.clients.keys()) {
                cl.user.participantId = magicRando();
            }

            this.clients.set(cl.user.participantId, cl);
        });
    }

    static getData() {
        return {
            wss: {
                status: typeof this.wss == 'object' ? 'online' : 'offline',
                connections: this.clients.size
            },
            bot: {
                started: Bot.started,
                clientCount: Bot.clients.size
            },
            package: require('../package.json')
        }
    }
}

module.exports = {
    WSServer
}
