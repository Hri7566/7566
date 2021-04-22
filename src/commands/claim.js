const Command = require('../../lib/Command');
const Registry = require('../../lib/Registry');

let claimAmount = 100;
let claimLength = 24 * 60 * 60 * 1000; // 24 hours

module.exports = new Command('claim', (msg, bot, context) => {
    let user = bot._bot.getUser(msg);
    let t = Date.now();

    claimAmount = 120 + (Math.floor(Math.random() * 30_00)/100); // 120 - 150

    let timeleft = (user.lastClaimed + (claimLength)) - t;
    
    if (timeleft <= 0) {
        Registry.getRegister('user').data[user._id].lastClaimed = Date.now();
        Registry.getRegister('user').data[user._id].balance += claimAmount;
        bot._bot.saveUserData();
        if (context !== 'discord') {
            return `${msg.p.name} claimed ${bot._bot.balanceFormat(claimAmount)}. They now have ${bot._bot.balanceFormat(Registry.getRegister('user').data[user._id].balance)}.`;
        } else {
            return `<@${msg.p._id}> claimed ${bot._bot.balanceFormat(claimAmount)}. They now have ${bot._bot.balanceFormat(Registry.getRegister('user').data[user._id].balance)}.`;
        }
    }

    return `❌ You can't claim until about ${Math.round((timeleft/1000/60/60) * 100)/100} hour(s) from now.`;
}, `PREFIXclaim`, 0, 0, false, ['daily']);
