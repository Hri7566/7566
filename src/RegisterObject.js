class RegisterObject {
    constructor (id) {
        this.id = id;
        this.state = 'unregistered';
        this.flags = new Map();
    }
}

module.exports = RegisterObject;
