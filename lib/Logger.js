const chalk = require('chalk');

module.exports = class Logger {
    constructor (context) {
        this.context = context;
    }

    log(str) {
        console.log(`[${this.context}] ${str}`);
    }

    warn(str) {
        console.warn(`[WARNING] [${this.context}] ${str}`);
    }

    error(str) {
        console.error(`[ERROR] [${this.context}] ${str}`);
    }
}