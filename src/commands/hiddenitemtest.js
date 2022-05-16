const Command = require("../Command");
const { Database } = require("../Database");
const { InventoryUtil } = require("../InventoryUtil");
const { InventoryItem } = require("../Item");

module.exports = new Command('hiddenitemtest', ['hiddenitemtest'], undefined, undefined, (msg, cl) => {
    
}, 0, 0, false);
