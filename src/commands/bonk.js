const Command = require('../../lib/Command');

module.exports = new Command('bonk', (msg, bot, context) => {
    let bro = bot._bot.findUser(msg.argcat);
    if (typeof(bro) == 'undefined') return `no!`;

    let hasHammer = false;

    let user = bot._bot.getUser(msg);

    for (let id of Object.keys(user.inventory)) {
        let i = user.inventory[id];
        if (i.count < 0) {
            i = undefined;
            continue;
        }
        if (i.name.toLowerCase() == "hammer") {
            hasHammer = true;
        }
    }

    if (hasHammer) {
        out = `🔨 ${msg.p.name} bonked ${bro.name}!`;
        if (context !== 'discord') return out;
        out = out.split('*').join('\\*');
        out = out.substring(0, 50);
    } else {
        out = `❌ You don't have a hammer! Buy one from the shop to bonk.`;
    }
    return out;
}, `PREFIXbonk <user>`, 1, 0, false, []);
