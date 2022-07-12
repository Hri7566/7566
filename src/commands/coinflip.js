const Command = require("../Command");

let outcomes = [
    "The coin landed on heads.",
    "The coin landed on tails.",
];

let specialOutcomes = [
    "The coin landed directly on its side!",
    "The coin rolled away!",
    "The coin didn't come back down!",
    "You flipped a seashell instead! It landed hole-side-down.",
    "The coin was made of chocolate and the sun melted it!",
    "There are no coins to flip, sorry.",
    "Anonygold took all the coins away, so we can't flip one right now.",
    "Grant ate all the coins.",
    "The coin landed on heads. WAIT! The coin flipped back over one more time! IT'S HEADS ON BOTH SIDES!!!"
];

module.exports = new Command('coinflip', ['coinflip', 'flip', 'flipcoin', 'coin'], `%PREFIX%coinflip`, `Flip a coin.`, (msg, cl, bot) => {
    let r = Math.random();
    let r2 = Math.random();

    setTimeout(() => {
        if (r < 0.5) {
            if (r2 < 0.5) {
                cl.sendChat(specialOutcomes[Math.floor(Math.random() * specialOutcomes.length)]);
            } else {
                cl.sendChat(outcomes[Math.floor(Math.random() * outcomes.length)]);
            }
        } else {
            if (r2 < 0.5) {
                cl.sendChat(outcomes[Math.floor(Math.random() * outcomes.length)]);
            } else {
                cl.sendChat(specialOutcomes[Math.floor(Math.random() * specialOutcomes.length)]);
            }
        }
    }, 2000);

    cl.sendChat(`Flipping a coin...`);
}, 0, 0, false);
