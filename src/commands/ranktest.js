const Command = require("../Command");

module.exports = new Command('ranktest', ['ranktest'], `%PREFIX%ranktest`, undefined, async (msg, cl) => {
    return `You should never see this.`;
}, 0, 4, true);
