const { Console } = require("node:console");

class Logger extends Console {
    constructor (...args) {
        super(args);
    }
}

module.exports = Logger;
