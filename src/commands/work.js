const Command = require("../Command");
const Jobs = require('../Jobs');

module.exports = new Command('work', ['work', 'job', 'jobs'], `%PREFIX%work`, `Work a shift at your job.`, async (msg, cl) => {
    let out = "not finished!";

    return out;
}, 0, 0, true);
