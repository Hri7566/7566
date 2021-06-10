const Client7566 = require('../Client7566');
const Discord = require('discord.js');

class MPPClient7566 extends Client7566 {
    constructor (token) {
        super('discord');

        this.client = new Discord.Client();
        this.currentChannel;
        this.client.login(token);
        this.bind();
    }
    
    bind() {
        this.on('send', msg => {
            
        });
    }

    sendChat(txt) {
        
    }
}

module.exports = MPPClient7566;
