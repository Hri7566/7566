const Command = require("../Command");
const { Database } = require("../Database");
const { InventoryUtil } = require("../InventoryUtil");
const { InventoryItem } = require("../Item");

module.exports = new Command('hiddenitemtest', ['hiddenitemtest'], undefined, undefined, (msg, cl) => {
    let inventory = Database.createInventory(msg.p._id);
    let realItem = InventoryItem.getRealItem
}, 0, 0, false);
