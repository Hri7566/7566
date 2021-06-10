const StaticEventEmitter = require('./StaticEventEmitter.js');
const MPPClient7566 = require("./MPP/MPPClient7566");
const DiscordClient7566 = require("./Discord/DiscordClient7566");
const os = require('os');
const DeferredRegister = require('./DeferredRegister.js');
const { BotIncomingChatMessage } = require('./Message.js');
const { readdirSync } = require('fs');
const { join } = require('path');
const errormsgs = require('./errors');

class Bot extends StaticEventEmitter {
    static clients = new DeferredRegister('client');
    static commands = new DeferredRegister('command');
    static prefixes = require('./prefixes');

    static start(roomList) {
        this.bindEventListeners();
        this.loadCommands();
        this.startMPPClients(roomList);
        this.startDiscordClient(process.env.DISCORD_TOKEN);
    }

    static startMPPClients(list) {
        for (let i of Object.keys(list)) {
            this.startMPPClient(list[i].uri, list[i]._id);
        }
    }

    static startMPPClient(uri, room) {
        let cl = new MPPClient7566(uri, room, process.env.MPPCPASSWORD, undefined);
        this.clients.register(uri+room, cl);
        return cl;
    }

    static loadCommands() {
        const files = readdirSync(join(__dirname, 'Commands'));
        files.forEach(file => {
            try {
                let cmd = require(join(__dirname, './Commands', file));
                this.commands.register(cmd.id, cmd);
            } catch (err) {
                console.error(`Error loading command ${file}`);
            }
        });
    }

    static bindEventListeners() {
        this.on('chat', msg => {
            console.log(msg);
        });

        this.on('receive', (msg, client) => {
            if (!msg.hasOwnProperty('m')) return;

            switch (msg.m) {
                case 'a':
                    this.handleChatMessage(msg, client);
                    break;
            }
        });

        return this;
    }

    static startDiscordClient(token) {
        let cl = new DiscordClient7566(token);
        this.clients.register('discord', cl);
        return cl;
    }

    static handleChatMessage(msg, client) {
        msg = new BotIncomingChatMessage(msg);
        if (!msg.hasOwnProperty('usedPrefix')) return;

        for (let val of DeferredRegister.registry) {
            if (!val[0].startsWith('command')) continue;
            let cmd = val[1];
            if (!cmd) continue;

            let canContinue = false;
            for (let a of cmd.accessors) {
                if (msg.cmd == a) {
                    canContinue = true;
                }
            }
            
            if (!canContinue) continue;
            
            try {
                let out = cmd.func(msg, client);
                if (out !== null && out !== undefined) {
                    client.sendChat(`\u034f${out}`);
                }
            } catch (err) {
                client.sendChat(`An error has occurred. ${errormsgs[Math.floor(Math.random() * errormsgs.length)]}`);
                console.error(err);
            }
        }
    }
}

module.exports = Bot;
