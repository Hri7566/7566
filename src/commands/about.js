const Command = require("../Command");

module.exports = new Command('about', ['about', 'a'], `%PREFIX%about`, undefined, (msg, cl) => {
    return `By Hri7566#3409 with help from Karl © 2018-2022`;
}, 0, 0, false);
