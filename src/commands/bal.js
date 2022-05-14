const Command = require("../Command");
const { Database } = require("../Database");
const Balance = require('../Balance');

module.exports = new Command('balance', ['balance', 'bal'], `%PREFIX%balance`, `Get your account balance.`, async (msg, cl, bot) => {
    if (!msg.args[1]) {
        let user = await Database.getUser(msg.p._id);
        return `Balance of ${user.name}: ${new Balance(user.balance)}`;
    } else {
        let user = await Database.getUserFuzzy(msg.args[1]);
        if (user) {
            return `Balance of ${user.name}: ${new Balance(user.balance)}`;
        }
    }
}, 0, 0, false);
