const { Item } = require("../Item");

module.exports = new Item().setDisplayName("Stick").setDescription("What do you think this is?").onUse(msg => {
    return `${msg.p.name} is holding a stick. They must feel important.`;
});
