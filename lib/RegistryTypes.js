const Client = require('../src/client');
const Command = require('./Command');
const User = require('./User');
const Item = require('./Item');

class RegistryTypes {
    static COMMAND = Command;
    static CLIENT = Client;
    static USER = User;
    static ITEM = Item;
}

Object.seal(RegistryTypes);

module.exports = RegistryTypes;
