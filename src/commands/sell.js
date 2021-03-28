const Command = require('../../lib/Command');
const Shop = require('../Shop');

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

module.exports = new Command('buy', (msg, bot, context) => {
    let getItem;
    if (typeof(getItem) == 'undefined') {
        return `Could not find item. Is it in your inventory?`;
    } else {
        let user = bot._bot.getUser(msg);
        if (typeof(user) == 'undefined') return `Transaction failed.`;
        user.balance -= getItem.price;
        if (typeof(user.inventory[getItem.name]) == 'undefined') {
            user.inventory[getItem.name] = getItem;
        } else {
            user.inventory[getItem.name].count += 1;
        }
        return `${msg.p.name} bought "${getItem.name}" for ${balanceFormat(getItem.price)}. They now have ${balanceFormat(user.balance)}.`;
    }
}, `PREFIXtest`, 0, 0, false, []);
