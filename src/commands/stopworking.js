const Command = require("../../lib/Command");

module.exports = new Command('stopworking', (msg, bot, context) => {
    let user = bot._bot.getUser(msg);
    if (typeof(user) !== 'undefined') {
        if (user.working) {
            user.working = false;
            return `Stopped working.`;
        } else {
            return `You're not working.`;
        }
    }
}, `PREFIXstopworking`, 0, 0, false, ['sw','quitworking','qw'])