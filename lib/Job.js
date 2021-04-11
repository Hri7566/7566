module.exports = class Job {
    constructor (name, workStrings, minPay, maxPay, requiredExp) {
        this.name = name;
        this.workStrings = workStrings;
        this.minPay = minPay;
        this.maxPay = maxPay;
        this.requiredExp = requiredExp;
    }
}