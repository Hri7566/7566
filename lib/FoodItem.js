const Item = require('./Item');
const Bot = require('../src/index');

module.exports = class FoodItem extends Item {
    constructor (name, inShop) {
        super(name, inShop, msg => {
            let user = Bot.getUser(msg);
            for (const key in user.inventory) {
                let item = user.inventory[key];
                if (item.name == name) {
                    if (item.count <= 1) {
                        user.inventory[key] = undefined;
                    } else {
                        item.count--;
                    }
                }
            }
            return `${msg.p.name} ate ${name}.`;
        });
    }
}