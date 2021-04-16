var LicenseItem = require('./LicenseItem');

module.exports = class Job {
    constructor (name, workStrings, minPay, maxPay, requiredLicenseItem) {
        this.name = name;
        this.workStrings = workStrings;
        this.minPay = minPay;
        this.maxPay = maxPay;
        if (requiredLicenseItem) {
            this.requiredLicenseItem = requiredLicenseItem;
        } else {
            this.requiredLicenseItem = new LicenseItem("BlankLicense", false, 0);
        }
    }
}
