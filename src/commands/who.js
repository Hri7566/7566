const Command = require("../Command");
const { Database } = require('../Database');

module.exports = new Command('who', ['who'], `%PREFIX%who`, `Check your user data.`, async (msg, cl) => {
    let u;
    if (msg.args[1]) {
        u = await Database.getUserFuzzy(msg.argcat);
    } else {
        u = await Database.getUser(msg.p._id);
    }

    if (u == undefined || u == null) return `No user found.`;

    return `Name: ${u.name} | ID: ${u._id} | Color: ${u.color}`;
}, 0, 0, false);
