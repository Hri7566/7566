const Command = require('../../lib/Command');
const Registry = require('../../lib/Registry');

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

module.exports = new Command('sell', (msg, bot, context) => {
    let user = bot._bot.getUser(msg);
    if (typeof(user) == 'undefined') return `Transaction failed.`;
    let getItem;

    Object.keys(user.inventory).forEach(id => {
        let i = user.inventory[id];
        if (msg.argcat.toLowerCase() == i.name.toLowerCase()) {
            getItem = i;
        }
    });

    if (typeof(getItem) == 'undefined') {
        return `Could not find item. Is it in your inventory?`;
    } else {
        user.balance += getItem.price;
        if (typeof(user.inventory[getItem.name]) == 'undefined') {
            user.inventory[getItem.name] = getItem;
        } else {
            user.inventory[getItem.name].count -= 1;
        }
        return `${msg.p.name} sold "${getItem.name}" for ${balanceFormat(getItem.price)}. They now have ${balanceFormat(user.balance)}.`;
    }
}, `PREFIXsell <item>`, 1, 0, false, []);
