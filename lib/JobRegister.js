const Register = require('./Register');
const RegistryTypes = require('./RegistryTypes');

module.exports = class JobRegister extends Register {
    constructor (data) {
        super('job', data, RegistryTypes.JOB);
    }
}