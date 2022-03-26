const { EventEmitter } = require("events");
const WebSocket = require('ws');
const config = require("../config");
const { Channel, ChannelSettings } = require("./Channel");
const { Crypto } = require("./Crypto");
const { Database } = require("../Database");
const { RateLimitChain, RateLimit } = require("./RateLimit");
const DeferredRegister = require("../DeferredRegister");

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

class Client extends EventEmitter {
    static clients = new DeferredRegister('client');

    /**
     * Server representation of client
     * @param {WebSocket} ws WebSocket connection
     */
    constructor (ws, req, config) {
        super();

        this.ws = ws;
        
        this.rateLimits = {
            chat: new RateLimitChain(4, 4000),
            note: new RateLimitChain(600, 1800),
            cursor: new RateLimit(20),
            chset: new RateLimit(1000)
        }
        
        // let addr = ws._socket.address();
        this.ip = req.socket.remoteAddress;
        console.log(this.ip);
        this.id = Crypto.getNowID();
        
        Client.clients.register(this.id, this);

        this.channel_id = 'lobby';


        this.start();

        this.cursorPos = {
            x: -10,
            y: -10
        }
    }

    async start() {
        this.bind();
    }

    // async setupUser() {
    //     this.user = await Database.createUser(Crypto.getID(this.ip));
    // }

    async getUser() {
        return await Database.createUser({_id: Crypto.getID(this.ip), name: "Anonymous", color: Crypto.getColor(this.ip)});
    }

    async getPublicUser() {
        await this.getUser();
        let user = await this.getUser();
        let u = {
            _id: user._id,
            name: user.name,
            id: this.id,
            color: user.color
        }
        return u;
    }

    setChannel(_id, set) {
        let old_ch = Channel.channels.map[this.channel_id];

        if (old_ch) {
            if (old_ch._id !== _id) {
                old_ch.removeParticipant(this);
            }
        }

        let ch = Channel.channels.map[_id];
        if (!ch) { // new channel
            ch = new Channel(_id, set);
            ch.addParticipant(this);
        } else { // join channel
            ch.addParticipant(this);
        }

        this.channel_id = _id;

        // console.log(Registry.registry);
    }

    setRateLimits(rl) {
        for (let key of Object.keys(rl)) {
            try {
                this.rateLimits[key] = rl[key];
            } catch (err) {

            }
        }
    }

