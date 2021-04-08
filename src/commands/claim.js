const Command = require('../../lib/Command');
const Registry = require('../../lib/Registry');

let claimAmount = 100;
let claimLength = 24 * 60 * 60 * 1000; // 24 hours
let currencySymbol = "H$";
let currencyStyle = "`${symbol}${amt}`"

function balanceFormat(b) {
    try {
        let amt = b;
        let symbol = currencySymbol;
        let parsed = eval(currencyStyle);
        return parsed;
    } catch (err) {
        if (err) {
            console.error(err);
            return "MISSINGNO.";
        }
    }
}

module.exports = new Command('claim', (msg, bot, context) => {
    let user = bot._bot.getUser(msg);
    let t = Date.now();

    let timeleft = (user.lastClaimed + (claimLength)) - t;
    
    if (timeleft <= 0) {
        Registry.getRegister('user').data[user._id].lastClaimed = Date.now();
        Registry.getRegister('user').data[user._id].balance += claimAmount;
        bot._bot.saveUserData();
        return `${msg.p.name} claimed ${balanceFormat(claimAmount)}. They now have ${balanceFormat(Registry.getRegister('user').data[user._id].balance)}.`;
    }

    return `You can't claim until ${Math.round(timeleft/1000/60/60)} hours from now.`;
}, `PREFIXclaim`, 0, 0, false, ['daily']);
