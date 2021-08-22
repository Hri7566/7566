/** ::::::::::: ::::::::::  ::::::::   ::::::::  
 *  :+:     :+: :+:    :+: :+:    :+: :+:    :+: 
 *         +:+  +:+        +:+        +:+        
 *        +#+   +#++:++#+  +#++:++#+  +#++:++#+  
 *       +#+           +#+ +#+    +#+ +#+    +#+ 
 *      #+#     #+#    #+# #+#    #+# #+#    #+# 
 *      ###      ########   ########   ########  
 */

const StaticEventEmitter = require('./StaticEventEmitter.js');
const MPPClient7566 = require("./MPP/MPPClient7566");
const DiscordClient7566 = require("./Discord/DiscordClient7566");
const DeferredRegister = require('./DeferredRegister.js');
const { BotIncomingChatMessage, ClientChatMessage } = require('./Message.js');
const errormsgs = require('./errors');
const { Database } = require('./Database');
const Command = require('./Command.js');
const Logger = require('./Logger.js');
const mppServer = require("./WebSocket/Server.js");

const os = require('os');
const fs = require('fs');
const { join } = require('path');
const chokidar = require('chokidar');

// function nocache(module) {require("fs").watchFile(require("path").resolve(module), () => {delete require.cache[require.resolve(module)]})}

const MPP_ENABLED = process.env.MPP_ENABLED == "true";
const DISCORD_ENABLED = process.env.DISCORD_ENABLED == "true";
const MPP_SERVER_ENABLED = process.env.MPP_SERVER_ENABLED == "true";

class Bot extends StaticEventEmitter {
    static clients = new DeferredRegister('client');
    static commands = new DeferredRegister('command');
    static prefixes = require('./prefixes');
    static started = false;

    static logger = new Logger("Bot");

    static start(roomList) {
        if (this.started) return;
        this.started = true;
        this.bindEventListeners();
        this.loadCommands();
        this.watchCommandFolder();
        if (MPP_ENABLED) this.startMPPClients(roomList);
        if (DISCORD_ENABLED) this.startDiscordClient(process.env.DISCORD_TOKEN);
        if (MPP_SERVER_ENABLED) mppServer.Server.start();
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
        this.logger.log('Loading commands...');
        const files = fs.readdirSync(join(__dirname, 'commands'));
        files.forEach(file => {
            try {
                // console.log('loading command ' + file);
                delete require.cache[join(__dirname, './commands', file)];
                let cmd = require(join(__dirname, './commands', file));
                this.commands.register(cmd.id, cmd);
                // console.log('added command ' + cmd.id);
                // console.log(cmd.func.toString());
            } catch (err) {
                console.error(`Error loading command ${file}`);
                console.error(err);
            }
        });
        this.logger.log('Finished loading commands.');
    }

    static watchCommandFolder() {
        chokidar.watch(join(__dirname, './commands')).on('change', (path, stats) => {
            this.commands = new DeferredRegister('command');
            for (let i in DeferredRegister.registry) {
                // console.log(i);
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

        DeferredRegister.grab(async val => {
            let cmd = val[1];
            if (!cmd) return;

            let canContinue = false;
            for (let a of cmd.accessors) {
                if (msg.cmd == a) {
                    canContinue = true;
                }
            }
            if (!canContinue) return;

            let user = await Database.createUser(msg.p);
            if (user.rank.id < cmd.rank) {
                client.sendChat("You do not have permission to use this command.");
                return;
            }

            if (msg.args.length - 1 < cmd.args) return client.sendChat(`Not enough arguments. Usage: ${Command.getUsage(cmd.usage, msg.usedPrefix.accessor)}`);
            
            try {
                let out = await cmd.func(msg, client, this);
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
