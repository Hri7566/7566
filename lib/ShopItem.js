const Item = require('./Item');

module.exports = class ShopItem extends Item {
    constructor (item) {
        super(item.name, true, item.useFunc);
        this.price = typeof(price) == 'number' ? price : 10;
    }
}