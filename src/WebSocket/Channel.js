const config = require("../config");
const DeferredRegister = require('../DeferredRegister');
const { EventEmitter } = require('events');
const { Database } = require("../Database");
const { RateLimitChain } = require("./RateLimit");
const { Crypto } = require("./Crypto");

class Channel extends EventEmitter {
    static channels = new DeferredRegister('channel');

    static listSubscribers = [];

    static banned_words = [
        "AMIGHTYWIND",
        "CHECKLYHQ"
    ]

    static listAll(cl) {
        cl.sendArray([{
            m: 'ls',
            c: true,
            u: this.getAllPublicChannels()
        }]);
    }

    static getAllPublicChannels() {
        let arr = [];

        for (let val of DeferredRegister.registry) {
            if (val[0].startsWith('channel')) {
                let ch = val[1];
                if (!ch) continue;
                if (ch.settings.visible == false) continue;
                arr.push({
                    _id: ch._id,
                    settings: ch.settings,
                    crown: ch.crown,
                    count: ch.clients.length
                });
            }
        }

        return arr;
    }

    static updateListSubscribers(ch) {
        for (let cl of this.listSubscribers) {
            cl.emit('lsemit', ch);
        }
    }

    constructor (_id, set) {
        super();
        this._id = _id;
        Channel.channels.register(this._id, this);

        console.log(`Creating room ${_id}`);

        this.clients = [];
        this.chatMessages = [];
        this.settings = new ChannelSettings(set, this.isLobby());

        this.noteQuota = {
            allowance: 400,
            max: 1200,
            maxHistLen: 3
        }

        this.rateLimits = {
            chat: new RateLimitChain(4, 4000),
            note: new RateLimitChain(600, 1800),
            cursor: new RateLimitChain(20, 1000)
        }

        if (this.isLobby) {
            this.noteQuota = {
                allowance: 200,
                max: 600,
                maxHistLen: 3
            }
        } else {
            this.noteQuota.crown = {
                allowance: 600,
                max: 1800,
                maxHistLen: 3
            }

            this.rateLimits.chat.crown = new RateLimitChain(10, 4000);
        }

        this.bind();
        // this.loadChat();
    }

    bind() {
        this.on('chat', msg => {
            // Database.setChat(this._id, this.chatMessages);
        });
    }
    
