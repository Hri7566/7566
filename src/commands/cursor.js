const Command = require("../Command");

module.exports = new Command('cursor', ['cursor'], `%PREFIX%cursor <pattern>`, undefined, (msg, cl) => {
    if (msg.args[1]) {
        cl.cursor.emit('change_pattern', msg.argcat);
        if (cl.cursor.follow) delete cl.cursor.follow;
        return `The cursor animation is now '${cl.cursor.currentPattern}'.`;
    } else {
        let patterns = "Cursor animations:";
        for (let key of cl.cursor.patterns.keys()) {
            patterns += ` ${key} | `;
        }
        return patterns.substring(0, patterns.length - 2).trim();
    }
}, 0, 0, true, 'mpp');
