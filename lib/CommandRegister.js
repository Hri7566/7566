const Register = require('./Register');
const Command = require('./Command');
const RegistryTypes = require('./RegistryTypes');

module.exports = class CommandRegister extends Register {
    constructor (data) {
        super('command', data, RegistryTypes.COMMAND);
    }
}