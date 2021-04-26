const { MessageEmbed } = require('discord.js');
const Command = require('../../lib/Command');
const Registry = require('../../lib/Registry');

let currencySymbol = "H$";
let currencyStyle = "`${symbol}${amt}`"

module.exports = new Command('shop', (msg, bot, context) => {
    if (context !== 'discord') {
        let ret = "🛒 Shop: ";
        let items = Registry.getRegister('item').data;
        Object.keys(items).forEach(id => {
            let item = items[id];
            if (item.inShop)
                ret += ` ${item.name}: ${bot._bot.balanceFormat(item.price)} | `;
        });
        ret = ret.substring(0, ret.length - 2);
        ret = ret.trim();
        return ret;
    } else {
        let ret = new MessageEmbed().setTitle(":shopping_cart: Shop").setColor("#FFFFFF");
        let items = Registry.getRegister('item').data;
        Object.keys(items).forEach(id => {
            let item = items[id];
            if (item.inShop)
                ret.addField(`${item.name}`, bot._bot.balanceFormat(item.price), true);
        });
        return ret;
    }
}, `PREFIXshop`, 0, 0, false, ['s']);
