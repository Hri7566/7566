
const { Console } = require("console");
const EventEmitter = require("events");

class Logger extends EventEmitter {
    constructor(id) {
        super();

        this.id = id;

        this.on('log', str => {
            this.log(str);
        });

        this.on('error', str => {
            this.error(str);
        });

        this.on('warn', str => {
            this.warn(str);
        });
    }

    log(...args) {
        console.log(`[${this.id}]`, ...args);
    }

    error(...args) {
        console.error(`[ERR] [${this.id}]`, ...args)
    }

    warn(...args) {
        console.warn(`[WARN] [${this.id}]`, ...args);
    }
}

module.exports = Logger;
