const Command = require('../../lib/Command');
const Discord = require('discord.js');

module.exports = new Command('js', (msg, bot, context) => {
    let ret = "";
    if (context !== 'discord') {
        try {
            ret = "✔️ " + eval(msg.argcat);
        } catch (err) {
            ret = "❌ " + err;
        }
    } else {
        try {
            let e = eval(msg.argcat);
            ret = new Discord.MessageEmbed().addField(":white_check_mark: ", `${typeof(e)}: ${e}`).setColor('#00FF00');
        } catch (err) {
            ret = new Discord.MessageEmbed().addField(":x: ", err).setColor('#FF0000');
        }
    }
    return ret;
}, `PREFIXjs <code>`, 1, 4, false, ["j","eval"]);