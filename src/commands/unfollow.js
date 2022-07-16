const Command = require("../Command");

module.exports = new Command('unfollow', ['unfollow'], `%PREFIX%unfollow`, `Cursor unfollow`, (msg, cl) => {
    if (cl.context !== 'mpp') return 'This command only works on MPP.';

    if (cl.cursor.follow) {
        delete cl.cursor.follow;
        return "Stopped following.";
    } else {
        return "Not following anybody.";
    }
}, 0, 0, false);
