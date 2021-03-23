const Client = require('../src/client');
const Command = require('./Command');
const User = require('./User');

class RegistryTypes {
    static COMMAND = Command;
    static CLIENT = Client;
    static USER = User;
}

Object.seal(RegistryTypes);

module.exports = RegistryTypes;
