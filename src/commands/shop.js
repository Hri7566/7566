const Command = require("../Command");

module.exports = new Command('shop', ['shop'], `%PREFIX%shop`, undefined, (msg, cl) => {
    return 'unfinished :(';
}, 0, 0, true);
