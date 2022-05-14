const itemPriceList = require('./itemPriceList');

class Item {
    constructor (name, amount) {
        this.name = name;
        this.amount = amount;
    }

    static getPriceListing(item) {
        return itemPriceList[item];
    }
}

module.exports = Item;
