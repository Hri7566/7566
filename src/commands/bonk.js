const Command = require('../../lib/Command');

module.exports = new Command('bonk', (msg, bot, context) => {
    let bro = bot._bot.getUserByAny(msg.argcat).name;
    if (typeof(bro) == 'undefined') return `Couldn't bonk! User is undefined! bonk crASHHH!!!!!`;
    out = `🔨 ${msg.p.name} bonked ${bro}!`;
    if (context !== 'discord') return out;
    out = out.split('*').join('\\*');
    out = out.substring(0, 50);
    return out;
}, `PREFIXbonk <string>`, 1, 0, false, []);
