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
            this.sendChat(msg.message);
        });
    }

    bindClientEventListeners() {
        this.client.on('message', msg => {
            if (msg.author.id == this.client.user.id) return;
            this.currentChannel = msg.channel;
            let p = {
                name: msg.author.username,
                _id: msg.author.id,
                color: "#000000"
            }
            
            let m = new ServerChatMessage(msg.content);

            this.emit('receive', m, this);
        });
    }

    sendChat(txt) {
        super.sendChat(txt);
        if (!this.currentChannel) return;
        if (typeof(txt) == 'string') {
            this.currentChannel.send(`\u034f${txt}`);
        } else {
            this.currentChannel.send(txt);
        }
    }
}

module.exports = MPPClient7566;