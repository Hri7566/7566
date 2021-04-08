const Register = require('./Register');
const Client = require('../src/client');
const RegistryTypes = require('./RegistryTypes');

module.exports = class ClientRegister extends Register {
    constructor (data) {
        super('client', data, RegistryTypes.CLIENT);
    }
}