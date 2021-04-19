const Command = require('../../lib/Command');
const Registry = require('../../lib/Registry');
const Jobs = require('../../lib/Jobs');

module.exports = new Command('changejob', (msg, bot, context) => {
    let user = bot._bot.getUser(msg);
    let ret;
    let hasLicense = false;

    if (typeof(user) == 'undefined') return;

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
                ret = `You don't have a license for that job!`;
            }
        }
    });

    if (typeof(ret) !== 'undefined') {
        return ret;
    } else {
        return `Unable to change job.`;
    }
}, `PREFIXchangejob <job>`, 1, 0, false, ['cj', 'setjob', 'sj']);
