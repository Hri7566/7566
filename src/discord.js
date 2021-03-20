const Client = require('./client');
const Discord = require('discord.js')

module.exports = class DiscordClient extends Client {
    constructor (bot, name, token) {
        var dcl = new Discord.Client();
        super(dcl, (m, c) => {
            this.client.login(token);
        }, name);
    }
}
