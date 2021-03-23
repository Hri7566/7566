const Command = require('../../lib/Command');

module.exports = new Command('test', (msg, bot, context) => {
    return `test!`;
}, `PREFIXtest`, 0, 0, false, []);