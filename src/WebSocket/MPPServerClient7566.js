const Client7566 = require('../Client7566');
const Vector2 = require('../../Geometry/Vector2');
const { ClientChatMessage, ServerChatMessage } = require('../Message');
const { Server } = require('./Server');

class MPPServerClient7566 extends Client7566 {
    constructor () {
        super('mpp-server');
        this.bindServerEventListeners();
    }
    
    bindEventListeners() {
        super.bindEventListeners();

        this.on('send', msg => {
            this.sendChat(msg.message);
        });
    }

    bindServerEventListeners() {

        this.client.on('a', msg => {
            if (!msg.hasOwnProperty('m')) return;
            if (msg.m !== 'a') return;
            let m = new ServerChatMessage(msg.a, msg.p);

            this.emit('receive', m, this);
        });
    }

    userset(set) {
        if (!set) set = {name:"7566", color:"#8d3f50"};
        this.client.sendArray([{m:"userset", set:set}])
    }

    sendChat(txt) {
        super.sendChat(txt);
        this.client.sendArray([new ClientChatMessage(txt)]);
    }
}

module.exports = MPPServerClient7566;
