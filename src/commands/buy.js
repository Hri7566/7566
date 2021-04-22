const { MessageEmbed } = require('discord.js');
const Command = require('../../lib/Command');
const Registry = require('../../lib/Registry');

module.exports = new Command('buy', (msg, bot, context) => {
    let items = Registry.getRegister('item').data;
    let getItem;

    let hasNum;
    let sellNum = 1;

    if (!isNaN(parseInt(msg.args[msg.args.length-1]))) {
        hasNum = true;
        sellNum = parseInt(msg.args[msg.args.length-1]);
    }

    let itemStr = msg.argcat;

    if (hasNum) {
        itemStr = msg.argcat.substr(0, msg.argcat.indexOf(msg.args[msg.args.length-1]));
    }
    
    itemStr = itemStr.trim();

    for (let id in Registry.getRegister('user').get(msg.p._id).inventory) {
        let i = Registry.getRegister('user').get(msg.p._id).inventory[id];
        if (i.count < 0) {
            Registry.getRegister('user').get(msg.p._id).inventory[id] = undefined;
        }
    }

    Object.keys(items).forEach(id => {
        let item = items[id];
        if (itemStr.toLowerCase() == item.name.toLowerCase()) {
            getItem = item;
        }
    });

    if (typeof(getItem) == 'undefined') {
        return `❌ Could not find item. Is it in the shop?`;
    } else {
        if (!getItem.inShop) return `❌ This item (${getItem.name}) is not for sale.`;
        let user = bot._bot.getUser(msg);
        if (typeof(user) == 'undefined') return `❌ Transaction failed.`;
        if (user.balance < getItem.price * sellNum) return `❌ Not enough money! Transaction failed.`;
        user.balance -= getItem.price * sellNum;
        if (typeof(user.inventory[getItem.name]) == 'undefined') {
            user.inventory[getItem.name] = getItem;
        } else {
            user.inventory[getItem.name].count += sellNum;
        }
        if (context !== 'discord') {
            return `✔️ ${msg.p.name} bought "${getItem.name}" (x${sellNum}) for ${bot._bot.balanceFormat(getItem.price * sellNum)}. They now have ${bot._bot.balanceFormat(user.balance)}.`;
        } else {
            return new MessageEmbed().setTitle("Buy").addField(`:white_check_mark: ${msg.p.name} bought "${getItem.name}" (x${sellNum}) for ${bot._bot.balanceFormat(getItem.price * sellNum)}.`, `They now have ${bot._bot.balanceFormat(user.balance)}.`).setColor("#FFFFFF");
        }
    }
}, `PREFIXbuy <item>`, 1, 0, false, []);
