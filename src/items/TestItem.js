const { Item } = require("../Item");

module.exports = new Item().setDisplayName("TestItem").setDescription("test item ;;;;").onUse(msg => {
    return `${msg.p.name} is holding a stick. They must feel imporant.`;
});
