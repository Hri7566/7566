const Client = require('../src/client');
const Command = require('./Command');

class RegistryTypes {
    static COMMAND = Command;
    static CLIENT = Client;
}

Object.seal(RegistryTypes);

module.exports = RegistryTypes;
