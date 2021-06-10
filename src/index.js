const StaticEventEmitter = require('./StaticEventEmitter.js');
const MPPClient7566 = require("./MPP/MPPClient7566");
const DiscordClient7566 = require("./Discord/DiscordClient7566");
const os = require('os');
const DeferredRegister = require('./DeferredRegister.js');

class Bot extends StaticEventEmitter {
    static clients = new DeferredRegister('client');

    static start(roomList) {
        this.bindEventListeners();
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

    static bindEventListeners() {
        this.on('chat', msg => {
            console.log(msg);
        });

        return this;
    }

    static startDiscordClient(token) {
        let cl = new DiscordClient7566(token);
        this.clients.register('discord', cl);
        return cl;
    }
}

module.exports = Bot;
