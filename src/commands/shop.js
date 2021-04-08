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

module.exports = new Command('shop', (msg, bot, context) => {
    let ret = "Shop: ";
    let items = Registry.getRegister('item').data;
    Object.keys(items).forEach(id => {
        let item = items[id];
        if (item.inShop)
            ret += ` ${item.name}: ${balanceFormat(item.price)} | `;
    });
    ret = ret.substring(0, ret.length - 2);
    ret = ret.trim();
    return ret;
}, `PREFIXtest`, 0, 0, false, ['s']);
