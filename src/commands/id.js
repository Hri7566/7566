const Command = require('../../lib/Command');

module.exports = new Command('id', (msg, bot, context) => {
    return `Your ID: ${msg.p._id}`;
}, `PREFIXid`, 0, 0, false, ['i','_id']);
