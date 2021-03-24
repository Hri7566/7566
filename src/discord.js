const Client = require('./client');
const Discord = require('discord.js')
const User = require('../lib/User');

module.exports = class DiscordClient extends Client {
    constructor (bot, token) {
        var dcl = new Discord.Client();
        super(bot, dcl, (m, c) => {
            dcl.login(token);
            
            dcl.on('message', msg => {
                this.currentmsg = msg;
                msg.context = 'discord';
                msg.a = msg.content;
                msg.p = {
                    name: msg.author.username,
                    _id: msg.author.id,
                    color: msg.member.displayHexColor
                };
                msg.args = msg.a.split(' ');
                msg.argcat = msg.a.substr(msg.args[0].length).trim();
                msg.prefix = {
                    attached: false,
                    prefix: null
                };
                bot.prefixes.forEach(prefix => {
                    if (!msg.a.startsWith(prefix.prefix)) return;
                    msg.prefix = prefix;
                    if (!prefix.attached) {
                        if (!msg.args[1]) return;
                        msg.cmd = msg.args[1];
                        if (msg.cmd == undefined) msg.cmd = '';
                        msg.args = msg.argcat.split(' ');
                        msg.argcat = msg.a.substr(msg.args[0].length + 1 + msg.cmd.length);
                    } else {
                        msg.cmd = msg.args[0].substr(prefix.prefix.length);
                    }
                });
                c.emit('chat', msg);
            });
        }, 'Discord', 'discord');

        this.currentmsg = {
            channel: {
                send: () => {}
            }
        };

        this.logger.log('Online');
    }

    sendChat(str) {
        this.currentmsg.channel.send(str);
    }
}
