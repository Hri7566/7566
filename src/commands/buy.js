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

module.exports = new Command('buy', (msg, bot, context) => {
    let getItem;
    let items = Registry.getRegister('item').data;

    Object.keys(items).forEach(id => {
        let item = items[id];
        if (msg.argcat.toLowerCase() == item.name.toLowerCase()) {
            getItem = item;
        }
    });

    if (typeof(getItem) == 'undefined') {
        return `Could not find item. Is it in the shop?`;
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
}, `PREFIXbuy <item>`, 1, 0, false, []);
