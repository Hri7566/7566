const Command = require('../../lib/Command');
const math = require('mathjs');

module.exports = new Command("simplify", (msg, bot) => {
    let ret = "";
    try {
        ret = `${math.simplify(msg.argcat)}`;
    } catch (err) {
        if (err) {
            ret = "Invalid input.";
        }
    }
    return ret;
}, `PREFIXsimplify <eval string> | Calculus: Simplify an expression`, 1, 0, false, ["simp"]);
