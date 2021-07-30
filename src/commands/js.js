const Command = require("../Command");

module.exports = new Command('js', ['js'], `%PREFIX%js (eval string)`, `Evaluate JavaScript during runtime.`, async (msg, cl, bot) => {
    let out = `✔️ Console: `;
    try {
        // if (msg.argcat.toLowerCase().includes('process')) return `Process is disallowed.`;
        let ev = eval(msg.argcat);
        out += `(${typeof(ev)}) ` + eval(msg.argcat);
    } catch (err) {
        out = `❌ ${err}`;
    }
    return out;
}, 1, 3, false);
