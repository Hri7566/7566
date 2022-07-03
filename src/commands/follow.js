const Command = require("../Command");

module.exports = new Command('follow', ['follow'], `%PREFIX%follow <id>`, `Cursor follow`, (msg, cl) => {
    if (cl.context !== 'mpp') return 'This command only works on MPP.';

    let p;

    if (msg.args[1]) {
        p = cl.getPart(msg.argcat);
    } else {
        p = msg.p;
    }

    if (p) {
        cl.cursor.follow = p._id;
        return `Cursor is now following ${p.name}.`;
    } else {
        return `Could not find user. Are they in this room? Try their ID instead.`;
    }
}, 1, 0, true);
