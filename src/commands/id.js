const Command = require('../../lib/Command');

module.exports = new Command('id', (msg, bot, context) => {
    if (context !== 'discord') {
        return `Your ID: ${msg.p._id}`;
    } else {
        return `Your Client ID: \`${msg.p._id}\``;
    }
}, `PREFIXid`, 0, 0, false, ['_id']);
