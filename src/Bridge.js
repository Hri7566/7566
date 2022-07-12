const { Client7566 } = './Client7566';
const DeferredRegister = require('./DeferredRegister');

const EventEmitter = require('events');

class Bridge extends EventEmitter {
    static bridges = new DeferredRegister('bridge');

    /**
     * Client chat bridge
     * @param {string} id Bridge ID
     * @param {Array<Client7566>} clients List of clients to bridge
     */
    constructor (id, clients) {
        super();
        this.id = id;

        this.clients = clients || [];

        Bridge.bridges.register(this.id, this);

        this.bindEventListeners();
    }

    bindEventListeners() {
        this.on('chat', (a, cl) => {
            for (let c of this.clients) {
                // if (!c) return;
                if (c.id == cl.id) continue;
                // console.log(a)
                c.sendChat(a);
            }
        });

        for (let c of this.clients) {
            c.on('receive', (msg, cl, self) => {
                if (self == true) return;

                if (!msg.hasOwnProperty('a')) msg.a = msg.message;
                let a = `[Phone] ${msg.p._id.substr(0, 6)} ${msg.p.name}: ${msg.a}`
                this.emit('chat', a, cl);
            });
        }
    }
}

module.exports = {
    Bridge
}
