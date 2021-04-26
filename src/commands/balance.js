const Command = require('../../lib/Command');

let currencySymbol = "H$";
let currencyStyle = "`${symbol}${amt}`"

module.exports = new Command('balance', (msg, bot, context) => {
    let user = bot._bot.getUser(msg);
    let invstr = "";
    let out = `${user.name}, you have ${bot._bot.balanceFormat(user.balance)}.`;
    let hasInv = false;

    let hasExp = user.experience !== 0;

    if (hasExp) {
        out += ` You have ${user.experience} experience.`
    }
    
    Object.keys(user.inventory).forEach(key => {
        if (typeof(user.inventory[key]) !== 'undefined') {
            hasInv = true;
        }
        if (hasInv) {
            let item = user.inventory[key];
            if (item.count < 1) {
                user.inventory[key] = undefined;
            }
            if (item.count < 2) {
                invstr += `${item.name} | `
            } else {
                invstr += `${item.name} (x${item.count}) | `;
            }
        }
    });

    if (hasInv) {
        invstr = invstr.substring(0, invstr.length - 2);
        invstr = invstr.trim();
        out += ` Inventory: ${invstr}`;
    }

    return out;
}, `PREFIXbalance`, 0, 0, false, ['bal','money','b','inv','i','inventory','experience','exp']);
