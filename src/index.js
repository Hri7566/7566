const StaticEventEmitter = require('./StaticEventEmitter.js');
const MPPClient7566 = require("./MPP/MPPClient7566");
const DiscordClient7566 = require("./Discord/DiscordClient7566");
const os = require('os');
const DeferredRegister = require('./DeferredRegister.js');
const { BotIncomingChatMessage, ClientChatMessage } = require('./Message.js');
const fs = require('fs');
const chokidar = require('chokidar');
const { join } = require('path');
const errormsgs = require('./errors');

function nocache(module) {require("fs").watchFile(require("path").resolve(module), () => {delete require.cache[require.resolve(module)]})}

class Bot extends StaticEventEmitter {
    static clients = new DeferredRegister('client');
    static commands = new DeferredRegister('command');
    static prefixes = require('./prefixes');

    static start(roomList) {
        this.bindEventListeners();
        this.loadCommands();
        this.watchCommandFolder();
        // this.startMPPClients(roomList);
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
        const files = fs.readdirSync(join(__dirname, 'Commands'));
        files.forEach(file => {
            try {
                console.log('loading command ' + file);
                delete require.cache[join(__dirname, './Commands', file)];
                let cmd = require(join(__dirname, './Commands', file));
                this.commands.register(cmd.id, cmd);
                console.log('added command ' + cmd.id);
                console.log(cmd.func.toString());
            } catch (err) {
                console.error(`Error loading command ${file}`);
                console.error(err);
            }
        });
    }

    static watchCommandFolder() {
        chokidar.watch(join(__dirname, './commands')).on('change', (path, stats) => {
            this.commands = new DeferredRegister('command');
            for (let i in DeferredRegister.registry) {
                console.log(i);
            }
            this.loadCommands();
        });
    }

    static bindEventListeners() {
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

        DeferredRegister.grab(val => {
            let cmd = val[1];
            if (!cmd) return;

            let canContinue = false;
            for (let a of cmd.accessors) {
                if (msg.cmd == a) {
                    canContinue = true;
                }
            }
            
            if (!canContinue) return;
            
            try {
                let out = cmd.func(msg, client);
                if (out !== null && out !== undefined) {
                    client.emit('send', new ClientChatMessage(out));
                }
            } catch (err) {
                client.sendChat(`An error has occurred. ${errormsgs[Math.floor(Math.random() * errormsgs.length)]}`);
                console.error(err);
            }
        }, "command");
    }
}

module.exports = Bot;
