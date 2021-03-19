const Client = require('./client');
const mppclientxt = require('mpp-client-xt')

module.exports = class MPPClient extends Client {
    constructor (bot, name, uri, room, proxy) {
        var mppcl = new mppclientxt(uri, proxy);
        super(mppcl, (m, c) => {
            m.start();
            
            m.on('hi', p => {
                c.emit('start');
                m.setChannel(room);
            });

            m.on('a', msg => {
                msg.args = msg.a.split(' ');
                
            });
        }, name);
    }
}