const Command = require("../Command");
const Jobs = require('../Jobs');

module.exports = new Command('changejob', ['changejob', 'cj', 'joblist', 'jl'], `%PREFIX%cj (job)`, `Change your job.`, async (msg, cl) => {
    let out = "";
    let jl = Jobs.getJobList();

    if (msg.args[1]) {
        let job;

        for (let i of Object.keys(jl)) {
            if (msg.argcat.toLowerCase() == jl[i].displayName.toLowerCase()) {
                job = jl[i];
            }
        }

        out = `test: ${job.displayName}`;
    } else {
        out = `Jobs:`;

        for (let i of Object.keys(jl)) {
            out += ` ${jl[i].displayName} | `;
        }

        out = out.substr(0, out.length - 2);
    }

    return out;
}, 0, 0, true);
