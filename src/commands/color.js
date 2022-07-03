const Command = require("../Command");
const Color = require("../MPP/Color");

module.exports = new Command('color', ['color'], `%PREFIX%color [color]`, undefined, (msg, cl) => {
    let col;
    let name;

    if (!msg.args[1]) {
        col = new Color(msg.p.color);
        name = col.getName();
        if (name.startsWith('A')) {
            name = `a${name.substring(1)}`;
        }
        return `Your color is ${name} [${col.toHexa()}] (${col.r}, ${col.g}, ${col.b})`;
    } else {
        if (!msg.args[3]) {
            col = new Color(msg.argcat);
        } else {
            col = new Color(msg.args[1], msg.args[2], msg.args[3]);
        }

        name = col.getName();

        if (name.startsWith('A')) {
            name = `a${name.substring(1)}`;
        }

        return `That looks like ${name} [${col.toHexa()}] (${col.r}, ${col.g}, ${col.b})`;
    }
}, 0, 0, false);
