const Command = require("../Command");
const { Database } = require("../Database");

module.exports = new Command('dbname', ['dbname'], `%PREFIX%dbname`, `Check your name in the database.`, async (msg, cl) => {
    let u = await Database.getUser(msg.p._id);
    if (u) {
        return `Currently stored name: ${u.name}`;
    } else {
        return `Apparently, you're not in the database.`;
    }
}, 0, 0, true);
