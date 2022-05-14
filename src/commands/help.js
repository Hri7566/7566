const { MessageEmbed } = require("discord.js");
const Command = require("../Command");
const DeferredRegister = require("../DeferredRegister");

module.exports = new Command('help', ['help', 'cmds', 'h', 'cmd'], `%PREFIX%help [cmd]`, `List available commands.`, (msg, cl) => {
    let out;
    if (!msg.args[1]) {
        if (cl.context == 'mpp') {
            out = `Commands:`;
            for (let val of DeferredRegister.registry) {
                if (!val[0].startsWith('command')) continue;
                let cmd = val[1];
                if (!cmd) continue;
                if (cmd.hidden) continue;
                out += ` ${msg.usedPrefix.accessor}${cmd.accessors[0]} | `;
            }
            out = out.substring(0, out.length - 2).trim();
        } else if (cl.context == 'discord') {
            out = new MessageEmbed();
            out.setTitle('Help');
            for (let val of DeferredRegister.registry) {
                if (!val[0].startsWith('command')) continue;
                let cmd = val[1];
                if (!cmd) continue;
                if (cmd.hidden) continue;
                out.addField(`${msg.usedPrefix.accessor}${cmd.accessors[0]}`, Command.getUsage(cmd.usage, msg.usedPrefix.accessor));
            }
        }
    } else {
        out = ``;
        let cmd;
        DeferredRegister.grab(val => {
            val[1].accessors.forEach(a => {
                if (msg.argcat.startsWith(a)) {
                    cmd = val[1];
                }
            });
        }, "command");
        if (cmd) {
            out += `${cmd.desc}`;
            out += " Usage: " + Command.getUsage(cmd.usage, msg.usedPrefix.accessor);
        } else {
            out = `There is no help for '${msg.argcat}'.`;
        }
    }
    return out;
}, 0, 0, false);
