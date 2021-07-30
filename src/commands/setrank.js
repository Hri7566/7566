const Command = require("../Command");
const { Rank, Database } = require("../Database");
const Jobs = require('../Jobs');

module.exports = new Command('setrank', ['setrank'], `%PREFIX%setrank (user _id) (rank id) (rank name)`, undefined, async (msg, cl) => {
    try {
        let user = await Database.getUser(msg.args[1]);
        if (user == null) return `No user with the _id '${msg.args[1]}'.`;
        user.rank = new Rank({name: msg.args[3], id: msg.args[2]});
        user.save();
        return `${user.name}'s new rank: ${user.rank.name} [${user.rank.id}]`;
    } catch (err) {
        return `Failed to change rank.`;
    }
}, 3, 2, false);
