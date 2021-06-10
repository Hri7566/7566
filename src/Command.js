const RegisterObject = require('./RegisterObject')

class Command extends RegisterObject {
    constructor (id, accessors, usage, desc, func, args, rank, hidden) {
        super();
        this.id = id;
        this.accessors = typeof(accessors) == 'object' ? accessors : [accessors];
        this.usage = usage;
        this.desc = desc;
        this.func = typeof (func) == 'function' ? func : () => {return 'This command is broken.'};
        this.args = args || 0;
        this.rank = rank || 0;
        this.hidden = hidden || false;
    }
}

module.exports = Command;
