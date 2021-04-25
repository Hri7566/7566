const { EventEmitter } = require('events');
const Logger = require('../lib/Logger');
const Registry = require('../lib/Registry');
const CommandRegister = require('../lib/CommandRegister');
const Command = require('../lib/Command');
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
            this.logger.log(`${msg.p._id.substr(0, 6)} | ${msg.p.name}: ${msg.a}`);
            
            msg.user = this._bot.getUser(msg);
            msg.rank = this._bot.getRank(msg);

            Object.keys(Registry.getRegister('command').data).forEach(nsid => {
                let cmd = Registry.getRegister('command').data[nsid];
                let cont = false;
                
                cmd.aliases.forEach(alias => {
                    if (msg.cmd == alias) cont = true;
                });
                
                if (msg.cmd == cmd.name) {
                    cont = true
                };
                
                if (cont) {
                    if (msg.rank._id < cmd.minimumRank || msg.rank._id < 0) return this.sendChat('Permission denied.');
                    if (msg.args.length - 1 < cmd.minimumArguments) return this.sendChat(`Not enough arguments. Usage: ${Command.getExample(cmd, msg.prefix)}`);
                    let out;
                    try {
                        out = cmd.func(msg, this, msg.context);
                    } catch (err) {
                        out = 'Error; Try again or bug Hri7566';
                        this.logger.error(err);
                        this.logger.debug(err);
                    }
                    if (out !== null && typeof(out) !== 'undefined' && out !== '') {
                        this.sendChat(out);
                    }
                }
            });
        });
    }

    sendChat(str) {
        return;
    }
}
