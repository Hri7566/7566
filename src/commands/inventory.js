const Command = require("../Command");
const { Database } = require("../Database");
const Balance = require('../Balance');

module.exports = new Command('inventory', ['inventory', 'inv', 'i'], `%PREFIX%inventory`, `List items in your inventory`, async (msg, cl, bot) => {
    let inv = await Database.createInventory(msg.p._id);
    let str = "Inventory: ";
    let len = 0;
    try {
        len = Object.keys(inv.items).length;
    } catch (err) {
        // retardism!!!!!
    }
    if (len === 0) {
        str += "(empty)";
    } else {
        for (let i of Object.keys(inv.items)) {
            str += `${inv.items[i].name} (x${inv.items[i].amount}), `;
        }
        str = str.substr(0, str.length - 2).trim();;
    }
    return str;
}, 0, 0, false);
