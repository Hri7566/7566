const Command = require('../../lib/Command');

module.exports = new Command('about', (msg, bot, context) => {
    return "This bot was made by Hri7566#3409. GitLab: https://gitlab.com/Hri7566/7566";
}, `PREFIXabout`, 0, 0, false, ['a']);
