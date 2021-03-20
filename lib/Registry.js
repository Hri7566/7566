const Register = require('./Register');

module.exports = class Registry {
    static registers = {};

    static addData() {
        Object.keys(arguments).forEach(arg => {
            if (!(arg instanceof Register)) return;
            this.registers[arg.name] = arg;
        });
    }
}