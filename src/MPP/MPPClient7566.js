const Client7566 = require('../Client7566');
const MPPClient = require('./MPPClient');
const Cursor = require('./Cursor');
const Vector2 = require('../Geometry/Vector2');
const { ClientChatMessage, ServerChatMessage } = require('../Message');
const Logger = require('../Logger');
const pkg = require('../../package.json');
const { Database } = require('../Database');
const config = require('../config');

const NODE_ENV = process.env.NODE_ENV || 'production';

class MPPClient7566 extends Client7566 {
    constructor (id, uri, room, token, proxy) {
        super(id, 'mpp');
        this.client = new MPPClient(uri, token);
        this.room = room;
        this.proxy = proxy;

        this.logger = new Logger("MPP");
        this.cursor = new Cursor();

        this.client.start();
        this.client.setChannel(this.room);
        this.lastCursorPos = new Vector2(-150, -150);

        if (process.env.NODE_ENV === "production") {
            let [prefix] = Bot.prefixes.values();
            this.u = { name: `7566 [${prefix.accessor}help]`, color: "#8d3f50" };
        } else {
            let [prefix] = Bot.prefixes.values();
            this.u = { name: `7566 [${prefix.accessor}help] (non-prod)`, color: "#8d3f50" };
        }

        this.bindClientEventListeners();

        this.chJoinInterval = setInterval(() => {
            this.client.setChannel(this.room);
        }, 1000 * 60 * 5);
    }
    
    bindEventListeners() {
        super.bindEventListeners();

        this.on('cursor', (x, y) => {
            this.client.sendArray([{
                m: "m",
                x: Math.floor(x * 100) / 100,
                y: Math.floor(y * 100) / 100
            }]);
        });

        this.on('send', msg => {
            this.sendChat(msg.message);
        });
    }

    bindClientEventListeners() {
        this.client.sendArray([{m: "+custom"}]);

        this.client.on('hi', msg => {
            this.startCursorInterval();
            this.userset();
            
            if (NODE_ENV === "production") {
                this.sendChat("✔️ Connected");
            }
            this.logger.log(`Online in ${this.room}`);
        });

        this.client.on('a', msg => {
            if (!msg.hasOwnProperty('m')) return;
            if (msg.m !== 'a') return;
            if (!msg.hasOwnProperty('a')) return;

            let m = new ServerChatMessage(msg.a, msg.p);

            let self = false;
            if (msg.p._id == this.client.getOwnParticipant()._id) self = true;

            this.emit('receive', m, this, self);
        });

        this.client.on('custom', msg => {
            if (!msg.hasOwnProperty('data')) return;
            if (msg.m !== 'custom') return;
            if (!msg.data.hasOwnProperty('m')) return;
            if (!msg.hasOwnProperty('p')) return;

            switch (msg.data.m) {
                case '?chown':
                    if (!msg.data.password) return;
                    if (typeof msg.data.password !== 'string') return;
                    if (msg.data.password !== '7566') return;
                    this.client.sendArray([{m: 'chown', id: msg.p}]);
                    break;
            }
        });

        this.client.on('ch', msg => {
            if (this.client.getOwnParticipant().name !== this.u.name || this.client.getOwnParticipant().color !== this.u.color) {
                this.userset();
            }
        });

        this.client.on('participant added', async p => {
            let user = await Database.createUser(p);
        })
    }

    userset(set) {
        if (process.env.NODE_ENV === "production") {
            if (!set) set = this.u;
            this.client.sendArray([{m:"userset", set:set}])
        } else {
            if (!set) set = this.u;
            this.client.sendArray([{m:"userset", set:set}])
        }
    }

    startCursorInterval() {
        if (process.env.NODE_ENV === "production") {
            // this.cursor.defaultFigureC();
            this.cursor.patterns.get(config.defaults.cursor || 'figurec')();
        } else {
            // this.cursor.defaultFigure();
            this.cursor.patterns.get('figure')();
        }

        if (this.cursorInterval) clearInterval(this.cursorInterval);

        // let count = 0;
        // setInterval(() => {
        //     switch (count) {
        //         case 0:
        //             this.cursor.defaultLeaf();
        //             break;
        //         case 1:
        //             this.cursor.defaultDVD();
        //             break;
        //         case 2:
        //             this.cursor.defaultFigure();
        //             break;
        //         case 3:
        //             this.cursor.defaultFigureB();
        //             break;
        //     }

        //     count++;
        //     if (count > 3) count = 0;
        // }, 30000);

        this.cursorUpdateInterval = setInterval(() => {
            if (!this.cursor.follow) {
                this.cursor.func();
            } else {
                let p = this.getPart(this.cursor.follow);
                if (p) {
                    this.cursor.position.x = p.x;
                    this.cursor.position.y = p.y;
                } else {
                    // this.cursor.position.x = 100;
                    // this.cursor.position.y = 200;
                    this.cursor.func();
                }
            }
        }, 1000 / 60);

        this.cursorInterval = setInterval(() => {
            // this is entirely borked ;-;
            // if (this.cursor.position.x !== this.lastCursorPos.x && this.cursor.position.y !== this.lastCursorPos.y) {
                this.emit('cursor', this.cursor.position.x, this.cursor.position.y);
                // this.lastCursorPos = this.cursor.position;
            // }
        }, 1000 / 20);
    }

    sendChat(txt) {
        super.sendChat(txt);
        this.client.sendArray([new ClientChatMessage(txt)]);
    }

    getPart(str) {
        str = str.toLowerCase();
        let p;
        for (const u of Object.values(this.client.ppl)) {
            if (u.name.toLowerCase().includes(str) || u._id.toLowerCase().includes(str) || u.id.toLowerCase().includes(str)) {
                p = u;
                break;
            }
        }

        return p;
    }
}

module.exports = MPPClient7566;
