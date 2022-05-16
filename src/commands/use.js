const Command = require('../Command');
const { Database } = require('../Database');
const { InventoryUtil } = require('../InventoryUtil');
const { InventoryItem } = require('../Item');

module.exports = new Command('use', ['use', 'u'], '%PREFIX%use <item>', 'Use an item.', async (msg, cl, bot) => {
    let inventory = await Database.createInventory(msg.p._id);
    let item = InventoryUtil.getItemFuzzy(inventory, msg.argcat);
    if (!item) return `You don't have that item.`;

    let realItem = InventoryItem.getRealItem(item.name);
    if (!realItem) return `Apparently, this item has no code.`;

    let out = await realItem.use(msg, cl, bot);
    if (out) return out;
    return `${item.name} is not usable.`;
}, 1, 4, false);
