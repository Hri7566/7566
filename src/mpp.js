const Client = require('./client');
const mppclient = require('./mppc');

module.exports = class MPPClient extends Client {
    constructor (bot, name, uri, room, proxy) {
        var mppcl = new mppclient(uri, proxy);

        super(bot, mppcl, (m, c) => {
            m.start(process.env.MPPCPASSWORD);
            
            m.on('hi', p => {
                c.emit('start');
                m.setChannel(room);

                if (bot.config.mpp.allowUserset)
                    m.sendArray([{m:'userset', set: this.userSettings}]);

                let cursor = {
                    x: Math.random()*100,
                    y: Math.random()*100,
                    vel: {
                        x: 1/60,
                        y: 1/60
                    }
                };

                this.cursorInt = setInterval(() => {
                    if (cursor.x >= 100 || cursor.x <= 0) {
                        cursor.vel.x = -cursor.vel.x;
                    }
                    if (cursor.y >= 100 || cursor.y <= 0) {
                        cursor.vel.y = -cursor.vel.y;
                    }
                    cursor.x += cursor.vel.x;
                    cursor.y += cursor.vel.y;
                    m.sendArray([{m:'m', x: cursor.x, y: cursor.y}]);
                }, 60/1000);
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
                
                c.emit('chat', msg);
            });

            m.on('participant added', p => {
                bot.getUserById(p._id);
                bot.updateName(p);
            });

            m.on('participant update', p => {
                bot.updateName(p);
            });

            m.on('error', err => {
                this.logger.error(err.message + `\n${err.stack}`);
                // console.error(err);

                m.stop();
                this.logger.log(`Rejoining in 1m...`);
                setTimeout(() => {
                    m.start();
                }, 60 * 1000);
            });
        }, `MPP] [${name}`, 'mpp');

        this.userSettings = {
            name: '7566 | 7help',
            color: "#22b76d"
        }

        this.chat_send_buffer = [];

        this.chatInterval = setInterval(() => {
            if (this.client.isConnected()) {
                var msg = this.chat_send_buffer.shift();
                if (msg) {
                    this.client.sendArray([{m:'a', message:`\u034f${msg}`}]);
                }
            }
        }, 2000);
    }

    sendChat(message) {
        var arr = [];
        while(message.length > 511) {
            arr.push(message.substr(0, 511));
            message = "…"+message.substr(511);
        }
        
        arr.push(message);

        for(var i = 0; i < arr.length; i++) {
            this.chat_send_buffer.push({m: "a", message: arr[i]});
        }
	}
}
