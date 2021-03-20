const Register = require('../lib/Register');
const Client = require('./client');

module.exports = class ClientRegister extends Register {
    constructor (data) {
        super('client', data, Client);
    }
}