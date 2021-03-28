/*

Idea - Have this load an item map and call functions from that

probably not json; wouldn't be able to run item code unless code is in another file

TODO - look at minecraft source to see what mojang did

*/

const Register = require('./Register');
const RegistryTypes = require('./RegistryTypes');

module.exports = class ItemRegister extends Register {
    constructor (data) {
        super('item', data, RegistryTypes.ITEM);
    }
}
