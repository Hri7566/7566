const Command = require("../Command");

module.exports = new Command('about', ['about', 'a'], `%PREFIX%about`, undefined, (msg, cl) => {
    const currentYear = new Date().getFullYear();
    return `This bot was made by Hri7566. Join the Dev Channel here: https://discord.gg/SW4bJXeSS8 | Source code: https://gitlab.com/Hri7566/7566 | 7566 © The Dev Channel, Hri7566 2018-${currentYear}`;
}, 0, 0, false);
