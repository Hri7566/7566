const Client = require('./client');
const mppclientxt = require('mpp-client-xt');
const chalk = require('chalk');

module.exports = class MPPClient extends Client {
    constructor (bot, name, uri, room, proxy) {
        var mppcl = new mppclientxt(uri, proxy);
        super(bot, mppcl, (m, c) => {
            m.start();
            
            m.on('hi', p => {
                c.emit('start');
                m.setChannel(room);
            });

            m.on('a', msg => {
                msg.args = msg.a.split(' ');
                
                c.emit('chat', msg);
                this.logger.log(`${chalk.gray(msg.p._id.substring(0, 6))} | ${msg.p.name}: ${msg.a}`);

                if (msg.a.toLowerCase().includes('h!help')) {
                    this.sendChat('bot not finished >:[')
                }
            });

            setTimeout(() => {
                m.on('participant added', p => {
                    this.logger.log(`${chalk.gray(p._id.substring(0, 6))} | ${p.name} joined the room.`);
                });
    
                m.on('participant removed', p => {
                    this.logger.log(`${chalk.gray(p._id.substring(0, 6))} | ${p.name} left the room.`);
                });
            }, 500);

            m.on('error', err => {
                this.logger.error(err.message);
            });
        }, `MPP] [${name}`);
    }

    sendChat(str) {
        if (str == '' || typeof(str) == 'undefined' || str == null) return;
        this.client.sendArray([{m:'a', message:`\u034f${str}`}])
    }
}
