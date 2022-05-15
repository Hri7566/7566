const Command = require("../Command");
const { Database, User } = require("../Database");

module.exports = new Command('users', ['users', 'usercount'], `%PREFIX%users`, undefined, async (msg, cl) => {
    let str = "Users in database: " + (await User.countDocuments());
    return str;
}, 0, 0, false);
