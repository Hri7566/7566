const Command = require('./Command');

class RegistryTypes {
    static COMMAND = Command;
}

Object.seal(RegistryTypes);

module.exports = RegistryTypes;
