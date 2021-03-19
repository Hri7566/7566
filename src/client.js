const { EventEmitter } = require('events');
const Logger = require('../lib/Logger');

module.exports = class Client extends EventEmitter {
    constructor (client, evtcb, name) { // client for thing to connect to and callback for event
        super();
        this.client = client;
        this.logger = new Logger(typeof(name) !== 'string' ? 'Client' : name);

        if (typeof(evtcb) !== 'function') return;
        evtcb(this.client, this);

        this.bindEventListeners();
    }

    bindEventListeners() {
        this.on('start', () => {
            this.logger.log('Started');
        });

        this.on('stop', () => {
            this.logger.log('Stopped');
        });
    }
}
