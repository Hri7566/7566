const Client = require('./client');
const mppclientxt = require('mpp-client-xt')

module.exports = class MPPClient extends Client {
    constructor (bot, name, uri, room, proxy) {
        var mppcl = new mppclientxt(uri, proxy);

        super(bot, mppcl, (m, c) => {
            m.start();
            
            m.on('hi', p => {
                c.emit('start');
                m.setChannel(room);

                if (bot.config.mpp.allowUserset)
                    m.sendArray([{m:'userset', set: this.userSettings}]);
            });

            m.on('a', msg => {
                msg.context = 'mpp';
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
                        if (msg.args[0] !== prefix.prefix) return;
                        msg.cmd = msg.args[1];
                        if (msg.cmd == undefined) msg.cmd = '';
                        msg.args = msg.argcat.split(' ');
                        msg.argcat = msg.a.substr(msg.args[0].length + 1 + msg.cmd.length);
                    } else {
                        if (!msg.args[0].startsWith(prefix.prefix)) return;
                        msg.cmd = msg.args[0].substr(prefix.prefix.length);
                    }
                });

                m.on('participant added', p => {
                    bot.getUserById(p._id);
                });
                
                c.emit('chat', msg);
            });

            m.on('error', err => {
                this.logger.error(err.message + `\n${err.stack}`);
                // console.error(err);

                m.stop();
                this.logger.log(`Rejoining in 5s...`);
                setTimeout(() => {
                    m.start();
                }, 5000);
            });
        }, `MPP] [${name}`, 'mpp');

        this.userSettings = {
            name: '7566 | h!help',
            color: "#22b76d"
        }
    }

    sendChat(str) {
        this.client.sendArray([{m:'a', message:`\u034f${str}`}]);
    }
}
