const Register = require('./Register');

module.exports = class Registry {
    static registers = {};

    static setRegister() {
        Object.keys(arguments).forEach(id => {
            let arg = arguments[id];
            // if (!(arg instanceof Register)) return;
            this.registers[arg.name] = arg;
        });
    }

    /**
     * 
     * @param {string} regname Register name
     * @returns Register
     */
    static getRegister(regname) {
        return this.registers[regname];
    }
}