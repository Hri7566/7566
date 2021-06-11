const EventEmitter = require("events");
const RegisterObject = require("./RegisterObject");

class DeferredRegister extends EventEmitter {
    constructor (id) {
        super();
        this.id = id;
        this.map = new Map();
    }

    static registry = new Map();

    register(id, obj) {
        if (!(obj instanceof RegisterObject)) {
            return;
        }

        obj.state = 'registered';

        this.map[id] = obj;
        DeferredRegister.registry.set(`${this.id}:${id}`, obj);
        this.emit('register', id, obj);
    }

    deregister(id) {
        delete this.map[id];
        this.emit('deregister', id);
    }

    forEach(cb, thisArg) {
        console.log("inside test")
        return this.map.forEach(cb, thisArg);
    }

    static grab(cb, type) {
        for (let val of this.registry) {
            if (type) {
                if (val[0].startsWith(type)) {
                    cb(val);
                }
            } else {
                cb(val);
            }
        }
    }
}

module.exports = DeferredRegister;