    bind() {
        this.ws.on('message', evt => { // on websocket message
            try {
                let msgs = JSON.parse(evt);
                for (let msg of msgs) {
                    // if (!this.hasOwnProperty('rateLimit') && msg.m !== 'hi') return;
                    try {
                        if (!msg.hasOwnProperty('m')) continue;
                        this.emit(msg.m, msg);
                        if (msg.m == 'bye') return;
                    } catch (err) {

                    }
                }
            } catch (err) {
                
            }
        });

        this.ws.on('close', (code, reason) => {
            this.emit('bye');
        });

        this.once('hi', async msg => { // connect
            this.sendArray([{
                m: 'hi',
                t: Date.now(),
                u: await this.getPublicUser()
            }]);
        });

        this.once('bye', () => {
            let ch = this.getChannel();
            if (ch) {
                ch.removeParticipant(this);
                ch.update();
            }
            Client.clients.deregister(this.id);
            DeferredRegister.registry.delete(this.id);
        });

        this.on('devices', () => { // devices

        });

        this.on('ch', async msg => { // channel
            if (!msg.hasOwnProperty("_id")) msg._id = 'lobby';
            if (!msg.hasOwnProperty("set")) msg.set = {};

            let _id = msg._id;

            let user = await this.getPublicUser();
            let ppl = [
                user
            ];

            this.setChannel(_id, msg.set);

            // this.sendArray([{ // move to channel update
            //     m: 'ch',
            //     p: user.id,
            //     ch: {
            //         _id: _id,
            //         count: 1,
            //         settings: {
            //             color: "#3b5054",
            //             color2: "#001014",
            //             crownsolo: false,
            //             visible: true,
            //             lobby: true,
            //             chat: true
            //         }
            //     },
            //     ppl: ppl
            // }]);

            this.sendNoteQuota();
        });

        this.on('chset', (msg, admin) => { // channel settings set
            if (!msg.hasOwnProperty('set')) return;
            let ch = this.getChannel();
            if (ch.crown.participantId == this.id || admin) {
                let set = ChannelSettings.parse(msg.set);
                ch.applySettings(set, admin);
            }
        });

        this.on('chown', async (msg, admin) => { // channel owner change
            let ch = this.getChannel();
            let id = msg.id;
            let u = await this.getPublicUser();

            ch.giveCrown(id, u, admin);
        });

        this.on('userset', async (msg, admin) => { // user data set
            if (!msg.hasOwnProperty('set')) return;
            this.setUser(msg.set, admin);
        });

        this.on('a', async msg => { // chat message
            let ch = Channel.channels.map[this.channel_id];
            let u = await this.getPublicUser();
            
            if (!this.hasOwnProperty('rateLimits')) return;
            if (typeof(this['rateLimits']) == 'undefined') return;
            if (!this.rateLimits.hasOwnProperty('chat')) return;
            if (!this.rateLimits.chat.attempt()) return;
            
            ch.sendChat(u, msg);
        });

        this.on('n', async msg => { // note
            if (!msg.hasOwnProperty('t')) return;
            if (!msg.hasOwnProperty('n')) return;
            if (msg.t == null) msg.t = Date.now();

            let u = await this.getPublicUser();

            msg.p = u.id;
            let ch = this.getChannel();

            if (!ch) return;
            
            if (!msg.hasOwnProperty('p')) return;
            for (let cl of ch.clients) {
                if (cl !== this) cl.sendArray([msg]);
            }
        });

        this.on('m', async msg => { // mouse
            if (!msg.hasOwnProperty('x')) return;
            if (!msg.hasOwnProperty('y')) return;
            if (msg.t == null) msg.t = Date.now();
            if (!this.hasOwnProperty('rateLimit')) return;
            if (!this.rateLimits.hasOwnProperty('cursor')) return;
            if (!this.rateLimits.cursor.attempt()) return;

            this.cursorPos.x = msg.x;
            this.cursorPos.y = msg.y;

            let u = await this.getPublicUser();
            let ch = this.getChannel();
            if (!ch) return;
            
            ch.sendCursor(u, msg);
        });

        this.on('t', msg => { // time
            this.sendTimeUpdate(msg.e);
        });

        this.on('kickban', (msg, admin) => { // TODO
            this.setChannel("test/awkward");
        });

        this.on('unban', () => { // TODO

        });

        this.on('+ls', () => {
            this.startChannelList();
        });

        this.on('-ls', () => {
            this.stopChannelList();
        });

        this.on('admin message', msg => {
            if (!msg.hasOwnProperty('password')) return;
            if (!msg.hasOwnProperty('msg')) return;

            if (typeof(msg.password) !== 'string') return;
            if (typeof(msg.msg) !== 'object') return;
            
            let password = ADMIN_PASSWORD || config.password;
            if (msg.password !== password) return;
            if (!msg.msg.hasOwnProperty('m')) return;

            this.emit(msg.msg.m, msg.msg, true);
        });

        this.on('notification', (msg, admin) => {
            if (!admin) return;
            console.log('notif test');
        });

        this.on('user_flag', (msg, admin) => {

        });

        this.on('color', (msg, admin) => {

        });
    }

    sendArray(msgs) {
        if (this.ws.readyState == this.ws.CLOSED) return this.emit('bye');
        let str = JSON.stringify(msgs);
        this.ws.send(str, err => {
            if (err) return console.error(err);
        });
    }

    async setUser(set, admin) {
        if (!set.hasOwnProperty('name')) return;

        let user = await this.getUser();
        try {
            let str = set.name;
            if (typeof(str) == 'string') {
                if (set.hasOwnProperty('name')) user.name = set.name;
            }
            if (admin) {
                if (set.hasOwnProperty('color')) user.color = set.color;
            }
            user.save();
            await this.getUser();
            let u = await this.getPublicUser();
            this.getChannel().updateParticipant(u);
        } catch (err) {
            if (err) console.error('no userset bad >:[');
        }
    }

    sendNoteQuota(allowance, max, maxHistLen) {
        this.sendArray([{
            m: 'nq',
            allowance: allowance || 600,
            max: max || 1200,
            maxHistLen: maxHistLen || 3
        }]);
    }

    sendTimeUpdate(echo) {
        this.sendArray([{
            m: 't',
            t: Date.now(),
            e: echo
        }]);
    }

    startChannelList() {
        Channel.listAll(this);

        this.on('lsemit', this.listEmitSubscriber);
    }

    stopChannelList() {
        this.off('lsemit', this.listEmitSubscriber);
    }

    listEmitSubscriber(ch) {
        this.sendArray([{
            m: 'ls',
            c: false,
            u: [{
                _id: ch._id,
                settings: ch.settings,
                crown: ch.crown,
                count: ch.clients.length
            }]
        }]);
    }

    getChannel() {
        return Channel.channels.map[this.channel_id];
    }
}

module.exports = {
    Client
}
