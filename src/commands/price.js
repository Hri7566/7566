const Command = require("../Command");
const { Item, Shop } = require("../Item");
const Balance = require("../Balance");

module.exports = new Command('price', ['price'], `%PREFIX%price`, "Get the price for an item.", (msg, cl) => {
    let out = "No price found for " + msg.argcat + ".";
    let price = Shop.getPriceListing(msg.argcat);
    if (price) {
        out = "Price of " + price.item_name + ": " + new Balance(price.price);
    }
    return out;
}, 0, 0, false);
