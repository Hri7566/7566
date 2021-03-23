const { EventEmitter } = require('events');
const Logger = require('../lib/Logger');
const Registry = require('../lib/Registry');
const CommandRegister = require('../lib/CommandRegister');
const fs = require('fs');
const path = require('path');

module.exports = class Client extends EventEmitter {
    constructor (bot, client, evtcb, name, context) { // client to connect to and callback for event
        super();
        this.client = client;
        this.prefixes = [];
        this.logger = new Logger(typeof(name) !== 'string' ? typeof(context) !== 'string' ? 'Client' : context : name);
        this.context = context;

        this._bot = bot;

        if (typeof(evtcb) !== 'function') return;
        evtcb(this.client, this);

        this.bindEventListeners();

        bot.prefixes.forEach(p => {
            if (p.attached) {
                this.addPrefix(p.prefix);
            }
        });
    }

    addPrefix(str) {
        if (typeof(str) !== 'string') return;
        this.prefixes.push(str);
    }

    removePrefix(str) {
        if (typeof(str) !== 'string') return;
        let i = this.prefixes.indexOf(str);
        if (i !== -1) this.prefixes.slice(i);
    }

    setPrefixes(arr) {
        if (typeof(arr) !== 'object') return;
        this.prefixes = arr;
    }

    bindEventListeners() {
        this.on('start', () => {
            this.logger.log('Started');
        });

        this.on('stop', () => {
            this.logger.log('Stopped');
        });

        this.on('chat', msg => {
            console.log(`${msg.p._id.substr(0, 6)} | ${msg.p.name}: ${msg.a}`);

            msg.rank = this._bot.getRank(msg);

            Registry.getRegister('commands').data.forEach(nsid => {
                let cmd = Registry.getRegister('commands').data[nsid];
                if (msg.rank._id < cmd.minimumRank || msg.rank._id < 0) return;
                if (msg.prefix.attached) {
                    if (msg.args.length - 2 <= cmd.minimumArguments) return;
                } else {
                    if (msg.args.length - 1 <= cmd.minimumArguments) return;
                }
            });
        });
    }
}
