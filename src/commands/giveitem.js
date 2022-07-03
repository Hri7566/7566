const Command = require("../Command");
const { Database } = require("../Database");
const { InventoryUtil } = require("../InventoryUtil");
const { Item, InventoryItem } = require('../Item');

module.exports = new Command('giveitem', ['giveitem'], `%PREFIX%giveitem <id> <item>`, `Give an item to someone`, async (msg, cl) => {
    let inventory = await Database.getInventory(msg.args[1]);
    if (!inventory) return 'Could not find inventory.';

    let item = InventoryItem.getRealItem(msg.args[2]);
    console.log(item);
    if (item == null || !item) return 'Could not find item.';

    InventoryUtil.addItem(inventory, item, 1);
    inventory.save();
}, 2, 4, true);
