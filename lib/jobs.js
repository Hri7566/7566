const Job = require('./Job');
const Registry = require('./Registry');
const JobRegister = require('./JobRegister');

module.exports = class Jobs {
    static jobData = {
        pizza: new Job("Pizza Baker", [
            "&NAME cooked a pizza and made &AMOUNT.",
            "&NAME sliced those pepperonis and shredded that cheese and made &AMOUNT."
        ], 70, 75, 0),
        farmer: new Job("Farmer", [
            "&NAME plowed the field and made &AMOUNT.",
            "&NAME sold their vegetation and earned &AMOUNT."
        ], 130, 150, 50),
        butcher: new Job("Butcher", [
            "&NAME beat their meat and made &AMOUNT.",
            "&NAME slaughtered animals and made &AMOUNT"
        ], 120, 140, 50)
    }

    static loadJobs() {
        Registry.setRegister(new JobRegister(this.jobData));
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

        bot.client.sendChat(`${msg.p.name} went to work (as a ${job.name})`);
        
        setTimeout(() => {
            user.balance += pay;
            user.experience += exp;
            return `${this.formatWorkString(retStr, msg, pay, bot)} ${msg.p.name}'s balance is now ${bot._bot.balanceFormat(user.balance)}. They gained ${exp} experience.`;
        }, randomTime);
    }

    static formatWorkString(workString, msg, pay, bot) {
        return workString.split("&NAME").join(msg.p.name).split("&AMOUNT").join(bot._bot.balanceFormat(pay));
    }
}
