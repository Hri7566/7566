const chalk = require('chalk');

module.exports = class Logger {
    constructor (context) {
        this.context = context;
    }

    log(str) {
        console.log(`${chalk.green('[' + this.context + ']')} ${str}`);
    }

    warn(str) {
        console.warn(`${chalk.yellow('[WARN]' + '[' + this.context + ']')} ${str}`);
    }

    error(str) {
        console.error(`${chalk.red('[ERROR] ' + '[' + this.context + ']')} ${str}`);
    }

    debug(...args) {
        if (process.env.DEBUG) {
            args.forEach(arg => {
                console.log(arg);
            });
        }
    }
}