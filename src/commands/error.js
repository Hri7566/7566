const Command = require("../Command");

module.exports = new Command('error', ['error'], undefined, undefined, (msg, cl) => {
    throw '';
}, 0, 0, true);
