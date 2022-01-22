const Command = require("../Command");
const { Database } = require("../Database");
const Balance = require('../Balance');

module.exports = new Command('balance', ['balance', 'bal'], `%PREFIX%balance`, `Get your account balance.`, async (msg, cl, bot) => {
    let user = await Database.getUser(msg.p._id);
    console.log(user);
    return new Balance(user.balance) + "";
}, 0, 0, false);
