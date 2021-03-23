const Register = require('./Register');
const Client = require('../src/client');
const RegistryTypes = require('./RegistryTypes');

module.exports = class UserRegister extends Register {
    constructor (data) {
        super('user', data, RegistryTypes.USER);
    }
}
