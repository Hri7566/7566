const Command = require("../Command");
const Database = require("../Database");

module.exports = new Command('rank', ['rank'], `%PREFIX%rank`, undefined, async (msg, cl) => {
    let rank = await Database.getRank(msg.p._id);
    cl.sendChat(`Your rank is ${rank.name} [${rank.id}]`);
}, 0, 0, false);
