const Command = require('../../lib/Command');
const Registry = require('../../lib/Registry');
const Jobs = require('../../lib/Jobs');

module.exports = new Command('changejob', (msg, bot, context) => {
    let user = bot._bot.getUser(msg);
    let ret;

    if (typeof(user) == 'undefined') return;

    

    return ret;
}, `PREFIXchangejob <job>`, 0, 0, false, ['cj', 'setjob', 'sj']);
