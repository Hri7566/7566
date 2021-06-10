const EventEmitter = require("events");
const RegisterObject = require("./RegisterObject");

class DeferredRegister extends EventEmitter {
    constructor (id) {
        super();
        this.id = id;
        this.map = new Map();
    }

    register(id, obj) {
        if (!(obj instanceof RegisterObject)) {
            return;
        }

        obj.state = 'registered';

        this.map[id] = obj;
        this.emit('register', id, obj);
    }

    deregister(id) {
        delete this.map[id];
        this.emit('deregister', id);
    }
}

module.exports = DeferredRegister;
