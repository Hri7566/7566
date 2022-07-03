const Command = require("../Command");

module.exports = new Command('cursor', ['cursor'], `%PREFIX%cursor <pattern>`, undefined, (msg, cl) => {
    if (cl.context !== 'mpp') return 'This command only works on MPP.';
    if (cl.cursor.follow) delete cl.cursor.follow;
    cl.cursor.emit('change_pattern', msg.argcat);
}, 1, 0, true);
