const Command = require("../Command");
const { Database } = require("../Database");

module.exports = new Command('user', ['user', 'getuser'], `%PREFIX%user [id]`, undefined, async (msg, cl) => {
    let user = await Database.getUserFuzzy(msg.args[1] || msg.p._id);
    if (user) {
        return `Data: ${JSON.stringify(user, undefined, 1).split('\n').join(' ')}`;
    } else {
        return `User not found.`;
    }
}, 0, 4, true);
