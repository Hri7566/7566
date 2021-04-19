const Command = require('../../lib/Command');
const Registry = require('../../lib/Registry');
const Jobs = require('../../lib/Jobs');

module.exports = new Command('work', (msg, bot, context) => {
    let user = bot._bot.getUser(msg);
    let ret;

    if (typeof(user) == 'undefined') return;

    ret = Jobs.work(msg, bot, context);

    return ret;
}, `PREFIXwork`, 0, 0, false, ['w', 'job', 'j']);
