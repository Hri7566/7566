const StaticEventEmitter = require('./StaticEventEmitter.js');
const MPPClient7566 = require("./MPP/MPPClient7566");

class Bot extends StaticEventEmitter {
    static clients = new Map();

    static start(roomList) {
        this.bindEventListeners();
        this.startMPPClients(roomList);
    }

    static startMPPClients(list) {
        for (let i of Object.keys(list)) {
            this.startMPPClient(list[i].uri, list[i]._id);
        }
    }

    static startMPPClient(uri, room) {
        let cl = new MPPClient7566(uri, room, process.env.MPPCPASSWORD, undefined);
        this.clients.set(uri+room, cl);
        return cl;
    }

    static bindEventListeners() {
        this.on('chat', msg => {
            
        });

        return this;
    }
}

module.exports = Bot;
