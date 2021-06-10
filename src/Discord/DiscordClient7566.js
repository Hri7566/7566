const Client7566 = require('../Client7566');
const Discord = require('discord.js');
const { ServerChatMessage } = require('../Message');

class MPPClient7566 extends Client7566 {
    constructor (token) {
        super('discord');
        this.client = new Discord.Client();
        this.client.login(token);
        
        this.currentChannel;

        this.bindClientEventListeners();
    }
    
    bindEventListeners() {
        super.bindEventListeners();

        this.on('send', msg => {
            
        });
    }

    bindClientEventListeners() {
        this.client.on('message', msg => {
            this.currentChannel = msg.channel;
            let p = {
                name: msg.author.username,
                _id: msg.author.id,
                color: "#000000"
            }
            let m = new ServerChatMessage(msg.content);
        });
    }

    sendChat(txt) {
        if (!this.currentChannel) return;
        this.currentChannel.send(`\u034f${txt}`);
    }
}

module.exports = MPPClient7566;
