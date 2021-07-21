const Command = require("../Command");

module.exports = new Command('id', ['id'], `%PREFIX%id`, undefined, async (msg, cl) => {
    return msg.p._id;
}, 0, 0, false);
