const Command = require('../../lib/Command');
const Registry = require('../../lib/Registry');

module.exports = new Command('sell', (msg, bot, context) => {
    let user = bot._bot.getUser(msg);
    if (typeof(user) == 'undefined') return `Transaction failed.`;
    let getItem;

    let hasNum;
    let sellNum = 1;

    if (!isNaN(parseInt(msg.args[msg.args.length-1]))) {
        hasNum = true;
        sellNum = parseInt(msg.args[msg.args.length-1]);
    }

    let itemStr = msg.argcat;

    if (hasNum) {
        itemStr = msg.argcat.substr(0, msg.argcat.indexOf(msg.args[msg.args.length-1]));
    }
    
    itemStr = itemStr.trim();

    for (let id of Object.keys(user.inventory)) {
        let i = user.inventory[id];
        if (i.count < 0) {
            i = undefined;
            continue;
        }
        if (itemStr.toLowerCase() == i.name.toLowerCase()) {
            getItem = i;
        }
    }

    if (typeof(getItem) == 'undefined') {
        return `❌ Could not find item. Is it in your inventory?`;
    } else {
        if (sellNum > getItem.count) sellNum = getItem.count;
        user.balance += getItem.price * sellNum;
        if (typeof(user.inventory[getItem.name]) == 'undefined') {
            user.inventory[getItem.name] = getItem;
        } else {
            user.inventory[getItem.name].count -= sellNum;
        }
        return `✔️ ${msg.p.name} sold ${sellNum} "${getItem.name}" for ${bot._bot.balanceFormat(getItem.price * sellNum)} (${bot._bot.balanceFormat(getItem.price)} a piece). They now have ${bot._bot.balanceFormat(user.balance)}.`;
    }
}, `PREFIXsell <item>`, 1, 0, false, []);
