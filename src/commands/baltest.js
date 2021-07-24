const Command = require("../Command");
const Balance = require('../Balance');

module.exports = new Command('baltest', ['baltest'], undefined, undefined, (msg, cl) => {
    if (!parseInt(msg.argcat)) return 'no';
    let bal = new Balance(parseInt(msg.argcat));
    console.log(bal);
    return bal + "";
}, 0, 0, true);
