const { Database } = require('./Database');
const { InventoryItem } = require('./Item');

class InventoryUtil {
    static hasItem(inventory, item) {
        if (!inventory) return false;
        if (!inventory.items) return false;
        if (!inventory.items[item]) return false;
        return true;
    }

    static hasItemFuzzy(inventory, item) {
        if (!inventory) return false;
        if (!inventory.items) return false;
        for (let key in inventory.items) {
            if (key.toLowerCase().includes(item.toLowerCase())) return true;
        }
        return false;
    }

    static getItem(inventory, item) {
        if (!inventory) return null;
        if (!inventory.items) return null;
        if (!inventory.items[item]) return null;
        return inventory.items[item];
    }

    static getItemFuzzy(inventory, item) {
        if (!inventory) return null;
        if (!inventory.items) return null;
        for (let key in inventory.items) {
            if (key.toLowerCase().includes(item.toLowerCase())) return inventory.items[key];
        }
        return null;
    }

    static addItem(inventory, item, amount) {
        if (!inventory) return;
        let item = this.getItem(inventory, item);
        let realItem = InventoryItem.getRealItem(item.name);
        if (typeof amount !== 'number') amount = 1;
        if (inventory.items[item]) inventory.items[item].amount += amount;
    }
}

module.exports = {
    InventoryUtil
}