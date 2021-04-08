module.exports = class Register {
    constructor (name, data, type) {
        this.name = name;
        this.data = data || {};
        this.type = type;
    }

    add(id, entry) {
        //if (!(entry instanceof this.type)) return;
        this.data[id] = entry;
    }

    remove(id) {
        if (typeof(this.data[id]) == 'undefined') return;
        this.data[id] = undefined;
    }

    get(id) {
        return this.data[id];
    }
}
