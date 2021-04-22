const Item = require('../../lib/Item');

module.exports = new Item("Hammer", true, (msg, bot, context) => {
    let ret;
    try {
        if (!msg.args[2]) {
            let hammers = [
                `${msg.p.name} smashes their hammer upon their forehead, knocking themselves out.`
            ]
            ret = hammers[Math.floor(Math.random() * hammers.length)];
        } else {
            ret = `${msg.p.name} built ${msg.argcat.substring(msg.argcat.indexOf(msg.args[2], msg.argcat.length))} with their hammer.`;
        }
    } catch (err) {
        ret = `Error using hammer... How is that possible?`;
    }

    return ret;
}, 150);
