const chalk = require('chalk');

class Logger {
    constructor(id, color) {
        this.id = id;
        this.color = color || chalk.blue;
    }

    log(...args) {
        console.log(chalk.bgBlue(`INFO`), this.color(this.id), ...args);
    }

    error(...args) {
        console.error(chalk.bgRed(`ERR`), this.color(this.id), ...args)
    }

    warn(...args) {
        console.warn(chalk.bgYellow(`WARN`), this.color(this.id), ...args);
    }
}

module.exports = Logger;
