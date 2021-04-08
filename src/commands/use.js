const Command = require('../../lib/Command');

module.exports = new Command('use', (msg, bot, context) => {
    let user = bot._bot.getUser(msg);
    let item;
    let ret;

    if (typeof(user) == 'undefined') return;

    Object.keys(user.inventory).forEach(name => {
        let i = user.inventory[name];
        if (i.name.toLowerCase() == msg.argcat.toLowerCase()) {
            item = i;
        }
    });

    console.log(item);

    if (item) {
        ret = item.useFunc(msg, bot, context);
    } else {
        ret = `Could not find item. Have you checked your inventory?`;
    }
    return ret;
}, `PREFIXuse <item>`, 1, 0, false, ['u', 'eat']);
