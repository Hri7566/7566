const Client = require('../src/client');
const Command = require('./Command');
const User = require('./User');
const Item = require('./Item');
const Job = require('./Job');

class RegistryTypes {
    static COMMAND = Command;
    static CLIENT = Client;
    static USER = User;
    static ITEM = Item;
    static JOB = Job;
}

Object.seal(RegistryTypes);

module.exports = RegistryTypes;
