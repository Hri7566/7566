const Command = require("../Command");
const { Database } = require("../Database");

module.exports = new Command('rank', ['rank'], `%PREFIX%rank`, undefined, async (msg, cl) => {
    if (!msg.args[1]) {
        let rank = await Database.getRank(msg.p._id);
        cl.sendChat(`Your rank is ${rank.name} [${rank.id}]`);
    } else {
        try {
            let user = await Database.getUser(msg.argcat);
            cl.sendChat(`${user.name}'s rank is ${user.rank.name} [${user.rank.id}]`);
        } catch (err) {
            return `There is no user with the _id '${msg.argcat}'.`;
        }
    }
}, 0, 0, false);
