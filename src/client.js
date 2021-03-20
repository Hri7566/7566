const { EventEmitter } = require('events');
const Logger = require('../lib/Logger');

module.exports = class Client extends EventEmitter {
    constructor (bot, client, evtcb, name, context) { // client for thing to connect to and callback for event
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
            
        });
    }
}
