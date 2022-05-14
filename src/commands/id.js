const Command = require("../Command");

module.exports = new Command('id', ['id', '_id', 'identification', 'driverslicense'], `%PREFIX%id`, undefined, async (msg, cl) => {
    return `_id: ${msg.p._id}`;
}, 0, 0, false);
