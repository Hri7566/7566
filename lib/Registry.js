const Register = require('./Register');

module.exports = class Registry {
    constructor () {
        this.registers = {};
        let i;
        Object.keys(arguments).forEach(arg => {
            if (!(arg instanceof Register)) return;
            this.registers[arg.name] = arg;
            i++;
        });
    }
}