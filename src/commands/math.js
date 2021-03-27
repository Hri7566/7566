const Command = require('../../lib/Command');
const math = require('mathjs');

module.exports = new Command("math", (msg, bot, context) => {
    let ret = "";
    try {
        ret = `${math.evaluate(msg.argcat)}`;
    } catch (err) {
        if (err) {
            ret = "Impossible.";
        }
    }
    return ret;
}, `PREFIXmath <eval string> | Advanced calculator (check https://mathjs.org/docs/expressions/parsing.html#evaluate)`, 1, 0, false, ["m"]);
