const Command = require('../../lib/Command');

let currencySymbol = "H$";
let currencyStyle = "`${symbol}${amt}`"

function balanceFormat(b) {
    try {
        let amt = b;
        let symbol = currencySymbol;
        let parsed = eval(currencyStyle);
        return parsed;
    } catch (err) {
        if (err) {
            console.error(err);
            return "MISSINGNO.";
        }
    }
}

module.exports = new Command('balance', (msg, bot, context) => {
    let user = bot._bot.getUser(msg);
    let invstr = "";
    let out = `${user.name}, you have ${balanceFormat(user.balance)}.`;
    let hasInv = false;
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

    if (!hasInv) {
        return out;
    } else {
        invstr = invstr.substring(0, invstr.length - 2);
        invstr = invstr.trim();
        return out + ` Inventory: ${invstr}`;
    }
}, `PREFIXbalance`, 0, 0, false, ['bal','money','b','inv','i','inventory']);
