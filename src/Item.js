const RegisterObject = require('./RegisterObject');
const itemPriceList = require('./itemPriceList');
const DeferredRegister = require('./DeferredRegister');

class Item extends RegisterObject {
    constructor() {
        super();
        this.id = "<missing item>";
        this.stats = {};
        this.maxStack = 99;
        this.description = "No description.";
        this.sellable = true;
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

    eat(msg, cl, bot) {
        if (!this.edible) {
            return `${this.id} is not edible.`;
        } else {
            return `${msg.p.name} ate ${this.id}`;
        }
    }

    onUse(func) {
        this.use = func;
        return this;
    }

    makeUnsellable() {
        this.sellable = false;
        return this;
    }
}

class FoodItem extends Item {
    constructor() {
        super();
        this.edible = true;
    }
}

class EBItem extends Item {
    constructor() {
        super();
        this.errorRate;
        this.offense;
    }

    setOffense(o) {
        this.offense = o;
        return this;
    }

    setErrorRate(e) {
        this.errorRate = e;
        return this;
    }
}

class InventoryItem {
    /**
     * Get the registered item object from an inventory item's name
     * @param {str} name Name of item
     * @returns Item
     */
    static getRealItem(name) {
        return DeferredRegister.registry.get(`item:${name}`);
    }

    static getRealItemFuzzy(name) {
        for (let [key, val] of DeferredRegister.registry) {
            if (key.startsWith('item:')) {
                if (val.id.toLowerCase().includes(name.toLowerCase())) {
                    return val;
                }
            }
        }
    }

    static itemToInventoryItem(item, amount) {
        return new InventoryItem(item.id, amount || 1);
    }

    constructor(name, amount) {
        this.name = name;
        this.amount = amount;
    }
}

class Shop {
    static itemPriceList = itemPriceList;

    static getPriceListing(item) {
        return this.itemPriceList[item];
    }
}

module.exports = {
    Item,
    FoodItem,
    InventoryItem,
    Shop
}
