var LicenseItem = require('./LicenseItem');
const Registry = require('./Registry');

module.exports = class Job {
    constructor (name, workStrings, minPay, maxPay, exp, requiredLicenseItem) {
        this.name = name;
        this.workStrings = workStrings;
        this.minPay = minPay;
        this.maxPay = maxPay;
        this.exp = exp || 0;
        if (requiredLicenseItem) {
            this.requiredLicenseItem = requiredLicenseItem;
            Registry.getRegister('item').add(requiredLicenseItem.name, requiredLicenseItem);
        } else {
            this.requiredLicenseItem = new LicenseItem("BlankLicense", false, 0);
        }
    }
}
