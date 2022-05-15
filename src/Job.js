const jobList = require('./jobs');
const { Database } = require('./Database');

class Job {
    static getJobList(id) {
        return jobList;
    }

    static changeJob(p, job) {
        
    }
}

module.exports = Job;
