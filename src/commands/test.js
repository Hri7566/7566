const Command = require('../../lib/Command');

module.exports = new Command('test', (msg, bot, context) => {
    let ret = `test!`;
    if (msg.args[1]) {
        ret += ` args: ${msg.args.join(' | ')}`;
    }
    return ret;
}, `PREFIXtest`, 0, 0, false, []);
