const Command = require("../Command");
const math = require('mathjs');
const Algebrite = require('algebrite');

module.exports = new Command('math', ['math'], `%PREFIX%math (math stuff)`, undefined, (msg, cl) => {
    // let out = Algebrite.run(msg.argcat);
    try {
        let out = math.evaluate(msg.argcat);
        return "Output: " + out;
    } catch (err) {
        return `Incorrect usage.`;
    }
}, 1, 0, false);