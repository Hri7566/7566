const Command = require('../../lib/Command');

module.exports = new Command('use', (msg, bot, context) => {
    let user = bot._bot.getUser(msg);
    let item;
    let ret;

    Object.keys(user.inventory).forEach(name => {
        if (user.inventory[name].name.toLowerCase() == msg.argcat.toLowerCase()) {
            item = user.inventory[name];
        }
    });

    if (item) {
        ret = item.useFunc(msg, bot, context);
    } else {
        ret = `Could not find item. Have you checked your inventory?`;
    }
    return ret;
}, `PREFIXuse <item>`, 1, 0, false, ['u', 'eat']);