    // async loadChat() {
    //     let jmsgs = await Database.getChat(this._id);
    //     if (!jmsgs) return;
    //     try {
    //         this.chatMessages = JSON.parse(jmsgs);
    //         for (let cl of this.clients) {
    //             let m = [{
    //                 m: 'c',
    //                 c: this.chatMessages
    //             }];
    //             cl.sendArray(m);
    //         }
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }

    async update(cl) {
        let ppl = [];

        for await (let cl of this.clients) {
            let u = await cl.getPublicUser();
            ppl.push(u);
        }

        if (this.clients.length <= 0) {
            console.log(`Deleting room ${this._id}`);
            this.destroy();
            return;
        }

        if (!cl) {
            this.clients.forEach(async cl => {
                let u = await cl.getPublicUser();
                cl.sendArray([{
                    m: 'ch',
                    p: cl.id,
                    ch: {
                        _id: this._id,
                        count: this.clients.length,
                        settings: this.settings,
                        crown: this.crown
                    },
                    ppl: ppl
                }]);
            });
        } else {
            cl.sendArray([{
                m: 'ch',
                p: cl.id,
                ch: {
                    _id: this._id,
                    count: this.clients.length,
                    settings: this.settings,
                    crown: this.crown
                },
                ppl: ppl
            }]);
        }

        Channel.updateListSubscribers(this);
    }

    async updateParticipant(u) {
        this.sendArray([{
            m: 'p',
            _id: u._id,
            name: u.name,
            id: u.id,
            color: u.color
        }]);
    }

    async addParticipant(cl) {
        if (!cl) return;
        
        let u = await cl.getPublicUser();

        let found = false;

        for await (let c of this.clients) {
            let cu = await c.getPublicUser();
            if (cu._id !== u._id) continue;
            cl.id = found.id;
            cl.setRateLimits(found.rateLimits);
            found = true;
        }

        if (!found) {
            this.clients.push(cl);
        }
        
        cl.sendArray([{
            m: 'c',
            c: this.chatMessages
        }]);
        
        if (this.clients.length <= 1) {
            cl.id = Crypto.getNowID();
            await cl.getPublicUser();
            this.updateParticipant(u);
            if (!this.isLobby()) this.crown = new Crown(u._id, cl.id);
        }
        
        // this.update();
        this.update(cl);
        this.updateParticipant(u);
        this.sendNoteQuota(cl);
    }

    removeParticipant(cl) {
        if (!cl) return;
        this.clients.splice(this.clients.indexOf(cl), 1);
        this.update();
    }

    sendNoteQuota(cl) {
        if (!this.isLobby) {
            if (cl.id == this.crown.participantId) {
                cl.sendNoteQuota(this.noteQuota.crown.allowance, this.noteQuota.crown.max, this.noteQuota.crown.maxHistLen);
            } else {
                cl.sendNoteQuota(this.noteQuota.allowance, this.noteQuota.max, this.noteQuota.maxHistLen);
            }
        } else {
            cl.sendNoteQuota(this.noteQuota.allowance, this.noteQuota.max, this.noteQuota.maxHistLen);
        }
    }

    sendChat(u, msg) {
        if (this.settings.chat == false) return;

        let message = msg.message.replace(/\p{C}+/gu, '').replace(/(\p{Mc}{5})\p{Mc}+/gu, '$1').trim();

        if (message.length > 512 && message.length < 1) return;

        let m = {
            m: 'a',
            t: Date.now(),
            p: u,
            a: message
        }

        this.sendArray([m]);
        this.chatMessages.push(m);
        this.emit('chat', m);
    }

    sendCursor(u, msg) {
        msg.id = u.id;
        for (let cl of this.clients) {
            if (cl.id !== u.id) cl.sendArray([msg]);
        }
    }

    async giveCrown(id, u, admin) { // TODO fix asap
        if (!u) return;
        if (!admin && this.isLobby()) return;

        console.log("can chown: " + this.canChown(u));

        let cluser;

        if (id) {
            for await (let cl of this.clients) {
                if (cl.id == id) {
                    cluser = await cl.getUser();
                }
            }
        }
        
        if ((!this.isLobby() && this.canChown(u) && !admin) || (this.isLobby() && admin)) {
            if (!cluser) {
                delete this.crown.participantId;
                this.crown.time = Date.now();
            } else {
                this.crown = new Crown(cluser._id, id);
                console.log('test: ' + (this.crown.participantId == cluser.id));
            }
            this.update();
        }
    }

    canChown(u) {
        if (this.isLobby()) return false;

        if (this.crown.hasOwnProperty('participantId')) {
            if (u._id !== this.crown.userId) return false;
            return true;
        } else {
            if (u._id == this.crown.userId) return true;
            if (Date.now() < this.crown.time + 15000) return false;
            return true;
        }

    }

    removeCrown() {
        delete this.crown;
        this.update();
    }

    destroy() {
        Channel.channels.deregister(this._id);
        DeferredRegister.registry.delete(`channel:${this._id}`);
        this.chatMessages = [];
        Database.setChat(this._id, this.chatMessages);
    }

    isLobby() {
        let out = false;
        if ((this._id.startsWith("test/") && this._id !== "test/")) out = true;
        if (this._id.startsWith("lobby") && !isNaN(parseInt(this._id.substr("lobby".length)))) out = true;
        if (this._id == 'lobby') out = true;
        return out;
    }

    sendArray(arr) {
        for (let cl of this.clients) {
            cl.sendArray(arr);
        }
    }

    applySettings(set, admin) {
        this.settings.apply(set, admin);
        this.update();
    }
}

class Crown {
    constructor (_id, id) {
        this.userId = _id;
        this.participantId = id;
        
        this.time = Date.now();

        let cl = DeferredRegister.registry.get(`client:${id}`);
        
        this.startPos = {
            x: 50,
            y: 50
        }

        this.endPos = {
            x: (Math.random()*80) + 10,
            y: (Math.random()*80) + 10
        }
    }
}

