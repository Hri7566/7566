const Command = require('../../lib/Command');

module.exports = new Command('js', (msg, bot, context) => {
    let ret = "";
    try {
        ret = "✔️ " + eval(msg.argcat);
    } catch (err) {
        ret = "❌ " + err;
    }
    return ret;
}, `PREFIXjs <code>`, 1, 4, false, ["j","eval"]);