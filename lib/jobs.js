const Job = require('./Job');
const Registry = require('./Registry');
const JobRegister = require('./JobRegister');

module.exports = class Jobs {
    static jobData = {
        pizza: new Job("Pizza Baker", [
            "&NAME cooked a pizza and made &AMOUNT.",
            "&NAME sliced those pepperonis and shredded that cheese and made &AMOUNT."
        ], 70, 75),
        farmer: new Job("Farmer", [
            "&NAME plowed the field and made &AMOUNT.",
            "&NAME sold their vegetation and earned &AMOUNT."
        ], 130, 150),
        butcher: new Job("Butcher", [
            "&NAME beat their meat and made &AMOUNT.",
            "&NAME slaughtered animals and made &AMOUNT"
        ], 120, 140)
    }

    static loadJobs() {
        Registry.setRegister(new JobRegister(this.jobData));

        let users = Registry.getRegister('user').data;

        Object.keys(users).forEach(id => { // load jobs that didn't finish
            let user = users[id];

            if (user.working) {
                setTimeout(() => {
                    user.working = false;
                    user.balance += pay;
                    user.experience += exp;
                    user.nextWorkingTime = Date.now() + randomTime;
                }, user.workEndTime - user.lastWorked);
            }
        });
    }

    static work(msg, bot, context) {
        let user = bot._bot.getUser(msg);
        if (typeof(user) == 'undefined') return;
        if (user.job == "none") return `You don't have a job.`;
        let job = Registry.getRegister('job').get(user.job);

        let pay = Math.floor((job.minPay * 100) + (Math.random() * (job.maxPay * 100)))/100;
        let retStr = job.workStrings[Math.floor(Math.random()*job.workStrings.length)];
        let exp = Math.floor((job.requiredExp / 4) + (Math.random() * ((job.requiredExp/16) + (Math.random() * 5))));
        let randomTime = Math.floor(Math.random() * 500000);

        if (context !== 'discord') {
            bot.sendChat(`${msg.p.name} went to work (as a ${job.name})`);
        } else {
            msg.channel.send(`${msg.p.name} went to work (as a ${job.name})`);
        }

        user.working = true;
        
        setTimeout(() => {
            user.working = false;
            user.balance += pay;
            user.experience += exp;
            user.lastWorked = Date.now();
            user.workEndTime = Date.now() + randomTime;
            if (context !== 'discord') {
                bot.sendChat(`${this.formatWorkString(retStr, msg, pay, bot)} ${msg.p.name}'s balance is now ${bot._bot.balanceFormat(user.balance)}. They gained ${exp} experience.`);
            } else {
                msg.channel.send(`${this.formatWorkString(retStr, msg, pay, bot)} ${msg.p.name}'s balance is now ${bot._bot.balanceFormat(user.balance)}. They gained ${exp} experience.`);
            }
        }, randomTime);
    }

    static formatWorkString(workString, msg, pay, bot) {
        return workString.split("&NAME").join(msg.p.name).split("&AMOUNT").join(bot._bot.balanceFormat(pay));
    }

    static stopWorking(msg, bot, context) {
        let user = bot._bot.getUser(msg);
        if (typeof(user) == 'undefined') return;
        if (user.job == "none") return `You don't have a job.`;
        
        if (context !== 'discord') {
            bot.sendChat(`${msg.p.name} stopped working.`);
        } else {
            msg.channel.send(`${msg.p.name} stopped working.`);
        }
    }
}
