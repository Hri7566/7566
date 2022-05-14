const Command = require("../Command");

module.exports = new Command('say', ['say'], `%PREFIX%say`, `Make the bot say something.`, async (msg, cl) => {
    return msg.argcat;
}, 0, 0, false);
