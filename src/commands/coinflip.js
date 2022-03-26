const Command = require("../Command");

module.exports = new Command('coinflip', ['coinflip', 'flip', 'flipcoin', 'coin'], `%PREFIX%coinflip`, `Flip a coin.`, (msg, cl, bot) => {
    let r = Math.random();
    let out = `tails`;

    if (r > 0.5) out = `heads`;

    cl.sendChat(`Ready? Flipping a coin...`);

    setTimeout(() => {
        cl.sendChat(`It was ${out}!`);
    }, 2000);
}, 0, 0, false);
