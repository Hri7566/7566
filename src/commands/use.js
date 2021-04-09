const Command = require('../../lib/Command');
const Registry = require('../../lib/Registry');

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

    if (item) {
        for (let key in Registry.getRegister('item').data) {
            let i = Registry.getRegister('item').data[key];
            if (item.name == i.name) {
                ret = i.useFunc(msg, bot, context);
            }
        }
    } else {
        ret = `Could not find item. Have you checked your inventory?`;
    }
    return ret;
}, `PREFIXuse <item>`, 1, 0, false, ['u', 'eat']);
