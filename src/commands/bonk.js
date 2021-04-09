const Command = require('../../lib/Command');

module.exports = new Command('bonk', (msg, bot, context) => {
    let bro = bot._bot.findUser(msg.argcat);
    if (typeof(bro) == 'undefined') return `no!`;
    out = `🔨 ${msg.p.name} bonked ${bro.name}!`;
    if (context !== 'discord') return out;
    out = out.split('*').join('\\*');
    out = out.substring(0, 50);
    return out;
}, `PREFIXbonk <string>`, 1, 0, false, []);
