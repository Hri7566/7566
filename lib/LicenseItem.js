const Item = require('./Item');
const Bot = require('../src/index');

module.exports = class LicenseItem extends Item {
    constructor (name, inShop, price) {
        super(name, inShop, undefined, price);
    }
}