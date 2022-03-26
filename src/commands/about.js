const Command = require("../Command");

module.exports = new Command('about', ['about', 'a'], `%PREFIX%about`, undefined, (msg, cl) => {
    const currentYear = new Date().getFullYear();
    return `© The Dev Channel, Hri7566 2018-${currentYear}`;
}, 0, 0, false);
