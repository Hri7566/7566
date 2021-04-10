const Item = require('../../lib/Item');

module.exports = new Item("Hammer", true, (msg, bot, context) => {
    let ret;
    try {
        if (!msg.args[2]) {
            let hammers = [
                `${msg.p.name} smashes their hammer upon their forehead, knocking themselves out.`,
                `${msg.p.name} pulled the nails out of their eyes with their hammer.`,
                `${msg.p.name} used their hammer so much that their house is now a mansion.`
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
