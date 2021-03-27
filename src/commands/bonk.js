const Command = require('../../lib/Command');
const Filter = require('bad-words');

let filter = new Filter();

module.exports = new Command('bonk', (msg, bot, context) => {
    let out = `${filter.clean(msg.argcat)}`
    out = `🔨 ${msg.p.name} bonked ${out}!`;
    if (context !== 'discord') return out;
    out = out.split('*').join('\\*');
    out = out.substring(0, 50);
    return out;
}, `PREFIXbonk <string>`, 1, 0, false, []);
