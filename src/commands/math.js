const Command = require("../Command");
const math = require('mathjs');
const Algebrite = require('algebrite');

module.exports = new Command('math', ['math'], undefined, undefined, (msg, cl) => {
    let out = Algebrite.run(msg.argcat);
    return "Output: " + out;
}, 1, 0, false);