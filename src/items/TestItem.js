const { Item } = require("../Item");

module.exports = new Item().setDisplayName("TestItem").setDescription("test item ;;;;").onUse(msg => {
    return `${msg.p.name}'s test item is working!`;
});