class ChannelSettings {
    static VALID = {
        "lobby": "boolean",
        "visible": "boolean",
        "chat": "boolean",
        "crownsolo": "boolean",
        "no cussing": "boolean",
        "lyrical notes": "boolean",
        "color": function(val) {
            return typeof val === "string" && val.match(/^#[0-9a-f]{6}$/i);
        },
        "color2": function(val) {
            return typeof val === "string" && val.match(/^#[0-9a-f]{6}$/i);
        },
        "owner_id": "string"
    }

    constructor (set, isLobby, admin) {
        if (isLobby) {
            this['lobby'] = true;
            this['color'] = '#73b3cc';
            this['color2'] = '#273546';
            this['visible'] = true;
            this['chat'] = true;
        }
        
        if (!isLobby && !admin) {
            for (let key of Object.keys(config.defaults.channelSettings)) {
                let value = config.defaults.channelSettings[key];
                this[key] = value;
            }

            for (let key of Object.keys(set)) {
                if (key == 'lobby' && !admin) continue;
                if (key == 'owner_id' && !admin) continue;
                if (key == 'lyrical notes' && !admin) continue;

                if (typeof(ChannelSettings.VALID[key]) == 'function') {
                    if (ChannelSettings.VALID[key](set[key])) {
                        this[key] = set[key];
                        if (key == "color" && !set.hasOwnProperty('color2')) set.color2 = ChannelSettings.reduceColor(set.color);
                        continue;
                    }
                } else if (typeof(set[key]) == ChannelSettings.VALID[key]) {
                    this[key] = set[key];
                    continue;
                }
            }
        }
    }

    static reduceColor(color) {
        let res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        let rgb = [parseInt(res[1], 16), parseInt(res[2], 16), parseInt(res[3], 16)];

        for (let i = 0; i < rgb.length; i++) {
            rgb[i] = Math.max(0, rgb[i] - 64);
        }

        return `#${rgb[0].toString(16).length == 1 ? "0" + rgb[0].toString(16) : rgb[0].toString(16)}${rgb[1].toString(16).length == 1 ? "0" + rgb[1].toString(16) : rgb[1].toString(16)}${rgb[2].toString(16).length == 1 ? "0" + rgb[2].toString(16) : rgb[2].toString(16)}`;
    }

    static parse(set) {
        let out = {};

        // for (let key of Object.keys(config.defaults.channelSettings)) {
        //     let value = config.defaults.channelSettings[key];
        //     out[key] = value;
        // }

        for (let key of Object.keys(set)) {
            if (typeof(ChannelSettings.VALID[key]) == 'function') {
                if (ChannelSettings.VALID[key](set[key])) {
                    out[key] = set[key];
                    if (key == "color" && !set.hasOwnProperty('color2')) set.color2 = ChannelSettings.reduceColor(set.color);
                    continue;
                }
            } else if (typeof(set[key]) == ChannelSettings.VALID[key]) {
                out[key] = set[key];
                continue;
            }
        }

        return out;
    }

    apply(set, admin) {
        if (set.hasOwnProperty('color2')) {
            if (set.color2 == this['color2']) {
                set['color2'] = ChannelSettings.reduceColor(set.color);
                this['color2'] = ChannelSettings.reduceColor(set.color);
            }
        }

        // for (let key of Object.keys(config.defaults.channelSettings)) {
        //     let value = config.defaults.channelSettings[key];
        //     this[key] = value;
        // }

        for (let key of Object.keys(set)) {
            if (key == 'lobby' && !admin) continue;
            if (key == 'owner_id' && !admin) continue;
            if (key == 'lyrical notes' && !admin) continue;


            if (typeof(ChannelSettings.VALID[key]) == 'function') {
                if (ChannelSettings.VALID[key](set[key])) {
                    this[key] = set[key];
                    if (key == "color" && !set.hasOwnProperty('color2')) this['color2'] = ChannelSettings.reduceColor(set.color);
                    continue;
                }
            } else if (typeof(set[key]) == ChannelSettings.VALID[key]) {
                this[key] = set[key];
                continue;
            }
        }
    }
}

module.exports = {
    Channel,
    Crown,
    ChannelSettings
}
