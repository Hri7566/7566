const { Item } = require("../Item");

module.exports = new Item().setDisplayName("Stick").setDescription("What do you think this is?").onUse(msg => {
    return `${msg.p.name} swings a stick around.`;
});
