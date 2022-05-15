const RegisterObject = require('./RegisterObject');
const itemPriceList = require('./itemPriceList');

class Item extends RegisterObject {
    static getPriceListing(item) {
        return itemPriceList[item];
    }

    constructor() {
        super();
        this.id = "<missing item>";
        this.stats = {};
        this.maxStack = 99;
        this.description = "No description.";
    }

    setDisplayName (name) {
        this.id = name;
        return this;
    }

    setDescription (desc) {
        this.description = desc;
        return this;
    }

    use(msg, cl, bot) {
        return `${this.id} is not usable.`;
    }

    eat() {
        return `${this.id} is not edible.`;
    }

    onUse(func) {
        this.use = func;
        return this;
    }
}

class FoodItem extends Item {
    constructor () {
        super();
        this.edible = true;
    }
}

class InventoryItem {
    static getRealItem(name) {
        return RegisterObject.get(name);
    }

    constructor(name, amount) {
        this.name = name;
        this.amount = amount;
    }
}

module.exports = {
    Item,
    FoodItem,
    InventoryItem
}
