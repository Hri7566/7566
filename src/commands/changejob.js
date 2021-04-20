const Command = require('../../lib/Command');
const Registry = require('../../lib/Registry');
const Jobs = require('../../lib/Jobs');

module.exports = new Command('changejob', (msg, bot, context) => {
    let ret;
    if (msg.args[1]) {
        let user = bot._bot.getUser(msg);
        let hasLicense = false;

        if (typeof(user) == 'undefined') return;

        if (user.working) return `You're still working! Stop working to change your job.`;

        Object.keys(Registry.getRegister('job').data).forEach(id => {
            let job = Registry.getRegister('job').data[id];
            if (msg.argcat.toLowerCase() == job.name.toLowerCase()) {
                if (job.requiredLicenseItem.name !== "BlankLicense") {
                    Object.keys(user.inventory).forEach(i => {
                        let item = user.inventory[i];
                        if (item.name == job.requiredLicenseItem.name) {
                            hasLicense = true;
                        }
                    });
                } else {
                    hasLicense = true;
                }

                if (hasLicense) {
                    bot._bot.getUser(msg).job = id;
                    ret = `Changed job to ${job.name}.`;
                } else {
                    ret = `You don't have the necessary item for that job! Item required: ${job.requiredLicenseItem.name}`;
                }
            }
        });

        if (typeof(ret) !== 'undefined') {
            return ret;
        } else {
            return `Unable to change job.`;
        }
    } else {
        ret = `💼 Job listings: `;

        Object.keys(Registry.getRegister('job').data).forEach(id => {
            ret += ` ${Registry.getRegister('job').data[id].name} |`;
        });

        ret = ret.substr(0, ret.length-1);
        ret = ret.trim();
        return ret;
    }
}, `PREFIXchangejob <job>`, 0, 0, false, ['cj', 'setjob', 'sj']);
