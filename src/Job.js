const RegisterObject = require("./RegisterObject");

class Job extends RegisterObject {
    constructor (id, job) {
        super(id);
        this.displayName = job.displayName;
        this.min = job.min;
        this.max = job.max;
    }
}

module.exports = Job;
