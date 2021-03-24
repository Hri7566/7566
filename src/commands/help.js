const Command = require('../../lib/Command');
const Registry = require('../../lib/Registry');
const Discord = require('discord.js');

module.exports = new Command('help', (msg, bot, context) => {
    let cmds = Registry.getRegister('command').data;
    if (!msg.args[1]) {
        let ret = '';
        if (context == 'discord') {
            ret = new Discord.MessageEmbed()
                .setTitle('7566')
                .setDescription('Help');
            Object.keys(cmds).forEach(id => {
                let cmd = cmds[id];
                if (cmd.hidden) return;
                if (msg.rank._id < cmd.minimumRank) return;
                if (msg.prefix.attached) {
                    ret.addField(`${msg.prefix.prefix}${cmd.name}`, Command.getExample(cmd, msg.prefix));
                } else {
                    ret.addField(`${msg.prefix.prefix} ${cmd.name}`, Command.getExample(cmd, msg.prefix));
                }
            });
        } else {
            ret = `Commands: `;
            Object.keys(cmds).forEach(id => {
                let cmd = cmds[id];
                if (cmd.hidden) return;
                if (msg.rank._id < cmd.minimumRank) return;
                if (msg.prefix.attached) {
                    ret += ` ${msg.prefix.prefix}${cmd.name} | `;
                } else {
                    ret += ` ${msg.prefix.prefix} ${cmd.name} | `;
                }
            });
            ret = ret.substr(0, ret.length - 2);
            ret = ret.trim();
        }

        return ret;
    } else {
        let ret = '';
        Object.keys(cmds).forEach(id => {
            let cmd = cmds[id];
            let cont = false;
            if (msg.argcat == cmd.name) cont = true;
            cmd.aliases.forEach(alias => {
                if (msg.argcat == alias) cont = true;
            });
            if (cont) {
                ret = `Usage: ${Command.getExample(cmd, msg.prefix)}`;
            }
        });
        return ret;
    }
}, 'PREFIXhelp <str>', 0, 0, false, ['h', 'cmds']);
