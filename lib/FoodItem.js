const Item = require('./Item');

module.exports = class FoodItem extends Item {
    constructor (name, inShop) {
        super(name, inShop, msg => {
            return `${msg.p.name} ate ${name}.`;
        });
    }
}