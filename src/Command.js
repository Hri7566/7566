const RegisterObject = require('./RegisterObject')

class Command extends RegisterObject {
    constructor (id, accessors, usage, desc, func, args, rank, hidden) {
        super();
        this.id = id;
        this.accessors = typeof(accessors) == 'object' ? accessors : [accessors];
        this.usage = usage || "No usage.";
        this.desc = desc || "No description.";
        this.func = typeof (func) == 'function' ? func : () => {return 'This command is broken.'};
        this.args = args || 0;
        this.rank = rank || 0;
        this.hidden = hidden || false;
    }

    static getUsage(str, prefix) {
        return str.split("%PREFIX%").join(prefix);
    }
}

module.exports = Command;
