const Command = require("../Command");

module.exports = new Command('about', ['about', 'a'], `%PREFIX%about`, undefined, (msg, cl) => {
    return `This bot was made by Hri7566#3409.`;
}, 0, 0, false);
