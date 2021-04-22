const Job = require('./Job');
const Registry = require('./Registry');
const JobRegister = require('./JobRegister');
const LicenseItem = require('./LicenseItem');

module.exports = class Jobs {
    static jobData = {};

    static loadJobs() {
        this.jobData = require('./JobData');

        Registry.setRegister(new JobRegister(this.jobData));

        let users = Registry.getRegister('user').data;

        Object.keys(users).forEach(id => { // load jobs that didn't finish
            let user = users[id];

            let exp = 10;
            let pay = 10;

            if (user.working) {
                user.working = false;
                user.balance += pay;
                user.experience += exp;
                user.workEndTime = Date.now();
            }
        });
    }

    static work(msg, bot, context) {
        let user = bot._bot.getUser(msg);
        if (typeof(user) == 'undefined') return;
        if (user.job == "none") return `You don't have a job.`;
        if (user.working == true) return `You're already working.`;
        let job = Registry.getRegister('job').get(user.job);

        let pay = Math.floor((job.minPay * 100) + (Math.random() * (job.maxPay * 100)))/100;
        let retStr = job.workStrings[Math.floor(Math.random()*job.workStrings.length)];
        let exp = Math.floor((job.exp / 4) + (Math.random() * ((job.exp/16) + (Math.random() * 5))));
        let randomTime = Math.floor(Math.random() * 500000);

        if (context !== 'discord') {
            bot.sendChat(`${msg.p.name} went to work (as a ${job.name}).`);
        } else {
            msg.channel.send(`${msg.p.name} went to work (as a ${job.name}).`);
        }

        user.working = true;
        
        setTimeout(() => {
            if (!user.working) return;
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
