const Command = require("../Command");

module.exports = new Command('testicles', ['test'], undefined, undefined, (msg, cl) => {
    return "test";
}, 0, 0, false);
